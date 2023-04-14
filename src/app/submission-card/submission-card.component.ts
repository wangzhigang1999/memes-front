import {Component, EventEmitter, Input, Output} from '@angular/core';
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
  @Input() admin = false;

  @Output() private reviewed = new EventEmitter<string>();
  defaultImage = "../../assets/welcome.webp";

  constructor(private service: ReviewService) {
  }


  reject(hash: number) {
    this.service.reject(hash).subscribe(
      () => {
        this.hidden(hash + "-")
      }
    )
  }

  accept(hash: number) {
    this.service.accept(hash).subscribe(
      () => {
        this.hidden(hash + "+")
      }
    )
  }

  hidden(hash: string) {
    let id = hash.toString().slice(0, -1);
    let dom = document.getElementById(id);
    if (dom != null) {
      dom.parentElement?.remove();
      this.reviewed.emit(hash)
    }
  }
}
