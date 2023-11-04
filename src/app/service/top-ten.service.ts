import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class TopTenService {

    private http: HttpClient;
    private readonly host: string;

    constructor(http: HttpClient) {
        this.http = http;
        this.host = environment.host
    }

    getTopTen(): Observable<any> {
        return this.http.get(this.host + "/topTen")
    }
}
