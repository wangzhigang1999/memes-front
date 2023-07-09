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

  showFullText = false;

  showDetail = false;
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


  switchText() {
    let dom = document.getElementById(this.news.id);
    if (dom) {
      if (!this.showFullText) {
        dom.innerHTML = this.news.introduction;
      } else {
        dom.innerHTML = this.news.content;
      }
      this.showFullText = !this.showFullText;

      let images = dom.getElementsByTagName("img");
      for (let i = 0; i < images.length; i++) {
        // remove all attributes
        images[i].removeAttribute("width");
        images[i].removeAttribute("height");
        images[i].removeAttribute("style");
        images[i].removeAttribute("class");
        images[i].removeAttribute("alt");
        images[i].removeAttribute("title");
        images[i].removeAttribute("srcset");

        images[i].style.width = "100%";
      }
    } else {
      console.log("dom is null");
    }
  }

  switchDetail() {
    this.showDetail = !this.showDetail;
  }

  addToSelector(tag: string) {
    this.addSelector.emit(tag)
  }

  setDateTo(date: string) {
    this.setDate.emit(date)
  }
}
