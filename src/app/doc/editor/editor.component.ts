import {Component} from '@angular/core';
import {DocService} from "../../service/doc.service";
import {ActivatedRoute} from "@angular/router";
import Vditor from "vditor";

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent {

  docID !: string;

  readonly = false;

  defaultValue = '# Hello,World!';

  defaultTitle = '新建文档';

  defaultDoc: any
  vditor: any;

  constructor(private docService: DocService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(
      (params: any) => {
        this.docID = params['id'];
      })
  }

  ngOnInit(): void {

    if (this.docID == undefined) {
      this.readonly = false;
      this.defaultDoc = {
        title: this.defaultTitle,
      }
      this.initEditor();
    } else {
      this.docService.getById(this.docID).subscribe(
        (doc) => {
          doc = doc.data
          this.defaultValue = doc.content;
          this.defaultTitle = doc.title;
          this.defaultDoc = doc;
          this.initEditor()
        }
      )
    }
  }

  initEditor() {
    let input = document.getElementById("ghost-editor");
    input?.setAttribute("value", this.defaultDoc.title);
    input?.addEventListener("input", (event) => {
      this.defaultTitle = (event.target as HTMLInputElement).value;
      this.upsert();
    });
    let that = this;
    this.vditor = new Vditor('editor', {
      height: "100%",
      outline: {
        enable: false,
        position: 'left',
      },
      toolbarConfig: {
        pin: false,
      },
      cache: {
        enable: true,
      },
      counter: {
        enable: true,
      },
      after: () => {
        this.vditor.setValue(this.defaultValue);
      },
      preview: {
        markdown: {
          autoSpace: true,
        }
      },
      input(value: string) {
        that.defaultValue = value;
        that.upsert();
      }
    });

  }

  upsert() {
    this.defaultDoc.title = this.defaultTitle.trim();
    this.defaultDoc.content = this.defaultValue;
    this.docService.upsertDoc(this.defaultDoc).subscribe(
      (res: any) => {
        this.defaultDoc = res.data;
      }
    )
  }
}
