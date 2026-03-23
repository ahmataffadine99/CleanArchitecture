import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, Heart } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useFavoriteStore } from '../store/favoriteStore';

type MenuItem = {
  id: string;
  nom: string;
  description: string;
  prix: number;
  allergenes: string[];
  stock: number;
  imageUrl?: string | null;
  categorie?: string;
};

export default function RestaurantDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [menu, setMenu] = useState<{ disponibles: MenuItem[], rupture: MenuItem[] }>({ disponibles: [], rupture: [] });
  const [loading, setLoading] = useState(true);
  const [selectedPlat, setSelectedPlat] = useState<any>(null);
  const { user, token } = useAuthStore();
  const { restaurants: favRestos, toggleRestaurant, plats: favPlats, togglePlat } = useFavoriteStore();
  const isFavoriteResto = favRestos.includes(id || '');

  useEffect(() => {
    if (!id) return;

    // Récupérer les infos du restaurant et son menu
    Promise.all([
      fetch('/api/restaurants').then(res => res.json()),
      fetch(`/api/restaurants/${id}/menu`).then(res => res.json())
    ])
      .then(([restosData, menuData]) => {
        const found = restosData.find((r: any) => r.id === id);
        if (found) setRestaurant(found);
        
        // On n'affiche que les plats disponibles
        setMenu(menuData);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = (item: MenuItem) => {
    if (!restaurant) return;
    addItem({ id: item.id, nom: item.nom, prix: item.prix, restaurantId: restaurant.id }, restaurant.id);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-48 bg-slate-200 rounded-3xl mb-8"></div>
        <div className="space-y-4">
          <div className="h-24 bg-slate-100 rounded-2xl"></div>
          <div className="h-24 bg-slate-100 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-center py-20 text-slate-500">
        <p>Restaurant introuvable.</p>
        <button onClick={() => navigate('/')} className="mt-4 text-emerald-500 underline">Retour à l'accueil</button>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Bouton retour */}
      <button 
        onClick={() => navigate('/')}
        className="mb-6 flex items-center gap-2 text-slate-500 hover:text-emerald-500 transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100"
      >
        <ArrowLeft size={18} />
        <span className="font-medium text-sm">Retour aux restaurants</span>
      </button>

      {/* Hero Restaurant */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-800 h-64 mb-10 shadow-lg animate-slide-up">
        <img 
          src={`https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1200&auto=format&fit=crop`} 
          alt={restaurant.nom}
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-white flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-extrabold mb-2">{restaurant.nom}</h1>
            <p className="text-slate-300 flex items-center gap-2">
              📍 {restaurant.adresse?.rue}, {restaurant.adresse?.ville}
            </p>
          </div>
          <button 
            onClick={() => toggleRestaurant(id!, user?.profilId, token || undefined)}
            className={`p-4 rounded-2xl backdrop-blur-md transition-all ${isFavoriteResto ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}
          >
            <Heart size={24} fill={isFavoriteResto ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* Menu Section */}
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Menu</h2>
      
      {menu.disponibles.length === 0 ? (
        <div className="bg-slate-50 text-slate-500 p-8 rounded-2xl text-center border border-slate-200 border-dashed">
          Aucun plat disponible pour le moment.
        </div>
      ) : (
        <div className="space-y-10">
          {/* Section Plats */}
          {menu.disponibles.filter(p => !p.categorie || p.categorie === 'PLAT').length > 0 && (
            <div>
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-8 h-[2px] bg-slate-200"></span> PLATS PRINCIPAUX
              </h3>
              <div className="grid gap-4">
                {menu.disponibles.filter(p => !p.categorie || p.categorie === 'PLAT').map((item) => (
                  <MenuCard key={item.id} item={item} onSelect={setSelectedPlat} onAdd={handleAddToCart} isFav={favPlats.includes(item.id)} onToggleFav={() => togglePlat(item.id, user?.profilId, token || undefined)} />
                ))}
              </div>
            </div>
          )}

          {/* Section Boissons */}
          {menu.disponibles.filter(p => p.categorie === 'BOISSON').length > 0 && (
            <div>
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-8 h-[2px] bg-slate-200"></span> BOISSONS & RAFRAÎCHISSEMENTS
              </h3>
              <div className="grid gap-4">
                {menu.disponibles.filter(p => p.categorie === 'BOISSON').map((item) => (
                  <MenuCard key={item.id} item={item} onSelect={setSelectedPlat} onAdd={handleAddToCart} isFav={favPlats.includes(item.id)} onToggleFav={() => togglePlat(item.id, user?.profilId, token || undefined)} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal Détails Plat */}
      {selectedPlat && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div 
            className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-48 sm:h-56 w-full">
              <img 
                src={selectedPlat.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop"} 
                alt={selectedPlat.nom} 
                className="w-full h-full object-cover"
              />
              <button 
                onClick={() => setSelectedPlat(null)}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-xl text-slate-800 hover:bg-white transition-colors shadow-lg"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-black text-slate-800 leading-tight mb-1">{selectedPlat.nom}</h3>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100">
                      {selectedPlat.prix.toFixed(2)} €
                    </span>
                    {selectedPlat.stock <= 0 && (
                      <span className="px-2.5 py-0.5 bg-red-50 text-red-600 text-xs font-bold rounded-full border border-red-100 uppercase tracking-wider">
                        Épuisé
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Description</h4>
                  <p className="text-slate-600 leading-relaxed text-base font-medium">
                    {selectedPlat.description || "Aucune description disponible pour ce délice éthique."}
                  </p>
                </div>
                
                {selectedPlat.allergenes && selectedPlat.allergenes.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Allergènes</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedPlat.allergenes.map((a: string) => (
                        <span key={a} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg border border-slate-200">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-8">
                <button 
                  disabled={selectedPlat.stock <= 0}
                  onClick={() => {
                    handleAddToCart(selectedPlat);
                    setSelectedPlat(null);
                  }}
                  className={`w-full py-4 rounded-2xl font-black text-base shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                    selectedPlat.stock > 0 
                    ? 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-slate-400/30' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  <Plus size={20} />
                  AJOUTER AU PANIER — {selectedPlat.prix.toFixed(2)} €
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function MenuCard({ item, onSelect, onAdd, isFav, onToggleFav }: { 
  item: MenuItem, 
  onSelect: (item: MenuItem) => void, 
  onAdd: (item: MenuItem) => void,
  isFav: boolean,
  onToggleFav: () => void
}) {
  return (
    <div 
      className="bg-white rounded-3xl p-5 flex flex-col sm:flex-row gap-5 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group cursor-pointer relative"
      onClick={() => onSelect(item)}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-slate-800 text-lg">{item.nom}</h3>
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleFav(); }}
            className={`transition-colors ${isFav ? 'text-red-500' : 'text-slate-300 hover:text-red-400'}`}
          >
            <Heart size={16} fill={isFav ? "currentColor" : "none"} />
          </button>
        </div>
        <p className="text-slate-500 text-sm mt-1 line-clamp-2">{item.description}</p>
        <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 w-fit px-2.5 py-1 rounded-md">
          {item.prix.toFixed(2)} €
        </div>
      </div>
      
      <div className="flex flex-col items-end justify-between">
        <div className="h-24 w-24 bg-slate-100 rounded-xl overflow-hidden shrink-0 hidden sm:block border border-slate-50">
           <img 
            src={item.imageUrl || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80`} 
            alt={item.nom}
            className="w-full h-full object-cover opacity-90 transition-opacity hover:opacity-100" 
          />
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onAdd(item); }}
          className="mt-4 sm:mt-0 flex items-center justify-center h-10 w-10 bg-emerald-100 hover:bg-emerald-500 text-emerald-600 hover:text-white rounded-full transition-colors"
          title="Ajouter au panier"
        >
          <Plus size={20} className="stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}
