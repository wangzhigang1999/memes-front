import {Component} from '@angular/core';
import {Response} from "../model/response";
import {AdminService} from "../service/admin.service";
import {Submission} from "../model/submission";
import {ReviewService} from "../service/review.service";

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent {

  hasToken = false;

  submissions: Submission[] = []
  token: any;
  title: any;
  message: any;

  imageCount = 0;
  videoCount = 0;
  bilibiliCount = 0;

  constructor(private service: ReviewService, private admin: AdminService) {
  }

  ngOnInit() {
    let token = localStorage.getItem('token');
    if (!token) {
      this.hasToken = false;
      return
    }

    this.hasToken = true;
    this.service.listSubmissions().subscribe((data: any) => {
      this.submissions = data.data ? data.data : [];
      this.count()
    })


  }

  submitToken() {
    if (this.token) {
      localStorage.setItem('token', this.token);
      this.hasToken = true;
      this.service.listSubmissions().subscribe((data: any) => {
        this.submissions = data.data ? data.data : [];
        this.count()
      })
    }


  }

  removeToken() {
    localStorage.removeItem('token');
    this.hasToken = false;

  }

  release() {
    this.title = '发布中';
    this.message = '请稍后';
    // @ts-ignore
    this.admin.release().subscribe((data: Response) => {
      this.title = data.message;
      this.message = data.message;
    })
  }

  count() {
    this.imageCount = 0;
    this.videoCount = 0;
    this.bilibiliCount = 0;

    for (let submission of this.submissions) {
      if (submission.submissionType === 'IMAGE') {
        this.imageCount++;
      } else if (submission.submissionType === 'VIDEO') {
        this.videoCount++;
      } else if (submission.submissionType === 'BILIBILI') {
        this.bilibiliCount++;
      }
    }
  }
}