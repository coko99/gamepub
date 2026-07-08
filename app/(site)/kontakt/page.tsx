import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { pageIntros } from "@/content/pages";
import { Contact } from "@/components/Contact";
import { Location } from "@/components/Location";
import { ReservationSteps } from "@/components/ReservationSteps";

export const metadata: Metadata = {
  title: "Kontakt | Gamepub Kruševac",
  description:
    "Kontaktiraj Gamepub Kruševac — rezerviši rođendan, game night ili privatni termin. Topličina 13.",
};

export default function KontaktPage() {
  const intro = pageIntros.kontakt;

  return (
    <main>
      <PageIntro tag={intro.tag} title={intro.title} description={intro.description} />
      <ReservationSteps />
      <Contact />
      <Location />
    </main>
  );
}
