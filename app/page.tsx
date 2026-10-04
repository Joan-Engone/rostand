import Header from "@/components/Header";
import Experience from "@/components/Experience";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Formations from "@/components/Formations";
import Method from "@/components/Method";
import Why from "@/components/Why";
import Pricing from "@/components/Pricing";
import Faq from "@/components/Faq";
import Booking from "@/components/Booking";
import Footer from "@/components/Footer";
import { marqueeItems } from "@/data/content";

export default function Home() {
  return (
    <>
      <Header />
      <Experience />

      <main className="relative z-10">
        <Hero />
        <Marquee items={marqueeItems} />
        <About />
        <Formations />
        <Method />
        <Why />
        <Pricing />
        <Faq />
        <Booking />
      </main>

      <Footer />
    </>
  );
}