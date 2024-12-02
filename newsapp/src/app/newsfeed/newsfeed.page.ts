import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { SignupService } from '../signup/signup.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';  // Import LoadingController

interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  category: string;
}

@Component({
  selector: 'app-newsfeed',
  templateUrl: './newsfeed.page.html',
  styleUrls: ['./newsfeed.page.scss'],
})
export class NewsfeedPage implements OnInit {

  articles: Article[] = [];
  userEmail: string = '';
  loading: any;

  constructor(
    private signupService: SignupService, 
    private router: Router, 
    private loadingController: LoadingController  // Inject LoadingController
  ) {}

  async ngOnInit() {
    this.userEmail = localStorage.getItem('userEmail') || '';
    
    // Show the loading spinner
    await this.showLoading();

    // Load articles
    await this.loadArticles();

    // Dismiss the loading spinner when articles are ready
    this.loading.dismiss();
  }

  async loadArticles() {
    try {
      const userEmail = localStorage.getItem('userEmail');
      
      if (!userEmail) {
        console.error('No user email found. Redirecting to login...');
        this.router.navigateByUrl('/login');
        return;
      }

      const response = await axios.get(`http://localhost:4000/newsfeed/${userEmail}`);
      this.articles = response.data.articles;
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  }

  // Method to show the loading spinner
  async showLoading() {
    this.loading = await this.loadingController.create({
      message: 'Loading articles...',
      spinner: 'circles',
      cssClass: 'custom-loading'  // Optional, for custom styling
    });
    await this.loading.present();
  }
}
