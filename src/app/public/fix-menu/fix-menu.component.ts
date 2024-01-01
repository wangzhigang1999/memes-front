import {Component, ElementRef, HostListener, OnInit} from '@angular/core';
import {scrollToTop} from "../../utils";
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-fix-menu',
  templateUrl: './fix-menu.component.html',
  styleUrls: ['./fix-menu.component.css']
})
export class FixMenuComponent implements OnInit {
  showMenu: boolean = false;
  showFixedMenu = true;

  blockPageList = ["submit", "share"]


  constructor(private elementRef: ElementRef, private router: Router) {
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.handleNavigation();
      }
    });
  }

  handleNavigation() {
    // 获取当前路由
    const currentRoute = this.router.url;
    // 根据当前路由来决定是否显示菜单
    this.showFixedMenu = !this.blockPageList.some((page) => currentRoute.includes(page));
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
