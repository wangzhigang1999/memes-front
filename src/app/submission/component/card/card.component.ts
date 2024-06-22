import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Submission} from "../../../model/submission";
import {ReviewService} from "../../../service/review.service";
import {ImageGroupService} from "../../../service/image-group.service";
import {getConfig, isSmallScreen} from "../../../utils";
import {UserConfigItem} from "../../../model/user-config-item";
import {SubmissionService} from "../../../service/submission.service";
import {Response} from "../../../model/response";

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {

  @Input() submission!: Submission;
  @Input() review!: boolean;
  @Input() admin = false;
  @Input() showVoteBar = true;
  @Input() nextID = '';
  @Input() lazy = false;
  defaultImage = "assets/welcome.webp";
  @Output() private reviewed = new EventEmitter<string[]>();

  similarSubmissions: Submission[] = [];

  constructor(private service: ReviewService, private groupService: ImageGroupService, private submissionService: SubmissionService) {
  }


  reject(id: string) {
    this.service.reject(id).subscribe(() => this.hidden([id], false))
  }

  accept(id: string) {
    this.service.accept(id).subscribe(() => this.hidden([id], true))
  }

  hidden(ids: string[], accept: boolean = true) {
    let msg: string[] = []
    ids.forEach(
      id => {
        let dom = document.getElementById(id);
        if (dom != null) {
          dom.parentElement?.remove();
          msg.push(id + (accept ? "+" : "-"))
        }
      }
    )
    this.reviewed.emit(msg)
    // scroll to top
    window.scrollTo(0, 0);
  }

  merge(id: string, nextID: string) {
    if (!nextID) {
      return
    }
    if (this.submission.submissionType === "BATCH") {
      this.groupService.addImageToGroup(id, [nextID]).subscribe(() => this.hidden([id, nextID], true))
    } else {
      this.groupService.createImageGroup([id, nextID]).subscribe(() => this.hidden([id, nextID], true))
    }

  }

  center() {
    let dom = document.getElementById(this.submission.id);
    if (dom != null) {
      dom.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
    }
    // this.loadSimilar()
  }

  loadSimilar(force: boolean = false) {
    // if loaded before, return
    if (this.similarSubmissions.length > 0 && !force) {
      return
    }
    this.submissionService.getSimilar(this.submission.id, 3).subscribe((res: Response) => {
      for (let i = 0; i < res.data.length - 1; i++) {
        this.similarSubmissions = res.data
      }
    })
  }

  delete(id: string) {
    // if (!confirm("真的要删除吗？")) {
    //   return
    // }
    // this.submissionService.deleteById(id).subscribe(() => this.loadSimilar(true))
  }

  protected readonly getConfig = getConfig;
  protected readonly ConfigItem = UserConfigItem;
  protected readonly isSmallScreen = isSmallScreen;
}
