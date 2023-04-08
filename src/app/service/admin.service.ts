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
    let url = this.host + `/admin/release`;
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
   * 获取bot状态
   */
  getBotStatus(): Observable<any> {
    let url = this.host + `/admin/bot/status`;
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
}
