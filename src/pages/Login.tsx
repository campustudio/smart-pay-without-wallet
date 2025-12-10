import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Chrome, Apple } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { useAuthStore } from "@/store/authStore";

export const Login: FC = () => {
  const navigate = useNavigate();
  const { login, loginWithProvider, isLoading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    navigate("/checkout");
  };

  const handleProviderLogin = async (provider: "google" | "apple") => {
    await loginWithProvider(provider);
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SmartPay</h1>
          <p className="text-gray-600">Sign in to continue your purchase</p>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
          <Input
            type="email"
            label="Email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail size={18} />}
            required
          />
          <Input
            type="password"
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock size={18} />}
            required
          />
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isLoading}
          >
            Continue with Email
          </Button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => handleProviderLogin("google")}
            disabled={isLoading}
          >
            <Chrome size={20} className="mr-2" />
            Google
          </Button>
          <Button
            variant="outline"
            onClick={() => handleProviderLogin("apple")}
            disabled={isLoading}
          >
            <Apple size={20} className="mr-2" />
            Apple
          </Button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>No wallet required • Secure payment • Instant settlement</p>
        </div>
      </Card>
    </div>
  );
};
