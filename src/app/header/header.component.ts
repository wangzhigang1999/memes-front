import {Component} from '@angular/core';
import {Packet} from "../model/packet";
import {WSPacketType} from "../model/packet_type";
import {environment} from "../../environments/environment";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent {

    ws: WebSocket
    notificationDom: any
    wsUrl: string = "ws://localhost:8080/ws"
    currentOnlineNumber: number = 0


    constructor() {
        this.wsUrl = environment.websocket

        this.ws = new WebSocket(this.wsUrl)
        let firstOpen = true
        let lastNeeMemeNotifyTimestamp: number = 0

        this.ws.onmessage = (event) => {
            if (!this.notificationDom) {
                this.notificationDom = document.getElementById("notification")
            }

            let data: Packet = JSON.parse(event.data)
            let now = new Date().getTime();


            switch (data.type) {
                case WSPacketType.WHISPER:
                    this.notify(data.payload)
                    break
                case WSPacketType.REVIEW:
                    if (!lastNeeMemeNotifyTimestamp || (now - lastNeeMemeNotifyTimestamp > 30 * 1000)) {
                        this.notify("有新的 meme 图啦，稍后刷新查看")
                        lastNeeMemeNotifyTimestamp = now;
                    }
                    break
                case WSPacketType.ONLINE_NUMBER:
                    if (firstOpen) {
                        this.notify("当前共有 " + data.payload + " 人在线")
                        firstOpen = false
                    } else if (data.payload > this.currentOnlineNumber) {
                        this.notify("有新的用户上线啦, 当前共有 " + data.payload + " 人在线")
                    }
                    this.currentOnlineNumber = data.payload
                    break
            }


        }

        this.ws.onclose = (event) => {
            this.notify("连接已断开，正在尝试重连...")
            this.ws = new WebSocket(this.wsUrl)
        }

        this.ws.onerror = (event) => {
            this.notify(event.type + "，正在尝试重连...")
            this.ws = new WebSocket(this.wsUrl)
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
