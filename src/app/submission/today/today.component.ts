import {Component} from '@angular/core';
import {SubmissionService} from "../../service/submission.service";
import {Submission} from "../../model/submission";
import {authorized} from "../../utils";

@Component({
  selector: 'app-today',
  templateUrl: './today.component.html',
  styleUrls: ['./today.component.css']
})
export class TodayComponent {

  public submissions: Submission[] = []

  bottomMessage = "🤖 ~没有更多了~ 🤖";
  img = "assets/welcome.webp";

  // 置顶
  public topSubmissions: Submission[] = []
  adminMode = false;

  constructor(private service: SubmissionService) {
  }


  ngOnInit(): void {
    if (authorized()) {
      this.adminMode = true
    }
    this.service.getTop().subscribe(data => this.topSubmissions = data.data)
    this.getTodaySubmissions()
  }

  getTodaySubmissions() {
    this.service.getTodaySubmissions().subscribe(data => {
      // 过滤掉置顶的
      this.submissions = data.data.filter(
        (submission: Submission) => {
          for (let i = 0; i < this.topSubmissions.length; i++) {
            if (submission.hash === this.topSubmissions[i].hash) {
              return false
            }
          }
          return true
        }
      ).reverse()

    })
  }
}
