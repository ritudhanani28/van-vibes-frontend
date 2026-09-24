'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Clock, Sparkles } from 'lucide-react';
import Link from 'next/link';

export function CafeHeader() {
  const { table, itemCount, total, setIsCartOpen, activeOrders, setIsOrdersOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-brand-green text-brand-beige border-b border-brand-green-light shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo & Cafe Identity */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-brand-beige text-brand-green font-bold flex items-center justify-center text-lg shadow-sm border border-brand-gold">
            वा
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-brand-beige">
                वान VIBES
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-brand-gold text-brand-green">
                Cafe
              </span>
            </div>
            <p className="text-[11px] text-brand-beige-muted tracking-wider uppercase font-medium">
              Restro & Cafe • Taste the Vibe
            </p>
          </div>
        </Link>

        {/* Table Badge & Action Pills */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Table Pill */}
          {table ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-green-light border border-brand-gold/40 text-brand-beige text-xs sm:text-sm font-semibold shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Table {table.tableNumber.toString().padStart(2, '0')}</span>
            </div>
          ) : (
            <div className="px-2.5 py-1 rounded bg-brand-green-surface text-brand-beige-muted text-xs">
              No Table
            </div>
          )}

          {/* Active Orders Tracker Pill */}
          {activeOrders.length > 0 && (
            <button
              onClick={() => setIsOrdersOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-gold/20 text-brand-gold hover:bg-brand-gold/30 border border-brand-gold/40 text-xs sm:text-sm font-medium transition-all"
              title="Track Active Orders"
            >
              <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="hidden sm:inline">Active Orders</span>
              <span className="bg-brand-gold text-brand-green font-bold text-xs px-1.5 py-0.2 rounded-full">
                {activeOrders.length}
              </span>
            </button>
          )}

          {/* Cart Floating Pill */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-beige text-brand-green hover:bg-brand-beige-dark font-bold text-xs sm:text-sm transition-all shadow-sm active:scale-95"
            aria-label="View Cart"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-terracotta text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {itemCount}
                </span>
              )}
            </div>
            <span className="hidden xs:inline">Cart</span>
            {itemCount > 0 && (
              <span className="text-xs font-mono font-bold border-l border-brand-green/20 pl-2">
                ₹{total.toFixed(0)}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
