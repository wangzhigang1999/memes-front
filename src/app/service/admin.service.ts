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
    let url = this.host + `/admin/bot/status/disable`;
    return this.http.post(url, null);
  }

  /**
   * enable bot
   */
  enableBot(): Observable<any> {
    let url = this.host + `/admin/bot/status/enable`;
    return this.http.post(url, null);
  }


  /**
   * 设置置顶
   */
  setTop(id: string): Observable<any> {
    let url = this.host + `/admin/submission/top/${id}`;
    return this.http.post(url, null);
  }

  /**
   * 取消置顶
   */
  cancelTop(id: string): Observable<any> {
    let url = this.host + `/admin/submission/top/${id}`;
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


  setMinSubmission(min: number): Observable<any> {
    let url = this.host + `/admin/submission/minimum/${min}`;
    return this.http.post(url, null);
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
}
