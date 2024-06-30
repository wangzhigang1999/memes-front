import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ImageGroupService {
  private http: HttpClient;
  private readonly host: string;

  constructor(http: HttpClient) {
    this.http = http;
    this.host = environment.host
  }

  public createImageGroup(submissionIds: string[]) {
    let url = this.host + `/admin/submission/group`;
    // put
    return this.http.put(url, submissionIds);
  }

  // add to group
  public addImageToGroup(imageGroupId: string, submissionIds: string[]) {
    let url = this.host + `/admin/submission/group/${imageGroupId}`;
    // put
    return this.http.post(url, submissionIds);
  }

}
