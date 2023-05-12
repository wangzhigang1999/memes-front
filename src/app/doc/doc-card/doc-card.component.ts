import {Component, Input} from '@angular/core';
import {Document} from "../../model/document";

@Component({
  selector: 'app-doc-card',
  templateUrl: './doc-card.component.html',
  styleUrls: ['./doc-card.component.css']
})
export class DocCardComponent {
  @Input() doc!: Document;

  constructor() {
  }

  ngAfterContentInit() {
    // if (this.doc.cover_image == undefined) {
    //   this.doc.cover_image = "assets/welcome.webp"
    // }
  }


  toEditor() {
    window.open(`/editor/${this.doc.id}`)
  }
}
