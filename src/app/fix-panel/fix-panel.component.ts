import {Component} from '@angular/core';

@Component({
  selector: 'app-fix-panel',
  templateUrl: './fix-panel.component.html',
  styleUrls: ['./fix-panel.component.css']
})
export class FixPanelComponent {
  num: number = 0
  ws: WebSocket = new WebSocket('wss://api.memes.bupt.site/ws')

  constructor() {
    this.ws.onmessage = (event) => {
      let data = JSON.parse(event.data)
      if (data.headers.type === 'ONLINE_NUMBER') {
        this.num = data.payload.online
      }
    }

  }

}
