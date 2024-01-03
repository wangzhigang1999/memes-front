import {Component, OnInit} from '@angular/core';
import {SubmissionService} from "../../service/submission.service";
import {Submission} from "../../model/submission";
import {authorized, scrollToTop} from "../../utils";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  history: string[] = []
  currentIndex = 0;

  preMessage = "🙈";
  nextMessage = "🙈";
  currentMessage = "🙈";


  hasNext = false;
  hasPrev = false;
  submissions: Submission[] = [];

  adminMode = false;

  constructor(private service: SubmissionService) {
    scrollToTop()
  }

  ngOnInit(): void {
    if (authorized()) {
      this.adminMode = true
    }

    let today = new Date()

    // YYYY-MM-DD for 7 days ago
    for (let i = 0; i < 7; i++) {
      let date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000)
      let month = date.getMonth() + 1
      let day = date.getDate()
      let year = date.getFullYear()
      // YYYY-MM-DD
      let dateString = `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`
      this.history.push(dateString)
    }

    // sort by date
    this.history.sort((a: string, b: string) => {
        return a < b ? -1 : 1;
      }
    )

    this.setIndex(this.history.length - 1)

  }

  hashNext(cur: number, total: number): boolean {
    return cur < total - 1;
  }

  hashPrev(cur: number): boolean {
    return cur > 0;
  }

  setIndex(index: number) {
    if (index < 0 || index >= this.history.length || index == this.currentIndex) {
      return;
    }
    this.currentIndex = index;
    this.hasNext = this.hashNext(this.currentIndex, this.history.length);
    this.hasPrev = this.hashPrev(this.currentIndex);
    this.currentMessage = this.history[this.currentIndex];
    this.nextMessage = this.hashNext(this.currentIndex, this.history.length) ? "👉👉👉" : "🙈没有了🙈";
    this.preMessage = this.hashPrev(this.currentIndex) ? "👈👈👈" : "🙈没有了🙈";
    this.service.getSubmissionByDate(this.history[this.currentIndex]).subscribe((data: any) => {
      this.submissions = data.data;
    })
    scrollToTop()
  }
}
