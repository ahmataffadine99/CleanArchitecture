import { create } from 'zustand';

export type CartItem = {
  id: string;
  nom: string;
  prix: number;
  quantite: number;
};

type CartState = {
  items: CartItem[];
  restaurantId: string | null;
  addItem: (item: Omit<CartItem, 'quantite'>, restaurantId: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: () => number;
  isOpen: boolean;
  toggleCart: () => void;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  restaurantId: null,
  isOpen: false,
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  addItem: (newItem, restId) => {
    set((state) => {
      if (state.restaurantId && state.restaurantId !== restId && state.items.length > 0) {
        alert("Vous ne pouvez commander que dans un seul restaurant à la fois. Videz votre panier pour changer de restaurant.");
        return state;
      }

      const existingItem = state.items.find((item) => item.id === newItem.id);
      if (existingItem) {
        return {
          ...state,
          restaurantId: restId,
          items: state.items.map((item) =>
            item.id === newItem.id ? { ...item, quantite: item.quantite + 1 } : item
          ),
        };
      } else {
        return {
          ...state,
          restaurantId: restId,
          items: [...state.items, { ...newItem, quantite: 1 }],
        };
      }
    });
  },

  removeItem: (id) => {
    set((state) => {
      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem && existingItem.quantite > 1) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantite: item.quantite - 1 } : item
          ),
        };
      } else {
        const newItems = state.items.filter((item) => item.id !== id);
        return {
          ...state,
          items: newItems,
          restaurantId: newItems.length === 0 ? null : state.restaurantId,
        };
      }
    });
  },

  clearCart: () => set({ items: [], restaurantId: null }),

  total: () => get().items.reduce((acc, item) => acc + item.prix * item.quantite, 0),
}));
