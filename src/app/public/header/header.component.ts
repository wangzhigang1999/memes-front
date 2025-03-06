import {Component, HostListener, OnInit} from '@angular/core';
import {Router} from "@angular/router";

const HOLIDAY_EMOJI: { [key: string]: string } = {
  "1-1": "🎉",
  "2-14": "💖",
  "3-8": "🌸",
  "3-14": "🍀",
  "4-1": "🤡",
  "4-4": "🌱",
  "4-22": "🌍",
  "5-1": "🎋",
  "6-1": "🌞",
  "6-25": "🐉",
  "9-10": "📚",
  "10-1": "🎊",
  "10-31": "🎃",
  "11-11": "🎖️",
  "12-24": "🕯️",
  "12-25": "🎄",
};

const EMOJI_LIST: string[] = ['😀', '😃', '😄', '😁', '😆', '😂', '🤣', '🥳',
  '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙',
  '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩'];

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  showHeader: boolean = true;
  selectedEmoji: string = "😀";

  private lastScrollTop: number = 0;
  private isScrolling: boolean = false;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.selectedEmoji = this.getEmoji();
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (!this.isScrolling) {
      this.isScrolling = true;
      const st: number = window.scrollY || document.documentElement.scrollTop;
      this.showHeader = st <= this.lastScrollTop || st < 10;
      this.lastScrollTop = st;

      setTimeout(() => {
        this.isScrolling = false;
      }, 100); // 100ms 节流
    }
  }

  private getEmoji(): string {
    const today: Date = new Date();
    const month: number = today.getMonth() + 1;
    const day: number = today.getDate();
    const date: string = `${month}-${day}`;

    // Use optional chaining to simplify the logic and provide a default value.
    return HOLIDAY_EMOJI[date] ?? EMOJI_LIST[Math.floor(Math.random() * EMOJI_LIST.length)];
  }
}
