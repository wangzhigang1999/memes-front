import {Component, EventEmitter, Input, Output} from '@angular/core';
import {News} from "../../model/news";

@Component({
  selector: 'app-news-card',
  templateUrl: './news-card.component.html',
  styleUrls: ['./news-card.component.css']
})
export class NewsCardComponent {

  @Input() news!: News;

  @Output() private addSelector = new EventEmitter<string>();
  @Output() private setDate = new EventEmitter<string>();

  defaultCover = "assets/reporter.png";

  ngAfterViewInit(): void {
    let dom = document.getElementById(this.news.id);
    if (dom) {
      dom.innerHTML = this.news.introduction;
    }
  }

  addToSelector(tag: string) {
    this.addSelector.emit(tag)
  }

  setDateTo(date: string) {
    this.setDate.emit(date)
  }
}
