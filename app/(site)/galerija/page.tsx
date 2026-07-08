import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { pageIntros } from "@/content/pages";
import { GalleryShowcase } from "@/components/GalleryShowcase";
import { Gallery } from "@/components/Gallery";

export const metadata: Metadata = {
  title: "Galerija | Gamepub Kruševac",
  description:
    "Pogledaj Gamepub prostor — neon gaming zona, bilijar, pikado i PlayStation stanice u Kruševcu.",
};

export default function GalerijaPage() {
  const intro = pageIntros.galerija;

  return (
    <main>
      <PageIntro tag={intro.tag} title={intro.title} description={intro.description} />
      <GalleryShowcase compactIntro />
      <Gallery />
    </main>
  );
}
