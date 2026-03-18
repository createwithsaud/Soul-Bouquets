import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext';
import { CheckCircle2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Checkout() {
  const { cartItems, cartCount, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [razorpayKeyId, setRazorpayKeyId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'ONLINE'>('COD');

  useEffect(() => {
    if (isSuccess) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults, particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#F27D26', '#E8A598', '#F5E6E8', '#FFFFFF']
        });
        confetti({
          ...defaults, particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#F27D26', '#E8A598', '#F5E6E8', '#FFFFFF']
        });
      }, 250);
      
      return () => clearInterval(interval);
    }
  }, [isSuccess]);

  useEffect(() => {
    // Fetch Razorpay Key ID
    const fetchKey = async () => {
      try {
        const res = await fetch('/api/config/razorpay');
        const data = await res.json();
        setRazorpayKeyId(data.keyId);
      } catch (err) {
        console.error('Failed to fetch Razorpay key', err);
      }
    };
    fetchKey();
  }, []);

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    city: '',
    pincode: '',
  });

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Create order in our database
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderItems: cartItems.map(item => ({
            product: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          user: formData,
          totalPrice: total,
          paymentMethod: paymentMethod,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await orderResponse.json();

      // If COD is selected, just complete the order
      if (paymentMethod === 'COD') {
        setIsSuccess(true);
        clearCart();
        setIsSubmitting(false);
        return;
      }

      // If Razorpay is not configured, just complete the order
      if (!razorpayKeyId || !window.Razorpay) {
        console.warn('Razorpay not configured, completing order without payment');
        setIsSuccess(true);
        clearCart();
        setIsSubmitting(false);
        return;
      }

      // 2. Create Razorpay order
      const rzpOrderResponse = await fetch(`/api/orders/${orderData._id}/pay`, {
        method: 'POST',
      });

      if (!rzpOrderResponse.ok) {
        throw new Error('Failed to initialize payment');
      }

      const rzpOrderData = await rzpOrderResponse.json();

      // 3. Open Razorpay Checkout
      const options = {
        key: razorpayKeyId,
        amount: rzpOrderData.amount,
        currency: rzpOrderData.currency,
        name: 'Soul Bouquets',
        description: 'Premium Floral Arrangements',
        order_id: rzpOrderData.id,
        handler: async function (response: any) {
          try {
            // 4. Verify payment
            const verifyRes = await fetch(`/api/orders/${orderData._id}/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (verifyRes.ok) {
              setIsSuccess(true);
              clearCart();
            } else {
              setError('Payment verification failed. Please contact support.');
            }
          } catch (err) {
            console.error('Verification error:', err);
            setError('Payment verification failed.');
          } finally {
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: formData.fullName,
          contact: formData.phoneNumber,
        },
        theme: {
          color: '#F27D26', // Using accent color
        },
        modal: {
          ondismiss: function() {
            setIsSubmitting(false);
            setError('Payment was cancelled.');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setIsSubmitting(false);
        setError(response.error.description || 'Payment failed');
      });
      rzp.open();

    } catch (err) {
      console.error('Error placing order:', err);
      setError('There was an error placing your order. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen pt-32 pb-24 bg-bg-primary flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-bg-secondary p-8 rounded-3xl text-center shadow-xl"
        >
          <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-accent" />
          </div>
          <h2 className="font-serif text-3xl text-text-primary mb-4">Order Placed Successfully!</h2>
          <p className="text-text-secondary mb-8">
            Thank you for your purchase. Your beautiful blooms are being prepared and will be on their way soon.
          </p>
          <Link 
            to="/"
            className="inline-flex items-center justify-center px-8 py-4 bg-accent text-bg-primary rounded-full font-medium hover:bg-accent-light transition-colors shadow-lg shadow-accent/20"
          >
            Return to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-text-secondary hover:text-accent transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shopping
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-serif text-text-primary mb-12">
          Secure <span className="italic text-accent">Checkout</span>
        </h1>

        {cartCount === 0 ? (
          <div className="text-center py-24 bg-bg-secondary rounded-3xl">
            <ShoppingBag className="w-16 h-16 text-text-muted mx-auto mb-6" />
            <h2 className="font-serif text-2xl text-text-primary mb-4">Your cart is empty</h2>
            <p className="text-text-secondary mb-8">Looks like you haven't added any beautiful blooms yet.</p>
            <Link 
              to="/"
              className="inline-flex items-center justify-center px-8 py-4 bg-accent text-bg-primary rounded-full font-medium hover:bg-accent-light transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Form Section */}
            <div className="flex-1">
              <div className="bg-bg-secondary p-8 rounded-3xl">
                <h2 className="font-serif text-2xl text-text-primary mb-6">Delivery Details</h2>
                
                {error && (
                  <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-text-secondary mb-2">Full Name</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full bg-bg-primary border border-border-light rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent transition-shadow"
                      placeholder="Jane Doe"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-text-secondary mb-2">Phone Number</label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      required
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full bg-bg-primary border border-border-light rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent transition-shadow"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-text-secondary mb-2">Delivery Address</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full bg-bg-primary border border-border-light rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent transition-shadow"
                      placeholder="123 Floral Street, Apt 4B"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-text-secondary mb-2">City</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full bg-bg-primary border border-border-light rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent transition-shadow"
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <label htmlFor="pincode" className="block text-sm font-medium text-text-secondary mb-2">Pincode / Zip</label>
                      <input
                        type="text"
                        id="pincode"
                        name="pincode"
                        required
                        value={formData.pincode}
                        onChange={handleChange}
                        className="w-full bg-bg-primary border border-border-light rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent transition-shadow"
                        placeholder="10001"
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border-light">
                    <h3 className="font-serif text-xl text-text-primary mb-4">Payment Method</h3>
                    <div className="space-y-3">
                      <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'COD' ? 'border-accent bg-accent/5' : 'border-border-light hover:border-accent/50'}`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="COD"
                          checked={paymentMethod === 'COD'}
                          onChange={() => setPaymentMethod('COD')}
                          className="w-4 h-4 text-accent focus:ring-accent border-gray-300"
                        />
                        <span className="ml-3 font-medium text-text-primary">Cash on Delivery (COD)</span>
                        <span className="ml-auto text-sm text-text-secondary">Pay when you receive</span>
                      </label>
                      
                      <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'ONLINE' ? 'border-accent bg-accent/5' : 'border-border-light hover:border-accent/50'}`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="ONLINE"
                          checked={paymentMethod === 'ONLINE'}
                          onChange={() => setPaymentMethod('ONLINE')}
                          className="w-4 h-4 text-accent focus:ring-accent border-gray-300"
                        />
                        <span className="ml-3 font-medium text-text-primary">Pay Online</span>
                        <span className="ml-auto text-sm text-text-secondary">Cards, UPI, NetBanking</span>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-accent text-bg-primary rounded-full font-medium text-lg hover:bg-accent-light transition-colors shadow-lg shadow-accent/20 disabled:opacity-70 disabled:cursor-not-allowed mt-8"
                  >
                    {isSubmitting ? 'Processing...' : (paymentMethod === 'COD' ? 'Place Order (COD)' : 'Proceed to Payment')}
                  </button>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-[400px]">
              <div className="bg-bg-secondary p-8 rounded-3xl sticky top-32">
                <h2 className="font-serif text-2xl text-text-primary mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-text-primary text-sm line-clamp-1">{item.name}</h3>
                        <p className="text-text-secondary text-xs mt-1">Qty: {item.quantity}</p>
                        <p className="font-medium text-accent text-sm mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border-light pt-6 space-y-3">
                  <div className="flex justify-between text-text-secondary">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-text-primary font-serif text-xl pt-3 border-t border-border-light">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
