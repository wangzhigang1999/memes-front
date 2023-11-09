import {Component, ElementRef, HostListener} from '@angular/core';

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
    window.scrollTo({top: 0, behavior: 'smooth'});
  }
}
