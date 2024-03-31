import { Component, Input } from '@angular/core';
import { News } from "../../model/news";

@Component({
  selector: 'app-news-card',
  templateUrl: './news-card.component.html',
  styleUrls: ['./news-card.component.css']
})
export class NewsCardComponent {

  @Input() news!: News;


  defaultCover = "assets/reporter.png";


  center() {
    let dom = document.getElementById(this.news.id + '-');
    if (dom != null) {
      dom.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    }
  }
}
