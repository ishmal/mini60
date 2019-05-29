import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MyMaterialModule } from "./material.module";

import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { HelpComponent } from './help/help.component';
import { RunComponent } from './run/run.component';
import { ConfigComponent } from './config/config.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    HelpComponent,
    RunComponent,
    ConfigComponent
  ],
  imports: [
	BrowserModule,
	BrowserAnimationsModule,
	MyMaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
