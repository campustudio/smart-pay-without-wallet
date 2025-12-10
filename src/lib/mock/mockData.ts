import {
  Transaction,
  Merchant,
  CheckoutItem,
  CheckoutSession,
  PaymentMethod,
  CryptoType,
} from "@/types";
import { generateTransactionId, generateUserId } from "@/lib/utils/format";
import { calculateFees } from "@/lib/services/feeCalculator";

// Mock Merchants
export const MOCK_MERCHANTS: Merchant[] = [
  {
    id: "MER-001",
    name: "TechStore Pro",
    email: "contact@techstore.com",
    industry: "Electronics",
    logo: "🖥️",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "MER-002",
    name: "Fashion Hub",
    email: "hello@fashionhub.com",
    industry: "Fashion",
    logo: "👗",
    createdAt: new Date("2024-02-20"),
  },
  {
    id: "MER-003",
    name: "Coffee Corner",
    email: "info@coffeecorner.com",
    industry: "Food & Beverage",
    logo: "☕",
    createdAt: new Date("2024-03-10"),
  },
  {
    id: "MER-004",
    name: "Book Haven",
    email: "support@bookhaven.com",
    industry: "Books",
    logo: "📚",
    createdAt: new Date("2024-04-05"),
  },
];

const PAYMENT_METHODS: PaymentMethod[] = ["crypto", "card", "bank"];
const CRYPTO_TYPES: CryptoType[] = ["ETH", "USDT", "USDC", "MATIC", "BNB"];

// Generate mock transactions
export function generateMockTransactions(count: number = 50): Transaction[] {
  const transactions: Transaction[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const merchant =
      MOCK_MERCHANTS[Math.floor(Math.random() * MOCK_MERCHANTS.length)];
    const method =
      PAYMENT_METHODS[Math.floor(Math.random() * PAYMENT_METHODS.length)];
    const cryptoType =
      method === "crypto"
        ? CRYPTO_TYPES[Math.floor(Math.random() * CRYPTO_TYPES.length)]
        : undefined;

    const amount = Math.random() * 500 + 10; // $10 - $510
    const fees = calculateFees(amount, method, cryptoType);

    const daysAgo = Math.floor(Math.random() * 30);
    const timestamp = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    const statuses = [
      "completed",
      "completed",
      "completed",
      "pending",
      "failed",
    ] as const;
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    transactions.push({
      id: generateTransactionId(),
      merchantId: merchant.id,
      merchantName: merchant.name,
      userId: generateUserId(),
      userEmail: `user${i}@example.com`,
      amount,
      currency: "USD",
      method,
      cryptoType,
      status,
      fees,
      timestamp,
      description: `Purchase from ${merchant.name}`,
      refundable: status === "completed" && daysAgo < 30,
    });
  }

  return transactions.sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );
}

// Mock checkout items
export const MOCK_CHECKOUT_ITEMS: CheckoutItem[] = [
  {
    id: "ITEM-001",
    name: "Wireless Headphones",
    quantity: 1,
    price: 129.99,
    image: "🎧",
  },
  {
    id: "ITEM-002",
    name: "Smart Watch",
    quantity: 1,
    price: 299.99,
    image: "⌚",
  },
];

// Create a sample checkout session
export function createMockCheckout(): CheckoutSession {
  const merchant = MOCK_MERCHANTS[0];
  const items = MOCK_CHECKOUT_ITEMS;
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return {
    id: `CHK-${Date.now()}`,
    items,
    subtotal,
    merchantId: merchant.id,
    merchantName: merchant.name,
    createdAt: new Date(),
  };
}
