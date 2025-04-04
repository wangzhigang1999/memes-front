import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { authorized, getConfig, setConfig } from '../utils'
import { Config } from '../model/config'
import { UserConfigItem } from '../model/user-config-item'
import { AdminService } from '../service/admin.service'
import { Response } from '../model/response'

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './config.component.html',
  styleUrl: './config.component.css',
})
export class ConfigComponent implements OnInit {
  localConfigs: Config[] = [] // Renamed to configItems, now holds all configs
  configDefinitions: Omit<any, 'value'>[] = [
    {
      configKey: UserConfigItem.singleColumnDisplay,
      visibleName: '单栏显示模式',
      description: '在浏览 meme 时，以一栏或多栏瀑布流的形式显示（移动端不生效）',
      type: 'BOOLEAN',
      visible: true,
    },
    {
      configKey: UserConfigItem.hideLikeButton,
      visibleName: '隐藏点赞按钮',
      description: '在浏览 meme 时，选择是否显示点赞按钮（全局生效）',
      type: 'BOOLEAN',
      visible: true,
    },
    {
      configKey: UserConfigItem.randomFetching,
      visibleName: '随机获取内容',
      description: '在浏览 meme 时，每次随机获取内容而不是按照时间顺序',
      type: 'BOOLEAN',
      visible: true,
    },
  ]
  protected readonly setConfig = setConfig
  protected readonly getConfig = getConfig

  remoteConfigs: Config[] = []
  protected readonly authorized = authorized

  ngOnInit(): void {
    this.loadConfigs()
  }

  getLocalInitialConfigValue(key: string, type: string): any {
    let storedValue = getConfig(key, type)
    if (storedValue !== null && storedValue !== undefined) {
      return storedValue
    }
    if (type === 'BOOLEAN') return false
    if (type === 'INTEGER') return 0
    if (type === 'STRING') return ''
    return null
  }

  constructor(private adminService: AdminService) {}

  toggleRemoteBoolTypeConfig(config: Config): void {
    const newValue = config.value === 'true' ? 'false' : 'true'
    this.setRemoteConfig(config.id, newValue)
  }

  setRemoteConfig(id: number | undefined, value: string) {
    if (id === undefined) {
      console.error('Config ID is undefined')
      return
    }

    this.adminService.setConfig(id, value).subscribe({
      next: (response: Response) => {
        console.log('Config updated:', response.message)
      },
      error: error => {
        console.error('Failed to update config:', error)
        alert('配置更新失败：' + (error.message || '未知错误'))
      },
    })
  }

  loadConfigs() {
    //@ts-ignore
    this.localConfigs = this.configDefinitions.map(def => ({
      ...def,
      value: this.getLocalInitialConfigValue(def['key'], def['type']),
    }))

    // 加载远程配置
    if (authorized()) {
      this.adminService.listConfig().subscribe({
        next: (response: Response) => {
          this.remoteConfigs = response.data || []
          // 确保远程配置的constraints存在
          this.remoteConfigs.forEach(config => {
            // 如果constraints不存在，创建一个空对象
            if (!config.constraints) {
              config.constraints = {}
            }
          })
        },
        error: error => {
          console.error('Error fetching configs:', error)
        },
      })
    }
  }
}
