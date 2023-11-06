import {Component} from '@angular/core';
import {Packet} from "../model/packet";
import {WSPacketType} from "../model/packet_type";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {


  num: number = 0
  ws: WebSocket
  notificationDom: any

  constructor() {
    this.ws = new WebSocket('wss://api.memes.bupt.site/ws')
    this.ws.onmessage = (event) => {
      if (!this.notificationDom) {
        this.notificationDom = document.getElementById("notification")
      }

      let data: Packet = JSON.parse(event.data)
      let notifyMsg = ""

      let showNotification = false

      switch (data.type) {
        case WSPacketType.WHISPER:
          notifyMsg = data.payload
          showNotification = true
          break
        case WSPacketType.REVIEW:
          notifyMsg = `有新的 meme 图啦，稍后刷新查看`
          showNotification = true
          break
      }

      if (showNotification) {
        this.notify(notifyMsg)
      }
    }

  }


  notify(notifyMsg: string) {
    // add child node
    let node = document.createElement("div")
    node.style.opacity = "1"
    node.innerHTML = `<div class="chat-end chat">
                            <p class=" chat-bubble chat-bubble-success">${notifyMsg}</p>
                           </div>`
    this.notificationDom.appendChild(node)
    let nodeRemoved = false
    // fade out
    setInterval(() => {
      let opacity = parseFloat(node.style.opacity)
      if (opacity <= 0.2) {
        // remove node
        if (nodeRemoved) {
          return
        }
        node.remove()
      }
      node.style.opacity = `${opacity - 0.01}`
    }, 100)
  }
}
