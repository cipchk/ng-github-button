import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  inject,
  input,
  booleanAttribute,
  computed,
  effect,
  signal,
} from '@angular/core';
import { GithubButtonService } from './service';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

const isSSR = !(typeof document === 'object' && !!document);

export type GithubButtonType = 'stargazers' | 'subscribers' | 'forks';
export type GithubButtonSize = 'default' | 'large';

@Component({
  selector: 'github-button',
  template: `
    <a class="gh-btn" [attr.href]="repo_url()" target="_blank">
      <span class="gh-ico" aria-hidden="true"></span>
      <span class="gh-text">{{ typeToLabel[type()] }}</span>
    </a>
      <a class="gh-count" target="_blank" [attr.href]="count_url()" [style.display]="showZero() || count() > 0 ? 'block' : 'none'">
        {{ count() }}
      </a>
    <ng-content />
  `,
  styleUrls: ['./style.less'],
  host: {
    '[class.github-btn-large]': `size() === 'large'`,
  },
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GithubButtonComponent {
  private readonly srv = inject(GithubButtonService);
  readonly typeToLabel = {
    stargazers: 'Star',
    subscribers: 'Watch',
    forks: 'Fork',
  };
  private readonly typeToPath: Record<string, string> = {
    forks: 'network',
  };

  readonly type = input<GithubButtonType>('stargazers');
  readonly size = input<GithubButtonSize>('default');
  readonly namespace = input.required<string>();
  readonly repo = input.required<string>();
  readonly showZero = input(false, { transform: booleanAttribute });

  protected repo_url = computed(() => `//github.com/${this.namespace()}/${this.repo()}/`);
  protected count_url = computed(() => {
    const repo_url = this.repo_url();
    const type = this.type();
    return `${repo_url}${this.typeToPath[type] || type}/`;
  });
  private _data = signal<Record<string, any> | null>(null);
  protected count = computed(() => this._data()?.[`${this.type()}_count`] ?? 0);

  constructor() {
    toObservable(this.type).pipe(takeUntilDestroyed()).subscribe((res) => {
      console.log('type changed:', res);
    });
    this.srv.notify.pipe(takeUntilDestroyed()).subscribe(res => {
      this._data.set(res);
    });
    effect(() => {
      const namespace = this.namespace();
      const repo = this.repo();
      if (isSSR) return;
      this.srv.req(namespace, repo);
    });
  }
}
