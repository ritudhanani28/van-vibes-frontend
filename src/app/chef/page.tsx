'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Order, OrderStatus } from '@/types/cafe';
import {
  ChefHat,
  Clock,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  UtensilsCrossed,
  Bell,
  ExternalLink,
  Flame,
} from 'lucide-react';
import Link from 'next/link';

export default function ChefDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');

  // Load orders
  const loadOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/orders?all=true');
      if (res.ok) {
        const data = await res.json();
        if (data.orders) setOrders(data.orders);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 3500);
    return () => clearInterval(interval);
  }, [loadOrders]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadOrders();
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
        loadOrders();
      }
    } catch {
      // ignore
    }
  };

  // Group kitchen orders into 3 stages
  const newOrders = useMemo(
    () => orders.filter((o) => o.status === 'ORDER_PLACED'),
    [orders]
  );
  const acceptedOrders = useMemo(
    () => orders.filter((o) => ['ACCEPTED', 'PREPARING', 'READY'].includes(o.status)),
    [orders]
  );
  const completedOrders = useMemo(
    () => orders.filter((o) => ['SERVED', 'COMPLETED'].includes(o.status)),
    [orders]
  );

  return (
    <div className="min-h-screen bg-brand-green-deep text-brand-beige font-sans flex flex-col">
      {/* Chef Kitchen Top Bar */}
      <header className="bg-brand-green text-brand-beige border-b border-brand-green-light sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-brand-gold text-brand-green font-extrabold flex items-center justify-center text-base sm:text-lg shadow-sm shrink-0">
              <ChefHat className="w-4 h-4 sm:w-5 sm:h-5 text-brand-green" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h1 className="font-extrabold text-base sm:text-xl tracking-tight text-brand-beige">
                  Kitchen Display System
                </h1>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest px-1.5 sm:px-2 py-0.5 rounded bg-brand-gold text-brand-green whitespace-nowrap">
                  Chef Mode
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-brand-beige-muted">
                वन VIBES (Vaan Vibes Cafe & Restro) • Kitchen KDS
              </p>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-wrap">
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold transition-all border min-h-[34px] ${
                audioEnabled
                  ? 'bg-brand-gold/20 text-brand-gold border-brand-gold/40'
                  : 'bg-brand-green-light text-brand-beige-muted border-brand-green-light'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Chime {audioEnabled ? 'ON' : 'OFF'}</span>
            </button>

            <Link
              href="/dashboard"
              className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-brand-green-light hover:bg-brand-green-surface border border-brand-green-surface text-brand-beige text-xs font-bold transition-all min-h-[34px]"
            >
              <span>Cafe Admin</span>
              <ExternalLink className="w-3.5 h-3.5" />
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

      {/* Main KDS Board */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex-1 w-full space-y-4 sm:space-y-6">
        {/* Stage Counters Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
          <div className="p-3.5 rounded-2xl bg-brand-green border border-brand-green-light/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-brand-beige-muted tracking-wider">
                1. Order Placed (New)
              </p>
              <p className="font-mono font-black text-2xl text-amber-400">{newOrders.length}</p>
            </div>
            <Clock className="w-6 h-6 text-amber-400/50" />
          </div>

          <div className="p-3.5 rounded-2xl bg-brand-green border border-brand-green-light/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-brand-beige-muted tracking-wider">
                2. Order Accepted (Kitchen)
              </p>
              <p className="font-mono font-black text-2xl text-brand-gold">{acceptedOrders.length}</p>
            </div>
            <ChefHat className="w-6 h-6 text-brand-gold/50" />
          </div>

          <div className="p-3.5 rounded-2xl bg-brand-green border border-brand-green-light/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-brand-beige-muted tracking-wider">
                3. Completed
              </p>
              <p className="font-mono font-black text-2xl text-emerald-400">
                {completedOrders.length}
              </p>
            </div>
            <CheckCircle2 className="w-6 h-6 text-emerald-400/50" />
          </div>
        </div>

        {/* 2-Column Kitchen Lanes: New (Order Placed) -> Order Accepted (Cooking) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          {/* COLUMN 1: NEW ORDERS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2 pb-1 border-b border-amber-500/30">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                <h2 className="font-black text-sm uppercase tracking-wider text-amber-400">
                  New Incoming ({newOrders.length})
                </h2>
              </div>
              <span className="text-[11px] text-brand-beige-muted">Stage 1: Placed</span>
            </div>

            {newOrders.length === 0 ? (
              <div className="p-8 rounded-2xl bg-brand-green/40 border border-brand-green-light text-center text-xs text-brand-beige-muted space-y-1">
                <CheckCircle2 className="w-6 h-6 text-brand-beige-muted/40 mx-auto" />
                <p>No new orders waiting.</p>
              </div>
            ) : (
              newOrders.map((order) => (
                <ChefTicketCard
                  key={order.id}
                  order={order}
                  onAction={() => handleUpdateStatus(order.id, 'ACCEPTED')}
                  actionLabel="Accept Order"
                  actionColor="bg-blue-600 hover:bg-blue-700 text-white"
                />
              ))
            )}
          </div>

          {/* COLUMN 2: ORDER ACCEPTED / IN KITCHEN */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2 pb-1 border-b border-brand-gold/30">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-gold animate-pulse" />
                <h2 className="font-black text-sm uppercase tracking-wider text-brand-gold">
                  Order Accepted ({acceptedOrders.length})
                </h2>
              </div>
              <span className="text-[11px] text-brand-beige-muted">Stage 2: In Kitchen</span>
            </div>

            {acceptedOrders.length === 0 ? (
              <div className="p-8 rounded-2xl bg-brand-green/40 border border-brand-green-light text-center text-xs text-brand-beige-muted space-y-1">
                <UtensilsCrossed className="w-6 h-6 text-brand-beige-muted/40 mx-auto" />
                <p>No orders currently in preparation.</p>
              </div>
            ) : (
              acceptedOrders.map((order) => (
                <ChefTicketCard
                  key={order.id}
                  order={order}
                  onAction={() => handleUpdateStatus(order.id, 'COMPLETED')}
                  actionLabel="Mark Completed"
                  actionColor="bg-emerald-600 hover:bg-emerald-700 text-white"
                />
              ))
            )}
          </div>
        </div>

        {/* Recently Served Footer Strip */}
        {completedOrders.length > 0 && (
          <div className="pt-6 border-t border-brand-green-light space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-brand-beige-muted px-1">
              Recently Completed Tickets
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {completedOrders.slice(0, 6).map((ord) => (
                <div
                  key={ord.id}
                  className="p-2.5 rounded-xl bg-brand-green/60 border border-brand-green-light text-xs space-y-1 opacity-70 hover:opacity-100 transition-opacity"
                >
                  <div className="flex justify-between font-mono font-bold">
                    <span>{ord.id}</span>
                    <span className="text-emerald-400">T{ord.tableNumber}</span>
                  </div>
                  <p className="text-[11px] text-brand-beige-muted truncate">
                    {ord.items.map((i) => i.name).join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function ChefTicketCard({
  order,
  onAction,
  actionLabel,
  actionColor,
}: {
  order: Order;
  onAction: () => void;
  actionLabel: string;
  actionColor: string;
}) {
  // Elapsed time calculation
  const elapsedMinutes = Math.floor(
    (Date.now() - new Date(order.createdAt).getTime()) / (60 * 1000)
  );

  return (
    <div className="p-4 rounded-2xl bg-brand-green border border-brand-green-light hover:border-brand-gold/40 shadow-md space-y-3 transition-all">
      {/* Ticket Header: Table # and Order ID */}
      <div className="flex items-start justify-between border-b border-brand-green-light/80 pb-2.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-brand-gold text-brand-green font-black text-base shadow-sm">
              TABLE {order.tableNumber.toString().padStart(2, '0')}
            </span>
            <span className="font-mono font-bold text-sm text-brand-beige">{order.id}</span>
          </div>
          <p className="text-[11px] text-brand-beige-muted mt-1">
            Guest: {order.customerName}
          </p>
        </div>

        {/* Elapsed Timer Badge */}
        <div
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
            elapsedMinutes > 20
              ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
              : elapsedMinutes > 10
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{elapsedMinutes}m ago</span>
        </div>
      </div>

      {/* SPECIAL INSTRUCTIONS (Highlighted in bold caution badge) */}
      {order.specialInstructions && (
        <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs flex items-start gap-2 font-semibold animate-pulse">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
          <div>
            <span className="uppercase tracking-wider font-black text-[10px] block text-amber-400">
              SPECIAL INSTRUCTION:
            </span>
            {order.specialInstructions}
          </div>
        </div>
      )}

      {/* Items List */}
      <div className="space-y-1.5 py-1">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="p-2 rounded-xl bg-brand-green-deep/60 border border-brand-green-light/40 flex items-start justify-between gap-2"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-brand-beige">{item.name}</span>
              </div>
              {item.selectedOptions && (
                <p className="text-[11px] text-brand-gold font-medium">
                  {Object.entries(item.selectedOptions)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(' • ')}
                </p>
              )}
              {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                <p className="text-[11px] text-amber-300 font-medium">
                  Addons: {item.selectedAddOns.join(', ')}
                </p>
              )}
              {item.specialInstructions && (
                <p className="text-[11px] italic text-amber-200">
                  Note: &ldquo;{item.specialInstructions}&rdquo;
                </p>
              )}
            </div>

            {/* Prominent Quantity Badge */}
            <span className="font-mono font-black text-base px-2.5 py-0.5 rounded-lg bg-brand-gold/20 text-brand-gold border border-brand-gold/30">
              ×{item.quantity}
            </span>
          </div>
        ))}
      </div>

      {/* Chef Workflow Action Button */}
      <div className="pt-2 border-t border-brand-green-light/80">
        <button
          type="button"
          onClick={onAction}
          className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] ${actionColor}`}
        >
          <span>{actionLabel}</span>
        </button>
      </div>
    </div>
  );
}
