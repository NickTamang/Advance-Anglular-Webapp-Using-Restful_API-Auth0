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
  // Event emitter to send the search query to the parent component
  @Output() search = new EventEmitter<string>();
  
  // Variable to hold the search query
  searchQuery: string = '';

  // Method to emit the search query when the search action is triggered
  onSearch(): void {
    this.search.emit(this.searchQuery.trim());
  }
}