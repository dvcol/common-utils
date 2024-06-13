export const getUUID = () => crypto.getRandomValues(new Uint32Array(4)).join('-');

/**
 * Represents a cancellable promise with a cancellation function.
 *
 * @template T - The type of the promise result.
 */
export class CancellablePromise<T> extends Promise<T> {
  private readonly _controller = new AbortController();
  private readonly _debug: boolean = false;
  readonly id = `cancellable-promise-${getUUID()}`;

  /**
   * Gets the AbortSignal associated with the AbortController, allowing external code to listen for cancellation events.
   *
   * @type {AbortSignal}
   * @memberof CancellableFetch
   */
  get signal() {
    return this._controller.signal;
  }

  /**
   * Sets the AbortSignal associated with the AbortController, allowing external code to listen for cancellation events.
   * @param signal - The AbortSignal to associate with the AbortController.
   *
   * @memberof CancellableFetch
   */
  set signal(signal: AbortSignal) {
    this._controller.signal.onabort = signal.onabort;
  }

  /**
   * Cancels the currently active fetch request by aborting the associated AbortController.
   *
   * @param {unknown} [reason] - An optional reason for aborting the fetch request.
   * @memberof CancellableFetch
   */
  cancel(reason?: unknown) {
    if (this.signal.aborted) return;
    if (this._debug) console.error('Promise was cancelled.', { id: this.id });
    this._controller.abort(reason);
  }

  then<TResult1 = T, TResult2 = never>(...params: Parameters<Promise<T>['then']>): CancellablePromise<TResult1 | TResult2> {
    const promise = super.then(...params) as CancellablePromise<TResult1 | TResult2>;
    promise.cancel = this.cancel.bind(this);
    promise.signal = this.signal;
    return promise;
  }

  catch<TResult = never>(onRejected?: ((reason: any) => PromiseLike<TResult> | TResult) | undefined | null): CancellablePromise<T | TResult> {
    const promise = super.catch(onRejected) as CancellablePromise<T | TResult>;
    promise.cancel = this.cancel.bind(this);
    promise.signal = this.signal;
    return promise;
  }

  finally(onFinally?: (() => void) | undefined | null): CancellablePromise<T> {
    const promise = super.finally(onFinally) as CancellablePromise<T>;
    promise.cancel = this.cancel.bind(this);
    promise.signal = this.signal;
    return promise;
  }

  static isCancellable<T>(promise: Promise<T> | CancellablePromise<T>): promise is CancellablePromise<T> {
    return promise instanceof CancellablePromise || ('cancel' in promise && 'signal' in promise);
  }

  static resolve<T>(value?: T): CancellablePromise<void>;
  // eslint-disable-next-line no-dupe-class-members -- To allow method overloading
  static resolve<T>(value: T): CancellablePromise<Awaited<T>>;
  // eslint-disable-next-line no-dupe-class-members -- To allow method overloading
  static resolve<T>(value: T | PromiseLike<T>): CancellablePromise<Awaited<T>> {
    return CancellablePromise.from(Promise.resolve(value));
  }

  static from<T>(promise: Promise<T> | CancellablePromise<T>): CancellablePromise<T> {
    if (CancellablePromise.isCancellable(promise)) return promise;
    let _reject: (reason?: any) => void;
    const cancellablePromise = new CancellablePromise<T>((resolve, reject) => {
      _reject = reject;
      promise.then(resolve).catch(reject);
    });
    const onAbort = () => _reject(new DOMException('The operation was aborted.', 'AbortError'));
    cancellablePromise.signal.addEventListener('abort', onAbort);
    return cancellablePromise;
  }
}

/**
 * A wrapper class for making cancellable fetch requests using the Fetch API.
 *
 * @class CancellableFetch
 */
export class CancellableFetch {
  private readonly _controller = new AbortController();
  private readonly _debug: boolean;
  readonly id = `cancellable-promise-${getUUID()}`;

  /**
   * Gets the AbortSignal associated with the AbortController, allowing external code to listen for cancellation events.
   *
   * @readonly
   * @type {AbortSignal}
   * @memberof CancellableFetch
   */
  get signal() {
    return this._controller.signal;
  }

  /**
   * Creates an instance of CancellableFetch.
   *
   * @param {boolean} [debug=false] - Indicates whether debug information should be logged when a fetch request is cancelled.
   * @memberof CancellableFetch
   */
  constructor(debug: boolean = false) {
    this._debug = debug;
  }

  /**
   * Performs a fetch request with optional cancellation support.
   *
   * @param {RequestInfo | URL} input - The resource URL or a Request object.
   * @param {Omit<RequestInit, 'signal'>} [init] - Optional RequestInit options, excluding the 'signal' property.
   * @returns {Promise<Response>} A Promise that resolves to the Response to that request.
   * @memberof CancellableFetch
   * @throws {Error} If an error occurs during the fetch operation, other than an 'AbortError'.
   */
  async fetch(input: RequestInfo | URL, init?: Omit<RequestInit, 'signal'>): Promise<Response> {
    try {
      return await fetch(input, { ...init, signal: this._controller.signal });
    } catch (error) {
      if (error instanceof Error && error?.name === 'AbortError') {
        if (this._debug) console.debug('Fetch request was cancelled.', { input, init, error });
        return Promise.reject(error);
      }
      throw error;
    }
  }

  /**
   * Performs a fetch request using a new instance of CancellableFetch.
   *
   * @static
   * @template T - The type of the promise result.
   * @param {RequestInfo | URL} input - The resource URL or a Request object.
   * @param {Omit<RequestInit, 'signal'>} [init] - Optional RequestInit options, excluding the 'signal' property.
   * @returns {CancellablePromise<T>} A cancellable promise that resolves to the Response to the fetch request.
   * @memberof CancellableFetch
   */
  static fetch<T extends Response = Response>(input: RequestInfo | URL, init?: Omit<RequestInit, 'signal'>): CancellablePromise<T> {
    const cancellableFetch = new CancellableFetch();
    const promise = cancellableFetch.fetch(input, init) as CancellablePromise<T>;

    const attributes = ['id', 'signal'];
    const bindAttributes = (_promise: CancellablePromise<T>) => {
      attributes.forEach(prop => {
        if (prop in _promise) return;
        Object.defineProperty(_promise, prop, { get: () => cancellableFetch[prop] });
      });
    };

    const methods = ['then', 'catch', 'finally'];
    const bindMethods = (_promise: CancellablePromise<T>) => {
      methods.forEach(method => {
        const _method = _promise[method];
        _promise[method] = (...params: unknown[]) => {
          const methodPromise = _method.bind(_promise)(...params);

          if (CancellablePromise.isCancellable(methodPromise)) return methodPromise;

          bindAttributes(methodPromise);
          bindMethods(methodPromise);
          methodPromise.cancel = (...args: unknown[]) => cancellableFetch.cancel(...args);

          return methodPromise;
        };
      });
    };

    bindAttributes(promise);
    bindMethods(promise);
    promise.cancel = (...args: unknown[]) => cancellableFetch.cancel(...args);

    return promise;
  }

  /**
   * Cancels the currently active fetch request by aborting the associated AbortController.
   *
   * @param {unknown} [reason] - An optional reason for aborting the fetch request.
   *
   * @memberof CancellableFetch
   */
  cancel(reason?: unknown) {
    if (this.signal.aborted) return;
    if (this._debug) console.debug('Fetch request was cancelled.', { id: this.id, reason });
    this._controller.abort(reason);
  }
}
