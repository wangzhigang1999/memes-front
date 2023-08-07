import {Component, HostListener} from '@angular/core';
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

  pre: any = this.default
  cur: any = this.default
  next: any = this.default
  currentIndex = -1


  // listen key event
  @HostListener('window:keydown', ['$event']) handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      this.toPre()
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      this.toNext()
    }
  }

  // listen mouse event
  @HostListener('window:wheel', ['$event']) handleMouseWheel(event: WheelEvent) {
    // if hotkey is pressed, do nothing
    if (event.ctrlKey || event.altKey || event.shiftKey) {
      return
    }

    if (event.deltaY > 0) {
      this.toNext()
    } else if (event.deltaY < 0) {
      this.toPre()
    }
  }

  constructor(private submissionService: SubmissionService) {
    this.init()
    if (authorized()) {
      this.adminMode = true
    }
  }

  init() {
    this.requesting = true
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
        this.requesting = false

        if (this.submissions.length > 0) {
          this.cur = this.submissions[0]

          if (this.submissions.length > 1) {
            this.next = this.submissions[1]
          } else {
            this.next = this.default
          }
          this.currentIndex = 0
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

  toPre() {
    if (this.currentIndex <= 0) {
      return
    }
    this.currentIndex -= 1
    this.next = this.cur
    this.cur = this.pre

    if (this.currentIndex == 0) {
      this.pre = this.default
    } else {
      this.pre = this.submissions[this.currentIndex - 1]
    }
  }

  toNext() {
    this.currentIndex += 1
    if (this.currentIndex >= this.submissions.length - 3) {
      this.onScroll()
    }

    this.pre = this.cur
    this.cur = this.next
    this.next = this.submissions[this.currentIndex + 1]
  }
}


