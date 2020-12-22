import { Component, ViewChild, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';

import { GithubButtonModule } from '../src/module';
import { GithubButtonComponent } from '../src/component';

describe('github-button', () => {
  let fixture: ComponentFixture<TestComponent>;
  let context: TestComponent;
  let dl: DebugElement;
  let httpBed: HttpTestingController;

  function getCountEl(): HTMLElement {
    return dl.query(By.css('.gh-count')).nativeElement as HTMLElement;
  }
  function getCount(): number {
    const value = getCountEl().textContent.trim();
    return +value;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, GithubButtonModule],
      declarations: [TestComponent],
    });
    fixture = TestBed.createComponent(TestComponent);
    context = fixture.componentInstance;
    dl = fixture.debugElement;

    httpBed = TestBed.inject(HttpTestingController);
  });

  function mockHttp(data: any, status = 200): void {
    const ret = httpBed.expectOne(() => true) as TestRequest;
    ret.flush(data, { status, statusText: status.toString() });
  }

  describe('[property]', () => {
    it(`#type="stargazers"`, () => {
      context.type = 'stargazers';
      fixture.detectChanges();
      mockHttp({ stargazers_count: 10 });
      expect(getCount()).toBe(10);
    });
    it(`#type="subscribers"`, () => {
      context.type = 'subscribers';
      fixture.detectChanges();

      mockHttp({ subscribers_count: 5 });
      expect(getCount()).toBe(5);
    });
    it(`#type="forks"`, () => {
      context.type = 'forks';
      fixture.detectChanges();

      mockHttp({ forks_count: 3 });
      expect(getCount()).toBe(3);
    });

    it('#size', () => {
      context.type = 'forks';
      context.size = 'large';
      fixture.detectChanges();

      mockHttp({ forks_count: 3 });
      expect((dl.nativeElement as HTMLElement).querySelector('github-button').classList).toContain('github-btn-large');
    });

    it('#repo_url', () => {
      context.type = 'forks';
      context.size = 'large';
      context.namespace = 'cipchk';
      context.repo = 'ng-github-button';
      fixture.detectChanges();

      mockHttp({ forks_count: 3 });
      expect((dl.nativeElement as HTMLElement).querySelector('.gh-btn').attributes.getNamedItem('href').textContent).toContain(
        `//github.com/cipchk/ng-github-button/`,
      );
    });
  });

  it('should be show count when request invalid data and showZero is true', () => {
    context.type = 'forks';
    context.showZero = true;
    fixture.detectChanges();

    mockHttp(null);
    expect(getCountEl().style.display).toBe('block');
  });

  it('should be hide count when request invalid data', () => {
    context.type = 'forks';
    fixture.detectChanges();

    mockHttp(null);
    expect(getCountEl().style.display).toBe('none');
  });

  it('should be hide count when invalid request', () => {
    context.type = 'forks';
    fixture.detectChanges();

    mockHttp(null, 201);
    expect(getCountEl().style.display).toBe('none');
  });

  it('should be cached data', () => {
    context.type = 'stargazers';
    fixture.detectChanges();

    mockHttp({ stargazers_count: 10, subscribers_count: 11 });
    expect(getCount()).toBe(10);
    context.type = 'subscribers';
    fixture.detectChanges();
    expect(getCount()).toBe(11);
  });
});

@Component({
  template: `
    <github-button #comp [showZero]="showZero" [type]="type" [size]="size" [namespace]="namespace" [repo]="repo"></github-button>
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
