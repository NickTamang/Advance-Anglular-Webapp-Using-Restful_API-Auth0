import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private tokenService: TokenService) {}

/* Sends a login request to the server with the provided email and password*/
  login(email: string, password: string) {
    return this.http.post('http://localhost:5000/api/rehome/login', { email, password });
  }

  /* Saves the provided token using the TokenService. */
  saveToken(token: string): void {
    this.tokenService.saveToken(token);
  }
  /* Retrieves the token using the TokenService. */
  getToken(): string | null {
    return this.tokenService.getToken();
  }
}