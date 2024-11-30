import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getItems(): Observable<any[]> {
    const token = this.authService.getToken();
    console.log('Token:', token); // Debug the token value
    if (!token) {
      throw new Error('Token not found');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>('http://localhost:5000/api/rehome/items', { headers });
  }
}