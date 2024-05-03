import {Component, Input} from '@angular/core';
import {AdminService} from "../../../service/admin.service";
import {SubmissionService} from "../../../service/submission.service";
import {copyToClipboard} from "../../../utils";

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VoteComponent {
  upBtn = false;
  downBtn = false;

  @Input() adminMode = false
  @Input() id: any
  @Input() like: any
  @Input() dislike: any

  activeBtn = "btn-outline btn-success btn-circle"
  deactivateBtn = "btn-circle btn-ghost"
  isSingleClick: Boolean = true;


  constructor(private service: SubmissionService, private admin: AdminService) {
  }

  likeClass() {
    return this.upBtn ? this.activeBtn : this.deactivateBtn;
  }

  dislikeClass() {
    return this.downBtn ? this.activeBtn : this.deactivateBtn;
  }

  vote(isUpvote: boolean) {
    this.upBtn = isUpvote;
    this.downBtn = !isUpvote;
    isUpvote ? this.like++ : this.dislike++
    this.service.vote(this.id, isUpvote).subscribe()
  }


  addTop() {
    this.admin.setTop(this.id).subscribe(() => alert("置顶成功"))
  }

  removeTop() {
    this.admin.cancelTop(this.id).subscribe(() => alert("取消置顶成功"))
  }

  copy() {
    let shareUrl = window.location.origin + "/share/meme/" + this.id
    copyToClipboard(shareUrl)
  }

  similar() {
    window.open('/similar/' + this.id, '_blank')
  }

  single() {
    this.isSingleClick = true;
    setTimeout(() => {
      if (this.isSingleClick) {
        this.copy();
      }
    }, 200)
  }

  double() {
    this.isSingleClick = false;
    this.similar();
  }
}

