import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function CartDrawer() {
  const { isCartOpen, closeCart, cartItems, removeFromCart, updateQuantity } = useCart();
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-bg-primary shadow-2xl z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border-light">
              <h2 className="font-serif text-2xl text-text-primary flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-accent" />
                Your Cart
              </h2>
              <button
                onClick={closeCart}
                className="p-2 text-text-secondary hover:text-accent hover:bg-bg-secondary rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-bg-secondary rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-text-muted" />
                  </div>
                  <p className="text-text-secondary font-medium">Your cart is empty</p>
                  <button 
                    onClick={closeCart}
                    className="px-6 py-2 bg-accent text-bg-primary rounded-full font-medium hover:bg-accent-light transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex gap-4 bg-bg-secondary/50 p-3 rounded-2xl">
                      <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-text-primary line-clamp-1 pr-2">{item.name}</h3>
                          <button 
                            onClick={() => removeFromCart(item._id)}
                            className="text-text-muted hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <p className="font-medium text-accent">${item.price}</p>
                          <div className="flex items-center gap-3 bg-bg-primary rounded-full px-2 py-1 border border-border-light">
                            <button 
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              className="text-text-secondary hover:text-accent"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="text-text-secondary hover:text-accent"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-border-light bg-bg-primary">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-text-secondary">Subtotal</span>
                  <span className="font-serif text-2xl text-text-primary">${total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-text-muted mb-6">Shipping and taxes calculated at checkout.</p>
                <Link 
                  to="/checkout"
                  onClick={closeCart}
                  className="w-full py-4 bg-accent text-bg-primary rounded-full font-medium text-lg hover:bg-accent-light transition-colors shadow-lg shadow-accent/20 flex items-center justify-center"
                >
                  Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
