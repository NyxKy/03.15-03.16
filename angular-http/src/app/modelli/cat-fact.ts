/**
 * PASSO 7 - Il modello di un fatto sui gatti (src/app/modelli/cat-fact.ts)
 * ---------------------------------------------------------------------
 * La risposta di https://catfact.ninja/fact ha due campi:
 * { "fact": "...", "length": 123 }.
 */
export interface CatFact {
  fact: string;
  length: number;
}
