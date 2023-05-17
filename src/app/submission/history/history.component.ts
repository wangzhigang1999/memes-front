import {Component} from '@angular/core';
import {SubmissionService} from "../../service/submission.service";
import {Submission} from "../../model/submission";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent {

  history: any[] = []
  currentIndex = 0;

  preMessage = "🙈";
  nextMessage = "🙈";
  currentMessage = "🙈";


  hasNext = false;
  hasPrev = false;
  submissions: Submission[] = [];


  bottomMessage = "🤖 ~没有更多了~ 🤖";
  img = "assets/welcome.webp";

  constructor(private service: SubmissionService) {
  }

  ngOnInit(): void {
    this.service.getHistory().subscribe((data: any) => {

      this.history = data.data;
      let total = this.history.length;

      if (total > 0) {
        // sort by date YYYY-MM-DD
        this.history = this.history.sort((a, b) => {
          return new Date(a).getTime() - new Date(b).getTime();
        })
        let last = this.history[total - 1];
        this.currentIndex = total - 1;
        this.hasNext = this.hashNext(this.currentIndex, total);
        this.hasPrev = this.hashPrev(this.currentIndex);

        this.service.getSubmission(last).subscribe((data: any) => {
          this.submissions = data.data;
        })

        this.currentMessage = this.history[this.currentIndex];
        this.nextMessage = this.hashNext(this.currentIndex, total) ? "👉👉👉" : "🙈没有了🙈";
        this.preMessage = this.hashPrev(this.currentIndex) ? "👈👈👈" : "🙈没有了🙈";
      }
    })

  }

  hashNext(cur: number, total: number): boolean {
    return cur < total - 1;
  }

  hashPrev(cur: number): boolean {
    return cur > 0;
  }

  setCur(index: number) {
    this.currentIndex = index;
    this.hasNext = this.hashNext(this.currentIndex, this.history.length);
    this.hasPrev = this.hashPrev(this.currentIndex);
    this.currentMessage = this.history[this.currentIndex];
    this.nextMessage = this.hashNext(this.currentIndex, this.history.length) ? "👉👉👉" : "🙈没有了🙈";
    this.preMessage = this.hashPrev(this.currentIndex) ? "👈👈👈" : "🙈没有了🙈";
    this.service.getSubmission(this.history[this.currentIndex]).subscribe((data: any) => {
      this.submissions = data.data;
    })
  }
}
