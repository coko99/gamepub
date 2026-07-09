import dynamic from "next/dynamic";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const FloatingActions = dynamic(
  () =>
    import("@/components/FloatingActions").then((mod) => ({
      default: mod.FloatingActions,
    })),
);

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <FloatingActions />
    </>
  );
}
