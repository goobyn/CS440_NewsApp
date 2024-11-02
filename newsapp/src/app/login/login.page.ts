import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import axios from 'axios';
import { EventBusService } from '../services/event-bus.service';

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
    private eventBus: EventBusService,
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
      const response = await axios.post('http://localhost:5000/login', {
        email: this.email,
        password: this.password
      });
  
      if (response.data.success) {
        localStorage.setItem('userEmail', this.email);
        // Emit a login success event
        this.router.navigateByUrl('/tabs/newsfeed').then(() => {
          this.eventBus.emit({ name: 'userLoggedIn', data: response.data.user });
          this.eventBus.emit({ name: 'fetchArticles', data: { email: this.email } });
          console.log('Emitting fetchArticles event');
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
