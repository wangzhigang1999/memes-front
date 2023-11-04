import {Component} from '@angular/core';
import {TopTenService} from "../service/top-ten.service";
import {Response} from "../model/response";
import {Post} from "../model/post";

@Component({
    selector: 'app-bbs-topten',
    templateUrl: './bbs-topten.component.html',
    styleUrls: ['./bbs-topten.component.css']
})
export class BbsToptenComponent {

    posts: Post[] = [];

    constructor(private svc: TopTenService) {
        this.svc.getTopTen().subscribe(
            (data: Response) => {
                this.posts = data.data.topTen;
            }
        )
    }

}
