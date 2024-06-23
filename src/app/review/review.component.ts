import {Component, OnInit} from '@angular/core';
import {Response} from "../model/response";
import {AdminService} from "../service/admin.service";
import {Submission} from "../model/submission";
import {ReviewService} from "../service/review.service";
import {SysConfigItem} from "../model/sys-config-item";

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {

  hasToken = false;
  configMap: any = new Map<string, SysConfigItem[]>()

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
    this.service.batchAccept(ids).subscribe((data: Response) => {
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
    this.service.batchReject(ids).subscribe((data: Response) => {
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


  getSys() {
    this.admin.getConfig().subscribe(
      (data: Response) => {
        let visData: SysConfigItem[] = data.data.filter((item: SysConfigItem) => item.visible);

        visData.forEach((item: SysConfigItem) => {
          switch (item.type) {
            case "BOOLEAN":
              item.value = item.value == 'true'
              break
            case "DOUBLE":
              item.value = Number.parseFloat(item.value)
              break
            case "INTEGER":
              item.value = Number.parseInt(item.value)
              break
            default:
              console.log("Not match")
          }
        })

        for (let item of visData) {
          if (this.configMap[item.type]) {
            this.configMap[item.type].push(item)
          } else {
            this.configMap[item.type] = [item]
          }
        }

        console.log(this.configMap["BOOLEAN"])
      }
    )

  }

  init() {
    localStorage.setItem('token-ok', "true")
    this.hasToken = true;
    this.loadWaitingList()
    this.getStatistic()
    this.getSys()
  }


  triggerCrawler() {
    if (!confirm("启动前请先打开Bot，确定要触发爬虫吗？")) {
      this.title = '取消触发爬虫';
      this.message = '任务已取消';
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

      this.admin.invokeCrawler(this.pat).subscribe(
        (data: any) => {
          this.title = '触发爬虫成功';
          this.message = data.state;
          localStorage.setItem("lastCrawlerTimestamp", new Date().getTime().toString());
        }
      )
    } else {
      this.title = '触发爬虫错误';
      this.message = '缺少 PAT';
    }
  }


  private getStatistic() {
    this.service.statistics().subscribe(
      (data: Response) => {
        this.passedNum = data.data.passedNum;
        this.waitingNum = data.data.waitingNum;
      }
    )
  }


  setConfig(key: string, value: string) {
    this.admin.setConfig(key, value).subscribe(() => alert("设置成功"))
  }
}
