/**
 * PASSO 1 - Il componente radice (src/app/app.ts)
 * -----------------------------------------------
 * TRACCIA 03.16: la cornice dell'applicazione.
 *
 * La classe App è VUOTA di proposito: la barra di navigazione è solo impaginazione,
 * i dati li carica ciascuna pagina. RouterOutlet è il "buco" dove il router disegna
 * la pagina attiva; RouterLink fa i link interni (niente ricarica della pagina) e
 * RouterLinkActive aggiunge la classe 'active' alla voce della pagina corrente.
 */
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}
