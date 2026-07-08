/** Konfiguracija retro gaming preloadera — lako izmenjivo */

export const preloaderConfig = {
  /** Prvo učitavanje sajta */
  initialDurationMs: 4200,
  /** Prelazak između stranica */
  navigationDurationMs: 2600,

  brand: {
    gamepubLogo: "/logo-transparent.png",
    cokoladniLogo: "/images/cokoladni-aj-ti-logo.png",
    gamepubText: "GAMEPUB",
    shirtText: "Aj Ti",
    /** Tekst koji iskače uz logo pri udaru u blok */
    powerUpLine1: "NAJBOLJI FOTOGRAF",
    powerUpLine2: "ČOKOLADNI",
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
