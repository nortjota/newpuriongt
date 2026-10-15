import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";

export default function Home() {
  return (
    <>
      <Header />
      <main id="topo">
        <Hero />
      </main>
      <Footer />
    </>
  );
}
