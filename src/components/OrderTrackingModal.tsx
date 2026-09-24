'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Order, OrderStatus } from '@/types/cafe';
import { X, CheckCircle2, Clock, ChefHat, Sparkles, Utensils, FileText, PlusCircle, RefreshCw } from 'lucide-react';
import { BillModal } from './BillModal';

const STATUS_STEPS: { status: OrderStatus; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { status: 'ORDER_PLACED', label: 'Order Placed', icon: Clock },
  { status: 'ACCEPTED', label: 'Accepted', icon: CheckCircle2 },
  { status: 'PREPARING', label: 'Preparing', icon: ChefHat },
  { status: 'READY', label: 'Ready', icon: Sparkles },
  { status: 'SERVED', label: 'Served', icon: Utensils },
];

function getStatusStepIndex(status: OrderStatus): number {
  switch (status) {
    case 'ORDER_PLACED':
      return 0;
    case 'ACCEPTED':
      return 1;
    case 'PREPARING':
      return 2;
    case 'READY':
      return 3;
    case 'SERVED':
    case 'COMPLETED':
      return 4;
    default:
      return 0;
  }
}

export function OrderTrackingModal() {
  const {
    isOrdersOpen,
    setIsOrdersOpen,
    activeOrders,
    previousOrders,
    fetchOrders,
    table,
  } = useCart();

  const [activeTab, setActiveTab] = useState<'active' | 'previous'>('active');
  const [selectedBillOrderId, setSelectedBillOrderId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isOrdersOpen) return null;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchOrders();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-green-deep/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div
          className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-brand-beige-dark overflow-hidden flex flex-col max-h-[92vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-5 py-4 bg-brand-green text-brand-beige flex items-center justify-between border-b border-brand-green-light">
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-brand-gold" />
              <div>
                <h3 className="font-extrabold text-lg text-brand-beige">Order Status & History</h3>
                <p className="text-xs text-brand-beige-muted">
                  {table ? `Table ${table.tableNumber.toString().padStart(2, '0')}` : 'Dining Orders'} • Vaan Vibes
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRefresh}
                className="w-8 h-8 rounded-full bg-brand-green-light hover:bg-brand-green-surface text-brand-beige flex items-center justify-center transition-all"
                title="Refresh Status"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              <button
                type="button"
                onClick={() => setIsOrdersOpen(false)}
                className="w-8 h-8 rounded-full bg-brand-green-light hover:bg-brand-green-surface text-brand-beige flex items-center justify-center transition-all"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-brand-beige-dark/60 bg-brand-beige-light">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 py-2.5 text-center text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'active'
                  ? 'border-brand-green text-brand-green bg-white'
                  : 'border-transparent text-brand-green/60 hover:text-brand-green'
              }`}
            >
              <span>Active Orders</span>
              {activeOrders.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-brand-green text-brand-beige text-[11px] flex items-center justify-center font-bold">
                  {activeOrders.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('previous')}
              className={`flex-1 py-2.5 text-center text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'previous'
                  ? 'border-brand-green text-brand-green bg-white'
                  : 'border-transparent text-brand-green/60 hover:text-brand-green'
              }`}
            >
              <span>Previous Orders</span>
              {previousOrders.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-brand-beige-dark text-brand-green text-[11px] flex items-center justify-center font-bold">
                  {previousOrders.length}
                </span>
              )}
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {activeTab === 'active' ? (
              activeOrders.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-brand-beige flex items-center justify-center text-brand-green/50">
                    <Utensils className="w-7 h-7" />
                  </div>
                  <p className="font-extrabold text-base text-brand-green">No active orders right now</p>
                  <p className="text-xs text-brand-green/60 max-w-xs">
                    Ready to taste something delightful? Browse our menu and place an order!
                  </p>
                  <button
                    onClick={() => setIsOrdersOpen(false)}
                    className="mt-2 px-5 py-2.5 rounded-full bg-brand-green text-brand-beige font-bold text-xs hover:bg-brand-green-hover transition-all"
                  >
                    Browse Menu & Order Food
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onViewBill={() => setSelectedBillOrderId(order.id)}
                    />
                  ))}
                </div>
              )
            ) : previousOrders.length === 0 ? (
              <div className="py-12 text-center text-xs text-brand-green/60">
                No past orders recorded for this session.
              </div>
            ) : (
              <div className="space-y-4">
                {previousOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onViewBill={() => setSelectedBillOrderId(order.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Bottom Bar: Place Another Order */}
          <div className="p-4 bg-brand-beige-light border-t border-brand-beige-dark/70 flex items-center justify-between gap-3">
            <button
              onClick={() => setIsOrdersOpen(false)}
              className="w-full py-3 px-4 rounded-xl bg-brand-green hover:bg-brand-green-hover text-brand-beige font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98"
            >
              <PlusCircle className="w-4 h-4 text-brand-gold" />
              <span>Place Another Order (Keep Browsing Menu)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bill Modal */}
      {selectedBillOrderId && (
        <BillModal
          orderId={selectedBillOrderId}
          onClose={() => setSelectedBillOrderId(null)}
        />
      )}
    </>
  );
}

function OrderCard({ order, onViewBill }: { order: Order; onViewBill: () => void }) {
  const currentStep = getStatusStepIndex(order.status);
  const isCancelled = order.status === 'CANCELLED';

  return (
    <div className="p-4 rounded-2xl bg-white border border-brand-beige-dark/80 shadow-xs space-y-4">
      {/* Order Top Bar */}
      <div className="flex items-start justify-between gap-2 border-b border-brand-beige-dark/40 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base text-brand-green">{order.id}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-beige text-brand-green border border-brand-beige-dark">
              Table {order.tableNumber.toString().padStart(2, '0')}
            </span>
          </div>
          <p className="text-[11px] text-brand-green/60 mt-0.5">
            Placed at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        <button
          onClick={onViewBill}
          className="flex items-center gap-1 text-[11px] font-bold text-brand-green hover:text-brand-green-hover bg-brand-beige-light px-2.5 py-1.5 rounded-lg border border-brand-beige-dark transition-all"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Bill / Receipt</span>
        </button>
      </div>

      {/* Status Progress Stepper */}
      {!isCancelled ? (
        <div className="space-y-2 py-1">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-brand-green/60">Current Status:</span>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wide">
              {order.status.replace('_', ' ')}
            </span>
          </div>

          {/* Stepper Bar */}
          <div className="grid grid-cols-5 gap-1.5 pt-1">
            {STATUS_STEPS.map((step, idx) => {
              const isPast = idx < currentStep;
              const isCurrent = idx === currentStep;
              const Icon = step.icon;

              return (
                <div key={step.status} className="flex flex-col items-center gap-1 text-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-brand-green text-brand-gold ring-2 ring-brand-gold shadow-xs animate-bounce'
                        : isPast
                        ? 'bg-emerald-600 text-white'
                        : 'bg-brand-beige-light text-brand-green/30 border border-brand-beige-dark'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span
                    className={`text-[9px] font-bold leading-tight ${
                      isCurrent
                        ? 'text-brand-green'
                        : isPast
                        ? 'text-emerald-700'
                        : 'text-brand-green/30'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-2.5 rounded-xl bg-red-50 text-red-700 text-xs font-bold text-center">
          Order Cancelled
        </div>
      )}

      {/* Items list */}
      <div className="space-y-1.5 pt-2 border-t border-brand-beige-dark/40">
        <span className="text-[10px] uppercase font-bold text-brand-green/40 tracking-wider">
          Ordered Items
        </span>
        <div className="divide-y divide-brand-beige-dark/30 text-xs">
          {order.items.map((item) => (
            <div key={item.id} className="py-1.5 flex justify-between">
              <div>
                <span className="font-bold text-brand-green">{item.name}</span>
                <span className="text-brand-green/60 font-mono ml-1.5">× {item.quantity}</span>
                {item.selectedOptions && (
                  <span className="text-[10px] text-brand-green/60 block">
                    {Object.values(item.selectedOptions).join(', ')}
                  </span>
                )}
                {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                  <span className="text-[10px] text-brand-gold block">
                    {item.selectedAddOns.join(', ')}
                  </span>
                )}
              </div>
              <span className="font-mono font-bold text-brand-green">
                ₹{(item.price * item.quantity).toFixed(0)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-2 border-t border-brand-beige-dark/50 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-brand-green/50">Payment:</span>
          <span
            className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
              order.paymentStatus === 'PAID'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {order.paymentStatus}
          </span>
        </div>
        <div className="font-mono font-black text-sm text-brand-green">
          Total: ₹{order.total.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
