import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authHttpInterceptorFn, provideAuth0 } from '@auth0/auth0-angular';
import myAppConfig from './config/my-app-config';
//import { AuthInterceptorService } from './services/auth-interceptor.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      //withInterceptors([AuthInterceptorService])
      withInterceptors([authHttpInterceptorFn])
    ),
    provideClientHydration(withEventReplay()),


    // Auth0
    provideAuth0({
      ...myAppConfig.auth,
      httpInterceptor: {
        ...myAppConfig.httpInterceptor
        //allowedList: myAppConfig.httpInterceptor.allowedList
      },

      /*domain: 'dev-caumwi3vx0hpzdnd.us.auth0.com',
      clientId: 'hoRd1Twrdra3MoekYTaB2wQ31jthUaWA',
      authorizationParams: {
        redirect_uri: window.location.origin
        //redirect_uri: "http://localhost:4200",
        //redirect_uri: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4200',
      }*/

      /*domain: 'dev-caumwi3vx0hpzdnd.us.auth0.com',
      clientId: 'hoRd1Twrdra3MoekYTaB2wQ31jthUaWA',
      authorizationParams: {
        redirect_uri: "http://localhost:4200/login/callback",
        audience: "http://localhost:8080",
      }*/
    }),
    /*httpInterceptor: {
        allowedList: ['http://localhost:8080/api/orders/**','http://localhost:8080/api/checkout/purchase'],
    },*/
  ]
};
