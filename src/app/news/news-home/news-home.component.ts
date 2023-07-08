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

  specificDate = ""
  badges: string[] = [];

  constructor(private newsService: NewsService) {
    this.init()
  }

  init() {
    //reset
    this.curElement = new Set<string>();
    this.pageNum = 1;
    this.lastId = "";


    let tag = this.badges.join(",")

    this.newsService.getByPageWithTag(this.lastId, this.pageNum, this.pageSize, tag).subscribe(
      (data: any) => {
        const page: Page<News> = data.data
        this.news = page.list
        this.pageNum = page.pageNum
        this.total = page.total
        this.news.forEach(
          (news: News) => {
            this.curElement.add(news.id)
          }
        )
        // get lastId
        if (this.news.length > 0) {
          this.lastId = this.news[this.news.length - 1].id
        }
      })
    window.scrollTo({top: 0, behavior: 'smooth'});

  }

  onScroll() {
    if (this.specificDate !== "") {
      return
    }
    if (this.news.length >= this.total) {
      return
    }
    let tag = this.badges.join(",")
    this.newsService.getByPageWithTag(this.lastId, this.pageNum + 1, this.pageSize, tag).subscribe(
      (data: any) => {
        const page: Page<News> = data.data
        page.list.forEach(
          (news: News) => {
            if (!this.curElement.has(news.id)) {
              this.news.push(news)
              this.curElement.add(news.id)
            }
          }
        )
        this.pageNum = page.pageNum
        this.lastId = this.news[this.news.length - 1].id
      }
    )
  }

  addSelector(tag: string) {
    // remove date
    this.specificDate = ""
    if (!this.badges.includes(tag)) {
      this.badges.push(tag)
      this.init()
    }
  }

  removeTag(tag: string) {
    this.badges = this.badges.filter(
      (t: string) => {
        return t !== tag
      }
    )
    this.init()
  }

  setDate(date: string) {
    if (this.specificDate === date) {
      return
    }
    // clear badges
    this.badges = []
    this.specificDate = date
    this.newsService.getByDate(date).subscribe(
      (data: any) => {
        this.news = data.data
        window.scrollTo({top: 0, behavior: 'smooth'});
      }
    )
  }

  clearDate() {
    this.specificDate = ""
    this.init()
  }
}
