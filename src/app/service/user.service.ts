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

  getTodaySubmissions(): Observable<any> {
    // get today YYYY-MM-DD
    let today = new Date().toISOString().slice(0, 10);
    let url = this.host + '/submission/' + today
    return this.http.get(url);
  }

  vote(name: string, up: boolean): Observable<any> {
    let url = this.host + `/submission/vote/${name}/${up}`;
    return this.http.post(url, null);
  }
}