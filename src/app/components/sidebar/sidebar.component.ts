import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ItemService } from '../../services/item.service';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [CommonModule],
})
export class SidebarComponent implements OnInit {
  userProfile: any = null; // To store user details

  constructor(private http: HttpClient, private router: Router, private itemService: ItemService) {}

  ngOnInit(): void {
    this.fetchUserProfile();
  }

  fetchUserProfile(): void {
    const token = this.itemService.getAuthToken();
    if (!token) {
      console.error('User is not logged in.');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const endpoint = 'http://localhost:5000/api/rehome/howisuser'; // Endpoint to fetch user info

    this.http.get<any>(endpoint, { headers }).subscribe({
      next: (data) => {
        console.log('User Profile Fetched:', data);
        this.userProfile = data; // Store user data
      },
      error: (error) => {
        console.error('Error fetching user profile:', error);
      },
    });
  }

  logOut(): void {
    // Clear token and redirect to login
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }
}
