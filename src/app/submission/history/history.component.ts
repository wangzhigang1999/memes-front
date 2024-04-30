import {Component, OnInit} from '@angular/core';
import {SubmissionService} from '../../service/submission.service';
import {Submission} from '../../model/submission';
import {authorized} from '../../utils';

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
    this.selectedDate = date;
    this.service.getSubmissionByDate(date).subscribe((data: any) => {
      this.submissions = data.data;
      this.hasNext = date !== this.todayDate;
      this.nextMessage = this.hasNext ? '👉👉👉' : '🙈🙈🙈';
    });
  }

  changeDate(offset: number): void {
    const date = new Date(this.selectedDate);
    date.setDate(date.getDate() + offset);
    this.setDate(date.toISOString().split('T')[0]);
  }
}
