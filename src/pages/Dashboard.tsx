import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  DollarSign,
  CreditCard,
  TrendingUp,
  BarChart3,
  LogOut,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { usePaymentStore } from "@/store/paymentStore";
import { generateMockTransactions } from "@/lib/mock/mockData";
import { formatCurrency, formatDateTime } from "@/lib/utils/format";
import { TransactionStatus } from "@/types";

export const Dashboard: FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { transactions, addTransaction } = usePaymentStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load mock transactions on first render
    if (transactions.length === 0) {
      const mockTxs = generateMockTransactions(20);
      mockTxs.forEach((tx) => addTransaction(tx));
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const totalRevenue = transactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalTransactions = transactions.length;
  const completedCount = transactions.filter(
    (t) => t.status === "completed"
  ).length;
  const avgOrderValue = totalRevenue / (completedCount || 1);

  const cryptoRevenue = transactions
    .filter((t) => t.method === "crypto" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const cardRevenue = transactions
    .filter((t) => t.method === "card" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const bankRevenue = transactions
    .filter((t) => t.method === "bank" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Merchant Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome back, {user?.email}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/checkout")}
              >
                New Payment
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut size={18} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            icon={<DollarSign size={24} />}
            trend="+12.5%"
            color="primary"
          />
          <StatCard
            title="Total Transactions"
            value={totalTransactions.toString()}
            icon={<CreditCard size={24} />}
            trend="+8.2%"
            color="success"
          />
          <StatCard
            title="Avg Order Value"
            value={formatCurrency(avgOrderValue)}
            icon={<TrendingUp size={24} />}
            trend="+5.1%"
            color="warning"
          />
          <StatCard
            title="Success Rate"
            value={`${((completedCount / totalTransactions) * 100).toFixed(
              1
            )}%`}
            icon={<BarChart3 size={24} />}
            trend="+2.3%"
            color="info"
          />
        </div>

        {/* Payment Method Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Crypto Payments
                </span>
                <Badge variant="info" size="sm">
                  Lowest Fee
                </Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(cryptoRevenue)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {transactions.filter((t) => t.method === "crypto").length}{" "}
                transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Card Payments
                </span>
                <Badge variant="default" size="sm">
                  Popular
                </Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(cardRevenue)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {transactions.filter((t) => t.method === "card").length}{" "}
                transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Bank Transfers
                </span>
                <Badge variant="default" size="sm">
                  Secure
                </Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(bankRevenue)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {transactions.filter((t) => t.method === "bank").length}{" "}
                transactions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Transactions</CardTitle>
              <Button variant="ghost" size="sm">
                View All
                <ArrowUpRight size={16} className="ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Transaction ID
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Customer
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Method
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 10).map((tx) => (
                    <tr
                      key={tx.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-sm font-mono text-gray-900">
                        {tx.id.substring(0, 16)}...
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatDateTime(tx.timestamp)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {tx.userEmail}
                      </td>
                      <td className="py-3 px-4">
                        <PaymentMethodBadge
                          method={tx.method}
                          crypto={tx.cryptoType}
                        />
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                        {formatCurrency(tx.amount)}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={tx.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  color: "primary" | "success" | "warning" | "info";
}

const StatCard: FC<StatCardProps> = ({ title, value, icon, trend, color }) => {
  const colors = {
    primary: "text-primary-600 bg-primary-100",
    success: "text-success-600 bg-success-100",
    warning: "text-warning-600 bg-warning-100",
    info: "text-primary-600 bg-primary-100",
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-lg ${colors[color]}`}>{icon}</div>
          <span className="text-sm font-medium text-success-600">{trend}</span>
        </div>
        <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </CardContent>
    </Card>
  );
};

const StatusBadge: FC<{ status: TransactionStatus }> = ({ status }) => {
  const variants: Record<
    TransactionStatus,
    "success" | "warning" | "danger" | "info"
  > = {
    completed: "success",
    pending: "warning",
    processing: "info",
    failed: "danger",
    refunded: "warning",
  };

  const labels: Record<TransactionStatus, string> = {
    completed: "Completed",
    pending: "Pending",
    processing: "Processing",
    failed: "Failed",
    refunded: "Refunded",
  };

  return <Badge variant={variants[status]}>{labels[status]}</Badge>;
};

const PaymentMethodBadge: FC<{ method: string; crypto?: string }> = ({
  method,
  crypto,
}) => {
  if (method === "crypto" && crypto) {
    return <Badge variant="info">{crypto}</Badge>;
  }

  const labels: Record<string, string> = {
    card: "Card",
    bank: "Bank",
    crypto: "Crypto",
  };

  return <Badge variant="default">{labels[method] || method}</Badge>;
};
