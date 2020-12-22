import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class GithubButtonService {
  private cached: { [url: string]: any } = {};
  // tslint:disable-next-line: variable-name
  private _notify = new BehaviorSubject<{ [url: string]: any }>(null);

  get notify(): Observable<{ [url: string]: any }> {
    return this._notify.asObservable();
  }

  constructor(private http: HttpClient) {}

  req(namespace: string, repo: string): void {
    const url = `https://api.github.com/repos/${namespace}/${repo}`;
    if (this.cached[url] != null) {
      this._notify.next(this.cached[url]);
      return;
    }
    this.cached[url] = {};
    this.http.get(url).subscribe((res) => {
      this.cached[url] = res;
      this._notify.next(this.cached[url]);
    });
  }
}
