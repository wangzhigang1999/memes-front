import {Component} from '@angular/core';

@Component({
  selector: 'app-fix-menu',
  templateUrl: './fix-menu.component.html',
  styleUrls: ['./fix-menu.component.css']
})
export class FixMenuComponent {

  moveToTop() {
    window.scrollTo({top: 0, behavior: 'smooth'});
  }
}
