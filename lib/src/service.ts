import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GithubButtonService {
  private cached: { [url: string]: any } = {};
  private _notify = new BehaviorSubject<{ [url: string]: any }>(null);

  get notify() {
    return this._notify.asObservable();
  }

  constructor(private http: HttpClient) {}

  getKey(namespace: string, repo: string, query: string): string {
    return `${namespace}_${repo}_${query}`;
  }

  req(namespace: string, repo: string, token: string, query: string): void {
    const key = this.getKey(namespace, repo, query);
    if (this.cached[key] === null) {
      this._notify.next(this.cached[key]);
      return;
    }
    this.cached[key] = null;
    this.http
      .post(
        `https://api.github.com/graphql`,
        {
          query,
        },
        {
          headers: {
            // Authorization: `bearer ${token}`,
          },
        },
      )
      .subscribe((res: any) => {
        this.cached[key] = { key, data: res.data };
        this._notify.next(this.cached[key]);
      });
  }
}
