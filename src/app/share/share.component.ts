import {Component} from '@angular/core';
import {NewsService} from "../service/news.service";
import {ActivatedRoute} from "@angular/router";
import {SubmissionService} from "../service/submission.service";
import {Response} from "../model/response";

@Component({
    selector: 'app-share',
    templateUrl: './share.component.html',
    styleUrl: './share.component.css'
})
export class ShareComponent {

    mode: string = ""
    id: string = ""
    data: any

    constructor(private newsService: NewsService, private submissionService: SubmissionService, private router: ActivatedRoute) {
        this.router.params.subscribe(params => {
            this.mode = params['type'];
            this.id = params['id'];
            this.fetch(this.mode, this.id)
        });
    }

    fetch(mode: string, id: string) {
        if (mode == null || id == null || mode == "" || id == "") return
        switch (mode) {
            case "news":
                this.fetchNews(id);
                break
            case "meme":
                this.fetchMeme(id);
                break
            default:
                window.location.href = "/";
                break;
        }
    }

    fetchMeme(id: string) {
      this.submissionService.getById(id).subscribe((res: Response) => this.data = res.data)
    }

    fetchNews(id: string) {
        this.newsService.getByID(id).subscribe((res: Response) => this.data = res.data)
    }


}
