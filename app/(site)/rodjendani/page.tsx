import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { pageIntros } from "@/content/pages";
import { Birthdays } from "@/components/Birthdays";

export const metadata: Metadata = {
  title: "Rođendani | Gamepub Kruševac",
  description:
    "Gaming rođendani u Gamepub Kruševcu — 350 m², Sony, bilijar, pikado i nezaboravna proslava za decu i tinejdžere.",
};

export default function RodjendaniPage() {
  const intro = pageIntros.rodjendani;

  return (
    <main>
      <PageIntro tag={intro.tag} title={intro.title} description={intro.description} />
      <Birthdays compactIntro />
    </main>
  );
}
