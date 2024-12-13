import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { SearchComponent } from '../search/search.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, FormsModule, RouterModule, SearchComponent, SidebarComponent],
})
export class DashboardComponent implements OnInit {
  items: any[] = [];
  filteredItems: any[] = []; // For search functionality
  loading = false;
  error: string | null = null;

  expandedItems: { [key: string]: boolean } = {}; // Track expanded state for each item
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
        this.items = data.map((item: any) => ({
          ...item,
          comments: Array.isArray(item.comments) ? item.comments : [], // Ensure comments is an array
        }));
        this.filteredItems = [...this.items];
        this.loading = false;
      },
      error: (error) => {
        this.error = error?.message || 'Failed to fetch items. Please try again later.';
        this.loading = false;
      },
    });
  }

  toggleExpand(itemId: string): void {
    this.expandedItems[itemId] = !this.expandedItems[itemId];
  }

  onSearch(query: string): void {
    if (!query.trim()) {
      this.filteredItems = [...this.items];
      return;
    }

    this.itemService.getItemsByRegex(query).subscribe({
      next: (data) => {
        this.filteredItems = data.map((item: any) => ({
          ...item,
          comments: Array.isArray(item.comments) ? item.comments : [],
        }));
      },
      error: (error) => {
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
    if (!this.replyingCommentId || !this.replyText.trim()) return;

    const endpoint = `http://localhost:5000/api/rehome/comments/${this.replyingCommentId}/reply`;
    const token = this.itemService.getAuthToken();

    if (!token) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const payload = { reply: this.replyText };

    this.http.post(endpoint, payload, { headers }).subscribe({
      next: () => {
        const item = this.items.find((i) =>
          i.comments.some((c: any) => c.comment_id === this.replyingCommentId)
        );
        const comment = item?.comments.find((c: any) => c.comment_id === this.replyingCommentId);
        if (comment) comment.reply = this.replyText;

        this.closeReplyForm();
      },
      error: (error) => console.error('Error submitting reply:', error),
    });
  }
}
