import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Submission} from "../../../model/submission";
import {ReviewService} from "../../../service/review.service";

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {

  @Input() submission!: Submission;
  @Input() review!: boolean;
  @Input() admin = false;
  @Input() showVoteBar = true;

  @Output() private reviewed = new EventEmitter<string>();
    defaultImage = "assets/welcome.webp";

  constructor(private service: ReviewService) {
  }


    reject(id: string) {
        this.service.reject(id).subscribe(() => this.hidden(id, false))
  }

    accept(id: string) {
        this.service.accept(id).subscribe(() => this.hidden(id, true))
  }

    hidden(id: string, accept: boolean = true) {
    let dom = document.getElementById(id);
    if (dom != null) {
      dom.parentElement?.remove();
        let emitMessage = id + (accept ? "+" : "-");
        this.reviewed.emit(emitMessage);
    }
    // scroll to top
    window.scrollTo(0, 0);
  }
}
