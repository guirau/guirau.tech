import { SiteNav } from "@/components/nav/SiteNav";
import { Hero } from "@/components/hero/Hero";
import { CredentialStrip } from "@/components/credentials/CredentialStrip";
import { ProofZone } from "@/components/proof/ProofZone";
import { ServicesLadder } from "@/components/services/ServicesLadder";
import { Process } from "@/components/process/Process";
import { About } from "@/components/about/About";
import { FinalCta } from "@/components/cta/FinalCta";
import { SiteFooter } from "@/components/footer/SiteFooter";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <CredentialStrip />
        <ProofZone />
        <ServicesLadder />
        <Process />
        <About />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
