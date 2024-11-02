import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventBusService } from '../services/event-bus.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import axios from 'axios';

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
export class NewsfeedPage implements OnInit, OnDestroy {
  articles: Article[] = [];
  userEmail: string = '';
  loading: any;
  private eventSubscription: Subscription = new Subscription();  // Initialize with new Subscription()

  constructor(
    private eventBusService: EventBusService,
    private router: Router,
    private loadingController: LoadingController
  ) {}

  async ngOnInit() {
    this.userEmail = localStorage.getItem('userEmail') || '';

    if (!this.userEmail) {
      console.error('No user email found. Redirecting to login...');
      this.router.navigateByUrl('/login');
      return;
    }

    // Show loading spinner
    await this.showLoading();

    // Listen for the fetchArticles event
    this.eventBusService.on('fetchArticles').subscribe(async (data: { email: string }) => {
     try {
       console.log('fetchArticles event received with data:', data);
       const response = await axios.get(`http://localhost:5000/newsfeed/${data.email}`);
       const articles = response.data.articles;

       // Emit articlesLoaded event with the fetched articles
       this.eventBusService.emit({ name: 'articlesLoaded', data: articles });
     } catch (error) {
       console.error('Error fetching articles:', error);

       // Emit fetchArticlesError event with error details
       this.eventBusService.emit({ name: 'fetchArticlesError', data: error });
     }
   });
    // Emit fetchArticles event to initiate article fetching
    this.eventBusService.emit({ name: 'fetchArticles', data: { email: this.userEmail } });



    // Subscribe to articlesLoaded event to update articles
    this.eventSubscription.add(
      this.eventBusService.on('articlesLoaded').subscribe((articles: Article[]) => {
        console.log('Articles loaded in newsfeed:', articles);
        this.articles = articles;
        this.dismissLoading();
      })
    );

    // Listen for fetchArticlesError event
    this.eventSubscription.add(
      this.eventBusService.on('fetchArticlesError').subscribe((error: any) => {
        console.error('Error fetching articles received in NewsfeedPage:', error);
        this.dismissLoading();
      })
    );
  }

  ngOnDestroy() {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
  }

  // Method to show the loading spinner
  async showLoading() {
    this.loading = await this.loadingController.create({
      message: 'Loading articles...',
      spinner: 'circles',
      cssClass: 'custom-loading'
    });
    await this.loading.present();
  }

  // Method to dismiss the loading spinner
  dismissLoading() {
    if (this.loading) {
      this.loading.dismiss();
      this.loading = null; // Reset loading reference
    }
  }
}
