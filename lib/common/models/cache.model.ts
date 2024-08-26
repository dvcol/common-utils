import type { SyncOrAsync } from '~/common';

export type CacheStoreEntity<V = unknown, T = string> = {
  key: string;
  value: V;
  type?: T;
  evictAt?: number;
  cachedAt: number;
  accessedAt?: number;
};

export type CacheStore<V = unknown, T = string> = {
  get(key: string): SyncOrAsync<CacheStoreEntity<V, T> | undefined>;
  set(key: string, value: CacheStoreEntity<V, T>): SyncOrAsync<CacheStore<V, T>>;
  delete(key: string): SyncOrAsync<boolean>;
  clear(regex?: string): SyncOrAsync<void>;
  entries?(): SyncOrAsync<IterableIterator<[string, CacheStoreEntity<V, T>]>>;
  values?(): SyncOrAsync<IterableIterator<CacheStoreEntity<V, T>>>;
  keys?(): SyncOrAsync<IterableIterator<string>>;
  /** the duration in milliseconds after which the cache will be cleared */
  retention?: number;
  /** if true, the cache will be deleted if an error occurs */
  evictOnError?: boolean;
  /** if true, the access time will be updated on every access */
  saveAccess?: boolean;
  /** if true, the eviction date will be persisted on cache write */
  saveRetention?: boolean;
};
