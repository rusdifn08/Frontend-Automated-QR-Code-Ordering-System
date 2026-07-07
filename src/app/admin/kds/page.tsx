'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Clock, LayoutDashboard } from 'lucide-react';

interface OrderItem {
  id: string;
  menu: { name: string; price: number };
  quantity: number;
}

interface Order {
  id: string;
  table_id: string;
  status: string;
  created_at: string;
  items: OrderItem[];
}

export default function KDSDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/orders');
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await axios.patch(`http://localhost:8080/api/orders/${id}/status`, { status });
      fetchOrders();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const columns = [
    { id: 'pending', title: 'New / Pending', color: 'border-orange-500' },
    { id: 'preparing', title: 'Preparing', color: 'border-blue-500' },
    { id: 'served', title: 'Served', color: 'border-green-500' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-card border-b border-border p-4 sticky top-0 z-10 shadow-sm flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <LayoutDashboard className="w-6 h-6 text-primary-600" />
          <h1 className="text-xl font-bold">Kitchen Display System (KDS)</h1>
        </div>
        <a href="http://localhost:8080/metrics" target="_blank" rel="noreferrer" className="text-sm font-medium text-primary-600 hover:underline">
          View System Metrics
        </a>
      </header>

      <main className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((col) => (
            <div key={col.id} className="flex flex-col h-[calc(100vh-120px)] bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-border">
              <h2 className={`font-bold text-lg mb-4 border-l-4 ${col.color} pl-3`}>
                {col.title}
                <span className="ml-2 text-sm font-normal text-slate-500">
                  ({orders.filter((o) => o.status === col.id).length})
                </span>
              </h2>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {orders
                  .filter((o) => o.status === col.id)
                  .map((order) => (
                    <div key={order.id} className="bg-card p-4 rounded-xl shadow-sm border border-border flex flex-col">
                      <div className="flex justify-between items-start mb-3 border-b border-border pb-3">
                        <div>
                          <span className="font-bold text-lg">Order #{order.id.split('-')[0]}</span>
                          <p className="text-xs text-slate-500 flex items-center mt-1">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(order.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      
                      <ul className="mb-4 space-y-2 flex-1">
                        {order.items.map((item) => (
                          <li key={item.id} className="flex justify-between text-sm">
                            <span className="font-semibold">{item.quantity}x</span>
                            <span className="flex-1 ml-3">{item.menu.name}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-auto pt-3 border-t border-border flex justify-end space-x-2">
                        {order.status === 'pending' && (
                          <button onClick={() => updateStatus(order.id, 'preparing')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                            Start Preparing
                          </button>
                        )}
                        {order.status === 'preparing' && (
                          <button onClick={() => updateStatus(order.id, 'served')} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                            Mark Served
                          </button>
                        )}
                        {order.status === 'served' && (
                          <button onClick={() => updateStatus(order.id, 'paid')} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                            Mark Paid
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
