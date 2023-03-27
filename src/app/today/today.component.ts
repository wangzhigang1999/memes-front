import {Component} from '@angular/core';
import {UserService} from "../service/user.service";

@Component({
  selector: 'app-today',
  templateUrl: './today.component.html',
  styleUrls: ['./today.component.css']
})
export class TodayComponent {

  public submissions = []

  constructor(private service: UserService) {
  }

  ngOnInit(): void {
    this.getTodaySubmissions()
  }

  getTodaySubmissions() {
    this.service.getTodaySubmissions().subscribe(data => {
      // data is {"status":100,"message":"操作成功","data":[],"timestamp":1679893131183}
      let submissions = data.data
      this.submissions = submissions
      console.log(submissions)
    })
  }

}
