import {Component, Input} from '@angular/core';
import {Submission} from "../model/submission";
import {ReviewService} from "../service/review.service";

@Component({
  selector: 'app-submission-card',
  templateUrl: './submission-card.component.html',
  styleUrls: ['./submission-card.component.css']
})
export class SubmissionCardComponent {

  @Input() submission!: Submission;
  @Input() review!: boolean;

  constructor(private service: ReviewService) {
  }


  reject(hash: number) {
    this.service.reject(hash).subscribe(
      () => {
        this.hidden(hash)
      }
    )
  }

  accept(hash: number) {
    this.service.accept(hash).subscribe(
      () => {
        this.hidden(hash)
      }
    )
  }

  hidden(hash: number) {
    let dom = document.getElementById(hash.toString());
    if (dom != null) {
      dom.parentElement?.remove();
    }
  }
}
