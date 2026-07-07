import { create } from 'zustand';
import { Menu, CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (menu: Menu) => void;
  removeItem: (menuId: string) => void;
  updateQuantity: (menuId: string, quantity: number) => void;
  clearCart: () => void;
  totalAmount: () => number;
  totalItems: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (menu: Menu) => {
    const { items } = get();
    const existingItem = items.find((item) => item.menu.id === menu.id);

    if (existingItem) {
      set({
        items: items.map((item) =>
          item.menu.id === menu.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      set({ items: [...items, { menu, quantity: 1 }] });
    }
  },
  removeItem: (menuId: string) => {
    set({ items: get().items.filter((item) => item.menu.id !== menuId) });
  },
  updateQuantity: (menuId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(menuId);
      return;
    }
    set({
      items: get().items.map((item) =>
        item.menu.id === menuId ? { ...item, quantity } : item
      ),
    });
  },
  clearCart: () => set({ items: [] }),
  totalAmount: () => {
    return get().items.reduce(
      (total, item) => total + item.menu.price * item.quantity,
      0
    );
  },
  totalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
}));
