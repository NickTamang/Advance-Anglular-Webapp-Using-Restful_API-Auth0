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
  userProfile: any = null; // To store user profile details (photo, etc.)
  userName: string | null = null; // To store the logged-in username

  constructor(private http: HttpClient, private router: Router, private itemService: ItemService) {}

  ngOnInit(): void {
    this.fetchUserProfile(); // Fetch user profile for photo
    this.fetchUserUsername(); // Fetch username
  }

  // Fetch user profile details (photo, etc.)
  fetchUserProfile(): void {
    const token = this.itemService.getAuthToken();
    if (!token) {
      console.error('User is not logged in.');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const endpoint = 'http://localhost:5000/api/rehome/howisuser'; // Endpoint to fetch user profile

    this.http.get<any>(endpoint, { headers }).subscribe({
      next: (data) => {
        console.log('User Profile Fetched:', data);
        this.userProfile = data; // Assign data to userProfile
      },
      error: (error) => {
        console.error('Error fetching user profile:', error);
      },
    });
  }

  // Fetch logged-in username
  fetchUserUsername(): void {
    const token = this.itemService.getAuthToken();
    if (!token) {
      console.error('User is not logged in.');
      return;
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const endpoint = 'http://localhost:5000/api/rehome/whois'; // Endpoint to fetch username
  
    this.http.get<any>(endpoint, { headers }).subscribe({
      next: (data) => {
        console.log('Fetched Username Response:', data);
        if (data && data.logged_in_as) {
          this.userName = data.logged_in_as; // Assign the username if present
        } else {
          console.error('Unexpected response format:', data);
        }
      },
      error: (error) => {
        console.error('Error fetching username:', error);
      },
    });
  }
  

  // Logout functionality
  logOut(): void {
    const token = this.itemService.getAuthToken();
    if (!token) {
      console.warn('No token found. Logging out without server notification.');
      this.clearLocalSession();
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const endpoint = 'http://localhost:5000/api/rehome/logout'; // Logout endpoint

    this.http.post(endpoint, {}, { headers }).subscribe({
      next: (response) => {
        console.log('Logout successful:', response);
        this.clearLocalSession();
      },
      error: (error) => {
        console.error('Logout failed:', error);
        this.clearLocalSession(); // Clear session even if server logout fails
      },
    });
  }

  private clearLocalSession(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }
}
