import type { Metadata } from "next";
import { Inter, Space_Grotesk, Orbitron } from "next/font/google";
import "./globals.css";
import { seoKeywords } from "@/content/site";
import { ClientProviders } from "@/components/ClientProviders";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700"],
  preload: false,
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["600", "700"],
  preload: false,
});

export const metadata: Metadata = {
  title: "Gamepub Kruševac | Gaming rođendani, Sony, bilijar i pikado",
  description:
    "Gamepub Kruševac je moderno mesto za gaming rođendane, game night druženja, Sony / PlayStation, bilijar, pikado i privatne proslave. Rezerviši termin i okupi ekipu.",
  keywords: seoKeywords,
  openGraph: {
    title: "Gamepub Kruševac | Gaming rođendani, Sony, bilijar i pikado",
    description:
      "Gamepub Kruševac je moderno mesto za gaming rođendane, game night druženja, Sony / PlayStation, bilijar, pikado i privatne proslave.",
    locale: "sr_RS",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sr"
      className={`${inter.variable} ${spaceGrotesk.variable} ${orbitron.variable} scroll-smooth`}
    >
      <body className="min-h-screen antialiased">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
