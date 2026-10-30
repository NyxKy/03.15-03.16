/**
 * PROVA TU (livello 2) - I modelli della PokéAPI (src/app/modelli/pokemon.ts)
 * --------------------------------------------------------------------------
 * Le interfacce si scrivono guardando le risposte nel browser:
 *
 * GET https://pokeapi.co/api/v2/type ->
 *   { "count": 21, "next": "...", "previous": null,
 *     "results": [ { "name": "normal", "url": "https://pokeapi.co/api/v2/type/1/" }, ... ] }
 *
 * GET https://pokeapi.co/api/v2/pokemon/25 ->
 *   un oggetto enorme: a noi servono name, height, weight e sprites.front_default.
 *   Attenzione alle unità: height è in decimetri e weight in ettogrammi
 *   (Pikachu: height 4, weight 60), quindi si dividono per 10 per avere metri e kg.
 */
export interface PokemonTypeSlot {
  name: string;
  url: string;
}

export interface PokemonTypeList {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonTypeSlot[];
}

export interface PokemonSprites {
  front_default: string | null;
}

export interface Pokemon {
  name: string;
  height: number;
  weight: number;
  sprites: PokemonSprites;
}
