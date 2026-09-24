'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { TableInfo } from '@/types/cafe';
import {
  QrCode,
  ChefHat,
  LayoutDashboard,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  Phone,
  UtensilsCrossed,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

export default function HomePage() {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('T12');

  useEffect(() => {
    fetch('/api/tables')
      .then((r) => r.json())
      .then((d) => {
        if (d.tables) setTables(d.tables);
      })
      .catch(() => {});
  }, []);

  const activeTableObj = tables.find((t) => t.id === selectedTable) || tables[0];

  return (
    <div className="min-h-screen bg-brand-beige-light text-brand-green font-sans flex flex-col justify-between">
      {/* Top Brand Banner */}
      <header className="bg-brand-green text-brand-beige border-b border-brand-green-light py-3 px-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-gold text-brand-green font-bold flex items-center justify-center text-base shadow-sm">
              वा
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-brand-beige">
                वान VIBES
              </span>
              <span className="text-xs text-brand-gold ml-2 uppercase font-bold tracking-widest">
                Restro & Cafe
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-green-light hover:bg-brand-green-surface text-brand-beige transition-colors font-semibold"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-brand-gold" />
              <span>Cafe Dashboard</span>
            </Link>
            <Link
              href="/chef"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-green-light hover:bg-brand-green-surface text-brand-beige transition-colors font-semibold"
            >
              <ChefHat className="w-3.5 h-3.5 text-brand-gold" />
              <span>Chef KDS</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Hero & QR Demo Area */}
      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12 flex-1 w-full space-y-12">
        {/* Brand Hero */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-beige border border-brand-gold/40 text-brand-green text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            <span>Smart QR Dining & Kitchen Automation System</span>
          </div>

          <h1 className="font-black text-4xl sm:text-5xl lg:text-6xl text-brand-green tracking-tight leading-tight">
            वान VIBES <span className="text-brand-gold block text-2xl sm:text-3xl font-bold mt-1">RESTRO & CAFE</span>
          </h1>

          <p className="text-base sm:text-lg text-brand-green/70 leading-relaxed font-medium">
            Scan your table QR code to explore our curated artisanal menu, place instant orders, and track your food live from kitchen to table.
          </p>

          <p className="text-xs uppercase tracking-widest font-bold text-brand-gold">
            Taste the Vibe • Where Good Vibes Brew
          </p>
        </section>

        {/* 3 Core System Flows */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Customer QR Menu */}
          <div className="p-6 rounded-3xl bg-white border border-brand-beige-dark shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-beige text-brand-green flex items-center justify-center shadow-xs">
                <QrCode className="w-6 h-6 text-brand-green" />
              </div>
              <h2 className="font-extrabold text-xl text-brand-green">1. Customer QR Menu</h2>
              <p className="text-xs text-brand-green/70 leading-relaxed">
                Scan table QR, browse 19 authentic PDF categories, add to cart with customization options, enter customer details, and submit orders.
              </p>
            </div>

            {/* Quick Launch Table Picker */}
            <div className="space-y-2 pt-2 border-t border-brand-beige-dark/50">
              <label className="text-[11px] font-bold text-brand-green/60 uppercase tracking-wider block">
                Simulate Scan For Table:
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-brand-beige-light border border-brand-beige-dark text-xs font-bold text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green"
                >
                  {tables.map((t) => (
                    <option key={t.id} value={t.id}>
                      Table {t.tableNumber.toString().padStart(2, '0')} ({t.status})
                    </option>
                  ))}
                </select>

                {activeTableObj && (
                  <Link
                    href={activeTableObj.qrCodeUrl}
                    className="py-2 px-4 rounded-xl bg-brand-green hover:bg-brand-green-hover text-brand-beige font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
                  >
                    <span>Open</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Card 2: Cafe Management Dashboard */}
          <div className="p-6 rounded-3xl bg-white border border-brand-beige-dark shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-beige text-brand-green flex items-center justify-center shadow-xs">
                <LayoutDashboard className="w-6 h-6 text-brand-green" />
              </div>
              <h2 className="font-extrabold text-xl text-brand-green">2. Cafe Dashboard</h2>
              <p className="text-xs text-brand-green/70 leading-relaxed">
                Monitor incoming table orders in real time, manage payment statuses (Paid/Pending), generate digital invoices, and print receipts.
              </p>
            </div>

            <div className="pt-2 border-t border-brand-beige-dark/50">
              <Link
                href="/dashboard"
                className="w-full py-2.5 px-4 rounded-xl bg-brand-green hover:bg-brand-green-hover text-brand-beige font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <span>Launch Cafe Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 3: Chef Kitchen Display (KDS) */}
          <div className="p-6 rounded-3xl bg-brand-green text-brand-beige border border-brand-green-light shadow-md hover:shadow-lg transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-gold text-brand-green flex items-center justify-center shadow-xs">
                <ChefHat className="w-6 h-6 text-brand-green" />
              </div>
              <h2 className="font-extrabold text-xl text-brand-beige">3. Chef Kitchen KDS</h2>
              <p className="text-xs text-brand-beige-muted leading-relaxed">
                Kitchen-optimized display showing order tickets, highlighted customer dietary instructions, elapsed prep timers, and status updates.
              </p>
            </div>

            <div className="pt-2 border-t border-brand-green-light">
              <Link
                href="/chef"
                className="w-full py-2.5 px-4 rounded-xl bg-brand-gold hover:bg-brand-gold/90 text-brand-green font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <span>Launch Chef Display</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Cafe Information Strip */}
        <section className="p-6 rounded-3xl bg-white border border-brand-beige-dark shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-brand-green uppercase tracking-wider text-[11px]">
                Cafe Location
              </p>
              <p className="text-brand-green/70 mt-0.5">
                Main Promenade, Serenita Arts Quarter, Surat, Gujarat - 395007
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-brand-green uppercase tracking-wider text-[11px]">
                Operating Hours
              </p>
              <p className="text-brand-green/70 mt-0.5">
                Mon – Sun: 7:00 AM – 11:00 PM • Kitchen Service All Day
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-brand-green uppercase tracking-wider text-[11px]">
                Reservations & Inquiries
              </p>
              <p className="text-brand-green/70 mt-0.5">
                +91 98765 43210 • hello@vaanvibes.cafe
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-brand-green text-brand-beige border-t border-brand-green-light py-6 px-4 text-center text-xs text-brand-beige-muted">
        <div className="max-w-6xl mx-auto space-y-2">
          <p className="font-bold text-brand-beige">
            वान VIBES — Restro & Cafe • Taste the Vibe
          </p>
          <p className="text-[11px] text-brand-beige-muted">
            QR Ordering, Live Order Tracking & POS Billing • Built with Next.js 16 & General Sans
          </p>
        </div>
      </footer>
    </div>
  );
}
