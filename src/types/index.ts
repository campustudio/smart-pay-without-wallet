// User & Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  provider: "email" | "google" | "apple";
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Payment Types
export type PaymentMethod = "crypto" | "card" | "bank";
export type CryptoType = "ETH" | "USDT" | "USDC" | "MATIC" | "BNB";
export type TransactionStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "refunded";

export interface PaymentDetails {
  id: string;
  userId: string;
  merchantId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  cryptoType?: CryptoType;
  status: TransactionStatus;
  fees: FeeBreakdown;
  timestamp: Date;
  description?: string;
}

export interface FeeBreakdown {
  subtotal: number;
  processingFee: number;
  networkFee?: number; // For crypto
  spread?: number; // For crypto
  total: number;
}

// Merchant Types
export interface Merchant {
  id: string;
  name: string;
  email: string;
  industry: string;
  logo?: string;
  createdAt: Date;
}

export interface MerchantStats {
  totalRevenue: number;
  totalTransactions: number;
  averageOrderValue: number;
  conversionRate: number;
  refundRate: number;
  paymentMethodBreakdown: Record<PaymentMethod, number>;
}

// Transaction Types
export interface Transaction {
  id: string;
  merchantId: string;
  merchantName: string;
  userId: string;
  userEmail: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  cryptoType?: CryptoType;
  status: TransactionStatus;
  fees: FeeBreakdown;
  timestamp: Date;
  description: string;
  refundable: boolean;
}

// Crypto Price Types
export interface CryptoPrice {
  symbol: CryptoType;
  name: string;
  price: number; // in USD
  change24h: number; // percentage
  lastUpdated: Date;
}

// Checkout Flow Types
export interface CheckoutItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface CheckoutSession {
  id: string;
  items: CheckoutItem[];
  subtotal: number;
  merchantId: string;
  merchantName: string;
  createdAt: Date;
}
