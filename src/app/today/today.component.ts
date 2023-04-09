import {Component} from '@angular/core';
import {SubmissionService} from "../service/submission.service";
import {Submission} from "../model/submission";

@Component({
  selector: 'app-today',
  templateUrl: './today.component.html',
  styleUrls: ['./today.component.css']
})
export class TodayComponent {

  public submissions: Submission[] = []
  public originalSubmissions: Submission[] = []
  image = true;
  video = true;
  bottomMessage = "🤖 ~没有更多了~ 🤖";
  img = "assets/welcome.webp";
  imgCount: any;
  videoCount: any;
  showCount = 0;

  constructor(private service: SubmissionService) {
  }

  ngOnInit(): void {
    this.getTodaySubmissions()
  }

  getTodaySubmissions() {
    this.service.getTodaySubmissions().subscribe(data => {
      this.originalSubmissions = data.data.reverse()
      this.filter()
      this.count()
    })
  }

  scrollToTop() {
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  filter() {
    if (!this.image && !this.video) {
      this.submissions = []
      this.bottomMessage = "😒 啥都不想看,搬砖去吧 😒";
      this.img = "assets/brick.jpeg";
      return
    }

    this.bottomMessage = "🤖 ~没有更多了~ 🤖";
    this.img = "assets/welcome.webp";

    if (this.image && this.video) {
      this.submissions = this.originalSubmissions
      return
    }


    let tmp = []
    for (let i = 0; i < this.originalSubmissions.length; i++) {
      if (this.originalSubmissions[i].submissionType === 'IMAGE' && this.image) {
        tmp.push(this.originalSubmissions[i])
      } else if (this.originalSubmissions[i].submissionType === 'BILIBILI' && this.video) {
        tmp.push(this.originalSubmissions[i])
      } else if (this.originalSubmissions[i].submissionType === 'VIDEO' && this.video) {
        tmp.push(this.originalSubmissions[i])
      }
    }
    this.submissions = tmp

  }

  private count() {
    this.imgCount = 0
    this.videoCount = 0
    for (let i = 0; i < this.originalSubmissions.length; i++) {
      if (this.originalSubmissions[i].submissionType === 'IMAGE') {
        this.imgCount++
      } else if (this.originalSubmissions[i].submissionType === 'BILIBILI') {
        this.videoCount++
      } else if (this.originalSubmissions[i].submissionType === 'VIDEO') {
        this.videoCount++
      }
    }
  }

  increase(add: number) {
    this.showCount += add
  }
}
