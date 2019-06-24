import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfigComponent } from './config.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
	FormsModule,
	ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: ConfigComponent }])
  ],
  exports: [
	FormsModule,
	ReactiveFormsModule,
  ],
  declarations: [ConfigComponent]
})
export class ConfigModule {}
