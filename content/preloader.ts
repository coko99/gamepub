/** Konfiguracija retro gaming preloadera — lako izmenjivo */

export const preloaderConfig = {
  /** Koliko udaraca u blok pre nego sto se sajt pusti */
  requiredBlockHits: 1,

  brand: {
    gamepubLogo: "/logo-transparent.png",
    cokoladniLogo: "/images/cokoladni-aj-ti-logo.png",
    gamepubText: "GAMEPUB",
    shirtText: "Aj Ti",
    /** Rotirajući tekstovi pri udaru glavom u blok */
    cokoladniShoutouts: [
      { line1: "SVE NAJBOLJE ZA", line2: "ČOKOLADNOG" },
      { line1: "NAJBOLJI", line2: "FOTOGRAF" },
      { line1: "NAJBOLJI", line2: "DIZAJNER" },
      { line1: "NAJBOLJI", line2: "VIDEOGRAF" },
      { line1: "NAJBOLJI", line2: "PROGRAMER" },
      { line1: "NAJBOLJI", line2: "EDITOR" },
      { line1: "NAJBOLJI", line2: "KREATIVAC" },
      { line1: "NAJBOLJI", line2: "PRODUCENT" },
    ],
  },

  loadingTexts: [
    "Ubaci novčić...",
    "Čokoladni Aj Ti pokreće igru...",
    "Učitava se Gamepub arena...",
    "Pali se Sony...",
    "Bilijar se namešta...",
    "Pikado traži centar...",
    "Još jedna partija...",
    "Ekipa ulazi u igru...",
    "Gamepub spreman!",
  ],

  navigationTexts: [
    "Učitava se sledeći level...",
    "Prelazak u novu zonu...",
    "Pali se konzole...",
    "Gamepub spreman!",
  ],
} as const;

export type PreloaderMode = "initial" | "navigation";
