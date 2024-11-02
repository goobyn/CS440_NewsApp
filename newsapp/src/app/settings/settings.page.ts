import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { EventBusService } from '../services/event-bus.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit, OnDestroy {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';
  categories = ['Business', 'Entertainment', 'General', 'Health', 'Science', 'Sports', 'Technology'];
  selectedInterests: { [key: string]: boolean } = {};  // Index signature for string keys and boolean values
  private eventSubscription: Subscription = new Subscription();  // Manage subscriptions

  constructor(
    private alertController: AlertController,
    private router: Router,
    private eventBusService: EventBusService
  ) {}

  ngOnInit() {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      this.router.navigateByUrl('/login');
      return;
    }

    // Emit event to load user data
    this.eventBusService.emit({ name: 'loadUserData', data: { email: userEmail } });

    // Listen for user data loaded event
    this.eventSubscription.add(
      this.eventBusService.on('userDataLoaded').subscribe((user: any) => {
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;

        // Populate selected interests
        this.categories.forEach(category => {
          this.selectedInterests[category] = user.interests.includes(category);
        });
      })
    );

    // Listen for errors in loading user data
    this.eventSubscription.add(
      this.eventBusService.on('userDataLoadError').subscribe((error: any) => {
        console.error('Error loading user data:', error);
        this.presentAlert('Failed to load user data. Please try again.');
      })
    );

    // Listen for settings save success and error events
    this.eventSubscription.add(
      this.eventBusService.on('settingsSaveSuccess').subscribe(() => {
        this.router.navigateByUrl('/tabs/newsfeed').then(() => {
          window.location.reload();  // Force the entire page to reload
        });
      })
    );

    this.eventSubscription.add(
      this.eventBusService.on('settingsSaveError').subscribe((error: any) => {
        console.error('Error saving user data:', error);
        this.presentAlert('Failed to save settings. Please try again.');
      })
    );
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  saveSettings() {
    if (this.password && this.password !== this.confirmPassword) {
      this.presentAlert('Passwords do not match.');
      return;
    }

    const interests = Object.keys(this.selectedInterests).filter(interest => this.selectedInterests[interest]);
    const userEmail = localStorage.getItem('userEmail');

    // Emit event to save settings
    this.eventBusService.emit({
      name: 'saveSettings',
      data: {
        email: userEmail,
        firstName: this.firstName,
        lastName: this.lastName,
        password: this.password,
        interests
      }
    });
  }

  ngOnDestroy() {
    this.eventSubscription.unsubscribe();  // Clean up subscriptions
  }

  logout() {
    localStorage.removeItem('userEmail');
    this.router.navigateByUrl('/login');
  }
}
