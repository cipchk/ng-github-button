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

@Component({
  selector: 'github-button',
  template: `
    <a class="gh-btn" href="{{ repo_url }}" target="_blank">
      <span class="gh-ico" aria-hidden="true"></span>
      <span class="gh-text">{{ typeToLabel[type] }}</span>
    </a>
    <a
      class="gh-count"
      target="_blank"
      href="{{ count_url }}"
      [ngStyle]="{ display: showZero || count > 0 ? 'block' : 'none' }"
    >
      {{ count }}
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
  typeToLabel = {
    stargazers: 'Star',
    subscribers: 'Watch',
    forks: 'Fork',
  };
  typeToPath = {
    forks: 'network',
  };
  count: number;

  // region: fields

  @Input() type: 'stargazers' | 'subscribers' | 'forks' = 'stargazers';

  @Input() size: 'default' | 'large';

  @Input() namespace: string;

  @Input() repo: string;

  @Input() showZero = false;

  // endregion

  get repo_url() {
    return `//github.com/${this.namespace}/${this.repo}/`;
  }

  get count_url() {
    return `//github.com/${this.namespace}/${this.repo}/${this.typeToPath[
      this.type
    ] || this.type}/`;
  }

  constructor(
    private srv: GithubButtonService,
    private cdr: ChangeDetectorRef,
  ) {}

  private setCount(data: any) {
    this.count = data ? data[`${this.type}_count`] : 0;
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.notify$ = this.srv.notify.subscribe(res => this.setCount(res));
  }

  ngOnChanges(): void {
    this.srv.req(this.namespace, this.repo);
  }

  ngOnDestroy(): void {
    this.notify$.unsubscribe();
  }
}
