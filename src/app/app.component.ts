import {Component} from '@angular/core';
import {getConfig, isSmallScreen} from "./utils";
import {UserConfigItem} from "./model/user-config-item";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  protected readonly getConfig = getConfig;
  protected readonly ConfigItem = UserConfigItem;
  protected readonly isSmallScreen = isSmallScreen;
}
