import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CategoriesPage } from './categories.page'; // Ensure this import path is correct
import { CategoriesPageRoutingModule } from './categories-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoriesPageRoutingModule
  ],
  declarations: [CategoriesPage],
  exports: [CategoriesPage] // Export if needed elsewhere
})
export class CategoriesPageModule {}
