export type MenuItem = {
  name: string;
  price: number;
};

export type MenuCategory = {
  id: string;
  title: string;
  icon: "coffee" | "soda" | "zap" | "milk" | "droplets" | "citrus" | "beer" | "wine" | "globe" | "home";
  glow: string;
  border: string;
  gradient: string;
  items: MenuItem[];
};

export const menuCategories: MenuCategory[] = [
  {
    id: "toplo",
    title: "Toplo",
    icon: "coffee",
    glow: "rgba(255, 159, 67, 0.45)",
    border: "rgba(255, 159, 67, 0.35)",
    gradient: "from-[#FF9F43] to-[#FF6B35]",
    items: [
      { name: "Espresso", price: 150 },
      { name: "Espresso sa mlekom", price: 170 },
      { name: "Espresso sa šlagom", price: 180 },
      { name: "Dupli espresso", price: 220 },
      { name: "Dupli espresso sa mlekom", price: 230 },
      { name: "Cappuccino", price: 190 },
      { name: "Latte macchiato", price: 220 },
      { name: "Domaća kafa", price: 120 },
      { name: "Domaća kafa sa mlekom", price: 140 },
      { name: "Nescafe", price: 180 },
      { name: "Čaj", price: 200 },
      { name: "Topla čokolada crna / bela", price: 260 },
      { name: "Topla čokolada sa plazmom crna / bela", price: 280 },
    ],
  },
  {
    id: "bezalkoholno",
    title: "Bezalkoholno",
    icon: "soda",
    glow: "rgba(0, 229, 255, 0.4)",
    border: "rgba(0, 229, 255, 0.3)",
    gradient: "from-[#00E5FF] to-[#2F6BFF]",
    items: [
      { name: "Coca Cola 0,25l", price: 250 },
      { name: "Fanta 0,25l", price: 250 },
      { name: "Sprite 0,25l", price: 250 },
      {
        name: "Schweppes 0,25l bitter lemon / tonic water",
        price: 250,
      },
      { name: "Cockta 0,25l", price: 250 },
      { name: "Cockta Blondie", price: 250 },
      {
        name: "Cedevita 0,20l narandža / limun / limeta / zova i limun / grejp / ananas-mango",
        price: 200,
      },
      {
        name: "Nektar sokovi 0,20l jabuka / breskva / jagoda / borovnica / narandža",
        price: 250,
      },
    ],
  },
  {
    id: "energetsko",
    title: "Energetsko",
    icon: "zap",
    glow: "rgba(255, 214, 0, 0.45)",
    border: "rgba(255, 214, 0, 0.35)",
    gradient: "from-[#FFD600] to-[#FF6B35]",
    items: [
      { name: "Guarana 0,25l", price: 240 },
      { name: "Red Bull 0,25l", price: 380 },
    ],
  },
  {
    id: "sejkovi",
    title: "Šejkovi",
    icon: "milk",
    glow: "rgba(255, 43, 214, 0.4)",
    border: "rgba(255, 43, 214, 0.35)",
    gradient: "from-[#FF2BD6] to-[#6C2DFF]",
    items: [
      { name: "Plazma šejk 0,30l", price: 330 },
      { name: "Plazma obrok 0,30l", price: 360 },
    ],
  },
  {
    id: "vode",
    title: "Vode",
    icon: "droplets",
    glow: "rgba(47, 107, 255, 0.45)",
    border: "rgba(47, 107, 255, 0.35)",
    gradient: "from-[#2F6BFF] to-[#00E5FF]",
    items: [
      { name: "Aqua Viva negazirana", price: 160 },
      { name: "Knjaz Miloš gazirana", price: 170 },
    ],
  },
  {
    id: "cedjeno",
    title: "Ceđeno",
    icon: "citrus",
    glow: "rgba(173, 255, 47, 0.35)",
    border: "rgba(173, 255, 47, 0.3)",
    gradient: "from-[#ADFF2F] to-[#FFD600]",
    items: [
      { name: "Limunada 0,30l", price: 250 },
      { name: "Ceđena narandža 0,30l", price: 350 },
      { name: "Ceđena narandža & limun mix 0,30l", price: 380 },
    ],
  },
  {
    id: "piva",
    title: "Piva",
    icon: "beer",
    glow: "rgba(255, 179, 71, 0.45)",
    border: "rgba(255, 179, 71, 0.35)",
    gradient: "from-[#FFB347] to-[#FF9F43]",
    items: [
      { name: "San Miguel 0,25l", price: 400 },
      { name: "Carlsberg 0,25l", price: 290 },
      { name: "Lav Premium 0,33l", price: 260 },
      { name: "Tuborg 0,33l", price: 280 },
      { name: "Tuborg točeno 0,33l", price: 270 },
      { name: "Tuborg točeno 0,5l", price: 350 },
      { name: "Budweiser 0,33l", price: 300 },
      { name: "Kronenbourg 0,33l", price: 300 },
    ],
  },
  {
    id: "vino",
    title: "Vino",
    icon: "wine",
    glow: "rgba(155, 34, 66, 0.45)",
    border: "rgba(155, 34, 66, 0.35)",
    gradient: "from-[#9B2242] to-[#6C2DFF]",
    items: [
      { name: "Rubin Chardonnay 0,187l", price: 320 },
      { name: "Rubin Medveđa krv 0,187l", price: 320 },
      {
        name: "Somersby 0,33l jagoda 0% / borovnica / kruška / mango / jabuka",
        price: 350,
      },
    ],
  },
  {
    id: "strano-alkoholno",
    title: "Strano alkoholno",
    icon: "globe",
    glow: "rgba(108, 45, 255, 0.45)",
    border: "rgba(108, 45, 255, 0.35)",
    gradient: "from-[#6C2DFF] to-[#00E5FF]",
    items: [
      { name: "Ballantines Finest 0,03l", price: 250 },
      { name: "Johnnie Walker 0,03l", price: 280 },
      { name: "Jack Daniels 0,03l", price: 350 },
      { name: "Baileys 0,03l", price: 250 },
      { name: "Campari 0,03l", price: 200 },
      { name: "Jägermeister 0,03l", price: 270 },
      { name: "Martini 0,05l", price: 250 },
      { name: "Beefeater džin 0,03l", price: 280 },
      { name: "Olmeca Tequila 0,03l", price: 260 },
      { name: "Jameson 0,03l", price: 300 },
    ],
  },
  {
    id: "domace-alkoholno",
    title: "Domaće alkoholno",
    icon: "home",
    glow: "rgba(0, 229, 255, 0.35)",
    border: "rgba(0, 229, 255, 0.25)",
    gradient: "from-[#00E5FF] to-[#6C2DFF]",
    items: [
      { name: "Viljamovka Takovo 0,03l", price: 250 },
      { name: "Trivunova dunja 0,03l", price: 260 },
      { name: "Trivunova kajsija 0,03l", price: 260 },
      { name: "Trivunova šljiva 0,03l", price: 260 },
      { name: "Vinjak 0,03l", price: 200 },
      { name: "Stomaklija 0,03l", price: 150 },
      { name: "Gorki list 0,03l", price: 230 },
      { name: "Meduška 0,03l", price: 220 },
      { name: "Dunja Milinčić 0,03l", price: 250 },
      { name: "Loza 13. Jul 0,03l", price: 220 },
      { name: "Smirnoff Vodka 0,03l", price: 250 },
    ],
  },
];

export const menuPageContent = {
  title: "GAMEPUB CENOVNIK",
  subtitle: "Meni pića — pretraži artikal ili skroluj po kategorijama",
  searchLabel: "Pretraga cenovnika",
  searchPlaceholder: "Pretraži npr. espresso, tuborg, pivo...",
  searchHint: "Radi i bez š/č/ć — npr. „cedjena“ nađe „Ceđena narandža“",
  resultsLabel: "rezultata",
  clearSearch: "Obriši pretragu",
  noResults: "Nema rezultata za",
  quickSearch: ["Espresso", "Tuborg", "Red Bull", "Pivo", "Čaj"],
  priceSuffix: "din",
};
