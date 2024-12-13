import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, CommonModule],
})
export class LoginComponent {
  // Variables to hold email and password input
  email: string = '';
  password: string = '';
  
  // Variable to hold error messages
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  // Method to handle form submission
  onSubmit() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response: any) => {
        console.log('Login successful:', response);
        this.authService.saveToken(response.access_token);
        this.router.navigate(['/dashboard']); // Navigate to dashboard on successful login
      },
      error: (error) => {
        console.error('Login error:', error);
        this.errorMessage = error.error.msg || 'Login failed. Please try again.';
      },
    });
  }

  // Method to navigate to the registration page
  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}