import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

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
    let url = this.host + '/admin/review';
    return this.http.get(url);
  }


  /**
   * 接受投稿
   * @param hashcode
   */
  accept(hashcode: number) {
    let url = this.host + `/admin/review/accept/${hashcode}`;
    return this.http.post(url, null);
  }

  /**
   * 拒绝投稿
   * @param hashcode
   */
  reject(hashcode: number) {
    let url = this.host + `/admin/review/reject/${hashcode}`;
    return this.http.post(url, null);
  }

  batchAccept(hashcode: number[]): Observable<any> {
    let url = this.host + `/admin/review/accept/batch`;
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post(url, hashcode, {headers: headers});
  }

  /**
   * 统计信息
   */
  statistics():Observable<any> {
    let url = this.host + '/admin/review/statistic';
    return this.http.get(url);
  }

}
