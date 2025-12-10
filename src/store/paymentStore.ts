import { create } from "zustand";
import {
  PaymentMethod,
  CryptoType,
  Transaction,
  CheckoutSession,
} from "@/types";
import { calculateFees } from "@/lib/services/feeCalculator";
import { generateTransactionId } from "@/lib/utils/format";

interface PaymentStore {
  transactions: Transaction[];
  currentCheckout: CheckoutSession | null;
  selectedMethod: PaymentMethod;
  selectedCrypto?: CryptoType;
  amount: number;

  setCheckout: (checkout: CheckoutSession) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setCryptoType: (crypto: CryptoType) => void;
  setAmount: (amount: number) => void;

  processPayment: (userId: string, merchantId: string) => Promise<Transaction>;
  addTransaction: (transaction: Transaction) => void;
  getTransactionById: (id: string) => Transaction | undefined;
  getTransactionsByUser: (userId: string) => Transaction[];
}

export const usePaymentStore = create<PaymentStore>((set, get) => ({
  transactions: [],
  currentCheckout: null,
  selectedMethod: "card",
  selectedCrypto: undefined,
  amount: 0,

  setCheckout: (checkout) =>
    set({ currentCheckout: checkout, amount: checkout.subtotal }),

  setPaymentMethod: (method) => {
    set({ selectedMethod: method });
    if (method !== "crypto") {
      set({ selectedCrypto: undefined });
    }
  },

  setCryptoType: (crypto) => set({ selectedCrypto: crypto }),

  setAmount: (amount) => set({ amount }),

  processPayment: async (userId: string, merchantId: string) => {
    const { amount, selectedMethod, selectedCrypto, currentCheckout } = get();

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const fees = calculateFees(amount, selectedMethod, selectedCrypto);

    const transaction: Transaction = {
      id: generateTransactionId(),
      merchantId,
      merchantName: currentCheckout?.merchantName || "Unknown Merchant",
      userId,
      userEmail: "user@example.com", // Would come from auth
      amount,
      currency: "USD",
      method: selectedMethod,
      cryptoType: selectedCrypto,
      status: "completed",
      fees,
      timestamp: new Date(),
      description:
        currentCheckout?.items.map((i) => i.name).join(", ") || "Payment",
      refundable: true,
    };

    set((state) => ({ transactions: [transaction, ...state.transactions] }));

    return transaction;
  },

  addTransaction: (transaction) => {
    set((state) => ({ transactions: [transaction, ...state.transactions] }));
  },

  getTransactionById: (id) => {
    return get().transactions.find((t) => t.id === id);
  },

  getTransactionsByUser: (userId) => {
    return get().transactions.filter((t) => t.userId === userId);
  },
}));
