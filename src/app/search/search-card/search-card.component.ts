import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from "@angular/forms";
import {Post} from "../../model/post";

@Component({
  selector: 'app-search-card',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-card.component.html',
  styleUrl: './search-card.component.css'
})
export class SearchCardComponent {
  @Input() post!: Post;
  @Output() private setUser = new EventEmitter<string>();
  @Output() private setBoard = new EventEmitter<string>();

  searchByAuthor(author: string) {
    this.setUser.emit(author);
  }

  searchByBoard(board: string) {
    this.setBoard.emit(board);
  }
}
