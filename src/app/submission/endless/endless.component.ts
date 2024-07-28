import {Component, HostListener} from '@angular/core';
import {Page} from "../../model/page";
import {Submission} from "../../model/submission";
import {SubmissionService} from "../../service/submission.service";
import {authorized, getConfig, isSmallScreen} from "../../utils";
import {Response} from "../../model/response";
import {UserConfigItem} from "../../model/user-config-item";

@Component({
  selector: 'app-endless',
  templateUrl: './endless.component.html',
  styleUrls: ['./endless.component.css']
})
export class EndlessComponent {
  contentHeight: number = 0; // 存储页面内容高度
  scrollPosition: number = 0; // 存储页面滚动位置
  windowHeight: number = window.innerHeight; // 当前窗口高度
  public submissions: Submission[] = [];
  curElement: Set<string> = new Set<string>();
  pageSize: number = 18;
  lastId = "";
  adminMode = false;
  requesting = false
  selectedSubmission: any = null
  protected readonly getConfig = getConfig;
  protected readonly ConfigItem = UserConfigItem;
  protected readonly isSmallScreen = isSmallScreen;

  constructor(private submissionService: SubmissionService) {
    this.init()
    if (authorized()) {
      this.adminMode = true
    }
  }

  // 监听窗口滚动事件
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(_: any) {
    this.scrollPosition = window.scrollY; // 使用 window.scrollY 获取滚动位置
    this.contentHeight = document.body.scrollHeight;
    // 计算剩余可滚动距离
    const remainingScroll = this.contentHeight - (this.scrollPosition + this.windowHeight);
    // 当剩余可滚动距离小于某个阈值时，触发加载新内容的逻辑
    if (remainingScroll < 200) { // 这里的 200 是一个示例阈值，可以根据实际情况调整
      this.loadNewSubmission()
    }
  }

  // 监听点击事件
  @HostListener('click', ['$event'])
  onClick(event: any) {
    // 如果点击的是 modal，关闭 modal
    if (event.target.id === 'modal') {
      (window as any).modal.close()
    }
  }

  init() {
    this.requesting = true
    this.submissionService.getTop().subscribe(
      (data: Response) => {
        let top: Submission[] = data.data
        this.submissions.push(...top)
        this.addToSet(top)
      }
    )
    this.submissionService.listSubmissions(this.lastId, this.pageSize).subscribe(
      (data: any) => {
        const page: Page<Submission> = data.data
        this.submissions.push(...page.list.filter((submission: Submission) => !this.curElement.has(submission.id)))
        this.pageSize = page.pageSize
        this.addToSet(page.list)
        if (this.submissions.length > 0) {
          this.lastId = this.submissions[this.submissions.length - 1].id
        }
        this.requesting = false
      })

  }

  loadNewSubmission() {
    if (this.requesting) {
      return
    }
    this.requesting = true
    setTimeout(() => this.requesting = false, 5000)
    this.submissionService.listSubmissions(this.lastId, this.pageSize).subscribe(
      (data: any) => {
        const page: Page<Submission> = data.data
        page.list.forEach(
          (submission: Submission) => {
            if (!this.curElement.has(submission.id)) {
              this.submissions.push(submission)
              this.curElement.add(submission.id)
            }
          }
        )
        this.lastId = this.submissions[this.submissions.length - 1].id
        this.requesting = false
      }
    )
  }

  showSubmissionDetail(sub: Submission) {
    this.selectedSubmission = sub
  }

  private addToSet(top: Submission[]) {
    top.forEach(
      (submission: Submission) => {
        this.curElement.add(submission.id)
      }
    )
  }

}


