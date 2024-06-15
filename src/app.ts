import { Component } from '@angular/core';
import { GithubButtonComponent } from 'ng-github-button';
import { HighlightJsDirective } from 'ngx-highlight-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: true,
  imports: [GithubButtonComponent, HighlightJsDirective],
})
export class AppComponent {}
