import {Component, Input} from '@angular/core';
import {SubmissionService} from "../../../service/submission.service";
import {AdminService} from "../../../service/admin.service";

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VoteComponent {
  upBtn = false;
  downBtn = false;
  loveBtn = false;


  @Input() adminMode = false

  @Input() id: any
  @Input() name: any
  @Input() up: any
  @Input() down: any

  activeBtn = "btn-outline btn-success btn-square"
  deactivateBtn = "btn-circle btn-ghost"

  constructor(private service: SubmissionService, private admin: AdminService) {

  }

  upClass() {
    return this.upBtn ? this.activeBtn : this.deactivateBtn;
  }

  downClass() {
    return this.downBtn ? this.activeBtn : this.deactivateBtn;
  }

  loveClass() {
    return !this.loveBtn ? this.deactivateBtn : this.activeBtn;
  }


  vote(isUpvote: boolean) {
    this.upBtn = isUpvote;
    this.downBtn = !isUpvote;
    this.loveBtn = false

    if (isUpvote) {
      this.up = this.up + 1;
    } else {
      this.down = this.down + 1;
    }
    this.service.vote(this.id, isUpvote).subscribe()
  }

  love() {
    this.loveBtn = true
    this.upBtn = false
    this.downBtn = false
    this.up = this.up + 1;

    this.service.vote(this.id, true).subscribe()
  }

  addTop() {
    this.admin.setTop(this.id).subscribe(
      () => {
        alert("置顶成功")
      }
    )

  }

  removeTop() {
    this.admin.cancelTop(this.id).subscribe(
      () => {
        alert("取消置顶成功")
      }
    )
  }
}
