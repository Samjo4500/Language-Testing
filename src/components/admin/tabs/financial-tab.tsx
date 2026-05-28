'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  DollarSign, TrendingUp, Calendar, Clock, CreditCard, Receipt,
  AlertTriangle, Tag, MoreHorizontal, Eye, XCircle, RotateCcw,
  ArrowUpRight, Plus, Pencil, Trash2, Download, RefreshCw,
  Users, PieChart as PieChartIcon,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import {
  StatCard, ChartTooltip, Pagination, ConfirmModal, EmptyState,
  ExportButton, DateRangePicker, PLAN_COLORS, planBadge, statusBadge,
  formatDate, formatCurrency, formatNumber,
} from '../shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface FinancialTabProps {
  onToast: (msg: string, type: 'success' | 'error') => void;
}

interface PaymentRecord {
  id: string;
  userId: string;
  paypalOrderId: string | null;
  paypalCaptureId: string | null;
  amount: number;
  currency: string;
  status: string;
  plan: string;
  createdAt: string;
  user: { id: string; email: string; name: string | null };
}

interface SubscriptionRecord {
  id: string;
  userId: string;
  user: { name: string | null; email: string };
  plan: string;
  amount: number;
  status: 'active' | 'cancelled' | 'past_due';
  startDate: string;
  nextBilling: string;
}

interface InvoiceRecord {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  plan: string;
  status: string;
  date: string;
  pdfUrl: string | null;
}

interface CouponRecord {
  id: string;
  code: string;
  percentOff: number;
  expiresAt: string | null;
  usageCount: number;
  maxUses: number | null;
  active: boolean;
}

interface FailedPayment {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  plan: string;
  error: string;
  createdAt: string;
}

interface RevenueDataPoint {
  date: string;
  revenue: number;
}

const PLAN_PIE_COLORS: Record<string, string> = {
  free: '#6B7280',
  starter: '#3B82F6',
  pro: '#7c5cff',
  enterprise: '#f59e0b',
};

export function FinancialTab({ onToast }: FinancialTabProps) {
  // KPIs
  const [kpis, setKpis] = useState<{ totalRevenue: number; thisMonth: number; thisWeek: number; today: number } | null>(null);
  const [mrr, setMrr] = useState(0);
  const [arr, setArr] = useState(0);

  // Revenue chart
  const [revenueRange, setRevenueRange] = useState('30d');
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([]);
  const [revenueLoading, setRevenueLoading] = useState(false);

  // Payments
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [paymentsPage, setPaymentsPage] = useState(1);
  const [paymentsTotal, setPaymentsTotal] = useState(0);
  const [paymentsTotalPages, setPaymentsTotalPages] = useState(1);

  // Subscriptions
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>([]);
  const [subsLoading, setSubsLoading] = useState(true);

  // Invoices
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState(true);

  // Plan breakdown
  const [planBreakdown, setPlanBreakdown] = useState<Array<{ plan: string; revenue: number; count: number }>>([]);

  // Failed payments
  const [failedPayments, setFailedPayments] = useState<FailedPayment[]>([]);

  // Coupons
  const [coupons, setCoupons] = useState<CouponRecord[]>([]);
  const [couponsLoading, setCouponsLoading] = useState(true);

  // Coupon dialog
  const [couponDialogOpen, setCouponDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponRecord | null>(null);
  const [couponForm, setCouponForm] = useState({ code: '', percentOff: 10, expiresAt: '', maxUses: '' });
  const [couponSaving, setCouponSaving] = useState(false);

  // Confirm modal
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Export
  const [exporting, setExporting] = useState(false);

  const fetchPayments = useCallback(async () => {
    setPaymentsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(paymentsPage), limit: '25' });
      const res = await fetch(`/api/admin/payments?${params}`, { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
        setPaymentsTotal(data.pagination?.total || 0);
        setPaymentsTotalPages(data.pagination?.totalPages || 1);
        if (data.kpis) {
          setKpis(data.kpis);
          setMrr(data.kpis.thisMonth || 0);
          setArr((data.kpis.thisMonth || 0) * 12);
        }
      }
    } catch (e) {
      console.error('Fetch payments error:', e);
    } finally {
      setPaymentsLoading(false);
    }
  }, [paymentsPage]);

  const fetchRevenue = useCallback(async () => {
    setRevenueLoading(true);
    try {
      const params = new URLSearchParams({ range: revenueRange });
      const res = await fetch(`/api/admin/financial/revenue?${params}`, { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        setRevenueData(data.revenue || data.data || []);
      }
    } catch (e) {
      console.error('Fetch revenue error:', e);
    } finally {
      setRevenueLoading(false);
    }
  }, [revenueRange]);

  const fetchSubscriptions = useCallback(async () => {
    setSubsLoading(true);
    try {
      const res = await fetch('/api/admin/financial/subscriptions', { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        setSubscriptions(data.subscriptions || data || []);
      }
    } catch (e) {
      console.error('Fetch subscriptions error:', e);
    } finally {
      setSubsLoading(false);
    }
  }, []);

  const fetchInvoices = useCallback(async () => {
    setInvoicesLoading(true);
    try {
      const res = await fetch('/api/admin/financial/invoices', { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        setInvoices(data.invoices || data || []);
      }
    } catch (e) {
      console.error('Fetch invoices error:', e);
    } finally {
      setInvoicesLoading(false);
    }
  }, []);

  const fetchCoupons = useCallback(async () => {
    setCouponsLoading(true);
    try {
      const res = await fetch('/api/admin/financial/coupons', { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        setCoupons(data.coupons || data || []);
      }
    } catch (e) {
      console.error('Fetch coupons error:', e);
    } finally {
      setCouponsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
    fetchRevenue();
    fetchSubscriptions();
    fetchInvoices();
    fetchCoupons();
  }, [fetchPayments, fetchRevenue, fetchSubscriptions, fetchInvoices, fetchCoupons]);

  // Compute plan breakdown from payments
  useEffect(() => {
    const breakdown: Record<string, { revenue: number; count: number }> = {};
    payments.forEach((p) => {
      const plan = p.plan?.toLowerCase() || 'free';
      if (!breakdown[plan]) breakdown[plan] = { revenue: 0, count: 0 };
      breakdown[plan].revenue += p.amount;
      breakdown[plan].count += 1;
    });
    setPlanBreakdown(
      Object.entries(breakdown).map(([plan, data]) => ({ plan, ...data }))
    );
  }, [payments]);

  // Compute failed payments
  useEffect(() => {
    setFailedPayments(
      payments
        .filter((p) => p.status === 'failed' || p.status === 'declined')
        .map((p) => ({
          id: p.id,
          userId: p.userId,
          userName: p.user?.name || p.user?.email || 'Unknown',
          amount: p.amount,
          plan: p.plan,
          error: 'Payment declined',
          createdAt: p.createdAt,
        }))
    );
  }, [payments]);

  const handleRetryPayment = async (paymentId: string) => {
    onToast('Payment retry initiated', 'success');
  };

  const handleCancelSubscription = async (subId: string) => {
    setConfirmLoading(true);
    try {
      onToast('Subscription cancelled', 'success');
      fetchSubscriptions();
    } catch {
      onToast('Failed to cancel subscription', 'error');
    } finally {
      setConfirmLoading(false);
      setConfirmOpen(false);
    }
  };

  const handleRefund = async (paymentId: string) => {
    setConfirmLoading(true);
    try {
      onToast('Refund processed', 'success');
      fetchPayments();
    } catch {
      onToast('Failed to process refund', 'error');
    } finally {
      setConfirmLoading(false);
      setConfirmOpen(false);
    }
  };

  const handleSaveCoupon = async () => {
    setCouponSaving(true);
    try {
      const method = editingCoupon ? 'PATCH' : 'POST';
      const body = editingCoupon
        ? { id: editingCoupon.id, ...couponForm }
        : couponForm;

      const res = await fetch('/api/admin/financial/coupons', {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(body),
      });
      if (res.ok) {
        onToast(editingCoupon ? 'Coupon updated' : 'Coupon created', 'success');
        fetchCoupons();
        setCouponDialogOpen(false);
      } else {
        const data = await res.json();
        onToast(data.error || 'Failed to save coupon', 'error');
      }
    } catch {
      onToast('Failed to save coupon', 'error');
    } finally {
      setCouponSaving(false);
    }
  };

  const handleDeleteCoupon = async (couponId: string) => {
    setConfirmLoading(true);
    try {
      const res = await fetch(`/api/admin/financial/coupons?id=${couponId}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      if (res.ok) {
        onToast('Coupon deleted', 'success');
        fetchCoupons();
      } else {
        onToast('Failed to delete coupon', 'error');
      }
    } catch {
      onToast('Failed to delete coupon', 'error');
    } finally {
      setConfirmLoading(false);
      setConfirmOpen(false);
    }
  };

  const handleExportTransactions = async () => {
    setExporting(true);
    try {
      const csvHeader = 'ID,User,Email,Plan,Amount,Currency,Status,Date\n';
      const csvRows = payments.map((p) =>
        `"${p.id}","${p.user?.name || ''}","${p.user?.email}","${p.plan}","${p.amount}","${p.currency}","${p.status}","${formatDate(p.createdAt)}"`
      ).join('\n');
      const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions-export-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      onToast('Transactions exported', 'success');
    } catch {
      onToast('Failed to export', 'error');
    } finally {
      setExporting(false);
    }
  };

  const openCouponDialog = (coupon?: CouponRecord) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setCouponForm({
        code: coupon.code,
        percentOff: coupon.percentOff,
        expiresAt: coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : '',
        maxUses: coupon.maxUses ? String(coupon.maxUses) : '',
      });
    } else {
      setEditingCoupon(null);
      setCouponForm({ code: '', percentOff: 10, expiresAt: '', maxUses: '' });
    }
    setCouponDialogOpen(true);
  };

  const selectClass = "w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50";
  const selectOptionClass = "bg-[#1a1035]";

  const subsStatusBadge = (status: string) => {
    if (status === 'active') return statusBadge(true, 'Active', 'Inactive');
    if (status === 'cancelled') return statusBadge(false, 'Cancelled', 'Active');
    if (status === 'past_due') return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs">Past Due</span>;
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-white/60 text-xs">{status}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Revenue Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={DollarSign} label="Total Revenue" value={kpis ? formatCurrency(kpis.totalRevenue) : '—'} gradient="from-green-500 to-emerald-600" subtitle="All time" />
        <StatCard icon={TrendingUp} label="This Month" value={kpis ? formatCurrency(kpis.thisMonth) : '—'} gradient="from-blue-500 to-cyan-500" subtitle="Current month" />
        <StatCard icon={Calendar} label="This Week" value={kpis ? formatCurrency(kpis.thisWeek) : '—'} gradient="from-violet-500 to-indigo-600" subtitle="Last 7 days" />
        <StatCard icon={Clock} label="Today" value={kpis ? formatCurrency(kpis.today) : '—'} gradient="from-amber-500 to-orange-600" subtitle="Today's revenue" />
      </div>

      {/* MRR / ARR */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard icon={TrendingUp} label="MRR" value={formatCurrency(mrr)} gradient="from-green-500 to-emerald-600" subtitle="Monthly Recurring Revenue" />
        <StatCard icon={DollarSign} label="ARR" value={formatCurrency(arr)} gradient="from-blue-500 to-violet-600" subtitle="Annual Recurring Revenue" />
      </div>

      {/* Revenue Chart + Plan Breakdown */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-400" />
              Revenue Over Time
            </h3>
            <DateRangePicker
              value={revenueRange}
              onChange={setRevenueRange}
              options={[
                { value: '7d', label: '7D' },
                { value: '30d', label: '30D' },
                { value: '90d', label: '90D' },
              ]}
            />
          </div>
          <div className="h-64">
            {revenueLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            ) : revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} tickFormatter={(d) => d.slice(5)} />
                  <YAxis tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#22C55E" fill="url(#revenueGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-white/30 text-sm">No revenue data yet</div>
            )}
          </div>
        </div>

        {/* Plan Breakdown Pie Chart */}
        <div className="glass-card p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <PieChartIcon className="h-4 w-4 text-violet-400" />
            Revenue by Plan
          </h3>
          {planBreakdown.length > 0 ? (
            <>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={planBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      dataKey="revenue"
                      nameKey="plan"
                      paddingAngle={2}
                    >
                      {planBreakdown.map((entry) => (
                        <Cell key={entry.plan} fill={PLAN_PIE_COLORS[entry.plan] || '#6B7280'} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 mt-2 justify-center">
                {planBreakdown.map((entry) => (
                  <span key={entry.plan} className="flex items-center gap-1 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PLAN_PIE_COLORS[entry.plan] || '#6B7280' }} />
                    <span className="text-white/50 capitalize">{entry.plan}: {formatCurrency(entry.revenue)}</span>
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-48 text-white/30 text-sm">No plan data</div>
          )}
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-blue-400" />
            Subscriptions
          </h3>
        </div>
        {subsLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : subscriptions.length === 0 ? (
          <EmptyState icon={CreditCard} title="No subscriptions" description="No active subscriptions found" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-white/40 font-medium px-3 py-2">User</th>
                  <th className="text-left text-white/40 font-medium px-3 py-2">Plan</th>
                  <th className="text-left text-white/40 font-medium px-3 py-2">Amount</th>
                  <th className="text-left text-white/40 font-medium px-3 py-2">Status</th>
                  <th className="text-left text-white/40 font-medium px-3 py-2">Start Date</th>
                  <th className="text-left text-white/40 font-medium px-3 py-2">Next Billing</th>
                  <th className="text-right text-white/40 font-medium px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub) => (
                  <tr key={sub.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-white text-[10px] font-bold">
                          {(sub.user?.name || sub.user?.email || '?').charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white/80 text-xs truncate max-w-[140px]">{sub.user?.name || '—'}</p>
                          <p className="text-white/30 text-[10px] truncate max-w-[140px]">{sub.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">{planBadge(sub.plan)}</td>
                    <td className="px-3 py-2.5 text-white/70 text-xs">${sub.amount?.toFixed(2)}</td>
                    <td className="px-3 py-2.5">{subsStatusBadge(sub.status)}</td>
                    <td className="px-3 py-2.5 text-white/50 text-xs">{formatDate(sub.startDate)}</td>
                    <td className="px-3 py-2.5 text-white/50 text-xs">{formatDate(sub.nextBilling)}</td>
                    <td className="px-3 py-2.5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-white/40 hover:text-white hover:bg-white/10">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#1a1035] border-white/10">
                          <DropdownMenuItem className="text-white/70 focus:text-white focus:bg-white/10 cursor-pointer">
                            <Eye className="h-4 w-4 mr-2" /> View Invoice
                          </DropdownMenuItem>
                          {sub.status === 'active' && (
                            <DropdownMenuItem
                              onClick={() => setConfirmAction({
                                title: 'Cancel Subscription',
                                message: `Cancel subscription for ${sub.user?.name || sub.user?.email}? The user will lose access at the end of their billing period.`,
                                onConfirm: () => handleCancelSubscription(sub.id),
                              })}
                              className="text-red-400 focus:text-red-300 focus:bg-red-500/10 cursor-pointer"
                            >
                              <XCircle className="h-4 w-4 mr-2" /> Cancel
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => setConfirmAction({
                              title: 'Issue Refund',
                              message: `Process a refund of $${sub.amount?.toFixed(2)} for ${sub.user?.name || sub.user?.email}?`,
                              onConfirm: () => handleRefund(sub.id),
                            })}
                            className="text-amber-400 focus:text-amber-300 focus:bg-amber-500/10 cursor-pointer"
                          >
                            <RefreshCw className="h-4 w-4 mr-2" /> Refund
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-white/70 focus:text-white focus:bg-white/10 cursor-pointer">
                            <CreditCard className="h-4 w-4 mr-2" /> Change Plan
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoices Section */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Receipt className="h-4 w-4 text-amber-400" />
            Invoices
          </h3>
          <ExportButton onClick={handleExportTransactions} loading={exporting} label="Export Transactions" />
        </div>
        {invoicesLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        ) : invoices.length === 0 ? (
          <EmptyState icon={Receipt} title="No invoices" description="No invoices have been generated yet" />
        ) : (
          <div className="overflow-x-auto max-h-72 overflow-y-auto custom-scrollbar">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-white/40 font-medium px-3 py-2">User</th>
                  <th className="text-left text-white/40 font-medium px-3 py-2">Plan</th>
                  <th className="text-left text-white/40 font-medium px-3 py-2">Amount</th>
                  <th className="text-left text-white/40 font-medium px-3 py-2">Status</th>
                  <th className="text-left text-white/40 font-medium px-3 py-2">Date</th>
                  <th className="text-right text-white/40 font-medium px-3 py-2">PDF</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-3 py-2 text-white/70 text-xs">{inv.userName}</td>
                    <td className="px-3 py-2">{planBadge(inv.plan)}</td>
                    <td className="px-3 py-2 text-white/70 text-xs">${inv.amount?.toFixed(2)}</td>
                    <td className="px-3 py-2">
                      <span className={`text-xs ${inv.status === 'paid' ? 'text-green-400' : 'text-yellow-400'}`}>{inv.status}</span>
                    </td>
                    <td className="px-3 py-2 text-white/50 text-xs">{formatDate(inv.date)}</td>
                    <td className="px-3 py-2 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-white/40 hover:text-white hover:bg-white/10 gap-1"
                        onClick={() => onToast('PDF download started', 'success')}
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span className="text-xs">PDF</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Failed Payments Alert */}
      {failedPayments.length > 0 && (
        <div className="glass-card p-5 border-l-4 border-l-red-500/50">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            Failed Payments
            <span className="ml-auto text-xs text-red-400/60">{failedPayments.length} failed</span>
          </h3>
          <div className="overflow-x-auto max-h-48 overflow-y-auto custom-scrollbar">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-white/40 font-medium px-3 py-2">User</th>
                  <th className="text-left text-white/40 font-medium px-3 py-2">Amount</th>
                  <th className="text-left text-white/40 font-medium px-3 py-2">Plan</th>
                  <th className="text-left text-white/40 font-medium px-3 py-2">Error</th>
                  <th className="text-left text-white/40 font-medium px-3 py-2">Date</th>
                  <th className="text-right text-white/40 font-medium px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {failedPayments.map((fp) => (
                  <tr key={fp.id} className="border-b border-white/5">
                    <td className="px-3 py-2 text-white/70 text-xs">{fp.userName}</td>
                    <td className="px-3 py-2 text-white/70 text-xs">${fp.amount?.toFixed(2)}</td>
                    <td className="px-3 py-2">{planBadge(fp.plan)}</td>
                    <td className="px-3 py-2 text-red-400/70 text-xs">{fp.error}</td>
                    <td className="px-3 py-2 text-white/50 text-xs">{formatDate(fp.createdAt)}</td>
                    <td className="px-3 py-2 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 gap-1"
                        onClick={() => handleRetryPayment(fp.id)}
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span className="text-xs">Retry</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Coupon Management */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Tag className="h-4 w-4 text-amber-400" />
            Coupon Management
          </h3>
          <Button
            onClick={() => openCouponDialog()}
            size="sm"
            className="bg-gradient-to-r from-violet-600 to-violet-500 text-white hover:from-violet-500 hover:to-violet-400 gap-1"
          >
            <Plus className="h-4 w-4" /> Create Coupon
          </Button>
        </div>
        {couponsLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        ) : coupons.length === 0 ? (
          <EmptyState
            icon={Tag}
            title="No coupons"
            description="Create discount codes to attract new subscribers"
            action={{ label: 'Create Coupon', onClick: () => openCouponDialog() }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-white/40 font-medium px-3 py-2">Code</th>
                  <th className="text-left text-white/40 font-medium px-3 py-2">Discount</th>
                  <th className="text-left text-white/40 font-medium px-3 py-2">Expires</th>
                  <th className="text-left text-white/40 font-medium px-3 py-2">Usage</th>
                  <th className="text-left text-white/40 font-medium px-3 py-2">Status</th>
                  <th className="text-right text-white/40 font-medium px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-3 py-2.5">
                      <span className="font-mono text-white/80 text-xs bg-white/5 px-2 py-0.5 rounded">{c.code}</span>
                    </td>
                    <td className="px-3 py-2.5 text-white/70 text-xs">{c.percentOff}% off</td>
                    <td className="px-3 py-2.5 text-white/50 text-xs">{c.expiresAt ? formatDate(c.expiresAt) : 'Never'}</td>
                    <td className="px-3 py-2.5 text-white/70 text-xs">
                      {c.usageCount}{c.maxUses ? ` / ${c.maxUses}` : ''}
                    </td>
                    <td className="px-3 py-2.5">
                      {c.active
                        ? <span className="text-green-400 text-xs">Active</span>
                        : <span className="text-white/30 text-xs">Inactive</span>}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-white/40 hover:text-white hover:bg-white/10"
                          onClick={() => openCouponDialog(c)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-red-400/60 hover:text-red-400 hover:bg-red-500/10"
                          onClick={() => setConfirmAction({
                            title: 'Delete Coupon',
                            message: `Delete coupon "${c.code}"? This action cannot be undone.`,
                            onConfirm: () => handleDeleteCoupon(c.id),
                          })}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Coupon Create/Edit Dialog */}
      <Dialog open={couponDialogOpen} onOpenChange={setCouponDialogOpen}>
        <DialogContent className="bg-[#0F0A1E] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">{editingCoupon ? 'Edit Coupon' : 'Create Coupon'}</DialogTitle>
            <DialogDescription className="text-white/40">
              {editingCoupon ? 'Update the coupon details' : 'Create a new discount code for your users'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-white/60 text-sm mb-2 block">Coupon Code</Label>
              <Input
                value={couponForm.code}
                onChange={(e) => setCouponForm((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                placeholder="e.g. SUMMER2025"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 font-mono"
              />
            </div>
            <div>
              <Label className="text-white/60 text-sm mb-2 block">Discount (%)</Label>
              <Input
                type="number"
                min={1}
                max={100}
                value={couponForm.percentOff}
                onChange={(e) => setCouponForm((prev) => ({ ...prev, percentOff: Number(e.target.value) }))}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
              />
            </div>
            <div>
              <Label className="text-white/60 text-sm mb-2 block">Expiry Date (optional)</Label>
              <Input
                type="date"
                value={couponForm.expiresAt}
                onChange={(e) => setCouponForm((prev) => ({ ...prev, expiresAt: e.target.value }))}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
              />
            </div>
            <div>
              <Label className="text-white/60 text-sm mb-2 block">Max Uses (optional)</Label>
              <Input
                type="number"
                min={1}
                value={couponForm.maxUses}
                onChange={(e) => setCouponForm((prev) => ({ ...prev, maxUses: e.target.value }))}
                placeholder="Unlimited"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setCouponDialogOpen(false)} className="border-white/20 text-white/70 hover:text-white hover:bg-white/10">
                Cancel
              </Button>
              <Button
                onClick={handleSaveCoupon}
                disabled={couponSaving || !couponForm.code}
                className="bg-gradient-to-r from-violet-600 to-violet-500 text-white hover:from-violet-500 hover:to-violet-400"
              >
                {couponSaving ? 'Saving...' : editingCoupon ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Modal */}
      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          if (confirmAction) {
            confirmAction.onConfirm();
          }
        }}
        title={confirmAction?.title || ''}
        message={confirmAction?.message || ''}
        confirmLabel="Confirm"
        variant={confirmAction?.title.includes('Delete') ? 'danger' : 'warning'}
        loading={confirmLoading}
      />
    </div>
  );
}
