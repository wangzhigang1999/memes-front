import {Component, HostListener, Input} from '@angular/core';
import {Submission} from "../../model/submission";

@Component({
  selector: 'app-single-page-slide',
  templateUrl: './single-page-slide.component.html',
  styleUrls: ['./single-page-slide.component.css']
})
export class SinglePageSlideComponent {

  @HostListener('window:keydown', ['$event']) handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      this.toPre()
    } else if (event.key === 'ArrowRight') {
      this.toNext()
    }
  }


  @Input() showVoteBar = false
  private _submissions: Submission[] = []

  @Input()
  get submissions(): Submission[] {
    return this._submissions;
  }

  set submissions(submissions: Submission[]) {
    this._submissions = submissions;
    // 初始化
    if (this.submissions.length > 0) {
      this.cur = this.submissions[0]
      this.pre = this.default
      if (this.submissions.length > 1) {
        this.next = this.submissions[1]
      } else {
        this.next = this.default
      }
      this.currentIndex = 0
    }
  }

  default: { submissionType: string; url: string } = {
    url: "assets/brick.jpeg",
    submissionType: "IMAGE",
  }

  pre: any = this.default
  cur: any = this.default
  next: any = this.default
  currentIndex = 0

  toPre() {
    if (this.currentIndex <= 0) {
      return
    }
    this.currentIndex--
    this.next = this.cur
    this.cur = this.pre

    if (this.currentIndex == 0) {
      this.pre = this.default
    } else {
      this.pre = this.submissions[this.currentIndex - 1]
    }
  }

  toNext() {
    // 当前的索引已经超过了总数，直接返回
    if (this.currentIndex >= this.submissions.length) {
      return
    }
    this.currentIndex++
    this.pre = this.cur
    this.cur = this.next
    // 当前的索引已经是最后一个了，下一个就是默认的
    if (this.currentIndex == this.submissions.length - 1) {
      this.next = this.default
    } else {
      this.next = this.submissions[this.currentIndex + 1]
    }
  }
}
