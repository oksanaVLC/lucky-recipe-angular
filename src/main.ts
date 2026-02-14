import { provideHttpClient } from '@angular/common/http'; // <-- añadir
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { register } from 'swiper/element/bundle';
import { AppComponent } from './app/app';
import { appConfig } from './app/app.config';
import { routes } from './app/app.routes';

register();

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),

    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
    ),
    provideHttpClient(),
  ],
}).catch((err) => console.error(err));
