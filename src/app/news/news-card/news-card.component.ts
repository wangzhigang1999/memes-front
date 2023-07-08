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

  ngAfterViewInit(): void {
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
