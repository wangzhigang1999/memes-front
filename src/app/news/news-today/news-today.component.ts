import {Component} from '@angular/core';
import {News} from "../../model/news";
import {NewsService} from "../../service/news.service";

@Component({
  selector: 'app-news-today',
  templateUrl: './news-today.component.html',
  styleUrls: ['./news-today.component.css']
})
export class NewsTodayComponent {
  public history: News[] = []

  constructor(private newsService: NewsService) {
    this.getHistory()
  }

  getHistory() {
    // get today of Asia/Shanghai
    let today = new Date()
    let month = today.getMonth() + 1;
    let day = today.getDate();

    // build YYYY-MM-DD format
    let date = today.getFullYear() + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day)
    let MMDD = date.slice(4, date.length)
    this.newsService.getMMDD(MMDD).subscribe(
      (data: any) => {
        this.history = data.data.reverse()
        window.scrollTo({top: 0, behavior: 'smooth'});
      }
    )
  }

}
