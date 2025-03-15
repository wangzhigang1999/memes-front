import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private http: HttpClient
  private readonly host: string

  constructor(http: HttpClient) {
    this.http = http
    this.host = environment.host
  }

  /**
   * 获取统计信息
   */
  getVisitStatistics(): Observable<any> {
    let url = this.host + `/api/admin/visit/statistic`
    return this.http.get(url)
  }

  /**
   * 设置置顶
   */
  pin(id: string): Observable<any> {
    let url = this.host + `/api/submission/${id}/pin`
    return this.http.post(url, null)
  }

  /**
   * 取消置顶
   */
  unpin(id: string): Observable<any> {
    let url = this.host + `/api/submission/${id}/pin`
    return this.http.delete(url)
  }

  /**
   * 验证 token
   */
  verifyToken(token: string): Observable<any> {
    console.log(token)
    let url = this.host + `/api/admin/validate`
    return this.http.get(url)
  }

  listConfig(): Observable<any> {
    let url = this.host + `/api/config`
    return this.http.get(url)
  }

  setConfig(id: number | undefined, value: string): Observable<any> {
    let url = this.host + `/api/config/${id}/${value}`
    return this.http.post(url, null)
  }

  getReviewStatistics(): Observable<any> {
    let url = this.host + `/api/admin/review/statistic`
    return this.http.get(url)
  }
}
