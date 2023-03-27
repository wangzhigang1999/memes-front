import {Component} from '@angular/core';
import {UserService} from "../service/user.service";
import {Submission} from "../model/submission";

@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.css']
})
export class SubmitComponent {
  submissionType = "IMAGE";
  defaultMap = {
    "IMAGE": "https://media-cldnry.s-nbcnews.com/image/upload/t_fit-1120w,f_auto,q_auto:best/rockcms/2022-01/210602-doge-meme-nft-mb-1715-8afb7e.jpg",
    "VIDEO": "http://k8s.personai.cn:32106/zhigang/memes/7e76e4ae-c594-4372-b9fc-73c08eb6819f.mp4",
    "BILIBILI": "https://www.bilibili.com/blackboard/html5mobileplayer.html?aid=823618204&bvid=BV1wg4y1t7j6&cid=1057102166&page=1&danmaku=no",
  }
  url: string = ""

  // 5MB max
  maxFileSize = 5 * 1024 * 1024 * 1024
  iframe = "在这里输入 iframe"
  tempFile: File | any

  title = ""
  message = "";

  constructor(private service: UserService) {
  }


  ngOnInit(): void {
    // @ts-ignore
    this.url = this.defaultMap[this.submissionType];
  }

  select(type: string) {
    this.submissionType = type;
    // @ts-ignore
    this.url = this.defaultMap[type];
  }

  submit() {
    if (this.tempFile != null) {
      if (this.tempFile.size > this.maxFileSize) {
        this.title = "上传失败"
        this.message = "文件过大"
        return
      }
    }
    switch (this.submissionType) {
      case "IMAGE":
        this.uploadImage();
        break;
      case "VIDEO":
        this.uploadVideo();
        break;
      case "BILIBILI":
        this.uploadBilibili();
        break;
      default:
        this.title = "上传失败"
        this.message = "未知类型"
        break;
    }
  }

  private uploadImage() {
    if (this.tempFile == null) {
      this.title = "请先选择图片"
      this.message = "请先选择图片"
      return
    }
    let mime = this.tempFile.type;
    this.service.uploadFile(this.tempFile, mime).subscribe(
      (data) => {
        let resp: Submission = data.data
        this.title = "上传成功"
        this.message = resp.url
      }
    )


  }

  private uploadVideo() {
    if (this.tempFile == null) {
      this.title = "请先选择视频"
      this.message = "请先选择视频"
      return
    }
    let mime = this.tempFile.type;
    this.service.uploadFile(this.tempFile, mime).subscribe(
      (data) => {
        this.title = "上传成功"
        console.log(data.data)
      }
    )
  }

  private uploadBilibili() {
    if (!this.validateBilibiliIframe()) {
      this.title = "请先输入 iframe"
      this.message = "请先输入 iframe"
      return
    }

  }

  validateBilibiliIframe(): boolean {
    let regex = /<iframe.+?src="(.+?)".+?><\/iframe>/;
    return regex.test(this.iframe);
  }


  bilibiliChange() {
    if (this.iframe == null || this.iframe.startsWith("http")) {
      return
    }
    // @ts-ignore
    let src = this.iframe.match(/src="(.+?)"/)[1];
    src = src.replace("//player.bilibili.com/player.html", "//www.bilibili.com/blackboard/html5mobileplayer.html");
    this.url = src;
  }

  imageChange() {
    // @ts-ignore
    let file = document.getElementById("image-input").files[0]
    if (file == null) {
      return
    }
    this.tempFile = file

    // @ts-ignore
    let reader = new FileReader();
    // @ts-ignore
    reader.readAsDataURL(file);
    // @ts-ignore
    reader.onload = () => {
      // @ts-ignore
      this.url = reader.result;
    }

  }

  videoChange() {
    // @ts-ignore
    let file = document.getElementById("video-input").files[0]
    if (file == null) {
      return
    }
    this.tempFile = file

    // @ts-ignore
    let reader = new FileReader();
    // @ts-ignore
    reader.readAsDataURL(file);
    // @ts-ignore
    reader.onload = () => {
      // @ts-ignore
      this.url = reader.result;
    }
  }
}

