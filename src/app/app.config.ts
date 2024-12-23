import { ApplicationConfig } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ProviderInterceptor } from './core/interceptors/provider.interceptor';
import { AuthService } from './core/services/auth.service';
import { jwtInterceptorFn } from './core/interceptors/jwt.interceptor';



export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([jwtInterceptorFn])),
    provideHttpClient(withInterceptors([ProviderInterceptor])),
    provideRouter(routes,withPreloading(PreloadAllModules)),
    provideAnimations(),
    AuthService
  ]
};
