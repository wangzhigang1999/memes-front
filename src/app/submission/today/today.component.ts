import { Component } from '@angular/core';
import { Submission } from "../../model/submission";
import { SubmissionService } from "../../service/submission.service";
import { authorized } from "../../utils";

@Component({
  selector: 'app-today',
  templateUrl: './today.component.html',
  styleUrls: ['./today.component.css']
})
export class TodayComponent {

  public submissions: Submission[] = []


  adminMode = false;

  constructor(private service: SubmissionService) {
  }

  ngOnInit(): void {
    this.adminMode = authorized()
    this.service.getTodaySubmissions().subscribe(data => this.submissions = data.data)
  }
}
