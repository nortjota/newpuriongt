import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import QuickBuy from "@/components/sections/QuickBuy";
import Clientes from "@/components/sections/Clientes";
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
import StickyBuyBar from "@/components/widgets/StickyBuyBar";
import TaglineMarquee from "@/components/widgets/TaglineMarquee";
import RoadDivider from "@/components/ui/RoadDivider";

const MARQUEE_ITEMS = ["Exala presença", "Deixa memória", "Luxo em cada detalhe", "A diferença que você pode cheirar"];

export default function Home() {
  return (
    <>
      <Header />
      <main id="topo">
        <Hero />
        <div className="py-6.5">
          <TaglineMarquee items={MARQUEE_ITEMS} />
        </div>
        <QuickBuy />
        <Clientes />
        <FragrancePyramid />
        <VideoGallery />
        <RoadDivider />
        <Benefits />
        <RoadDivider flip />
        <Comparativo />
        <Reviews />
        <Historia />
        <Quiz />
        <SprayJourney />
        <Manifesto />
        <Offer />
        <Guarantee />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <StickyBuyBar />
    </>
  );
}
