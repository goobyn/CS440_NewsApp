import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';
  categories = ['Business', 'Entertainment', 'General', 'Health', 'Science', 'Sports', 'Technology'];
  selectedInterests: { [key: string]: boolean } = {};  // Index signature for string keys and boolean values

  constructor(private alertController: AlertController, private router: Router) {}

  async ngOnInit() {
    await this.loadUserData();
  }

  async loadUserData() {
    const userEmail = localStorage.getItem('userEmail');  // Assuming user's email is saved in localStorage
    if (!userEmail) {
      this.router.navigateByUrl('/login');
      return;
    }

    try {
      const response = await axios.get(`http://142.11.252.37:5000/user/${userEmail}`);
      const user = response.data;
      this.firstName = user.firstName;
      this.lastName = user.lastName;
      this.email = user.email;

      // Prefill the interests based on user's current interests
      this.categories.forEach(category => {
        this.selectedInterests[category] = user.interests.includes(category);
      });
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async saveSettings() {
    if (this.password && this.password !== this.confirmPassword) {
      this.presentAlert('Passwords do not match.');
      return;
    }

    try {
      const interests = Object.keys(this.selectedInterests).filter(interest => this.selectedInterests[interest]);
      const userEmail = localStorage.getItem('userEmail');  // Assuming userEmail is saved in localStorage

      const response = await axios.put(`http://142.11.252.37:5000/user/${userEmail}`, {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,  // Send the new password if provided
        interests
      });

      if (response.data.msg === 'Email already exists') {
        this.presentAlert('The email is already taken.');
      } else {
        localStorage.setItem('userEmail', this.email);  // Update email in localStorage
        this.router.navigateByUrl('/tabs/newsfeed').then(() => {
          window.location.reload();  // Force the entire page to reload
        });
      }
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }
  
  // Toggle category selection when clicking the whole ion-item
  onCategoryClick(category: string, checkbox: any) {
    checkbox.checked = !checkbox.checked;
  }

  logout() {
    localStorage.removeItem('userEmail');  // Clear session data
    this.router.navigateByUrl('/login');
  }
}  
