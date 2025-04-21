import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class DescriptionModalService {
  private showModalSubject = new BehaviorSubject<boolean>(false)
  private descriptionSubject = new BehaviorSubject<string>('')

  showModal$ = this.showModalSubject.asObservable()
  description$ = this.descriptionSubject.asObservable()

  show(description: string) {
    this.descriptionSubject.next(description)
    this.showModalSubject.next(true)
  }

  hide() {
    this.showModalSubject.next(false)
    this.descriptionSubject.next('')
  }
}
