import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';

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
    private userService: UserService  // Use UserService instead of SignupService
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
      // Use UserService to handle login
      const loginSuccess = await this.userService.login(this.email, this.password);

      if (loginSuccess) {
        // Navigate to the main page (e.g., newsfeed) after successful login
        this.router.navigateByUrl('/tabs/newsfeed');
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
