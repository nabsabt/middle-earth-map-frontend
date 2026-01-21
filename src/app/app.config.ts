import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  PLATFORM_ID,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpBackend, HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { LangInterceptor } from './@Service/lang.interceptor';
import { isPlatformBrowser } from '@angular/common';
import { of } from 'rxjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),

    provideClientHydration(withEventReplay()),
    importProvidersFrom(OverlayModule, PortalModule),
    ...(TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpBackend], // ←
      },
    }).providers ?? []),
    provideHttpClient(withInterceptors([LangInterceptor])),
  ],
};

export function HttpLoaderFactory(httpHandler: HttpBackend): TranslateLoader {
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return {
      getTranslation: () => of({}),
    };
  }
  return new TranslateHttpLoader(new HttpClient(httpHandler), './assets/i18n/', '.json');
}
