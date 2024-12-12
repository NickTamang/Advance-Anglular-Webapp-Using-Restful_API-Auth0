import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemService } from '../../services/item.service';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule],
})
export class DashboardComponent implements OnInit {
  items: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(private itemService: ItemService) {}

  ngOnInit() {
    this.fetchItems();
  }

  private fetchItems(): void {
    this.loading = true;
    this.error = null;
    this.itemService.getItems().subscribe({
      next: (data) => {
        this.items = data.map((item) => ({ ...item, comments: [] })); // Initialize comments array for each item
        this.loadCommentsForItems();
        this.loading = false;
      },
      error: (error) => {
        this.error = error?.message || 'Failed to fetch items. Please try again later.';
        console.error('Error fetching items:', error);
        this.loading = false;
      },
    });
  }

  private loadCommentsForItems(): void {
    this.items.forEach((item) => {
      this.itemService.getCommentsForItem(item._id).subscribe({
        next: (comments) => {
          item.comments = comments; // Attach comments to the corresponding item
        },
        error: (error) => {
          if (error.status === 404) {
            console.warn(`No comments found for item ${item._id}`);
            item.comments = []; // Set comments to an empty array if not found
          } else {
            console.error(`Error fetching comments for item ${item._id}:`, error);
          }
        },
      });
    });
  }
}
