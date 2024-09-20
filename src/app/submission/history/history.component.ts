import {Component, OnInit} from '@angular/core';
import {SubmissionService} from '../../service/submission.service';
import {Submission} from '../../model/submission';
import {authorized} from '../../utils';
import {Response} from "../../model/response";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  preMessage = '👈👈👈';
  nextMessage = '🙈';
  hasNext = false;
  submissions: Submission[] = [];
  idSet = new Set<string>();
  lastID = "";
  adminMode = false;
  selectedDate: string;
  todayDate: string;

  constructor(private service: SubmissionService) {
    const today = this.formatDate(new Date());
    this.selectedDate = today;
    this.todayDate = today;
  }

  ngOnInit(): void {
    this.adminMode = authorized();
    this.setDate(this.selectedDate);
  }

  setDate(date: string): void {
    if (!date) {
      return;
    }
    this.idSet.clear();
    this.submissions = [];
    this.selectedDate = date;
    this.update(this.selectedDate);
    this.hasNext = date !== this.todayDate;
    this.nextMessage = this.hasNext ? '👉👉👉' : '🙈🙈🙈';
  }

  changeDate(offset: number): void {
    const date = new Date(this.selectedDate);
    date.setDate(date.getDate() + offset);
    this.setDate(this.formatDate(date));
  }

  update(date: string = ""): void {
    this.service.listSubmissions("", 200, date).subscribe((data: Response) => {
      const uniqueData = data.data.list.filter((item: Submission) => !this.idSet.has(item.id));
      this.submissions.push(...uniqueData);
      uniqueData.forEach((item: Submission) => this.idSet.add(item.id));
      this.lastID = this.submissions.length > 0 ? this.submissions[this.submissions.length - 1].id : "";
      this.hasNext = date !== this.todayDate;
      this.nextMessage = this.hasNext ? '👉👉👉' : '🙈🙈🙈';
    });
  }

  private formatDate(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }
}
