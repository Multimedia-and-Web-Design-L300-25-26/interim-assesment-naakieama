import Crypto from './models/Crypto.js';

const starterCryptos = [
  { name: 'Bitcoin', symbol: 'BTC', price: 740636.98, image: 'https://dynamic-assets.coinbase.com/e785e0181f1a23a30d9476038d9be91e9f6c63959b538eabbc51a1abc8898940383291eede695c3b8dfaa1829a9b57f5a2d0a16b0523580346c6b8fab67af14b/asset_icons/b57ac673f06a4b0338a596817eb0a50ce16e2059f327dc117744449a47915cb2.png', change24h: 5.94, createdAt: new Date('2026-04-01') },
  { name: 'Ethereum', symbol: 'ETH', price: 21775.65, image: 'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png', change24h: 6.27, createdAt: new Date('2026-04-05') },
  { name: 'Solana', symbol: 'SOL', price: 934.29, image: 'https://asset-metadata-service-production.s3.amazonaws.com/asset_icons/b658adaf7913c1513c8d120bcb41934a5a4bf09b6adbcb436085e2fbf6eb128c.png', change24h: 6.76, createdAt: new Date('2026-04-10') },
  { name: 'XRP', symbol: 'XRP', price: 14.86, image: 'https://dynamic-assets.coinbase.com/e81509d2307f706f3a6f8999968874b50b628634abf5154fc91a7e5f7685d496a33acb4cde02265ed6f54b0a08fa54912208516e956bc5f0ffd1c9c2634099ae/asset_icons/3af4b33bde3012fd29dd1366b0ad737660f24acc91750ee30a034a0679256d0b.png', change24h: 3.67, createdAt: new Date('2026-04-12') },
  { name: 'Avalanche', symbol: 'AVAX', price: 274.89, image: 'https://dynamic-assets.coinbase.com/35f69b8c1f2c2771170e72bdb61a986b17f7d8d20c5e10bc4fc347fe301e6137960c01c31ebbac976b9fd933bf95344d751e052a27eee0dc868f8c036bb2632a/asset_icons/d8a464a40be5c1eba32428ed1d815c878d4933231193edfa483957bd3cbfe750.png', change24h: 7.23, createdAt: new Date('2026-04-18') },
  { name: 'Chainlink', symbol: 'LINK', price: 165.43, image: 'https://dynamic-assets.coinbase.com/37ef8491789cea02a81cf80394ed3a4b5d9c408a969fd6bea76b403e04e7fd9cef623384d16a60f3c39e052006bc79522d902108764ce584466674a4da6cb316/asset_icons/c551d7b5ffe48f1d72e726ab8932ad98758ab414062e5e07479096089c547220.png', change24h: 8.52, createdAt: new Date('2026-04-22') },
  { name: 'Aptos', symbol: 'APT', price: 58.2, image: 'https://dynamic-assets.coinbase.com/933e53f993bf7a42a4d83b7070535d9c617a3dc304d8f82e7f5128eebe8f933b897a094d7df2e017962755201c09a74d5e2ceecf38925003133fc8d47f3d81bb/asset_icons/f6e3ede68a77c9496c758218dc8444d7c29cb36ef22d2bfa92bd235ac4a501b8.png', change24h: 2.91, createdAt: new Date('2026-04-28') },
];

export const seedCryptoIfEmpty = async () => {
  const count = await Crypto.countDocuments();
  if (count === 0) {
    await Crypto.insertMany(starterCryptos);
    console.log('Seeded starter cryptocurrency data.');
  }
};
