export interface Page<T> {
  pageNum: number;
  pageSize: number;
  total: number;
  pages: number;
  list: T[];

  constructor(pageNum: number, pageSize: number, total: number, pages: number, list: T[]): Page<T>
}
