import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core'
import { Submission } from '../../model/submission'
import { SubmissionService } from '../../service/submission.service'
import { authorized, getConfig, isSmallScreen } from '../../utils'
import { UserConfigItem } from '../../model/user-config-item'

@Component({
  selector: 'app-endless',
  templateUrl: './endless.component.html',
  styleUrls: ['./endless.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush, // 使用 OnPush 策略提高性能
})
export class EndlessComponent implements OnInit {
  // 视图相关属性
  contentHeight = 0
  scrollPosition = 0
  windowHeight = window.innerHeight

  // 数据相关属性
  submissions: Submission[] = []
  submissionIds = new Set<number>() // 更有描述性的命名，替换 curElement
  selectedSubmission: Submission | null = null

  // 配置相关属性
  readonly pageSize = 18
  readonly adminMode = authorized()
  isLoading = false // 公开属性，用于模板中显示加载状态
  // 公开只读属性，用于模板
  protected readonly getConfig = getConfig
  protected readonly ConfigItem = UserConfigItem
  protected readonly isSmallScreen = isSmallScreen
  // 状态相关属性
  private lastId = 0

  constructor(
    private submissionService: SubmissionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPinnedSubmissions()
    this.loadSubmissions()
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.scrollPosition = window.scrollY
    this.contentHeight = document.body.scrollHeight

    // 当用户滚动到接近底部时加载更多内容
    const remainingScroll = this.contentHeight - (this.scrollPosition + this.windowHeight)
    if (remainingScroll < 200) {
      this.loadSubmissions()
    }
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.windowHeight = window.innerHeight
    this.cdr.markForCheck()
  }

  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    // 点击模态框背景时关闭模态框
    if ((event.target as HTMLElement).id === 'modal') {
      ;(window as any).modal.close()
    }
  }

  showSubmissionDetail(sub: Submission): void {
    this.selectedSubmission = sub
    this.cdr.markForCheck()
  }

  /**
   * 为ngFor提供trackBy函数，通过submission的id追踪项目
   * 这可以显著提高列表渲染性能，特别是在数据频繁更新时
   * Angular将重用DOM元素而不是重新创建它们
   *
   * @param index 当前项在迭代中的索引
   * @param submission 当前迭代的提交对象
   * @returns 用于追踪的唯一标识符
   */
  trackBySubmissionId(index: number, submission: Submission): number {
    return submission?.id || index
  }

  private loadSubmissions(): void {
    // 避免重复请求
    if (this.isLoading) {
      return
    }

    this.isLoading = true
    this.submissionService.listSubmissions(this.lastId, this.pageSize).subscribe({
      next: ({ data }) => {
        // 过滤掉已存在的提交
        const newSubmissions = data.filter((submission: Submission) => !this.submissionIds.has(submission.id))

        if (newSubmissions.length > 0) {
          // 更新数据 - 创建新数组以触发 OnPush 变更检测
          this.submissions = [...this.submissions, ...newSubmissions]
          newSubmissions.forEach((submission: { id: number }) => this.submissionIds.add(submission.id))
          this.lastId = newSubmissions[newSubmissions.length - 1].id
        }

        this.isLoading = false
        this.cdr.markForCheck()
      },
      error: () => {
        this.isLoading = false
        this.cdr.markForCheck()
      },
    })
  }

  private loadPinnedSubmissions() {
    this.submissionService.listPinned().subscribe({
      next: ({ data }) => {
        this.submissions = data
        data.forEach((submission: { id: number }) => this.submissionIds.add(submission.id))
        this.cdr.markForCheck()
      },
      error: () => {
        this.cdr.markForCheck()
      },
    })
  }
}
