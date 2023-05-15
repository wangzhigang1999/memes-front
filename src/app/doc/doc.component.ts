import {Component} from '@angular/core';
import {DocService} from "../service/doc.service";
import {Document} from "../model/document";
import {Page} from "../model/page";

@Component({
  selector: 'app-doc',
  templateUrl: './doc.component.html',
  styleUrls: ['./doc.component.css']
})
export class DocComponent {

  public docs: Document[] = [];

  curElement: Set<string> = new Set<string>();
  pageSize: number = 8;
  pageNum: number = 1;

  total: number = 0;
  lastId = "";

  constructor(private docService: DocService) {
  }

  ngOnInit(): void {
    this.getDoc();
  }

  getDoc() {
    this.docService.listDocsByPage(this.lastId, this.pageNum, this.pageSize).subscribe(
      (data: any) => {
        const page: Page<Document> = data.data
        this.docs = page.list
        this.pageNum = page.pageNum
        this.pageSize = page.pageSize
        this.total = page.total

        this.docs.forEach(
          (doc: Document) => {
            this.curElement.add(doc.id)
          }
        )
        // get lastId
        if (this.docs.length > 0) {
          this.lastId = this.docs[this.docs.length - 1].id
        }
      })

  }

  onScroll() {
    if (this.docs.length >= this.total) {
      return
    }
    this.docService.listDocsByPage(this.lastId, this.pageNum + 1, this.pageSize).subscribe(
      (data: any) => {
        const page: Page<Document> = data.data
        page.list.forEach(
          (doc: Document) => {
            if (!this.curElement.has(doc.id)) {
              this.docs.push(doc)
              this.curElement.add(doc.id)
            }
          }
        )
        this.pageNum = page.pageNum
        this.lastId = this.docs[this.docs.length - 1].id
      }
    )
  }
}
