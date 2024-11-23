import {
  Component,
  Input,
  OnChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  ViewEncapsulation,
  inject,
  DestroyRef,
} from '@angular/core';
import { GithubButtonService } from './service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const isSSR = !(typeof document === 'object' && !!document);

@Component({
  selector: 'github-button',
  template: `
    <a class="gh-btn" [attr.href]="repo_url" target="_blank">
      <span class="gh-ico" aria-hidden="true"></span>
      <span class="gh-text">{{ typeToLabel[type] }}</span>
    </a>
    <a class="gh-count" target="_blank" [attr.href]="count_url" [style.display]="showZero || count > 0 ? 'block' : 'none'">
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
export class GithubButtonComponent implements OnChanges, OnInit {
  private srv = inject(GithubButtonService);
  private cdr = inject(ChangeDetectorRef);
  private d$ = inject(DestroyRef);
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

  private setCount(data: any): void {
    this.count = data ? data[`${this.type}_count`] : 0;
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.srv.notify.pipe(takeUntilDestroyed(this.d$)).subscribe((res) => this.setCount(res));
  }

  ngOnChanges(): void {
    if (isSSR) {
      return;
    }
    this.srv.req(this.namespace, this.repo);
  }
}
