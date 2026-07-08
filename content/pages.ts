/** Rute i intro tekstovi po stranicama */

export const pageRoutes = {
  home: "/",
  rodjendani: "/rodjendani",
  aktivnosti: "/aktivnosti",
  ponuda: "/ponuda",
  galerija: "/galerija",
  cenovnik: "/cenovnik",
  faq: "/faq",
  kontakt: "/kontakt",
} as const;

export const homeQuickLinksContent = {
  title: "Izaberi svoj level",
  subtitle: "Svaka zona Gamepub-a ima svoju stranu — uđi u ono što te zanima.",
  links: [
    {
      title: "Rođendani",
      description: "Gaming proslave koje ekipa pamti mesecima.",
      href: pageRoutes.rodjendani,
      tag: "Birthday Arena",
      accent: "pink" as const,
    },
    {
      title: "Aktivnosti",
      description: "Sony, bilijar, pikado i game night energija.",
      href: pageRoutes.aktivnosti,
      tag: "Play",
      accent: "cyan" as const,
    },
    {
      title: "Ponuda",
      description: "Paketi za rođendane, game night i privatne termine.",
      href: pageRoutes.ponuda,
      tag: "Packages",
      accent: "purple" as const,
    },
    {
      title: "Galerija",
      description: "Neon, gaming i prostor u punom sjaju.",
      href: pageRoutes.galerija,
      tag: "Gallery",
      accent: "cyan" as const,
    },
    {
      title: "Cenovnik",
      description: "Pića, kategorije i brza pretraga.",
      href: pageRoutes.cenovnik,
      tag: "Menu",
      accent: "purple" as const,
    },
    {
      title: "Kontakt",
      description: "Rezerviši termin i okupi ekipu.",
      href: pageRoutes.kontakt,
      tag: "Join",
      accent: "pink" as const,
    },
  ],
};

export const pageIntros = {
  rodjendani: {
    tag: "Rođendani",
    title: "Rođendan koji ekipa neće zaboraviti",
    description:
      "350 m², Sony, bilijar, pikado i energija koja traje celo veče — sve za nezaboravnu proslavu u Kruševcu.",
  },
  aktivnosti: {
    tag: "Aktivnosti",
    title: "Izaberi svoju igru",
    description:
      "Od PlayStation zone do bilijara i pikada — Gamepub je arena gde svako nalazi svoj revanš.",
  },
  ponuda: {
    tag: "Ponuda",
    title: "Paketi / Ponuda",
    description:
      "Birthday Game, Game Night, Private Arena ili Sony rental — izaberi format koji odgovara tvojoj ekipi.",
  },
  galerija: {
    tag: "Galerija",
    title: "Uđi u Gamepub",
    description: "Neon, gaming, bilijar, pikado i prostor koji diše energijom.",
  },
  faq: {
    tag: "FAQ",
    title: "Česta pitanja",
    description: "Sve što treba da znaš pre rezervacije — brzo i jasno.",
  },
  kontakt: {
    tag: "Kontakt",
    title: "Spremni za sledeći level?",
    description:
      "Pošalji poruku, proveri termine i rezerviši Gamepub za rođendan ili game night.",
  },
  cenovnik: {
    tag: "Cenovnik",
    title: "Cenovnik pića",
    description: "Pregledaj kategorije, pretraži artikle i pronađi omiljeno piće.",
  },
} as const;
