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

    lastNeeMemeNotifyTimestamp: number = 0

    constructor() {
        this.ws = new WebSocket('wss://api.memes.bupt.site/ws')
        this.ws.onmessage = (event) => {
            if (!this.notificationDom) {
                this.notificationDom = document.getElementById("notification")
            }

            let data: Packet = JSON.parse(event.data)
            let notifyMsg = ""

            let showNotification = false

            let now = new Date().getTime();

            switch (data.type) {
                case WSPacketType.WHISPER:
                    notifyMsg = data.payload
                    showNotification = true
                    break
                case WSPacketType.REVIEW:
                    if (!this.lastNeeMemeNotifyTimestamp || (now - this.lastNeeMemeNotifyTimestamp > 30 * 1000)) {
                        notifyMsg = `有新的 meme 图啦，稍后刷新查看`
                        showNotification = true
                        this.lastNeeMemeNotifyTimestamp = now;
                    }
                    console.log(now)
                    console.log(this.lastNeeMemeNotifyTimestamp)
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
        node.className = "chat chat-end"
        node.style.opacity = "1"
        node.innerHTML = `<p class="chat-bubble chat-bubble-success">${notifyMsg}</p>`
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
