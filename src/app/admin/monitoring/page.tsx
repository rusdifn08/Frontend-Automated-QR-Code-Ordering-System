'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Activity, Clock, Cpu, HardDrive, LayoutDashboard } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface SystemMetrics {
  uptime: string;
  total_requests: number;
  average_latency: string;
  memory_allocated: number;
  memory_sys: number;
  recent_logs: string[];
}

interface ChartData {
  time: string;
  requests: number;
  memory: number;
}

export default function MonitoringDashboard() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  const getAuthHeader = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return null;
    }
    return { Authorization: `Bearer ${token}` };
  };

  const fetchMetrics = async () => {
    const headers = getAuthHeader();
    if (!headers) return;

    try {
      const res = await axios.get(`${API_URL}/api/admin/system-metrics`, { headers });
      const data: SystemMetrics = res.data;
      setMetrics(data);

      const now = new Date();
      const timeStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
      
      setChartData((prev) => {
        const newData = [...prev, { time: timeStr, requests: data.total_requests, memory: data.memory_allocated }];
        // Keep last 15 data points
        if (newData.length > 15) return newData.slice(newData.length - 15);
        return newData;
      });

    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
      }
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 3000); // Poll every 3s
    return () => clearInterval(interval);
  }, []);

  if (!metrics) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-foreground">
      <header className="bg-card border-b border-border p-4 sticky top-0 z-10 shadow-sm flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Activity className="w-6 h-6 text-primary-600" />
          <h1 className="text-xl font-bold">System Monitoring</h1>
        </div>
        <button 
          onClick={() => router.push('/admin/kds')}
          className="text-sm font-medium text-primary-600 hover:underline flex items-center"
        >
          <LayoutDashboard className="w-4 h-4 mr-1" />
          Back to KDS
        </button>
      </header>

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg flex items-center justify-center mr-4">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Uptime</p>
              <p className="text-xl font-bold">{metrics.uptime.split('.')[0] + 's'}</p>
            </div>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-lg flex items-center justify-center mr-4">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Requests</p>
              <p className="text-xl font-bold">{metrics.total_requests}</p>
            </div>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 rounded-lg flex items-center justify-center mr-4">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Avg Latency</p>
              <p className="text-xl font-bold">{metrics.average_latency}</p>
            </div>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 rounded-lg flex items-center justify-center mr-4">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">RAM (Allocated)</p>
              <p className="text-xl font-bold">{metrics.memory_allocated} MB</p>
            </div>
          </div>
        </div>

        {/* Graphs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm h-80 flex flex-col">
            <h3 className="text-lg font-bold mb-4">Traffic (Total Requests)</h3>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickMargin={10} />
                  <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="requests" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border shadow-sm h-80 flex flex-col">
            <h3 className="text-lg font-bold mb-4">Memory Usage (MB)</h3>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickMargin={10} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="memory" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Live Logs Terminal */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center">
            <div className="flex space-x-2 mr-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-slate-400 text-xs font-mono">system.log</span>
          </div>
          <div className="p-4 h-64 overflow-y-auto font-mono text-xs text-emerald-400 space-y-1">
            {metrics.recent_logs?.length === 0 ? (
              <p className="text-slate-500">No recent logs...</p>
            ) : (
              metrics.recent_logs?.map((log, i) => (
                <div key={i}>{log}</div>
              ))
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
