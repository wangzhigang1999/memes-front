import {Component, OnInit} from '@angular/core';
import {Response} from "../model/response";
import {AdminService} from "../service/admin.service";
import {Submission} from "../model/submission";
import {ReviewService} from "../service/review.service";

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {

  hasToken = false;

  waitingList: Submission[] = []
  token: any;

  pat: any;
  title: any;
  message: any;

  passedNum = 0;
  waitingNum = 0;

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
    // 有 token 但是没有验证过，需要验证
    this.admin.verifyToken(token).subscribe(
      {
        next: (data: Response) => {
          this.handleTokenValidation(data);
        },
        error: error => {
          console.error(error)
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
            console.error(error)
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


  batchAccept() {
    if (!confirm("确定要批量通过吗？")) {
      this.title = '取消批量通过';
      this.message = '任务已取消';
      return
    }
    this.title = '批量通过中...';
    this.message = '批量通过中...';
    let ids = this.waitingList.map(submission => submission.id);
    this.service.batchReview(ids, "accept").subscribe((data: Response) => {
      this.title = '批量通过成功';
      this.message = '批量通过成功';
      this.passedNum += data.data
      this.waitingNum -= data.data

      this.loadWaitingList()
    })
  }

  batchReject() {
    if (!confirm("确定要批量拒绝吗？")) {
      this.title = '取消批量拒绝';
      this.message = '任务已取消';
      return
    }
    this.title = '批量拒绝中...';
    this.message = '批量拒绝中...';
    let ids = this.waitingList.map(submission => submission.id);
    this.service.batchReview(ids, "reject").subscribe((data: Response) => {
      this.title = '批量拒绝成功';
      this.message = '批量拒绝成功';
      this.waitingNum -= data.data
      this.loadWaitingList()
    })
  }

  onReviewed(ids: string[]) {
    if (ids.length === 0) {
      return
    }
    if (ids.length === 1) {
      let id = ids[0]
      let realID = id.slice(0, -1);
      let accept = id.slice(-1) === '+';
      this.waitingList = this.waitingList.filter(submission => submission.id !== realID);
      this.waitingNum--;
      if (accept) {
        this.passedNum++;
      }
    } else {
      this.getStatistic()
      this.loadWaitingList()
    }
  }

  loadWaitingList() {
    this.service.loadWaitingList().subscribe((data: any) => this.waitingList = data.data ? data.data : [])
  }


  init() {
    localStorage.setItem('token-ok', "true")
    this.hasToken = true;
    this.loadWaitingList()
    this.getStatistic()
  }

  private getStatistic() {
    this.service.getStatusNum("submission").subscribe(
      (data: Response) => {
        this.passedNum = data.data;
      }
    )
    this.service.getStatusNum("waiting_submission").subscribe(
      (data: Response) => {
        this.waitingNum = data.data;
      }
    )
  }
}
