'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { CafeHeader } from '@/components/CafeHeader';
import { CategoryNav } from '@/components/CategoryNav';
import { FoodCard } from '@/components/FoodCard';
import { CartDrawer } from '@/components/CartDrawer';
import { OrderConfirmationModal } from '@/components/OrderConfirmationModal';
import { OrderTrackingModal } from '@/components/OrderTrackingModal';
import { MENU_ITEMS, MENU_CATEGORIES } from '@/data/vaan-vibes-menu';
import { ShoppingBag, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export function MenuClient({ defaultCafeId }: { defaultCafeId?: string }) {
  const searchParams = useSearchParams();
  const tableParam = searchParams.get('table') || '';
  const tokenParam = searchParams.get('token') || '';

  const {
    setTable,
    table,
    activeCategory,
    searchQuery,
    itemCount,
    total,
    setIsCartOpen,
  } = useCart();

  const [isValidating, setIsValidating] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Validate QR token on mount
  useEffect(() => {
    async function validate() {
      setIsValidating(true);
      setValidationError(null);

      // If no query params provided, check if already in local storage or ask user to scan
      if (!tableParam || !tokenParam) {
        // Fallback to Table 01 for demo if no params
        try {
          const fallbackRes = await fetch('/api/qr/validate?table=T01&token=vv_sec_t01_2901c');
          const data = await fallbackRes.json();
          if (data.valid && data.table) {
            setTable(data.table);
            setIsValidating(false);
            return;
          }
        } catch {
          // ignore
        }
        setValidationError('No table QR parameters found. Please scan the official table standee.');
        setIsValidating(false);
        return;
      }

      try {
        const res = await fetch(`/api/qr/validate?table=${encodeURIComponent(tableParam)}&token=${encodeURIComponent(tokenParam)}`);
        const data = await res.json();

        if (!res.ok || !data.valid) {
          setValidationError(data.error || 'Invalid or expired QR code.');
          setIsValidating(false);
          return;
        }

        setTable(data.table);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Network error verifying QR code';
        setValidationError(msg);
      } finally {
        setIsValidating(false);
      }
    }

    validate();
  }, [tableParam, tokenParam, setTable]);

  // Filter items based on Category & Search Query
  const filteredItems = useMemo(() => {
    let items = MENU_ITEMS;

    // Filter by active category
    if (activeCategory && activeCategory !== 'all') {
      items = items.filter((i) => i.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q) ||
          (i.description && i.description.toLowerCase().includes(q))
      );
    }

    return items;
  }, [activeCategory, searchQuery]);

  // Group items by category when 'all' is selected and no search
  const groupedItems = useMemo(() => {
    if (activeCategory !== 'all' || searchQuery.trim()) return null;

    const groups: { category: (typeof MENU_CATEGORIES)[0]; items: typeof MENU_ITEMS }[] = [];
    for (const cat of MENU_CATEGORIES) {
      if (cat.id === 'all') continue;
      const matching = MENU_ITEMS.filter((i) => i.category === cat.slug);
      if (matching.length > 0) {
        groups.push({ category: cat, items: matching });
      }
    }
    return groups;
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-brand-beige-light flex flex-col font-sans pb-24">
      {/* Header with Table Indicator */}
      <CafeHeader />

      {/* QR Validation Error Alert */}
      {validationError && (
        <div className="max-w-6xl mx-auto px-4 mt-3 w-full">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="font-bold text-xs sm:text-sm">{validationError}</p>
                <p className="text-[11px] text-amber-700">
                  You can still browse the menu or simulate scanning a table below.
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="text-xs font-bold bg-amber-200 hover:bg-amber-300 text-amber-950 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap"
            >
              Simulate Table QR
            </Link>
          </div>
        </div>
      )}

      {/* Category Navigation & Search */}
      <CategoryNav />

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 pt-4 flex-1 w-full space-y-6">
        {/* Verified Table Greeting Card */}
        {table && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-green to-brand-green-surface text-brand-beige shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">☕</span>
                <h2 className="font-extrabold text-base sm:text-lg">
                  Welcome to Table {table.tableNumber.toString().padStart(2, '0')} at Vaan Vibes!
                </h2>
              </div>
              <p className="text-xs text-brand-beige-muted mt-0.5">
                Authentic handcrafted beverages, continental & indian delicacies. Order straight from your seat.
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-brand-gold/20 text-brand-gold border border-brand-gold/40 px-3 py-1 rounded-full text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Session</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isValidating ? (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-brand-green border-t-transparent animate-spin" />
            <p className="text-xs font-medium text-brand-green/60">Verifying table & loading menu...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          /* Empty Search State */
          <div className="py-16 text-center space-y-2">
            <p className="font-extrabold text-base text-brand-green">No matching items found</p>
            <p className="text-xs text-brand-green/60">
              Try searching with another keyword or pick a category from the navigation bar.
            </p>
          </div>
        ) : groupedItems ? (
          /* Grouped Categorized View (when 'All' is selected) */
          <div className="space-y-8">
            {groupedItems.map((group) => (
              <section key={group.category.id} className="space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-brand-beige-dark/60">
                  <span className="text-lg">{group.category.icon}</span>
                  <h3 className="font-extrabold text-base sm:text-lg text-brand-green">
                    {group.category.name}
                  </h3>
                  <span className="text-xs text-brand-green/50 font-semibold font-mono">
                    ({group.items.length})
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {group.items.map((item) => (
                    <FoodCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          /* Filtered Grid View */
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-brand-green/60 px-1">
              <span>Showing {filteredItems.length} delicious items</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredItems.map((item) => (
                <FoodCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Floating Sticky Cart Bar (Always accessible for mobile users) */}
      {itemCount > 0 && (
        <div className="fixed bottom-3 inset-x-0 z-40 px-4 max-w-lg mx-auto pointer-events-none">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="w-full py-3 px-5 rounded-2xl bg-brand-green hover:bg-brand-green-hover text-brand-beige flex items-center justify-between shadow-2xl border border-brand-gold/40 pointer-events-auto active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-brand-beige text-brand-green flex items-center justify-center font-bold text-xs">
                {itemCount}
              </div>
              <div className="text-left">
                <p className="font-extrabold text-xs sm:text-sm text-brand-beige">View Your Order</p>
                <p className="text-[11px] text-brand-beige-muted">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'} in cart
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-base text-brand-gold">
                ₹{total.toFixed(0)}
              </span>
              <div className="w-6 h-6 rounded-full bg-brand-gold text-brand-green flex items-center justify-center">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Modals & Drawers */}
      <CartDrawer />
      <OrderConfirmationModal />
      <OrderTrackingModal />
    </div>
  );
}
