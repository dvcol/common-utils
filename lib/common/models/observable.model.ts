export type Observer<T> = (next: T, prev?: T) => void;
export type UpdateFunction<T> = (state: T) => T;
export type Updater<T> = T | UpdateFunction<T>;
