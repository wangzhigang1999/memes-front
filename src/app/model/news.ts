export interface News {
  id: string;
  timestamp: number;
  date: string;
  coverImage: string;
  title: string;

  introduction: string;
  content: string;
  sourceURL: string | null;
  author: string | null;
  tag: string[];
  like: number | 0;
  dislike: number | 0;

}
