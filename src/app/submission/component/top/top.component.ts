import { Component } from '@angular/core';
import { Submission } from "../../../model/submission";
import { authorized } from "../../../utils";
import { SubmissionService } from "../../../service/submission.service";

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.css']
})
export class TopComponent {
  public topSubmissions: Submission[] = []
  adminMode = false;

  constructor(private service: SubmissionService) {
    if (authorized()) {
      this.adminMode = true
    }
    this.service.getTop().subscribe(data => this.topSubmissions = data.data)
  }

}
