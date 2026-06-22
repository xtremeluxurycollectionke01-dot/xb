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

/*import HeroSection from "./components/home/HeroSection";
import TrustBadges from "./components/home/TrustBadges";
import CategoryGrid from "./components/home/CategoryGrid";
import FeaturedProducts from "./components/home/FeaturedProducts";
import DualCTA from "./components/home/DualCTA";
import Testimonials from "./components/home/Testimonials";
import NewsUpdates from "./components/home/NewsUpdates";
import { ItemsDisplay } from "./components/ItemDisplay";

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustBadges />
      <ItemsDisplay limit={6} showViewAll={true} />
      <CategoryGrid />
      <FeaturedProducts />
      <DualCTA />
      <Testimonials />
      <NewsUpdates />
    </>
  );
}*/

import HeroSection from "./components/home/HeroSection";
import TrustBadges from "./components/home/TrustBadges";
import { ItemsDisplay } from "./components/ItemDisplay";

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustBadges />
      
      {/* Items Display Section */}
      <section className="container-custom section-padding">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark-text)] dark:text-[var(--light-text)]">
            Our Collection
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Browse through our curated items
          </p>
        </div>
        <ItemsDisplay limit={24} showViewAll={true} />
      </section>
    </>
  );
}