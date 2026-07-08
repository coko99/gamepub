export type ReservationChannel = "whatsapp" | "viber";

export type ReservationAnswers = {
  channel: ReservationChannel | null;
  name: string;
  phone: string;
  eventType: string;
  date: string;
  guests: string;
  time: string;
  notes: string;
};

export const reservationBotContent = {
  name: "G-Pub Bot",
  tagline: "Brza rezervacija",
  openLabel: "Otvori G-Pub bota za rezervaciju",
  closeLabel: "Zatvori chat",
  restart: "Počni ispočetka",
  skip: "Preskoči",
  send: "Pošalji",
  typing: "Piše...",
  placeholder: "Upiši odgovor...",
  noPhoneConfigured:
    "Još nismo podesili broj za WhatsApp/Viber na sajtu — pošalji upit preko kontakt forme.",
  viberCopied:
    "Poruka je kopirana! Otvaram Viber — samo je zalepi i pošalji.",
  handoffWhatsapp: "Nastavi na WhatsApp",
  handoffViber: "Nastavi na Viber",
  eventTypes: [
    "Rođendan",
    "Game Night",
    "Privatna proslava",
    "Iznajmljivanje Sony-a",
    "Drugo",
  ] as const,
};

export const initialAnswers = (): ReservationAnswers => ({
  channel: null,
  name: "",
  phone: "",
  eventType: "",
  date: "",
  guests: "",
  time: "",
  notes: "",
});

export type BotStepId =
  | "welcome"
  | "channel"
  | "name"
  | "phone"
  | "eventType"
  | "date"
  | "guests"
  | "time"
  | "notes"
  | "summary";

export type BotStep = {
  id: BotStepId;
  botMessage: string | ((answers: ReservationAnswers) => string);
  field?: keyof ReservationAnswers;
  input?: "text" | "tel" | "date" | "choices" | "none";
  choices?: readonly string[];
  validate?: (value: string) => string | null;
};

export const botSteps: BotStep[] = [
  {
    id: "welcome",
    botMessage:
      "Ćao! 👋 Ja sam G-Pub bot — pomažem ti da brzo rezervišeš termin. Par pitanja i prebacujem te na WhatsApp ili Viber sa svim info.",
    input: "none",
  },
  {
    id: "channel",
    botMessage: "Gde ti više odgovara da nastavimo — WhatsApp ili Viber?",
    field: "channel",
    input: "choices",
    choices: ["WhatsApp", "Viber"],
  },
  {
    id: "name",
    botMessage: "Super! Kako ti je ime?",
    field: "name",
    input: "text",
    validate: (value) =>
      value.trim().length < 2 ? "Upiši bar ime i prezime, molim te." : null,
  },
  {
    id: "phone",
    botMessage: "Na koji broj telefona da te kontaktiramo?",
    field: "phone",
    input: "tel",
    validate: (value) => {
      const digits = value.replace(/\D/g, "");
      if (digits.length < 8) return "Broj izgleda prekratko — proveri ga.";
      return null;
    },
  },
  {
    id: "eventType",
    botMessage: "Šta planiraš kod nas?",
    field: "eventType",
    input: "choices",
    choices: reservationBotContent.eventTypes,
  },
  {
    id: "date",
    botMessage: "Koji datum ti odgovara?",
    field: "date",
    input: "date",
    validate: (value) => (!value ? "Izaberi datum." : null),
  },
  {
    id: "guests",
    botMessage: "Otprilike koliko vas dolazi?",
    field: "guests",
    input: "text",
    validate: (value) =>
      !value.trim() ? "Napiši broj ili okvirno koliko vas ima." : null,
  },
  {
    id: "time",
    botMessage: "Koji termin ti odgovara? (npr. posle 17h, subota popodne...)",
    field: "time",
    input: "text",
    validate: (value) => (!value.trim() ? "Napiši bar okvirno vreme." : null),
  },
  {
    id: "notes",
    botMessage:
      "Ima li još nešto što treba da znamo? (torta, Sony, bilijar...) Ako nema, klikni Preskoči.",
    field: "notes",
    input: "text",
  },
  {
    id: "summary",
    botMessage: (answers) =>
      `Evo rezimea, ${answers.name.split(" ")[0]}:\n\n` +
      `📱 Kanal: ${answers.channel === "whatsapp" ? "WhatsApp" : "Viber"}\n` +
      `🎉 Događaj: ${answers.eventType}\n` +
      `📅 Datum: ${formatDateDisplay(answers.date)}\n` +
      `👥 Gosti: ${answers.guests}\n` +
      `⏰ Termin: ${answers.time}\n` +
      (answers.notes ? `💬 Napomena: ${answers.notes}\n` : "") +
      `\nKlikni dugme ispod i šaljemo upit timu Gamepub-a! 🚀`,
    input: "none",
  },
];

function formatDateDisplay(isoDate: string) {
  if (!isoDate) return "—";
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return isoDate;
  return `${day}.${month}.${year}.`;
}

export function buildReservationMessage(answers: ReservationAnswers) {
  const lines = [
    "Ćao Gamepub! 🎮",
    "",
    "Šaljem upit sa sajta:",
    "",
    `Ime: ${answers.name}`,
    `Telefon: ${answers.phone}`,
    `Događaj: ${answers.eventType}`,
    `Datum: ${formatDateDisplay(answers.date)}`,
    `Broj gostiju: ${answers.guests}`,
    `Termin: ${answers.time}`,
  ];

  if (answers.notes.trim()) {
    lines.push(`Napomena: ${answers.notes.trim()}`);
  }

  return lines.join("\n");
}

export function mapChannelChoice(choice: string): ReservationChannel | null {
  const normalized = choice.toLowerCase();
  if (normalized.includes("whatsapp")) return "whatsapp";
  if (normalized.includes("viber")) return "viber";
  return null;
}
