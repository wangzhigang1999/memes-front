import {HttpClient} from "@angular/common/http";
import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class SubmissionService {


  private http: HttpClient;
  private readonly host: string;

  constructor(http: HttpClient) {
    this.http = http;
    this.host = environment.host
  }

  /**
   * get today's submissions
   */
  getTodaySubmissions(): Observable<any> {
    // get today YYYY-MM-DD with timezone shanghai
    let today = new Date().toLocaleDateString('zh-CN', { timeZone: 'Asia/Shanghai' })
    // if the day month year is 1,2,3,4,5,6,7,8,9,0,then add 0 before it
    let todayArray = today.split('/')
    for (let i = 0; i < todayArray.length; i++) {
      if (todayArray[i].length == 1) {
        todayArray[i] = '0' + todayArray[i]
      }
    }
    today = todayArray.join('-')
    let url = this.host + '/submission/date/' + today
    return this.http.get(url);
  }

  /**
   * get submissions by date
   * @param date YYYY-MM-DD
   */
  getSubmissionByDate(date: string): Observable<any> {
    let url = this.host + '/submission/date/' + date
    return this.http.get(url);
  }

  /**
   * vote for a submission
   * @param id
   * @param up true for like, false for dislike
   */
  vote(id: string, up: boolean): Observable<any> {
    let url: string;

    if (up) {
      url = this.host + `/submission/${id}/like`;
    } else {
      url = this.host + `/submission/${id}/dislike`;
    }
    return this.http.post(url, null);
  }

  /**
   * upload a file
   * @param tempFile the file to be uploaded
   * @param mime the mime type of the file
   */
  uploadFile(tempFile: File, mime: string): Observable<any> {
    let url = this.host + '/submission';
    let formData = new FormData();
    formData.append('file', tempFile);
    formData.append('mime', mime);
    return this.http.post(url, formData);
  }

  /**
   * upload a bilibili video
   * @param text the text of the bilibili video
   */
  uploadBilibili(text: string) {
    let url = this.host + '/submission';
    let formData = new FormData();
    formData.append('text', text);
    formData.append('mime', "text/bilibili");
    return this.http.post(url, formData);
  }

  uploadMarkdown(text: string) {
    let url = this.host + '/submission';
    let formData = new FormData();
    formData.append('text', text);
    formData.append('mime', "text/markdown");
    return this.http.post(url, formData);
  }


  getPage(lastId: string, pageSize: number) {
    let url = this.host + `/submission/page?lastID=${lastId}&pageSize=${pageSize}`;
    return this.http.get(url);
  }

  /**
   * 获取置顶
   */
  getTop(): Observable<any> {
    let url = this.host + `/submission/top`;
    return this.http.get(url);
  }

  getById(id: string): Observable<any> {
    let url = this.host + `/submission/id/${id}`;
    return this.http.get(url);
  }


  getSimilar(id: string, topK: number): Observable<any> {
    let url = this.host + `/submission/similar/${id}?size=${topK}`;
    return this.http.get(url);
  }

  deleteById(id: string) {
    let url = this.host + `/submission/${id}`;
    return this.http.delete(url);
  }
}
