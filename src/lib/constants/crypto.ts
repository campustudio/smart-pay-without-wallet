import { CryptoPrice } from "@/types";

// Mock crypto prices - in production, this would come from an API
export const CRYPTO_PRICES: Record<string, CryptoPrice> = {
  ETH: {
    symbol: "ETH",
    name: "Ethereum",
    price: 2280.5,
    change24h: 2.34,
    lastUpdated: new Date(),
  },
  USDT: {
    symbol: "USDT",
    name: "Tether",
    price: 1.0,
    change24h: 0.01,
    lastUpdated: new Date(),
  },
  USDC: {
    symbol: "USDC",
    name: "USD Coin",
    price: 1.0,
    change24h: -0.02,
    lastUpdated: new Date(),
  },
  MATIC: {
    symbol: "MATIC",
    name: "Polygon",
    price: 0.85,
    change24h: 5.67,
    lastUpdated: new Date(),
  },
  BNB: {
    symbol: "BNB",
    name: "BNB",
    price: 312.45,
    change24h: -1.23,
    lastUpdated: new Date(),
  },
};

// Fee configurations
export const CRYPTO_FEES = {
  ETH: {
    processingFee: 0.015, // 1.5%
    networkFee: 0.002, // ~$5 avg
    spread: 0.005, // 0.5%
  },
  USDT: {
    processingFee: 0.01, // 1%
    networkFee: 0.001,
    spread: 0.002, // 0.2%
  },
  USDC: {
    processingFee: 0.01, // 1%
    networkFee: 0.001,
    spread: 0.002, // 0.2%
  },
  MATIC: {
    processingFee: 0.015, // 1.5%
    networkFee: 0.0005,
    spread: 0.005, // 0.5%
  },
  BNB: {
    processingFee: 0.015, // 1.5%
    networkFee: 0.001,
    spread: 0.005, // 0.5%
  },
};

export const CARD_PROCESSING_FEE = 0.029; // 2.9% + $0.30
export const CARD_FIXED_FEE = 0.3;

export const BANK_TRANSFER_FEE = 0.008; // 0.8%
export const BANK_FIXED_FEE = 0.5;
