import { Component, ViewChild, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { GithubButtonModule } from '../src/module';
import { GithubButtonComponent } from '../src/component';

describe('github-button', () => {
  let fixture: ComponentFixture<TestComponent>;
  let context: TestComponent;
  let dl: DebugElement;
  const win = window as any;
  const oldXMLHttpRequest = win.XMLHttpRequest;
  function genXhr(status: number, text: any) {
    spyOn(win, 'XMLHttpRequest').and.callFake(() => {
      return {
        responseText: JSON.stringify(text),
        readyState: XMLHttpRequest.DONE,
        status,
        open() {},
        send() {
          this.onreadystatechange();
        },
        abort() {},
      };
    });
  }
  function getCountEl(): HTMLElement {
    return dl.query(By.css('.gh-count')).nativeElement as HTMLElement;
  }
  function getCount() {
    const value = getCountEl().textContent.trim();
    return +value;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [GithubButtonModule],
    });
    fixture = TestBed.createComponent(TestComponent);
    context = fixture.componentInstance;
    dl = fixture.debugElement;
  });

  afterEach(() => (win.XMLHttpRequest = oldXMLHttpRequest));

  describe('[property]', () => {
    it(`#type="stargazers"`, () => {
      genXhr(200, { stargazers_count: 10 });
      context.type = 'stargazers';
      fixture.detectChanges();
      expect(getCount()).toBe(10);
    });
    it(`#type="subscribers"`, () => {
      genXhr(200, { subscribers_count: 5 });
      context.type = 'subscribers';
      fixture.detectChanges();
      expect(getCount()).toBe(5);
    });
    it(`#type="forks"`, () => {
      genXhr(200, { forks_count: 3 });
      context.type = 'forks';
      fixture.detectChanges();
      expect(getCount()).toBe(3);
    });

    it('#size', () => {
      genXhr(200, { forks_count: 3 });
      context.type = 'forks';
      context.size = 'large';
      fixture.detectChanges();
      expect(
        (dl.nativeElement as HTMLElement).querySelector('github-button')
          .classList,
      ).toContain('github-btn-large');
    });

    it('#repo_url', () => {
      genXhr(200, { forks_count: 3 });
      context.type = 'forks';
      context.size = 'large';
      context.namespace = 'cipchk';
      context.repo = 'ng-github-button';
      fixture.detectChanges();
      expect(
        (dl.nativeElement as HTMLElement)
          .querySelector('.gh-btn')
          .attributes.getNamedItem('href').textContent,
      ).toContain(`//github.com/cipchk/ng-github-button/`);
    });
  });

  it('should be show count when request invalid data and showZero is true', () => {
    genXhr(200, null);
    context.type = 'forks';
    context.showZero = true;
    fixture.detectChanges();
    expect(getCountEl().style.display).toBe('block');
  });

  it('should be hide count when request invalid data', () => {
    genXhr(200, null);
    context.type = 'forks';
    fixture.detectChanges();
    expect(getCountEl().style.display).toBe('none');
  });

  it('should be hide count when invalid request', () => {
    genXhr(201, null);
    context.type = 'forks';
    fixture.detectChanges();
    expect(getCountEl().style.display).toBe('none');
  });

  it('should be cached data', () => {
    genXhr(200, { stargazers_count: 10, subscribers_count: 11 });
    context.type = 'stargazers';
    fixture.detectChanges();
    expect(getCount()).toBe(10);
    context.type = 'subscribers';
    fixture.detectChanges();
    expect(getCount()).toBe(11);
  });
});

@Component({
  template: `
    <github-button
      #comp
      [showZero]="showZero"
      [type]="type"
      [size]="size"
      [namespace]="namespace"
      [repo]="repo"
    ></github-button>
  `,
})
class TestComponent {
  @ViewChild('comp')
  comp: GithubButtonComponent;
  showZero = false;
  type = 'stargazers';
  size: string;
  namespace: string;
  repo: string;
}