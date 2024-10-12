import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {authorized, getConfig, setConfig} from "../utils";
import {UserConfigItem} from "../model/user-config-item";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Response} from "../model/response";
import {SysConfigItem} from "../model/sys-config-item";
import {AdminService} from "../service/admin.service";

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './config.component.html',
  styleUrl: './config.component.css'
})
export class ConfigComponent {

  configMap: any = new Map<string, SysConfigItem[]>()
  protected readonly getConfig = getConfig;
  protected readonly setConfig = setConfig;
  protected readonly authorized = authorized;
  protected readonly JSON = JSON;

  configItems = [
    {
      label: '单栏模式',
      key: UserConfigItem.singleMode,
      description: '在浏览 meme 时，以一栏或多栏瀑布流的形式显示，移动端不生效',
    },
    {
      label: '隐藏点赞',
      key: UserConfigItem.disableLikeButton,
      description: '在浏览 meme 时，显示/隐藏点赞按钮，全局生效',
    }
  ];


  constructor(private admin: AdminService) {
    if (authorized()) {
      this.loadAdminConfig()
    }
  }

  setAdminConfig(key: string, value: string) {
    if (confirm("确定要修改吗？key: " + key + " value: " + value)) {
      this.admin.setConfig(key, value).subscribe(() => alert("设置成功"))
      setTimeout(() => this.loadAdminConfig(), 1000)
    }
  }

  loadAdminConfig() {
    this.configMap = new Map<string, SysConfigItem[]>()
    this.admin.getConfig().subscribe(
      (data: Response) => {
        let visData: SysConfigItem[] = data.data.filter((item: SysConfigItem) => item.visible);
        visData.forEach((item: SysConfigItem) => {
          switch (item.type) {
            case "BOOLEAN":
              item.value = item.value == 'true'
              break
            case "DOUBLE":
              item.value = Number.parseFloat(item.value)
              break
            case "INTEGER":
              item.value = Number.parseInt(item.value)
              break
            default:
              console.log("Not match")
          }
        })

        for (let item of visData) {
          if (this.configMap[item.type]) {
            this.configMap[item.type].push(item)
          } else {
            this.configMap[item.type] = [item]
          }
        }
      }
    )
  }


  removeBan(uuid: string) {
    if (confirm("确定要解封吗？uuid: " + uuid)) {
      this.admin.removeBlacklist(uuid).subscribe(() => alert("解封成功"))
      this.loadAdminConfig()
    }
  }
}
