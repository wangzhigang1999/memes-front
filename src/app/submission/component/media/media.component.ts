import { DatePipe, NgIf, NgTemplateOutlet } from '@angular/common'
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core'
import { LazyLoadImageModule } from 'ng-lazyload-image'
import { MarkdownModule } from 'ngx-markdown'
import { ContentStatus, DataType, MediaContent } from '../../../model/media-content'
import { UserConfigItem } from '../../../model/user-config-item'
import { ReviewService } from '../../../service/review.service'
import { getConfig } from '../../../utils'
import { SubmissionService } from '../../../service/submission.service'

/**
 * 媒体内容组件 - 处理不同类型媒体内容的显示与交互
 */
@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  standalone: true,
  imports: [LazyLoadImageModule, MarkdownModule, DatePipe, NgTemplateOutlet, NgIf],
  styleUrls: ['./media.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush, // 提高性能
})
export class MediaComponent {
  /** 媒体内容 */
  @Input() content!: MediaContent

  /** 是否处于审核模式 */
  @Input() review!: boolean

  /** 是否为管理员模式 */
  @Input() admin = false

  /** 下一个内容的ID */
  @Input() nextID: number = -1

  /** 是否启用懒加载 */
  @Input() lazy = false

  /** 是否禁用边框 */
  @Input() disableBorder = false

  fullMediaContent: MediaContent | undefined

  /** 默认图片 */
  defaultImage = 'assets/welcome.webp'

  /** 工具函数和枚举 */
  protected readonly getConfig = getConfig
  protected readonly ConfigItem = UserConfigItem
  protected readonly DataType = DataType

  /** 内容审核完成事件 */
  @Output() private reviewed = new EventEmitter<string[]>()

  constructor(
    private service: ReviewService,
    private mediaService: SubmissionService,
    private cdr: ChangeDetectorRef
  ) {}

  /**
   * 拒绝内容
   * @param id 内容ID
   */
  reject(id: number): void {
    this.service.review(id, ContentStatus.REJECTED).subscribe(() => this.hidden([id], false))
  }

  /**
   * 通过内容
   * @param id 内容ID
   */
  accept(id: number): void {
    this.service.review(id, ContentStatus.APPROVED).subscribe(() => this.hidden([id], true))
  }

  hidden(ids: number[], accept: boolean = true): void {
    const messages: string[] = []
    const elementsToRemove: HTMLElement[] = []

    ids.forEach(id => {
      const element = document.getElementById(String(id))
      if (element?.parentElement) {
        const parent = element.parentElement
        // 添加淡出效果
        parent.style.transition = 'opacity 0.3s ease'
        parent.style.opacity = '0'

        elementsToRemove.push(parent)
        messages.push(id + (accept ? '+' : '-'))
      }
    })

    if (elementsToRemove.length > 0) {
      // 等待过渡效果完成后再删除元素
      setTimeout(() => {
        elementsToRemove.forEach(el => el.remove())
        this.reviewed.emit(messages)

        // 滚动到顶部
        // window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 300) // 与过渡时间一致
    }
  }

  /**
   * 将当前内容滚动至视图中心
   */
  center(): void {
    const element = document.getElementById(String(this.content.id))
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      })
    }
  }

  /**
   * 双击后，跳转到下一个内容的开始
   */
  toNext(): void {
    const element = document.getElementById(String(this.content.id))
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      })
    }
  }

  fetchMedia(id: number) {
    this.mediaService.getMediaById(id).subscribe({
      next: (res: any) => {
        this.fullMediaContent = res.data
        this.cdr.detectChanges()
      },
      error: err => {
        console.error(err)
      },
    })
  }
}
