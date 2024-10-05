import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SignupService } from '../../signup/signup.service';  // Import the SignupService
import axios from 'axios';  // Import axios for HTTP requests

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage {

  categories = ['Business', 'Entertainment', 'General', 'Health', 'Science', 'Sports', 'Technology'];
  selectedCategories: string[] = [];

  constructor(private signupService: SignupService, private router: Router) {}

  onCategoryChange(category: string, event: any) {
    if (event.detail.checked) {
      this.selectedCategories.push(category);
    } else {
      this.selectedCategories = this.selectedCategories.filter(cat => cat !== category);
    }
  }

   // Toggle category selection when clicking the whole ion-item
   onCategoryClick(category: string, checkbox: any) {
    checkbox.checked = !checkbox.checked;
    this.onCategoryChange(category, { detail: { checked: checkbox.checked } });
  }

  async onNext() {
    // Get user details from the SignupService
    const userDetails = this.signupService.getUserDetails();
    const interests = this.selectedCategories;

    if (interests.length === 0) {
      alert("Please select at least one category.");
      return;
    }

    try {
      // Send the complete user information including interests to the backend
      const response = await axios.post('http://142.11.252.37:5000/signup', {
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        email: userDetails.email,
        password: userDetails.password,
        interests: interests  // Send the selected categories as interests
      });
      console.log(response.data);

      // Navigate to the newsfeed or another appropriate page
      this.router.navigateByUrl('/tabs/newsfeed');
    } catch (error: any) {
      console.error('Error during signup:', error);
    }
  }
}
