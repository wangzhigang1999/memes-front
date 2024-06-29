import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private http: HttpClient;
  private readonly host: string;

  constructor(http: HttpClient) {
    this.http = http;
    this.host = environment.host
  }

  listNews(lastId: string, pageSize: number, date: string = "", title: string = "", introduction: string = "", content: string = "", author: string = ""): Observable<any> {
    let url = this.host + `/news?lastID=${lastId}&pageSize=${pageSize}&date=${date}&title=${title}&introduction=${introduction}&content=${content}&author=${author}`;
    return this.http.get(url);
  }

  getMMDD(month: string, day: string) {
    // ensure month and day are two digits
    month = month.padStart(2, '0');
    day = day.padStart(2, '0');
    let url = this.host + `/news/month/${month}/day/${day}`;
    return this.http.get(url);
  }

  getByID(id: string): Observable<any> {
    let url = this.host + `/new/id/${id}`;
    return this.http.get(url);
  }
}
