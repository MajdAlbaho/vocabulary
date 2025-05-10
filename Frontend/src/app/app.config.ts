import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { routes } from './app.routes';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { RoleGuardService } from './services/auth/role-guard.service';
import { AuthService } from './services/auth/auth.service';
import { APP_BASE_HREF, DatePipe, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { provideToastr } from 'ngx-toastr';
import { TokenInterceptor } from './services/auth/token.interceptor';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    JwtHelperService,
    RoleGuardService,
    AuthService,
    DatePipe,
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([TokenInterceptor])),
    provideToastr({
      timeOut: 3000,
      closeButton: true,
      progressBar: true,
      progressAnimation: 'decreasing'
    }),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      }),
    )
  ]
};
