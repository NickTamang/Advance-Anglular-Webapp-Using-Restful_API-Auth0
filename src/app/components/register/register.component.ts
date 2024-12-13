import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [CommonModule, FormsModule, RouterModule],
})
export class RegisterComponent {
  // Object to hold the registration data
  registerData = {
    username: '',
    email: '',
    password: '',
    phone_number: '',
    postcode: '',
    profile_picture: '',
  };
  
  // Variable to hold the confirmation password
  confirmPassword: string = '';
  
  // Variables to hold success and error messages
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  // Method to register a new user
  registerUser(): void {
    const endpoint = 'http://127.0.0.1:5000/api/rehome/signup';

    // Check if passwords match
    if (this.registerData.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    // Send registration data to the server
    this.http.post(endpoint, this.registerData).subscribe({
      next: (response) => {
        console.log('User registered successfully:', response);
        this.successMessage = 'Registration successful!';
        this.errorMessage = '';
        this.resetForm();
      },
      error: (error) => {
        console.error('Error registering user:', error);
        this.errorMessage = 'Failed to register. Please try again.';
        this.successMessage = '';
      },
    });
  }

  // Method to reset the registration form
  private resetForm(): void {
    this.registerData = {
      username: '',
      email: '',
      password: '',
      phone_number: '',
      postcode: '',
      profile_picture: '',
    };
    this.confirmPassword = '';
  }
}