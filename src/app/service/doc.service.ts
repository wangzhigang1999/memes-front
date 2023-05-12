import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {Document} from "../model/document";

@Injectable({
  providedIn: 'root'
})
export class DocService {

  private http: HttpClient;
  private readonly host: string;

  constructor(http: HttpClient) {
    this.http = http;
    this.host = environment.host
  }

  listDocs() {
    let url = this.host + '/doc';
    return this.http.get(url);
  }

  getById(id: string): Observable<any> {
    let url = this.host + `/doc/${id}`;
    // @ts-ignore
    return this.http.get(url);
  }

  createDoc(doc: Document) {
    let url = this.host + '/doc/create';
    return this.http.post(url, doc);
  }

  upsertDoc(doc: Document) {
    if (doc.id == undefined) {
      return this.createDoc(doc)
    }
    let url = this.host + '/doc/update';
    return this.http.post(url, doc);
  }
}
