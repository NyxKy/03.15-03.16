/**
 * PASSO 9 - Il modello APOD della NASA (src/app/modelli/apod.ts)
 * -------------------------------------------------------------
 * Astronomy Picture of the Day: la risposta contiene, tra gli altri, questi campi.
 * copyright c'è solo per alcune immagini: per questo il punto interrogativo.
 * media_type vale 'image' oppure 'video': certi giorni la foto è un filmato.
 */
export interface Apod {
  date: string;
  title: string;
  explanation: string;
  url: string;
  media_type: string;
  copyright?: string;
}
