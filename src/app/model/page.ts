export interface Page<T> {
  pageSize: number;
  list: T[];

  constructor(pageSize: number, list: T[]): Page<T>
}
