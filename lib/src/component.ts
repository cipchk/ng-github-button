import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  inject,
  input,
  booleanAttribute,
  computed,
  effect,
  afterNextRender,
  signal,
} from '@angular/core';
import { GithubButtonService } from './service';

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
  private srv = inject(GithubButtonService);
  typeToLabel = {
    stargazers: 'Star',
    subscribers: 'Watch',
    forks: 'Fork',
  };
  private typeToPath: Record<string, string> = {
    forks: 'network',
  };

  type = input<GithubButtonType>('stargazers');
  size = input<GithubButtonSize>('default');
  namespace = input.required<string>();
  repo = input.required<string>();
  showZero = input(false, { transform: booleanAttribute });

  repo_url = computed(() => `//github.com/${this.namespace()}/${this.repo()}/`);
  count_url = computed(() => {
    const repo_url = this.repo_url();
    const type = this.type();
    return `${repo_url}${this.typeToPath[type] || type}/`;
  });
  count = signal(0);

  constructor() {
    afterNextRender(() => {
      this.srv.notify.subscribe(res => {
        this.count.set(res ? res[`${this.type()}_count`] : 0);
      });
    });
    effect(() => {
      const namespace = this.namespace();
      const repo = this.repo();
      this.type();
      if (isSSR) return;
      this.srv.req(namespace, repo);
    });
  }
}
