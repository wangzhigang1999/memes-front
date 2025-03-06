import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Submission} from "../../../model/submission";
import {ReviewService} from "../../../service/review.service";
import {ImageGroupService} from "../../../service/image-group.service";
import {getConfig, isSmallScreen} from "../../../utils";
import {UserConfigItem} from "../../../model/user-config-item";

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
  @Input() disableBorder = false;
  defaultImage = "assets/welcome.webp";
  protected readonly getConfig = getConfig;
  protected readonly ConfigItem = UserConfigItem;
  protected readonly isSmallScreen = isSmallScreen;
  @Output() private reviewed = new EventEmitter<string[]>();

  constructor(private service: ReviewService, private groupService: ImageGroupService) {
  }

  reject(id: string) {
    this.service.review(id, "reject").subscribe(() => this.hidden([id], false))
  }

  accept(id: string) {
    this.service.review(id, "accept").subscribe(() => this.hidden([id], true))
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
  }

  /**
   * 双击后，跳转到下一个的开始，类似 center
   */
  toNext() {
    let dom = document.getElementById(this.submission.id);
    if (dom != null) {
      dom.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
    }
  }
}
