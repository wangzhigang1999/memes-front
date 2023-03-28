import {Component} from '@angular/core';
import {UserService} from "../service/user.service";
import {Response} from "../model/response";

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

  constructor(private service: UserService) {
  }

  ngOnInit() {
    let token = localStorage.getItem('token');
    if (!token) {
      this.hasToken = false;
      return
    }

    this.hasToken = true;
    this.service.review().subscribe((data: any) => {
      this.submissions = data.data;
    })


  }

  submitToken() {
    if (this.token) {
      localStorage.setItem('token', this.token);
      this.hasToken = true;
      this.service.review().subscribe((data: any) => {
        this.submissions = data.data;
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
