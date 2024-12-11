import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemService } from '../../services/item.service';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule]
})
export class DashboardComponent implements OnInit {
  items: any[] = [];

  constructor(private itemService: ItemService) {}

  ngOnInit() {
    this.itemService.getItems().subscribe({
      next: (data) => {
        this.items = data;
      },
      error: (error) => {
        console.error('Error fetching items:', error);
      }
    });
  }
}