import { Injectable } from '@angular/core';
import axios from 'axios';
import { EventBusService } from './event-bus.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private eventBus: EventBusService) {
    console.log('UserService initialized and listening to user-related events');

    // Listen for loadUserData event
    this.eventBus.on('loadUserData').subscribe(async (data: { email: string }) => {
        console.log("listening for loadUserData event");
      try {
        const response = await axios.get(`http://localhost:5000/user/${data.email}`);
        const user = response.data;

        // Emit userDataLoaded event with the user data
        this.eventBus.emit({ name: 'userDataLoaded', data: user });
      } catch (error) {
        console.error('Error loading user data:', error);
        this.eventBus.emit({ name: 'userDataLoadError', data: error });
      }
    });

    // Listen for saveSettings event
    this.eventBus.on('saveSettings').subscribe(async (settingsData: any) => {
      try {
        const response = await axios.put(`http://localhost:5000/user/${settingsData.email}`, {
          firstName: settingsData.firstName,
          lastName: settingsData.lastName,
          password: settingsData.password,
          interests: settingsData.interests
        });

        if (response.data.msg === 'Email already exists') {
          throw new Error('Email already exists');
        }

        this.eventBus.emit({ name: 'settingsSaveSuccess' });
      } catch (error) {
        console.error('Error saving settings:', error);
        this.eventBus.emit({ name: 'settingsSaveError', data: error });
      }
    });
  }
}
