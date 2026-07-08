import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { pageIntros } from "@/content/pages";
import { Packages } from "@/components/Packages";

export const metadata: Metadata = {
  title: "Ponuda | Gamepub Kruševac",
  description:
    "Gamepub paketi — Birthday Game, Game Night, Private Arena i Sony rental. Pitaj za cenu i termin.",
};

export default function PonudaPage() {
  const intro = pageIntros.ponuda;

  return (
    <main>
      <PageIntro tag={intro.tag} title={intro.title} description={intro.description} />
      <Packages compactIntro />
    </main>
  );
}
