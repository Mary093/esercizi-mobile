export type Offerta = {
  id: string;
  titolo: string;
  nomeProdotto: string;
  descrizione: string;
  prezzoScontato: number;
  disponibilita: boolean;
  immagine: string;
  prezzoMinimoRichiesto?: number;
};

export const offertePizzeria: Offerta[] = [
  {
      id: "OFF101",
      titolo: "Pizza della Settimana",
      nomeProdotto: "Margherita Speciale + Bibita",
      descrizione: "Una classica Margherita con mozzarella di bufala e una bibita in lattina a scelta.",
      prezzoScontato: 8.99,
      disponibilita: true,
      immagine: "https://placehold.co/400x200/4CAF50/white?text=OFFERTA+MARGHERITA"
  },
  {
      id: "OFF102",
      titolo: "Menu Coppia",
      nomeProdotto: "2 Pizze a Scelta + 1 Birra Media",
      descrizione: "Perfetto per una serata in due. Scegli due pizze qualsiasi dal menu e avrai una birra media in omaggio.",
      prezzoScontato: 24.50,
      disponibilita: true,
      immagine: "https://placehold.co/400x200/F44336/white?text=OFFERTA+COPPIA"
  },
  {
      id: "OFF103",
      titolo: "Festa Pizza XL",
      nomeProdotto: "Pizza Gigante + Patatine Fritte",
      descrizione: "Una pizza formato famiglia (XL) con quattro gusti a scelta, più una porzione abbondante di patatine fritte.",
      prezzoScontato: 29.99,
      disponibilita: true,
      immagine: "https://placehold.co/400x200/FFC107/black?text=OFFERTA+XL"
  },
  {
      id: "OFF104",
      titolo: "Dolce e Caffè",
      nomeProdotto: "Qualsiasi Pizza + Dessert + Caffè",
      descrizione: "Consegna gratuita e un mini dessert incluso con l'acquisto di una pizza e un caffè.",
      prezzoScontato: 0.00,
      prezzoMinimoRichiesto: 15.00,
      disponibilita: false, // Non disponibile, per mostrare lo stato disabilitato
      immagine: "https://placehold.co/400x200/03A9F4/white?text=CONSEGNA+GRATIS"
  }
];
