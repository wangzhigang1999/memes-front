import { AfterViewInit, Component } from '@angular/core';
import { driver } from "driver.js";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    if (this.shouldNotice()) {
      const driverObj = driver();
      driverObj.highlight({
        element: '#menu',
        popover: {
          title: '',
          description: '点击展开，快速回到顶部或者去吐槽~',
          align: "end",
          side: "left"
        }
      });
      localStorage.setItem('menu', 'true');
    }
  }

  shouldNotice(): boolean {
    if (window.location.pathname !== '/') {
      return false;
    }
    return localStorage.getItem('menu') === null;
  }
}
