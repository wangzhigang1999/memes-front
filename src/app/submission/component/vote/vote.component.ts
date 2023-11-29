import {Component, Input} from '@angular/core';
import {SubmissionService} from "../../../service/submission.service";
import {AdminService} from "../../../service/admin.service";
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
    @Input() name: any
    @Input() up: any
    @Input() down: any

    activeBtn = "btn-outline btn-success btn-circle"
    deactivateBtn = "btn-circle btn-ghost"

    constructor(private service: SubmissionService, private admin: AdminService) {
    }

    upClass() {
        return this.upBtn ? this.activeBtn : this.deactivateBtn;
    }

    downClass() {
        return this.downBtn ? this.activeBtn : this.deactivateBtn;
    }

    vote(isUpvote: boolean) {
        this.upBtn = isUpvote;
        this.downBtn = !isUpvote;
        isUpvote ? this.up++ : this.down++
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
}

