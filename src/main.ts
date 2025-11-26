import { provideHttpClient } from '@angular/common/http';
import { App } from './app';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';

bootstrapApplication(App, {
  providers: [provideHttpClient(), provideZonelessChangeDetection()],
}).catch((err) => console.error(err));
