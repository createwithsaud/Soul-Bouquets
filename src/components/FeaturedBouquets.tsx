import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

// Define the Product interface based on the backend model
interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category?: string;
  tag?: string; // Optional tag for UI (e.g., "Bestseller")
}

export default function FeaturedBouquets() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Using relative path '/api/products' since frontend and backend share the same origin on port 3000
        const response = await fetch('/api/products');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Unable to load our beautiful bouquets right now. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section id="bouquets" className="py-24 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif text-text-primary mb-4"
          >
            Featured <span className="italic text-accent">Blooms</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary max-w-2xl mx-auto font-light"
          >
            Discover our most loved arrangements, carefully curated to bring joy and beauty to any space.
          </motion.p>
        </div>

        {/* Loading State: Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[4/5] bg-bg-secondary/50 rounded-2xl mb-4"></div>
                <div className="flex justify-between items-start px-2">
                  <div className="w-2/3">
                    <div className="h-6 bg-bg-secondary/50 rounded w-full mb-2"></div>
                    <div className="h-4 bg-bg-secondary/50 rounded w-2/3"></div>
                  </div>
                  <div className="h-6 bg-bg-secondary/50 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-accent-light/20 border border-accent/30 rounded-2xl p-8 text-center max-w-2xl mx-auto"
          >
            <AlertCircle className="w-12 h-12 text-accent mx-auto mb-4" />
            <h3 className="font-serif text-xl text-text-primary mb-2">Oops! Something went wrong</h3>
            <p className="text-text-secondary font-light">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 bg-bg-primary border border-border-light rounded-full text-text-primary font-medium hover:border-accent hover:text-accent transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Empty State (No Products) */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-secondary font-light text-lg">Our garden is currently empty. Check back soon for fresh blooms!</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group relative flex flex-col transition-all duration-500 hover:-translate-y-2"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-4 bg-bg-secondary shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:shadow-accent/10">
                  {product.tag && (
                    <div className="absolute top-4 left-4 z-10 bg-bg-primary/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-text-primary tracking-wide">
                      {product.tag}
                    </div>
                  )}
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Fallback image if the provided URL fails to load
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1561181286-d3fee7d55ef6?auto=format&fit=crop&q=80&w=800';
                    }}
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart({
                          _id: product._id,
                          name: product.name,
                          price: product.price,
                          image: product.image
                        });
                      }}
                      className="translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-bg-primary text-text-primary px-6 py-3 rounded-full font-medium flex items-center gap-2 shadow-lg hover:bg-accent hover:text-bg-primary"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex justify-between items-start px-2 transition-transform duration-500">
                  <div>
                    <h3 className="font-serif text-xl text-text-primary mb-1 transition-colors duration-300 group-hover:text-accent">{product.name}</h3>
                    <p className="text-text-secondary text-sm font-light line-clamp-1">{product.description || 'Hand-tied arrangement'}</p>
                  </div>
                  <p className="font-medium text-text-primary transition-colors duration-300 group-hover:text-accent">${product.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="mt-16 text-center">
            <button className="inline-flex items-center justify-center px-8 py-4 border border-border-light rounded-full text-text-primary font-medium hover:border-accent hover:text-accent transition-colors duration-300">
              View All Bouquets
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
