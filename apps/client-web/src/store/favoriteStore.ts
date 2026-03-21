import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoriteState {
  restaurants: string[];
  plats: string[];
  toggleRestaurant: (id: string, clientId?: string, token?: string) => void;
  togglePlat: (id: string, clientId?: string, token?: string) => void;
  loadFavorites: (clientId: string, token: string) => Promise<void>;
  setFavorites: (favs: { restaurants: string[], plats: string[] }) => void;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      restaurants: [],
      plats: [],
      toggleRestaurant: (id, clientId, token) => {
        const isFav = get().restaurants.includes(id);
        const next = isFav ? get().restaurants.filter(i => i !== id) : [...get().restaurants, id];
        set({ restaurants: next });
        
        if (clientId && token) {
          const method = isFav ? 'DELETE' : 'POST';
          const url = isFav ? `/api/favoris/restaurants/${clientId}/${id}` : `/api/favoris/restaurants`;
          fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: isFav ? undefined : JSON.stringify({ clientId, restaurantId: id })
          }).catch(console.error);
        }
      },
      togglePlat: async (id, clientId, token) => {
        const current = get().plats;
        const isFav = current.includes(id);
        const next = isFav ? current.filter(pid => pid !== id) : [...current, id];
        set({ plats: next });

        if (clientId && token) {
          try {
            if (isFav) {
              await fetch(`/api/favoris/plats/${clientId}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
              });
            } else {
              await fetch(`/api/favoris/plats`, {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ clientId, platId: id })
              });
            }
          } catch (e) {
            console.error("Erreur toggle plat favori", e);
          }
        }
      },
      loadFavorites: async (clientId, token) => {
        try {
          const [resRestos, resPlats] = await Promise.all([
            fetch(`/api/favoris/restaurants/${clientId}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            }),
            fetch(`/api/favoris/plats/${clientId}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            })
          ]);

          const results: any = {};
          if (resRestos.ok) results.restaurants = await resRestos.json();
          if (resPlats.ok) results.plats = await resPlats.json();
          
          set(results);
        } catch (e) {
          console.error("Erreur chargement favoris", e);
        }
      },
      setFavorites: (favs) => set({ restaurants: favs.restaurants, plats: favs.plats })
    }),
    { name: 'ecoeats-favorites' }
  )
);
