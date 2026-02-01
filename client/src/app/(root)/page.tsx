//client/src/app/(root)/page.tsx
import Navbar from "../../../components/Navbar";
import Hero from "../../../components/Hero";
import Features from "../../../components/Features";
// import Stats from "../../../components/Stats";
import WhyUs from "../../../components/WhyUs";
import CTA from "../../../components/CTA";
import Footer from "../../../components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <WhyUs />
      <CTA />
      <Footer />
    </main>
  );
}
