import {Component, HostListener} from '@angular/core';
import {Page} from "../../model/page";
import {Submission} from "../../model/submission";
import {SubmissionService} from "../../service/submission.service";
import {authorized, getConfig} from "../../utils";
import {Response} from "../../model/response";
import {ConfigItem} from "../../model/config-item";

@Component({
  selector: 'app-endless',
  templateUrl: './endless.component.html',
  styleUrls: ['./endless.component.css']
})
export class EndlessComponent {
  contentHeight: number = 0; // 存储页面内容高度
  scrollPosition: number = 0; // 存储页面滚动位置
  windowHeight: number = window.innerHeight; // 当前窗口高度

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
    console.log(event.target.id)
    // 如果点击的是 modal，关闭 modal
    if (event.target.id === 'modal') {
      (window as any).modal.close()
    }
  }

  public submissions: Submission[] = [];
  curElement: Set<string> = new Set<string>();
  pageSize: number = 18;
  lastId = "";
  adminMode = false;
  requesting = false
  selectedSubmission: any = null

  constructor(private submissionService: SubmissionService) {
    this.init()
    if (authorized()) {
      this.adminMode = true
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
    this.submissionService.getPage(this.lastId, this.pageSize).subscribe(
      (data: any) => {
        const page: Page<Submission> = data.data
        this.submissions.push(...page.list)
        this.pageSize = page.pageSize
        this.addToSet(page.list)
        // get lastId
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
    this.submissionService.getPage(this.lastId, this.pageSize).subscribe(
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

  private addToSet(top: Submission[]) {
    top.forEach(
      (submission: Submission) => {
        this.curElement.add(submission.id)
      }
    )
  }

  protected readonly getConfig = getConfig;
  protected readonly ConfigItem = ConfigItem;

  showSubmissionDetail(sub: Submission) {
    this.selectedSubmission = sub
  }

  // is small screen
  isSmallScreen() {
    return window.innerWidth < 768
  }
}


