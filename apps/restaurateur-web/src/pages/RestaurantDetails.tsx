import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

type MenuItem = {
  id: string;
  nom: string;
  description: string;
  prix: number;
  allergenes: string[];
  stock: number;
};

type RestaurantInfo = {
  id: string;
  nom: string;
  adresse: { rue: string; ville: string };
};

export default function RestaurantDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const [restaurant, setRestaurant] = useState<RestaurantInfo | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

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
        setMenuItems(menuData.disponibles || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

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
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-4xl font-extrabold mb-2">{restaurant.nom}</h1>
          <p className="text-slate-300 flex items-center gap-2">
            📍 {restaurant.adresse?.rue}, {restaurant.adresse?.ville}
          </p>
        </div>
      </div>

      {/* Menu Section */}
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Menu</h2>
      
      {menuItems.length === 0 ? (
        <div className="bg-slate-50 text-slate-500 p-8 rounded-2xl text-center border border-slate-200 border-dashed">
          Aucun plat disponible pour le moment.
        </div>
      ) : (
        <div className="grid gap-4">
          {menuItems.map((item, idx) => (
            <div 
              key={item.id} 
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex justify-between gap-4 animate-slide-up opacity-0 fill-mode-forwards"
              style={{ animationDelay: `${100 + idx * 50}ms` }}
            >
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 text-lg">{item.nom}</h3>
                <p className="text-slate-500 text-sm mt-1 line-clamp-2">{item.description}</p>
                <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 w-fit px-2.5 py-1 rounded-md">
                  {item.prix.toFixed(2)} €
                </div>
              </div>
              
              <div className="flex flex-col items-end justify-between">
                <div className="h-24 w-24 bg-slate-100 rounded-xl overflow-hidden shrink-0 hidden sm:block">
                   <img src={`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80`} className="w-full h-full object-cover opacity-90" />
                </div>
                <button 
                  onClick={() => addItem({ id: item.id, nom: item.nom, prix: item.prix }, restaurant.id)}
                  className="mt-4 sm:mt-0 flex items-center justify-center h-10 w-10 bg-emerald-100 hover:bg-emerald-500 text-emerald-600 hover:text-white rounded-full transition-colors"
                  title="Ajouter au panier"
                >
                  <Plus size={20} className="stroke-[2.5]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
