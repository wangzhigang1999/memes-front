import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { UserConfigItem } from './model/user-config-item'
import { ModalConfig, ModalService } from './service/modal.service'
import { getConfig, isSmallScreen } from './utils'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  protected readonly getConfig = getConfig
  protected readonly ConfigItem = UserConfigItem
  protected readonly isSmallScreen = isSmallScreen

  showModal = false
  modalConfig: ModalConfig = {
    title: '',
    content: '',
    showCloseButton: true,
    showBackdrop: true,
    size: 'md',
    type: 'info',
  }

  isGoodbyePage = false

  constructor(public modalService: ModalService, private router: Router) {}

  ngOnInit() {
    this.modalService.showModal$.subscribe(show => {
      this.showModal = show
    })

    this.modalService.config$.subscribe(config => {
      this.modalConfig = config
    })

    // 检测是否为告别页面
    this.router.events.subscribe(() => {
      this.isGoodbyePage = this.router.url === '/' || this.router.url === '/goodbye'
    })
  }
}
