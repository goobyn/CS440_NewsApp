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
  selectedInterests: { [key: string]: boolean } = {};

  constructor(private alertController: AlertController, private router: Router) {}

  async ngOnInit() {
    await this.loadUserData();
    await this.loadUserInterests(); // Load user's interests
  }

  async loadUserData() {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      this.router.navigateByUrl('/login');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:4000/user/${userEmail}`);
      const user = response.data;
      this.firstName = user.firstName;
      this.lastName = user.lastName;
      this.email = user.email;
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  async loadUserInterests() {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      return;
    }

    try {
      const response = await axios.get(`http://localhost:4000/interests/${userEmail}`);
      const interests = response.data.categories || [];
      this.categories.forEach((category) => {
        this.selectedInterests[category] = interests.includes(category);
      });
    } catch (error) {
      console.error('Error loading user interests:', error);
    }
  }

  async saveSettings() {
    console.log('Saving settings...');
    if (this.password && this.password !== this.confirmPassword) {
      this.presentAlert('Passwords do not match.');
      return;
    }

    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      this.presentAlert('User email is missing. Please log in again.');
      return;
    }

    const selectedCategories = Object.keys(this.selectedInterests).filter(
      (category) => this.selectedInterests[category]
    );

    try {
      console.log('Updating user details:');
      // Update user details via User Service
      await this.updateUserDetails(userEmail);

      console.log('Updating user interests:');
      // Update interests via Interest Service
      await this.updateUserInterests(userEmail, selectedCategories);

      console.log('Settings saved successfully.');
      // Navigate to newsfeed
      this.router.navigateByUrl('/tabs/newsfeed').then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      this.presentAlert('Failed to save settings. Please try again.');
    }
  }

  private async updateUserDetails(email: string) {
    try {
      const response = await axios.put(`http://localhost:4000/user/${email}`, {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password, // Include password only if provided
      });

      console.log('User details updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating user details:', error);
      throw new Error('Failed to update user details.');
    }
  }

  private async updateUserInterests(email: string, categories: string[]) {
    try {
      const response = await axios.post(`http://localhost:4000/interests/${email}`, {
        categories,
      });

      console.log('User interests updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating user interests:', error);
      throw new Error('Failed to update user interests.');
    }
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  onCategoryClick(category: string, checkbox: any) {
    checkbox.checked = !checkbox.checked;
  }

  logout() {
    localStorage.removeItem('userEmail');
    this.router.navigateByUrl('/login');
  }
}
