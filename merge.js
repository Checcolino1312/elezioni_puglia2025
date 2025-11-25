// Configurazione partiti e coalizioni
const TOTALE_SEGGI = 50;

const MAPPATURA_LISTE_PARTITI = {
    'PARTITO DEMOCRATICO - CANDIDATO PRESIDENTE DECARO': 'PD',
    'PARTITO DEMOCRATICO': 'PD',
    'MOVIMENTO 5 STELLE': 'M5S',
    'ALLEANZA VERDI E SINISTRA': 'Avs',
    'DECARO PRESIDENTE': 'DecaroPr',
    'PER LA PUGLIA DECARO CANDIDATO PRESIDENTE': 'XlaPuglia',
    'AVANTI POPOLARI CON DECARO CANDIDATO PRESIDENTE': 'Avanti',
    'FRATELLI D\'ITALIA - GIORGIA MELONI': 'FdI',
    'FRATELLI D\'ITALIA': 'FdI',
    'LEGA': 'Lega',
    'LEGA PUGLIA': 'Lega',
    'FORZA ITALIA - BERLUSCONI - PPE - LOBUONO PRESIDENTE': 'FI',
    'FORZA ITALIA': 'FI',
    'NOI MODERATI': 'NoiMod',
    'NOI MODERATI - CIVICI PER LOBUONO': 'NoiMod',
    'PUGLIA PACIFISTA': 'PugliaPacifista',
    'PUGLIA PACIFISTA E POPOLARE': 'PugliaPacifista',
    'ALLEANZA CIVICA': 'AlleanzaCivica',
    'ALLEANZA CIVICA PER LA PUGLIA': 'AlleanzaCivica'
};

const COALIZIONI = {
    'Centrosinistra': {
        partiti: ['PD', 'M5S', 'Avs', 'DecaroPr', 'XlaPuglia', 'Avanti'],
        presidente: 'DECARO ANTONIO'
    },
    'Centrodestra': {
        partiti: ['FdI', 'Lega', 'FI', 'NoiMod'],
        presidente: 'LOBUONO LUIGI'
    },
    'Ada Donno': {
        partiti: ['PugliaPacifista'],
        presidente: 'ADA DONNO'
    },
    'Mangano': {
        partiti: ['AlleanzaCivica'],
        presidente: 'MANGANO'
    }
};

const NOMI_PROVINCE = ['Bari', 'BAT', 'Brindisi', 'Foggia', 'Lecce', 'Taranto'];

// Mapping nomi file CSV
const FILE_CSV = {
    'Bari': 'bari.csv',
    'BAT': 'bat.csv',
    'Brindisi': 'brindisi.csv',
    'Foggia': 'foggia.csv',
    'Lecce': 'lecce.csv',
    'Taranto': 'taranto.csv'
};

let votiPerPartito = {};
let votiPerProvincia = {};

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('export-csv-btn').addEventListener('click', esportaCSV);
    caricaAutomaticamenteCSV();
});

async function caricaAutomaticamenteCSV() {
    mostraCaricamento('Caricamento CSV delle province in corso...');

    try {
        inizializzaDati();

        for (let provincia of NOMI_PROVINCE) {
            const nomeFile = FILE_CSV[provincia];
            mostraCaricamento(`Caricamento ${provincia}...`);

            try {
                const response = await fetch(nomeFile);
                if (!response.ok) {
                    throw new Error(`Impossibile caricare ${nomeFile}`);
                }
                const text = await response.text();
                estraiVotiDaCSV(text, provincia);
                aggiornaProgressoCaricamento(provincia);
            } catch (error) {
                console.error(`Errore caricamento ${provincia}:`, error);
                mostraErrore(`Errore nel caricamento di ${provincia}: ${error.message}`);
                return;
            }
        }

        nascondiCaricamento();
        document.getElementById('results-section').style.display = 'block';
        visualizzaRisultati();

    } catch (error) {
        nascondiCaricamento();
        mostraErrore('Errore durante l\'elaborazione: ' + error.message);
    }
}

function mostraCaricamento(messaggio) {
    const loading = document.getElementById('loading');
    loading.textContent = messaggio;
    loading.style.display = 'block';
}

function nascondiCaricamento() {
    document.getElementById('loading').style.display = 'none';
}

function aggiornaProgressoCaricamento(provincia) {
    const provinceCaricate = document.querySelectorAll('.provincia-caricata').length;
    const container = document.getElementById('province-caricate');

    if (!container) {
        const loadingDiv = document.getElementById('loading');
        const progressDiv = document.createElement('div');
        progressDiv.id = 'province-caricate';
        progressDiv.style.marginTop = '1rem';
        loadingDiv.appendChild(progressDiv);
    }

    const badge = document.createElement('span');
    badge.className = 'provincia-caricata';
    badge.textContent = provincia;
    badge.style.cssText = 'display: inline-block; background: #4caf50; color: white; padding: 0.3rem 0.8rem; margin: 0.2rem; border-radius: 15px; font-size: 0.9rem;';
    document.getElementById('province-caricate').appendChild(badge);
}

function inizializzaDati() {
    votiPerPartito = {};
    votiPerProvincia = {};

    // Inizializza tutti i partiti
    Object.values(MAPPATURA_LISTE_PARTITI).forEach(partito => {
        if (!votiPerPartito[partito]) {
            votiPerPartito[partito] = {
                totale: 0,
                province: {}
            };
            NOMI_PROVINCE.forEach(prov => {
                votiPerPartito[partito].province[prov] = 0;
            });
        }
    });

    NOMI_PROVINCE.forEach(prov => {
        votiPerProvincia[prov] = 0;
    });
}

function estraiVotiDaCSV(csvText, provincia) {
    const righe = csvText.split('\n');
    let candidatoCorrente = null;
    let listaCorrente = null;

    for (let i = 1; i < righe.length; i++) {
        const riga = righe[i].trim();
        if (!riga) continue;

        const colonneMatch = riga.match(/"([^"]*)"/g);
        if (!colonneMatch) continue;

        const colonne = colonneMatch.map(col => col.replace(/^"|"$/g, '').trim());

        // Candidato Presidente
        if (colonne.length >= 5 && colonne[0] && !colonne[1] && colonne[3]) {
            candidatoCorrente = colonne[0];
        }
        // Lista
        else if (colonne.length >= 5 && !colonne[0] && colonne[1] && colonne[3]) {
            const nomeLista = colonne[1];
            const voti = parseInt(colonne[3].replace(/\./g, '')) || 0;

            // Mappa la lista al partito
            const partito = trovaPartito(nomeLista);
            if (partito) {
                if (!votiPerPartito[partito]) {
                    votiPerPartito[partito] = {
                        totale: 0,
                        province: {}
                    };
                    NOMI_PROVINCE.forEach(p => {
                        votiPerPartito[partito].province[p] = 0;
                    });
                }
                votiPerPartito[partito].province[provincia] += voti;
                votiPerPartito[partito].totale += voti;
            }
        }
    }
}

function trovaPartito(nomeLista) {
    // Cerca corrispondenza esatta
    if (MAPPATURA_LISTE_PARTITI[nomeLista]) {
        return MAPPATURA_LISTE_PARTITI[nomeLista];
    }

    // Cerca corrispondenza parziale
    const nomeListaUpper = nomeLista.toUpperCase();
    for (let [chiave, valore] of Object.entries(MAPPATURA_LISTE_PARTITI)) {
        if (nomeListaUpper.includes(chiave.toUpperCase()) || chiave.toUpperCase().includes(nomeListaUpper)) {
            return valore;
        }
    }

    return null;
}

function calcolaSeggiDHondt(voti, totaleSeggi) {
    const risultato = {};
    const seggi = Array(totaleSeggi).fill(null);

    for (let i = 0; i < totaleSeggi; i++) {
        let maxQuoziente = 0;
        let partitoMax = null;

        for (let [partito, voti_partito] of Object.entries(voti)) {
            const seggiAttuali = seggi.filter(s => s === partito).length;
            const quoziente = voti_partito / (seggiAttuali + 1);

            if (quoziente > maxQuoziente) {
                maxQuoziente = quoziente;
                partitoMax = partito;
            }
        }

        if (partitoMax) {
            seggi[i] = partitoMax;
        }
    }

    // Conta i seggi per partito
    for (let partito of Object.keys(voti)) {
        risultato[partito] = seggi.filter(s => s === partito).length;
    }

    return risultato;
}

function visualizzaRisultati() {
    // Calcola voti per coalizione
    const votiCoalizioni = {};
    for (let [nomeCoalizione, coalizione] of Object.entries(COALIZIONI)) {
        votiCoalizioni[nomeCoalizione] = 0;
        coalizione.partiti.forEach(partito => {
            if (votiPerPartito[partito]) {
                votiCoalizioni[nomeCoalizione] += votiPerPartito[partito].totale;
            }
        });
    }

    // Calcola seggi per coalizione
    const seggiCoalizioni = calcolaSeggiDHondt(votiCoalizioni, TOTALE_SEGGI);

    // Calcola seggi per partito all'interno di ogni coalizione
    const seggiPartiti = {};
    for (let [nomeCoalizione, coalizione] of Object.entries(COALIZIONI)) {
        const votiPartitiCoalizione = {};
        coalizione.partiti.forEach(partito => {
            if (votiPerPartito[partito]) {
                votiPartitiCoalizione[partito] = votiPerPartito[partito].totale;
            }
        });

        const seggiCoalizione = seggiCoalizioni[nomeCoalizione] || 0;
        if (seggiCoalizione > 0) {
            const distribuzione = calcolaSeggiDHondt(votiPartitiCoalizione, seggiCoalizione);
            Object.assign(seggiPartiti, distribuzione);
        }
    }

    visualizzaTabellaCompleta(votiCoalizioni, seggiCoalizioni, seggiPartiti);
}

function visualizzaTabellaCompleta(votiCoalizioni, seggiCoalizioni, seggiPartiti) {
    let html = '<div class="ripartizione-completa">';

    // Sezione 1: Voti per Provincia e Partito
    html += '<h3>Voti per Provincia e Partito</h3>';
    html += '<table class="excel-table">';
    html += '<thead><tr><th>Provincia</th>';

    const tuttiPartiti = Object.keys(votiPerPartito).sort();
    tuttiPartiti.forEach(partito => {
        html += `<th>${partito}</th>`;
    });
    html += '</tr></thead><tbody>';

    NOMI_PROVINCE.forEach(provincia => {
        html += `<tr><td class="provincia-nome">${provincia}</td>`;
        tuttiPartiti.forEach(partito => {
            const voti = votiPerPartito[partito]?.province[provincia] || 0;
            html += `<td class="numero">${voti.toLocaleString('it-IT')}</td>`;
        });
        html += '</tr>';
    });

    html += '</tbody></table>';

    // Sezione 2: Coalizioni
    html += '<div class="section-spacer"></div>';
    html += `<h3>Totale Seggi: ${TOTALE_SEGGI}</h3>`;
    html += '<table class="excel-table coalizioni-table">';
    html += '<thead><tr><th>Coalizione</th><th>Partiti</th><th>Voti Totali</th><th>Seggi Totali</th>';
    NOMI_PROVINCE.forEach(prov => {
        html += `<th>${prov}</th>`;
    });
    html += '</tr></thead><tbody>';

    for (let [nomeCoalizione, coalizione] of Object.entries(COALIZIONI)) {
        const votiTotali = votiCoalizioni[nomeCoalizione] || 0;
        const seggiTotali = seggiCoalizioni[nomeCoalizione] || 0;
        const partitiStr = coalizione.partiti.join(', ');

        html += `<tr>
            <td class="coalizione-nome">${nomeCoalizione}</td>
            <td>${partitiStr}</td>
            <td class="numero">${votiTotali.toLocaleString('it-IT')}</td>
            <td class="numero seggi">${seggiTotali}</td>`;

        NOMI_PROVINCE.forEach(prov => {
            let votiProvincia = 0;
            coalizione.partiti.forEach(partito => {
                if (votiPerPartito[partito]) {
                    votiProvincia += votiPerPartito[partito].province[prov] || 0;
                }
            });
            html += `<td class="numero">${votiProvincia.toLocaleString('it-IT')}</td>`;
        });

        html += '</tr>';
    }

    html += '</tbody></table>';

    // Sezione 3: Partiti
    html += '<div class="section-spacer"></div>';
    html += '<h3>Distribuzione Seggi per Partito</h3>';
    html += '<table class="excel-table partiti-table">';
    html += '<thead><tr><th>Partito</th><th>Coalizione</th><th>Voti Totali</th><th>Seggi Partito</th></tr></thead>';
    html += '<tbody>';

    for (let [nomeCoalizione, coalizione] of Object.entries(COALIZIONI)) {
        coalizione.partiti.forEach(partito => {
            const votiTotali = votiPerPartito[partito]?.totale || 0;
            const seggi = seggiPartiti[partito] || 0;

            html += `<tr>
                <td class="partito-nome">${partito}</td>
                <td>${nomeCoalizione}</td>
                <td class="numero">${votiTotali.toLocaleString('it-IT')}</td>
                <td class="numero seggi">${seggi}</td>
            </tr>`;
        });
    }

    html += '</tbody></table>';
    html += '</div>';

    document.getElementById('results-container').innerHTML = html;
}

function esportaCSV() {
    let csvContent = 'Provincia;';

    const tuttiPartiti = Object.keys(votiPerPartito).sort();
    csvContent += tuttiPartiti.join(';') + '\n';

    NOMI_PROVINCE.forEach(provincia => {
        csvContent += `${provincia};`;
        const votiProv = tuttiPartiti.map(partito =>
            votiPerPartito[partito]?.province[provincia] || 0
        );
        csvContent += votiProv.join(';') + '\n';
    });

    csvContent += ';;;;;;;;;;;;\n';
    csvContent += ';Totale Seggi;' + TOTALE_SEGGI + '\n';
    csvContent += ';;;;;;;;;;;;\n';

    // Aggiungi coalizioni e partiti...
    csvContent += 'Coalizione;Partiti;VotiTotali;SeggiTotali;' + NOMI_PROVINCE.join(';') + '\n';

    const votiCoalizioni = {};
    for (let [nomeCoalizione, coalizione] of Object.entries(COALIZIONI)) {
        votiCoalizioni[nomeCoalizione] = 0;
        coalizione.partiti.forEach(partito => {
            if (votiPerPartito[partito]) {
                votiCoalizioni[nomeCoalizione] += votiPerPartito[partito].totale;
            }
        });
    }

    const seggiCoalizioni = calcolaSeggiDHondt(votiCoalizioni, TOTALE_SEGGI);

    for (let [nomeCoalizione, coalizione] of Object.entries(COALIZIONI)) {
        const votiTotali = votiCoalizioni[nomeCoalizione] || 0;
        const seggiTotali = seggiCoalizioni[nomeCoalizione] || 0;
        csvContent += `${nomeCoalizione};${coalizione.partiti.join(', ')};${votiTotali};${seggiTotali};`;

        NOMI_PROVINCE.forEach(prov => {
            let votiProvincia = 0;
            coalizione.partiti.forEach(partito => {
                if (votiPerPartito[partito]) {
                    votiProvincia += votiPerPartito[partito].province[prov] || 0;
                }
            });
            csvContent += votiProvincia + ';';
        });
        csvContent += '\n';
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', 'Ripartizione_Completa.csv');
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function mostraErrore(messaggio) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = messaggio;
    errorDiv.style.display = 'block';
    nascondiCaricamento();
}
