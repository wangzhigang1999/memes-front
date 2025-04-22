import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core'
import { Config } from '../../../model/config'
import { MediaContent } from '../../../model/media-content'
import { UserConfigItem } from '../../../model/user-config-item'
import { AdminService } from '../../../service/admin.service'
import { ModalService } from '../../../service/modal.service'
import { SubmissionService } from '../../../service/submission.service'
import { getConfig } from '../../../utils'

/**
 * 反馈组件 - 处理用户对内容的反馈和管理员操作
 */
@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush, // 提高性能
})
export class FeedbackComponent implements OnInit {
  /** 用户反馈状态 */
  liked = false
  disliked = false

  /** 是否为管理员模式 */
  @Input() adminMode = false

  /** 内容 ID */
  @Input() id!: string | any

  /** 点赞数 */
  @Input() like!: number

  /** 踩数 */
  @Input() dislike!: number

  /** 媒体内容列表 */
  @Input() mediaContentList: MediaContent[] = []

  constructor(
    private submissionService: SubmissionService,
    private adminService: AdminService,
    private modalService: ModalService
  ) {}

  protected readonly getConfig = getConfig
  protected readonly Config = Config
  protected readonly UserConfigItem = UserConfigItem

  ngOnInit(): void {
    // 初始化时可以从本地存储检查用户之前的反馈状态
    this.checkPreviousFeedback()
  }

  /**
   * 显示图片描述
   */
  showDescription(): void {
    if (this.mediaContentList.length > 0) {
      this.submissionService.getMediaById(this.mediaContentList[0].id).subscribe((res: any) => {
        const mediaContent: MediaContent = res.data

        this.modalService.show({
          title: 'LLM 锐评',
          content: mediaContent.sharpReview || mediaContent.llmDescription || '暂无描述',
          size: '3xl',
          type: 'info',
        })
      })
    }
  }

  /**
   * 添加置顶
   */
  pin(): void {
    this.adminService.pin(this.id).subscribe({
      next: () => this.showMessage('置顶成功'),
      error: error => this.showMessage(`置顶失败：${error.message}`),
    })
  }

  /**
   * 提交反馈
   * @param like 是否点赞
   */
  feedback(like: boolean): void {
    // 如果用户已经做出了相同的选择，则不重复处理
    if ((like && this.liked) || (!like && this.disliked)) {
      return
    }

    // 更新 UI 状态
    this.liked = like
    this.disliked = !like

    // 更新计数
    like ? this.like++ : this.dislike++

    // 确定反馈类型
    const feedbackType = like ? 'like' : 'dislike'

    // 保存到本地存储
    // localStorage.setItem(`feedback_${this.id}`, feedbackType);

    // 发送到服务器
    this.submissionService.feedback(this.id, feedbackType).subscribe({
      next: () => console.log(`Feedback ${feedbackType} sent successfully`),
      error: error => console.error('Error sending feedback:', error),
    })
  }

  /**
   * 取消置顶
   */
  unpin(): void {
    this.adminService.unpin(this.id).subscribe({
      next: () => this.showMessage('取消置顶成功'),
      error: error => this.showMessage(`取消置顶失败：${error.message}`),
    })
  }

  /**
   * 检查用户之前的反馈状态
   * 可以从 localStorage 读取用户对该内容的反馈历史
   */
  private checkPreviousFeedback(): void {
    // 实现从 localStorage 读取用户反馈历史的逻辑
    // 例如：
    const feedbackHistory = localStorage.getItem(`feedback_${this.id}`)
    if (feedbackHistory === 'like') {
      this.liked = true
    } else if (feedbackHistory === 'dislike') {
      this.disliked = true
    }
  }

  /**
   * 显示消息
   * @param message 消息内容
   */
  private showMessage(message: string): void {
    this.modalService.show({
      title: '提示',
      content: message,
      size: 'sm',
      type: 'info',
    })
  }
}
