import mongoose from 'mongoose';

const cryptoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Cryptocurrency name is required.'],
      trim: true,
    },
    symbol: {
      type: String,
      required: [true, 'Cryptocurrency symbol is required.'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required.'],
      min: [0, 'Price cannot be negative.'],
    },
    image: {
      type: String,
      required: [true, 'Image URL is required.'],
      trim: true,
    },
    change24h: {
      type: Number,
      required: [true, '24h change is required.'],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Crypto', cryptoSchema);
