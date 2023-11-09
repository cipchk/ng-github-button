import { Component } from '@angular/core';
import { GithubButtonComponent } from 'ng-github-button';
import { HighlightJsModule } from 'ngx-highlight-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: true,
  imports: [GithubButtonComponent, HighlightJsModule],
})
export class AppComponent {}
