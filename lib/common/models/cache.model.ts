export type CacheStoreEntity<V = unknown, T = string> = {
  key: string;
  value: V;
  type?: T;
  evictAt?: number;
  cachedAt: number;
  accessedAt?: number;
};

export type CacheStore<V = unknown, T = string> = {
  get(key: string): CacheStoreEntity<V, T> | Promise<CacheStoreEntity<V, T>> | undefined;
  set(key: string, value: CacheStoreEntity<V, T>): CacheStore<V, T> | Promise<CacheStore<V, T>>;
  delete(key: string): boolean | Promise<boolean>;
  clear(regex?: string): void | Promise<void>;
  entries?(): IterableIterator<[string, CacheStoreEntity<V, T>]>;
  values?(): IterableIterator<CacheStoreEntity<V, T>>;
  keys?(): IterableIterator<string>;
  /** the duration in milliseconds after which the cache will be cleared */
  retention?: number;
  /** if true, the cache will be deleted if an error occurs */
  evictOnError?: boolean;
};
