import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private readonly itemsEndpoint = 'http://localhost:5000/api/rehome/items';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Fetch all items
  getItems(): Observable<any[]> {
    const token = this.authService.getToken();
    if (!token) {
      console.error('Token not found');
      return throwError(() => new Error('Token not found'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(this.itemsEndpoint, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching items:', error);
        return throwError(() => error);
      })
    );
  }

  // Fetch items by regex
  getItemsByRegex(query: string): Observable<any[]> {
    const token = this.authService.getToken();
    if (!token) {
      console.error('Token not found');
      return throwError(() => new Error('Token not found'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const regexEndpoint = `${this.itemsEndpoint}/name/${query}`;

    return this.http.get<any[]>(regexEndpoint, { headers }).pipe(
      catchError((error) => {
        console.error('Error searching items by name:', error);
        return throwError(() => error);
      })
    );
  }

  // Public method to expose the token
  getAuthToken(): string | null {
    return this.authService.getToken();
  }
}
