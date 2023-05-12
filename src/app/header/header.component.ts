import {Component} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  showEditorTitle(): boolean {
    // get current url
    let url = window.location.href;
    // if url contains 'editor', return true
    return url.indexOf('editor') != -1;
  }
}
