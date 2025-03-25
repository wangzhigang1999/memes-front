import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from '../../environments/environment'
import { MediaContent } from '../model/media-content'

@Injectable({
  providedIn: 'root',
})
export class SubmissionService {
  private http: HttpClient
  private readonly host: string

  constructor(http: HttpClient) {
    this.http = http
    this.host = environment.host
  }

  /**
   * feedback for a submission
   * @param id
   * @param feedback like or dislike
   */
  feedback(id: string, feedback: string): Observable<any> {
    let like = feedback == 'like'
    let url = this.host + `/api/submission/${id}/feedback/${like}`
    return this.http.post(url, null)
  }

  /**
   * upload a file
   * @param tempFile the file to be uploaded
   * @param mime the mime type of the file
   */
  uploadFile(tempFile: File, mime: string): Observable<any> {
    let url = this.host + '/api/media'
    let formData = new FormData()
    formData.append('file', tempFile)
    formData.append('mime', mime)
    return this.http.post(url, formData)
  }

  /**
   * upload a bilibili video
   * @param text the text of the bilibili video
   */
  uploadBilibili(text: string) {
    let url = this.host + '/api/media'
    let formData = new FormData()
    formData.append('text', text)
    formData.append('mime', 'text/bilibili')
    return this.http.post(url, formData)
  }

  uploadMarkdown(text: string) {
    let url = this.host + '/api/media'
    let formData = new FormData()
    formData.append('text', text)
    formData.append('mime', 'text/markdown')
    return this.http.post(url, formData)
  }

  listSubmissions(lastId: number = -1, pageSize: number = 18, date: string = ''): Observable<any> {
    let url = this.host + `/api/submission?lastId=${lastId}&pageSize=${pageSize}&date=${date}`
    return this.http.get(url)
  }

  /**
   * 获取置顶
   */
  listPinned(): Observable<any> {
    let url = this.host + `/api/submission/pinned`
    return this.http.get(url)
  }

  getMediaById(id: number): Observable<MediaContent> {
    let url = this.host + `/api/media/${id}`
    return this.http.get<MediaContent>(url)
  }
}
