import {Component, Input} from '@angular/core';
import {SubmissionService} from "../service/submission.service";

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VoteComponent {
  upBtn = false;
  downBtn = false;
  loveBtn = false;

  @Input() hash: any
  @Input() name: any
  @Input() up: any
  @Input() down: any

  activeBtn = "btn-outline btn-success btn-square"
  deactiveBtn = "btn-circle btn-ghost"

  constructor(private service: SubmissionService) {

  }

  upClass() {
    return this.upBtn ? this.activeBtn : this.deactiveBtn;
  }

  downClass() {
    return this.downBtn ? this.activeBtn : this.deactiveBtn;
  }

  loveClass() {
    return !this.loveBtn ? this.deactiveBtn : this.activeBtn;
  }


  vote(hash: number, isUpvote: boolean) {
    this.upBtn = isUpvote;
    this.downBtn = !isUpvote;
    this.loveBtn = false
    this.service.vote(hash, isUpvote).subscribe(() => {
      if (isUpvote) {
        this.up = this.up + 1;
      } else {
        this.down = this.down + 1;
      }
    })
  }

  love(hash: any) {
    this.loveBtn = true
    this.upBtn = false
    this.downBtn = false

    this.service.vote(hash, true).subscribe(() => {
        this.up = this.up + 1;
      }
    )
  }
}
