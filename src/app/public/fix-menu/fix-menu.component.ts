import {Component, ElementRef, HostListener} from '@angular/core';
import {scrollToTop} from "../../utils";

@Component({
  selector: 'app-fix-menu',
  templateUrl: './fix-menu.component.html',
  styleUrls: ['./fix-menu.component.css']
})
export class FixMenuComponent {
  showMenu: boolean = false;


  constructor(private elementRef: ElementRef) {
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showMenu = false;
    }
  }


  moveToTop() {
    this.showMenu = !this.showMenu;
    scrollToTop()
  }
}
