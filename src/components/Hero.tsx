import { motion } from 'motion/react';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-gradient-to-br from-bg-secondary via-bg-primary to-accent-light/30">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-accent-light/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid md:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-lg"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-accent-light/30 text-accent text-sm font-medium mb-6 tracking-wide">
            Premium Floral Design
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-text-primary leading-[1.1] mb-6">
            Send Love <br />
            <span className="italic text-accent">Through Flowers</span>
          </h1>
          <p className="text-lg text-text-secondary mb-10 font-light leading-relaxed">
            Handcrafted bouquets for every special moment. We source the freshest blooms to create unforgettable arrangements.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button className="px-8 py-4 bg-text-primary text-bg-primary rounded-full font-medium hover:bg-accent transition-all duration-300 shadow-lg shadow-text-primary/20 hover:shadow-accent/30 hover:-translate-y-1">
              Shop Bouquets
            </button>
            <button className="px-8 py-4 bg-bg-primary text-text-primary rounded-full font-medium hover:bg-bg-secondary transition-all duration-300 shadow-sm border border-border-light">
              Explore Occasions
            </button>
          </div>
        </motion.div>

        {/* Image Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="relative h-[500px] md:h-[600px] w-full rounded-[2rem] overflow-hidden shadow-2xl shadow-accent-light/20"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&q=80&w=1200" 
            alt="Beautiful flower bouquet" 
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          
          {/* Floating Badge */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="absolute bottom-8 right-8 z-20 bg-bg-primary/90 backdrop-blur-md p-4 rounded-2xl shadow-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-bg-secondary flex items-center justify-center text-xl">
                ✨
              </div>
              <div>
                <p className="text-xs text-text-muted font-medium uppercase tracking-wider">Fresh Daily</p>
                <p className="font-serif text-text-primary font-medium">100% Guarantee</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
