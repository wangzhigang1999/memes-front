import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {Document} from "../model/document";
import {authorized} from "../utils";

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


  listDocsByPage(lastId: string, pageNum: number, pageSize: number) {
    let url = this.host + `/doc/page?lastID=${lastId}&pageSize=${pageSize}&pageNum=${pageNum}`;
    if (authorized()) {
      url = this.host + `/admin/doc/page?lastID=${lastId}&pageSize=${pageSize}&pageNum=${pageNum}`;
    }
    return this.http.get(url);
  }

  getById(id: string): Observable<any> {
    let url = this.host + `/doc/${id}`;
    // @ts-ignore
    return this.http.get(url);
  }

  createDoc(doc: Document) {
    let url = this.host + '/admin/doc/create';
    return this.http.post(url, doc);
  }

  upsertDoc(doc: Document) {
    if (doc.id == undefined) {
      return this.createDoc(doc)
    }
    let url = this.host + '/admin/doc/update';
    return this.http.post(url, doc);
  }

  deleteDoc(id: string) {
    let url = this.host + `/admin/doc/delete`;
    // form data
    let formData = new FormData();
    formData.append("docID", id);
    return this.http.post(url, formData);
  }

  markPrivate(id: string, isPrivate: boolean) {
    let url = this.host + `/admin/doc/private`;
    // form data
    let formData = new FormData();
    formData.append("docID", id);
    formData.append("isPrivate", isPrivate ? "true" : "false");
    return this.http.post(url, formData);
  }

}
