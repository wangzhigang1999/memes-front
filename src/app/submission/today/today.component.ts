import {Component} from '@angular/core';
import {Submission} from "../../model/submission";
import {SubmissionService} from "../../service/submission.service";
import {authorized} from "../../utils";
import {Response} from "../../model/response";

@Component({
  selector: 'app-today',
  templateUrl: './today.component.html',
  styleUrls: ['./today.component.css']
})
export class TodayComponent {

  public submissions: Submission[] = []
  idSet = new Set<string>();
  lastId = "";
  date = ""
  adminMode = false;
  private requesting: boolean = false

  constructor(private service: SubmissionService) {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    this.date = `${year}-${month}-${day}`;
  }

  ngOnInit(): void {
    this.idSet.clear()
    this.submissions = []
    this.adminMode = authorized()
    this.update()
  }

  update() {
    if (this.requesting) {
      return
    }
    this.requesting = true
    setTimeout(() => this.requesting = false, 5000)
    this.service.listSubmissions(this.lastId, 20, this.date).subscribe(
      (data: Response) => {
        const uniqueData: Submission [] = data.data.list.filter((item: Submission) => !this.idSet.has(item.id))
        this.submissions.push(...uniqueData)
        uniqueData.forEach((item: Submission) => this.idSet.add(item.id))
        this.lastId = this.submissions[this.submissions.length - 1].id
      }
    )
  }
}
