/**
 * PASSI 3, 4, 5 + PROVA TU (livello 1) - La pagina dei post
 * (src/app/posts/posts.ts)
 * -------------------------------------------------------
 * caricaUno(numero)   -> GET  /posts/{id}              (Passo 3, con il pipe json)
 * caricaTutti()       -> GET  /posts                   (Passo 4, l'elenco dei 100 post)
 * invia()             -> POST /posts                   (Passo 5, crea un post)
 * caricaPagina(p)     -> GET  /posts?_page=p&_limit=10 (Prova tu, livello 1)
 *
 * Lo stato vive in signal: quando arriva la risposta, next chiama .set(...) e
 * Angular aggiorna la pagina. Con una proprietà semplice la risposta arriverebbe
 * (la si vedrebbe nella scheda Network) ma la pagina resterebbe vuota.
 */
import { Component, inject, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Post } from '../modelli/post';
import { PostService } from '../services/post-service';

@Component({
  imports: [JsonPipe],
  selector: 'app-posts',
  styleUrl: './posts.css',
  templateUrl: './posts.html',
})
export class Posts {
  private readonly postService = inject(PostService);

  readonly post = signal<Post | null>(null);
  readonly posts = signal<Post[]>([]);
  readonly loading = signal(false);
  readonly errore = signal<string | null>(null);

  /** PROVA TU (livello 1): paginazione in blocchi di 10 post. */
  readonly pagina = signal(1);
  readonly primaPagina = 1;
  readonly ultimaPagina = 10; // 100 post / 10 per pagina = 10 pagine

  /** Passo 3: carica un singolo post, scelto con il campo numerico. */
  caricaUno(numero: string): void {
    this.inizia();
    this.postService.getPost(Number(numero)).subscribe({
      next: (dato) => {
        this.post.set(dato);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => this.gestisciErrore(err),
    });
  }

  /** Passo 4: carica tutti i 100 post di JSONPlaceholder. */
  caricaTutti(): void {
    this.inizia();
    this.postService.getPosts().subscribe({
      next: (dati) => {
        this.posts.set(dati);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => this.gestisciErrore(err),
    });
  }

  /** Passo 5: invia un post nuovo. Il server risponde 201 con l'id 101. */
  invia(): void {
    this.inizia();
    this.postService
      .addPost({
        userId: 1,
        title: 'Primo post da Angular',
        body: 'Inviato con HttpClient',
      })
      .subscribe({
        next: (risposta) => {
          this.post.set(risposta);
          this.loading.set(false);
        },
        error: (err: HttpErrorResponse) => this.gestisciErrore(err),
      });
  }

  /** PROVA TU (livello 1): carica la pagina richiesta. */
  caricaPagina(pagina: number): void {
    this.inizia();
    this.postService.getPagina(pagina).subscribe({
      next: (dati) => {
        this.pagina.set(pagina);
        this.posts.set(dati);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => this.gestisciErrore(err),
    });
  }

  precedente(): void {
    if (this.loading() || this.pagina() <= this.primaPagina) {
      return;
    }
    this.caricaPagina(this.pagina() - 1);
  }

  successiva(): void {
    if (this.loading() || this.pagina() >= this.ultimaPagina) {
      return;
    }
    this.caricaPagina(this.pagina() + 1);
  }

  /** Prima di ogni richiesta: accende lo spinner e pulisce l'avviso. */
  private inizia(): void {
    this.loading.set(true);
    this.errore.set(null);
  }

  /** Gestione comune degli errori: codice di stato e messaggio di Angular. */
  private gestisciErrore(err: HttpErrorResponse): void {
    this.errore.set(`Errore ${err.status}: ${err.message}`);
    this.loading.set(false);
  }
}
