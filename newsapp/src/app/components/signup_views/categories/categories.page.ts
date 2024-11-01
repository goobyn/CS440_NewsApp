import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SignupService, UserDetails } from 'src/app/services/signup.service';  // Import the SignupService
import axios from 'axios';  // Import axios for HTTP requests

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage {
  categories = ['Business', 'Entertainment', 'General', 'Health', 'Science', 'Sports', 'Technology'];
  selectedCategories: string[] = [];
  userDetails;

  constructor(private signupService: SignupService, private router: Router) {
    this.userDetails = this.signupService.getUserDetails(); // Ensure this method returns user details
  }

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
    const interests = this.selectedCategories;

    if (interests.length === 0) {
      alert("Please select at least one category.");
      return;
    }

    try {
      if (this.userDetails) {
        const response = await axios.post('http://localhost:5000/signup', {
          firstName: this.userDetails.firstName,
          lastName: this.userDetails.lastName,
          email: this.userDetails.email,
          password: this.userDetails.password,
          interests: interests
        });
        console.log(response.data);
        this.router.navigateByUrl('/tabs/newsfeed');
      } else {
        console.error('User details are not available.');
      }      
    } catch (error: any) {
      console.error('Error during signup:', error);
    }
  }
}
