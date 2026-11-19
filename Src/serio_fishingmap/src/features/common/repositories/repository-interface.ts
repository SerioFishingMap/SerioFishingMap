export type RepositoryBase<T, C, K> = {
  getAll(): Promise<T[]>;
  getById(key: K): Promise<T | null>;
  create(input: C): Promise<T>;
};
