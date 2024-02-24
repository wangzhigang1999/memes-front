import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  showHeader = true;

  holidayEmoji: any = {
    "1-1": "🎉",
    "2-14": "💖",
    "3-8": "🌸",
    "3-14": "🍀",
    "4-1": "🤡",
    "4-4": "🌱",
    "4-22": "🌍",
    "5-1": "🎋",
    "5-5": "🎏",
    "6-1": "🏮",
    "6-21": "🌞",
    "6-25": "🐉",
    "7-4": "🎆",
    "9-7": "📚",
    "9-10": "🏮",
    "10-1": "🎊",
    "10-31": "🎃",
    "11-11": "🎖️",
    "12-24": "🕯️",
    "12-25": "🎄",
  }

  emojiList = ['😀', '😃', '😄', '😁', '😆', '😂', '🤣', '🥲',
    '☺️', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙',
    '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳']
  selectedEmoji = "😀";

  constructor(private router: Router) {


    // if it's holiday, show holiday emoji
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    let date = month + "-" + day;
    if (this.holidayEmoji[date]) {
      this.selectedEmoji = this.holidayEmoji[date];
      return
    }

    // choose random emoji
    this.selectedEmoji = this.emojiList[Math.floor(Math.random() * this.emojiList.length)];

  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.handleNavigation();
      }
    });
  }

  handleNavigation() {
    // if from bbs page to other page, hide header
    this.showHeader = !this.router.url.includes("bbs");
  }

}
