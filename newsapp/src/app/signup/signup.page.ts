import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SignupService } from '../signup/signup.service';  // Import the SignupService

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {

  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';

  constructor(
    private alertController: AlertController,
    private router: Router,
    private signupService: SignupService  // Inject the SignupService
  ) {}

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Uh oh!',
      subHeader: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async onSignup() {
    // Validation for first name, last name, email, and password
    const nameRegex = /^[A-Za-z]{2,}$/;
    if (!nameRegex.test(this.firstName)) {
      this.presentAlert('Invalid First Name: Must be more than 1 letter and contain no numbers or symbols.');
      return;
    }

    if (!nameRegex.test(this.lastName)) {
      this.presentAlert('Invalid Last Name: Must be more than 1 letter and contain no numbers or symbols.');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(this.email)) {
      this.presentAlert('Invalid Email: Must be in a proper email format.');
      return;
    }

    // Password validation (minimum 6 characters, 1 uppercase, 1 lowercase, 1 number)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(this.password)) {
      this.presentAlert('Password must be at least 6 characters, include an uppercase letter, a lowercase letter, and a number.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.presentAlert('Passwords do not match. Please confirm your password.');
      return;
    }

    // Save user details to the SignupService to pass to the next page
    this.signupService.setUserDetails({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
    });

    // Navigate to the "choose-categories" page for interests selection
    this.router.navigateByUrl('/signup/choose-categories');
  }
}
