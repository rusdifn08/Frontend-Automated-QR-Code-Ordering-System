'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MenuCard } from '@/components/MenuCard';
import { Menu } from '@/types';
import axios from 'axios';
import { useCartStore } from '@/store/cartStore';
import { ShoppingCart } from 'lucide-react';

export default function MenuPage() {
  const params = useParams();
  const router = useRouter();
  const tableNumber = params.tableNumber as string;
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const cartItemsCount = useCartStore((state) => state.totalItems());
  const cartTotalAmount = useCartStore((state) => state.totalAmount());

  useEffect(() => {
    // In a real app, you'd fetch from your backend URL (e.g., process.env.NEXT_PUBLIC_API_URL)
    // For local dev, we assume backend is at http://localhost:8080
    axios.get('http://localhost:8080/api/menus')
      .then((res) => {
        setMenus(res.data);
      })
      .catch((err) => {
        console.error("Error fetching menus:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 glass border-b border-border">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Table {tableNumber}</h1>
            <p className="text-xs text-slate-500 font-medium">Corporate Dining Experience</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={async () => {
                try {
                  await axios.post(`http://localhost:8080/api/tables/${tableNumber}/call-waiter`);
                  alert('Waiter has been called to your table!');
                } catch (err) {
                  alert('Failed to call waiter.');
                }
              }}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-primary-600 dark:text-primary-400"
              title="Call Waiter"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M22 17v1c0 .6-.4 1-1 1H3c-.6 0-1-.4-1-1v-1"/><path d="M4 17V8a8 8 0 1 1 16 0v9"/><path d="M12 4v4"/></svg>
            </button>
            <button 
              onClick={() => router.push(`/${tableNumber}/cart`)}
              className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary-600 border-2 border-white dark:border-slate-900 rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight mb-2">Our Menu</h2>
          <p className="text-slate-500 dark:text-slate-400">Discover our selection of premium corporate meals.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-card border border-border rounded-xl h-72"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {menus.map((menu) => (
              <MenuCard key={menu.id} menu={menu} />
            ))}
          </div>
        )}
      </main>

      {/* Floating Checkout Bar */}
      {cartItemsCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-20">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Total</p>
              <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                {formatPrice(cartTotalAmount)}
              </p>
            </div>
            <button
              onClick={() => router.push(`/${tableNumber}/cart`)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-md font-semibold transition-colors shadow-sm"
            >
              View Cart ({cartItemsCount})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
