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
      const response = await axios.post('http://localhost:4000/signup', {
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        email: userDetails.email,
        password: userDetails.password,
        interests: interests,
      });
    
      if (response.data.user && response.data.user.email) {
        localStorage.setItem('userEmail', response.data.user.email); // Save email to local storage
        console.log('User email saved to local storage:', response.data.user.email);
      }
    
      // Redirect or handle the next steps
      this.router.navigateByUrl('/tabs/newsfeed');
    } catch (error) {
      console.error('Error during signup:', error);
    }
  }
}
