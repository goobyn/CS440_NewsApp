import { Injectable } from '@angular/core';
import axios from 'axios';
import { Article } from '../models/article.model';

@Injectable({
  providedIn: 'root'
})
export class NewsfeedService {

  async getArticles(userEmail: string): Promise<Article[]> {
    try {
      const response = await axios.get(`http://localhost:5000/newsfeed/${userEmail}`);
      return response.data.articles;
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw error; // Re-throw the error to handle it in the component if necessary
    }
  }
}
