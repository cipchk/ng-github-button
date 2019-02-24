import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HighlightJsModule } from 'ngx-highlight-js';

import { GithubButtonModule } from 'ng-github-button';

import { AppComponent } from './app.component';

@NgModule({
  imports: [BrowserModule, CommonModule, HttpClientModule, HighlightJsModule, GithubButtonModule],
  declarations: [AppComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppDemoModule {}
