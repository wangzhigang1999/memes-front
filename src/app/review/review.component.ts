import {Component} from '@angular/core';
import {Response} from "../model/response";
import {AdminService} from "../service/admin.service";

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent {

  hasToken = false;

  submissions = []
  token: any;
  title: any;
  message: any;

  constructor(private service: AdminService) {
  }

  ngOnInit() {
    let token = localStorage.getItem('token');
    if (!token) {
      this.hasToken = false;
      return
    }

    this.hasToken = true;
    this.service.review().subscribe((data: any) => {
      this.submissions = data.data ? data.data : [];
    })


  }

  submitToken() {
    if (this.token) {
      localStorage.setItem('token', this.token);
      this.hasToken = true;
      this.service.review().subscribe((data: any) => {
        this.submissions = data.data ? data.data : [];
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
    this.service.release().subscribe((data: Response) => {
      this.title = data.message;
      this.message = data.message;
    })
  }
}
