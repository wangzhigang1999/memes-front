import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  showHeader = true;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.handleNavigation();
      }
    });
  }

  handleNavigation() {
    // if from bbs page to other page, hide header
    this.showHeader = !this.router.url.includes("bbs");
  }

}
