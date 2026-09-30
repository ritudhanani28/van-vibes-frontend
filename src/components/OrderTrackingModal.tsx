'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Order, OrderStatus } from '@/types/cafe';
import {
  X,
  CheckCircle2,
  Clock,
  ChefHat,
  Sparkles,
  Utensils,
  PlusCircle,
  XCircle,
  AlertTriangle,
  AlertCircle,
  Loader2,
} from 'lucide-react';

const STATUS_STEPS: { status: OrderStatus; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { status: 'PLACED', label: 'Order Placed', icon: Clock },
  { status: 'ACCEPTED', label: 'Order Accepted', icon: ChefHat },
  { status: 'COMPLETED', label: 'Completed', icon: Sparkles },
];

function getStatusStepIndex(status: OrderStatus): number {
  switch (status) {
    case 'PLACED':
    case 'ORDER_PLACED':
      return 0;
    case 'ACCEPTED':
    case 'IN_KITCHEN':
    case 'PREPARING':
    case 'SERVED':
    case 'READY':
      return 1;
    case 'COMPLETED':
      return 2;
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

  // Cancel Confirmation Popup State
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [cancelSuccess, setCancelSuccess] = useState<string | null>(null);

  const handleOpenCancelConfirmation = (order: Order) => {
    setOrderToCancel(order);
    setCancelError(null);
  };

  const handleCloseCancelConfirmation = () => {
    if (!isCancelling) {
      setOrderToCancel(null);
      setCancelError(null);
    }
  };

  const handleConfirmCancelOrder = async () => {
    if (!orderToCancel) return;
    setIsCancelling(true);
    setCancelError(null);

    try {
      const res = await fetch(`/api/orders/${orderToCancel.id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Customer requested cancellation' }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const errorMsg =
          data.error ||
          data.detail ||
          data.message ||
          'Cannot cancel this order. It may have already been accepted by the kitchen.';
        setCancelError(errorMsg);
        // Refresh orders immediately so the UI reflects that it was accepted or progressed
        await fetchOrders();
        setIsCancelling(false);
        return;
      }

      // Successful cancellation
      await fetchOrders();
      setCancelSuccess(`Order #${orderToCancel.id} has been cancelled successfully.`);
      setTimeout(() => setCancelSuccess(null), 4500);
      setOrderToCancel(null);
      setIsCancelling(false);
      // Switch to previous tab to let customer view their cancelled order
      setActiveTab('previous');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error while cancelling order';
      setCancelError(msg);
      setIsCancelling(false);
    }
  };

  if (!isOrdersOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-brand-green-deep/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div
          className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-brand-beige-dark overflow-hidden flex flex-col max-h-[92dvh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-4 sm:px-5 py-3 sm:py-4 bg-brand-green text-brand-beige flex items-center justify-between border-b border-brand-green-light shrink-0">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <Clock className="w-5 h-5 text-brand-gold shrink-0" />
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-brand-beige">Order Status & History</h3>
                <p className="text-[11px] sm:text-xs text-brand-beige-muted">
                  {table ? `Table ${table.tableNumber}` : 'Dining Orders'} • Vaan Vibes Cafe & Restro
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOrdersOpen(false)}
              className="w-8 h-8 rounded-full bg-brand-green-light hover:bg-brand-green-surface text-brand-beige flex items-center justify-center transition-all shrink-0 min-h-[36px]"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Success Banner */}
          {cancelSuccess && (
            <div className="mx-4 mt-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{cancelSuccess}</span>
              </div>
              <button
                type="button"
                onClick={() => setCancelSuccess(null)}
                className="text-emerald-500 hover:text-emerald-700 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex border-b border-brand-beige-dark/60 bg-brand-beige-light shrink-0 mt-1">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 py-2.5 text-center text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition-all min-h-[40px] ${
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
              className={`flex-1 py-2.5 text-center text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition-all min-h-[40px] ${
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
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-3.5 sm:space-y-4">
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
                    className="mt-2 px-5 py-2.5 rounded-full bg-brand-green text-brand-beige font-bold text-xs hover:bg-brand-green-hover transition-all min-h-[40px]"
                  >
                    Browse Menu & Order Food
                  </button>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {activeOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onRequestCancel={handleOpenCancelConfirmation}
                    />
                  ))}
                </div>
              )
            ) : previousOrders.length === 0 ? (
              <div className="py-12 text-center text-xs text-brand-green/60">
                No past orders recorded for this session.
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {previousOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onRequestCancel={handleOpenCancelConfirmation}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Bottom Bar: Place Another Order */}
          <div className="p-3.5 sm:p-4 bg-brand-beige-light border-t border-brand-beige-dark/70 flex items-center justify-between gap-3 shrink-0 pb-[calc(0.875rem+env(safe-area-inset-bottom,0px))]">
            <button
              onClick={() => setIsOrdersOpen(false)}
              className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-brand-green hover:bg-brand-green-hover text-brand-beige font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 min-h-[44px]"
            >
              <PlusCircle className="w-4 h-4 text-brand-gold shrink-0" />
              <span>Place Another Order (Keep Browsing Menu)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* CANCEL ORDER CONFIRMATION MODAL POPUP */}
      {/* ============================================================== */}
      {orderToCancel && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={handleCloseCancelConfirmation}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-brand-beige-dark overflow-hidden p-6 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Icon & Title */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-lg text-brand-green leading-tight">
                  Cancel Order?
                </h4>
                <p className="text-xs text-brand-green/60 font-mono mt-0.5">
                  Order #{orderToCancel.id}
                </p>
              </div>
            </div>

            {/* Error Message if backend rejects (e.g. accepted by kitchen) */}
            {cancelError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                <span className="leading-relaxed">{cancelError}</span>
              </div>
            )}

            {/* Warning details */}
            <div className="bg-brand-beige-light/70 p-3.5 rounded-2xl border border-brand-beige-dark/60 text-xs text-brand-green/80 space-y-2">
              <div className="flex justify-between items-center text-brand-green font-bold text-xs">
                <span>Table {orderToCancel.tableNumber}</span>
                <span className="font-mono">Total: ₹{orderToCancel.total.toFixed(2)}</span>
              </div>
              <p className="text-[11px] text-brand-green/70 leading-relaxed">
                Orders can only be cancelled <span className="font-bold text-brand-green">before</span> they are accepted by the kitchen. Once accepted, preparation starts and the order cannot be cancelled.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={isCancelling}
                onClick={handleCloseCancelConfirmation}
                className="flex-1 py-2.5 px-4 rounded-xl border border-brand-beige-dark font-bold text-xs text-brand-green/70 hover:bg-brand-beige transition-colors disabled:opacity-50 cursor-pointer min-h-[40px]"
              >
                Keep Order
              </button>
              <button
                type="button"
                disabled={isCancelling}
                onClick={handleConfirmCancelOrder}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px]"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Cancelling...</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Yes, Cancel</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function OrderCard({
  order,
  onRequestCancel,
}: {
  order: Order;
  onRequestCancel: (order: Order) => void;
}) {
  const currentStep = getStatusStepIndex(order.status);
  const isCancelled = order.status === 'CANCELLED';

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-brand-beige-dark/80 shadow-xs space-y-3.5 sm:space-y-4">
      {/* Order Top Bar */}
      <div className="flex items-start justify-between gap-2 border-b border-brand-beige-dark/40 pb-2.5 sm:pb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-extrabold text-sm sm:text-base text-brand-green">{order.id}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-beige text-brand-green border border-brand-beige-dark whitespace-nowrap">
              Table {order.tableNumber}
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-brand-green/60 mt-0.5">
            Placed at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Cancel Button: ONLY visible and active when order is PLACED / ORDER_PLACED (till accepted by kitchen/admin). */}
        {(order.status === 'PLACED' || order.status === 'ORDER_PLACED') && (
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => onRequestCancel(order)}
              className="px-2.5 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-bold text-[11px] flex items-center gap-1 transition-all active:scale-95 shadow-2xs min-h-[32px] cursor-pointer"
              title="Cancel order before it is accepted by kitchen"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Cancel Order</span>
            </button>
          </div>
        )}
      </div>


      {/* Status Progress Stepper */}
      {!isCancelled ? (
        <div className="p-3 sm:p-4 rounded-2xl bg-brand-beige-light/70 border border-brand-beige-dark/70 space-y-3 sm:space-y-3.5">
          <div className="flex items-center justify-between text-xs font-bold px-0.5">
            <span className="text-brand-green/70">Current Status:</span>
            <span
              className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-black tracking-wide uppercase border shadow-2xs ${
                order.status === 'COMPLETED'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : order.status === 'ACCEPTED' || order.status === 'IN_KITCHEN' || order.status === 'PREPARING' || order.status === 'SERVED' || order.status === 'READY'
                  ? 'bg-blue-50 text-blue-800 border-blue-300'
                  : 'bg-amber-50 text-amber-900 border-amber-300'
              }`}
            >
              {order.status === 'PLACED' || order.status === 'ORDER_PLACED'
                ? 'Order Placed'
                : order.status === 'ACCEPTED' || order.status === 'IN_KITCHEN' || order.status === 'PREPARING' || order.status === 'SERVED' || order.status === 'READY'
                ? 'Order Accepted'
                : order.status === 'COMPLETED'
                ? 'Completed'
                : order.status.replace('_', ' ')}
            </span>
          </div>

          {/* Stepper Flow: Labels ONLY ABOVE the Circles */}
          <div className="relative pt-1 pb-1">
            {/* Connecting Track Line behind circles */}
            <div className="absolute bottom-[20px] sm:bottom-[24px] md:bottom-[28px] left-[16.66%] right-[16.66%] h-1 bg-brand-beige-dark/80 rounded-full z-0 -translate-y-1/2">
              <div
                className="h-full bg-brand-green rounded-full transition-all duration-500 ease-out"
                style={{
                  width:
                    currentStep === 0
                      ? '0%'
                      : currentStep === 1
                      ? '50%'
                      : '100%',
                }}
              />
            </div>

            {/* 3 Step Columns: PLACED -> ACCEPTED -> COMPLETED */}
            <div className="grid grid-cols-3 relative z-10">
              {STATUS_STEPS.map((step, idx) => {
                const isPast = idx < currentStep;
                const isCurrent = idx === currentStep;
                const Icon = step.icon;

                return (
                  <div key={step.status} className="flex flex-col items-center text-center">
                    {/* Status Text strictly ABOVE Circle Indicator */}
                    <div className="min-h-[28px] sm:min-h-[34px] flex items-center justify-center mb-1.5 sm:mb-2.5 px-0.5">
                      <span
                        className={`text-[10px] sm:text-xs md:text-sm font-extrabold tracking-tight transition-colors leading-tight ${
                          isCurrent
                            ? 'text-brand-green scale-105'
                            : isPast
                            ? 'text-emerald-700'
                            : 'text-brand-green/40'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>

                    {/* Prominent Flow Circle Indicator */}
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCurrent
                          ? 'bg-brand-green text-brand-gold ring-3 sm:ring-4 ring-brand-gold/40 shadow-lg scale-105 ring-offset-2 ring-offset-white'
                          : isPast
                          ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/30'
                          : 'bg-white text-brand-green/30 border-2 border-brand-beige-dark shadow-2xs'
                      }`}
                    >
                      {isPast ? (
                        <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                      ) : (
                        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 ${isCurrent ? 'animate-pulse' : ''}`} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-bold text-center border border-red-200">
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
                ₹{(item.itemTotal ?? (item.unitPrice ?? item.price ?? 0) * item.quantity).toFixed(0)}
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
