'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/Button';
import { ChevronLeft, Minus, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';

export default function CartPage() {
  const params = useParams();
  const router = useRouter();
  const tableNumber = params.tableNumber as string;
  const { items, updateQuantity, removeItem, totalAmount, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setIsSubmitting(true);
    setError(null);
    try {
      // First, get the table ID from the table number
      const tableRes = await axios.get(`http://localhost:8080/api/tables/${tableNumber}`);
      const tableId = tableRes.data.id;

      // Submit the order
      const orderPayload = {
        table_id: tableId,
        items: items.map(item => ({
          menu_id: item.menu.id,
          quantity: item.quantity,
        })),
      };

      const orderRes = await axios.post('http://localhost:8080/api/orders', orderPayload);
      
      clearCart();
      router.push(`/${tableNumber}/order/${orderRes.data.id}`);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <Trash2 className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold mb-2 text-foreground">Your cart is empty</h2>
        <p className="text-slate-500 mb-6 text-center">Add some delicious items from our menu to get started.</p>
        <Button onClick={() => router.push(`/${tableNumber}`)}>
          Browse Menu
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-32">
      {/* Header */}
      <header className="sticky top-0 z-10 glass border-b border-border">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center">
          <button 
            onClick={() => router.back()}
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mr-2"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold tracking-tight">Checkout</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 border border-red-100 text-sm font-medium">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.menu.id} className="flex bg-card border border-border p-4 rounded-xl shadow-sm">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden flex-shrink-0">
                {item.menu.image_url && (
                  <img src={item.menu.image_url} alt={item.menu.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="ml-4 flex flex-col flex-1 justify-between">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-base line-clamp-1">{item.menu.name}</h3>
                  <button onClick={() => removeItem(item.menu.id)} className="text-slate-400 hover:text-red-500 ml-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-medium text-primary-600 dark:text-primary-400">
                    {formatPrice(item.menu.price)}
                  </span>
                  <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-800 rounded-md border border-border px-1 py-1">
                    <button 
                      onClick={() => updateQuantity(item.menu.id, item.quantity - 1)}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-4 text-center text-sm font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.menu.id, item.quantity + 1)}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-border pt-6 space-y-3">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal</span>
            <span>{formatPrice(totalAmount())}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Tax (10%)</span>
            <span>{formatPrice(totalAmount() * 0.1)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-3 border-t border-border">
            <span>Total</span>
            <span className="text-primary-600 dark:text-primary-400">{formatPrice(totalAmount() * 1.1)}</span>
          </div>
        </div>
      </main>

      {/* Floating Checkout Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-20">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={handleCheckout}
            disabled={isSubmitting}
            className="w-full h-14 text-lg"
          >
            {isSubmitting ? 'Processing...' : `Place Order • ${formatPrice(totalAmount() * 1.1)}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
