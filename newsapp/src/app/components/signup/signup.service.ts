import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  private userDetails: any = {};

  setUserDetails(details: any) {
    this.userDetails = details;
  }

  getUserDetails() {
    return this.userDetails;
  }

  resetUserData() {
    this.userDetails = null;  // Or set to initial state
  }
}
