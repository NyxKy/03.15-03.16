/**
 * PASSO 1 - La configurazione dell'applicazione (src/app/app.config.ts)
 * -------------------------------------------------------------------
 * TRACCIA 03.16: qui si abilita HttpClient e si dice all'app che esistono le
 * rotte del router.
 *
 * provideBrowserGlobalErrorListeners() = fa arrivare alla console gli errori
 *                                        non gestiti del browser.
 * provideRouter(routes)                = attiva il router con le rotte di app.routes.ts.
 * provideHttpClient()                  = rende disponibile HttpClient in tutta l'app:
 *                                        senza questa riga, inject(HttpClient) non trova
 *                                        il provider e Angular lancia NullInjectorError:
 *                                        No provider for HttpClient!.
 */
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
  ],
};
