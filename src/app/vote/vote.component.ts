import {Component, Input} from '@angular/core';
import {UserService} from "../service/user.service";

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

  constructor(private service: UserService) {

  }


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


    this.service.vote(name, isUpvote).subscribe(() => {
      if (isUpvote) {
        this.up = this.up + 1;
      } else {
        this.down = this.down + 1;
      }
    })
  }

}
