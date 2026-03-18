import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch products when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Failed to fetch products for search', error);
      }
    };
    fetchProducts();
  }, []);

  // Filter products based on query
  useEffect(() => {
    if (query.trim() === '') {
      setFilteredProducts([]);
    } else {
      const lowerQuery = query.toLowerCase();
      const results = products.filter(
        (product) =>
          product.name.toLowerCase().includes(lowerQuery) ||
          product.description.toLowerCase().includes(lowerQuery)
      );
      setFilteredProducts(results);
    }
  }, [query, products]);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset query when closed
  useEffect(() => {
    if (!isOpen) {
      // Small delay to allow exit animation to finish before clearing
      const timer = setTimeout(() => setQuery(''), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <div className="relative flex items-center" ref={searchRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 transition-colors rounded-full ${
          isOpen ? 'bg-bg-secondary text-accent' : 'text-text-secondary hover:text-accent'
        }`}
        aria-label="Search bouquets"
      >
        <Search className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-4 w-[calc(100vw-3rem)] max-w-[360px] md:w-96 bg-bg-primary border border-border-light rounded-2xl shadow-xl overflow-hidden z-50 origin-top-right"
          >
            <div className="p-3 border-b border-border-light relative">
              <input
                type="text"
                placeholder="Search by name or description..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                className="w-full bg-bg-secondary text-text-primary text-sm rounded-xl pl-10 pr-10 py-3 focus:outline-none focus:ring-1 focus:ring-accent border border-transparent transition-all placeholder:text-text-muted"
              />
              <Search className="w-4 h-4 text-text-muted absolute left-6 top-1/2 -translate-y-1/2" />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="bg-bg-primary">
              {query.trim() !== '' ? (
                filteredProducts.length > 0 ? (
                  <div className="max-h-[60vh] md:max-h-80 overflow-y-auto p-2">
                    {filteredProducts.map((product) => (
                      <a
                        key={product._id}
                        href="#bouquets"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-4 p-3 hover:bg-bg-secondary rounded-xl transition-colors group"
                      >
                        <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-bg-secondary">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1561181286-d3fee7d55ef6?auto=format&fit=crop&q=80&w=800';
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="text-sm font-medium text-text-primary truncate pr-2">{product.name}</h4>
                            <span className="text-xs font-medium text-accent shrink-0">${product.price}</span>
                          </div>
                          <p className="text-xs text-text-muted line-clamp-2">{product.description}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                      <Search className="w-5 h-5 text-text-muted" />
                    </div>
                    <p className="text-sm text-text-primary font-medium mb-1">No results found</p>
                    <p className="text-xs text-text-muted">We couldn't find anything matching "{query}"</p>
                  </div>
                )
              ) : (
                <div className="p-8 text-center">
                  <p className="text-sm text-text-muted">Start typing to search for your perfect bouquet...</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
