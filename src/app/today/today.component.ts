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
      this.submissions = data.data.reverse()
    })
  }

}
