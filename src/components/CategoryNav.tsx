'use client';

import React, { useRef } from 'react';
import { MENU_CATEGORIES } from '@/data/vaan-vibes-menu';
import { useCart } from '@/context/CartContext';
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react';

export function CategoryNav() {
  const { activeCategory, setActiveCategory, searchQuery, setSearchQuery } = useCart();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -220 : 220;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-[57px] z-30 bg-brand-beige-light/95 backdrop-blur-md border-b border-brand-beige-muted/60 py-3 px-4 shadow-sm transition-all">
      <div className="max-w-6xl mx-auto space-y-2.5">
        {/* Search Bar */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-green/50">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search coffee, pizza, pasta, toasties, shakes..."
            className="w-full pl-10 pr-9 py-2 rounded-xl bg-white border border-brand-beige-dark text-brand-green placeholder:text-brand-green/40 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green shadow-xs transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-brand-green/50 hover:text-brand-green"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Categories Horizontal Carousel */}
        <div className="relative flex items-center">
          <button
            onClick={() => scroll('left')}
            className="hidden md:flex absolute -left-2 z-10 w-7 h-7 rounded-full bg-brand-green text-brand-beige items-center justify-center shadow-md hover:bg-brand-green-hover transition-all opacity-80 hover:opacity-100"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div
            ref={scrollRef}
            className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 w-full px-1"
          >
            {MENU_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.slug);
                    if (searchQuery) setSearchQuery('');
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all select-none shadow-xs ${
                    isActive
                      ? 'bg-brand-green text-brand-beige shadow-sm scale-105'
                      : 'bg-white text-brand-green hover:bg-brand-beige border border-brand-beige-dark/70 hover:border-brand-green/40'
                  }`}
                >
                  <span className="text-sm">{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => scroll('right')}
            className="hidden md:flex absolute -right-2 z-10 w-7 h-7 rounded-full bg-brand-green text-brand-beige items-center justify-center shadow-md hover:bg-brand-green-hover transition-all opacity-80 hover:opacity-100"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
