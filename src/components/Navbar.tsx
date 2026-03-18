import { ShoppingBag, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ThemeSwitcher from './ThemeSwitcher';
import SearchBar from './SearchBar';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount, openCart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Bouquets', href: '/#bouquets' },
    { name: 'Occasions', href: '/#occasions' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-bg-primary/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-serif text-2xl tracking-wide text-text-primary">
          Soul <span className="text-accent italic">bouquets</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="text-sm font-medium text-text-secondary hover:text-accent transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <SearchBar />
          <div className="hidden md:block">
            <ThemeSwitcher />
          </div>
          <button onClick={openCart} className="relative p-2 text-text-secondary hover:text-accent transition-colors group">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 ? (
              <motion.span 
                key={cartCount}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-bg-primary text-[10px] font-bold flex items-center justify-center rounded-full"
              >
                {cartCount}
              </motion.span>
            ) : (
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full scale-0 group-hover:scale-100 transition-transform"></span>
            )}
          </button>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-text-secondary"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-bg-primary z-50 flex flex-col p-6 md:hidden"
          >
            <div className="flex justify-between items-center mb-12">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="font-serif text-2xl tracking-wide text-text-primary">
                Soul <span className="text-accent italic">bouquets</span>
              </Link>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-text-secondary bg-bg-secondary rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex justify-center mb-8">
              <ThemeSwitcher />
            </div>

            <nav className="flex flex-col gap-6 text-center mt-2">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-serif text-text-primary hover:text-accent transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
