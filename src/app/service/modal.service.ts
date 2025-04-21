import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

export interface ModalConfig {
  title: string
  content: string
  showCloseButton?: boolean
  showBackdrop?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'
  type?: 'info' | 'success' | 'warning' | 'error'
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private showModalSubject = new BehaviorSubject<boolean>(false)
  private configSubject = new BehaviorSubject<ModalConfig>({
    title: '',
    content: '',
    showCloseButton: true,
    showBackdrop: true,
    size: 'md',
    type: 'info',
  })

  showModal$ = this.showModalSubject.asObservable()
  config$ = this.configSubject.asObservable()

  show(config: ModalConfig) {
    this.configSubject.next({
      ...this.configSubject.value,
      ...config,
    })
    this.showModalSubject.next(true)
  }

  hide() {
    this.showModalSubject.next(false)
    this.configSubject.next({
      title: '',
      content: '',
      showCloseButton: true,
      showBackdrop: true,
      size: 'md',
      type: 'info',
    })
  }
}
