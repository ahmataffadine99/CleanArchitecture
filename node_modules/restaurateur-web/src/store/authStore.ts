import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  role: string;
  profilId: string;
}

interface Restaurant {
  id: string;
  nom: string;
  imageUrl?: string | null;
}

interface AuthState {
  token: string | null;
  user: User | null;
  restaurant: Restaurant | null;
  setAuth: (token: string, user: User) => void;
  setRestaurant: (restaurant: Restaurant) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      restaurant: null,
      setAuth: (token, user) => set({ token, user }),
      setRestaurant: (restaurant) => set({ restaurant }),
      logout: () => set({ token: null, user: null, restaurant: null }),
    }),
    {
      name: 'ecoeats-auth-restaurateur',
    }
  )
);

