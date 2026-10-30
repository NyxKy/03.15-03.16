/**
 * PASSI 9 + PROVA TU (livello 3) - La pagina della NASA (src/app/nasa/nasa.ts)
 * ---------------------------------------------------------------------------
 * GET https://api.nasa.gov/planetary/apod?api_key=...
 * GET https://api.nasa.gov/planetary/apod?api_key=...&date=AAAA-MM-GG
 *
 * Se la chiave è sbagliata il server risponde 403 Forbidden; se la chiave è
 * valida ma ha finito le richieste 429 Too Many Requests; se il server non
 * risponde affatto lo stato è 0; se la data è nel futuro 400 Bad Request.
 * Ogni caso ha un messaggio diverso, spiegato all'utente.
 */
import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Apod } from '../modelli/apod';
import { NasaService } from '../services/nasa-service';

@Component({
  imports: [],
  selector: 'app-nasa',
  styleUrl: './nasa.css',
  templateUrl: './nasa.html',
})
export class Nasa implements OnInit {
  private readonly nasaService = inject(NasaService);

  readonly apod = signal<Apod | null>(null);
  readonly loading = signal(false);
  readonly errore = signal<string | null>(null);
  /** PROVA TU (livello 3): il giorno scelto con il campo date. */
  readonly dataScelta = signal('');

  ngOnInit(): void {
    this.caricaOggi();
  }

  /** Chiama il servizio e gestisce i tre esiti: dati, errore, spinner. */
  caricaOggi(): void {
    this.loading.set(true);
    this.errore.set(null);
    this.nasaService.getApod().subscribe({
      next: (dato) => {
        this.apod.set(dato);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.errore.set(this.messaggio(err.status, err.message));
        this.loading.set(false);
      },
    });
  }

  /**
   * PROVA TU (livello 3): carica l'APOD della data scelta.
   * Con una data futura la NASA risponde 400 Bad Request e il messaggio lo dice.
   */
  caricaDel(data: string): void {
    if (!data) {
      this.errore.set('Scegli una data con il calendario.');
      return;
    }
    this.dataScelta.set(data);
    this.loading.set(true);
    this.errore.set(null);
    this.nasaService.getApodDel(data).subscribe({
      next: (dato) => {
        this.apod.set(dato);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.errore.set(this.messaggio(err.status, err.message));
        this.loading.set(false);
      },
    });
  }

  /** Traduce il codice di stato in un messaggio comprensibile. */
  private messaggio(status: number, dettaglio: string): string {
    switch (status) {
      case 403:
        return 'Chiave API mancante o non valida: controlla i file in src/environments.';
      case 429:
        return 'Troppe richieste con questa chiave: riprova più tardi.';
      case 0:
        return 'Il server non è raggiungibile: controlla la connessione.';
      case 400:
        return 'Data non valida: APOD risponde 400 Bad Request per le date future. Scegli oggi o una data passata.';
      default:
        return `Errore ${status} dal server della NASA. (${dettaglio})`;
    }
  }
}
