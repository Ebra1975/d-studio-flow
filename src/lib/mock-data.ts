// Mock data for the 3D printing lab management system
// All data is fake and hardcoded for UX evaluation purposes only.

export type TipoCliente = "B2C" | "B2B" | "Associazione" | "Volontariato";

export type Referente = {
  id: string;
  nome: string;
  ruolo?: string;
  email: string;
  telefono: string;
  principale: boolean;
  gestisceAmministrazione: boolean;
};

export type PrezzoPersonalizzato = {
  id: string;
  materiale: string;
  prezzo: number;
  validoDal: string; // dd/mm/yyyy
  validoAl?: string;
};

export type Cliente = {
  id: string;
  denominazione: string;
  tipo: TipoCliente;
  partitaIva?: string;
  codiceFiscale?: string;
  indirizzo: string;
  referenti: Referente[];
  listino?: PrezzoPersonalizzato[];
};

export type PrezzoLavorazione = {
  id: string;
  descrizione: string;
  prezzo?: number;
  unita: string; // "a pezzo", "al kg", "forfait"
};

export type Fornitore = {
  id: string;
  denominazione: string;
  partitaIva: string;
  indirizzo: string;
  referenti: Referente[];
  lavorazioni?: PrezzoLavorazione[];
};


export type StatoCommessa =
  | "preventivo inviato"
  | "in trattativa"
  | "confermata"
  | "in produzione"
  | "consegnata"
  | "fatturata"
  | "chiusa"
  | "annullata";

export type OpzionePreventivo = {
  id: string;
  nome: string;
  materiale: string;
  stampante: string;
  durataUV: string;
  quantita: number;
  totale: number;
  prezzoUnitario: number;
  scelta: boolean;
  note?: string;
};

export type RigaCosto = {
  id: string;
  categoria:
    | "materiale"
    | "tempo macchina"
    | "progettazione/setup"
    | "trattamento"
    | "trasferta"
    | "elettricità";
  descrizione: string;
  quantita: string;
  costoUnitario: number;
  costoTotale: number;
};

export type Allegato = {
  id: string;
  nome: string;
  tipo: "preventivo" | "conferma d'incarico" | "comodato" | "progetto CAD" | "altro";
  statoFirma: "non richiesta" | "in attesa" | "confermata";
  dataCaricamento: string;
};

export type Commessa = {
  id: string;
  codice: string;
  titolo: string;
  clienteId: string;
  cliente: string;
  stato: StatoCommessa;
  prezzoPattuito: number;
  dataApertura: string;
  dataConsegnaPrevista?: string;
  opzioni: OpzionePreventivo[];
  righeCosto: RigaCosto[];
  allegati: Allegato[];
  note?: string;
};

export type CategoriaMateriale = "primario" | "secondario" | "attrezzatura";
export type TipoMateriale = "filamento" | "resina" | "polvere" | "altro";

export type Materiale = {
  id: string;
  nome: string;
  categoria: CategoriaMateriale;
  tipoMateriale: TipoMateriale | null;
  marca: string;
  colore: string;
  unitaMisura: string;
  costoUnitario: number;
  scortaMinima: number | null;
  giacenzaAttuale: number | null;
  note?: string;
};

export type Lotto = {
  id: string;
  materialeId: string;
  numeroLotto: string;
  fornitore: string;
  quantitaIniziale: number;
  giacenzaAttuale: number;
  costoLotto: number;
  dataAcquisto: string; // dd/mm/yyyy
  dataScadenza?: string;
};

export type TipoMovimento = "carico" | "scarico" | "rettifica";

export type Movimento = {
  id: string;
  materialeId: string;
  tipo: TipoMovimento;
  quantita: number; // sempre positivo; per rettifica può essere negativo
  lottoId: string | null;
  commessaId: string | null;
  data: string; // dd/mm/yyyy
  note?: string;
};


export type Stampante = {
  id: string;
  nome: string;
  modello: string;
  tecnologia: "FDM" | "SLA" | "SLS";
  stato: "attiva" | "manutenzione" | "dismessa";
  costoOrario: number;
  proprieta: "proprietà" | "comodato";
};

export type Job = {
  id: string;
  stampanteId: string;
  commessaId: string;
  descrizione: string;
  stato: "pianificato" | "in corso" | "completato";
  oreStimate: number;
  dataInizio?: string;
};

export type Fattura = {
  id: string;
  numero: string;
  clienteId: string;
  cliente: string;
  importo: number;
  dataEmissione: string;
  dataScadenza: string;
  stato: "in attesa" | "scaduta" | "pagata";
};

// ============================================================
// CLIENTI
// ============================================================
export const clienti: Cliente[] = [
  {
    id: "cli-001",
    denominazione: "Arcipelago Coop. Soc.",
    tipo: "Associazione",
    partitaIva: "04512890876",
    indirizzo: "Via del Porto 12, 90133 Palermo (PA)",
    referenti: [
      {
        id: "ref-001",
        nome: "Salvatore Saracino",
        ruolo: "Responsabile Segreteria e Amministrazione",
        email: "s.saracino@arcipelago.coop",
        telefono: "+39 091 555 0142",
        principale: true,
        gestisceAmministrazione: true,
      },
      {
        id: "ref-002",
        nome: "Giulia Marino",
        ruolo: "Coordinatrice progetti",
        email: "g.marino@arcipelago.coop",
        telefono: "+39 091 555 0143",
        principale: false,
        gestisceAmministrazione: false,
      },
    ],
    listino: [
      {
        id: "pp-001",
        materiale: "PLA Nero",
        prezzo: 18.5,
        validoDal: "01/01/2026",
      },
    ],
  },

  {
    id: "cli-002",
    denominazione: "Cliente di Prova SRL",
    tipo: "B2B",
    partitaIva: "12345678901",
    indirizzo: "Via Roma 45, 20121 Milano (MI)",
    referenti: [],
  },
  {
    id: "cli-003",
    denominazione: "Mario Rossi",
    tipo: "B2C",
    codiceFiscale: "RSSMRA80A01H501U",
    indirizzo: "Via Garibaldi 8, 00184 Roma (RM)",
    referenti: [],
  },
  {
    id: "cli-004",
    denominazione: "Volontari per il Territorio ODV",
    tipo: "Volontariato",
    partitaIva: "09876543210",
    indirizzo: "Via Verdi 22, 40121 Bologna (BO)",
    referenti: [
      {
        id: "ref-003",
        nome: "Laura Bianchi",
        ruolo: "Presidente",
        email: "presidente@volontariterritorio.it",
        telefono: "+39 051 555 0198",
        principale: true,
        gestisceAmministrazione: true,
      },
    ],
  },
];

// ============================================================
// FORNITORI
// ============================================================
export const fornitori: Fornitore[] = [
  {
    id: "for-001",
    denominazione: "FilamentiPro SRL",
    partitaIva: "11223344556",
    indirizzo: "Via Industria 7, 36100 Vicenza (VI)",
    referenti: [
      {
        id: "fref-001",
        nome: "Andrea Costa",
        ruolo: "Commerciale",
        email: "a.costa@filamentipro.it",
        telefono: "+39 0444 555 011",
        principale: true,
        gestisceAmministrazione: false,
      },
    ],
  },
  {
    id: "for-002",
    denominazione: "TechSupply Italia",
    partitaIva: "22334455667",
    indirizzo: "Corso Francia 100, 10143 Torino (TO)",
    referenti: [],
  },
  {
    id: "for-003",
    denominazione: "Carrozzeria Rossi",
    partitaIva: "33445566778",
    indirizzo: "Via Meccanici 5, 90100 Palermo (PA)",
    referenti: [],
    lavorazioni: [
      {
        id: "lav-001",
        descrizione: "Verniciatura UV-resistant",
        prezzo: 15.0,
        unita: "a pezzo",
      },
      {
        id: "lav-002",
        descrizione: "Saldatura struttura metallica",
        unita: "forfait",
      },
    ],
  },
];


// ============================================================
// COMMESSE
// ============================================================
export const commesse: Commessa[] = [
  {
    id: "com-001",
    codice: "B3D-COM-2026-0001",
    titolo: "Segnaletica pannelli informativi area marina",
    clienteId: "cli-001",
    cliente: "Arcipelago Coop. Soc.",
    stato: "confermata",
    prezzoPattuito: 1100.0,
    dataApertura: "10/05/2026",
    dataConsegnaPrevista: "30/06/2026",
    opzioni: [
      {
        id: "opz-001",
        nome: "Economica",
        materiale: "PETG",
        stampante: "Prusa MK4",
        durataUV: "3-5 anni",
        quantita: 20,
        totale: 1610.92,
        prezzoUnitario: 80.55,
        scelta: false,
      },
      {
        id: "opz-002",
        nome: "Intermedia UV",
        materiale: "PETG + verniciatura",
        stampante: "Prusa MK4",
        durataUV: "8-10 anni",
        quantita: 20,
        totale: 1960.92,
        prezzoUnitario: 98.05,
        scelta: false,
      },
      {
        id: "opz-003",
        nome: "Premium ASA",
        materiale: "ASA",
        stampante: "Kobra X",
        durataUV: "10+ anni",
        quantita: 20,
        totale: 1718.13,
        prezzoUnitario: 85.91,
        scelta: false,
      },
      {
        id: "opz-004",
        nome: "Premium ASA Convenzionata",
        materiale: "ASA",
        stampante: "Bambu H2D (comodato)",
        durataUV: "10+ anni",
        quantita: 20,
        totale: 1210.86,
        prezzoUnitario: 60.54,
        scelta: true,
        note: "Stampante in comodato — solo costo elettricità",
      },
    ],
    righeCosto: [
      {
        id: "rc-001",
        categoria: "materiale",
        descrizione: "ASA Bianco",
        quantita: "20 unità",
        costoUnitario: 20.81,
        costoTotale: 416.1,
      },
      {
        id: "rc-002",
        categoria: "progettazione/setup",
        descrizione: "Progettazione CAD e setup slicer",
        quantita: "14 h",
        costoUnitario: 42.0,
        costoTotale: 588.0,
      },
      {
        id: "rc-003",
        categoria: "elettricità",
        descrizione: "Stampa Bambu H2D (comodato)",
        quantita: "820,8 h stampa",
        costoUnitario: 0.07,
        costoTotale: 57.46,
      },
    ],
    allegati: [
      {
        id: "all-001",
        nome: "Preventivo_B3D-COM-2026-0001.pdf",
        tipo: "preventivo",
        statoFirma: "confermata",
        dataCaricamento: "10/05/2026",
      },
      {
        id: "all-002",
        nome: "Conferma_incarico_Arcipelago.pdf",
        tipo: "conferma d'incarico",
        statoFirma: "confermata",
        dataCaricamento: "18/05/2026",
      },
      {
        id: "all-003",
        nome: "Contratto_comodato_H2D.pdf",
        tipo: "comodato",
        statoFirma: "in attesa",
        dataCaricamento: "20/05/2026",
      },
      {
        id: "all-004",
        nome: "Pannello_segnaletica_rev3.step",
        tipo: "progetto CAD",
        statoFirma: "non richiesta",
        dataCaricamento: "22/05/2026",
      },
    ],
  },
  {
    id: "com-002",
    codice: "B3D-COM-2026-0002",
    titolo: "Portachiavi personalizzato in PLA",
    clienteId: "cli-003",
    cliente: "Mario Rossi",
    stato: "preventivo inviato",
    prezzoPattuito: 45.0,
    dataApertura: "01/06/2026",
    opzioni: [
      {
        id: "opz-005",
        nome: "Standard",
        materiale: "PLA Nero",
        stampante: "Prusa MK4",
        durataUV: "N/A (uso interno)",
        quantita: 5,
        totale: 45.0,
        prezzoUnitario: 9.0,
        scelta: true,
      },
    ],
    righeCosto: [
      {
        id: "rc-004",
        categoria: "materiale",
        descrizione: "PLA Nero (50g)",
        quantita: "50 g",
        costoUnitario: 0.03,
        costoTotale: 1.5,
      },
      {
        id: "rc-005",
        categoria: "tempo macchina",
        descrizione: "Prusa MK4",
        quantita: "3 h",
        costoUnitario: 2.5,
        costoTotale: 7.5,
      },
      {
        id: "rc-006",
        categoria: "progettazione/setup",
        descrizione: "Personalizzazione testo",
        quantita: "0,5 h",
        costoUnitario: 42.0,
        costoTotale: 21.0,
      },
    ],
    allegati: [
      {
        id: "all-005",
        nome: "Preventivo_portachiavi.pdf",
        tipo: "preventivo",
        statoFirma: "in attesa",
        dataCaricamento: "01/06/2026",
      },
    ],
  },
  {
    id: "com-003",
    codice: "B3D-COM-2026-0003",
    titolo: "Ausili didattici tattili per non vedenti",
    clienteId: "cli-004",
    cliente: "Volontari per il Territorio ODV",
    stato: "in produzione",
    prezzoPattuito: 680.0,
    dataApertura: "15/05/2026",
    dataConsegnaPrevista: "10/07/2026",
    opzioni: [
      {
        id: "opz-006",
        nome: "Base PLA",
        materiale: "PLA Nero",
        stampante: "Kobra X",
        durataUV: "uso interno",
        quantita: 30,
        totale: 720.0,
        prezzoUnitario: 24.0,
        scelta: false,
      },
      {
        id: "opz-007",
        nome: "Tariffa convenzionata volontariato",
        materiale: "PLA Nero",
        stampante: "Kobra X",
        durataUV: "uso interno",
        quantita: 30,
        totale: 680.0,
        prezzoUnitario: 22.67,
        scelta: true,
        note: "Sconto tariffa sociale 5%",
      },
    ],
    righeCosto: [
      {
        id: "rc-007",
        categoria: "materiale",
        descrizione: "PLA Nero (1,2 kg)",
        quantita: "1200 g",
        costoUnitario: 0.03,
        costoTotale: 36.0,
      },
      {
        id: "rc-008",
        categoria: "tempo macchina",
        descrizione: "Kobra X",
        quantita: "48 h",
        costoUnitario: 1.8,
        costoTotale: 86.4,
      },
      {
        id: "rc-009",
        categoria: "progettazione/setup",
        descrizione: "Progettazione tattile",
        quantita: "10 h",
        costoUnitario: 42.0,
        costoTotale: 420.0,
      },
    ],
    allegati: [
      {
        id: "all-006",
        nome: "Preventivo_ausili_didattici.pdf",
        tipo: "preventivo",
        statoFirma: "confermata",
        dataCaricamento: "15/05/2026",
      },
      {
        id: "all-007",
        nome: "Conferma_ODV.pdf",
        tipo: "conferma d'incarico",
        statoFirma: "confermata",
        dataCaricamento: "20/05/2026",
      },
    ],
  },
];

// ============================================================
// MAGAZZINO
// ============================================================
export const materiali: Materiale[] = [
  {
    id: "mat-001",
    nome: "PLA Nero",
    categoria: "primario",
    brand: "FilamentiPro",
    unitaAcquisto: "kg",
    unitaConsumo: "g",
    prezzoStandard: 22.0,
    scortaAttuale: 2.4,
    scortaMinima: 1.0,
    unitaMisura: "kg",
    specifiche: {
      "Diametro": "1,75 mm",
      "Temperatura stampa": "200-220 °C",
      "Temperatura piatto": "60 °C",
      "Resistenza UV": "Bassa",
    },
  },
  {
    id: "mat-002",
    nome: "PETG Trasparente",
    categoria: "primario",
    brand: "FilamentiPro",
    unitaAcquisto: "kg",
    unitaConsumo: "g",
    prezzoStandard: 28.0,
    scortaAttuale: 0.3,
    scortaMinima: 1.0,
    unitaMisura: "kg",
    specifiche: {
      "Diametro": "1,75 mm",
      "Temperatura stampa": "230-250 °C",
      "Temperatura piatto": "75 °C",
      "Resistenza UV": "Media (3-5 anni)",
    },
  },
  {
    id: "mat-003",
    nome: "ASA Bianco",
    categoria: "primario",
    brand: "TechSupply",
    unitaAcquisto: "kg",
    unitaConsumo: "g",
    prezzoStandard: 34.0,
    scortaAttuale: 3.1,
    scortaMinima: 1.5,
    unitaMisura: "kg",
    specifiche: {
      "Diametro": "1,75 mm",
      "Temperatura stampa": "240-260 °C",
      "Temperatura piatto": "100 °C",
      "Resistenza UV": "Alta (10+ anni)",
    },
  },
  {
    id: "mat-004",
    nome: "Alcol isopropilico",
    categoria: "secondario",
    brand: "TechSupply",
    unitaAcquisto: "L",
    unitaConsumo: "ml",
    prezzoStandard: 8.5,
    scortaAttuale: 0.2,
    scortaMinima: 1.0,
    unitaMisura: "L",
    specifiche: {
      "Concentrazione": "99%",
      "Uso": "Pulizia piatti e post-processing SLA",
    },
  },
  {
    id: "mat-005",
    nome: "Guanti nitrile",
    categoria: "secondario",
    brand: "TechSupply",
    unitaAcquisto: "scatola",
    unitaConsumo: "pz",
    prezzoStandard: 12.0,
    scortaAttuale: 4,
    scortaMinima: 2,
    unitaMisura: "scatole",
    specifiche: {
      "Taglia": "M",
      "Pezzi per scatola": "100",
    },
  },
  {
    id: "mat-006",
    nome: "Tronchese di precisione",
    categoria: "attrezzatura",
    scortaAttuale: null,
    scortaMinima: null,
    unitaMisura: "-",
    specifiche: {
      "Marca": "Knipex",
      "Uso": "Rimozione supporti",
    },
  },
];

// ============================================================
// PRODUZIONE
// ============================================================
export const stampanti: Stampante[] = [
  {
    id: "stp-001",
    nome: "Stampante 1",
    modello: "Prusa MK4",
    tecnologia: "FDM",
    stato: "attiva",
    costoOrario: 2.5,
    proprieta: "proprietà",
  },
  {
    id: "stp-002",
    nome: "Kobra X",
    modello: "Anycubic Kobra X",
    tecnologia: "FDM",
    stato: "attiva",
    costoOrario: 1.8,
    proprieta: "proprietà",
  },
  {
    id: "stp-003",
    nome: "Bambu H2D",
    modello: "Bambu Lab H2D",
    tecnologia: "FDM",
    stato: "attiva",
    costoOrario: 0.5,
    proprieta: "comodato",
  },
];

export const jobs: Job[] = [
  {
    id: "job-001",
    stampanteId: "stp-003",
    commessaId: "com-001",
    descrizione: "Stampa pannelli lotto 1 (10/20)",
    stato: "in corso",
    oreStimate: 410,
    dataInizio: "05/06/2026",
  },
  {
    id: "job-002",
    stampanteId: "stp-002",
    commessaId: "com-003",
    descrizione: "Ausili tattili — set A",
    stato: "in corso",
    oreStimate: 24,
    dataInizio: "08/06/2026",
  },
  {
    id: "job-003",
    stampanteId: "stp-002",
    commessaId: "com-003",
    descrizione: "Ausili tattili — set B",
    stato: "pianificato",
    oreStimate: 24,
  },
  {
    id: "job-004",
    stampanteId: "stp-001",
    commessaId: "com-002",
    descrizione: "Portachiavi Mario Rossi",
    stato: "pianificato",
    oreStimate: 3,
  },
];

// ============================================================
// AMMINISTRAZIONE
// ============================================================
export const fatture: Fattura[] = [
  {
    id: "fat-001",
    numero: "FT/2026/0001",
    clienteId: "cli-001",
    cliente: "Arcipelago Coop. Soc.",
    importo: 1100.0,
    dataEmissione: "15/06/2026",
    dataScadenza: "15/07/2026",
    stato: "in attesa",
  },
  {
    id: "fat-002",
    numero: "FT/2026/0002",
    clienteId: "cli-002",
    cliente: "Cliente di Prova SRL",
    importo: 180.0,
    dataEmissione: "20/05/2026",
    dataScadenza: "20/06/2026",
    stato: "scaduta",
  },
  {
    id: "fat-003",
    numero: "FT/2026/0003",
    clienteId: "cli-004",
    cliente: "Volontari per il Territorio ODV",
    importo: 340.0,
    dataEmissione: "01/06/2026",
    dataScadenza: "01/07/2026",
    stato: "in attesa",
  },
  {
    id: "fat-004",
    numero: "FT/2025/0128",
    clienteId: "cli-002",
    cliente: "Cliente di Prova SRL",
    importo: 520.0,
    dataEmissione: "10/12/2025",
    dataScadenza: "10/01/2026",
    stato: "pagata",
  },
];

// ============================================================
// HELPERS
// ============================================================
export const formatEuro = (n: number) =>
  new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(n);

export const formatNumber = (n: number, decimals = 2) =>
  new Intl.NumberFormat("it-IT", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);

// KPIs
export const kpiMargineMedio = () => {
  // Fake: computed from delivered/closed jobs. Return a plausible figure.
  return 0.32; // 32%
};

export const kpiCommesseAttive = () =>
  commesse.filter((c) =>
    ["confermata", "in produzione", "in trattativa"].includes(c.stato),
  ).length;

export const kpiMaterialiSottoScorta = () =>
  materiali.filter(
    (m) =>
      m.scortaAttuale !== null &&
      m.scortaMinima !== null &&
      m.scortaAttuale < m.scortaMinima,
  );

export const kpiFattureScadute = () =>
  fatture.filter((f) => f.stato === "scaduta");

export const prossimeScadenze = () =>
  fatture
    .filter((f) => f.stato !== "pagata")
    .sort((a, b) => {
      const [ga, ma, ya] = a.dataScadenza.split("/").map(Number);
      const [gb, mb, yb] = b.dataScadenza.split("/").map(Number);
      return new Date(ya, ma - 1, ga).getTime() - new Date(yb, mb - 1, gb).getTime();
    });
