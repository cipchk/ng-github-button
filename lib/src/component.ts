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
import { CommonModule } from '@angular/common';

const isSSR = !(typeof document === 'object' && !!document);

@Component({
  selector: 'github-button',
  template: `
    <a class="gh-btn" [href]="repo_url" target="_blank">
      <span class="gh-ico" aria-hidden="true"></span>
      <span class="gh-text">{{ typeToLabel[type] }}</span>
    </a>
    <a class="gh-count" target="_blank" [href]="count_url" [ngStyle]="{ display: showZero || count > 0 ? 'block' : 'none' }">
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
  standalone: true,
  imports: [CommonModule],
})
export class GithubButtonComponent implements OnChanges, OnInit, OnDestroy {
  private notify$?: Subscription;
  typeToLabel = {
    stargazers: 'Star',
    subscribers: 'Watch',
    forks: 'Fork',
  };
  typeToPath: { [key: string]: string } = {
    forks: 'network',
  };
  count = 0;

  @Input() type: 'stargazers' | 'subscribers' | 'forks' = 'stargazers';
  @Input() size: 'default' | 'large' = 'default';
  @Input({ required: true }) namespace!: string;
  @Input({ required: true }) repo!: string;
  @Input() showZero = false;

  get repo_url(): string {
    return `//github.com/${this.namespace}/${this.repo}/`;
  }

  get count_url(): string {
    return `//github.com/${this.namespace}/${this.repo}/${this.typeToPath[this.type] || this.type}/`;
  }

  constructor(private srv: GithubButtonService, private cdr: ChangeDetectorRef) {}

  private setCount(data: any): void {
    this.count = data ? data[`${this.type}_count`] : 0;
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.notify$ = this.srv.notify.subscribe((res) => this.setCount(res));
  }

  ngOnChanges(): void {
    if (isSSR) {
      return;
    }
    this.srv.req(this.namespace, this.repo);
  }

  ngOnDestroy(): void {
    this.notify$?.unsubscribe();
  }
}
