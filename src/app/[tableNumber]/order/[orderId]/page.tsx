'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CheckCircle, ChefHat, Clock, Utensils } from 'lucide-react';
import axios from 'axios';

interface OrderItem {
  id: string;
  menu: { name: string; price: number };
  quantity: number;
  subtotal: number;
}

interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  items: OrderItem[];
}

export default function OrderStatusPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const tableNumber = params.tableNumber as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/orders/${orderId}`);
      setOrder(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // Poll every 5 seconds for status updates
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        Order not found.
      </div>
    );
  }

  const steps = [
    { id: 'pending', icon: <Clock className="w-6 h-6" />, label: 'Received' },
    { id: 'preparing', icon: <ChefHat className="w-6 h-6" />, label: 'Preparing' },
    { id: 'served', icon: <Utensils className="w-6 h-6" />, label: 'Served' },
    { id: 'paid', icon: <CheckCircle className="w-6 h-6" />, label: 'Completed' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === order.status) >= 0 
    ? steps.findIndex(s => s.id === order.status) 
    : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight">Order Status</h1>
          <p className="text-slate-500 mt-2">Table {tableNumber} • Order #{orderId.split('-')[0]}</p>
        </div>

        {/* Status Tracker */}
        <div className="bg-card border border-border p-8 rounded-2xl shadow-sm mb-8">
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 z-0 rounded-full"></div>
            <div 
              className="absolute top-1/2 left-0 h-1 bg-primary-500 -translate-y-1/2 z-0 rounded-full transition-all duration-500"
              style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
            ></div>

            <div className="relative z-10 flex justify-between">
              {steps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div 
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-colors ${
                        isCompleted 
                          ? 'bg-primary-600 border-white text-white dark:border-slate-900' 
                          : 'bg-slate-100 border-white text-slate-400 dark:bg-slate-800 dark:border-slate-900'
                      } ${isCurrent ? 'ring-4 ring-primary-100 dark:ring-primary-900/30' : ''}`}
                    >
                      {step.icon}
                    </div>
                    <span className={`mt-3 text-xs font-semibold ${isCompleted ? 'text-foreground' : 'text-slate-400'}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-bold mb-4 border-b border-border pb-4">Order Summary</h3>
          <div className="space-y-4 mb-6">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <span className="font-semibold w-6">{item.quantity}x</span>
                  <span>{item.menu.name}</span>
                </div>
                <span className="text-slate-500">{formatPrice(item.subtotal)}</span>
              </div>
            ))}
          </div>
          
          <div className="border-t border-border pt-4">
            <div className="flex justify-between items-center font-bold text-lg">
              <span>Total Amount</span>
              <span className="text-primary-600 dark:text-primary-400">{formatPrice(order.total_amount * 1.1)}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1 text-right">Includes 10% tax</p>
          </div>
        </div>
      </div>
    </div>
  );
}
