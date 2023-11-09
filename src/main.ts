import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app';
import { bootstrapApplication } from '@angular/platform-browser';

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient()],
}).catch((err) => console.error(err));
