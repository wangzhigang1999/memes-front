import {Component} from '@angular/core';
import {WSPacketType} from "../model/packet_type";
import {Packet} from "../model/packet";

@Component({
    selector: 'app-fix-panel',
    templateUrl: './fix-panel.component.html',
    styleUrls: ['./fix-panel.component.css']
})
export class FixPanelComponent {
    num: number = 0
    ws: WebSocket = new WebSocket('wss://api.memes.bupt.site/ws')
    // ws: WebSocket = new WebSocket('ws://localhost:8080/ws')
    sessionId: string = ''

    MAX_WHISPER_LENGTH = 150

    whisperList: {
        from: string,
        message: string,
    }[] = []
    userInput = "";

    panelCollapsed = true
    hasUnread = false

    emojiList: string[] = [
        "😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆",
        "😉", "😊", "😋", "😎", "😍", "😘", "😗", "😙",
        "😚", "🙂", "🤗", "🤩", "🤔", "🤨", "😐", "😑",
        "😶", "🙄", "😏", "😣", "😥", "😮", "🤐", "😯",
        "😪", "😫", "😴", "😌", "😛", "😜", "😝", "🤤",]

    constructor() {
        this.ws.onmessage = (event) => {
            let data: Packet = JSON.parse(event.data)
            switch (data.type) {
                case WSPacketType.ONLINE_NUMBER:
                    this.num = data.payload.online
                    break
                case WSPacketType.SESSION_RESPONSE:
                    this.sessionId = data.payload
                    break
                case WSPacketType.WHISPER:
                    // 不知道谁发的，或者自己发的，不收
                    if (data.sessionId == "" || data.sessionId == this.sessionId) {
                        break
                    }

                    // convert session id to emoji
                    let emoji = this.emojiList[parseInt(data.sessionId) % this.emojiList.length]
                    this.whisperList.push({
                        from: emoji,
                        message: data.payload
                    })
                    if (this.panelCollapsed) {
                        this.hasUnread = true
                    }
                    this.scrollToBottom()
                    break
            }
        }

        // bind enter key
        document.onkeydown = (event) => {
            if (event.key == "Enter") {
                this.sendWhisper(this.userInput)
            }
        }

        this.ws.onopen = () => {
            for (let i = 0; i < 10; i++) {
                if (this.sessionId != "") {
                    break
                }
                setTimeout(() => {
                    this.ws.send(
                        JSON.stringify({
                            type: WSPacketType.SESSION_REQUEST,
                            payload: ""
                        })
                    )
                }, 1000 * i / 2)
            }
        }
    }

    sendWhisper(msg: string) {
        if (msg == "" || msg.replace(/\s/g, "").length == 0) {
            return
        }
        if (msg.length > this.MAX_WHISPER_LENGTH) {
            alert("消息过长")
            return
        }
        this.ws.send(
            JSON.stringify({
                type: WSPacketType.WHISPER,
                payload: msg
            })
        )
        this.userInput = ""
        this.whisperList.push({
            from: this.sessionId,
            message: msg
        })
        this.scrollToBottom()
    }

    scrollToBottom() {
        setTimeout(() => {
            let scrollDiv = document.getElementById("whisper")
            // @ts-ignore
            scrollDiv.scrollTo(0, scrollDiv.scrollHeight)
        }, 500)
    }

}
