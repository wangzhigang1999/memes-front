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

  curElement: Set<string> = new Set<string>();
  pageSize: number = 10;
  pageNum: number = 1;

  total: number = 0;
  lastId = "";


  requesting = false

  tagBlackList = ["新时代", "中国特色", "总书记", "社会主义", "理论学习", "挂职锻炼", "工作部署", "艰苦奋斗", "指导工作", "从严治党"]


  constructor(private newsService: NewsService) {
    this.init()
  }

  init() {
    //reset
    this.curElement = new Set<string>();
    this.pageNum = 1;
    this.lastId = "";


    this.requesting = true
    this.newsService.getByPage(this.lastId, this.pageNum, this.pageSize).subscribe(
      (data: any) => {
        const page: Page<News> = data.data
        this.news = page.list
        this.pageNum = page.pageNum
        this.total = page.total
        this.news.forEach(
          (news: News) => {
            for (let i = 0; i < this.tagBlackList.length; i++) {
              for (let j = 0; j < news.tag.length; j++) {
                if (news.tag[j] === this.tagBlackList[i]) {
                  return;
                }
              }
            }
            this.curElement.add(news.id)
          }
        )
        // get lastId
        if (this.news.length > 0) {
          this.lastId = this.news[this.news.length - 1].id
        }
        this.requesting = false
      })
    window.scrollTo({top: 0, behavior: 'smooth'});

  }

  onScroll() {
    if (this.news.length >= this.total || this.requesting) {
      return
    }
    this.requesting = true
    this.newsService.getByPage(this.lastId, this.pageNum + 1, this.pageSize).subscribe(
      (data: any) => {
        const page: Page<News> = data.data
        page.list.forEach((news: News) => {
            if (!this.curElement.has(news.id)) {
              for (let i = 0; i < this.tagBlackList.length; i++) {
                for (let j = 0; j < news.tag.length; j++) {
                  if (news.tag[j] === this.tagBlackList[i]) {
                    return;
                  }
                }
              }
              this.news.push(news)
              this.curElement.add(news.id)
            }
          }
        )
        this.pageNum = page.pageNum
        this.lastId = this.news[this.news.length - 1].id
        this.requesting = false
      }
    )
  }

}
