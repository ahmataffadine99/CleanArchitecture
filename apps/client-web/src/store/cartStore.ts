import { create } from 'zustand';
import { useAuthStore } from './authStore';

export type CartItem = {
  id: string;
  nom: string;
  prix: number;
  quantite: number;
  restaurantId: string;
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

  addItem: async (item, restoId) => {
    const { items, restaurantId } = get();
    const clientId = useAuthStore.getState().user?.profilId || "guest";

    if (restaurantId && restaurantId !== restoId && items.length > 0) {
      if (!confirm("Votre panier contient déjà des plats d'un autre restaurant. Voulez-vous le vider pour commander ici ?")) {
        return;
      }
      set({ items: [], restaurantId: item.restaurantId });
      await fetch(`/api/panier/${clientId}`, { method: 'DELETE' });
    }

    try {
      await fetch('/api/panier/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, platId: item.id, quantite: 1 })
      });
    } catch (e) { console.error("Sync error", e); }

    const existing = get().items.find((i) => i.id === item.id);
    if (existing) {
      set({
        items: get().items.map((i) =>
          i.id === item.id ? { ...i, quantite: i.quantite + 1 } : i
        )
      });
    } else {
      set({
        items: [...get().items, { ...item, quantite: 1, restaurantId: restoId }],
        restaurantId: restoId
      });
    }
  },

  removeItem: async (id) => {
    const clientId = useAuthStore.getState().user?.profilId || "guest";
    try {
      await fetch(`/api/panier/${clientId}/articles/${id}`, { method: 'DELETE' });
    } catch (e) { console.error("Sync error", e); }

    const existing = get().items.find((i) => i.id === id);
    if (existing && existing.quantite > 1) {
      set({
        items: get().items.map((i) =>
          i.id === id ? { ...i, quantite: i.quantite - 1 } : i
        )
      });
    } else {
      const newItems = get().items.filter((i) => i.id !== id);
      set({
        items: newItems,
        restaurantId: newItems.length === 0 ? null : get().restaurantId
      });
    }
  },

  clearCart: async () => {
    const clientId = useAuthStore.getState().user?.profilId || "guest";
    await fetch(`/api/panier/${clientId}`, { method: 'DELETE' });
    set({ items: [], restaurantId: null });
  },

  total: () => get().items.reduce((acc, item) => acc + item.prix * item.quantite, 0),
}));
