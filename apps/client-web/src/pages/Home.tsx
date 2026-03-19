import { useState, useEffect } from 'react';
import RestaurantCard from '../components/RestaurantCard';
import { Utensils } from 'lucide-react';

type RestaurantParams = {
  id: string;
  nom: string;
  adresse: { rue: string; ville: string; codePostal: string };
};

export default function Home() {
  const [restaurants, setRestaurants] = useState<RestaurantParams[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Appel via le proxy Vite vers l'API Express
    fetch('/api/restaurants')
      .then((res) => {
        if (!res.ok) throw new Error('Erreur lors de la récupération des restaurants');
        return res.json();
      })
      .then((data) => {
        setRestaurants(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Impossible de charger les restaurants pour le moment.");
        setLoading(false);
      });
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Hero Section */}
      <div className="mb-12 text-center sm:text-left pt-6 pb-2">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 animate-slide-up">
          Que souhaitez-vous <br className="hidden sm:block" />
          <span className="text-emerald-500">manger ouzo'dhui ?</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl animate-slide-up [animation-delay:100ms] opacity-0 fill-mode-forwards">
          Découvrez les meilleurs restaurants éthiques près de chez vous.
          Nos partenaires s'engagent pour des repas de qualité.
        </p>
      </div>

      {/* Listing */}
      <div className="flex items-center gap-2 mb-6">
        <Utensils className="text-emerald-500" size={24} />
        <h2 className="text-2xl font-bold text-slate-800">Restaurants à la une</h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-100 rounded-3xl h-72 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center font-medium">
          {error}
        </div>
      ) : restaurants.length === 0 ? (
        <div className="bg-slate-50 text-slate-500 p-12 rounded-3xl border border-slate-200 border-dashed text-center">
          <p className="text-lg font-medium">Aucun restaurant disponible pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {restaurants.map((resto, index) => (
            <div 
              key={resto.id} 
              className="animate-slide-up opacity-0 fill-mode-forwards"
              style={{ animationDelay: `${150 + index * 100}ms` }}
            >
              <RestaurantCard 
                id={resto.id}
                nom={resto.nom}
                adresse={resto.adresse}
                // Ajout d'images factices pour une belle UI
                image={`https://images.unsplash.com/photo-${1550966871 + index}-3ed3cdb5ed0c?q=80&w=800&auto=format&fit=crop`}
              />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
