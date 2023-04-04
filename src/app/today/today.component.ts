import {Component} from '@angular/core';
import {SubmissionService} from "../service/submission.service";

@Component({
  selector: 'app-today',
  templateUrl: './today.component.html',
  styleUrls: ['./today.component.css']
})
export class TodayComponent {

  public submissions = []

  constructor(private service: SubmissionService) {
  }

  ngOnInit(): void {
    this.getTodaySubmissions()
  }

  getTodaySubmissions() {
    this.service.getTodaySubmissions().subscribe(data => {
      this.submissions = data.data.reverse()
    })
  }

}
