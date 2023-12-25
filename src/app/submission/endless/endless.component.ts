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
    this.requesting = true
    this.submissionService.getPage(this.lastId, this.pageSize).subscribe(
      (data: any) => {
        const page: Page<Submission> = data.data
        this.submissions = page.list
        this.pageSize = page.pageSize


        this.submissions.forEach((submission: Submission) => this.curElement.add(submission.id))
        // get lastId
        if (this.submissions.length > 0) {
          this.lastId = this.submissions[this.submissions.length - 1].id
        }
        this.requesting = false

      })

  }

  onScroll() {
    if (this.requesting) {
      return
    }
    this.requesting = true
    this.submissionService.getPage(this.lastId, this.pageSize).subscribe(
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
        this.lastId = this.submissions[this.submissions.length - 1].id
        this.requesting = false
      }
    )
  }

}


