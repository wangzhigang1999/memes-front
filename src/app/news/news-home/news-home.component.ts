import {Component} from '@angular/core';
import {News} from "../../model/news";
import {Page} from "../../model/page";
import {NewsService} from "../../service/news.service";

@Component({
  selector: 'app-news-home',
  templateUrl: './news-home.component.html',
  styleUrls: ['./news-home.component.css']
})
export class NewsHomeComponent {

  public news: News[] = []
  idSet: Set<string> = new Set<string>();
  pageSize: number = 20;
  lastID = "";
  requesting = false
  tagBlackList = ["新时代", "中国特色", "总书记", "社会主义", "理论学习", "挂职锻炼", "工作部署", "艰苦奋斗", "指导工作", "从严治党"]

  constructor(private newsService: NewsService) {
    this.init()
  }

  init() {
    this.idSet.clear()
    this.lastID = "";

    this.requesting = true
    this.newsService.listNews(this.lastID, this.pageSize).subscribe(
      (data: any) => {
        const page: Page<News> = data.data
        this.news = page.list
        this.news.forEach(
          (news: News) => {
            for (let i = 0; i < this.tagBlackList.length; i++) {
              for (let j = 0; j < news.tag.length; j++) {
                if (news.tag[j] === this.tagBlackList[i]) {
                  return;
                }
              }
            }
            this.idSet.add(news.id)
          }
        )
        // get lastId
        if (this.news.length > 0) {
          this.lastID = this.news[this.news.length - 1].id
        }
        this.requesting = false
      })
    window.scrollTo({ top: 0, behavior: 'smooth' });

  }

  onScroll() {
    if (this.requesting) {
      return
    }
    this.requesting = true
    this.newsService.listNews(this.lastID, this.pageSize).subscribe(
      (data: any) => {
        const page: Page<News> = data.data
        page.list.forEach((news: News) => {
            if (!this.idSet.has(news.id)) {
            for (let i = 0; i < this.tagBlackList.length; i++) {
              for (let j = 0; j < news.tag.length; j++) {
                if (news.tag[j] === this.tagBlackList[i]) {
                  return;
                }
              }
            }
            this.news.push(news)
              this.idSet.add(news.id)
          }
        }
        )
        this.lastID = this.news[this.news.length - 1].id
        this.requesting = false
      }
    )
  }

}
