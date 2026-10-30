# RISPOSTE — LAB 03.16 (Chiamate HTTP) e TEO 03.15 (HTTP e API REST)

Questo file contiene:

- **Parte 1 — LAB 03.16**: che cosa è stato costruito, la tabella della scheda
  Network del Passo 6, le risposte alle 10 domande finali, i tre livelli della
  Prova tu (con la domanda sulle date future degli APOD) e le verifiche fatte.
- **Parte 2 — TEO 03.15**: le risposte alle 12 domande di verifica.

**Ambiente usato**: Angular **22.2.4** (CLI 22.2.3), Node 24, Bootstrap 5.3.8,
browser Chrome. Il progetto è in `angular-http/` dentro lo stesso repository;
per provarlo: `cd angular-http`, `npm install`, `ng serve`, poi
`http://localhost:4200`.

> Le misure riportate (codici di stato, corpi delle risposte, header CORS,
> contenuto delle pagine) sono state verificate davvero il **2026-10-30**
> contro le API reali e contro l'app in esecuzione con `ng serve` + browser in
> modalità headless: non sono valori "di libro".

---

## Parte 1 — LAB 03.16

### 1.1 Che cosa contiene il progetto

```text
cheng-kaixu-angular-http/
├── README.md                     ← descrizione del progetto
├── RISPOSTE.md                   ← questo file
└── angular-http/                 ← progetto Angular
    ├── angular.json              ← config (Bootstrap, fileReplacements)
    ├── package.json
    └── src/
        ├── environments/
        │   ├── environment.example.ts          ← COMMITTATO (segnaposto)
        │   ├── environment.ts                  ← gitignorato (chiave di build)
        │   └── environment.development.ts      ← gitignorato (chiave di ng serve)
        └── app/
            ├── app.config.ts           ← provideHttpClient()
            ├── app.routes.ts           ← /posts, /gatti, /nasa, /pokedex
            ├── app.html                ← navbar Bootstrap con i link
            ├── modelli/                ← post.ts, cat-fact.ts, apod.ts, pokemon.ts
            ├── services/               ← post-service.ts, cat-service.ts,
            │                              nasa-service.ts, pokemon-service.ts
            ├── posts/                  ← JSONPlaceholder: un post, tutti, POST,
            │                              paginazione (Prova tu 1)
            ├── gatti/                  ← catfact.ninja
            ├── nasa/                   ← APOD, chiave nei file di ambiente
            │                              (Prova tu 3: data scelta)
            └── pokedex/                ← PokéAPI (Prova tu 2)
```

Un commit per ogni passo, più uno per ogni livello della Prova tu:

| Commit | Contenuto |
| --- | --- |
| `Setup iniziale` | scheletro Angular + Bootstrap + README |
| `Passo 1: HttpClient, pagine e menu` | `provideHttpClient()`, rotte, componenti vuoti, navbar |
| `Passo 2: modello Post e PostService` | interfaccia `Post` + `getPost`/`getPosts`/`addPost` |
| `Passo 3: un post con il pipe json` | `caricaUno()` + `<pre>{{ p \| json }}</pre>` |
| `Passo 4: tutti i post` | `caricaTutti()` + elenco di 100 post |
| `Passo 5: invio di un post` | `invia()` con `http.post` |
| `Passo 6: tabella della scheda Network in RISPOSTE.md` | la tabella qui sotto |
| `Passo 7: fatti sui gatti` | `CatFact`, `CatService`, componente `Gatti` |
| `Passo 8: chiave NASA fuori dal repository` | `environments/`, `.gitignore`, `environment.example.ts` |
| `Passo 9: APOD della NASA con la chiave nei file di ambiente` | `Apod`, `NasaService`, componente `Nasa` |
| `Prova tu livello 1: paginazione dei post` | `getPagina()` + pulsanti Precedente/Successiva |
| `Prova tu livello 2: Pokédex con tipi e ricerca` | `PokemonService` + pagina `Pokedex` |
| `Prova tu livello 3: APOD di una data scelta` | `getApodDel()` + campo data |

### 1.2 Passo 6 — Che cosa si vede nella scheda Network

Tabella compilata osservando la scheda **Network / Rete** (filtro **Fetch/XHR**)
mentre si usano i pulsanti della pagina Post. Le richieste partono verso
`https://jsonplaceholder.typicode.com/posts`.

| Azione nell'app | Metodo e URL | Codice di stato | Corpo della risposta |
| --- | --- | --- | --- |
| **Carica un post** con `1` | `GET /posts/1` | **200 OK** | un oggetto post: `userId:1, id:1, title:…, body:…` |
| **Carica un post** con `999` | `GET /posts/999` | **404 Not Found** | `{}` (oggetto vuoto): Angular chiama `error`, non `next` |
| **Carica tutti** | `GET /posts` | **200 OK** | array di **100** post (id da 1 a 100) |
| **Invia un post** | `POST /posts` | **201 Created** | il post inviato + `"id": 101` (id assegnato dal server) |
| **Invia un post** (preflight CORS) | `OPTIONS /posts` | **204 No Content** | nessun corpo; header `Access-Control-Allow-Origin` |
| **Post 1** con il server irraggiungibile / offline | `GET /posts/1` | **0** | nessuna risposta: `HttpErrorResponse` con `status: 0` |

Dettagli utili da riportare in una verifica:

- **Chi fa la richiesta** è il browser (il codice Angular nel tab Network appare
  come *XHR*/*fetch*, non come navigazione di pagina): la pagina non si ricarica.
- Nella riga della richiesta, il pannello **Headers** mostra metodo, URL, status
  code e `Content-Type`; **Payload** è vuoto per le GET e contiene il JSON per la
  POST; **Response** mostra il JSON restituito dal server.
- La POST non è preceduta da `JSON.stringify`: l'oggetto passato a `http.post()`
  viene serializzato da HttpClient, che imposta da solo
  `Content-Type: application/json` (visibile negli header della richiesta).
- Prima della POST compare una riga **OPTIONS** (204): è il *preflight* CORS che
  il browser manda perché `localhost:4200` e `jsonplaceholder.typicode.com` sono
  origini diverse. Il server risponde autorizzando l'origine e i metodi.
- La POST restituisce sempre `id: 101` perché JSONPlaceholder è finta: non salva
  davvero, risponde come se avesse creato il post.

### 1.3 Le 10 domande finali del LAB

#### Domanda 1 — A che cosa serve `provideHttpClient()` e in quale file va scritto?

Serve a **registrare il servizio `HttpClient` nell'injector** dell'applicazione:
senza quella riga Angular non sa come creare `HttpClient` e ogni
`inject(HttpClient)` (diretto o dentro un servizio) fallisce.

Si scrive una volta sola in **`src/app/app.config.ts`**, nell'array `providers`
del `ApplicationConfig`:

```ts
// src/app/app.config.ts
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),   // ← abilita HttpClient in tutta l'app
  ],
};
```

`provideHttpClient()` restituisce un `Provider[]` che registra `HttpClient` e il
meccanismo di backend (`XhrBackend`/`fetch`). Fa parte della stessa famiglia di
`provideRouter()`: sono "provider" globali dell'applicazione standalone. Le
versioni recenti di Angular forniscono `HttpClient` anche senza chiamarla, ma
resta il punto di configurazione ufficiale (ed è obbligatoria se servono
interceptor o opzioni come `withFetch`).

#### Domanda 2 — `constructor(public http: HttpClient)` vs `private readonly http = inject(HttpClient)`: differenze e quale non funziona in `@Service()`

Sono **due modi di ottenere la stessa dipendenza** (dependency injection), ma:

| | `constructor(public http: HttpClient)` | `private readonly http = inject(HttpClient)` |
| --- | --- | --- |
| Come funziona | Angular legge i tipi dei parametri del costruttore e li passa | si chiama `inject()` nel contesto di iniezione (inizializzatore di campo) |
| Dipendenza | richiede il costruttore nella classe | richiede solo il contesto di iniezione |
| Visibilità | `public` → `http` diventa proprietà pubblica, usabile nel template | `private` → uso interno al servizio (corretto per un servizio) |
| Modificabilità | proprietà scrivibile | `readonly` → non riassegnabile |
| Ereditarietà | chi estende deve ripassare i parametri | nessun problema di "costruttore da inoltrare" |
| Funziona in `@Service()`? | **NO** | **SÌ** |

Nella versione di Angular usata (22), una classe decorata con `@Service()` **non
può usare l'iniezione dal costruttore**. Verificato davvero creando un servizio
di prova con il costruttore: la build si ferma con

```text
✘ [ERROR] NG2028: @Service class cannot use constructor dependency injection.
Use the `inject` function instead. [plugin angular-compiler]
    src/app/services/temp-service.ts:9:15
```

Il motivo è il funzionamento di `@Service()`: Angular genera da sé la factory del
servizio (e lo auto-registra), quindi non ha bisogno del costruttore per la DI e
lo vieta per evitare confusione. Con `inject()` la factory generata contiene la
chiamata a `inject(HttpClient)` fatta da noi e la dipendenza viene risolta.

Nota: `constructor(private readonly http: HttpClient)` (senza `public`) funziona
nei componenti e nelle classi `@Injectable()`, ma è lo stile "vecchio"; oggi la
dispensa (e la documentazione Angular) consigliano `inject()`.

#### Domanda 3 — Che cos'è un Observable? Quando parte la richiesta scritta in `getPosts()`?

Un **Observable** è un oggetto che rappresenta un **flusso di valori futuri**:
non è il dato, è l'annuncio del dato ("quando ci sarà, te lo passo"). È il
meccanismo di RxJS usato da Angular per tutto ciò che è asincrono — in questo
caso una risposta HTTP.

Le due proprietà importanti per il LAB:

- È **lazy (pigro)**: nel momento in cui si scrive
  `return this.http.get<Post[]>(this.baseUrl)` **non parte nessuna richiesta**.
  `getPosts()` costruisce solo l'Observable e lo restituisce.
- È **freddo (*cold*)**: ogni *subscribe* riparte da zero. La richiesta HTTP
  parte **solo quando qualcuno chiama `.subscribe(...)`**; senza subscribe il
  browser non apre nessuna connessione: nella scheda Network non compare nulla.

```ts
// costruisce l'Observable: NESSUNA richiesta
const richiesta: Observable<Post[]> = this.postService.getPosts();

// qui parte davvero la GET /posts (si vede in Network)
richiesta.subscribe((dati) => this.posts.set(dati));
```

Per una richiesta HTTP l'Observable emette **un solo valore** (il corpo della
risposta) e poi si **completa** da sé: non serve disiscriversi. Se invece il
componente viene distrutto prima della risposta, la `Subscription` restituita da
`subscribe()` va chiusa (`unsubscribe()`/`takeUntilDestroyed()`) per annullare la
richiesta.

#### Domanda 4 — Che cosa fanno `next` ed `error`? Quale viene chiamato con il post 999, e con quale codice di stato?

`subscribe({ next, error })` registra **tre callback** (la terza, `complete`,
qui non serve):

| callbacks | quando viene chiamata | che cosa riceve |
| --- | --- | --- |
| `next` | quando arriva un valore, cioè la risposta con esito positivo (2xx) | il corpo della risposta, già tipizzato (`Post`, `Post[]`, `CatFact`, …) |
| `error` | quando la richiesta **fallisce** | un `HttpErrorResponse` con `status`, `statusText`, `message`, `error` (corpo dell'errore) |
| `complete` | dopo l'ultimo valore (per HTTP subito dopo `next`) | niente |

Con il post **999** la risposta è **404 Not Found**: viene chiamato **solo
`error`**, con `err.status === 404` e un messaggio del tipo
`Http failure response for https://jsonplaceholder.typicode.com/posts/999: 404 Not Found`;
`next` **non** viene chiamato (il corpo `{}` del 404 non arriva come "dato
valido"). È per questo che nella pagina compare `Errore 404: Http failure
response for …` invece del JSON.

`error` viene chiamata in tutti questi casi:

- risposta con codice **4xx** (400, 401, 403, 404, 429, …) o **5xx** (500, …);
- **rete assente / server spento / DNS**: `status === 0`, nessuna risposta;
- **CORS** bloccato dal browser: `status === 0`;
- richiesta annullata o timeout: `status === 0`;
- in generale qualunque cosa impedisca di ottenere una risposta 2xx.

#### Domanda 5 — Perché `post`, `posts`, `loading` ed `errore` sono signal? Che cosa succederebbe con proprietà semplici?

Perché Angular (in questa versione) è **zoneless**: non c'è zone.js che
"avvisa" Angular di ogni operazione asincrona conclusa. La vista viene
aggiornata quando Angular sa che è cambiato qualcosa: i **signal** notificano
esattamente questo. Quando `next` chiama `this.post.set(dato)`, il signal
comunica che il suo valore è cambiato e Angular ri-renderizza la parte di
template che lo legge.

Con **proprietà semplici** (`post: Post | null = null;`), la sequenza sarebbe:
la richiesta parte, il server risponde 200, nella scheda Network si vede tutto,
la callback assegna `this.post = dato`… ma la vista **non si aggiorna**, perché
l'assegnazione avviene dentro una callback asincrona fuori da un evento DOM e
Angular non viene avvisato. L'utente vedrebbe la pagina **vuota o ferma sullo
spinner**, con i dati "arrivati ma invisibili". È esattamente l'errore comune
descritto dalla dispensa: *"la risposta arriva ma la pagina non cambia"*.

Nel nostro codice questo non succede: i signal sono letti nel template con
`post()`, `posts()`, `loading()`, `errore()`, e il vantaggio si vede anche nei
flussi derivati (`computed`) e nel fatto che la pagina si aggiorna da sola.

#### Domanda 6 — Perché tipizzare con un'interfaccia (`Post`, `CatFact`) invece di `any`? Un esempio di errore scoperto subito

Perché il tipo è **documentazione eseguibile e controllo automatico**: TypeScript
conosce i campi della risposta e il compilatore (e l'editor) ti avvisano subito
se sbagli. Con `any` tutto è permesso e gli errori emergono solo a runtime, in
pagina, magari in produzione.

Esempio: nella pagina Post scrivo il template per il titolo come `p.titel`
(una `l` di troppo). Con `http.get<Post[]>` il compilatore dà subito

```text
Property 'titel' does not exist on type 'Post'. Did you mean 'title'?
  src/app/posts/posts.html:…
```

Con `http.get<any>` la stessa riga compila e a runtime mostra `undefined` (o
lancia un errore nel template), senza che nessuno se ne accorga durante la build.
Altri esempi di errori che il tipo scopre immediatamente:

- passare a una funzione che vuole un `Post` un oggetto con un campo in meno o
  del tipo sbagliato (`{ userId: '1', … }`);
- usare `posts.length` su un `Post` singolo: `Property 'length' does not exist on type 'Post'`;
- scrivere `p.completed` su `Post` (campo che vive in `Todo`, non in `Post`).

Attenzione (domanda 10 del TEO): il tipo è solo a **tempo di compilazione**.
TypeScript **non controlla il contenuto reale della risposta**: se il server
cambia forma, il cast `http.get<Post>` è una promessa che *noi* facciamo, non una
verifica. Per validare davvero a runtime servirebbe uno schema (`zod`, …).

#### Domanda 7 — Che cosa fa il pipe `json` e perché è utile durante lo sviluppo?

`json` è il **JsonPipe** di `@angular/common`: prende un valore qualsiasi
(oggetto, array, signal letto, …) e lo stampa nel template come JSON formattato,
equivalente a `JSON.stringify(valore, null, 2)`. Trasforma quindi l'oggetto
della risposta in testo leggibile dentro `<pre>`:

```html
<pre class="bg-body-tertiary p-3 rounded">{{ p | json }}</pre>
```

È utile in sviluppo per **vedere l'intera risposta** così com'è arrivata, senza
scrivere a mano un template per ogni campo: si controlla subito che struttura e
valori siano quelli attesi (per esempio `id: 101` dopo la POST). Non serve nel
prodotto finito, dove si mostrano solo i campi utili.

Per usarlo bisogna importare `JsonPipe` nel componente:

```ts
import { JsonPipe } from '@angular/common';
@Component({ imports: [JsonPipe], … })
```

Se manca l'import si ottiene l'errore di compilazione
`NG8004: No pipe found with name 'json'`: l'ho incontrato e corretto nel Passo 3.

#### Domanda 8 — Perché la POST restituisce sempre l'id 101? Perché non si usa `JSON.stringify`?

**Perché JSONPlaceholder è un'API finta e stateless.** Non ha un database: quando
riceve `POST /posts` risponde `201 Created` con l'oggetto inviato più un `id`
"plausibile" (il primo disponibile dopo i 100 post esistenti: **101**), ma non
salva niente. Se si ripete la POST, risponde ancora 201 e ancora 101: i
100 post di `GET /posts` restano identici, e `GET /posts/101` risponde 404.
Verificato: due POST consecutive → entrambe `201`, entrambe `"id": 101`.

**Perché non si usa `JSON.stringify`**: perché `HttpClient` lo fa da sé. Quando
si passa un **oggetto JavaScript** a `http.post(url, oggetto)`:

- lo serializza in JSON (equivalente a `JSON.stringify`),
- imposta l'header `Content-Type: application/json`.

Scrivere `http.post(url, JSON.stringify(post))` significherebbe passare una
stringa: HttpClient la manderebbe così com'è e **non** imposterebbe il
`Content-Type` JSON (bisognerebbe aggiungerlo a mano in `headers`). Il codice
corretto è quindi il più semplice:

```ts
return this.http.post<Post>(this.baseUrl, post);   // oggetto, non stringa
```

#### Domanda 9 — Passi per tenere la chiave NASA fuori dal repository. A che cosa serve `environment.example.ts`?

Passi seguiti (Passo 8 della dispensa):

1. **Generare i file di ambiente** con `ng g environments`: crea
   `src/environments/environment.ts` (usato da `ng build`) e
   `src/environments/environment.development.ts` (usato da `ng serve`), e
   aggiorna `angular.json` aggiungendo in `configurations.development` la
   `fileReplacements` che sostituisce il primo con il secondo.
2. **Scrivere la chiave solo nei due file veri** (`nasaApiKey: 'DEMO_KEY'` in
   development, la chiave personale in `environment.ts`).
3. **Aggiungere i due file al `.gitignore`**:

   ```gitignore
   # chiavi API: non vanno nel repository
   /src/environments/environment.ts
   /src/environments/environment.development.ts
   ```

4. **Creare `environment.example.ts`** con lo stesso oggetto ma un
   **segnaposto**, e committarlo:

   ```ts
   export const environment = {
     nasaApiKey: 'INSERISCI_QUI_LA_TUA_CHIAVE',
   };
   ```

5. Verificare con `git status` che i due file veri **non compaiano**: risultano
   *ignored* e non vengono committati (è quello che succede nel repository).

`environment.example.ts` serve a **chi clona il repository**: il progetto non
compila senza `src/environments/environment.ts` (errore
`TS2307: Cannot find module '../../environments/environment'`), quindi
l'esempio documenta quali file creare, quali chiavi contengono e dove metterle,
**senza** contenere la chiave vera. Chi clona copia l'esempio in entrambi i file
e inserisce la propria chiave.

Due precisazioni importanti:

- il `.gitignore` vale solo per i **nuovi** file: se una chiave è già stata
  committata, togliere il file dal repository con `git rm --cached <file>` e poi
  rigenerare/ruotare la chiave (la storia Git la conserva comunque);
- nel nostro progetto la variabile `environment` si importa sempre **senza
  suffisso** (`import { environment } from '../../environments/environment'`):
  è la configurazione di build a scegliere il file giusto.

#### Domanda 10 — Perché la chiave in un'app Angular non è comunque segreta? Dove andrebbe una chiave davvero importante?

Perché **il codice Angular viene scaricato dal browser**. La chiave contenuta in
`environment.ts` finisce dentro il bundle JavaScript (`main-*.js`): chiunque può
aprire i DevTools, leggere il file, cercare `nasaApiKey` e trovare la stringa;
oppure guardare la richiesta nella scheda Network e vedere `?api_key=...`.
Anche `ng build --configuration production` non aiuta: comprime e offusca i
nomi, non nasconde le stringhe. Il `.gitignore` protegge il **repository**, non
l'**applicazione distribuita**.

Quindi una chiave importante non va mai nel frontend. Va tenuta **su un server**:

- in **variabili d'ambiente del server** (o in un *secrets manager*), mai nel
  codice;
- il frontend chiama **il proprio backend**, che a sua volta chiama il servizio
  esterno aggiungendo la chiave dal lato server;
- eventualmente con restrizioni per chiave (domini autorizzati, quota, IP).

Nel caso della NASA la chiave non è un segreto drammatico (è gratuita e
limitata per IP), ma il principio è generale: **la chiave di un servizio a
pagamento o con permessi di scrittura deve restare sul server**, protetta da
autenticazione e autorizzazione.

### 1.4 Prova tu — i tre livelli

Ho svolto tutti e tre i livelli (un commit per ciascuno).

#### Livello 1 — Paginazione dei post

- `PostService.getPagina(pagina)` usa l'opzione `params` per aggiungere la query
  string:

  ```ts
  getPagina(pagina: number): Observable<Post[]> {
    return this.http.get<Post[]>(this.baseUrl, {
      params: { _page: pagina, _limit: 10 },   // → ?_page=2&_limit=10
    });
  }
  ```

- Nel componente: signal `pagina` (1…10), costanti `primaPagina = 1`,
  `ultimaPagina = 10` (100 post / 10 per pagina), metodi `caricaPagina`,
  `precedente()`, `successiva()`.
- I pulsanti sono disabilitati ai bordi:
  `[disabled]="loading() || pagina() <= primaPagina"` e
  `[disabled]="loading() || pagina() >= ultimaPagina"`; il testo mostra
  `Pagina {{ pagina() }} di 10`.
- Verificato con richiesta reale: `GET /posts?_page=2&_limit=10` → **200**, 10
  post con **id da 11 a 20**.

#### Livello 2 — Pokédex

- Interfacce scritte prima del codice, guardando le risposte
  (`modelli/pokemon.ts`): `PokemonTypeSlot {name,url}`, `PokemonTypeList
  {count,next,previous,results}`, `PokemonSprites {front_default}`,
  `Pokemon {name,height,weight,sprites}`.
- `PokemonService`: `getTypes()` → `GET https://pokeapi.co/api/v2/type`;
  `getPokemon(nome)` → `GET https://pokeapi.co/api/v2/pokemon/{nome}`.
- Pagina `Pokedex` (`app/pokedex/`): all'apertura carica i tipi e li mostra come
  **badge**; un campo di ricerca + pulsante **Cerca** chiama `getPokemon` con il
  nome reso minuscolo (`nome.trim().toLowerCase()`) o con il numero.
- Mostra nome, immagine `sprites.front_default`, **altezza `/10`** (decimetri →
  metri) e **peso `/10`** (ettogrammi → chilogrammi).
- Se il Pokémon non esiste (404) il messaggio è **"Pokémon non trovato"**.
- Verificato: `GET /type` → 200, 21 tipi totali (20 nel primo blocco);
  `GET /pokemon/pikachu` → 200 con `height: 4` → **0,4 m** e `weight: 60` →
  **6,0 kg**; `/pokemon/doesnotexist999` → **404**. Nell'app, pagina Pokédex
  renderizzata: **20 badge** dei tipi caricati davvero dalla API.

#### Livello 3 — APOD di una data scelta (e che cosa risponde il server con una data futura)

- `NasaService.getApodDel(data)` aggiunge il parametro `date`:

  ```ts
  getApodDel(data: string): Observable<Apod> {
    return this.http.get<Apod>(this.url, {
      params: { api_key: environment.nasaApiKey, date: data },  // → &date=2020-01-01
    });
  }
  ```

- Nella pagina NASA ci sono il pulsante **APOD di oggi**, un
  `<input type="date">` e il pulsante **Mostra**; il componente ha il signal
  `dataScelta`, il metodo `caricaDel(data)` e il caso `400` nel traduttore dei
  codici di stato.

**Che cosa risponde il server con una data futura?** Risponde **400 Bad
Request**: la NASA non ha foto del futuro, e il servizio accetta solo date
comprese tra il **16 giugno 1995** (prima immagine APOD) e **oggi**. Verificato
davvero con `date=2030-01-01`:

```json
{
  "code": 400,
  "msg": "Date must be between Jun 16, 1995 and Oct 30, 2026.",
  "service_version": "v1"
}
```

La data massima nel messaggio è **il giorno della richiesta** (nella prova:
30 ottobre 2026), quindi il messaggio cambia ogni giorno. Nell'app questo caso è
tradotto in pagina con:

> Data non valida: APOD risponde 400 Bad Request per le date future. Scegli oggi
> o una data passata.

Per contro, una data **passata** valida (`2020-01-01`) risponde **200** con
l'APOD di quel giorno. Nota: la risposta `400` arriva quindi dentro `error` di
`subscribe` (è un errore 4xx), non dentro `next`.

### 1.5 Verifiche fatte

1. **Build di produzione**: `ng build` → *Application bundle generation
   complete*, 486,97 kB iniziali (256,12 kB JS + 230,85 kB CSS Bootstrap),
   nessun errore TypeScript.
2. **Runtime con `ng serve` + browser headless** (pagine vere, non solo
   compilazione):
   - `/gatti` → compare un fatto reale di `catfact.ninja` con il numero di
     caratteri (es.: *"While many parts of Europe and North America consider the
     black cat a sign of bad luck…"*, 146 caratteri): HttpClient + signal
     funzionano davvero;
   - `/pokedex` → 20 badge dei tipi caricati da PokéAPI;
   - `/nasa` → avviso **"Troppe richieste con questa chiave: riprova più
     tardi."**: è il caso **429** gestito dal componente (con `DEMO_KEY` il
     limite dell'IP era esaurito nella giornata della prova — con una chiave
     personale arriva l'APOD);
   - `/` → redirect a `/posts`, navbar con Post / Gatti / NASA / Pokédex.
3. **API**: codici e corpi verificati con richieste HTTP reali (tabella qui
   sopra, più PokéAPI e NASA).

---

## Parte 2 — TEO 03.15 — HTTP e API REST

### Domanda 1 — Modello client-server con l'esempio di un'app del meteo

Nel modello **client-server** ci sono due programmi distinti:

- il **client** è l'applicazione che gira nel browser dell'utente (la nostra app
  Angular, o un'app di un sito meteo);
- il **server** è un computer sempre acceso che ospita i dati e i servizi.

Nell'app del meteo: l'utente apre la pagina e vede le previsioni. Il **client**
manda una richiesta HTTP al server, per esempio
`GET https://api.meteo.example/previsioni?citta=Milano`; il **server** cerca i
dati (nel suo database, o chiamando a sua volta i servizi meteo), costruisce la
risposta (di solito JSON, es. `{"citta":"Milano","temperatura":18,…}`) e la
risponde con un codice di stato (200 se tutto va bene). Il client riceve la
risposta, la trasforma in interfaccia e la mostra.

Punti chiave:

- **la richiesta parte sempre dal client**: il server non chiama mai il client
  per primo, non ha un indirizzo del browser e non sa quando l'utente è online
  (modello *pull*, il client "tira" i dati; l'aggiornamento in tempo reale si
  ottiene con WebSocket/SSE, che sono altri protocolli);
- **i dati stanno sul server** (database, file, altri servizi), non nel client:
  il client riceve solo la copia necessaria a mostrare la pagina;
- il server è **stateless** per HTTP: ogni richiesta è indipendente, quindi il
  client deve rimandare ogni volta le informazioni necessarie (autenticazione,
  parametri);
- la comunicazione passa dalla rete ed è regolata da **HTTP**: metodo, URL,
  header, eventuale body; la risposta ha codice, header e body;
- il browser applica la **same-origin policy/CORS**: il client può leggere le
  risposte da un'altra origine solo se il server lo autorizza.

### Domanda 2 — Parti di una richiesta e di una risposta; in quali richieste c'è un body

**Richiesta HTTP**:

1. **riga di richiesta**: metodo (`GET`), percorso/URL (`/todos?userId=1`) e
   versione del protocollo (`HTTP/1.1`);
2. **header**: coppie `Nome: valore` (es. `Host`, `Accept: application/json`,
   `Content-Type: application/json`, `Authorization: Bearer …`);
3. una riga vuota che separa header e body;
4. **body** (corpo): il contenuto inviato al server, se previsto.

**Risposta HTTP**:

1. **riga di stato**: versione + codice + motivazione (`HTTP/1.1 200 OK`);
2. **header** (es. `Content-Type: application/json`, `Content-Length`,
   `Access-Control-Allow-Origin`, `Cache-Control`);
3. una riga vuota;
4. **body**: il contenuto della risposta (spesso JSON).

**Dove c'è il body**: solo dove ha senso mandare dati al server.

| Metodo | Body nella richiesta? | Perché |
| --- | --- | --- |
| `GET` | **no** | legge soltanto; i parametri vanno nell'URL/query string |
| `DELETE` | di solito **no** | basta l'URL della risorsa da cancellare |
| `POST` | **sì** | crea una risorsa: servono i dati (JSON) |
| `PUT` | **sì** | sostituisce la risorsa: servono i nuovi dati completi |
| `PATCH` | **sì** | modifica parziale: servono i campi da cambiare |

Il body può essere JSON, form, file (multipart), testo… L'header
`Content-Type` dice che cosa contiene; `Content-Length` quanto è lungo.

### Domanda 3 — Metodi HTTP, operazioni CRUD ed endpoint REST per la risorsa "libri"

| Metodo | Operazione CRUD | Significato | Endpoint (risorsa `libri`) | Body | Codice tipico |
| --- | --- | --- | --- | --- | --- |
| `GET` | **R**ead (tutti) | legge l'elenco | `GET /libri` | no | 200 |
| `GET` | **R**ead (uno) | legge un libro | `GET /libri/42` | no | 200 / 404 |
| `POST` | **C**reate | crea un nuovo libro | `POST /libri` | sì (dati del libro) | 201 |
| `PUT` | **U**pdate | aggiorna **tutto** il libro | `PUT /libri/42` | sì (libro completo) | 200 / 204 |
| `PATCH` | **U**pdate (parziale) | aggiorna **alcuni campi** | `PATCH /libri/42` | sì (solo i campi) | 200 / 204 |
| `DELETE` | **D**elete | cancella il libro | `DELETE /libri/42` | di solito no | 204 / 200 |

Regole REST: la risorsa è un **sostantivo al plurale** (`libri`, non
`getLibri`), l'**operazione** è il metodo HTTP (non si mette il verbo
nell'URL), l'identificativo va nel percorso (`/libri/42`), i filtri nelle query
string (`GET /libri?autore=Eco`, `GET /libri?anno=1980`). `PUT` sostituisce
l'intera risorsa (i campi mancanti diventano nulli), `PATCH` cambia solo quelli
indicati.

### Domanda 4 — Significato di 201, 204, 403, 404, 500; differenza tra 4xx e 5xx

| Codice | Nome | Significato | Esempio |
| --- | --- | --- | --- |
| **201** | Created | richiesta riuscita, **è stata creata** una nuova risorsa | risposta a `POST /posts` (con `"id": 101`) |
| **204** | No Content | riuscita, ma **nessun contenuto** nel body | risposta a `DELETE`, o al preflight `OPTIONS` |
| **403** | Forbidden | il server ha **capito** la richiesta ma non la autorizza (permessi/ chiave API non valida); autenticato ≠ autorizzato | NASA con `api_key` sbagliata → 403 |
| **404** | Not Found | la **risorsa** richiesta non esiste (URL sbagliato o id inesistente) | `GET /posts/999` → 404 |
| **500** | Internal Server Error | **errore del server**, guasto o eccezione non gestita | il server va in crash durante la query |

Differenza **4xx vs 5xx**:

- **4xx = errore del client**: la richiesta è sbagliata o non autorizzata (URL
  inesistente, dati non validi, niente credenziali). Ripetere la **stessa**
  richiesta non serve: va corretta la richiesta.
- **5xx = errore del server**: la richiesta era valida ma il server non è
  riuscito a servirla (bug, database giù, timeout). Può avere senso riprovare più
  tardi; l'errore non dipende da chi chiama.

Casi vicini: **400** = sintassi/dati non validi; **401** = non autenticato
(manca il login/le credenziali); **429** = troppe richieste (rate limit).

### Domanda 5 — JSON di un libro + interfaccia TypeScript

```json
{
  "titolo": "Il nome della rosa",
  "autori": ["Umberto Eco"],
  "anno": 1980,
  "disponibile": true
}
```

Regole JSON rispettate: chiavi tra virgolette doppie, stringhe tra virgolette,
numero senza virgolette, booleano `true`, lista `[...]`, **niente virgola finale
e niente commenti**.

```ts
export interface Libro {
  titolo: string;
  autori: string[];      // lista di stringhe
  anno: number;
  disponibile: boolean;
}
```

Con un campo facoltativo si usa `?`:

```ts
export interface Libro {
  titolo: string;
  autori: string[];
  anno: number;
  disponibile: boolean;
  editore?: string;      // può non esserci nella risposta
}
```

Questa interfaccia è il tipo da usare in `http.get<Libro[]>()`: TypeScript
controlla l'uso dei campi nel codice, non il contenuto della risposta.

### Domanda 6 — Che cosa si aggiunge in `app.config.ts` per HttpClient; che succedeva nelle versioni meno recenti

Si aggiunge `provideHttpClient()` all'array `providers` della configurazione
dell'applicazione, in `src/app/app.config.ts`:

```ts
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
  ],
};
```

Nelle versioni meno recenti di Angular (prima degli standalone provider), se lo
si dimenticava — o se non si importava `HttpClientModule` nel `AppModule` — al
primo `inject(HttpClient)` l'app lanciava:

```text
NullInjectorError: No provider for HttpClient!
```

Il servizio non riusciva a risolvere la dipendenza e l'app non partiva. Con
`provideHttpClient()` il provider viene registrato e l'errore sparisce. Nelle
versioni recenti `HttpClient` è fornito di default, ma la riga resta il punto di
configurazione ufficiale (e serve per `withFetch()`, `withInterceptors()`…).

### Domanda 7 — Che cos'è un Observable? Quando parte davvero `http.get`? Che succede con due `subscribe`?

Un **Observable** (RxJS) è la rappresentazione di un **flusso di eventi/valori
nel tempo**. Non contiene il dato: descrive "quando arriverà, che cosa
succederà". È l'equivalente asincrono e componibile di una Promise, ma più
potente (può emettere più valori, si può annullare, si può trasformare con
operatori come `pipe`, `map`, `filter`).

`this.http.get<Post[]>(url)` **non invia nulla**: restituisce un Observable
*freddo* e *lazy*. La richiesta parte **solo alla prima `subscribe()`**:

- senza subscribe → nessuna richiesta in Network;
- con subscribe → parte la richiesta; la risposta arriva a `next`, poi
  l'Observable si completa (un solo valore per HTTP);
- **due subscribe → due richieste HTTP separate** (non due ascolti della stessa):
  il secondo subscribe riparte da zero, come chiamare due volte una funzione. Se
  serve condividere una sola risposta con più consumatori si usa
  `shareReplay()`/`share()`;
- la `Subscription` restituita da `subscribe()` permette di annullare la
  richiesta (`unsubscribe()`): utile se il componente viene distrutto prima
  della risposta.

### Domanda 8 — Ruolo di `next` ed `error` in `subscribe({ next, error })`; quando viene chiamata `error`

`subscribe` accetta tre callback (oggetto `PartialObserver`):

| Callback | Ruolo | Quando |
| --- | --- | --- |
| `next(valore)` | **successo**: riceve ogni valore emesso | una volta, con il **body** della risposta (2xx) |
| `error(errore)` | **fallimento**: riceve l'errore e il flusso si chiude | risposta 4xx/5xx, rete assente (status 0), CORS bloccato, timeout, richiesta annullata |
| `complete()` | fine del flusso senza errori | subito dopo `next`, per una richiesta HTTP |

`error` viene quindi chiamata quando la risposta **non è 2xx** o non arriva
affatto. L'oggetto è un **`HttpErrorResponse`** con `status` (0, 404, 403, 500…),
`statusText`, `message` (`Http failure response for … : 404 Not Found`) e `error`
(il corpo dell'errore, se c'è). Dopo `error` non si ricevono altri valori:
`next` non viene chiamato. Per questo nel componente si aggiorna `errore` e si
spegne `loading` direttamente dentro `error`.

### Domanda 9 — Perché `todos`, `loading` ed `errore` sono signal? Che vedrebbe l'utente con proprietà semplici?

Perché l'app Angular è **zoneless**: Angular non intercetta più tutte le
operazioni asincrone tramite zone.js, ma ridisegna quando un **signal** notifica
un cambiamento (o in risposta a eventi DOM, router, ecc.). Le callback di
`subscribe` arrivano **fuori** da questi momenti: assegnare `this.todos = dati`
in una callback asincrona non dice niente ad Angular, che quindi **non
ri-renderizza**.

Con proprietà semplici (`todos: Todo[] = []`, `loading = false`, …) l'utente
vedrebbe:

- lo **spinner acceso** (o la pagina vuota) perché `loading` resta letto come
  vero;
- i dati **mai visualizzati**, anche se nella scheda Network la risposta 200 è
  arrivata e nel JavaScript la variabile è piena (verificabile con
  `console.log`);
- la pagina che si aggiorna solo per caso, al successivo evento (click, resize,
  navigazione), mostrando magari uno stato "vecchio".

Con i signal:

- `todos`, `loading`, `errore` sono `signal(...)`, letti nel template con
  `todos()`, e la vista è legata a loro: ogni `.set()` schedula un
  ri-renderizzato mirato (solo le parti che leggono quel signal);
- `completate = computed(() => todos().filter(t => t.completed))` si aggiorna
  **da sola** quando `todos` cambia, senza codice di gestione;
- `httpResource()` è l'alternativa più "integrata" (espone direttamente
  `value()`, `isLoading()`, `error()`), ma il modulo usa HttpClient + signal per
  capire il meccanismo.

### Domanda 10 — A che cosa serve `http.get<Todo[]>`? TypeScript controlla davvero il contenuto?

`<Todo[]>` è il **tipo generico** che descrive che cosa ci si aspetta nella
risposta: dice al compilatore che il valore emesso da `next` è un array di
`Todo`. Serve a:

- **controllare il codice** (e l'editor) mentre si scrivono template e metodi:
  `p.titel` → errore `Property 'titel' does not exist on type 'Todo'`;
  `p.completed` su un `Todo` che non ce l'ha → errore; passare il dato a una
  funzione che vuole `Todo[]` → controllato;
- avere **autocompletamento** e documentazione implicita della forma dei dati;
- evitare `any`, che spegne tutti i controlli e rimanda gli errori a runtime.

**No, TypeScript non controlla il contenuto reale della risposta.** `http.get<T>`
è un **cast**: a runtime il JSON viene solo deserializzato con `JSON.parse`, e il
generico è un'asserzione di fiducia ("io so che il server risponde così"). Se il
server cambia forma (campo rinominato, tipo diverso, null), il codice decompila
lo stesso e l'errore si manifesta a runtime (valore `undefined` in pagina,
`Cannot read properties of undefined`). Per una verifica reale servirebbe una
validazione a runtime con uno schema (`zod`, `valibot`, JSON Schema) o un test
end-to-end contro il server.

### Domanda 11 — Riscrivere in stile moderno il codice "vecchio"; perché `getData` doveva essere una arrow function

Codice vecchio tipico:

```ts
// STILE VECCHIO
export class TodosComponent implements OnInit {
  data: Todo[] = [];
  constructor(public http: HttpClient) {}

  ngOnInit() {
    this.http.get<Todo[]>(this.url).subscribe(this.getData);
  }

  getData = (d: Todo[]) => {
    this.data = d;   // perché funziona solo con arrow?
  };
}
```

Stile moderno (Angular attuale, servizio con `inject` e signal):

```ts
// STILE MODERNO — servizio
import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo } from '../modelli/todo';

@Service()
export class TodoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://jsonplaceholder.typicode.com/todos';

  getTodos(userId: number): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.baseUrl, { params: { userId } });
  }
}
```

```ts
// STILE MODERNO — componente
import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Todo } from '../modelli/todo';
import { TodoService } from '../services/todo-service';

@Component({
  imports: [],
  selector: 'app-todos',
  templateUrl: './todos.html',
})
export class Todos implements OnInit {
  private readonly todoService = inject(TodoService);

  readonly todos = signal<Todo[]>([]);
  readonly loading = signal(false);
  readonly errore = signal<string | null>(null);

  ngOnInit(): void {
    this.carica(1);
  }

  carica(userId: number): void {
    this.loading.set(true);
    this.errore.set(null);
    this.todoService.getTodos(userId).subscribe({
      next: (dati) => {
        this.todos.set(dati);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.errore.set(`Errore ${err.status}: ${err.message}`);
        this.loading.set(false);
      },
    });
  }
}
```

Che cosa è cambiato:

- **iniezione**: `inject(HttpClient)` nel servizio invece del costruttore (e
  obbligatorio in `@Service()`: NG2028);
- **separazione**: la chiamata HTTP sta nel servizio (`TodoService`), il
  componente si occupa dello stato e della vista;
- **subscribe a oggetto**: `subscribe({ next, error })` invece di passare un
  metodo, così è esplicito che cosa succede nel successo e nell'errore;
- **stato in signal**: `todos`, `loading`, `errore` sono signal, non proprietà
  semplici (con Angular zoneless una proprietà semplice non aggiorna la vista);
- **niente `public`** sul servizio iniettato: `private readonly` perché è un
  dettaglio interno.

**Perché `getData` doveva essere una arrow function**: `subscribe` accetta una
funzione e la chiama da sola, senza legarla all'oggetto: `this` dentro la
funzione **non è** l'istanza del componente.

- Con una **funzione normale** (`getData(d) { this.data = d; }`), al momento
  della chiamata `this` sarebbe `undefined` (in strict mode) o l'oggetto
  dell'Observable: `this.data = d` fallirebbe (`Cannot set properties of
  undefined`) oppure scriverebbe sul posto sbagliato.
- Con una **arrow function** (`getData = (d) => { this.data = d; }`) `this` è
  **catturato lessicalmente** dalla classe dove la funzione è definita: è sempre
  l'istanza del componente. Per questo la proprietà freccia funziona anche
  passata come callback.
- In alternativa si poteva scrivere `subscribe((d) => this.getData(d))` oppure
  usare la forma a oggetto `subscribe({ next: (d) => this.data = d })`: la
  callback inline/arrow conserva `this`. Nel codice moderno si usa direttamente
  l'oggetto `{ next, error }` con arrow function, che evita il problema alla
  radice.

### Domanda 12 — Dove va una chiave API in Angular e come si evita che finisca su GitHub; perché non è davvero segreta e che c'entra il server

**Dove va**: nei **file di ambiente** (`src/environments/`), mai scritta nel
codice dei servizi o nei componenti. Con `ng g environments` si creano
`environment.ts` (build di produzione) e `environment.development.ts` (`ng serve`);
in `environment.ts` va la variabile, per esempio:

```ts
export const environment = {
  nasaApiKey: 'LA_MIA_CHIAVE',
};
```

Il servizio la usa tramite l'oggetto importato:

```ts
params: { api_key: environment.nasaApiKey }
```

**Come si evita GitHub**:

1. i due file veri (`environment.ts`, `environment.development.ts`) si aggiungono
   al **`.gitignore`** (con un commento che spiega perché);
2. si committa solo **`environment.example.ts`** con il segnaposto
   (`'INSERISCI_QUI_LA_TUA_CHIAVE'`), così chi clona sa che file creare;
3. si verifica con `git status` che i file con la chiave non compaiano; se una
   chiave è già stata committata, `git rm --cached` e **rotazione** della chiave
   (la storia Git la conserva).

**Perché non è comunque segreta**: perché l'app Angular è **codice lato client**.
La chiave viene **incorporata nel bundle JavaScript** al momento della build
(`environment.ts` è compilato dentro `main-*.js`) e il bundle viene scaricato dal
browser di ogni utente. Chiunque può aprire i DevTools → Sources, cercare
`nasaApiKey` (o guardare la richiesta in Network con `?api_key=…`) e leggere la
chiave in chiaro. Il `.gitignore` tiene la chiave fuori dal **repository**, ma
non fuori dal **prodotto distribuibile**. Anche `ng build` con minificazione non
la nasconde.

**Che cosa c'entra il server**: una chiave davvero importante deve restare
**sul server**, dove l'utente non può leggerla. Lo schema corretto è:

1. il frontend chiama un **endpoint del proprio backend** (senza chiave);
2. il backend, che ha la chiave in una **variabile d'ambiente** o in un *secrets
   manager*, chiama il servizio esterno aggiungendo la chiave;
3. il backend restituisce al frontend solo i dati necessari.

Così la chiave non è mai nel browser, e il backend può anche limitare/registrare
gli accessi. In alternativa si usano **chiavi pubbliche con restrizioni**
(dominio, IP, quota) per i servizi che le supportano — ma questo non rende la
chiave segreta: la rende solo meno pericolosa se diffusa.
