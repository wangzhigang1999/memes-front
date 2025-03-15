import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { Observable } from 'rxjs'
import { ContentStatus, MediaContent } from '../model/media-content'

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private http: HttpClient
  private readonly host: string

  constructor(http: HttpClient) {
    this.http = http
    this.host = environment.host
  }

  /**
   * 获取今日提交
   */
  loadWaitingList(): Observable<MediaContent> {
    let url = this.host + '/api/media/status/PENDING'
    return this.http.get<MediaContent>(url)
  }

  review(id: number, operation: ContentStatus) {
    let url = this.host + `/api/media/${id}/status/${operation}`
    return this.http.post(url, null)
  }

  batchReview(ids: number[], operation: ContentStatus): Observable<any> {
    const url = `${this.host}/api/media/batch/status/${operation}`

    // 设置 HTTP 请求头
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
    // 发送 POST 请求
    return this.http.post(url, ids, { headers })
  }
}
