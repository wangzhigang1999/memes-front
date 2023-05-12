import {Component} from '@angular/core';
import {SubmissionService} from "../../service/submission.service";
import {Submission} from "../../model/submission";
import {AdminService} from "../../service/admin.service";

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

  // 置顶
  public topSubmissions: Submission[] = []
  adminMode = false;

  constructor(private service: SubmissionService, private admin: AdminService) {
  }


  ngOnInit(): void {

    try {
      let token = localStorage.getItem('token');
      if (token != null) {
        this.adminMode = true
      }
    } catch (e) {
      console.log(e)
    }
    this.admin.getTop().subscribe(data => this.topSubmissions = data.data)
    this.getTodaySubmissions()
  }

  getTodaySubmissions() {
    this.service.getTodaySubmissions().subscribe(data => {

      // 过滤掉置顶的
      this.originalSubmissions = data.data.filter(
        (submission: Submission) => {
          // remove top
          for (let i = 0; i < this.topSubmissions.length; i++) {
            if (submission.hash === this.topSubmissions[i].hash) {
              return false
            }
          }
          return true
        }
      ).reverse()

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
