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
  private readonly commentsEndpoint = 'http://localhost:5000/api/rehome/comments';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Fetch items
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

  // Fetch comments for a specific item by itemId
  getCommentsForItem(itemId: string): Observable<any[]> {
    const token = this.authService.getToken();
    if (!token) {
      console.error('Token not found');
      return throwError(() => new Error('Token not found'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.commentsEndpoint}/${itemId}`, { headers }).pipe(
      catchError((error) => {
        console.error(`Error fetching comments for item ${itemId}:`, error);
        return throwError(() => error);
      })
    );
  }
}
