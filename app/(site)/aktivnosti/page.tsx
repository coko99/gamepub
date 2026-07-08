import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { pageIntros } from "@/content/pages";
import { Activities } from "@/components/Activities";
import { GameNight } from "@/components/GameNight";

export const metadata: Metadata = {
  title: "Aktivnosti | Gamepub Kruševac",
  description:
    "Sony / PlayStation, bilijar, pikado i game night u Gamepub Kruševcu — izaberi aktivnost za celu ekipu.",
};

export default function AktivnostiPage() {
  const intro = pageIntros.aktivnosti;

  return (
    <main>
      <PageIntro tag={intro.tag} title={intro.title} description={intro.description} />
      <Activities compactIntro />
      <GameNight />
    </main>
  );
}
