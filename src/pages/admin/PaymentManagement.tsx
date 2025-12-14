// src/pages/admin/PaymentManagement.tsx

import { CreditCard, DollarSign, TrendingUp, Download } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/format';
import { getPaymentStatusColor } from '../../utils/helpers';
import { useState, useEffect } from 'react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { PaymentStatus } from '../../types';

interface Payment {
  id: number;
  booking_id: number;
  user: string;
  amount: number;
  payment_method: string;
  payment_status: string;
  transaction_id: string;
  payment_date: string;
}

const AdminPaymentManagement: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data
  useEffect(() => {
    setPayments([
      {
        id: 1,
        booking_id: 101,
        user: 'John Doe',
        amount: 450,
        payment_method: 'card',
        payment_status: 'completed',
        transaction_id: 'TXN123456',
        payment_date: '2024-11-20',
      },
      {
        id: 2,
        booking_id: 102,
        user: 'Jane Smith',
        amount: 680,
        payment_method: 'mpesa',
        payment_status: 'completed',
        transaction_id: 'TXN123457',
        payment_date: '2024-11-21',
      },
      {
        id: 3,
        booking_id: 103,
        user: 'Mike Johnson',
        amount: 320,
        payment_method: 'card',
        payment_status: 'pending',
        transaction_id: 'TXN123458',
        payment_date: '2024-11-22',
      },
    ]);
  }, []);

  const totalRevenue = payments
    .filter((p) => p.payment_status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = payments
    .filter((p) => p.payment_status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const filteredPayments = payments.filter((payment) => {
    const matchesStatus = statusFilter === 'all' || payment.payment_status === statusFilter;
    return matchesStatus;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Management</h1>
          <p className="text-gray-600">Monitor all transactions and financial records</p>
        </div>
        <Button variant="primary">
          <Download className="h-5 w-5 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
            </div>
            <DollarSign className="h-10 w-10 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Payments</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(pendingAmount)}</p>
            </div>
            <CreditCard className="h-10 w-10 text-yellow-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
            </div>
            <TrendingUp className="h-10 w-10 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {payments.length > 0
                  ? Math.round(
                      (payments.filter((p) => p.payment_status === 'completed').length /
                        payments.length) *
                        100
                    )
                  : 0}
                %
              </p>
            </div>
            <TrendingUp className="h-10 w-10 text-indigo-600" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>

        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>

        <input
          type="text"
          placeholder="Search by transaction ID..."
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Payments Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {payment.transaction_id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">#{payment.booking_id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{payment.user}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {payment.payment_method.toUpperCase()}
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={getPaymentStatusColor(payment.payment_status as PaymentStatus) as 'default' | 'success' | 'warning' | 'danger' | 'info'}
                    >
                      {payment.payment_status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(payment.payment_date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export { AdminPaymentManagement };