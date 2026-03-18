import { motion } from 'motion/react';
import { occasions } from '../data';

export default function Occasions() {
  return (
    <section id="occasions" className="py-24 bg-gradient-to-b from-bg-primary to-bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-serif text-text-primary mb-4"
            >
              Shop by <span className="italic text-accent">Occasion</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-text-secondary font-light"
            >
              Find the perfect arrangement to express your feelings, whatever the celebration may be.
            </motion.p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {occasions.map((occasion, index) => (
            <motion.a
              href="#"
              key={occasion.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`group flex flex-col items-center justify-center p-8 md:p-12 rounded-[2rem] bg-bg-secondary/50 hover:bg-accent-light/20 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center border border-border-light/50`}
            >
              <span className="text-4xl md:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300 block">
                {occasion.icon}
              </span>
              <h3 className="font-serif text-lg md:text-xl text-text-primary">{occasion.name}</h3>
            </motion.a>
          ))}
        </div>

      </div>
    </section>
  );
}
