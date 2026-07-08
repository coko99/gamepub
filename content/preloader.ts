/** Konfiguracija retro gaming preloadera — lako izmenjivo */

export const preloaderConfig = {
  /** Samo prvo ucitavanje — navigacija ide odmah */
  showOnNavigation: false,

  /** Koliko udaraca u blok pre nego sto se sajt pusti */
  requiredBlockHits: 1,

  firstJumpDelayMs: 320,
  textDisplayMs: 850,
  textDisplayMsMobile: 650,
  exitFadeMs: 260,

  brand: {
    gamepubLogo: "/logo-transparent.png",
    cokoladniLogo: "/images/cokoladni-aj-ti-logo.png",
    gamepubText: "GAMEPUB",
    shirtText: "Aj Ti",
    /** Rotirajući tekstovi pri udaru glavom u blok */
    cokoladniShoutouts: [
      { line1: "NAJBOLJI FOTOGRAF", line2: "ČOKOLADNI" },
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
