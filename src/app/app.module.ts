import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HighlightJsModule } from 'ngx-highlight-js';

import { GithubButtonModule } from 'ng-github-button';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [BrowserModule, CommonModule, HttpClientModule, HighlightJsModule, GithubButtonModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppDemoModule {}
