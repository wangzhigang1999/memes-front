import {Component} from '@angular/core';
import {Page} from "../../model/page";
import {Submission} from "../../model/submission";
import {SubmissionService} from "../../service/submission.service";

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

  constructor(private submissionService: SubmissionService) {
  }

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.submissionService.getPage(this.lastId, this.pageNum, this.pageSize).subscribe(
      (data: any) => {
        const page: Page<Submission> = data.data
        this.submissions = page.list
        this.pageNum = page.pageNum
        this.pageSize = page.pageSize
        this.total = page.total

        this.submissions.forEach(
          (submission: Submission) => {
            this.curElement.add(submission.id)
          }
        )
        // get lastId
        if (this.submissions.length > 0) {
          this.lastId = this.submissions[this.submissions.length - 1].id
        }
      })

  }

  onScroll() {
    if (this.submissions.length >= this.total) {
      return
    }
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
      }
    )
  }
}


