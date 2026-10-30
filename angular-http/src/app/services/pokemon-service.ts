/**
 * PROVA TU (livello 2) - Il servizio della PokéAPI (src/app/services/pokemon-service.ts)
 * ------------------------------------------------------------------------------------
 *   getTypes()          -> GET https://pokeapi.co/api/v2/type
 *   getPokemon(nome)    -> GET https://pokeapi.co/api/v2/pokemon/{nome}
 *
 * Il nome può essere il nome minuscolo ('pikachu') oppure il numero ('25').
 * Se il Pokémon non esiste la PokéAPI risponde 404: lo gestisce il componente.
 */
import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pokemon, PokemonTypeList } from '../modelli/pokemon';

@Service()
export class PokemonService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://pokeapi.co/api/v2';

  getTypes(): Observable<PokemonTypeList> {
    return this.http.get<PokemonTypeList>(`${this.baseUrl}/type`);
  }

  getPokemon(nome: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.baseUrl}/pokemon/${nome}`);
  }
}
