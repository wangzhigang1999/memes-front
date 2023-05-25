import {Component} from '@angular/core';
import {Response} from "../../model/response";
import {AdminService} from "../../service/admin.service";
import {Submission} from "../../model/submission";
import {ReviewService} from "../../service/review.service";

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent {

  hasToken = false;

  submissions: Submission[] = []
  token: any;
  title: any;
  message: any;

  reviewPassedNum = 0;
  toBeReviewedNum = 0;
  releasedNum = 0;
  bot = false;

  releaseStrategy = []
  selectedReleaseStrategy = ''
  minValue = 50;
  maxHistory: any;

  constructor(private service: ReviewService, private admin: AdminService) {
  }

  ngOnInit() {

    let token = localStorage.getItem('token');
    if (!token) {
      this.removeToken()
      return
    }

    // 说明已经验证过了
    if (localStorage.getItem('token-ok') === "true") {
      this.init()
      return
    }

    // 有token但是没有验证过，需要验证
    this.admin.verifyToken(token).subscribe((data: Response) => {
      if (data.data) {
        this.init()
      } else {
        this.removeToken()
      }
    })
  }

  submitToken() {
    if (this.token) {
      localStorage.setItem('token', this.token);
      this.admin.verifyToken(this.token).subscribe((data: Response) => {
        if (data.data) {
          this.init()
        } else {
          this.removeToken()
        }
      })
    }
  }

  removeToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('token-ok');
    this.hasToken = false;
  }

  release() {
    this.title = '发布中';
    this.message = '请稍后';
    // @ts-ignore
    this.admin.release().subscribe((data: Response) => {
      this.title = data.message;
      this.message = data.message;
      this.releasedNum = data.data
    })
  }


  batchAccept() {
    this.title = '批量通过中...';
    this.message = '批量通过中...';
    let hashcode = this.submissions.map(submission => submission.hash);
    this.service.batchAccept(hashcode).subscribe((data: Response) => {
      this.title = '批量通过成功';
      this.message = '批量通过成功';
      this.reviewPassedNum += data.data
      this.toBeReviewedNum -= data.data

      this.loadSubmissions()
    })
  }

  onReviewed(hashcode: string) {
    let realHashcode = Number.parseInt(hashcode.slice(0, -1), 10)
    let accept = hashcode.slice(-1) === '+';
    this.submissions = this.submissions.filter(submission => submission.hash !== realHashcode);
    this.toBeReviewedNum--;
    if (accept) {
      this.reviewPassedNum++;
    }
  }

  loadSubmissions() {
    this.service.listSubmissions().subscribe((data: any) => {
      this.submissions = data.data ? data.data : [];
    })
  }

  updateBot() {
    if (this.bot) {
      this.admin.enableBot().subscribe(
        (data: any) => {
          console.log(data)
        }
      )
    } else {
      this.admin.disableBot().subscribe(
        (data: any) => {
          console.log(data)
        }
      )
    }
  }

  getBotStatus() {
    this.admin.getBotStatus().subscribe(
      (data: any) => {
        this.bot = data.data;
      }
    )
  }

  getStrategy() {
    this.admin.getReleaseStrategy().subscribe(
      (data: Response) => {
        this.releaseStrategy = data.data["releaseStrategy"];
        this.selectedReleaseStrategy = data.data["selectedReleaseStrategy"];
      }
    )
  }

  init() {
    localStorage.setItem('token-ok', "true")
    this.hasToken = true;
    this.loadSubmissions()
    this.getBotStatus()
    this.getStrategy()
    this.getMaxSubmissionLimit()
    this.getStatistic()
    this.getMaxHistory()
  }

  setReleaseStrategy(item: string) {
    if (item === this.selectedReleaseStrategy) {
      return
    }
    this.admin.setReleaseStrategy(item).subscribe(
      () => {
        this.selectedReleaseStrategy = item;
      }
    )
  }

  updateMax() {
    if (this.minValue < 0) {
      alert("最大值不能小于0")
      return
    }

    this.admin.setMinSubmission(this.minValue).subscribe(() => {
    })
  }

  getMaxSubmissionLimit() {
    this.admin.getMinSubmission().subscribe(
      (data: Response) => {
        this.minValue = data.data;
      }
    )
  }

  private getStatistic() {
    this.service.statistics().subscribe(
      (data: Response) => {
        this.reviewPassedNum = data.data.reviewPassedNum;
        this.toBeReviewedNum = data.data.toBeReviewedNum;
        this.releasedNum = data.data.releasedNum;
      }
    )
  }

  getMaxHistory() {
    this.admin.getMaxHistory().subscribe(
      //@ts-ignore
      (data: Response) => {
        this.maxHistory = data.data;
      }
    )
  }

  updateMaxHistory() {
    if (this.maxHistory < 0) {
      alert("最大值不能小于0")
      return
    }

    this.admin.setMaxHistory(this.maxHistory).subscribe()
  }
}
