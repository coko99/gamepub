import { Hero } from "@/components/Hero";
import { WhyGamepub } from "@/components/WhyGamepub";
import { FacilityStats } from "@/components/FacilityStats";
import { HomeQuickLinks } from "@/components/HomeQuickLinks";
import { ReservationSteps } from "@/components/ReservationSteps";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <WhyGamepub />
      <FacilityStats />
      <HomeQuickLinks />
      <ReservationSteps />
    </main>
  );
}
