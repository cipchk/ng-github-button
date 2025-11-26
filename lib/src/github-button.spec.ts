import { Component, DebugElement, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { GithubButtonComponent, GithubButtonSize, GithubButtonType } from './github-button';
import { provideHttpClient } from '@angular/common/http';

describe('github-button', () => {
  let fixture: ComponentFixture<TestComponent>;
  let context: TestComponent;
  let dl: DebugElement;
  let httpBed: HttpTestingController;

  function getCountEl(): HTMLElement {
    return dl.query(By.css('.gh-count')).nativeElement as HTMLElement;
  }
  function getCount(): number {
    const value = getCountEl().textContent!.trim();
    return +value;
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideZonelessChangeDetection()],
      imports: [TestComponent],
    });
    fixture = TestBed.createComponent(TestComponent);
    await fixture.whenStable();
    context = fixture.componentInstance;
    dl = fixture.debugElement;

    httpBed = TestBed.inject(HttpTestingController);
  });

  function mockHttp(data: any, status = 200): void {
    const req = httpBed.expectOne(() => true);
    req.flush(data, { status, statusText: status.toString() });
    TestBed.tick();
  }

  describe('[property]', () => {
    it(`#type="stargazers"`, () => {
      context.type.set('stargazers');
      mockHttp({ stargazers_count: 10 });
      expect(getCount()).toBe(10);
    });
    it(`#type="subscribers"`, () => {
      context.type.set('subscribers');
      mockHttp({ subscribers_count: 5 });
      expect(getCount()).toBe(5);
    });
    it(`#type="forks"`, () => {
      context.type.set('forks');
      mockHttp({ forks_count: 3 });
      expect(getCount()).toBe(3);
    });

    it('#size', () => {
      context.type.set('forks');
      context.size.set('large');

      mockHttp({ forks_count: 3 });
      expect((dl.nativeElement as HTMLElement).querySelector('github-button')!.classList).toContain('github-btn-large');
    });

    it('#repo_url', () => {
      context.type.set('forks');
      context.size.set('large');
      context.namespace.set('cipchk');
      context.repo.set('ng-github-button');

      mockHttp({ forks_count: 3 });
      expect((dl.nativeElement as HTMLElement).querySelector('.gh-btn')!.attributes.getNamedItem('href')!.textContent).toContain(
        `//github.com/cipchk/ng-github-button/`,
      );
    });
  });

  it('should be show count when request invalid data and showZero is true', () => {
    context.type.set('forks');
    context.showZero.set(true);

    mockHttp(null);
    expect(getCountEl().style.display).toBe('block');
  });

  it('should be hide count when request invalid data', () => {
    context.type.set('forks');

    mockHttp(null);
    expect(getCountEl().style.display).toBe('none');
  });

  it('should be hide count when invalid request', () => {
    context.type.set('forks');

    mockHttp(null, 201);
    expect(getCountEl().style.display).toBe('none');
  });

  it('should be change type', () => {
    mockHttp({ stargazers_count: 10, subscribers_count: 11 });
    expect(getCount()).toBe(10);
    context.type.set('subscribers');
    fixture.detectChanges();
    expect(getCount()).toBe(11);
  });
});

@Component({
  template: `
    <github-button [showZero]="showZero()" [type]="type()" [size]="size()" [namespace]="namespace()" [repo]="repo()" />
  `,
  imports: [GithubButtonComponent],
})
class TestComponent {
  showZero = signal(false);
  type = signal<GithubButtonType>('stargazers');
  size = signal<GithubButtonSize>('default');
  namespace = signal('');
  repo = signal('');
}
