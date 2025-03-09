import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {getConfig, setConfig} from "../utils";
import {ConfigItem} from "../model/config-item";
import {UserConfigItem} from "../model/user-config-item";


@Component({
  selector: 'app-config',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './config.component.html',
  styleUrl: './config.component.css'
})
export class ConfigComponent implements OnInit {

  configItems: ConfigItem[] = []; // Renamed to configItems, now holds all configs
  protected readonly setConfig = setConfig;
  configDefinitions: Omit<any, 'value'>[] = [
    {
      key: UserConfigItem.singleColumn,
      visibleName: '单栏模式',
      description: '在浏览 meme 时，以一栏或多栏瀑布流的形式显示，移动端不生效',
      type: 'BOOLEAN',
      visible: true,
    },
    {
      key: UserConfigItem.disableLikeButton,
      visibleName: '隐藏点赞',
      description: '在浏览 meme 时，显示/隐藏点赞按钮，全局生效',
      type: 'BOOLEAN',
      visible: true,
    }
  ];
  protected readonly getConfig = getConfig;

  constructor() {

  }

  ngOnInit(): void {
    this.loadConfigs();
  }

  loadConfigs() {
    //@ts-ignore
    this.configItems = this.configDefinitions.map(def => ({
      ...def,
      //@ts-ignore
      value: this.getInitialConfigValue(def.key, def.type), // Get initial value based on type
    }));
  }


  getInitialConfigValue(key: string, type: string): any {
    let storedValue = getConfig(key, type); // 直接调用新的 getConfig

    if (storedValue !== null && storedValue !== undefined) {
      return storedValue;
    }

    // 默认值
    if (type === 'BOOLEAN') return false;
    if (type === 'INTEGER') return 0;
    if (type === 'STRING') return '';

    return null;
  }

}
