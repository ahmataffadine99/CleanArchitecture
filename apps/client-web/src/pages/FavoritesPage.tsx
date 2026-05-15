import { useState, useEffect } from 'react';
import { Heart, Utensils, ArrowLeft, Loader2, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useFavoriteStore } from '../store/favoriteStore';
import { useAuthStore } from '../store/authStore';
import RestaurantCard from '../components/RestaurantCard';

export default function FavoritesPage() {
  const { user, token } = useAuthStore();
  const { restaurants: favIds, plats: favPlatIds, toggleRestaurant, togglePlat, loadFavorites } = useFavoriteStore();
  const [data, setData] = useState<{ restaurants: any[], plats: any[] }>({ restaurants: [], plats: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.profilId && token) {
      loadFavorites(user.profilId, token);
    }
  }, [user?.profilId, token]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/favoris/details/${user.profilId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Erreur chargement détails favoris", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [user?.profilId, token, favIds.length, favPlatIds.length]);

  if (!user) return null;

  const hasFavorites = data.restaurants.length > 0 || data.plats.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-4 mb-10">
        <Link to="/" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-slate-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Mes Favoris</h1>
          <p className="text-slate-500 font-medium">Retrouvez ici tout ce que vous aimez.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 size={40} className="text-emerald-500 animate-spin" />
          <p className="text-slate-400 font-bold">Chargement de vos coups de cœur...</p>
        </div>
      ) : !hasFavorites ? (
        <div className="bg-white rounded-[40px] p-12 text-center border-2 border-dashed border-slate-100">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Heart size={40} className="text-slate-300" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Aucun favori pour le moment</h2>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">
            Parcourez les restaurants et cliquez sur le cœur pour les retrouver facilement ici.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-lg shadow-emerald-200"
          >
            Découvrir les restaurants
          </Link>
        </div>
      ) : (
        <div className="space-y-12">
          
          {data.restaurants.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600">
                  <Utensils size={20} />
                </div>
                <h2 className="text-xl font-black text-slate-800">Restaurants ({data.restaurants.length})</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.restaurants.map(resto => (
                  <RestaurantCard 
                    key={resto.id}
                    id={resto.id}
                    nom={resto.nom}
                    adresse={resto.adresse}
                    image={resto.imageUrl}
                    isFavorite={true}
                    onToggleFavorite={() => toggleRestaurant(resto.id, user.profilId, token!)}
                  />
                ))}
              </div>
            </section>
          )}

          
          {data.plats.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-rose-100 rounded-xl text-rose-600">
                  <Heart size={20} fill="currentColor" />
                </div>
                <h2 className="text-xl font-black text-slate-800">Plats & Boissons ({data.plats.length})</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.plats.map(plat => (
                  <div key={plat.id} className="bg-white p-4 rounded-3xl border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow group">
                    <div className="h-20 w-20 rounded-2xl overflow-hidden bg-slate-50 shrink-0">
                      {plat.imageUrl ? (
                        <img src={plat.imageUrl} alt={plat.nom} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Utensils size={24} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 truncate">{plat.nom}</h3>
                      <p className="text-sm text-slate-500 line-clamp-1 mb-1">{plat.description}</p>
                      <span className="font-black text-emerald-600">{plat.prix.toFixed(2)} €</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <Link 
                        to={`/restaurant/${plat.restaurantId}`} 
                        className="p-2.5 bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-500 rounded-xl transition-all"
                        title="Voir le restaurant"
                      >
                        <Utensils size={18} />
                      </Link>
                      <button 
                        onClick={() => togglePlat(plat.id, user.profilId, token!)}
                        className="p-2.5 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all"
                        title="Retirer des favoris"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
