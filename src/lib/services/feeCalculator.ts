import { PaymentMethod, CryptoType, FeeBreakdown } from "@/types";
import {
  CRYPTO_FEES,
  CRYPTO_PRICES,
  CARD_PROCESSING_FEE,
  CARD_FIXED_FEE,
  BANK_TRANSFER_FEE,
  BANK_FIXED_FEE,
} from "@/lib/constants/crypto";

export function calculateFees(
  amount: number,
  method: PaymentMethod,
  cryptoType?: CryptoType
): FeeBreakdown {
  let processingFee = 0;
  let networkFee = 0;
  let spread = 0;

  switch (method) {
    case "crypto":
      if (cryptoType && CRYPTO_FEES[cryptoType]) {
        const fees = CRYPTO_FEES[cryptoType];
        processingFee = amount * fees.processingFee;
        networkFee = amount * fees.networkFee;
        spread = amount * fees.spread;
      }
      break;

    case "card":
      processingFee = amount * CARD_PROCESSING_FEE + CARD_FIXED_FEE;
      break;

    case "bank":
      processingFee = amount * BANK_TRANSFER_FEE + BANK_FIXED_FEE;
      break;
  }

  const total = amount + processingFee + networkFee + spread;

  return {
    subtotal: amount,
    processingFee,
    networkFee: networkFee > 0 ? networkFee : undefined,
    spread: spread > 0 ? spread : undefined,
    total,
  };
}

export function getCryptoAmount(
  usdAmount: number,
  cryptoType: CryptoType
): number {
  const price = CRYPTO_PRICES[cryptoType];
  if (!price) return 0;
  return usdAmount / price.price;
}

export function getUSDAmount(
  cryptoAmount: number,
  cryptoType: CryptoType
): number {
  const price = CRYPTO_PRICES[cryptoType];
  if (!price) return 0;
  return cryptoAmount * price.price;
}
