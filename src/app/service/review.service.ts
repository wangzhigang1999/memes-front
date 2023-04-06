import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private http: HttpClient;
  private readonly host: string;

  constructor(http: HttpClient) {
    this.http = http;
    this.host = environment.host
  }

  /**
   * 获取今日提交
   */
  listSubmissions() {
    let url = this.host + '/review';
    return this.http.get(url);
  }


  /**
   * 接受投稿
   * @param hashcode
   */
  accept(hashcode: number) {
    let url = this.host + `/review/accept/${hashcode}`;
    return this.http.post(url, null);
  }

  /**
   * 拒绝投稿
   * @param hashcode
   */
  reject(hashcode: number) {
    let url = this.host + `/review/reject/${hashcode}`;
    return this.http.post(url, null);
  }

  batchAccept(hashcode: number[]) {
    let url = this.host + `/review/accept/batch`;
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post(url, hashcode, {headers: headers});
  }

}
