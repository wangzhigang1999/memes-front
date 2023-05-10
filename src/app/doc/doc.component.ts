import {Component} from '@angular/core';
import {DocService} from "../service/doc.service";
import {Document} from "../model/document";

@Component({
  selector: 'app-doc',
  templateUrl: './doc.component.html',
  styleUrls: ['./doc.component.css']
})
export class DocComponent {

  public docs: Document[] = []

  constructor(private docService: DocService) {
  }

  ngOnInit(): void {
    this.getDoc();
  }

  getDoc() {
    this.docService.listDocs().subscribe(
      (data: any) => {
        this.docs = data.data
      }
    )

  }

}
