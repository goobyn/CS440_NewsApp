import { Injectable } from '@angular/core';
import axios from 'axios';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5000';
  private currentUser: User | null = null;

  constructor() {}

  // Login method to handle user authentication
  async login(email: string, password: string): Promise<boolean> {
    try {
      const response = await axios.post(`${this.apiUrl}/login`, { email, password });

      if (response.data.success) {
        const user = response.data.user;
        const token = response.data.token;

        // Store the token and user details
        localStorage.setItem('authToken', token);
        localStorage.setItem('currentUser', JSON.stringify(user));  // Store user details
        localStorage.setItem('userEmail', user.email);  // Store the email in localStorage during login
        this.currentUser = user;
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Set user details (if needed for session management)
  setUserDetails(user: User) {
    this.currentUser = user;
  }

  // Register a new user
  async register(userData: Partial<User>): Promise<User> {
    const response = await axios.post(`${this.apiUrl}/register`, userData);
    return response.data;
  }

  // Get the currently logged-in user's details
  async getCurrentUser(): Promise<User | null> {
    if (this.currentUser) {
      return this.currentUser;
    }

    // Optionally, fetch user data from the server using a stored token
    const token = localStorage.getItem('authToken');
    const userEmail = localStorage.getItem('userEmail'); // Store the email in localStorage during login

    if (token) {
        const response = await axios.get(`${this.apiUrl}/user/${userEmail}`, {
            headers: { Authorization: `Bearer ${token}` }
      });
      this.currentUser = response.data;
      return this.currentUser;
    }

    return null;
  }

    // Method to retrieve the email of the current user
    async getUserEmail(): Promise<string | null> {
        if (this.currentUser) {
        return this.currentUser.email;
        }

        return null;
    }

  // Update user details
  async updateUserDetails(updatedData: Partial<User>): Promise<User | null> {
    const token = localStorage.getItem('authToken');
    const userEmail = this.currentUser?.email;
  
    if (!userEmail) {
      throw new Error('User email is required to update user details');
    }
  
    try {
      const response = await axios.put(`${this.apiUrl}/user/${userEmail}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      this.currentUser = response.data;
      return this.currentUser;  // This may return null if currentUser is null
    } catch (error) {
      throw error;
    }
    
  }
  

  // Logout user and clear session data
  logout() {
    localStorage.removeItem('authToken');
    this.currentUser = null;
    
  }
}
