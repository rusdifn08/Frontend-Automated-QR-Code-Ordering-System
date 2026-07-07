import React from 'react';
import { Menu } from '@/types';
import { Button } from './Button';
import { useCartStore } from '@/store/cartStore';

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
    <div className="flex flex-col bg-card text-card-foreground border border-border rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-800 relative">
        {menu.image_url ? (
          <img
            src={menu.image_url}
            alt={menu.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            No image
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{menu.name}</h3>
          <span className="font-bold text-primary-600 dark:text-primary-400 whitespace-nowrap ml-2">
            {formatPrice(menu.price)}
          </span>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 flex-1">
          {menu.description}
        </p>
        <Button
          onClick={() => addItem(menu)}
          className="w-full"
          disabled={!menu.is_available}
        >
          {menu.is_available ? 'Add to Cart' : 'Sold Out'}
        </Button>
      </div>
    </div>
  );
}
