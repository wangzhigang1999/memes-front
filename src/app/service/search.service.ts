import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private http: HttpClient;
  private readonly host: string;

  constructor(http: HttpClient) {
    this.http = http;
    this.host = environment.host
  }

  getByAuthor(author: string): Observable<any> {
    let url = this.host + `/post/author/${author}`;
    return this.http.get(url);
  }

  getByBoard(board: string): Observable<any> {
    let url = this.host + `/post/board/${board}`;
    return this.http.get(url);
  }

  getByAuthorAndBoard(author: string, board: string): Observable<any> {
    let url = this.host + `/post/author/${author}/board/${board}`;
    return this.http.get(url);
  }

  getByKeyword(keyword: string): Observable<any> {
    let url = this.host + `/post/keyword/${keyword}`;
    return this.http.get(url);
  }

  getLatest(limit: number): Observable<any> {
    let url = this.host + `/post/latest/${limit}`;
    return this.http.get(url);
  }
}
