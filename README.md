# franciacortawineclub.it

Sito del Franciacorta Wine Club, fatto con Jekyll e pubblicato da GitHub Pages:
ogni push su `master` aggiorna www.franciacortawineclub.it.

## Aggiungere un viaggio

1. Metti le foto in una nuova cartella `img/viaggi/AAAA-luogo/`, per esempio
   `img/viaggi/2027-portogallo/` (jpg o png, meglio se già ridotte a circa 1600 px).
2. Crea il file `_viaggi/AAAA-luogo.html`, con lo **stesso nome della cartella**:

   ```
   ---
   title: "Portogallo"
   date: 2027-04-01
   copertina: "Portogallo05.jpg"
   ---
   ```

   - `title`: il nome che compare sul sito.
   - `date`: anno e mese del viaggio (il giorno non conta). Decide l'ordine dei viaggi.
     Le date nel futuro non vengono pubblicate, quindi aggiungi il viaggio dopo averlo fatto.
   - `copertina`: la foto usata in home e nell'elenco. Se manca, si usa la prima foto.
   - Facoltativo: sotto le righe `---` puoi scrivere qualche riga sul viaggio, che
     comparirà sopra le foto.

Il resto si aggiorna da solo: la home apre con il viaggio più recente, e l'elenco
dei viaggi, le annate, il numero di foto e i link al viaggio precedente e successivo
vengono generati dai file in `_viaggi/`. La pagina sarà su
www.franciacortawineclub.it/AAAA-luogo.

## Aggiornare il notiziario

Il notiziario è la pagina www.franciacortawineclub.it/notiziario, e i contenuti stanno
in `_data/notiziario.yml`:

- in cima `periodo` e `aggiornato` (la data di aggiornamento compare sulla pagina);
- un blocco per ogni appuntamento, per esempio:

  ```
  - tipo: "Cena"
    titolo: "Bordeaux"
    data: 2026-10-27
    luogo: "Selva Bistrot, Brescia"
    iscrizioni: aperte
    note: "Basta un messaggio."
  ```

  I campi facoltativi (ora, più giorni, date vaghe come "Primavera 2027", link alle
  foto) sono spiegati all'inizio del file.
- `ordini`: il testo sugli ordini del vino.

Non serve togliere gli appuntamenti passati: si spostano da soli in "Già svolti" e
spariscono dalla home. Quando inizia un nuovo periodo si possono cancellare.

La cache è automatica: home e notiziario controllano di essere l'ultima versione
pubblicata e, se il browser ne mostra una vecchia, si ricaricano. I vecchi link a
`notiziario.pdf` portano alla pagina, e il pulsante "Stampa o salva in PDF" crea un PDF
di un foglio da condividere.
