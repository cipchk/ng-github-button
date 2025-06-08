import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class GithubButtonService {
  private http = inject(HttpClient);
  private cached: Record<string, any> = {};
  private _notify = new BehaviorSubject<Record<string, any> | null>(null);

  get notify(): Observable<Record<string, any> | null> {
    return this._notify.asObservable();
  }

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
