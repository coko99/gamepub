/** Konfiguracija preloadera */

export const preloaderConfig = {
  /** Samo prvo učitavanje — navigacija ide odmah */
  showOnNavigation: false,

  minDisplayMs: 600,
  exitFadeMs: 350,

  gamepubLogo: "/logo-transparent.png",
  cokoladniLogo: "/images/cokoladni-aj-ti-logo.png",

  /** Rotirajući tekstovi dok se učitava */
  loadingTexts: [
    "Nameštamo kugle...",
    "Palimo PES...",
    "Igramo Sony...",
    "Gađamo pikado...",
    "Bilijar traži centar...",
    "Ubaci novčić...",
    "Još jedna partija...",
    "Ekipa ulazi u igru...",
  ],

  loadingTextIntervalMs: 900,
} as const;

export type PreloaderMode = "initial" | "navigation";
