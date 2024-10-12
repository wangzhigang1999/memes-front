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
   * feedback for a submission
   * @param id
   * @param feedback like or dislike
   */
  feedback(id: string, feedback: string): Observable<any> {
    let url = this.host + `/submission/feedback/${id}/${feedback}`;
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


  listSubmissions(lastId: string = "", pageSize: number = 18, date: string = ""): Observable<any> {
    let url = this.host + `/submission?lastID=${lastId}&pageSize=${pageSize}&date=${date}`;
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
}
