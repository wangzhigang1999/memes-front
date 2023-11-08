import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private http: HttpClient;
  private readonly host: string;

  constructor(http: HttpClient) {
    this.http = http;
    this.host = environment.host
  }


  getByDate(date: string) {
    let url = this.host + `/news/date/${date}`;
    return this.http.get(url);
  }

  getByPage(lastId: string, pageNum: number, pageSize: number) {
    let url = this.host + `/news/page?lastID=${lastId}&pageSize=${pageSize}&pageNum=${pageNum}`;
    return this.http.get(url);
  }

  getByPageWithTag(lastId: string, pageNum: number, pageSize: number, tag: string) {
    if (tag == null || tag == "") {
      return this.getByPage(lastId, pageNum, pageSize);
    }
    let url = this.host + `/news/page?lastID=${lastId}&pageSize=${pageSize}&pageNum=${pageNum}&tag=${tag}`;
    return this.http.get(url);
  }

  getMMDD(date: string) {
    let url = this.host + `/news/mm-dd/${date}`;
    return this.http.get(url);
  }
}
