/**
 * PASSO 7 - Il servizio dei fatti sui gatti (src/app/services/cat-service.ts)
 * --------------------------------------------------------------------------
 * TRACCIA 03.16: GET https://catfact.ninja/fact restituisce
 * { "fact": "...", "length": 123 }.
 *
 * Anche qui il metodo restituisce un Observable: la richiesta parte solo con subscribe.
 */
import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CatFact } from '../modelli/cat-fact';

@Service()
export class CatService {
  private readonly http = inject(HttpClient);

  getRandomFact(): Observable<CatFact> {
    return this.http.get<CatFact>('https://catfact.ninja/fact');
  }
}
