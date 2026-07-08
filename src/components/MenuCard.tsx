import React from 'react';
import { Menu } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { Plus } from 'lucide-react';

interface MenuCardProps {
  menu: Menu;
}

export function MenuCard({ menu }: MenuCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="group flex flex-col bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-[0_2px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_20px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
        {menu.image_url ? (
          <img
            src={menu.image_url}
            alt={menu.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            No image
          </div>
        )}
        
        {!menu.is_available && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-red-500 text-white font-bold px-4 py-2 rounded-full transform -rotate-12 shadow-lg">
              SOLD OUT
            </span>
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg leading-tight text-slate-900 dark:text-white line-clamp-2 pr-2">
            {menu.name}
          </h3>
        </div>
        
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-6 flex-1">
          {menu.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="font-extrabold text-lg text-primary-600 dark:text-primary-400">
            {formatPrice(menu.price)}
          </span>
          <button
            onClick={() => addItem(menu)}
            disabled={!menu.is_available}
            className="bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-full p-3 shadow-md shadow-primary-600/30 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
