import {Component, Input} from '@angular/core';
import {AdminService} from "../../../service/admin.service";
import {SubmissionService} from "../../../service/submission.service";
import {copyToClipboard} from "../../../utils";

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent {
  likeBtn = false;
  dislikeBtn = false;

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
    return this.likeBtn ? this.activeBtn : this.deactivateBtn;
  }

  dislikeClass() {
    return this.dislikeBtn ? this.activeBtn : this.deactivateBtn;
  }

  feedback(like: boolean) {
    this.likeBtn = like;
    this.dislikeBtn = !like;
    like ? this.like++ : this.dislike++
    const feedback = like ? "like" : "dislike"
    this.service.feedback(this.id, feedback).subscribe()
  }


  addTop() {
    this.admin.setTop(this.id).subscribe(() => alert("置顶成功"))
  }

  removeTop() {
    this.admin.removeTop(this.id).subscribe(() => alert("取消置顶成功"))
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

