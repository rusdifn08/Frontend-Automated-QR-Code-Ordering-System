'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Menu } from '@/types';
import axios from 'axios';
import { useCartStore } from '@/store/cartStore';
import { ShoppingCart, Wallet, BellRing, ChefHat, Search } from 'lucide-react';
import { MenuCard } from '@/components/MenuCard';

export default function MenuPage() {
  const params = useParams();
  const router = useRouter();
  const tableNumber = params.tableNumber as string;
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  const cartItemsCount = useCartStore((state) => state.totalItems());
  const cartTotalAmount = useCartStore((state) => state.totalAmount());
  const walletBalance = useCartStore((state) => state.walletBalance);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  useEffect(() => {
    axios.get(`${API_URL}/api/menus`)
      .then((res) => {
        setMenus(res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch menus', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [API_URL]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCallWaiter = async () => {
    try {
      await axios.post(`${API_URL}/api/tables/${tableNumber}/call-waiter`);
      alert('A waiter is on the way to your table!');
    } catch (err) {
      alert('Failed to call waiter.');
    }
  };

  const categories = ['All', ...Array.from(new Set(menus.map(m => m.category)))];
  
  const filteredMenus = activeCategory === 'All' 
    ? menus 
    : menus.filter(m => m.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-32 font-sans">
      
      {/* Hero Header */}
      <div className="bg-primary-600 dark:bg-primary-900 text-white rounded-b-3xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative px-6 pt-12 pb-8 max-w-4xl mx-auto">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md border border-white/30">
                Table {tableNumber}
              </span>
              <h1 className="text-3xl font-extrabold mt-3 flex items-center">
                <ChefHat className="w-8 h-8 mr-3" />
                Dine In
              </h1>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <button
                onClick={handleCallWaiter}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-3 rounded-full transition-all active:scale-95 border border-white/30 shadow-sm"
              >
                <BellRing className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Wallet Balance Display */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center mr-3 shadow-inner">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-primary-100 font-medium">Virtual Wallet Balance</p>
                <p className="text-lg font-bold">{formatPrice(walletBalance)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 mt-6">
        {/* Categories */}
        <div className="flex overflow-x-auto hide-scrollbar space-x-2 py-2 mb-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${
                activeCategory === cat 
                  ? 'bg-primary-600 text-white shadow-primary-600/30' 
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-white dark:bg-slate-900 rounded-3xl h-80"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredMenus.map((menu) => (
              <MenuCard key={menu.id} menu={menu} />
            ))}
          </div>
        )}
      </main>

      {/* Floating Sticky Cart Button */}
      {cartItemsCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-50 dark:from-slate-950 via-slate-50/90 dark:via-slate-950/90 to-transparent pb-6 z-20">
          <div className="max-w-md mx-auto">
            <button
              onClick={() => router.push(`/${tableNumber}/cart`)}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white rounded-2xl p-4 flex items-center justify-between shadow-xl shadow-primary-600/30 transition-transform active:scale-95"
            >
              <div className="flex items-center">
                <div className="relative mr-4">
                  <ShoppingCart className="w-6 h-6" />
                  <span className="absolute -top-2 -right-2 bg-white text-primary-600 text-xs font-black w-5 h-5 flex items-center justify-center rounded-full">
                    {cartItemsCount}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-xs text-primary-100 font-medium">Total Order</p>
                  <p className="font-bold text-lg leading-none">{formatPrice(cartTotalAmount)}</p>
                </div>
              </div>
              <span className="font-bold bg-white/20 px-4 py-2 rounded-xl text-sm">
                Checkout
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
