import { useState, useEffect, useCallback } from 'react';
import RestaurantCard from '../components/RestaurantCard';
import GlobalSearch from '../components/GlobalSearch';
import { 
  Utensils, Pizza, Coffee, Beef, 
  Salad, Dessert, Sandwich, ArrowRight, Sparkles, Fish
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useFavoriteStore } from '../store/favoriteStore';

type RestaurantParams = {
  id: string;
  nom: string;
  adresse: any;
  categories?: string[];
  imageUrl?: string;
};

const CATEGORIES = [
  { id: 'all', label: 'Tout', icon: Utensils },
  { id: 'burger', label: 'Burgers', icon: Beef },
  { id: 'pizza', label: 'Pizza', icon: Pizza },
  { id: 'sushi', label: 'Sushis', icon: Fish },
  { id: 'healthy', label: 'Healthy', icon: Salad },
  { id: 'sandwich', label: 'Sandwich', icon: Sandwich },
  { id: 'dessert', label: 'Desserts', icon: Dessert },
  { id: 'coffee', label: 'Café', icon: Coffee },
];

export default function Home() {
  const [restaurants, setRestaurants] = useState<RestaurantParams[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);
  
  const { user, token } = useAuthStore();
  const { restaurants: favIds, toggleRestaurant, loadFavorites } = useFavoriteStore();

  const fetchRestaurants = useCallback((cat?: string, coords?: { lat: number; lon: number }) => {
    setLoading(true);
    let url = `/api/restaurants?cat=${cat || 'all'}`;
    if (coords) {
      url += `&lat=${coords.lat}&lon=${coords.lon}&rayon=10`; // 10km radius by default
    }

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Erreur');
        return res.json();
      })
      .then((data) => {
        setRestaurants(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Impossible de charger les restaurants.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchRestaurants(selectedCategory, coordinates || undefined);

    if (user?.profilId && token) {
      loadFavorites(user.profilId, token);
    }
  }, [user, token, loadFavorites, selectedCategory, coordinates, fetchRestaurants]);

  const handleAddressSelect = (addr: string, lat: number, lon: number) => {
    setAddress(addr);
    setCoordinates({ lat, lon });
  };

  const handleFind = () => {
    fetchRestaurants(selectedCategory, coordinates || undefined);
  };

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center mb-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover scale-110 blur-[1px] brightness-[0.8]"
            alt="Hero background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/20 to-[var(--color-background)]" />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center animate-in fade-in zoom-in duration-1000">
          <div className="inline-flex items-center gap-3 bg-emerald-500/20 backdrop-blur-xl px-6 py-2.5 rounded-full border border-emerald-400/30 mb-8 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl animate-float">
            <Sparkles size={16} className="text-emerald-300" />
            L'excellence éthique livrée chez vous
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black text-white mb-10 tracking-tight leading-[0.95]">
            Mangez mieux, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-500">vivez mieux.</span>
          </h1>

          <div className="bg-white/10 backdrop-blur-2xl max-w-3xl mx-auto rounded-[3rem] p-3 flex flex-col md:flex-row items-center group border border-white/20 shadow-2xl shadow-black/20 focus-within:ring-8 focus-within:ring-emerald-500/10 transition-all">
            <div className="flex-1 w-full bg-white rounded-[2.5rem] shadow-inner">
              <GlobalSearch 
                onAddressSelect={handleAddressSelect}
                className="w-full"
              />
            </div>
            <button 
              onClick={handleFind}
              className="bg-gradient-to-br from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white px-12 py-5 rounded-[2.5rem] font-black text-sm transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-900/20 hover:scale-105 active:scale-95 w-full md:w-auto md:ml-3 mt-3 md:mt-0"
            >
              DÉCOUVRIR
              <ArrowRight size={20} strokeWidth={3} />
            </button>
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-8 text-white/60">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-white">50+</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Restos</span>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-white">100%</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Bio</span>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-white">0%</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Carbone</span>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Categories Section */}
        <section className="mb-12 overflow-hidden">
          <div className="flex items-center justify-between mb-6 px-1">
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Explorez par envies</h2>
            <button 
              onClick={() => { setSelectedCategory('all'); setCoordinates(null); setAddress(''); }}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline underline-offset-4"
            >
              Voir tout
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-1 px-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 flex flex-col items-center gap-3 p-4 rounded-[2rem] min-w-[100px] transition-all duration-300 border-2 ${
                  selectedCategory === cat.id 
                    ? 'bg-emerald-500 border-emerald-400 shadow-lg shadow-emerald-500/20 text-white' 
                    : 'bg-white border-slate-50 text-slate-400 hover:border-emerald-100 hover:bg-emerald-50/30'
                }`}
              >
                <div className={`p-3 rounded-2xl ${selectedCategory === cat.id ? 'bg-white/20' : 'bg-slate-50 group-hover:bg-white'}`}>
                  <cat.icon size={24} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">{cat.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Restaurants Grid */}
        <section>
          <div className="flex items-center justify-between mb-8 px-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                 <Utensils size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Nos pépites locales</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Sélectionnées pour vous</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-white rounded-[2rem] border border-slate-50 h-80 animate-pulse overflow-hidden">
                  <div className="h-48 bg-slate-100" />
                  <div className="p-6 space-y-4">
                    <div className="h-4 w-2/3 bg-slate-100 rounded-full" />
                    <div className="h-3 w-full bg-slate-50 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-rose-50 text-rose-600 p-8 rounded-[2rem] border border-rose-100 text-center font-bold shadow-sm">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {restaurants.map((resto: RestaurantParams, index: number) => (
                <RestaurantCard 
                  key={resto.id} 
                  id={resto.id}
                  nom={resto.nom}
                  adresse={resto.adresse}
                  isFavorite={favIds.includes(resto.id)}
                  onToggleFavorite={() => toggleRestaurant(resto.id, user?.profilId, token || undefined)}
                  image={resto.imageUrl || `https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=800&auto=format&fit=crop`}
                  ecoScore={90 - (index * 5)} // Dummy data for visual
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
