import {Component} from '@angular/core';
import {Page} from "../../model/page";
import {Submission} from "../../model/submission";
import {SubmissionService} from "../../service/submission.service";
import {authorized} from "../../utils";

@Component({
    selector: 'app-endless',
    templateUrl: './endless.component.html',
    styleUrls: ['./endless.component.css']
})
export class EndlessComponent {

    public submissions: Submission[] = [];

    curElement: Set<string> = new Set<string>();
    pageSize: number = 6;
    pageNum: number = 1;

    total: number = 0;
    lastId = "";

    adminMode = false;

    requesting = false

    default: { submissionType: string; url: string } = {
        url: "assets/brick.jpeg",
        submissionType: "IMAGE",
    }


    constructor(private submissionService: SubmissionService) {
        this.init()
        if (authorized()) {
            this.adminMode = true
        }
    }

    init() {
        let cache = localStorage.getItem("firstPage")
        if (cache) {
            let data = JSON.parse(cache)
            let now = new Date().getMilliseconds()
            // cache for 1 minute
            if (now - data.timestamp < 1000 * 60) {
                let cachePage = data.page
                this.submissions = cachePage.list
                this.pageNum = cachePage.pageNum
                this.pageSize = cachePage.pageSize
                this.total = cachePage.total
                this.submissions.forEach((submission: Submission) => this.curElement.add(submission.id))
                if (this.submissions.length > 0) {
                    this.lastId = this.submissions[this.submissions.length - 1].id
                }
                return
            }
        }


        this.requesting = true
        this.submissionService.getPage(this.lastId, this.pageNum, this.pageSize).subscribe(
            (data: any) => {
                const page: Page<Submission> = data.data
                this.submissions = page.list
                this.pageNum = page.pageNum
                this.pageSize = page.pageSize
                this.total = page.total

                this.submissions.forEach((submission: Submission) => this.curElement.add(submission.id))
                // get lastId
                if (this.submissions.length > 0) {
                    this.lastId = this.submissions[this.submissions.length - 1].id
                }
                this.requesting = false

                if (page.list.length > 0) {
                    // cache it for offline use, key is timestamp
                    let now = new Date().getMilliseconds()
                    localStorage.setItem("firstPage", JSON.stringify({timestamp: now, page: page}))
                }
            })

    }

    onScroll() {
        if (this.submissions.length >= this.total || this.requesting) {
            return
        }
        this.requesting = true
        this.submissionService.getPage(this.lastId, this.pageNum + 1, this.pageSize).subscribe(
            (data: any) => {
                const page: Page<Submission> = data.data
                page.list.forEach(
                    (submission: Submission) => {
                        if (!this.curElement.has(submission.id)) {
                            this.submissions.push(submission)
                            this.curElement.add(submission.id)
                        }
                    }
                )
                this.pageNum = page.pageNum
                this.lastId = this.submissions[this.submissions.length - 1].id
                this.requesting = false
            }
        )
    }

}


