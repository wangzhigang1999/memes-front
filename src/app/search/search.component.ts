import {Component} from '@angular/core';
import {SearchService} from "../service/search.service";
import {Post} from "../model/post";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  keyword = "";

  lastID = ""

  idSet = new Set<string>();

  posts: Post[] = [];
  loading = true;
  pageSize = 20;

  ok = [100, 101, 102, 103, 200, 201, 202, 203, 204, 205, 206, 207, 208, 226, 300, 301, 302, 303, 304, 305, 306, 307, 308, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 416, 417, 418, 420, 421, 422, 423, 424, 425, 426, 429, 431, 444, 450, 451, 499, 500, 501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511, 599]
  randomCode = "https://http.cat/" + this.ok[Math.floor(Math.random() * this.ok.length)] + ".jpg"


  constructor(private searchService: SearchService) {
    this.loading = true;
    this.search(true)
    setTimeout(() => this.loading = false, 500)
  }

  search(clear: boolean = false) {
    if (clear) {
      this.posts = [];
      this.idSet.clear()
      this.lastID = "";
    }
    this.searchService.listPost(this.pageSize, this.lastID, this.keyword, this.keyword, this.keyword)
      .subscribe((res: any) => {
        const uniqueData = res.data.list.filter((obj: any) => !this.idSet.has(obj.id));
        this.posts.push(...uniqueData);
        uniqueData.forEach((obj: any) => this.idSet.add(obj.id));
        this.lastID = this.posts[this.posts.length - 1].id;
      })
  }
}
