import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {getConfig, setConfig} from "../utils";
import {UserConfigItem} from "../model/user-config-item";
import {ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-userconf',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-conf.component.html',
  styleUrl: './user-conf.component.css'
})
export class UserConfComponent {

  protected readonly getConfig = getConfig;
  protected readonly setConfig = setConfig;
  protected readonly ConfigItem = UserConfigItem;
}
