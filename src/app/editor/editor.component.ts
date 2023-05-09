import {Component} from '@angular/core';
import {defaultValueCtx, Editor, editorViewOptionsCtx, rootCtx} from "@milkdown/core";
import {nord} from "@milkdown/theme-nord";
import {commonmark} from "@milkdown/preset-commonmark";
import {history} from "@milkdown/plugin-history";
import {clipboard} from "@milkdown/plugin-clipboard";
import {cursor} from "@milkdown/plugin-cursor";
import {prism, prismConfig} from "@milkdown/plugin-prism";
import {listener, listenerCtx} from '@milkdown/plugin-listener';
import {emoji} from "@milkdown/plugin-emoji";
import {indent} from "@milkdown/plugin-indent";
import {upload} from "@milkdown/plugin-upload";
import {trailing} from "@milkdown/plugin-trailing";

import markdown from 'refractor/lang/markdown'
import css from 'refractor/lang/css'
import javascript from 'refractor/lang/javascript'
import typescript from 'refractor/lang/typescript'
import jsx from 'refractor/lang/jsx'
import tsx from 'refractor/lang/tsx'
import java from 'refractor/lang/java'

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent {

  readonly = false;

  defaultValue = '# Hello,World!';

  ngAfterViewInit() {

    const editable = () => !this.readonly;


    let output = '';
    Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, document.getElementById('editor'))
        ctx.set(defaultValueCtx, this.defaultValue);
      })
      .config((ctx) => {
        ctx.get(listenerCtx).markdownUpdated((ctx, markdown, prevMarkdown) => {
          output = markdown;
        });
      })
      .config((ctx) => {
        ctx.update(editorViewOptionsCtx, (prev) => ({
          ...prev,
          editable,
        }))
      })
      .config((ctx) => {
        ctx.set(prismConfig.key, {
          configureRefractor: (refractor) => {
            refractor.register(markdown)
            refractor.register(css)
            refractor.register(javascript)
            refractor.register(typescript)
            refractor.register(jsx)
            refractor.register(tsx)
            refractor.register(java)
          },
        })
      })
      .config(nord)
      .use(commonmark).use(history).use(clipboard).use(cursor).use(prism).use(listener).use(emoji).use(indent).use(upload)
      .use(trailing)
      .create();

  }
}
