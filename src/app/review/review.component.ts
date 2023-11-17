import {Component} from '@angular/core';
import {Response} from "../model/response";
import {AdminService} from "../service/admin.service";
import {Submission} from "../model/submission";
import {ReviewService} from "../service/review.service";

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent {

  hasToken = false;

  submissions: Submission[] = []
  token: any;

  pat: any;
  title: any;
  message: any;

  reviewPassedNum = 0;
  toBeReviewedNum = 0;
  releasedNum = 0;
  botEnable = false;

  releaseStrategy = []
  selectedReleaseStrategy = ''
  minValue = 50;
  maxHistory: any;

  constructor(private service: ReviewService, private admin: AdminService) {
    this.pat = localStorage.getItem('pat');
    if (this.pat == null) {
      this.pat = ''
    }
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
    this.admin.verifyToken(token).subscribe(
      {
        next: (data: Response) => {
          this.handleTokenValidation(data);
        },
        error: error => {
          this.removeToken()
        }
      }
    )
  }

  submitToken() {
    if (this.token) {
      localStorage.setItem('token', this.token);
      localStorage.setItem("pat", this.pat);
      this.admin.verifyToken(this.token).subscribe(
        {
          next: (data: Response) => {
            this.handleTokenValidation(data);
          },
          error: error => {
            this.removeToken()
          }
        }
      )
    }
  }

  handleTokenValidation(this: any, data: any) {
    if (data.data) {
      this.init()
    } else {
      this.removeToken()
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
    let ids = this.submissions.map(submission => submission.id);
    this.service.batchAccept(ids).subscribe((data: Response) => {
      this.title = '批量通过成功';
      this.message = '批量通过成功';
      this.reviewPassedNum += data.data
      this.toBeReviewedNum -= data.data

      this.loadSubmissions()
    })
  }

  onReviewed(id: string) {
    let realID = id.slice(0, -1);
    let accept = id.slice(-1) === '+';
    this.submissions = this.submissions.filter(submission => submission.id !== realID);
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
    if (this.botEnable) {
      this.admin.enableBot().subscribe(data => console.log(data))
    } else {
      this.admin.disableBot().subscribe(data => console.log(data))
    }
  }


  getSys() {
    this.admin.getSys().subscribe(
      (data: Response) => {
        console.log(data)
        this.releaseStrategy = data.data["releaseStrategy"];
        this.selectedReleaseStrategy = data.data["selectedReleaseStrategy"];
        this.botEnable = data.data["botUp"];
        this.minValue = data.data["min_SUBMISSIONS"];
        this.maxHistory = data.data["max_HISTORY"];
        this.releaseStrategy = data.data["releaseStrategy"];
      }
    )
  }

  init() {
    localStorage.setItem('token-ok', "true")
    this.hasToken = true;
    this.loadSubmissions()
    this.getStatistic()
    this.getSys()
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

  updateMaxHistory() {
    if (this.maxHistory < 0) {
      alert("最大值不能小于0")
      return
    }
    this.admin.setMaxHistory(this.maxHistory).subscribe()
  }

  triggerCrawler() {
    if (!confirm("确定要触发爬虫吗？")) {
      this.title = '取消触发爬虫';
      this.message = '任务已取消';
      return
    }

    if (!this.botEnable) {
      this.title = '触发爬虫错误';
      this.message = '请先启动爬虫';
      return
    }

    let lastCrawlerTimestamp = Number.parseInt(localStorage.getItem("lastCrawlerTimestamp") || "0", 10);

    // if the gap between last crawler and now is less than 1 hour, then do not trigger crawler
    if (new Date().getTime() - lastCrawlerTimestamp < 60 * 60 * 1000) {
      this.title = '触发爬虫错误';
      this.message = '1小时内只能触发一次爬虫';
      return
    }

    if (this.pat) {
      this.title = '触发爬虫中...';
      this.message = '请稍后';
      localStorage.setItem("lastCrawlerTimestamp", new Date().getTime().toString());

      this.admin.triggerCrawler(this.pat).subscribe(
        (data: any) => {
          this.title = '触发爬虫成功';
          this.message = data.state;
        }
      )
    } else {
      this.title = '触发爬虫错误';
      this.message = '缺少PAT';
    }
  }

  removeCache() {
    this.title = '清除缓存中...';
    this.message = '请稍后';
    this.admin.removeCache().subscribe(
      (data: Response) => {
        this.title = '清除缓存成功';
        this.message = data.message;
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
}