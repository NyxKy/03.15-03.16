/**
 * PROVA TU (livello 2) - La pagina Pokédex (src/app/pokedex/pokedex.ts)
 * ---------------------------------------------------------------------
 * All'apertura carica i tipi di Pokémon da https://pokeapi.co/api/v2/type
 * e li mostra come badge. Un campo di ricerca chiama
 * https://pokeapi.co/api/v2/pokemon/{nome} con il nome minuscolo o il numero
 * e mostra nome, immagine, altezza e peso (divisi per 10: metri e chilogrammi).
 * Se il Pokémon non esiste la PokéAPI risponde 404: mostriamo "Pokémon non trovato".
 *
 * La classe si chiama Pokedex e non Pokemon per non scontrarsi con l'interfaccia
 * Pokemon di src/app/modelli/pokemon.ts.
 */
import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Pokemon, PokemonTypeSlot } from '../modelli/pokemon';
import { PokemonService } from '../services/pokemon-service';

@Component({
  imports: [],
  selector: 'app-pokedex',
  styleUrl: './pokedex.css',
  templateUrl: './pokedex.html',
})
export class Pokedex implements OnInit {
  private readonly pokemonService = inject(PokemonService);

  readonly tipi = signal<PokemonTypeSlot[]>([]);
  readonly pokemon = signal<Pokemon | null>(null);
  readonly loading = signal(false);
  readonly errore = signal<string | null>(null);

  ngOnInit(): void {
    this.loading.set(true);
    this.pokemonService.getTypes().subscribe({
      next: (dati) => {
        this.tipi.set(dati.results);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.errore.set(`Errore ${err.status}: ${err.message}`);
        this.loading.set(false);
      },
    });
  }

  cerca(nome: string): void {
    const cercato = nome.trim().toLowerCase();
    if (!cercato) {
      this.errore.set('Scrivi il nome o il numero di un Pokémon.');
      return;
    }
    this.loading.set(true);
    this.errore.set(null);
    this.pokemonService.getPokemon(cercato).subscribe({
      next: (dati) => {
        this.pokemon.set(dati);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.errore.set('Pokémon non trovato');
        } else {
          this.errore.set(`Errore ${err.status}: ${err.message}`);
        }
        this.loading.set(false);
      },
    });
  }
}
