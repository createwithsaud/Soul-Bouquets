import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 1. Middleware
  app.use(cors());
  app.use(express.json());

  // 2. MongoDB Connection
  // Note: In a real environment, ensure MONGO_URI is set in your environment variables
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/soul_bouquets';
  
  try {
    console.log('Attempting to connect to MongoDB...');
    // Connect in the background so we don't block server startup
    mongoose.connect(MONGO_URI).then(() => {
      console.log('✅ MongoDB Connected Successfully');
    }).catch((error) => {
      if (error.message && error.message.includes("IP that isn't whitelisted")) {
        console.error('\n❌ MONGODB ATLAS IP WHITELIST ERROR ❌');
        console.error('Your MongoDB Atlas cluster is blocking the connection.');
        console.error('To fix this:');
        console.error('1. Go to your MongoDB Atlas Dashboard');
        console.error('2. Click "Network Access" on the left sidebar');
        console.error('3. Click "Add IP Address"');
        console.error('4. Click "ALLOW ACCESS FROM ANYWHERE" (which adds 0.0.0.0/0)');
        console.error('5. Click "Confirm" and wait for the status to become Active\n');
      } else {
        console.error('❌ MongoDB Connection Error:', error.message || error);
      }
      console.log('⚠️ Running without database connection. API routes will fall back to mock data.');
    });
  } catch (error) {
    console.error('❌ Synchronous MongoDB Connection Error:', error);
  }

  // 3. API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Soul Bouquets API is running' });
  });
  
  app.use('/api/products', productRoutes);
  app.use('/api/orders', orderRoutes);

  app.get('/api/config/razorpay', (req, res) => {
    res.json({ keyId: process.env.RAZORPAY_KEY_ID || '' });
  });

  // 4. Vite Middleware for Frontend (Required for AI Studio Full-Stack)
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Note: Express v4 uses '*' while v5 uses '*all'
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // 5. Start Server
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer();
