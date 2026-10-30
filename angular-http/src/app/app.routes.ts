/**
 * PASSO 1 - Le rotte delle tre pagine (src/app/app.routes.ts)
 * ----------------------------------------------------------
 * TRACCIA 03.16: ogni pagina mostra i dati di un'API pubblica diversa.
 *
 * ''      -> redirect al percorso 'posts' (pathMatch full: la stringa vuota
 *            deve corrispondere per intero, non come prefisso).
 * 'posts' -> PostService (JSONPlaceholder).
 * 'gatti' -> CatService (catfact.ninja).
 * 'nasa'  -> NasaService (APOD, la foto astronomica del giorno).
 * 'pokedex' -> PokemonService (Prova tu, livello 2).
 * '**'    -> qualunque URL sconosciuto torna ai post.
 */
import { Routes } from '@angular/router';
import { Posts } from './posts/posts';
import { Gatti } from './gatti/gatti';
import { Nasa } from './nasa/nasa';
import { Pokedex } from './pokedex/pokedex';

export const routes: Routes = [
  { path: '', redirectTo: 'posts', pathMatch: 'full' },
  { path: 'posts', component: Posts },
  { path: 'gatti', component: Gatti },
  { path: 'nasa', component: Nasa },
  { path: 'pokedex', component: Pokedex },
  { path: '**', redirectTo: 'posts' },
];
