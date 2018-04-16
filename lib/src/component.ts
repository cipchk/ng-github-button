import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';

@Component({
    selector: 'github-button',
    template: `
    <a class="gh-btn" href="{{repo_url}}" target="_blank">
        <span class="gh-ico" aria-hidden="true"></span>
        <span class="gh-text">{{typeToLabel[type]}}</span>
    </a>
    <a class="gh-count" target="_blank" href="{{count_url}}" [ngStyle]="{'display': count ? 'block' : 'none' }">
        {{ count }}
    </a>
    <ng-content></ng-content>
    `,
    styleUrls: ['./style.less'],
    host: {
        '[class.github-btn-large]': `size === 'large'`
    }
})
export class GithubButtonComponent implements OnChanges, OnDestroy {

    private xhr: any;

    typeToLabel = {
        stargazers: 'Star',
        subscribers: 'Watch',
        forks: 'Fork',
    };
    typeToPath = {
        forks: 'network'
    };
    count: number;

    // region: fields

    @Input() type: 'stargazers' | 'subscribers' | 'forks' = 'stargazers';

    @Input() size: 'default' | 'large';

    @Input() namespace: string;

    @Input() repo: string;

    // endregion

    get repo_url() {
        return `//github.com/${this.namespace}/${this.repo}/`;
    }

    get count_url() {
        return `//github.com/${this.namespace}/${this.repo}/${this.typeToPath[this.type] || this.type}/`;
    }

    private setCount(data: any) {
        if (!data) return;
        this.count = +data[`${this.type}_count`];
    }

    private req(): this {
        this.clearXhr();
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                this.setCount(JSON.parse(xhr.responseText));
            }
        };
        xhr.open('GET', `//api.github.com/repos/${this.namespace}/${this.repo}`, true);
        xhr.send();
        this.xhr = xhr;
        return this;
    }

    private clearXhr() {
        if (!this.xhr) return ;
        this.xhr.abort();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.req();
    }

    ngOnDestroy(): void {
        this.clearXhr();
    }
}
