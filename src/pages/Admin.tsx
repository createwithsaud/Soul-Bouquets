import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Package, Search, RefreshCw, CheckCircle2, Clock, Truck, Plus, Edit, Trash2, X, Image as ImageIcon, LogOut } from 'lucide-react';

interface OrderItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  user: {
    fullName: string;
    phoneNumber: string;
    address: string;
    city: string;
    pincode: string;
  };
  orderItems: OrderItem[];
  totalPrice: number;
  paymentMethod: string;
  status: string;
  isPaid: boolean;
  createdAt: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category?: string;
}

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  
  // Products State
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
    category: ''
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (auth !== 'true') {
      navigate('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  const fetchData = async () => {
    if (!isAuthenticated) return;
    try {
      setError(null);
      if (activeTab === 'orders') {
        setLoadingOrders(true);
        const res = await fetch('/api/orders');
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        setOrders(data);
      } else {
        setLoadingProducts(true);
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error(err);
      setError(`Could not load ${activeTab}.`);
    } finally {
      setLoadingOrders(false);
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [activeTab, isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/login');
  };

  // --- Orders Handlers ---
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');
      
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      console.error(err);
      alert('Failed to update order status');
    }
  };

  const filteredOrders = orders.filter(order => 
    order.user.fullName.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
    order._id.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
    order.user.phoneNumber.includes(orderSearchTerm)
  );

  // --- Products Handlers ---
  const handleOpenProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        price: product.price.toString(),
        image: product.image,
        description: product.description,
        category: product.category || ''
      });
    } else {
      setEditingProduct(null);
      setProductForm({ name: '', price: '', image: '', description: '', category: '' });
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingProduct ? `/api/products/${editingProduct._id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...productForm,
          price: parseFloat(productForm.price)
        }),
      });

      if (!res.ok) throw new Error('Failed to save product');
      
      setIsProductModalOpen(false);
      fetchData(); // Refresh products
    } catch (err) {
      console.error(err);
      alert('Failed to save product');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete product');
      setProducts(products.filter(p => p._id !== productId));
    } catch (err) {
      console.error(err);
      alert('Failed to delete product');
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    (product.category && product.category.toLowerCase().includes(productSearchTerm.toLowerCase()))
  );

  // --- UI Helpers ---
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="w-3 h-3 mr-1" />;
      case 'Confirmed': return <Package className="w-3 h-3 mr-1" />;
      case 'Delivered': return <CheckCircle2 className="w-3 h-3 mr-1" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-serif text-text-primary mb-2">
              Admin <span className="italic text-accent">Dashboard</span>
            </h1>
            <p className="text-text-secondary">Manage your beautiful bouquet business</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input 
                type="text" 
                placeholder={`Search ${activeTab}...`}
                value={activeTab === 'orders' ? orderSearchTerm : productSearchTerm}
                onChange={(e) => activeTab === 'orders' ? setOrderSearchTerm(e.target.value) : setProductSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-bg-secondary border border-border-light rounded-full focus:outline-none focus:ring-2 focus:ring-accent/50 w-full md:w-64"
              />
            </div>
            <button 
              onClick={fetchData}
              className="p-2 bg-bg-secondary border border-border-light rounded-full hover:bg-border-light transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-5 h-5 text-text-secondary ${(loadingOrders || loadingProducts) ? 'animate-spin' : ''}`} />
            </button>
            {activeTab === 'products' && (
              <button 
                onClick={() => handleOpenProductModal()}
                className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-full hover:bg-accent-dark transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Product</span>
              </button>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border-light">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-4 px-2 font-medium transition-colors relative ${activeTab === 'orders' ? 'text-accent' : 'text-text-secondary hover:text-text-primary'}`}
          >
            Orders
            {activeTab === 'orders' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-4 px-2 font-medium transition-colors relative ${activeTab === 'products' ? 'text-accent' : 'text-text-secondary hover:text-text-primary'}`}
          >
            Products
            {activeTab === 'products' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8">
            {error}
          </div>
        )}

        <div className="bg-bg-secondary rounded-3xl shadow-sm border border-border-light overflow-hidden">
          <div className="overflow-x-auto">
            {activeTab === 'orders' ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-light bg-bg-primary/50">
                    <th className="p-4 font-medium text-text-secondary text-sm">Order ID & Date</th>
                    <th className="p-4 font-medium text-text-secondary text-sm">Customer Details</th>
                    <th className="p-4 font-medium text-text-secondary text-sm">Products</th>
                    <th className="p-4 font-medium text-text-secondary text-sm">Total & Payment</th>
                    <th className="p-4 font-medium text-text-secondary text-sm">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {loadingOrders && orders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-text-secondary">Loading orders...</td>
                    </tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-text-secondary">No orders found.</td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <motion.tr 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        key={order._id} 
                        className="hover:bg-bg-primary/30 transition-colors"
                      >
                        <td className="p-4 align-top">
                          <div className="font-mono text-xs text-text-secondary mb-1">
                            #{order._id.slice(-6).toUpperCase()}
                          </div>
                          <div className="text-sm text-text-primary">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              month: 'short', day: 'numeric', year: 'numeric'
                            })}
                          </div>
                        </td>
                        
                        <td className="p-4 align-top">
                          <div className="font-medium text-text-primary text-sm mb-1">{order.user.fullName}</div>
                          <div className="text-xs text-text-secondary mb-1">{order.user.phoneNumber}</div>
                          <div className="text-xs text-text-secondary max-w-[200px] truncate" title={`${order.user.address}, ${order.user.city} - ${order.user.pincode}`}>
                            {order.user.address}, {order.user.city}
                          </div>
                        </td>
                        
                        <td className="p-4 align-top">
                          <div className="space-y-1">
                            {order.orderItems.map((item, idx) => (
                              <div key={idx} className="text-xs text-text-primary flex justify-between gap-2">
                                <span className="truncate max-w-[150px]">{item.quantity}x {item.name}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        
                        <td className="p-4 align-top">
                          <div className="font-medium text-text-primary text-sm mb-1">${order.totalPrice.toFixed(2)}</div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium px-2 py-0.5 bg-bg-primary border border-border-light rounded text-text-secondary">
                              {order.paymentMethod}
                            </span>
                            {order.isPaid ? (
                              <span className="text-[10px] text-green-600 font-medium">PAID</span>
                            ) : (
                              <span className="text-[10px] text-yellow-600 font-medium">UNPAID</span>
                            )}
                          </div>
                        </td>
                        
                        <td className="p-4 align-top">
                          <div className="flex flex-col gap-2 items-start">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              {order.status}
                            </span>
                            
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order._id, e.target.value)}
                              className="text-xs bg-bg-primary border border-border-light rounded px-2 py-1 text-text-secondary focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer"
                            >
                              <option value="Pending">Set Pending</option>
                              <option value="Confirmed">Set Confirmed</option>
                              <option value="Delivered">Set Delivered</option>
                            </select>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-light bg-bg-primary/50">
                    <th className="p-4 font-medium text-text-secondary text-sm">Product</th>
                    <th className="p-4 font-medium text-text-secondary text-sm">Category</th>
                    <th className="p-4 font-medium text-text-secondary text-sm">Price</th>
                    <th className="p-4 font-medium text-text-secondary text-sm text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {loadingProducts && products.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-text-secondary">Loading products...</td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-text-secondary">No products found.</td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <motion.tr 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        key={product._id} 
                        className="hover:bg-bg-primary/30 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-bg-primary flex-shrink-0">
                              {product.image ? (
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-text-muted">
                                  <ImageIcon className="w-5 h-5" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-text-primary text-sm">{product.name}</div>
                              <div className="text-xs text-text-secondary truncate max-w-[200px]">{product.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-xs font-medium px-2 py-1 bg-bg-primary border border-border-light rounded-full text-text-secondary">
                            {product.category || 'Uncategorized'}
                          </span>
                        </td>
                        <td className="p-4 font-medium text-text-primary text-sm">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleOpenProductModal(product)}
                              className="p-2 text-text-secondary hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                              title="Edit Product"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product._id)}
                              className="p-2 text-text-secondary hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-bg-primary rounded-3xl shadow-xl w-full max-w-md overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-border-light">
              <h3 className="text-xl font-serif text-text-primary">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button 
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 text-text-secondary hover:bg-bg-secondary rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Name</label>
                <input 
                  required
                  type="text" 
                  value={productForm.name}
                  onChange={e => setProductForm({...productForm, name: e.target.value})}
                  className="w-full px-4 py-2 bg-bg-secondary border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Price ($)</label>
                  <input 
                    required
                    type="number" 
                    step="0.01"
                    min="0"
                    value={productForm.price}
                    onChange={e => setProductForm({...productForm, price: e.target.value})}
                    className="w-full px-4 py-2 bg-bg-secondary border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Category</label>
                  <input 
                    type="text" 
                    value={productForm.category}
                    onChange={e => setProductForm({...productForm, category: e.target.value})}
                    className="w-full px-4 py-2 bg-bg-secondary border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Image URL</label>
                <input 
                  required
                  type="url" 
                  value={productForm.image}
                  onChange={e => setProductForm({...productForm, image: e.target.value})}
                  className="w-full px-4 py-2 bg-bg-secondary border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
                <textarea 
                  required
                  rows={3}
                  value={productForm.description}
                  onChange={e => setProductForm({...productForm, description: e.target.value})}
                  className="w-full px-4 py-2 bg-bg-secondary border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                />
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-6 py-2 rounded-full font-medium text-text-secondary hover:bg-bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 rounded-full font-medium bg-accent text-white hover:bg-accent-dark transition-colors"
                >
                  {editingProduct ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
