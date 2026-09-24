'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag, UtensilsCrossed } from 'lucide-react';

export function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    tax,
    total,
    itemCount,
    table,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-brand-green-deep/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-brand-beige-dark animate-in slide-in-from-right duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-5 py-4 bg-brand-green text-brand-beige flex items-center justify-between border-b border-brand-green-light">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-brand-gold" />
            <div>
              <h2 className="font-extrabold text-lg">My Cart</h2>
              <p className="text-xs text-brand-beige-muted">
                {table ? `Table ${table.tableNumber.toString().padStart(2, '0')}` : 'Dining Order'} • {itemCount} items
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 rounded-full bg-brand-green-light hover:bg-brand-green-surface text-brand-beige flex items-center justify-center transition-all"
            aria-label="Close cart"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-brand-beige flex items-center justify-center text-brand-green">
                <UtensilsCrossed className="w-8 h-8 opacity-40" />
              </div>
              <div className="space-y-1">
                <p className="font-extrabold text-base text-brand-green">Your cart is empty</p>
                <p className="text-xs text-brand-green/60">
                  Explore our artisanal coffees, fresh toasties, and chef specials!
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-5 py-2.5 rounded-full bg-brand-green text-brand-beige font-bold text-xs hover:bg-brand-green-hover transition-all"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between px-1 pb-1 border-b border-brand-beige-dark/50">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-green/50">
                  Selected Items
                </span>
                <button
                  onClick={clearCart}
                  className="text-[11px] font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3 h-3" /> Clear Cart
                </button>
              </div>

              {cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-brand-beige-light border border-brand-beige-dark/70 flex flex-col gap-2.5 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-brand-green leading-snug">
                        {item.name}
                      </h4>
                      {/* Options & Addons display */}
                      {item.selectedOptions && (
                        <p className="text-[11px] text-brand-green/60 font-medium">
                          {Object.entries(item.selectedOptions)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(' • ')}
                        </p>
                      )}
                      {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                        <p className="text-[11px] text-brand-gold font-medium">
                          Extras: {item.selectedAddOns.join(', ')}
                        </p>
                      )}
                      {item.specialInstructions && (
                        <p className="text-[11px] italic text-brand-green/70">
                          Note: &ldquo;{item.specialInstructions}&rdquo;
                        </p>
                      )}
                    </div>
                    <span className="font-mono font-bold text-sm text-brand-green whitespace-nowrap">
                      ₹{(item.price * item.quantity).toFixed(0)}
                    </span>
                  </div>

                  {/* Quantity and unit price */}
                  <div className="flex items-center justify-between pt-1 border-t border-brand-beige-dark/40">
                    <span className="text-[11px] text-brand-green/50 font-mono">
                      ₹{item.price} each
                    </span>

                    <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-full border border-brand-beige-dark shadow-2xs">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-5 h-5 rounded-full hover:bg-brand-beige flex items-center justify-center text-brand-green transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono font-bold text-xs w-4 text-center text-brand-green">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-5 h-5 rounded-full hover:bg-brand-beige flex items-center justify-center text-brand-green transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-5 h-5 ml-1 text-red-500 hover:text-red-700 flex items-center justify-center transition-colors"
                        aria-label="Remove item"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Cart Footer & Calculations */}
        {cart.length > 0 && (
          <div className="p-4 bg-white border-t border-brand-beige-dark/70 space-y-3 shadow-lg">
            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs text-brand-green/80">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono font-semibold">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & GST (5%)</span>
                <span className="font-mono font-semibold">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-extrabold text-base text-brand-green pt-1.5 border-t border-brand-beige-dark">
                <span>Total Amount</span>
                <span className="font-mono text-brand-green">₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="py-2.5 px-3 rounded-xl border border-brand-green text-brand-green hover:bg-brand-beige-light font-bold text-xs text-center transition-all"
              >
                Continue Ordering
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="py-2.5 px-3 rounded-xl bg-brand-green hover:bg-brand-green-hover text-brand-beige font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <span>Proceed to Order</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
