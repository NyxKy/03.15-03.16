/**
 * PASSI 9 + PROVA TU (livello 3) - Il servizio della NASA
 * (src/app/services/nasa-service.ts)
 * ------------------------------------------------------
 * L'APOD (Astronomy Picture of the Day) richiede una chiave API.
 * La chiave sta nei file di ambiente, che il .gitignore tiene fuori dal repository:
 *
 *   environment.ts              -> usato da ng build (produzione)
 *   environment.development.ts  -> usato da ng serve, al posto dell'altro
 *
 * Si importa SEMPRE il file senza suffisso ('../../environments/environment'):
 * è Angular, tramite le fileReplacements di angular.json, a scegliere la versione
 * giusta per la configurazione corrente. L'opzione params aggiunge ?api_key=...
 * (HttpClient codifica da solo il valore).
 */
import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Apod } from '../modelli/apod';
import { environment } from '../../environments/environment';

@Service()
export class NasaService {
  private readonly http = inject(HttpClient);
  private readonly url = 'https://api.nasa.gov/planetary/apod';

  getApod(): Observable<Apod> {
    return this.http.get<Apod>(this.url, {
      params: { api_key: environment.nasaApiKey },
    });
  }

  /**
   * PROVA TU (livello 3) - La foto di un altro giorno.
   * APOD accetta il parametro date nel formato AAAA-MM-GG. Se la data è nel futuro
   * il server risponde 400 Bad Request (vedi RISPOSTE.md).
   */
  getApodDel(data: string): Observable<Apod> {
    return this.http.get<Apod>(this.url, {
      params: { api_key: environment.nasaApiKey, date: data },
    });
  }
}
