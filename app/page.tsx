/*import CategoryGrid from "./components/home/CategoryGrid";
import DualCTA from "./components/home/DualCTA";
import FeaturedProducts from "./components/home/FeaturedProducts";
import HeroSection from "./components/home/HeroSection";
import NewsUpdates from "./components/home/NewsUpdates";
import Testimonials from "./components/home/Testimonials";
import TrustBadges from "./components/home/TrustBadges";
import Footer from "./components/layout/Footer";
import Navigation from "./components/layout/Navigation";


export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <TrustBadges />
        <CategoryGrid />
        <FeaturedProducts />
        <DualCTA />
        <Testimonials />
        <NewsUpdates />
      </main>
      <Footer />
    </>
  )
}*/

import HeroSection from "./components/home/HeroSection";
import TrustBadges from "./components/home/TrustBadges";
import CategoryGrid from "./components/home/CategoryGrid";
import FeaturedProducts from "./components/home/FeaturedProducts";
import DualCTA from "./components/home/DualCTA";
import Testimonials from "./components/home/Testimonials";
import NewsUpdates from "./components/home/NewsUpdates";

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustBadges />
      <CategoryGrid />
      <FeaturedProducts />
      <DualCTA />
      <Testimonials />
      <NewsUpdates />
    </>
  );
}