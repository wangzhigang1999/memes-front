import { Component } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Response } from "../../model/response";
import { Submission } from "../../model/submission";
import { SubmissionService } from "../../service/submission.service";
import { authorized } from "../../utils";


@Component({
  selector: 'app-similar',
  templateUrl: './similar.component.html',
  styleUrls: ['./similar.component.css']
})
export class SimilarComponent {

  id: string = ""
  submissions: Submission[] = []
  adminMode: boolean = false

  constructor(private submissionService: SubmissionService, private router: ActivatedRoute) {
    this.adminMode = authorized()

    this.router.params.subscribe(params => {
      this.id = params['id'];
      this.fetchMeme(this.id)
    });
  }

  fetchMeme(id: string) {
    this.submissions = []
    this.submissionService.getById(id).subscribe((res: Response) => this.submissions.push(res.data))
    this.submissionService.getSimilar(id, 50).subscribe((res: Response) => {
      for (let i = 0; i < res.data.length; i++) {
        this.submissions.push(res.data[i])
      }
    })
  }
}
