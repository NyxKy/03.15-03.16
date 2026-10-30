# Registro degli studenti — LAB 03.14 (Modulo 03, Angular)

Progetto Angular del laboratorio **03.14 — «Servizi: il registro degli studenti»**, realizzato
seguendo la traccia passo per passo (Passi 1‑8 + le tre «Prova tu»), con in più le risposte
alle dieci domande della traccia in [`RISPOSTE.md`](./RISPOSTE.md).

Nella stessa cartella vive anche l'esercizio precedente **TEO 03.13 «L'hamburgeria»**, che ha un
proprio workspace Angular autonomo in [`projects/hamburgeria`](./projects/hamburgeria).

---

## Requisiti

| Strumento | Versione usata |
| --- | --- |
| Node.js | 24.22.0 |
| npm | 11.7.0 |
| Angular (CLI / framework) | 22.2.3 |
| Bootstrap (CSS, da npm) | 5.3.8 |

Serve un `ng` raggiungibile da terminale (Angular CLI globale) **oppure** si può usare `npx ng ...`.

## Installazione

Dalla radice del progetto, una sola volta:

```bash
npm install
```

Le dipendenze sono condivise: anche il workspace di `projects/hamburgeria` le risolve dalla
`node_modules` della radice.

## Avvio del development server (registro-studenti)

Dalla **radice** del progetto:

```bash
ng serve
```

Il workspace principale contiene un solo progetto con il target `serve`, quindi il comando non
ha bisogno di parametri: apre l'applicazione su **http://localhost:4200/** e ricarica la pagina
a ogni modifica dei sorgenti.

In alternativa si può rimanere fedeli alla traccia ed entrare nella cartella del progetto:

```bash
cd projects/registro-studenti
ng serve
```

Comandi pronti equivalenti: `npm start` (radice) oppure `npm run start:registro`.

### URL dell'applicazione

| URL | Componente | Passo della traccia |
| --- | --- | --- |
| `/` | redirect a `/home` (`pathMatch: 'full'`) | Passo 3 |
| `/home` | `Home` (legge il servizio + `studente-card`) | Passo 3 / 7 |
| `/elenco` | `Elenco` (tabella, filtro, media, ordinamento) | Passo 4 / 5 |
| `/inserimento` | `Inserimento` (form con validazione) | Passo 6 |
| `/elenco/:id` | `DettaglioStudente` (parametro nell'URL) | Passo 8 |
| `/modifica/:id` | `ModificaStudente` (Prova tu livello 3) | Prova tu 3 |
| `**` | qualunque URL ignoto → `/home` | Passo 3 |

## Test automatici

```bash
ng test --watch=false          # 31 test del registro degli studenti
npm run test:hamburgeria       # 15 test dell'hamburgeria
```

I test girano con **Vitest + jsdom** (builder `@angular/build:unit-test`) e verificano i
«risultati attesi» della traccia: id automatico = massimo degli id + 1, `successivo()` circolare,
`migliore()`, medie colorate, filtro `4a` → `4A`, avviso per la classe vuota, media di classe
`7.30`, ordinamento su una copia, eliminazione tramite il servizio. Un test della home controlla
infine che i due pulsanti «Vai all'elenco» e «Nuovo studente» abbiano davvero un `href`: senza
l'import di `RouterLink` resterebbero attributi HTML inerti, e il compilatore non se ne accorge.

## Build di produzione

```bash
ng build                # registro-studenti -> dist/registro-studenti
npm run build           # builda anche l'hamburgeria
```

## Struttura

```
registro-studenti-workspace/
├─ angular.json                 workspace Angular del LAB 03.14 (progetto registro-studenti)
├─ package.json                 dipendenze condivise + script
├─ tsconfig.json                configurazione TypeScript comune
├─ RISPOSTE.md                  le 10 risposte della traccia 03.14 (+ la Parte 2 del TEO 03.13)
├─ projects/
│  ├─ registro-studenti/        il laboratorio 03.14
│  │  └─ src/app/
│  │     ├─ modelli/studente.ts
│  │     ├─ services/studenti-service.ts     (+ studenti-service.spec.ts)
│  │     ├─ home/  elenco/  inserimento/  dettaglio-studente/  modifica-studente/  studente-card/
│  │     ├─ app.ts / app.html / app.routes.ts / app.config.ts
│  │     └─ app.spec.ts · home/home.spec.ts · elenco/elenco.spec.ts · services/studenti-service.spec.ts
│  └─ hamburgeria/              TEO 03.13, workspace Angular autonomo (angular.json + package.json propri)
└─ node_modules/                dipendenze condivise
```

## Hamburgeria (TEO 03.13)

```bash
cd projects/hamburgeria
ng serve --port 4300
```

Il progetto ha il proprio `angular.json`, quindi `ng serve` funziona anche lì senza parametri.
