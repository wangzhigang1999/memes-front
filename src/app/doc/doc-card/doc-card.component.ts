import {Component, Input} from '@angular/core';
import {Document} from "../../model/document";

import {authorized} from "../../utils";
import {DocService} from "../../service/doc.service";

@Component({
  selector: 'app-doc-card',
  templateUrl: './doc-card.component.html',
  styleUrls: ['./doc-card.component.css']
})
export class DocCardComponent {
  @Input() doc!: Document;
  visMessage = "点击修改可见性";

  constructor(private docService: DocService) {

  }

  ngAfterContentInit() {
    if (this.doc.cover_image == undefined) {
      this.doc.cover_image = "https://api.wannote.com/image/bing.php?rand=true"
    }
    this.setVisMessage()
  }

  setVisMessage() {
    if (this.doc.privateDoc) {
      this.visMessage = "点击公开"
    }else {
      this.visMessage = "点击隐藏"
    }
  }


  toEditor() {
    window.open(`/editor?id=${this.doc.id}`)
  }

  admin(): boolean {
    return authorized()
  }

  delete() {
    this.docService.deleteDoc(this.doc.id).subscribe(() => {
      window.location.reload()
    })

  }

  changeVis() {
    this.docService.markPrivate(this.doc.id, !this.doc.privateDoc).subscribe(
      () => {
        this.doc.privateDoc = !this.doc.privateDoc
        this.setVisMessage()
      }
    )
  }
}
