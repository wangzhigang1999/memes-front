import { Component, OnInit } from '@angular/core'
import { UserConfigItem } from './model/user-config-item'
import { DescriptionModalService } from './service/description-modal.service'
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

  showDescriptionModal = false
  currentDescription = ''

  constructor(private descriptionModalService: DescriptionModalService) {}

  ngOnInit() {
    this.descriptionModalService.showModal$.subscribe(show => {
      this.showDescriptionModal = show
    })

    this.descriptionModalService.description$.subscribe(description => {
      this.currentDescription = description
    })
  }

  closeDescription() {
    this.descriptionModalService.hide()
  }
}
