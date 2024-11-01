import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { NewsfeedService } from 'src/app/services/newsfeed.service';
import { UserService } from 'src/app/services/user.service';
import { Article } from '../../models/article.model';


@Component({
  selector: 'app-newsfeed',
  templateUrl: './newsfeed.page.html',
  styleUrls: ['./newsfeed.page.scss'],
})
export class NewsfeedPage implements OnInit {

  articles: Article[] = [];
  userEmail: string | null = null;
  loading: any;

  constructor(
    private newsfeedService: NewsfeedService,
    private userService: UserService,
    private router: Router,
    private loadingController: LoadingController
  ) {}

  async ngOnInit() {
    this.userEmail = await localStorage.getItem('userEmail');

    if (!this.userEmail) {
      console.error('No user email found. Redirecting to login...');
      this.router.navigateByUrl('/login');
      return;
    }

    await this.showLoading();

    try {
      await this.loadArticles();
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      this.loading.dismiss();
    }
  }

  async loadArticles() {
    if (!this.userEmail) {
      console.error('No user email found. Redirecting to login...');
      this.router.navigateByUrl('/login');
      return;
    }

    this.articles = await this.newsfeedService.getArticles(this.userEmail);
  }

  async showLoading() {
    this.loading = await this.loadingController.create({
      message: 'Loading articles...',
      spinner: 'circles',
      cssClass: 'custom-loading'
    });
    await this.loading.present();
  }
}
