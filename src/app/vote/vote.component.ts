import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VoteComponent {
  upBtn = false;
  downBtn = false;
  @Input() name: any
  @Input() up: any
  @Input() down: any

  activeBtn = "btn-outline btn-success btn-square"
  deactiveBtn = "btn-circle btn-ghost"


  upClass() {
    return !this.upBtn && !this.downBtn ? this.deactiveBtn : this.upBtn ? this.activeBtn : this.deactiveBtn;
  }


  downClass() {
    return !this.upBtn && !this.downBtn ? this.deactiveBtn : this.upBtn ? this.deactiveBtn : this.activeBtn;
  }


  vote(name: string, isUpvote: boolean) {
    this.upBtn = isUpvote;
    this.downBtn = !isUpvote;
    console.log("voted " + name + " " + isUpvote)

    if (isUpvote) {
      this.up = this.up + 1;
    } else {
      this.down = this.down + 1;
    }
    console.log("up " + this.up + " down " + this.down)
  }

}
