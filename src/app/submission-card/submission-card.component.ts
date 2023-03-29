import {Component, Input} from '@angular/core';
import {Submission} from "../model/submission";
import {AdminService} from "../service/admin.service";

@Component({
  selector: 'app-submission-card',
  templateUrl: './submission-card.component.html',
  styleUrls: ['./submission-card.component.css']
})
export class SubmissionCardComponent {

  @Input() submission!: Submission;
  @Input() review!: boolean;

  constructor(private service: AdminService) {
  }


  delete(hash: number) {
    this.service.delete(hash).subscribe(
      () => {
        let dom = document.getElementById(hash.toString());
        if (dom != null) {
          dom.parentElement?.remove();
        }
      }
    )

  }
}
