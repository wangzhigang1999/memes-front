import {Component} from '@angular/core';
import {News} from "../../model/news";
import {NewsService} from "../../service/news.service";
import {scrollToTop} from "../../utils";

@Component({
  selector: 'app-news-today',
  templateUrl: './news-today.component.html',
  styleUrls: ['./news-today.component.css']
})
export class NewsTodayComponent {
  public history: News[] = []

  constructor(private newsService: NewsService) {
    // get today of Asia/Shanghai
    let today = new Date()
    let month = today.getMonth() + 1;
    let day = today.getDate();

    this.newsService.getMMDD(String(month), String(day)).subscribe((data: any) => this.history = data.data.reverse()
    )
    scrollToTop()
  }

}
