import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

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
   * 获取今日提交
   */
  review() {
    let url = this.host + '/submission/review';
    return this.http.get(url);
  }

  /**
   * 删除提交
   * @param hash identifier
   */
  delete(hash: number) {
    let url = this.host + `/submission/${hash}`;
    return this.http.delete(url);
  }

  /**
   * 发布今日提交
   */
  release() {
    let url = this.host + `/submission/release`;
    return this.http.post(url, null);
  }
}
