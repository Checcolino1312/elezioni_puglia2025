# Ripartizione Seggi Elezioni Regionali Puglia 2025

Applicazione web per il calcolo automatico della ripartizione dei seggi con il **metodo D'Hondt**.

## 🚀 Utilizzo

**Su GitHub Pages:**
1. Visita la pagina GitHub Pages del progetto
2. L'applicazione carica automaticamente i dati
3. Visualizza i risultati ed esporta se necessario

**In locale con server:**
1. Avvia un web server nella cartella del progetto
   ```bash
   # Con Python 3
   python -m http.server 8000

   # Oppure con Node.js
   npx http-server -p 8000
   ```
2. Apri `http://localhost:8000/merge.html` nel browser

## 🌐 Deploy su GitHub Pages

1. **Push del repository su GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/username/repo-name.git
   git push -u origin main
   ```

2. **Attiva GitHub Pages**
   - Vai su Settings > Pages
   - Source: Deploy from a branch
   - Branch: `main` / `root`
   - Salva

3. **L'applicazione sarà disponibile su:**
   ```
   https://username.github.io/repo-name/merge.html
   ```

## 📁 File del Progetto

L'applicazione carica automaticamente i seguenti CSV:
- `bari.csv` - Dati elettorali provincia di Bari
- `bat.csv` - Dati elettorali provincia di BAT
- `brindisi.csv` - Dati elettorali provincia di Brindisi
- `foggia.csv` - Dati elettorali provincia di Foggia
- `lecce.csv` - Dati elettorali provincia di Lecce
- `taranto.csv` - Dati elettorali provincia di Taranto

## 📊 Funzionalità

- ✅ Caricamento automatico dei CSV all'apertura
- ✅ Calcolo con metodo D'Hondt a due livelli
- ✅ Ripartizione su 50 seggi totali
- ✅ Progress indicator durante il caricamento
- ✅ Tre tabelle riepilogative complete
- ✅ Esportazione risultati in formato CSV
- ✅ Nessun dato hardcoded - massima flessibilità
- ✅ Funziona completamente offline (dopo primo caricamento)

## 🎯 Metodo di Calcolo

Il sistema utilizza il **metodo D'Hondt** per la ripartizione proporzionale su due livelli:

### Primo Livello - Coalizioni
1. Calcola i voti totali per ogni coalizione
2. Distribuisce i 50 seggi tra le coalizioni con D'Hondt

### Secondo Livello - Partiti
1. Per ogni coalizione, calcola i voti dei singoli partiti
2. Distribuisce i seggi della coalizione tra i partiti con D'Hondt

## 🏛️ Coalizioni Configurate

- **Centrosinistra**: PD, M5S, Alleanza Verdi e Sinistra, Decaro Presidente, Per la Puglia, Avanti Popolari
- **Centrodestra**: Fratelli d'Italia, Lega, Forza Italia, Noi Moderati
- **Ada Donno**: Puglia Pacifista
- **Mangano**: Alleanza Civica

## 📈 Visualizzazione

L'applicazione mostra tre tabelle principali:

1. **Voti per Provincia e Partito**: matrice completa dei voti per provincia
2. **Voti e Seggi per Coalizione**: distribuzione dei 50 seggi tra coalizioni con dettaglio provinciale
3. **Seggi per Partito**: distribuzione finale dettagliata per singolo partito

## 🛠️ Tecnologie

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- Fetch API per caricamento CSV
- Nessuna dipendenza esterna

## 📦 Struttura del Progetto

```
merge/
├── merge.html      - Interfaccia dell'applicazione
├── merge.js        - Logica di calcolo e caricamento
├── merge.css       - Stili grafici
├── README.md       - Questa documentazione
├── bari.csv        - Dati provincia Bari
├── bat.csv         - Dati provincia BAT
├── brindisi.csv    - Dati provincia Brindisi
├── foggia.csv      - Dati provincia Foggia
├── lecce.csv       - Dati provincia Lecce
└── taranto.csv     - Dati provincia Taranto
```

## 🌐 Compatibilità

Funziona su tutti i browser moderni:
- Chrome / Edge (versioni recenti)
- Firefox (versioni recenti)
- Safari (versioni recenti)

**Nota**: Richiede hosting web (GitHub Pages, server locale, ecc.) - non funziona con il protocollo `file://` per limitazioni di sicurezza del browser.

## 💡 Come Funziona

1. All'apertura, l'applicazione carica automaticamente tutti i 6 CSV via fetch()
2. Mostra un progress indicator durante il caricamento
3. Analizza i dati delle liste elettorali ed estrae i voti per partito
4. Mappa automaticamente le liste ai partiti configurati
5. Calcola la ripartizione dei seggi usando il metodo D'Hondt
6. Mostra i risultati in tabelle chiare e permette l'esportazione

## 🔒 Privacy

- **100% locale**: elaborazione dati nel browser
- **Nessun tracking**: l'applicazione non raccoglie dati
- **Nessun backend**: tutto funziona client-side

## 📝 Aggiornare i Dati

Per aggiornare i dati elettorali:
1. Sostituisci i file CSV con i nuovi dati
2. Mantieni i nomi dei file invariati
3. Mantieni il formato CSV standard
4. Push su GitHub - le modifiche saranno automatiche

## ⚙️ Personalizzazione

### Modificare il numero di seggi
Modifica `merge.js` riga 2:
```javascript
const TOTALE_SEGGI = 50; // Cambia questo valore
```

### Aggiungere/rimuovere coalizioni
Modifica l'oggetto `COALIZIONI` in `merge.js`

### Modificare mapping partiti
Modifica l'oggetto `MAPPATURA_LISTE_PARTITI` in `merge.js`

## 🤝 Contributi

Contributi, issues e feature requests sono benvenuti!

Per contribuire:
1. Fork del progetto
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Commit delle modifiche (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📄 Licenza

Progetto open source per il calcolo della ripartizione seggi elettorali.

---

**Ripartizione Seggi Elezioni Regionali Puglia 2025**
Versione Locale - Caricamento Automatico - Nessun Dato Hardcoded
Calcolo con Metodo D'Hondt
