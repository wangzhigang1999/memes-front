import {Component, Input} from '@angular/core';
import {Submission} from "../model/submission";
import {UserService} from "../service/user.service";

@Component({
  selector: 'app-submission-card',
  templateUrl: './submission-card.component.html',
  styleUrls: ['./submission-card.component.css']
})
export class SubmissionCardComponent {

  @Input() submission!: Submission;
  @Input() review!: boolean;

  constructor(private service: UserService) {
  }


  delete(hash: number) {
    this.service.delete(hash).subscribe(
      (data) => {
        // remove from dom
        let dom = document.getElementById(hash.toString());
        if (dom != null) {
          // remove parent
          dom.parentElement?.remove();
        }
      }
    )

  }
}
