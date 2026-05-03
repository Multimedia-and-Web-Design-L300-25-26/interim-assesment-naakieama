import 'dotenv/config';
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from './models/User.js';
import cryptoRoutes from './routes/cryptoRoutes.js';
import { requireAuth } from './middleware/auth.js';
import { seedCryptoIfEmpty } from './seedCrypto.js';

const app = express();
const port = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required.');
}

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is required.');
}

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

const getPayload = (req) => (req.method === 'GET' ? req.query : req.body);

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
});

app.get('/health', (req, res) => {
  res.json({ message: 'API is running.' });
});

const registerHandler = async (req, res) => {
  try {
    const { name, email, password } = getPayload(req);

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword });
    const token = signToken(user._id);

    res.cookie('token', token, cookieOptions);
    return res.status(201).json({
      message: 'Account created successfully.',
      user: formatUser(user),
    });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to create account.' });
  }
};

app.post('/register', registerHandler);
app.get('/register', registerHandler);

const loginHandler = async (req, res) => {
  try {
    const { email, password } = getPayload(req);

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = signToken(user._id);
    res.cookie('token', token, cookieOptions);

    return res.json({
      message: 'Login successful.',
      user: formatUser(user),
    });
  } catch {
    return res.status(500).json({ message: 'Unable to log in. Please try again.' });
  }
};

app.post('/login', loginHandler);
app.get('/login', loginHandler);

app.post('/logout', (req, res) => {
  res.clearCookie('token', { ...cookieOptions, maxAge: undefined });
  res.json({ message: 'Logged out successfully.' });
});

app.get('/profile', requireAuth, (req, res) => {
  res.json({
    message: 'Profile loaded successfully.',
    user: formatUser(req.user),
  });
});

app.use('/crypto', cryptoRoutes);

mongoose
  .connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
  .then(async () => {
    await seedCryptoIfEmpty();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });
