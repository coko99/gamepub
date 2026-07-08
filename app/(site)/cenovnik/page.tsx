import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { pageIntros } from "@/content/pages";
import { MenuPage } from "@/components/menu/MenuPage";

export const metadata: Metadata = {
  title: "Cenovnik | Gamepub Kruševac",
  description:
    "Gamepub cenovnik pića — topli napitci, bezalkoholna pića, piva, vina, domaće i strano alkoholno. Pogledaj cene i pronađi artikal po kategoriji.",
  openGraph: {
    title: "Cenovnik | Gamepub Kruševac",
    description:
      "Kompletan cenovnik pića u Gamepub-u — kategorije, pretraga i neon meni.",
    locale: "sr_RS",
    type: "website",
  },
};

export default function CenovnikPage() {
  const intro = pageIntros.cenovnik;

  return (
    <main>
      <PageIntro tag={intro.tag} title={intro.title} description={intro.description} />
      <MenuPage embedded />
    </main>
  );
}
