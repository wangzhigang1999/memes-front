import {Component} from '@angular/core';
import {getConfig} from "./utils";
import {UserConfigItem} from "./model/user-config-item";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  protected readonly getConfig = getConfig;
  protected readonly ConfigItem = UserConfigItem;
}
