import {Component} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  notificationDom: any


  notify(notifyMsg: string) {
    // add child node
    let node = document.createElement("div")
    node.className = "chat chat-end"
    node.style.opacity = "1"
    node.innerHTML = `<p class="chat-bubble chat-bubble-success">${notifyMsg}</p>`
    this.notificationDom.appendChild(node)
    let nodeRemoved = false
    // fade out
    setInterval(() => {
      let opacity = parseFloat(node.style.opacity)
      if (opacity <= 0) {
        // remove node
        if (nodeRemoved) {
          return
        }
        node.remove()
      }
      node.style.opacity = `${opacity - 0.02}`
    }, 60)
  }
}
