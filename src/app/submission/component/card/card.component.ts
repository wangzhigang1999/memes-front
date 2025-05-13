import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { MediaContent } from '../../../model/media-content'
import { Submission } from '../../../model/submission'
import { getConfig } from '../../../utils'

/**
 * 卡片组件 - 显示提交内容
 * 包含内容列表和反馈功能
 */
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush, // 优化性能
})
export class CardComponent {
  /** 提交内容 */
  @Input() submission!: Submission

  /** 是否为管理员模式 */
  @Input() admin = false

  /** 是否启用懒加载 */
  @Input() lazy = false

  /** 是否禁用边框 */
  @Input() disableBorder = false

  /** 工具函数 */
  protected readonly getConfig = getConfig

  /**
   * 为 ngFor 提供 trackBy 函数，优化性能
   * @param index 索引
   * @param item 媒体内容
   * @returns 媒体内容的唯一 ID
   */
  trackByMediaId(index: number, item: MediaContent): number {
    return item.id
  }

  onDeleted($event: string) {
    console.log($event)
  }
}
