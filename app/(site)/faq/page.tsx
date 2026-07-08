import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { pageIntros } from "@/content/pages";
import { FAQ } from "@/components/FAQ";

export const metadata: Metadata = {
  title: "FAQ | Gamepub Kruševac",
  description:
    "Česta pitanja o Gamepub rođendanima, aktivnostima, rezervaciji i iznajmljivanju Sony opreme.",
};

export default function FaqPage() {
  const intro = pageIntros.faq;

  return (
    <main>
      <PageIntro tag={intro.tag} title={intro.title} description={intro.description} />
      <FAQ compactIntro />
    </main>
  );
}
