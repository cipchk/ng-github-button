import {
  Component,
  Input,
  OnChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  ViewEncapsulation,
  OnDestroy,
} from '@angular/core';
import { GithubButtonService } from './service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'github-button',
  template: `
    <a class="gh-btn" href="{{ repo_url }}" target="_blank">
      <span class="gh-ico" aria-hidden="true" [innerHTML]="_svg"></span>
      <span class="gh-text">{{ typeToLabel[type] }}</span>
    </a>
    <a
      class="gh-count"
      target="_blank"
      href="{{ count_url }}"
      [ngStyle]="{ display: value ? 'block' : 'none' }"
    >
      {{ value }}
    </a>
    <ng-content></ng-content>
  `,
  styleUrls: ['./style.less'],
  host: {
    '[class.github-btn-large]': `size === 'large'`,
  },
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GithubButtonComponent implements OnChanges, OnInit, OnDestroy {
  private notify$: Subscription;
  _svg = this.dom.bypassSecurityTrustHtml(`<svg viewBox="0 0 16 16" version="1.1" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>`);
  value: string;

  // region: fields

  @Input() type: 'stargazers' | 'subscribers' | 'watchers' | 'forks' =
    'stargazers';
  @Input() typeToLabel = {
    stargazers: 'Star',
    subscribers: 'Watch',
    forks: 'Fork',
  };
  @Input() typeToPath = {
    forks: 'network',
  };
  @Input() size: 'default' | 'large';
  @Input() set svg(value: string) {
    this._svg = this.dom.bypassSecurityTrustHtml(value);
  }
  @Input() namespace: string;
  @Input() repo: string;
  @Input() token: string;
  @Input() query: string = null;
  @Input() callback: (data: any) => string = null;
  @Input() showZero = false;

  // endregion

  get repo_url() {
    return `//github.com/${this.namespace}/${this.repo}/`;
  }

  get count_url() {
    const type = this.typeToPath[this.type];
    return `//github.com/${this.namespace}/${this.repo}/${
      type ? type + '/' : ''
    }`;
  }

  get defaultQuery(): string {
    const { namespace, repo } = this;
    return `query { repository(owner:"${namespace}", name:"${repo}") { stargazers { totalCount } forkCount watchers(first: 1) { totalCount } } }`;
  }

  constructor(
    private srv: GithubButtonService,
    private dom: DomSanitizer,
    private cdr: ChangeDetectorRef,
  ) {}

  private setCount(res: any) {
    const { callback, type, showZero, cdr } = this;
    const { data } = res;
    let c = '';
    if (data != null) {
      if (callback) {
        c = callback(data);
      } else {
        const { forkCount, stargazers, watchers } = data.repository;
        switch (type) {
          case 'forks':
            c = forkCount;
            break;
          case 'stargazers':
            c = stargazers!.totalCount;
            break;
          case 'watchers':
          case 'subscribers':
            c = watchers!.totalCount;
            break;
        }
        c = showZero && +c <= 0 ? '0' : c;
      }
    }
    this.value = c;
    cdr.detectChanges();
  }

  ngOnInit(): void {
    this.notify$ = this.srv.notify
      .pipe(
        filter(
          res =>
            res != null &&
            res.key ===
              this.srv.getKey(
                this.namespace,
                this.repo,
                this.query || this.defaultQuery,
              ),
        ),
      )
      .subscribe(res => this.setCount(res));
  }

  ngOnChanges(): void {
    const { namespace, repo, token, query, defaultQuery } = this;
    this.srv.req(namespace, repo, token, query || defaultQuery);
  }

  ngOnDestroy(): void {
    if (this.notify$) {
      this.notify$.unsubscribe();
    }
  }
}
