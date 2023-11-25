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

  results: Post[] = [];
  loading = true;

  ok = [100, 101, 102, 103, 200, 201, 202, 203, 204, 205, 206, 207, 208, 226, 300, 301, 302, 303, 304, 305, 306, 307, 308, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 416, 417, 418, 420, 421, 422, 423, 424, 425, 426, 429, 431, 444, 450, 451, 499, 500, 501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511, 599]

  randomCode = "https://http.cat/" + this.ok[Math.floor(Math.random() * this.ok.length)] + ".jpg"


  constructor(private searchService: SearchService) {
    this.loading = true;
    this.getLatest(20);
    setTimeout(
      () => {
        this.loading = false;
      },
      500
    )
  }

  search(keyword: string) {
    if (keyword == "") {
      return
    }
    // clear results
    this.results = [];

    // set loading
    this.loading = true;
    setTimeout(
      () => {
        // search by author
        this.searchByAuthor(keyword, true);
        // search by board
        this.searchByBoard(keyword);
        // search by keyword
        this.searchByKeyword(keyword);
        // set loading
        this.loading = false;
      },
      500
    )


  }

  searchByAuthor(author: string, cleanOld: boolean = false) {
    if (author == "") {
      return
    }
    this.keyword = author;
    if (cleanOld) {
      this.results = [];
    }
    this.searchService.getByAuthor(author).subscribe((res: any) => this.results.push(...res.data))

  }

  searchByBoard(board: string, cleanOld: boolean = false) {
    if (board == "") {
      return
    }
    this.keyword = board;
    if (cleanOld) {
      this.results = [];
    }
    this.searchService.getByBoard(board).subscribe((res: any) => this.results.push(...res.data))
  }


  private searchByKeyword(keyword: string) {
    if (keyword == "") {
      return
    }
    this.searchService.getByKeyword(keyword).subscribe((res: any) => this.results.push(...res.data))
  }

  private getLatest(number: number) {
    this.searchService.getLatest(number).subscribe((res) => {
      this.results.push(...res.data)
    })
  }
}
