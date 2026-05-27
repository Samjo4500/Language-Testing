'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Search, Users, Filter, MoreHorizontal, Eye, Pencil, CreditCard, Shield,
  ShieldOff, Ban, Trash2, UserPlus, ArrowUpDown, Mail, ArrowUpRight,
  FileText, MessageSquare, BookOpen, Award, Clock,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  StatCard, ChartTooltip, Pagination, ConfirmModal, EmptyState,
  ExportButton, DateRangePicker, CEFR_PIE_COLORS, cefrBadge, planBadge,
  statusBadge, formatDate, formatDateTime, formatNumber,
} from '../shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface UsersTabProps {
  onToast: (msg: string, type: 'success' | 'error') => void;
}

interface UserRecord {
  id: string;
  email: string;
  name: string | null;
  plan: string;
  role: string;
  isDemo: boolean;
  isSuspended: boolean;
  emailVerified: boolean;
  country: string | null;
  testCredits: number;
  createdAt: string;
  updatedAt: string;
  _count: { assessments: number; certificates: number; payments: number };
  bio?: string | null;
}

interface UserActivity {
  cefrHistory: Array<{ date: string; level: string; score: number }>;
  tests: Array<{ id: string; date: string; level: string; score: number; certified: boolean }>;
  lessonProgress: Array<{ course: string; started: string; progress: number }>;
  community: { posts: number; messages: number };
  payments: Array<{ id: string; date: string; amount: number; plan: string; status: string }>;
  adminNotes: string;
}

type SortKey = 'newest' | 'lastActive' | 'name' | 'testsTaken';

const PAGE_SIZES = [25, 50, 100];

export function UsersTab({ onToast }: UsersTabProps) {
  // List state
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sort, setSort] = useState<SortKey>('newest');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [planCounts, setPlanCounts] = useState<Record<string, number>>({});
  const [exporting, setExporting] = useState(false);

  // Detail modal
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [activity, setActivity] = useState<UserActivity | null>(null);
  const [activityLoading, setActivityLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  // Confirm modal
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Edit plan dialog
  const [editPlanOpen, setEditPlanOpen] = useState(false);
  const [editPlanUser, setEditPlanUser] = useState<UserRecord | null>(null);
  const [newPlan, setNewPlan] = useState('free');
  const [editPlanLoading, setEditPlanLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(pageSize),
        ...(search && { search }),
        ...(planFilter !== 'all' && { plan: planFilter }),
        ...(roleFilter !== 'all' && { role: roleFilter }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        sort,
      });
      const res = await fetch(`/api/admin/users?${params}`, { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setTotal(data.pagination?.total || 0);
        setTotalPages(data.pagination?.totalPages || 1);
        // Calculate plan counts from data
        const counts: Record<string, number> = { free: 0, starter: 0, pro: 0, enterprise: 0 };
        (data.users || []).forEach((u: UserRecord) => {
          const p = u.plan?.toLowerCase() || 'free';
          counts[p] = (counts[p] || 0) + 1;
        });
        setPlanCounts(counts);
      }
    } catch (e) {
      console.error('Fetch users error:', e);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, planFilter, roleFilter, statusFilter, sort]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const fetchActivity = useCallback(async (userId: string) => {
    setActivityLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/activity`, { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        setActivity(data);
        setAdminNotes(data.adminNotes || '');
      }
    } catch (e) {
      console.error('Fetch activity error:', e);
    } finally {
      setActivityLoading(false);
    }
  }, []);

  const openDetail = (user: UserRecord) => {
    setSelectedUser(user);
    setDetailOpen(true);
    fetchActivity(user.id);
  };

  const handleUpdateUser = async (userId: string, updates: Record<string, unknown>) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ userId, ...updates }),
      });
      if (res.ok) {
        onToast('User updated successfully', 'success');
        fetchUsers();
        if (selectedUser?.id === userId) {
          setSelectedUser((prev) => prev ? { ...prev, ...updates } as UserRecord : prev);
        }
      } else {
        const data = await res.json();
        onToast(data.error || 'Failed to update user', 'error');
      }
    } catch {
      onToast('Failed to update user', 'error');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setConfirmLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      if (res.ok) {
        onToast('User deleted successfully', 'success');
        fetchUsers();
        setDetailOpen(false);
      } else {
        const data = await res.json();
        onToast(data.error || 'Failed to delete user', 'error');
      }
    } catch {
      onToast('Failed to delete user', 'error');
    } finally {
      setConfirmLoading(false);
      setConfirmOpen(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedUser) return;
    setSavingNotes(true);
    try {
      await handleUpdateUser(selectedUser.id, { adminNotes });
    } finally {
      setSavingNotes(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams({
        page: '1',
        limit: String(total || 1000),
        ...(search && { search }),
        ...(planFilter !== 'all' && { plan: planFilter }),
        ...(roleFilter !== 'all' && { role: roleFilter }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        sort,
        format: 'csv',
      });
      const res = await fetch(`/api/admin/users?${params}`, { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        const allUsers = data.users || [];
        const csvHeader = 'ID,Name,Email,Plan,Role,Status,Joined,Last Active,Tests Taken\n';
        const csvRows = allUsers.map((u: UserRecord) =>
          `"${u.id}","${u.name || ''}","${u.email}","${u.plan}","${u.role}","${u.isSuspended ? 'Banned' : u.emailVerified ? 'Verified' : 'Active'}","${formatDate(u.createdAt)}","${formatDate(u.updatedAt)}","${u._count.assessments}"`
        ).join('\n');
        const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `users-export-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        onToast('CSV exported successfully', 'success');
      }
    } catch {
      onToast('Failed to export CSV', 'error');
    } finally {
      setExporting(false);
    }
  };

  const handleEditPlan = async () => {
    if (!editPlanUser) return;
    setEditPlanLoading(true);
    try {
      await handleUpdateUser(editPlanUser.id, { plan: newPlan });
    } finally {
      setEditPlanLoading(false);
      setEditPlanOpen(false);
    }
  };

  const selectClass = "w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50";
  const selectOptionClass = "bg-[#1a1035]";

  // CEFR level numeric mapping for chart
  const cefrToNum: Record<string, number> = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };
  const numToCefr: Record<number, string> = { 1: 'A1', 2: 'A2', 3: 'B1', 4: 'B2', 5: 'C1', 6: 'C2' };

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="flex items-center flex-wrap gap-2 text-sm text-white/50">
        <Users className="h-4 w-4 text-blue-400" />
        <span>
          Showing <span className="text-white font-medium">{total}</span> users:{' '}
          {Object.entries(planCounts).map(([plan, count]) => (
            <span key={plan} className="mr-1">
              <span className="text-white/70">{count}</span>{' '}
              <span className="capitalize">{plan}</span>{count > 0 && plan !== 'enterprise' && ','}
            </span>
          ))}
        </span>
      </div>

      {/* Search + Filters */}
      <div className="glass-card p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <Input
              placeholder="Search by name, email, or ID..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet-500/50"
            />
          </div>

          {/* Filter dropdowns */}
          <div className="flex flex-wrap gap-2">
            <select
              value={planFilter}
              onChange={(e) => { setPlanFilter(e.target.value); setPage(1); }}
              className={selectClass}
            >
              <option value="all" className={selectOptionClass}>All Plans</option>
              <option value="free" className={selectOptionClass}>Free</option>
              <option value="starter" className={selectOptionClass}>Starter</option>
              <option value="pro" className={selectOptionClass}>Pro</option>
              <option value="enterprise" className={selectOptionClass}>Enterprise</option>
            </select>

            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
              className={selectClass}
            >
              <option value="all" className={selectOptionClass}>All Roles</option>
              <option value="user" className={selectOptionClass}>User</option>
              <option value="admin" className={selectOptionClass}>Admin</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className={selectClass}
            >
              <option value="all" className={selectOptionClass}>All Status</option>
              <option value="active" className={selectOptionClass}>Active</option>
              <option value="verified" className={selectOptionClass}>Verified</option>
              <option value="banned" className={selectOptionClass}>Banned</option>
            </select>
          </div>
        </div>

        {/* Sort toggle + Export + Page size */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1">
            <ArrowUpDown className="h-4 w-4 text-white/30 mr-1" />
            {(['newest', 'lastActive', 'name', 'testsTaken'] as SortKey[]).map((s) => (
              <button
                key={s}
                onClick={() => { setSort(s); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  sort === s
                    ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                {s === 'newest' ? 'Newest' : s === 'lastActive' ? 'Last Active' : s === 'name' ? 'Name' : 'Tests Taken'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none"
            >
              {PAGE_SIZES.map((ps) => (
                <option key={ps} value={ps} className={selectOptionClass}>{ps}/page</option>
              ))}
            </select>
            <ExportButton onClick={handleExport} loading={exporting} />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No users found"
            description="Try adjusting your search or filter criteria"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-white/40 font-medium px-4 py-3">User</th>
                  <th className="text-left text-white/40 font-medium px-4 py-3">Plan</th>
                  <th className="text-left text-white/40 font-medium px-4 py-3">Role</th>
                  <th className="text-left text-white/40 font-medium px-4 py-3">Status</th>
                  <th className="text-left text-white/40 font-medium px-4 py-3">Joined</th>
                  <th className="text-left text-white/40 font-medium px-4 py-3">Last Active</th>
                  <th className="text-left text-white/40 font-medium px-4 py-3">Tests</th>
                  <th className="text-right text-white/40 font-medium px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    onClick={() => openDetail(u)}
                    className="border-b border-white/5 hover:bg-white/[0.03] cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-white text-xs font-bold shrink-0">
                          {(u.name || u.email).charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white/90 text-sm truncate max-w-[180px]">{u.name || '—'}</p>
                          <p className="text-white/40 text-xs truncate max-w-[180px]">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{planBadge(u.plan)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs ${u.role === 'admin' ? 'text-amber-400' : 'text-white/50'}`}>
                        {u.role === 'admin' ? <Shield className="h-3 w-3" /> : null}
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {u.isSuspended
                        ? statusBadge(false, 'Banned', 'Banned')
                        : u.emailVerified
                          ? statusBadge(true, 'Verified', 'Unverified')
                          : statusBadge(true, 'Active', 'Inactive')}
                    </td>
                    <td className="px-4 py-3 text-white/50 text-xs">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3 text-white/50 text-xs">{formatDate(u.updatedAt)}</td>
                    <td className="px-4 py-3 text-white/70 text-xs font-medium">{u._count.assessments}</td>
                    <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white/40 hover:text-white hover:bg-white/10">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#1a1035] border-white/10">
                          <DropdownMenuItem onClick={() => openDetail(u)} className="text-white/70 focus:text-white focus:bg-white/10 cursor-pointer">
                            <Eye className="h-4 w-4 mr-2" /> View profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openDetail(u)} className="text-white/70 focus:text-white focus:bg-white/10 cursor-pointer">
                            <Pencil className="h-4 w-4 mr-2" /> Edit user
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setEditPlanUser(u);
                            setNewPlan(u.plan || 'free');
                            setEditPlanOpen(true);
                          }} className="text-white/70 focus:text-white focus:bg-white/10 cursor-pointer">
                            <CreditCard className="h-4 w-4 mr-2" /> Change plan
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-white/10" />
                          <DropdownMenuItem onClick={() => handleUpdateUser(u.id, { role: u.role === 'admin' ? 'user' : 'admin' })} className="text-white/70 focus:text-white focus:bg-white/10 cursor-pointer">
                            {u.role === 'admin' ? <ShieldOff className="h-4 w-4 mr-2" /> : <Shield className="h-4 w-4 mr-2" />}
                            {u.role === 'admin' ? 'Remove admin' : 'Make admin'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateUser(u.id, { isSuspended: !u.isSuspended })} className="text-white/70 focus:text-white focus:bg-white/10 cursor-pointer">
                            {u.isSuspended ? <Ban className="h-4 w-4 mr-2" /> : <Ban className="h-4 w-4 mr-2" />}
                            {u.isSuspended ? 'Unban user' : 'Ban user'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-white/10" />
                          <DropdownMenuItem
                            onClick={() => setConfirmAction({
                              title: 'Delete User',
                              message: `Are you sure you want to permanently delete ${u.name || u.email}? This action cannot be undone.`,
                              onConfirm: () => handleDeleteUser(u.id),
                            })}
                            className="text-red-400 focus:text-red-300 focus:bg-red-500/10 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete user
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

        {/* Pagination */}
        {users.length > 0 && (
          <div className="px-4 pb-4">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} total={total} pageSize={pageSize} />
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="bg-[#0F0A1E] border-white/10 text-white max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-3">
              {selectedUser && (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-white text-lg font-bold">
                    {(selectedUser.name || selectedUser.email).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-lg">{selectedUser.name || 'Unknown'}</div>
                    <div className="text-sm text-white/40 font-normal">{selectedUser.email}</div>
                  </div>
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-white/40 sr-only">User profile details and activity</DialogDescription>
          </DialogHeader>

          {activityLoading ? (
            <div className="space-y-4 py-4">
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          ) : selectedUser ? (
            <div className="space-y-6 pb-4">
              {/* Profile info */}
              <div className="glass-card p-4">
                <h4 className="text-white/60 text-xs font-medium uppercase tracking-wider mb-3">Profile</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-white/30 text-xs">Plan</span>
                    <div className="mt-1">{planBadge(selectedUser.plan)}</div>
                  </div>
                  <div>
                    <span className="text-white/30 text-xs">Role</span>
                    <div className="mt-1 text-white/70">{selectedUser.role}</div>
                  </div>
                  <div>
                    <span className="text-white/30 text-xs">Country</span>
                    <div className="mt-1 text-white/70">{selectedUser.country || '—'}</div>
                  </div>
                  <div>
                    <span className="text-white/30 text-xs">Joined</span>
                    <div className="mt-1 text-white/70">{formatDate(selectedUser.createdAt)}</div>
                  </div>
                  <div>
                    <span className="text-white/30 text-xs">Status</span>
                    <div className="mt-1">
                      {selectedUser.isSuspended ? statusBadge(false, 'Banned', 'Banned') : statusBadge(selectedUser.emailVerified, 'Verified', 'Unverified')}
                    </div>
                  </div>
                  <div>
                    <span className="text-white/30 text-xs">Test Credits</span>
                    <div className="mt-1 text-white/70">{selectedUser.testCredits}</div>
                  </div>
                  <div>
                    <span className="text-white/30 text-xs">Certificates</span>
                    <div className="mt-1 text-white/70">{selectedUser._count.certificates}</div>
                  </div>
                  <div>
                    <span className="text-white/30 text-xs">Payments</span>
                    <div className="mt-1 text-white/70">{selectedUser._count.payments}</div>
                  </div>
                </div>
                {selectedUser.bio && (
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <span className="text-white/30 text-xs">Bio</span>
                    <p className="text-white/60 text-sm mt-1">{selectedUser.bio}</p>
                  </div>
                )}
              </div>

              {/* CEFR Level History Chart */}
              <div className="glass-card p-4">
                <h4 className="text-white/60 text-xs font-medium uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Award className="h-3.5 w-3.5 text-violet-400" /> CEFR Level History
                </h4>
                {activity?.cefrHistory && activity.cefrHistory.length > 0 ? (
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={activity.cefrHistory.map((h) => ({
                        date: h.date.slice(0, 10),
                        level: cefrToNum[h.level] || 0,
                        score: h.score,
                      }))}>
                        <defs>
                          <linearGradient id="cefrGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#7c5cff" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#7c5cff" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} tickFormatter={(d) => d.slice(5)} />
                        <YAxis domain={[0, 6]} ticks={[1, 2, 3, 4, 5, 6]} tickFormatter={(v) => numToCefr[v] || ''} tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} />
                        <Tooltip content={<ChartTooltip />} />
                        <Area type="monotone" dataKey="level" name="CEFR Level" stroke="#7c5cff" fill="url(#cefrGrad)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-white/30 text-sm text-center py-6">No CEFR history available</p>
                )}
              </div>

              {/* Tests Taken */}
              <div className="glass-card p-4">
                <h4 className="text-white/60 text-xs font-medium uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-blue-400" /> Tests Taken
                </h4>
                {activity?.tests && activity.tests.length > 0 ? (
                  <div className="overflow-x-auto max-h-48 overflow-y-auto custom-scrollbar">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/5">
                          <th className="text-left text-white/30 text-xs font-medium pb-2">Date</th>
                          <th className="text-left text-white/30 text-xs font-medium pb-2">Level</th>
                          <th className="text-left text-white/30 text-xs font-medium pb-2">Score</th>
                          <th className="text-left text-white/30 text-xs font-medium pb-2">Certificate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activity.tests.map((t, i) => (
                          <tr key={i} className="border-b border-white/5">
                            <td className="py-2 text-white/50 text-xs">{formatDate(t.date)}</td>
                            <td className="py-2">{cefrBadge(t.level)}</td>
                            <td className="py-2 text-white/70 text-xs">{t.score}%</td>
                            <td className="py-2">
                              {t.certified
                                ? <span className="text-green-400 text-xs">Issued</span>
                                : <span className="text-white/30 text-xs">—</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-white/30 text-sm text-center py-4">No tests taken yet</p>
                )}
              </div>

              {/* Lesson Progress */}
              <div className="glass-card p-4">
                <h4 className="text-white/60 text-xs font-medium uppercase tracking-wider mb-3 flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-green-400" /> Lesson Progress
                </h4>
                {activity?.lessonProgress && activity.lessonProgress.length > 0 ? (
                  <div className="space-y-2">
                    {activity.lessonProgress.map((lp, i) => (
                      <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                        <div className="flex-1 min-w-0">
                          <p className="text-white/70 text-sm truncate">{lp.course}</p>
                          <p className="text-white/30 text-xs">Started {formatDate(lp.started)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500" style={{ width: `${lp.progress}%` }} />
                          </div>
                          <span className="text-white/50 text-xs w-10 text-right">{lp.progress}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/30 text-sm text-center py-4">No lesson progress</p>
                )}
              </div>

              {/* Community Activity */}
              <div className="glass-card p-4">
                <h4 className="text-white/60 text-xs font-medium uppercase tracking-wider mb-3 flex items-center gap-2">
                  <MessageSquare className="h-3.5 w-3.5 text-cyan-400" /> Community Activity
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-white font-semibold text-lg">{activity?.community?.posts || 0}</p>
                    <p className="text-white/40 text-xs">Posts</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-white font-semibold text-lg">{activity?.community?.messages || 0}</p>
                    <p className="text-white/40 text-xs">Messages</p>
                  </div>
                </div>
              </div>

              {/* Payment History */}
              <div className="glass-card p-4">
                <h4 className="text-white/60 text-xs font-medium uppercase tracking-wider mb-3 flex items-center gap-2">
                  <CreditCard className="h-3.5 w-3.5 text-amber-400" /> Payment History
                </h4>
                {activity?.payments && activity.payments.length > 0 ? (
                  <div className="overflow-x-auto max-h-48 overflow-y-auto custom-scrollbar">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/5">
                          <th className="text-left text-white/30 text-xs font-medium pb-2">Date</th>
                          <th className="text-left text-white/30 text-xs font-medium pb-2">Plan</th>
                          <th className="text-left text-white/30 text-xs font-medium pb-2">Amount</th>
                          <th className="text-left text-white/30 text-xs font-medium pb-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activity.payments.map((p, i) => (
                          <tr key={i} className="border-b border-white/5">
                            <td className="py-2 text-white/50 text-xs">{formatDate(p.date)}</td>
                            <td className="py-2">{planBadge(p.plan)}</td>
                            <td className="py-2 text-white/70 text-xs">${p.amount.toFixed(2)}</td>
                            <td className="py-2">
                              <span className={`text-xs ${p.status === 'completed' ? 'text-green-400' : 'text-yellow-400'}`}>{p.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-white/30 text-sm text-center py-4">No payments yet</p>
                )}
              </div>

              {/* Admin Notes */}
              <div className="glass-card p-4">
                <h4 className="text-white/60 text-xs font-medium uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-white/40" /> Admin Notes
                </h4>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add internal notes about this user..."
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20 min-h-[80px] resize-none"
                />
                <div className="flex justify-end mt-2">
                  <Button
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    size="sm"
                    className="bg-gradient-to-r from-violet-600 to-violet-500 text-white hover:from-violet-500 hover:to-violet-400"
                  >
                    {savingNotes ? 'Saving...' : 'Save Notes'}
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Change Plan Dialog */}
      <Dialog open={editPlanOpen} onOpenChange={setEditPlanOpen}>
        <DialogContent className="bg-[#0F0A1E] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Change Plan</DialogTitle>
            <DialogDescription className="text-white/40">Update the subscription plan for {editPlanUser?.name || editPlanUser?.email}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-white/60 text-sm mb-2 block">New Plan</Label>
              <select
                value={newPlan}
                onChange={(e) => setNewPlan(e.target.value)}
                className={selectClass}
              >
                <option value="free" className={selectOptionClass}>Free</option>
                <option value="starter" className={selectOptionClass}>Starter</option>
                <option value="pro" className={selectOptionClass}>Pro</option>
                <option value="enterprise" className={selectOptionClass}>Enterprise</option>
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setEditPlanOpen(false)} className="border-white/20 text-white/70 hover:text-white hover:bg-white/10">Cancel</Button>
              <Button onClick={handleEditPlan} disabled={editPlanLoading} className="bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400">
                {editPlanLoading ? 'Updating...' : 'Update Plan'}
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
            setConfirmOpen(true);
            confirmAction.onConfirm();
          }
        }}
        title={confirmAction?.title || ''}
        message={confirmAction?.message || ''}
        confirmLabel="Delete"
        variant="danger"
        loading={confirmLoading}
      />
    </div>
  );
}
