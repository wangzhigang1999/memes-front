import {Component, HostListener, Inject} from '@angular/core';
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  protected readonly window = window;

  constructor(@Inject(DOCUMENT) private document: any) {
  }

  elem: any;
  showHeader = true;

  ngOnInit() {
    this.elem = document.documentElement;
  }

  openFullscreen() {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
      this.showHeader = false;
    }
  }


  // listen to fullscreenchange event
  @HostListener('document:fullscreenchange', ['$event']) onFullScreenChange(event: any) {
    if (!this.document.fullscreenElement) {
      this.showHeader = true;
    }
  }

}
