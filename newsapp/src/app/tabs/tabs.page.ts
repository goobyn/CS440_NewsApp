import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  showTabs = true;  // Variable to control the visibility of the tab bar

  constructor(private router: Router) {
    // Subscribe to route changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Check if the current route is one where the tab bar should be hidden
        this.showTabs = ['/newsfeed', '/settings'].includes(event.urlAfterRedirects);
      }
    });
  }
}
