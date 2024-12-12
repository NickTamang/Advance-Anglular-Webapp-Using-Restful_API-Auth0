import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemService } from '../../services/item.service';
import { SearchComponent } from '../search/search.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, FormsModule, SearchComponent], // Add SearchComponent to imports
})
export class DashboardComponent implements OnInit {
  items: any[] = [];
  filteredItems: any[] = []; // For search functionality
  loading = false;
  error: string | null = null;

  replyingCommentId: string | null = null;
  replyingItemId: string | null = null;
  replyText: string = '';

  constructor(private itemService: ItemService, private http: HttpClient) {}

  ngOnInit() {
    this.fetchItems();
  }

  private fetchItems(): void {
    this.loading = true;
    this.error = null;

    this.itemService.getItems().subscribe({
      next: (data) => {
        console.log('Raw API Response:', data);

        if (!Array.isArray(data)) {
          console.error('Invalid data received: Expected an array of items.', data);
          this.error = 'Failed to fetch items. Invalid data format.';
          this.loading = false;
          return;
        }

        // Process and assign the items
        this.items = data.map((item: any) => ({
          ...item,
          comments: Array.isArray(item.comments) ? item.comments : [], // Ensure comments is an array
        }));
        this.filteredItems = [...this.items]; // Initialize filteredItems for search
        console.log('Processed Items:', this.items);
        this.loading = false;
      },
      error: (error) => {
        this.error = error?.message || 'Failed to fetch items. Please try again later.';
        console.error('Error fetching items:', error);
        this.loading = false;
      },
    });
  }

  onSearch(query: string): void {
    if (!query.trim()) {
      // Restore the full list if the query is empty
      this.filteredItems = [...this.items];
      return;
    }

    // Call the regex search endpoint
    this.itemService.getItemsByRegex(query).subscribe({
      next: (data) => {
        console.log('Regex Search Response:', data);

        // Update the filtered items with the response
        this.filteredItems = data.map((item: any) => ({
          ...item,
          comments: Array.isArray(item.comments) ? item.comments : [], // Ensure comments is an array
        }));
      },
      error: (error) => {
        console.error('Error during search:', error);
        this.filteredItems = [];
      },
    });
  }

  openReplyForm(commentId: string, itemId: string): void {
    this.replyingCommentId = commentId;
    this.replyingItemId = itemId;
  }

  closeReplyForm(): void {
    this.replyingCommentId = null;
    this.replyingItemId = null;
    this.replyText = '';
  }

  submitReply(): void {
    if (!this.replyingCommentId || !this.replyText.trim()) {
      console.error('Reply text or comment ID is missing.');
      return;
    }

    const endpoint = `http://localhost:5000/api/rehome/comments/${this.replyingCommentId}/reply`;
    const token = this.itemService.getAuthToken();
    if (!token) {
      console.error('Token not available.');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const payload = {
      reply: this.replyText,
    };

    this.http.post(endpoint, payload, { headers }).subscribe({
      next: (response) => {
        console.log('Reply submitted successfully:', response);

        // Update the corresponding comment with the reply
        const item = this.items.find((i: any) =>
          i.comments.some((c: any) => c.comment_id === this.replyingCommentId)
        );
        const comment = item?.comments.find((c: any) => c.comment_id === this.replyingCommentId);
        if (comment) {
          comment.reply = this.replyText;
        }

        this.closeReplyForm();
      },
      error: (error) => {
        console.error('Error submitting reply:', error.error);
      },
    });
  }
}
