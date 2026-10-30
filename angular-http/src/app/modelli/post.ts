/**
 * PASSO 2 - Il modello di un post (src/app/modelli/post.ts)
 * --------------------------------------------------------
 * L'interfaccia si scrive guardando la risposta di
 * https://jsonplaceholder.typicode.com/posts/1:
 * { "userId": 1, "id": 1, "title": "...", "body": "..." }.
 *
 * Serve a TypeScript, non al server: la risposta HTTP arriva comunque, ma il
 * compilatore la tratta come se fosse un Post e ci segnala subito i nomi sbagliati.
 */
export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}
