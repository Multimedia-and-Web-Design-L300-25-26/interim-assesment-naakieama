import express from 'express';
import {
  getAllCryptos,
  getCryptoGainers,
  getCryptoNewListings,
  createCrypto,
} from '../controllers/cryptoController.js';

const router = express.Router();

router.get('/', getAllCryptos);
router.get('/gainers', getCryptoGainers);
router.get('/new', getCryptoNewListings);
router.post('/', createCrypto);

export default router;
