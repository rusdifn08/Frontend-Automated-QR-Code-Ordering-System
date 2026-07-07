export interface Menu {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  is_available: boolean;
}

export interface CartItem {
  menu: Menu;
  quantity: number;
}

export interface OrderItem {
  menu_id: string;
  quantity: number;
}
