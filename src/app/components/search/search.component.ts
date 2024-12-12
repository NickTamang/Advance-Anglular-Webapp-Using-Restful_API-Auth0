import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  imports: [CommonModule, FormsModule],
})
export class SearchComponent {
  @Output() search = new EventEmitter<string>();
  searchQuery: string = '';

  onSearch(): void {
    this.search.emit(this.searchQuery.trim());
  }
}
