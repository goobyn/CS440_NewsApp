import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import axios from 'axios';
import { SignupService } from '../signup/signup.service'; // To store logged-in user info

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  email = '';
  password = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private signupService: SignupService  // For user session management
  ) {}

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Uh oh!',
      subHeader: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async onLogin() {
    if (!this.email || !this.password) {
      this.presentAlert('Please enter your email and password.');
      return;
    }

    try {
      // Check the credentials against the database
      const response = await axios.post('http://localhost:5000/login', {
        email: this.email,
        password: this.password
      });

      if (response.data.success) {
        localStorage.setItem('userEmail', this.email);  // Save the user's email in localStorage
        // Store user details in the SignupService for session management
        this.signupService.setUserDetails(response.data.user);

        // Navigate to the main page (e.g., newsfeed) after successful login
        this.router.navigateByUrl('/tabs/newsfeed').then(() => {
          window.location.reload();
        });
      } else {
        this.presentAlert('Invalid email or password.');
      }
    } catch (error) {
      console.error('Login error:', error);
      this.presentAlert('Login failed. Please try again.');
    }
  }

  // Navigate to the signup page
  goToSignup() {
    this.router.navigateByUrl('/signup');
  }
}
