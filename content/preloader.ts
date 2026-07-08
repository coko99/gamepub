/** Konfiguracija preloadera */

export const preloaderConfig = {
  /** Samo prvo učitavanje u sesiji — navigacija ide odmah */
  showOnNavigation: false,
  sessionKey: "gamepub-preloader-seen",

  minDisplayMs: 350,
  exitFadeMs: 250,

  gamepubLogo: "/logo-transparent.png",
  cokoladniLogo: "/images/cokoladni-aj-ti-logo.png",

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
