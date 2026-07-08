'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { QrCode, LayoutDashboard, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/Button';

export default function Home() {
  const router = useRouter();
  const tables = [1, 2, 3, 4, 5];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-foreground font-sans">
      {/* Hero Section */}
      <div className="bg-primary-600 dark:bg-primary-900 text-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <UtensilsCrossed className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Automated QR-Code Ordering System
          </h1>
          <p className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto">
            Scan a QR code to view our premium digital menu, place orders directly to the kitchen, and pay securely from your table.
          </p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-16">
        
        {/* Customer Section */}
        <section className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">Simulate Customer Order</h2>
            <p className="text-slate-500">Select a QR code below to simulate scanning from different tables.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {tables.map((table) => (
              <div 
                key={table}
                onClick={() => router.push(`/${table}`)}
                className="bg-card border border-border rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg hover:border-primary-500 transition-all group"
              >
                <div className="relative w-32 h-32 mb-4 group-hover:scale-105 transition-transform">
                  <Image
                    src={`/assets/qrcodes/table_${table}.png`}
                    alt={`Table ${table} QR Code`}
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="font-bold text-lg text-primary-600 dark:text-primary-400">Table {table}</h3>
                <span className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-wider">Click to Scan</span>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="h-px bg-border w-full my-16" />

        {/* Admin Section */}
        <section className="bg-card border border-border rounded-2xl p-10 flex flex-col md:flex-row items-center justify-between shadow-sm">
          <div className="mb-6 md:mb-0 md:mr-8 text-center md:text-left">
            <h2 className="text-2xl font-bold mb-2 flex items-center justify-center md:justify-start">
              <LayoutDashboard className="w-6 h-6 mr-3 text-primary-600" />
              Restaurant Management
            </h2>
            <p className="text-slate-500 max-w-md">
              Access the Kitchen Display System (KDS) and System Metrics Dashboard to monitor live incoming orders and server health.
            </p>
          </div>
          <Button 
            onClick={() => router.push('/admin/login')}
            className="w-full md:w-auto px-8 h-12 text-base font-semibold"
          >
            Enter Admin Portal
          </Button>
        </section>

      </main>
      
      {/* Footer */}
      <footer className="text-center py-8 text-slate-400 text-sm">
        &copy; 2026 QR-Code Ordering System. Built for Vercel & Render.
      </footer>
    </div>
  );
}
