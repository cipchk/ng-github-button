import { Component } from '@angular/core';
import { GithubButtonComponent } from 'ng-github-button';
import { HighlightJsDirective } from 'ngx-highlight-js';

@Component({
  selector: 'app-root',
  template: `<h1>ng-github-button</h1>
    <p>Unofficial GitHub buttons in Angular.</p>
    <div style="margin-top: 24px;">
      <button type="button" (click)="update()">Update</button>
      <github-button type="stargazers" size="large" [namespace]="ns" [repo]="repo"></github-button>
      <div style="margin-top: 8px">
        <textarea highlight-js>
      &lt;github-button type="stargazers" size="large" namespace="cipchk" repo="ng-github-button"></github-button>
    </textarea>
      </div>
    </div>
    <div style="margin-top: 24px;">
      <github-button type="subscribers" namespace="cipchk" repo="ng-github-button"></github-button>
      <div style="margin-top: 8px">
        <textarea highlight-js>
      &lt;github-button type="subscribers" namespace="cipchk" repo="ng-github-button"></github-button>
    </textarea>
      </div>
    </div>
    <div style="margin-top: 24px;">
      <github-button type="forks" namespace="cipchk" repo="ng-github-button" [showZero]="true"></github-button>
      <div style="margin-top: 8px">
        <textarea highlight-js>
      &lt;github-button type="forks" namespace="cipchk" repo="ng-github-button" [showZero]="true"></github-button>
    </textarea>
      </div>
    </div> `,
  imports: [GithubButtonComponent, HighlightJsDirective],
})
export class App {
  ns = 'cipchk';
  repo = 'ng-github-button';

  update() {
    this.ns = 'ng-alain';
    this.repo = 'ng-alain';
  }
}
