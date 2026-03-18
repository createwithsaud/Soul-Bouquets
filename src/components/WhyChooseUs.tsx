import { motion } from 'motion/react';
import { Leaf, Truck, Heart } from 'lucide-react';

export default function WhyChooseUs() {
  const features = [
    {
      icon: <Leaf className="w-8 h-8 text-accent" />,
      title: "Fresh Flowers",
      description: "Sourced directly from sustainable farms to ensure maximum freshness and longevity."
    },
    {
      icon: <Truck className="w-8 h-8 text-accent" />,
      title: "Same Day Delivery",
      description: "Order by 2 PM for reliable same-day delivery across the city, handled with care."
    },
    {
      icon: <Heart className="w-8 h-8 text-accent" />,
      title: "Handcrafted Bouquets",
      description: "Each arrangement is uniquely designed by our expert florists with love and attention."
    }
  ];

  return (
    <section className="py-24 bg-accent-light/10 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-bg-secondary/40 via-transparent to-accent-light/20 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-serif text-text-primary"
          >
            Why Choose <span className="italic text-accent">Soul Bouquets</span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="flex flex-col items-center text-center p-6"
            >
              <div className="w-16 h-16 rounded-full bg-bg-primary shadow-sm flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="font-serif text-xl text-text-primary mb-3">{feature.title}</h3>
              <p className="text-text-secondary font-light leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
