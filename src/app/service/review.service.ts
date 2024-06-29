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
  loadWaitingList() {
    let url = this.host + '/admin/review';
    return this.http.get(url);
  }


  review(id: string, operation: string) {
    let url = this.host + `/admin/review/${operation}/${id}`;
    return this.http.post(url, null);
  }

  batchReview(id: string[], operation: string): Observable<any> {
    let url = this.host + `/admin/review/batch/${operation}`;
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post(url, id, {headers: headers});
  }

  /**
   * 统计信息
   */
  getStatusNum(status: string): Observable<any> {
    let url = this.host + `/admin/review/statistic/${status}`;
    return this.http.get(url);
  }
}
