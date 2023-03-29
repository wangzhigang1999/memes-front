import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class UserService {


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
    let today = new Date().toLocaleDateString('zh-CN', {timeZone: 'Asia/Shanghai'})
    // if the day month year is 1,2,3,4,5,6,7,8,9,0,then add 0 before it
    let todayArray = today.split('/')
    for (let i = 0; i < todayArray.length; i++) {
      if (todayArray[i].length == 1) {
        todayArray[i] = '0' + todayArray[i]
      }
    }
    today = todayArray.join('-')
    let url = this.host + '/submission/' + today
    return this.http.get(url);
  }

  /**
   * get submissions by date
   * @param date YYYY-MM-DD
   */
  getSubmission(date: string): Observable<any> {
    let url = this.host + '/submission/' + date
    return this.http.get(url);
  }

  /**
   * vote for a submission
   * @param hash the identifier of the submission
   * @param up true for upvote, false for downvote
   */
  vote(hash: number, up: boolean): Observable<any> {
    let url = this.host + `/submission/vote/${hash}/${up}`;
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
   * @param uri the uri of the bilibili video
   */
  uploadBilibili(uri: string) {
    let url = this.host + '/submission';
    let formData = new FormData();
    formData.append('uri', uri);
    formData.append('mime', "text/bilibili");
    return this.http.post(url, formData);
  }

  /**
   * get the history of submissions, [YYYY-MM-DD, YYYY-MM-DD, ...]
   */
  getHistory() {
    let url = this.host + '/submission/history';
    return this.http.get(url);
  }

}
