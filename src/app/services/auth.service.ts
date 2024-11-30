import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private tokenService: TokenService) {}

  login(email: string, password: string) {
    return this.http.post('http://localhost:5000/api/rehome/login', { email, password });
  }

  saveToken(token: string): void {
    this.tokenService.saveToken(token);
  }

  getToken(): string | null {
    return this.tokenService.getToken();
  }
}