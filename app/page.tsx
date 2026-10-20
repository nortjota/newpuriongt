import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import QuickBuy from "@/components/sections/QuickBuy";
import Manifesto from "@/components/sections/Manifesto";
import Benefits from "@/components/sections/Benefits";
import SprayJourney from "@/components/sections/SprayJourney";
import FragrancePyramid from "@/components/sections/FragrancePyramid";
import Comparativo from "@/components/sections/Comparativo";
import Quiz from "@/components/sections/Quiz";
import Historia from "@/components/sections/Historia";
import VideoGallery from "@/components/sections/VideoGallery";
import Reviews from "@/components/sections/Reviews";
import Offer from "@/components/sections/Offer";
import Guarantee from "@/components/sections/Guarantee";
import Faq from "@/components/sections/Faq";
import FinalCta from "@/components/sections/FinalCta";
import PartnerCta from "@/components/sections/PartnerCta";
import Marquee from "@/components/ui/Marquee";
import StickyBuyBar from "@/components/widgets/StickyBuyBar";

const MARQUEE_ITEMS = ["Exala presença", "Deixa memória", "Luxo em cada detalhe", "A diferença que você pode cheirar"];

export default function Home() {
  return (
    <>
      <Header />
      <main id="topo">
        <Hero />
        <div className="py-6.5">
          <Marquee
            items={MARQUEE_ITEMS}
            itemClassName="whitespace-nowrap font-mono text-sm"
            renderItem={(item, i) => <span key={i}>{item}</span>}
          />
        </div>
        <QuickBuy />
        <FragrancePyramid />
        <VideoGallery />
        <Benefits />
        <SprayJourney />
        <Comparativo />
        <Manifesto />
        <Quiz />
        <Historia />
        <Reviews />
        <Offer />
        <Guarantee />
        <Faq />
        <FinalCta />
        <PartnerCta />
      </main>
      <Footer />
      <StickyBuyBar />
    </>
  );
}
