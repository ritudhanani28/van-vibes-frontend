'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Clock, Search } from 'lucide-react';
import Link from 'next/link';

export function CafeHeader() {
  const { isHydrated, table, itemCount, total, setIsCartOpen, activeOrders, setIsOrdersOpen, setIsSearchOpen } = useCart();

  return (
    <header className="w-full bg-brand-green text-brand-beige border-b border-brand-green-light/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-2.5 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-1.5 sm:gap-3">
        {/* Logo & Cafe Identity */}
        <Link href="/" className="flex items-center gap-1.5 sm:gap-2.5 group min-w-0 flex-1">
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-brand-beige text-brand-green font-black flex items-center justify-center text-sm sm:text-lg shadow-sm border border-brand-gold shrink-0">
            व
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="font-black text-sm sm:text-lg tracking-tight text-brand-beige whitespace-nowrap">
                वन VIBES
              </span>
              <span className="text-[8px] sm:text-[9px] uppercase font-bold tracking-wider px-1 py-0.5 rounded bg-brand-gold text-brand-green whitespace-nowrap">
                Cafe & Restro
              </span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-brand-beige-muted tracking-wide uppercase font-medium truncate max-w-[120px] xs:max-w-[180px] sm:max-w-none">
              Taste the Vibe
            </p>
          </div>
        </Link>

        {/* Table Badge & Action Pills */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Active Table Pill */}
          {isHydrated && table ? (
            <div className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full bg-brand-green-light border border-brand-gold/40 text-brand-beige text-[11px] sm:text-xs font-semibold shadow-inner shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Table </span>
              <span>{table.tableNumber}</span>
            </div>
          ) : (
            <div className="px-2 py-0.5 rounded bg-brand-green-surface text-brand-beige-muted text-[10px] sm:text-xs shrink-0">
              No Table
            </div>
          )}

          {/* Active Orders Tracker Pill */}
          {isHydrated && activeOrders.length > 0 && (
            <button
              onClick={() => setIsOrdersOpen(true)}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full bg-brand-gold/20 text-brand-gold hover:bg-brand-gold/30 border border-brand-gold/40 text-xs font-medium transition-all shrink-0 min-h-[32px] sm:min-h-[36px]"
              title="Track Active Orders"
            >
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="hidden md:inline">Active</span>
              <span className="bg-brand-gold text-brand-green font-bold text-[10px] sm:text-xs px-1.5 py-0.2 rounded-full">
                {activeOrders.length}
              </span>
            </button>
          )}

          {/* Quick Search Trigger Button */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-green-light hover:bg-brand-green-surface text-brand-beige flex items-center justify-center transition-all shrink-0 border border-brand-gold/30 hover:border-brand-gold min-h-[32px] min-w-[32px] sm:min-h-[36px] sm:min-w-[36px] active:scale-95"
            aria-label="Search Menu"
            title="Search Coffee, Drinks & Food"
          >
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-beige" />
          </button>

          {/* Cart Floating Pill */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-brand-beige text-brand-green hover:bg-brand-beige-dark font-bold text-xs sm:text-sm transition-all shadow-sm active:scale-95 shrink-0 min-h-[32px] sm:min-h-[36px]"
            aria-label="View Cart"
          >
            <div className="relative">
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-brand-terracotta text-white font-black text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center shadow">
                  {itemCount}
                </span>
              )}
            </div>
            <span className="hidden xs:inline">Cart</span>
            {itemCount > 0 && (
              <span className="text-[11px] sm:text-xs font-mono font-bold border-l border-brand-green/20 pl-1 sm:pl-1.5">
                ₹{total.toFixed(0)}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
