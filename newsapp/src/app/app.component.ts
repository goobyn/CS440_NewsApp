import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkSession();
  }

  checkSession() {
    const userEmail = localStorage.getItem('userEmail');  // Check if user's email is saved in localStorage

    if (userEmail) {
      // If the user is logged in, navigate to the newsfeed
      this.router.navigateByUrl('/tabs/newsfeed');
    } else {
      // Otherwise, navigate to the login page
      this.router.navigateByUrl('/login');
    }
  }
}
