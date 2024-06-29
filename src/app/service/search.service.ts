import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

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

  listPost(pageSize: number, lastID: string = "", author: string = "", board: string = "", keyword: string = ""): Observable<any> {
    let url = this.host + `/post?pageSize=${pageSize}&author=${author}&board=${board}&keyword=${keyword}&lastID=${lastID}`;
    return this.http.get(url)
  }
}
