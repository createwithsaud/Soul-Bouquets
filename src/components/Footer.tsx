import { Instagram, Facebook, Twitter, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-bg-secondary text-text-primary pt-20 pb-10 border-t border-border-light">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="md:col-span-1">
            <a href="#" className="font-serif text-3xl tracking-wide text-text-primary mb-6 block">
              Soul <span className="text-accent italic">bouquets</span>
            </a>
            <p className="text-text-secondary font-light text-sm leading-relaxed mb-6">
              Crafting unforgettable moments through the art of floral design. Delivering fresh, premium blooms daily.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-bg-primary flex items-center justify-center hover:bg-accent hover:text-bg-primary transition-colors shadow-sm">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-bg-primary flex items-center justify-center hover:bg-accent hover:text-bg-primary transition-colors shadow-sm">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-bg-primary flex items-center justify-center hover:bg-accent hover:text-bg-primary transition-colors shadow-sm">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg mb-6">Shop</h4>
            <ul className="space-y-4 text-sm text-text-secondary font-light">
              <li><a href="#" className="hover:text-accent transition-colors">All Bouquets</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Best Sellers</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Subscriptions</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Gift Cards</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-serif text-lg mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-text-secondary font-light">
              <li><a href="#" className="hover:text-accent transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Delivery Policy</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Returns & Refunds</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-serif text-lg mb-6">Stay in Bloom</h4>
            <p className="text-text-secondary font-light text-sm mb-4">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-bg-primary border border-border-light rounded-full px-4 py-2 text-sm w-full focus:outline-none focus:border-accent transition-colors text-text-primary placeholder:text-text-muted"
              />
              <button 
                type="submit"
                className="bg-accent text-bg-primary px-6 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border-light flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-muted font-light">
          <p>&copy; {new Date().getFullYear()} Soul Bouquets. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-accent fill-accent" /> by AI Studio
          </p>
        </div>

      </div>
    </footer>
  );
}
