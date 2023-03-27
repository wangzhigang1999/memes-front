import {Component, Input} from '@angular/core';
import {Submission} from "../model/submission";

@Component({
  selector: 'app-submission-card',
  templateUrl: './submission-card.component.html',
  styleUrls: ['./submission-card.component.css']
})
export class SubmissionCardComponent {

  @Input() submission!: Submission;

}
