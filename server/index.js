
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config({
  path: join(dirname(fileURLToPath(import.meta.url)), '.env')
});

import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js';
import wishlistRoutes from './routes/wishlist.routes.js';
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from './routes/order.routes.js';

const app = express();
const PORT = process.env.PORT || 8085;

const allowedOrigins = [
  'http://localhost:5173',
  'https://shopkart-beryl.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1
      ? 'connected'
      : 'disconnected'
  });
});

app.use('/customers', userRoutes);
app.use('/products', productRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);

async function startServer() {
  try {
    if (!process.env.dbUrl) {
      throw new Error('Missing dbUrl environment variable');
    }

    await mongoose.connect(process.env.dbUrl, {
      serverSelectionTimeoutMS: 15000
    });

    console.log('DB Connected');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server started at ${PORT}`);
    });
  } catch (error) {
    console.error('Startup failed:', error.message);
    process.exit(1);
  }
}

startServer();
