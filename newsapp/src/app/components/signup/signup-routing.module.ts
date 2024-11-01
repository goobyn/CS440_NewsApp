import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupPage } from './signup.page';

const routes: Routes = [
  {
    path: '',
    component: SignupPage  // The main signup component
  },
  {
    path: 'choose-categories',
    loadChildren: () => import('../signup_views/categories/categories.module').then(m => m.CategoriesPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignupPageRoutingModule {}
