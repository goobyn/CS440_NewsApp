import { Injectable } from '@angular/core';
import axios from 'axios';
import { EventBusService } from './event-bus.service';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  constructor(private eventBus: EventBusService) {
    console.log('ArticleService initialized and listening to fetchArticles events');

    // Listen for the fetchArticles event
    this.eventBus.on('fetchArticles').subscribe(async (data: { email: string }) => {
      try {
        console.log('fetchArticles event received with data:', data);
        const response = await axios.get(`http://localhost:5000/newsfeed/${data.email}`);
        const articles = response.data.articles;

        // Emit articlesLoaded event with the fetched articles
        this.eventBus.emit({ name: 'articlesLoaded', data: articles });
      } catch (error) {
        console.error('Error fetching articles:', error);

        // Emit fetchArticlesError event with error details
        this.eventBus.emit({ name: 'fetchArticlesError', data: error });
      }
    });
  }
}
