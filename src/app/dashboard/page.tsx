'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Order, OrderStatus, PaymentStatus, TableInfo } from '@/types/cafe';
import {
  Coffee,
  CheckCircle2,
  Clock,
  ChefHat,
  Sparkles,
  QrCode,
  FileText,
  DollarSign,
  AlertCircle,
  ExternalLink,
  Printer,
  Search,
  Filter,
  RefreshCw,
  LayoutDashboard,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { BillModal } from '@/components/BillModal';

export default function CafeDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'tables'>('orders');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedBillOrderId, setSelectedBillOrderId] = useState<string | null>(null);

  // Fetch orders & tables
  const loadData = useCallback(async () => {
    try {
      const [ordersRes, tablesRes] = await Promise.all([
        fetch('/api/orders?all=true'),
        fetch('/api/tables'),
      ]);

      if (ordersRes.ok) {
        const data = await ordersRes.json();
        if (data.orders) setOrders(data.orders);
      }

      if (tablesRes.ok) {
        const data = await tablesRes.json();
        if (data.tables) setTables(data.tables);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 4000);
    return () => clearInterval(interval);
  }, [loadData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        loadData();
      }
    } catch {
      // ignore
    }
  };

  const handleTogglePayment = async (orderId: string, current: PaymentStatus) => {
    const nextStatus: PaymentStatus = current === 'PAID' ? 'PENDING' : 'PAID';
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: nextStatus }),
      });
      if (res.ok) {
        loadData();
      }
    } catch {
      // ignore
    }
  };

  // Metrics
  const metrics = useMemo(() => {
    const totalOrders = orders.length;
    const activeKitchen = orders.filter((o) =>
      ['ORDER_PLACED', 'ACCEPTED', 'PREPARING'].includes(o.status)
    ).length;
    const occupiedTables = tables.filter((t) => t.status === 'OCCUPIED').length;
    const revenue = orders
      .filter((o) => o.paymentStatus === 'PAID')
      .reduce((acc, o) => acc + o.total, 0);

    return { totalOrders, activeKitchen, occupiedTables, revenue };
  }, [orders, tables]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Status filter
      if (selectedStatus !== 'ALL') {
        if (selectedStatus === 'ACCEPTED') {
          if (!['ACCEPTED', 'PREPARING', 'READY'].includes(order.status)) return false;
        } else if (selectedStatus === 'COMPLETED') {
          if (!['COMPLETED', 'SERVED'].includes(order.status)) return false;
        } else if (order.status !== selectedStatus) {
          return false;
        }
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = order.id.toLowerCase().includes(q);
        const matchesCustomer = order.customerName.toLowerCase().includes(q);
        const matchesMobile = order.customerMobile.includes(q);
        const matchesTable = `table ${order.tableNumber}`.includes(q);
        const matchesItems = order.items.some((i) => i.name.toLowerCase().includes(q));
        return matchesId || matchesCustomer || matchesMobile || matchesTable || matchesItems;
      }
      return true;
    });
  }, [orders, selectedStatus, searchQuery]);

  return (
    <div className="min-h-screen bg-brand-beige-light text-brand-green font-sans flex flex-col">
      {/* Dashboard Top Navbar */}
      <header className="bg-brand-green text-brand-beige border-b border-brand-green-light sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link href="/" className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-brand-beige text-brand-green font-black flex items-center justify-center text-base sm:text-lg shadow-sm shrink-0">
              व
            </Link>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h1 className="font-extrabold text-base sm:text-xl tracking-tight text-brand-beige">
                  वन VIBES — Vaan Vibes
                </h1>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest px-1.5 sm:px-2 py-0.5 rounded bg-brand-gold text-brand-green whitespace-nowrap">
                  Staff Console
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-brand-beige-muted">
                Live Orders, Table QR Management & POS Billing
              </p>
            </div>
          </div>

          {/* Quick Actions & Navigation */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-wrap">
            <Link
              href="/chef"
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-brand-green-light hover:bg-brand-green-surface border border-brand-gold/30 text-brand-beige text-xs font-bold transition-all shadow-xs min-h-[34px]"
            >
              <ChefHat className="w-3.5 h-3.5 text-brand-gold" />
              <span>Chef KDS</span>
            </Link>

            <Link
              href="/cafe/van-vibes/menu?table=T12&token=vv_sec_t12_1a5df"
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-brand-beige text-brand-green hover:bg-brand-beige-dark text-xs font-bold transition-all shadow-xs min-h-[34px]"
              target="_blank"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Customer Menu</span>
              <span className="xs:hidden">Menu</span>
            </Link>

            <button
              onClick={handleRefresh}
              className="w-8 h-8 rounded-full bg-brand-green-light hover:bg-brand-green-surface text-brand-beige flex items-center justify-center transition-all shrink-0 min-h-[34px]"
              title="Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex-1 w-full space-y-4 sm:space-y-6">
        {/* KPI Metrics Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-brand-beige-dark shadow-xs space-y-1">
            <div className="flex items-center justify-between text-brand-green/60 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <span>Total Orders</span>
              <Clock className="w-4 h-4 text-brand-green/40" />
            </div>
            <div className="font-mono font-black text-xl sm:text-2xl text-brand-green">{metrics.totalOrders}</div>
            <p className="text-[10px] sm:text-[11px] text-brand-green/50">Recorded across tables</p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-brand-beige-dark shadow-xs space-y-1">
            <div className="flex items-center justify-between text-amber-700 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <span>Kitchen Pending</span>
              <ChefHat className="w-4 h-4 text-amber-600" />
            </div>
            <div className="font-mono font-black text-xl sm:text-2xl text-amber-700">{metrics.activeKitchen}</div>
            <p className="text-[10px] sm:text-[11px] text-amber-800/70">Needs chef preparation</p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-brand-beige-dark shadow-xs space-y-1">
            <div className="flex items-center justify-between text-emerald-700 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <span>Occupied Tables</span>
              <Users className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="font-mono font-black text-xl sm:text-2xl text-emerald-700">
              {metrics.occupiedTables} / {tables.length}
            </div>
            <p className="text-[10px] sm:text-[11px] text-emerald-800/70">Dine-in tables active</p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-brand-beige-dark shadow-xs space-y-1">
            <div className="flex items-center justify-between text-brand-green text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <span>Paid Revenue</span>
              <DollarSign className="w-4 h-4 text-brand-gold" />
            </div>
            <div className="font-mono font-black text-xl sm:text-2xl text-brand-green">
              ₹{metrics.revenue.toFixed(0)}
            </div>
            <p className="text-[10px] sm:text-[11px] text-brand-green/50">Settled customer payments</p>
          </div>
        </div>

        {/* Tab Switcher: Orders vs Table QR Manager */}
        <div className="flex border-b border-brand-beige-dark/70 gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2.5 sm:py-3 px-3.5 sm:px-5 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-1.5 sm:gap-2 transition-all whitespace-nowrap min-h-[40px] ${
              activeTab === 'orders'
                ? 'border-brand-green text-brand-green bg-white rounded-t-xl'
                : 'border-transparent text-brand-green/60 hover:text-brand-green'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tables')}
            className={`py-2.5 sm:py-3 px-3.5 sm:px-5 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-1.5 sm:gap-2 transition-all whitespace-nowrap min-h-[40px] ${
              activeTab === 'tables'
                ? 'border-brand-green text-brand-green bg-white rounded-t-xl'
                : 'border-transparent text-brand-green/60 hover:text-brand-green'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Table QR Manager ({tables.length})</span>
          </button>
        </div>

        {activeTab === 'orders' ? (
          /* ORDERS MANAGEMENT VIEW */
          <div className="space-y-4">
            {/* Search and Status Filters */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-brand-beige-dark shadow-xs">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-green/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Order #, customer name, mobile, item..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-brand-beige-light border border-brand-beige-dark text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
              </div>

              {/* Status Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {[
                  { id: 'ALL', label: 'All Orders' },
                  { id: 'ORDER_PLACED', label: 'Order Placed' },
                  { id: 'ACCEPTED', label: 'Order Accepted' },
                  { id: 'COMPLETED', label: 'Completed' },
                  { id: 'CANCELLED', label: 'Cancelled' },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setSelectedStatus(st.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                      selectedStatus === st.id
                        ? 'bg-brand-green text-brand-beige shadow-xs'
                        : 'bg-brand-beige-light text-brand-green hover:bg-brand-beige'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List / Cards */}
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-brand-beige-dark space-y-2">
                <p className="font-extrabold text-base text-brand-green">No orders found</p>
                <p className="text-xs text-brand-green/60">
                  {searchQuery || selectedStatus !== 'ALL'
                    ? 'Try adjusting your search or status filters.'
                    : 'Incoming customer orders will appear here automatically in real time.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 sm:p-5 rounded-2xl bg-white border border-brand-beige-dark hover:border-brand-green/30 shadow-xs space-y-4 flex flex-col justify-between"
                  >
                    {/* Top Row: Order ID, Table, Status Badge */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-lg text-brand-green">
                              {order.id}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-brand-green text-brand-beige font-extrabold text-xs">
                              Table {order.tableNumber.toString().padStart(2, '0')}
                            </span>
                          </div>
                          <p className="text-[11px] text-brand-green/60 mt-0.5">
                            {new Date(order.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}{' '}
                            • {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        {/* Order Status Badge */}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide border shadow-2xs ${
                            order.status === 'COMPLETED' || order.status === 'SERVED'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : order.status === 'ACCEPTED' || order.status === 'PREPARING' || order.status === 'READY'
                              ? 'bg-blue-50 text-blue-800 border-blue-300'
                              : order.status === 'CANCELLED'
                              ? 'bg-red-50 text-red-800 border-red-300'
                              : 'bg-amber-50 text-amber-900 border-amber-300'
                          }`}
                        >
                          {order.status === 'ORDER_PLACED'
                            ? 'Order Placed'
                            : order.status === 'ACCEPTED' || order.status === 'PREPARING' || order.status === 'READY'
                            ? 'Order Accepted'
                            : order.status === 'COMPLETED' || order.status === 'SERVED'
                            ? 'Completed'
                            : order.status.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Customer Info Box */}
                      <div className="p-2.5 rounded-xl bg-brand-beige-light border border-brand-beige-dark/50 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div>
                          <span className="text-brand-green/50">Customer: </span>
                          <span className="font-bold text-brand-green">{order.customerName}</span>
                        </div>
                        <div>
                          <span className="text-brand-green/50">Mobile: </span>
                          <span className="font-mono font-bold text-brand-green">
                            +91 {order.customerMobile}
                          </span>
                        </div>
                      </div>

                      {/* Special Instructions Alert if present */}
                      {order.specialInstructions && (
                        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2 font-medium">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold uppercase tracking-wider text-[10px]">
                              Special Instructions:
                            </span>{' '}
                            {order.specialInstructions}
                          </div>
                        </div>
                      )}

                      {/* Items Table */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-bold text-brand-green/50 uppercase tracking-wider">
                          Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
                        </span>
                        <div className="divide-y divide-brand-beige-dark/40 bg-brand-beige-light/50 rounded-xl p-2.5 text-xs">
                          {order.items.map((it) => (
                            <div key={it.id} className="py-1.5 flex justify-between gap-2">
                              <div>
                                <span className="font-bold text-brand-green">{it.name}</span>
                                <span className="font-mono text-brand-green/60 ml-1.5">
                                  × {it.quantity}
                                </span>
                                {it.selectedOptions && (
                                  <div className="text-[10px] text-brand-green/60">
                                    {Object.values(it.selectedOptions).join(', ')}
                                  </div>
                                )}
                                {it.selectedAddOns && it.selectedAddOns.length > 0 && (
                                  <div className="text-[10px] text-brand-gold">
                                    {it.selectedAddOns.join(', ')}
                                  </div>
                                )}
                                {it.specialInstructions && (
                                  <div className="text-[10px] italic text-amber-800">
                                    &ldquo;{it.specialInstructions}&rdquo;
                                  </div>
                                )}
                              </div>
                              <span className="font-mono font-bold text-brand-green">
                                ₹{(it.price * it.quantity).toFixed(0)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Financial & Status Action Controls */}
                    <div className="pt-3 border-t border-brand-beige-dark/60 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-brand-green/60 font-medium">Payment:</span>
                          <button
                            type="button"
                            onClick={() => handleTogglePayment(order.id, order.paymentStatus)}
                            className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] uppercase tracking-wider transition-all border ${
                              order.paymentStatus === 'PAID'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                                : 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200'
                            }`}
                            title="Click to toggle Paid/Pending"
                          >
                            {order.paymentStatus} (Click to toggle)
                          </button>
                        </div>
                        <div className="font-mono font-black text-base text-brand-green">
                          Total: ₹{order.total.toFixed(2)}
                        </div>
                      </div>

                      {/* Action Buttons Row */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {order.status === 'ORDER_PLACED' && (
                            <button
                              onClick={() => handleUpdateStatus(order.id, 'ACCEPTED')}
                              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Accept Order</span>
                            </button>
                          )}
                          {(order.status === 'ACCEPTED' || order.status === 'PREPARING' || order.status === 'READY' || order.status === 'SERVED') && (
                            <button
                              onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                              className="px-3.5 py-1.5 rounded-lg bg-brand-green hover:bg-brand-green-hover text-brand-beige font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold" />
                              <span>Complete Order</span>
                            </button>
                          )}
                          {order.status === 'COMPLETED' && (
                            <span className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Completed</span>
                            </span>
                          )}
                          {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                            <button
                              onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}
                              className="px-2.5 py-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-red-200 font-bold text-xs transition-all"
                            >
                              Cancel
                            </button>
                          )}
                        </div>

                        {/* Bill / Invoice View Button */}
                        <button
                          type="button"
                          onClick={() => setSelectedBillOrderId(order.id)}
                          className="px-3 py-1.5 rounded-lg border border-brand-green text-brand-green hover:bg-brand-beige font-bold text-xs flex items-center gap-1.5 transition-all"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Generate Bill</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* TABLE QR CODE MANAGER VIEW */
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white border border-brand-beige-dark shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-base text-brand-green">
                  Table QR Codes & Standees
                </h3>
                <p className="text-xs text-brand-green/60">
                  Each table has a cryptographically secured QR code with zero spoofing risk.
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-brand-green hover:bg-brand-green-hover text-brand-beige font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Print All Table Standee Cards</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {tables.map((tbl) => (
                <div
                  key={tbl.id}
                  className="p-4 rounded-2xl bg-white border border-brand-beige-dark shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-extrabold text-lg text-brand-green">
                        Table {tbl.tableNumber.toString().padStart(2, '0')}
                      </span>
                      <p className="text-xs text-brand-green/50">Capacity: {tbl.capacity} Guests</p>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        tbl.status === 'OCCUPIED'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}
                    >
                      {tbl.status}
                    </span>
                  </div>

                  {/* Visual QR Card Mockup */}
                  <div className="p-4 rounded-xl bg-brand-beige-light border border-brand-beige-dark text-center space-y-2 flex flex-col items-center">
                    <div className="w-24 h-24 bg-white p-2 rounded-lg border border-brand-beige-dark flex items-center justify-center shadow-xs">
                      {/* Stylized QR Representation */}
                      <div className="w-full h-full border-2 border-brand-green p-1 flex flex-col justify-between">
                        <div className="flex justify-between">
                          <div className="w-4 h-4 bg-brand-green" />
                          <div className="w-4 h-4 bg-brand-green" />
                        </div>
                        <div className="text-[8px] font-mono font-bold text-brand-green">
                          T{tbl.tableNumber}
                        </div>
                        <div className="flex justify-between">
                          <div className="w-4 h-4 bg-brand-green" />
                          <div className="w-2 h-2 bg-brand-green" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[11px] font-bold text-brand-green">
                        वन VIBES • Table {tbl.tableNumber}
                      </p>
                      <p className="text-[9px] text-brand-green/60 font-mono truncate max-w-[180px]">
                        {tbl.token}
                      </p>
                    </div>
                  </div>

                  {/* Open / Test Scan Button */}
                  <div className="pt-2 border-t border-brand-beige-dark/60">
                    <Link
                      href={tbl.qrCodeUrl}
                      target="_blank"
                      className="w-full py-2 px-3 rounded-xl bg-brand-green hover:bg-brand-green-hover text-brand-beige font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all"
                    >
                      <span>Simulate QR Scan</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Bill Modal */}
      {selectedBillOrderId && (
        <BillModal
          orderId={selectedBillOrderId}
          onClose={() => setSelectedBillOrderId(null)}
        />
      )}
    </div>
  );
}
