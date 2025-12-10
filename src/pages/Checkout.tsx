import { FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  Building2,
  Wallet,
  Check,
  ArrowRight,
  Shield,
  Clock,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAuthStore } from "@/store/authStore";
import { usePaymentStore } from "@/store/paymentStore";
import { PaymentMethod, CryptoType } from "@/types";
import { formatCurrency, formatCrypto } from "@/lib/utils/format";
import { getCryptoAmount } from "@/lib/services/feeCalculator";
import { CRYPTO_PRICES } from "@/lib/constants/crypto";
import { createMockCheckout } from "@/lib/mock/mockData";

export const Checkout: FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const {
    currentCheckout,
    selectedMethod,
    selectedCrypto,
    setCheckout,
    setPaymentMethod,
    setCryptoType,
    processPayment,
  } = usePaymentStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (!currentCheckout) {
      setCheckout(createMockCheckout());
    }
  }, [currentCheckout, setCheckout]);

  if (!currentCheckout) return null;

  const fees =
    selectedMethod === "crypto" && selectedCrypto
      ? currentCheckout.subtotal * 0.025
      : selectedMethod === "card"
      ? currentCheckout.subtotal * 0.029 + 0.3
      : currentCheckout.subtotal * 0.008 + 0.5;

  const total = currentCheckout.subtotal + fees;

  const handlePayment = async () => {
    if (!user) return;

    setIsProcessing(true);
    try {
      await processPayment(user.id, currentCheckout.merchantId);
      setPaymentSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Payment failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-success-50 to-success-100 flex items-center justify-center p-4">
        <Card className="max-w-md text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-success-500 rounded-full flex items-center justify-center">
              <Check className="text-white" size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h2>
          <p className="text-gray-600 mb-4">Your order has been confirmed</p>
          <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">SmartPay</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <PaymentMethodCard
                    icon={<Wallet size={24} />}
                    title="Cryptocurrency"
                    description="ETH, USDT, USDC"
                    selected={selectedMethod === "crypto"}
                    onClick={() => setPaymentMethod("crypto")}
                    badge="Lowest Fees"
                  />
                  <PaymentMethodCard
                    icon={<CreditCard size={24} />}
                    title="Credit/Debit Card"
                    description="Visa, Mastercard"
                    selected={selectedMethod === "card"}
                    onClick={() => setPaymentMethod("card")}
                  />
                  <PaymentMethodCard
                    icon={<Building2 size={24} />}
                    title="Bank Transfer"
                    description="ACH, Wire"
                    selected={selectedMethod === "bank"}
                    onClick={() => setPaymentMethod("bank")}
                  />
                </div>

                {selectedMethod === "crypto" && (
                  <div className="mt-6 space-y-4 animate-slide-up">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Cryptocurrency
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {Object.values(CRYPTO_PRICES).map((crypto) => (
                        <CryptoOption
                          key={crypto.symbol}
                          crypto={crypto}
                          selected={selectedCrypto === crypto.symbol}
                          onClick={() => setCryptoType(crypto.symbol)}
                          amount={getCryptoAmount(total, crypto.symbol)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {selectedMethod === "card" && (
                  <div className="mt-6 space-y-4 animate-slide-up">
                    <Input
                      label="Card Number"
                      placeholder="4242 4242 4242 4242"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Expiry Date" placeholder="MM / YY" />
                      <Input label="CVC" placeholder="123" />
                    </div>
                  </div>
                )}

                {selectedMethod === "bank" && (
                  <div className="mt-6 space-y-4 animate-slide-up">
                    <Input label="Account Number" placeholder="000123456789" />
                    <Input label="Routing Number" placeholder="110000000" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Features */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield size={16} className="text-primary-600" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={16} className="text-primary-600" />
                <span>Instant Settlement</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Lock size={16} className="text-primary-600" />
                <span>256-bit Encrypted</span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentCheckout.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.image} {item.name}
                      </p>
                      <p className="text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}

                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">
                      {formatCurrency(currentCheckout.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Processing Fee</span>
                    <span className="text-gray-900">
                      {formatCurrency(fees)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-semibold pt-2 border-t">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>

                  {selectedMethod === "crypto" && selectedCrypto && (
                    <div className="flex justify-between text-sm text-primary-600 bg-primary-50 p-2 rounded">
                      <span>Crypto Amount</span>
                      <span className="font-mono">
                        {formatCrypto(
                          getCryptoAmount(total, selectedCrypto),
                          selectedCrypto
                        )}
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  variant="primary"
                  className="w-full"
                  size="lg"
                  onClick={handlePayment}
                  isLoading={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Pay Now"}
                  {!isProcessing && <ArrowRight size={18} className="ml-2" />}
                </Button>

                <p className="text-xs text-center text-gray-500">
                  By completing this purchase, you agree to our Terms of Service
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

interface PaymentMethodCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  badge?: string;
}

const PaymentMethodCard: FC<PaymentMethodCardProps> = ({
  icon,
  title,
  description,
  selected,
  onClick,
  badge,
}) => {
  return (
    <button
      onClick={onClick}
      className={`relative p-4 rounded-lg border-2 transition-all ${
        selected
          ? "border-primary-600 bg-primary-50"
          : "border-gray-200 hover:border-gray-300 bg-white"
      }`}
    >
      {badge && (
        <Badge variant="success" size="sm" className="absolute -top-2 -right-2">
          {badge}
        </Badge>
      )}
      <div className="flex flex-col items-center text-center gap-2">
        <div className={`${selected ? "text-primary-600" : "text-gray-600"}`}>
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-gray-900 text-sm">{title}</h3>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
    </button>
  );
};

interface CryptoOptionProps {
  crypto: { symbol: CryptoType; name: string; price: number };
  selected: boolean;
  onClick: () => void;
  amount: number;
}

const CryptoOption: FC<CryptoOptionProps> = ({
  crypto,
  selected,
  onClick,
  amount,
}) => {
  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-lg border-2 transition-all text-left ${
        selected
          ? "border-primary-600 bg-primary-50"
          : "border-gray-200 hover:border-gray-300 bg-white"
      }`}
    >
      <div className="font-semibold text-gray-900 text-sm">{crypto.symbol}</div>
      <div className="text-xs text-gray-500 mt-1">
        {formatCrypto(amount, crypto.symbol)}
      </div>
    </button>
  );
};
