import {Component} from '@angular/core';
import {Submission} from "../../model/submission";
import {authorized} from "../../utils";
import {SubmissionService} from "../../service/submission.service";

@Component({
  selector: 'app-top-submission',
  templateUrl: './top-submission.component.html',
  styleUrls: ['./top-submission.component.css']
})
export class TopSubmissionComponent {
  public topSubmissions: Submission[] = []
  adminMode = false;

  constructor(private service: SubmissionService) {
    if (authorized()) {
      this.adminMode = true
    }
    this.service.getTop().subscribe(data => this.topSubmissions = data.data)
  }

}
