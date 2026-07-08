export const siteConfig = {
  name: "Gamepub",
  location: "Topličina 13, Kruševac",
  address: "Topličina 13, Kruševac",
  phone: "065 20 33 546",
  /** Broj za poziv/Viber/WhatsApp — samo cifre, npr. 381652033546 */
  phoneDigits: "381652033546",
  instagram: "@gamepub_037",
  instagramUrl: "https://www.instagram.com/gamepub_037/",
  email: "info@gamepub.rs",
  mapLink: "https://maps.app.goo.gl/se74nrcPE25pxbTh8",
  mapEmbed:
    "https://maps.google.com/maps?q=43.5784449,21.3271414&hl=sr&z=17&output=embed",
  mapCoords: {
    lat: 43.5784449,
    lng: 21.3271414,
  },
  /** Zameni share.google linkom iz Google Business profila ako imaš tačniji */
  googleReview:
    "https://www.google.com/maps/place/GAME+PUB/@43.5784449,21.3271414,17z/data=!4m8!3m7!1s0x475687b8fe342675:0x3572a757cc46285e!8m2!3d43.5784449!4d21.3271414!9m1!1b1!16s%2Fg%2F11rzkzmybs?entry=ttu",
  googleRating: "4.6",
  googleReviewCount: "55+",
};

export function getContactLinks() {
  const digits = siteConfig.phoneDigits.replace(/\D/g, "");

  if (!digits) {
    return {
      tel: "/kontakt",
      viber: "/kontakt",
      whatsapp: "/kontakt",
    };
  }

  return {
    tel: `tel:+${digits}`,
    viber: `viber://chat?number=%2B${digits}`,
    whatsapp: `https://wa.me/${digits}`,
  };
}

export const floatingContact = {
  mainLabel: "Ćaskanje",
  bot: "G-Pub Bot",
  call: "Poziv",
  viber: "Viber",
  whatsapp: "WhatsApp",
};

export const navLinks = [
  { label: "Početna", href: "/" },
  { label: "Rođendani", href: "/rodjendani" },
  { label: "Aktivnosti", href: "/aktivnosti" },
  { label: "Galerija", href: "/galerija" },
  { label: "Cenovnik", href: "/cenovnik" },
  { label: "FAQ", href: "/faq" },
  { label: "Kontakt", href: "/kontakt" },
];

export const heroContent = {
  title: "Gaming rođendani u Kruševcu",
  subtitle:
    "99+ Sony igrica, 10+ konzola, 5 stolova bilijara i 2 pikada — sve za rođendan, game night ili druženje koje se pamti.",
  ctaPrimary: "Rezerviši termin",
  ctaSecondary: "Pogledaj ponudu",
  floatingCards: ["Game Night", "Birthday Arena"],
};

export const facilityStatsContent = {
  title: "Brojevi koji govore",
  subtitle: "Sve što ti treba za pravi gaming rođendan — na jednom mestu u Kruševcu.",
};

export const facilityStats = [
  {
    value: "350",
    suffix: "m²",
    label: "igraonice",
    icon: "space" as const,
    glow: "#6C2DFF",
    gradient: "from-[#6C2DFF] to-[#00E5FF]",
  },
  {
    value: "99+",
    label: "igrica za Sony",
    icon: "gamepad" as const,
    glow: "#00E5FF",
    gradient: "from-[#00E5FF] to-[#2F6BFF]",
  },
  {
    value: "10+",
    label: "Sony konzola",
    icon: "sony" as const,
    glow: "#2F6BFF",
    gradient: "from-[#2F6BFF] to-[#6C2DFF]",
  },
  {
    value: "5",
    label: "stolova bilijara",
    icon: "billiard" as const,
    glow: "#FF2BD6",
    gradient: "from-[#FF2BD6] to-[#6C2DFF]",
  },
  {
    value: "2",
    label: "pikada",
    icon: "dart" as const,
    glow: "#FF2BD6",
    gradient: "from-[#FF2BD6] to-[#00E5FF]",
  },
  {
    value: "✓",
    label: "dobra ventilacija",
    icon: "wind" as const,
    glow: "#00E5FF",
    gradient: "from-[#00E5FF] to-[#6C2DFF]",
  },
];

export const sonyRentalContent = {
  title: "Iznajmljivanje Sony-a na dan",
  description:
    "Treba ti PlayStation za rođendan kod kuće, druženje ili poseban događaj? Iznajmi Sony opremu na dan i okupi ekipu gde god želiš.",
  features: [
    "Iznajmljivanje na dan",
    "Idealno za rođendane i privatne proslave",
    "Dogovor oko opreme i termina",
    "Pitaj za cenu i dostupnost",
  ],
  cta: "Pitaj za iznajmljivanje",
};

export const whyContent = {
  title: "Nije obična igraonica. Ovo je Gamepub.",
  description:
    "Gamepub je mesto gde se rođendani ne svode samo na tortu i slikanje. U 350 m² moderne igraonice sa dobrom ventilacijom se igra, navija, pobeđuje, traži revanš i uvek pita za još sat vremena duže.",
  cards: [
    {
      title: "Rođendani koji se pamte",
      description:
        "Moderna proslava sa igrom, takmičenjem i energijom koja se pamti mesecima.",
      icon: "cake" as const,
    },
    {
      title: "Sony / PlayStation gaming",
      description:
        "99+ igrica, 10+ Sony konzola i gaming atmosfera za celu ekipu — od prve do poslednje runde.",
      icon: "gamepad" as const,
    },
    {
      title: "Bilijar i pikado",
      description:
        "5 stola bilijara i 2 pikada — revanši, preciznost i druženje za celu ekipu.",
      icon: "target" as const,
    },
    {
      title: "Prostor za ekipu",
      description:
        "350 m² igraonice sa dobrom ventilacijom — dovoljno mesta za ekipu, igru i proslavu bez gužve.",
      icon: "users" as const,
    },
  ],
};

export const birthdaysContent = {
  title: "Rođendan koji ekipa neće zaboraviti",
  description:
    "U Gamepub-u slavljenik i ekipa imaju 350 m² prostora za igru, druženje i takmičenje. Sony se pali, bilijar se ne prekida, pikado traži revanš, a dobra ventilacija drži energiju visokom celo veče.",
  highlights: [
    "350 m² moderne igraonice",
    "Dobra ventilacija tokom celog termina",
    "99+ igrica i 10+ Sony konzola",
    "5 stolova bilijara i 2 pikada",
    "Mogućnost iznajmljivanja Sony-a na dan",
  ],
  cta: "Pitaj za slobodne termine",
  image: "/images/gallery/sony-stanice.jpg",
  imageAlt: "Sony PlayStation stanice u Gamepub Kruševac",
};

export const siteMedia = {
  heroBackground: "/images/hero-bg.jpg",
  gameNightBackground: "/images/gallery/sony-neon.jpg",
};

export const galleryShowcaseContent = {
  title: "Uđi u Gamepub",
  description: "Neon, gaming, bilijar, pikado i prostor koji diše energijom.",
};

export const galleryImages = [
  { src: "/images/gallery/gamepub-prostor.jpg", alt: "Gamepub prostor Kruševac", category: "igraonica" },
  { src: "/images/gallery/bilijar-hala.jpg", alt: "Bilijar sala Gamepub", category: "bilijar" },
  { src: "/images/gallery/sony-neon.jpg", alt: "Sony neon gaming zona", category: "Sony" },
  { src: "/images/gallery/sony-stanice.jpg", alt: "PlayStation stanice", category: "PlayStation" },
  { src: "/images/gallery/sony-red.jpg", alt: "Sony gaming lounge", category: "gaming" },
  { src: "/images/gallery/bilijar-close.jpg", alt: "Bilijar partija", category: "bilijar" },
  { src: "/images/gallery/pikado.jpg", alt: "Pikado Gamepub", category: "pikado" },
  { src: "/images/gallery/ventilacija-neon.jpg", alt: "Neon prostor i ventilacija", category: "neon" },
];

export const activitiesContent = {
  title: "Izaberi svoju igru",
  cards: [
    {
      title: "Sony / PlayStation",
      stat: "99+ igrica · 10+ Sony",
      description:
        "Ogromna biblioteka igrica, više konzola i gaming atmosfera za celu ekipu — partije, turniri i izazovi.",
      accent: "cyan" as const,
      icon: "gamepad" as const,
      image: "/images/gallery/sony-red.jpg",
    },
    {
      title: "Bilijar",
      stat: "5 stolova",
      description:
        "Pet bilijarskih stolova spremnih za revanš. Jedan udarac može da odluči pobednika — idealno za druženje.",
      accent: "purple" as const,
      icon: "circle" as const,
      image: "/images/gallery/bilijar-close.jpg",
    },
    {
      title: "Pikado",
      stat: "2 pikada",
      description:
        "Dva pikada za preciznost, izazov i još jedan razlog da ekipa ostane duže.",
      accent: "pink" as const,
      icon: "target" as const,
      image: "/images/gallery/pikado.jpg",
    },
  ],
};

export const gameNightContent = {
  title: "Kad se ekipa okupi, igra počinje",
  description:
    "Bilo da slavite rođendan, pravite privatno druženje ili samo želite veče bez dosade, Gamepub je mesto gde svaka partija postaje priča.",
  neonText: "ONE MORE GAME?",
  subtext: "U Gamepub-u se uvek traži još jedna partija.",
  cta: "Rezerviši game night",
};

export const packagesContent = {
  title: "Paketi / Ponuda",
  subtitle: "Izaberi format koji odgovara tvojoj ekipi",
  packages: [
    {
      name: "Birthday Game",
      tagline: "Za rođendane i proslave",
      description:
        "Kompletan gaming rođendan sa Sony, bilijarom i pikadom — sve na jednom mestu.",
      features: [
        "Rezervisan prostor za ekipu",
        "99+ igrica · 10+ Sony konzola",
        "5 stolova bilijara · 2 pikada",
        "Idealno za decu i tinejdžere",
      ],
      cta: "Pitaj za cenu / termin",
    },
    {
      name: "Game Night",
      tagline: "Za ekipe i druženja",
      description:
        "Veče druženja, takmičenja i igara — bez obaveza, samo dobra energija.",
      features: [
        "Fleksibilan termin",
        "Sony, bilijar i pikado",
        "5 bilijarskih stola · 2 pikada",
        "Savršeno za prijatelje i timove",
      ],
      cta: "Pitaj za cenu / termin",
      featured: true,
    },
    {
      name: "Private Arena",
      tagline: "Za privatne proslave i posebne termine",
      description:
        "Ekskluzivan termin samo za vašu ekipu — rođendan, team building ili posebna proslava.",
      features: [
        "Privatni prostor",
        "Prilagođen program",
        "Sve aktivnosti dostupne",
        "Poseban dogovor za termin",
      ],
      cta: "Pitaj za cenu / termin",
    },
    {
      name: "Sony Rental",
      tagline: "Iznajmljivanje na dan",
      description:
        "Iznajmi Sony opremu na dan za rođendan, druženje ili proslavu van Gamepub-a.",
      features: [
        "Iznajmljivanje Sony-a na dan",
        "99+ dostupnih igrica",
        "Dogovor oko opreme i termina",
        "Pitaj za cenu i dostupnost",
      ],
      cta: "Pitaj za iznajmljivanje",
    },
  ],
};

export const reservationSteps = {
  title: "Rezervacija u 3 koraka",
  steps: [
    { number: 1, title: "Pošalji poruku", description: "Javi se putem forme, telefona ili Instagrama." },
    { number: 2, title: "Izaberi termin", description: "Proverimo slobodne termine i dogovorimo detalje." },
    { number: 3, title: "Okupi ekipu i uđi u igru", description: "Dođi sa ekipom i kreni u gaming iskustvo." },
  ],
};

export const faqItems = [
  {
    question: "Da li organizujete rođendane?",
    answer:
      "Da, Gamepub je odličan izbor za dečije i tinejdžerske rođendane u Kruševcu.",
  },
  {
    question: "Za koji uzrast je Gamepub?",
    answer:
      "Gamepub je posebno zanimljiv deci, tinejdžerima i mladima koji vole gaming, bilijar, pikado i druženje.",
  },
  {
    question: "Šta sve može da se koristi?",
    answer:
      "U Gamepub-u su dostupni Sony / PlayStation sa 99+ igrica i 10+ konzola, 5 stolova bilijara i 2 pikada, u zavisnosti od dogovorenog termina i ponude.",
  },
  {
    question: "Da li mogu da iznajmim Sony na dan?",
    answer:
      "Da, postoji opcija iznajmljivanja Sony opreme na dan. Pošalji poruku ili pozovi da proverimo dostupnost, opremu i cenu.",
  },
  {
    question: "Kako se rezerviše termin?",
    answer:
      "Termin se rezerviše slanjem poruke ili pozivom. Potrebno je proveriti slobodne termine i dogovoriti detalje.",
  },
  {
    question: "Koliki je prostor u Gamepub-u?",
    answer:
      "Gamepub ima 350 m² igraonice sa dobrom ventilacijom — dovoljno prostora za Sony gaming, bilijar, pikado i veće grupe na rođendanu ili game night-u.",
  },
  {
    question: "Da li je pogodno za tinejdžerski rođendan?",
    answer:
      "Da, Gamepub je odličan izbor za tinejdžere koji žele nešto modernije od klasične igraonice.",
  },
];

export const locationContent = {
  title: "Pronađi nas",
  description: "Gamepub je u srcu Kruševca — lako dolaziš, lako okupljaš ekipu.",
  openMaps: "Otvori u Google Maps",
  leaveReview: "Ostavi recenziju",
  reviewsTitle: "Google recenzije",
  reviewsDescription: "Pogledaj iskustva drugih ili ostavi svoju recenziju.",
};

export const contactContent = {
  title: "Spremni za sledeći level?",
  description:
    "Pošalji poruku, proveri slobodne termine i rezerviši Gamepub za rođendan, game night ili privatno druženje.",
  form: {
    name: "Ime",
    phone: "Telefon",
    eventType: "Tip događaja",
    date: "Datum",
    message: "Poruka",
    submit: "Pošalji upit",
    eventTypes: ["Rođendan", "Game Night", "Privatna proslava", "Iznajmljivanje Sony-a", "Drugo"],
  },
  cards: {
    phone: "Telefon",
    instagram: "Instagram",
    location: "Lokacija",
  },
  ctaMessage: "Pošalji poruku",
  ctaCall: "Pozovi",
};

export const footerContent = {
  description:
    "Gaming rođendani, druženja i game night iskustvo u Kruševcu.",
  tagline: "Sony · Bilijar · Pikado · 350 m²",
  links: [
    { label: "Početna", href: "/" },
    { label: "Rođendani", href: "/rodjendani" },
    { label: "Aktivnosti", href: "/aktivnosti" },
    { label: "Ponuda", href: "/ponuda" },
    { label: "Galerija", href: "/galerija" },
    { label: "Cenovnik", href: "/cenovnik" },
    { label: "FAQ", href: "/faq" },
    { label: "Kontakt", href: "/kontakt" },
  ],
  social: {
    instagram: "Prati nas",
    maps: "Google Maps",
    review: "Recenzije",
  },
  copyright: "© Gamepub Kruševac. All rights reserved.",
  poweredBy: {
    label: "powered by:",
    name: "čokoladni aj ti",
    url: "https://cokoladni.photo",
    logo: "/images/cokoladni-aj-ti-logo.png",
  },
};

export const seoKeywords = [
  "rođendani Kruševac",
  "gaming rođendani Kruševac",
  "dečiji rođendani Kruševac",
  "tinejdžerski rođendani Kruševac",
  "PlayStation Kruševac",
  "bilijar Kruševac",
  "pikado Kruševac",
  "privatne proslave Kruševac",
];
