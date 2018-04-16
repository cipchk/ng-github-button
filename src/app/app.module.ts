import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HighlightJsModule } from 'ngx-highlight-js';

import { GithubButtonModule } from 'ng-github-button';

import { AppComponent } from './app.component';

@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        HighlightJsModule,
        GithubButtonModule
    ],
    declarations: [ AppComponent ],
    providers: [],
    bootstrap: [AppComponent]
})

export class AppDemoModule {
}
