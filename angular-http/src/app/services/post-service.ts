/**
 * PASSI 2 + PROVA TU (livello 1) - Il servizio dei post
 * (src/app/services/post-service.ts)
 * -----------------------------------------------------
 * TRACCIA 03.16: più richieste diverse allo stesso endpoint
 * https://jsonplaceholder.typicode.com/posts
 *
 *   getPost(id)         -> GET  /posts/{id}             (un post)
 *   getPosts()          -> GET  /posts                  (tutti i post)
 *   addPost(p)          -> POST /posts                  (crea un post)
 *   getPagina(pagina)   -> GET  /posts?_page=2&_limit=10 (Prova tu, livello 1)
 *
 * Nota importante: questi metodi NON fanno partire la richiesta. Restituiscono
 * un Observable (una "promessa di dati futuri"): la richiesta parte solo quando
 * il componente chiama subscribe(...). Due subscribe = due richieste HTTP.
 *
 * L'opzione params di HttpClient costruisce la query string da sola, con la
 * codifica corretta dei valori: ?_page=1&_limit=10.
 */
import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../modelli/post';

@Service()
export class PostService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://jsonplaceholder.typicode.com/posts';

  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.baseUrl}/${id}`);
  }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.baseUrl);
  }

  addPost(post: Omit<Post, 'id'>): Observable<Post> {
    // Omit<Post, 'id'> = un Post senza id: l'id lo assegna il server.
    // L'oggetto si passa così com'è: HttpClient lo serializza in JSON e imposta
    // da solo Content-Type: application/json (niente JSON.stringify).
    return this.http.post<Post>(this.baseUrl, post);
  }

  /**
   * PROVA TU (livello 1) - Una pagina di 10 post.
   * JSONPlaceholder finge la paginazione: _page=2&_limit=10 restituisce i post
   * con id da 11 a 20.
   */
  getPagina(pagina: number): Observable<Post[]> {
    return this.http.get<Post[]>(this.baseUrl, {
      params: { _page: pagina, _limit: 10 },
    });
  }
}
