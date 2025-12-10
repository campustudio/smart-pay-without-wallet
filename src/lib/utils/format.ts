import { format } from "date-fns";

export function formatCurrency(
  amount: number,
  currency: string = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatCrypto(amount: number, symbol: string): string {
  return `${amount.toFixed(6)} ${symbol}`;
}

export function formatDate(date: Date): string {
  return format(date, "MMM dd, yyyy");
}

export function formatDateTime(date: Date): string {
  return format(date, "MMM dd, yyyy HH:mm");
}

export function formatPercentage(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

export function shortenAddress(address: string, chars: number = 4): string {
  return `${address.substring(0, chars + 2)}...${address.substring(
    address.length - chars
  )}`;
}

export function generateTransactionId(): string {
  return `TXN-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 9)
    .toUpperCase()}`;
}

export function generateUserId(): string {
  return `USR-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 9)
    .toUpperCase()}`;
}
