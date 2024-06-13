/**
 * Generate a logging timestamp
 * @param scope the logging scope, default to globalThis._proxyLoggerScope
 */
export const getTimestamp = (scope?: string) => (scope ? `[${new Date()?.toISOString()} - ${scope}]` : `[${new Date()?.toISOString()}]`);

export enum LogLevel {
  Error,
  Warn,
  Info,
  Debug,
}

export type ProxyLoggerFilter = Partial<Record<keyof Console, (logLevel: LogLevel, ...args: unknown[]) => boolean>>;

export const proxyLoggerFilter: ProxyLoggerFilter = {
  trace: (logLevel: LogLevel) => logLevel >= LogLevel.Debug,
  debug: (logLevel: LogLevel) => logLevel >= LogLevel.Debug,
  info: (logLevel: LogLevel) => logLevel >= LogLevel.Info,
  warn: (logLevel: LogLevel) => logLevel >= LogLevel.Warn,
  error: (logLevel: LogLevel) => logLevel >= LogLevel.Error,
} as const;

/**
 * Proxy logger to control this extension log level
 */
export class ProxyLogger {
  private readonly _logger: Console;
  private readonly _proxy?: ProxyLoggerFilter;

  private readonly _debug: boolean;
  private _logLevel: number;

  constructor({
    logger = console,
    debug = false,
    proxy = proxyLoggerFilter,
    logLevel = LogLevel.Warn,
  }: { proxy?: ProxyLoggerFilter; logger?: Console; debug?: boolean; logLevel?: number } = {}) {
    this._logger = logger;
    this._proxy = proxy;
    this._debug = debug;
    this._logLevel = logLevel;
  }

  get logLevel() {
    return this._logLevel;
  }

  set logLevel(level: LogLevel) {
    if (this._debug) console.debug('[ProxyLogger] - Log level changed:', LogLevel[level]);
    this._logLevel = level;
  }

  private null = (...args: unknown[]) => {
    if (this._debug) console.debug('[ProxyLogger] - Log suppressed:', ...args);
  };

  get trace() {
    if (!this._proxy?.trace?.(this._logLevel)) return this.null;
    return this._logger.trace.bind(this._logger);
  }

  get debug() {
    if (!this._proxy?.debug?.(this._logLevel)) return this.null;
    return this._logger.debug.bind(this._logger);
  }

  get info() {
    if (!this._proxy?.info?.(this._logLevel)) return this.null;
    return this._logger.info.bind(this._logger);
  }

  get warn() {
    if (!this._proxy?.warn?.(this._logLevel)) return this.null;
    return this._logger.warn.bind(this._logger);
  }

  get error() {
    if (!this._proxy?.error?.(this._logLevel)) return this.null;
    return this._logger.error.bind(this._logger);
  }

  static logger = new ProxyLogger();
  static time = getTimestamp;
}
