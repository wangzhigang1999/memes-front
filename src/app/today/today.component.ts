import {Component, ElementRef, ViewChild} from '@angular/core';
import {SubmissionService} from "../service/submission.service";

@Component({
  selector: 'app-today',
  templateUrl: './today.component.html',
  styleUrls: ['./today.component.css']
})
export class TodayComponent {

  @ViewChild('topButton') topButtonRef!: ElementRef;


  public submissions = []

  constructor(private service: SubmissionService) {
  }

  ngOnInit(): void {
    this.getTodaySubmissions()
  }

  getTodaySubmissions() {
    this.service.getTodaySubmissions().subscribe(data => {
      this.submissions = data.data.reverse()
    })
  }

  scrollToTop() {
    window.scrollTo({top: 0, behavior: 'smooth'});
  }
}
