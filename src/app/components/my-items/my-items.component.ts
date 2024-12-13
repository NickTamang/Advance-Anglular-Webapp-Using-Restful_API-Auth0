import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { TokenService } from '../../token/token.service';
import { ItemService } from '../../services/item.service';
import { SearchComponent } from '../search/search.component';

@Component({
  standalone: true,
  selector: 'app-my-items',
  templateUrl: './my-items.component.html',
  styleUrls: ['./my-items.component.css'],
  imports: [CommonModule, FormsModule, SearchComponent], // Import CommonModule and FormsModule
})
export class MyItemsComponent implements OnInit {
  items: any[] = []; // List of user’s items
  sharedItems: any[] = []; // Fetched shared items
  newItem: any = {
    item_name: '',
    description: '',
    photo_url: '',
    status: 'available',
  }; // New item data
  successMessage: string = ''; // For displaying success messages
  errorMessage: string = ''; // For displaying error messages

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService,
    private itemService: ItemService
  ) {}

  ngOnInit(): void {
    this.fetchUserItems();
  }

  fetchUserItems(): void {
    const token = this.tokenService.getToken();
    if (!token) {
      this.errorMessage = 'You are not logged in.';
      this.router.navigate(['/login']); // Redirect to login if token is missing
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const endpoint = 'http://localhost:5000/api/rehome/items';

    this.http.get<any[]>(endpoint, { headers }).subscribe({
      next: (data) => {
        console.log('Fetched User Items:', data);
        this.items = data; // Populate items array
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Error fetching user items:', error);
        if (error.status === 401) {
          this.errorMessage = 'Your session has expired. Please log in again.';
          this.router.navigate(['/login']);
        } else {
          this.errorMessage = 'Failed to fetch items. Please try again.';
        }
      },
    });
  }

  fetchSharedItems(): void {
    const token = this.tokenService.getToken();
    if (!token) {
      this.errorMessage = 'You are not logged in.';
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const endpoint = 'http://localhost:5000/api/rehome/items';

    this.http.get<any[]>(endpoint, { headers }).subscribe({
      next: (data) => {
        console.log('Fetched Shared Items:', data);
        this.sharedItems = data;
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Error fetching shared items:', error);
        if (error.status === 401) {
          this.errorMessage = 'Your session has expired. Please log in again.';
          this.router.navigate(['/login']);
        } else {
          this.errorMessage = 'Failed to fetch shared items. Please try again.';
        }
      },
    });
  }

  addItem(): void {
    const token = this.tokenService.getToken();
    if (!token) {
      this.errorMessage = 'You are not logged in.';
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');

    const endpoint = 'http://localhost:5000/api/rehome/items';

    this.http.post(endpoint, this.newItem, { headers }).subscribe({
      next: (response: any) => {
        console.log('Item added successfully:', response);
        this.successMessage = 'Item added successfully!';
        this.errorMessage = '';
        this.items.push({ ...this.newItem }); // Add the new item to the list
        this.newItem = {
          item_name: '',
          description: '',
          photo_url: '',
          status: 'available',
        }; // Reset the form
      },
      error: (error) => {
        console.error('Error adding item:', error);
        this.errorMessage = 'Failed to add item. Please try again.';
      },
    });
  }
  deleteItem(item: any): void {
    const token = this.tokenService.getToken();
    if (!token) {
      this.errorMessage = 'You are not logged in.';
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const endpoint = `http://localhost:5000/api/rehome/items/${item.item_id}`;

    this.http.delete(endpoint, { headers }).subscribe({
      next: () => {
        console.log('Item deleted successfully:', item);
        this.items = this.items.filter((i) => i.item_id !== item.item_id);
        this.successMessage = `Item "${item.item_name}" deleted successfully.`;
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Error deleting item:', error);
        this.errorMessage = 'Failed to delete item. Please try again.';
      },
    });
  }
  
  
  
}
