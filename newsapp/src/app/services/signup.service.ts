import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  private userDetails: UserDetails | null = null;

  // Store user details in the service
  setUserDetails(details: UserDetails) {
    this.userDetails = details;
  }

  // Retrieve user details from the service
  getUserDetails(): UserDetails | null {
    return this.userDetails;
  }

  // Clear user data (used when logging out or resetting)
  resetUserData() {
    this.userDetails = null;
  }
}

// Interface for user details, to provide better typing
export interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
