import Hero from '../components/Hero';
import FeaturedBouquets from '../components/FeaturedBouquets';
import Occasions from '../components/Occasions';
import WhyChooseUs from '../components/WhyChooseUs';
import Testimonials from '../components/Testimonials';

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedBouquets />
      <Occasions />
      <WhyChooseUs />
      <Testimonials />
    </main>
  );
}
