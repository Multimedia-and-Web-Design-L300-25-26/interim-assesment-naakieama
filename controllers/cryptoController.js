import Crypto from '../models/Crypto.js';

const PAGE_SIZE_OPTIONS = [10, 25, 50];

const getCryptoFilter = (search = '') => {
  const cleanSearch = search.trim();

  if (!cleanSearch) return {};

  return {
    $or: [
      { name: { $regex: cleanSearch, $options: 'i' } },
      { symbol: { $regex: cleanSearch, $options: 'i' } },
    ],
  };
};

const buildMarketStats = async () => {
  const [stats = {}] = await Crypto.aggregate([
    {
      $group: {
        _id: null,
        assetCount: { $sum: 1 },
        totalListedValue: { $sum: '$price' },
        averageChange24h: { $avg: '$change24h' },
        topPrice: { $max: '$price' },
        lowestPrice: { $min: '$price' },
      },
    },
  ]);

  return {
    assetCount: stats.assetCount || 0,
    totalListedValue: stats.totalListedValue || 0,
    averageChange24h: stats.averageChange24h || 0,
    topPrice: stats.topPrice || 0,
    lowestPrice: stats.lowestPrice || 0,
  };
};

export const getAllCryptos = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const requestedLimit = Number(req.query.limit) || 10;
    const limit = PAGE_SIZE_OPTIONS.includes(requestedLimit) ? requestedLimit : 10;
    const filter = getCryptoFilter(req.query.search || '');
    const skip = (page - 1) * limit;

    const [cryptos, total, marketStats] = await Promise.all([
      Crypto.find(filter).sort({ createdAt: 1 }).skip(skip).limit(limit),
      Crypto.countDocuments(filter),
      buildMarketStats(),
    ]);

    return res.json({
      cryptos,
      marketStats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to load cryptocurrencies.' });
  }
};

export const getCryptoGainers = async (req, res) => {
  try {
    const cryptos = await Crypto.find().sort({ change24h: -1 });
    return res.json({ cryptos });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to load gainers.' });
  }
};

export const getCryptoNewListings = async (req, res) => {
  try {
    const cryptos = await Crypto.find().sort({ createdAt: -1 });
    return res.json({ cryptos });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to load new listings.' });
  }
};

export const createCrypto = async (req, res) => {
  try {
    const { name, symbol, price, image, change24h } = req.body;

    if (!name || !symbol || price === undefined || !image || change24h === undefined) {
      return res.status(400).json({ message: 'Name, symbol, price, image, and change24h are required.' });
    }

    const crypto = await Crypto.create({
      name,
      symbol,
      price: Number(price),
      image,
      change24h: Number(change24h),
    });

    return res.status(201).json({
      message: 'Cryptocurrency created successfully.',
      crypto,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'A cryptocurrency with this symbol already exists.' });
    }

    return res.status(400).json({ message: error.message || 'Unable to create cryptocurrency.' });
  }
};
