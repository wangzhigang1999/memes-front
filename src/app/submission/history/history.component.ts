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
    this.selectedDate = this.today();
    this.todayDate = this.today();
  }

  ngOnInit(): void {
    this.adminMode = authorized();
    this.setDate(this.selectedDate);
  }

  today(): string {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
  }

  setDate(date: string): void {
    if (date == undefined || date === '') {
      return;
    }
    this.idSet.clear()
    this.submissions = [];
    this.selectedDate = date;
    this.update(this.selectedDate)
  }

  changeDate(offset: number): void {
    const date = new Date(this.selectedDate);
    date.setDate(date.getDate() + offset);
    this.setDate(date.toISOString().split('T')[0]);
  }

  update(date: string = "") {
    this.service.listSubmissions(this.lastID, 20, date).subscribe((data: Response) => {
      const uniqueData: Submission[] = data.data.list.filter((item: Submission) => !this.idSet.has(item.id));
      this.submissions.push(...uniqueData);
      uniqueData.forEach((item: Submission) => this.idSet.add(item.id));
      this.lastID = this.submissions[this.submissions.length - 1].id;
      this.hasNext = date !== this.todayDate;
      this.nextMessage = this.hasNext ? '👉👉👉' : '🙈🙈🙈';
    });
  }
}
