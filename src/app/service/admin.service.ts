import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AdminService {


  private http: HttpClient;
  private readonly host: string;

  constructor(http: HttpClient) {
    this.http = http;
    this.host = environment.host
  }

  /**
   * 发布今日提交
   */
  release() {
    let url = this.host + `/admin/submission/release`;
    return this.http.post(url, null);
  }

  /**
   * 获取统计信息
   */
  getStatistics(): Observable<any> {
    let url = this.host + `/admin/statistic`;
    return this.http.get(url);
  }


  /**
   * disable bot
   */
  disableBot(): Observable<any> {
    let url = this.host + `/admin/bot/disable`;
    return this.http.post(url, null);
  }

  /**
   * enable bot
   */
  enableBot(): Observable<any> {
    let url = this.host + `/admin/bot/enable`;
    return this.http.post(url, null);
  }


  /**
   * 设置置顶
   */
  setTop(hash: number): Observable<any> {
    let url = this.host + `/admin/submission/top/${hash}`;
    return this.http.post(url, null);
  }

  /**
   * 取消置顶
   */
  cancelTop(hash: number): Observable<any> {
    let url = this.host + `/admin/submission/top/${hash}`;
    return this.http.delete(url);
  }

  /**
   * 验证token
   */
  verifyToken(token: string): Observable<any> {
    console.log(token)
    let url = this.host + `/admin/verify`;
    return this.http.get(url);
  }


  setReleaseStrategy(strategy: string): Observable<any> {
    let url = this.host + `/admin/release/strategy`;
    // send with form data
    let data = new FormData();
    data.append("strategy", strategy);
    return this.http.post(url, data);
  }


  setMinSubmission(min: number): Observable<any> {
    let url = this.host + `/admin/submission/min`;
    // send with form data
    let data = new FormData();
    data.append("min", min.toString());
    return this.http.post(url, data);
  }

  setMaxHistory(maxHistory: number) {
    let url = this.host + `/admin/history/max`;
    // send with form data
    let data = new FormData();
    data.append("max", maxHistory.toString());
    return this.http.post(url, data);
  }


  triggerCrawler(msPAT: string): Observable<any> {
    let url = "https://dev.azure.com/wangzhigang1999-live/HelloWorld/_apis/pipelines/38/runs?api-version=6.1-preview.1"
    let headers = {
      'Authorization': 'Basic ' + msPAT,
      'Content-Type': 'application/json'
    }
    return this.http.post(url, {}, {headers: headers})
  }

  getSys(): Observable<any> {
    let url = this.host + `/admin/sys`;
    return this.http.get(url);
  }

  sendNotification(msg: string) {
    let url = this.host + `/admin/notification`;
    let data = new FormData();
    data.append("notification", msg);
    return this.http.post(url, data);
  }
}
