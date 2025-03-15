import { Component, HostListener, OnInit } from '@angular/core'
import { MediaContent } from '../../model/media-content'
import { Submission } from '../../model/submission'
import { SubmissionService } from '../../service/submission.service'
import { authorized } from '../../utils'

// 定义可提交的内容类型
type SubmissionTypes = 'IMAGE' | 'VIDEO' | 'BILIBILI' | 'MARKDOWN'

@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.css'],
})
export class SubmitComponent implements OnInit {
  // 数据
  public submissions: Submission[] = []
  public date = ''
  public adminMode = false
  // 常量定义
  readonly MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
  readonly ACCEPTED_MARKDOWN_EXTENSIONS = ['md', 'txt']
  // 提交类型和默认值映射
  submissionType: SubmissionTypes = 'IMAGE'
  defaultMap = {
    IMAGE: 'assets/welcome.webp',
    VIDEO: 'assets/video-example.mp4',
    BILIBILI: '//www.bilibili.com/blackboard/html5mobileplayer.html?aid=823618204&bvid=BV1wg4y1t7j6&cid=1057102166&page=1&danmaku=no',
    MARKDOWN: '',
  }
  // 表单数据
  text: string = ''
  textIsUrl = false
  iframe = '在这里输入 iframe'
  tempFile: File | null = null
  // UI 状态
  title = ''
  isUploading = false
  message = ''
  private idSet = new Set<string>()
  private lastId = ''
  // 状态
  private requesting: boolean = false
  private readonly requestCooldown = 5000 // 请求冷却时间，防止频繁请求

  constructor(private service: SubmissionService) {}

  ngOnInit(): void {
    this.initializeDate()
    this.resetData()
    this.loadSubmissions()
  }

  /**
   * 加载更多提交
   */
  public loadMore(): void {
    this.update()
  }

  /**
   * 更新提交列表
   */
  update(): void {
    // 防止频繁请求
    if (this.requesting) {
      return
    }

    this.requesting = true

    // 设置请求冷却
    setTimeout(() => (this.requesting = false), this.requestCooldown)

    this.loadSubmissions()
  }

  /**
   * 监听粘贴事件处理图片和视频粘贴
   */
  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    const items = event.clipboardData?.items
    if (!items || !items.length) return

    for (let i = 0; i < items.length; i++) {
      const item = items[i]

      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile()
        if (file) {
          this.handleImageFile(file)
          break
        }
      } else if (item.type.indexOf('video') !== -1) {
        const file = item.getAsFile()
        if (file) {
          this.handleVideoFile(file)
          break
        }
      }
    }
  }

  /**
   * 选择内容类型
   */
  select(type: SubmissionTypes): void {
    this.submissionType = type
    this.resetContent()
  }

  /**
   * 提交内容
   */
  submit(): void {
    if (this.isUploading) return

    this.title = '上传中'
    this.message = '请稍等'

    // 检查文件大小
    if (this.tempFile && this.tempFile.size > this.MAX_FILE_SIZE) {
      this.showUploadResult({
        success: false,
        message: '文件过大，请上传小于 10MB 的文件',
      })
      return
    }

    this.isUploading = true

    // 根据类型调用不同的上传方法
    try {
      switch (this.submissionType) {
        case 'IMAGE':
          this.uploadImage()
          break
        case 'VIDEO':
          this.uploadVideo()
          break
        case 'BILIBILI':
          this.uploadBilibili()
          break
        case 'MARKDOWN':
          this.uploadMarkdown()
          break
        default:
          this.showUploadResult({
            success: false,
            message: '未知类型',
          })
      }
    } catch (error) {
      this.handleUploadError(error)
    }
  }

  /**
   * 验证 Bilibili iframe 格式
   */
  validateBilibiliIframe(): boolean {
    const regex = /<iframe.*?src="(.*?)".*?>.*?<\/iframe>/g
    const result = this.iframe.match(regex)
    return Boolean(result && result.length > 0)
  }

  /**
   * 处理 Bilibili iframe 变更
   */
  bilibiliChange(): void {
    if (!this.validateBilibiliIframe()) {
      return
    }

    // 提取并转换 src 属性
    const srcMatch = this.iframe.match(/src="(.+?)"/)
    if (srcMatch && srcMatch[1]) {
      const src = srcMatch[1].replace('//player.bilibili.com/player.html', '//www.bilibili.com/blackboard/html5mobileplayer.html')
      this.text = src
    }
  }

  /**
   * 处理图片选择变更
   */
  imageChange(): void {
    const fileInput = document.getElementById('image-input') as HTMLInputElement
    const file = fileInput?.files?.[0]
    if (file) {
      this.handleImageFile(file)
    }
  }

  /**
   * 处理图片文件
   */
  handleImageFile(file: File): void {
    this.submissionType = 'IMAGE'

    // GIF 不压缩，其他图片类型进行压缩
    if (file.type !== 'image/gif') {
      this.compressImg(file, 0.5).then(compressedFile => {
        this.tempFile = compressedFile
      })
    } else {
      this.tempFile = file
    }

    // 预览图片
    this.previewFile(file)
  }

  /**
   * 处理视频选择变更
   */
  videoChange(): void {
    const fileInput = document.getElementById('video-input') as HTMLInputElement
    const file = fileInput?.files?.[0]
    if (file) {
      this.handleVideoFile(file)
    }
  }

  /**
   * 处理视频文件
   */
  handleVideoFile(file: File): void {
    this.submissionType = 'VIDEO'
    this.tempFile = file
    this.previewFile(file)
  }

  /**
   * 压缩图片
   */
  compressImg(file: File, quality: number): Promise<File> {
    return new Promise(resolve => {
      const reader = new FileReader()

      reader.onload = event => {
        if (!event.target?.result) return

        const src = event.target.result.toString()
        const image = new Image()

        image.onload = () => {
          // 创建 canvas 并绘制图片
          const canvas = document.createElement('canvas')
          canvas.width = image.width
          canvas.height = image.height
          const ctx = canvas.getContext('2d')

          if (!ctx) return

          ctx.drawImage(image, 0, 0, image.width, image.height)

          // 转换为 JPEG 格式并压缩
          const canvasURL = canvas.toDataURL('image/jpeg', quality)
          const buffer = atob(canvasURL.split(',')[1])
          const bufferArray = new Uint8Array(new ArrayBuffer(buffer.length))

          for (let i = 0; i < buffer.length; i++) {
            bufferArray[i] = buffer.charCodeAt(i)
          }

          const miniFile = new File([bufferArray], file.name, {
            type: 'image/jpeg',
          })

          console.log('原大小', Math.round(file.size / 1024), 'KB')
          console.log('压缩后', Math.round(miniFile.size / 1024), 'KB')
          console.log('压缩率', ((miniFile.size / file.size) * 100).toFixed(2) + '%')

          resolve(miniFile)
        }

        image.src = src
      }

      reader.readAsDataURL(file)
    })
  }

  /**
   * 处理拖拽悬停事件
   */
  onDragOver(event: DragEvent): void {
    event.preventDefault()
  }

  /**
   * 处理文件拖放
   */
  onDrop(event: DragEvent): void {
    event.preventDefault()

    const files = event.dataTransfer?.files
    if (!files || files.length === 0) return

    const file = files[0]

    if (file.type.startsWith('image')) {
      this.handleImageFile(file)
    } else if (file.type.startsWith('video')) {
      this.handleVideoFile(file)
    }
  }

  /**
   * 检测Markdown是否为URL
   */
  detectMD(): void {
    setTimeout(() => {
      const trimmedText = this.text.trim()
      this.textIsUrl = trimmedText.startsWith('http') && trimmedText.endsWith('.md')
    }, 200)
  }

  /**
   * 处理 Markdown 文件选择
   */
  markdownChange(): void {
    const fileInput = document.getElementById('md-input') as HTMLInputElement
    const file = fileInput?.files?.[0]

    if (!file) return

    // 验证文件扩展名
    const ext = file.name.split('.').pop()?.toLowerCase() || ''

    if (!this.ACCEPTED_MARKDOWN_EXTENSIONS.includes(ext)) {
      alert('请上传 .md 或 .txt 文件😄')
      return
    }

    // 读取文件内容
    const reader = new FileReader()
    reader.onload = () => {
      if (reader.result) {
        this.text = reader.result.toString()
      }
    }
    reader.readAsText(file)
  }

  /**
   * 初始化日期为今天
   */
  private initializeDate(): void {
    const today = new Date()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    const year = today.getFullYear()
    this.date = `${year}-${month}-${day}`
  }

  /**
   * 重置数据
   */
  private resetData(): void {
    this.idSet.clear()
    this.submissions = []
    this.adminMode = authorized()
    this.resetContent()
  }

  /**
   * 重置当前内容类型的内容
   */
  private resetContent(): void {
    this.text = this.defaultMap[this.submissionType]
    this.tempFile = null
  }

  /**
   * 从服务加载提交列表
   */
  private loadSubmissions(): void {
    // 此处获取提交列表的 API 调用
    // 示例代码 - 取消注释并根据实际情况修改
    /*
    this.service.listSubmissions(this.lastId, 20, this.date).subscribe({
      next: (data: any) => {
        if (!data?.data?.list) {
          return;
        }

        // 过滤掉已有的数据
        const uniqueData: Submission[] = data.data.list.filter(
          (item: Submission) => !this.idSet.has(item.id)
        );

        // 添加新数据
        if (uniqueData.length > 0) {
          this.submissions = [...this.submissions, ...uniqueData];

          // 更新 ID 集合
          uniqueData.forEach((item: Submission) => this.idSet.add(item.id));

          // 更新最后一个 ID
          this.lastId = this.submissions[this.submissions.length - 1].id;
        }
      },
      error: (error) => {
        console.error('Failed to load submissions:', error);
      }
    });
    */
  }

  /**
   * 预览文件
   */
  private previewFile(file: File): void {
    const reader = new FileReader()
    reader.onload = () => {
      if (reader.result) {
        this.text = reader.result.toString()
      }
    }
    reader.readAsDataURL(file)
  }

  /**
   * 显示上传结果
   */
  private showUploadResult(result: { success: boolean; message: string }): void {
    this.title = result.success ? '上传成功' : '上传失败'
    this.message = result.message
    this.isUploading = false
  }

  /**
   * 上传图片
   */
  private uploadImage(): void {
    if (!this.tempFile) {
      this.showUploadResult({
        success: false,
        message: '请先选择图片',
      })
      return
    }

    this.service.uploadFile(this.tempFile, this.tempFile.type).subscribe({
      next: data => this.handleUploadSuccess(data),
      error: error => this.handleUploadError(error),
      complete: () => (this.isUploading = false),
    })
  }

  /**
   * 处理上传成功
   */
  private handleUploadSuccess(data: any): void {
    const resp: MediaContent = data.data
    this.showUploadResult({
      success: true,
      message: resp.dataContent,
    })
  }

  /**
   * 处理上传错误
   */
  private handleUploadError(error: any): void {
    this.showUploadResult({
      success: false,
      message: error.message || '上传失败',
    })
  }

  /**
   * 上传视频
   */
  private uploadVideo(): void {
    if (!this.tempFile) {
      this.showUploadResult({
        success: false,
        message: '请先选择视频',
      })
      return
    }

    this.service.uploadFile(this.tempFile, this.tempFile.type).subscribe({
      next: data => this.handleUploadSuccess(data),
      error: error => this.handleUploadError(error),
      complete: () => (this.isUploading = false),
    })
  }

  /**
   * 上传 Bilibili
   */
  private uploadBilibili(): void {
    if (!this.validateBilibiliIframe()) {
      this.showUploadResult({
        success: false,
        message: '请输入正确的 Bilibili iframe 代码',
      })
      return
    }

    this.service.uploadBilibili(this.text).subscribe({
      next: data => this.handleUploadSuccess(data),
      error: error => this.handleUploadError(error),
      complete: () => (this.isUploading = false),
    })
  }

  /**
   * 上传 Markdown
   */
  private uploadMarkdown(): void {
    if (!this.text || this.text.trim().length === 0) {
      this.showUploadResult({
        success: false,
        message: '请输入 Markdown 内容或文件',
      })
      return
    }

    // 使用现有的 uploadMarkdown 方法
    this.service.uploadMarkdown(this.text).subscribe({
      next: data => this.handleUploadSuccess(data),
      error: error => this.handleUploadError(error),
      complete: () => (this.isUploading = false),
    })
  }
}
