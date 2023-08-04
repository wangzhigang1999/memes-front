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
  show = true;

  tagBlackList = ["新时代", "中国特色", "总书记", "社会主义", "理论学习", "挂职锻炼", "工作部署", "艰苦奋斗", "指导工作", "从严治党"]


  ngAfterViewInit(): void {

    for (let i = 0; i < this.tagBlackList.length; i++) {
      for (let j = 0; j < this.news.tag.length; j++) {
        if (this.news.tag[j] === this.tagBlackList[i]) {
          this.show = false;
          return;
        }
      }
    }
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
