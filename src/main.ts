import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient(), provideZonelessChangeDetection()],
}).catch((err) => console.error(err));
