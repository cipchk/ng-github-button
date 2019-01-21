import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GithubButtonService {
  private cached: { [url: string]: any } = {};
  private _notify = new BehaviorSubject<{ [url: string]: any }>(null);

  get notify() {
    return this._notify.asObservable();
  }

  req(namespace: string, repo: string): void {
    const url = `https://api.github.com/repos/${namespace}/${repo}`;
    if (this.cached[url] != null) {
      this._notify.next(this.cached[url]);
      return;
    }
    this.cached[url] = {};
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        this.cached[url] = JSON.parse(xhr.responseText);
        this._notify.next(this.cached[url]);
        return;
      }
    };
    xhr.open('GET', url, true);
    xhr.send();
  }
}
