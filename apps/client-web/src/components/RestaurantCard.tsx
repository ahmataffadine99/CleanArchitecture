import { MapPin, Star, Clock, Heart, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

type RestaurantCardProps = {
  id: string;
  nom: string;
  adresse: any;
  image?: string;
  note?: number;
  tempsLivraison?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  ecoScore?: number; // 1 to 100
};

export default function RestaurantCard({ 
  id, nom, adresse, image, 
  note = 4.8, 
  tempsLivraison = "25-35 min", 
  isFavorite, 
  onToggleFavorite,
  ecoScore = 85
}: RestaurantCardProps) {
  const bgImage = image || `https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=800&auto=format&fit=crop`;

  return (
    <Link to={`/restaurant/${id}`} className="group relative bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full block">
      {/* Image Cover */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img 
          src={bgImage} 
          alt={nom} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        
        {/* Favori */}
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFavorite?.(); }}
          className={`absolute top-4 right-4 z-10 p-2 rounded-xl backdrop-blur-md transition-all duration-300 ${isFavorite ? 'bg-rose-500 text-white' : 'bg-white/20 text-white hover:bg-white/40'}`}
        >
          <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
        </button>

        {/* Eco-Score Badge */}
        <div className="absolute top-4 left-4 bg-emerald-500/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm border border-emerald-400/20 text-white">
          <Leaf size={12} fill="white" fillOpacity={0.2} />
          <span className="text-[10px] font-bold tracking-tight">Eco {ecoScore}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-slate-800 text-lg group-hover:text-emerald-600 transition-colors line-clamp-1">{nom}</h3>
          <div className="flex items-center gap-1">
            <Star size={16} className="text-amber-400 fill-amber-400" />
            <span className="text-sm font-bold text-slate-700">{note}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-slate-400 mb-4">
          <MapPin size={14} />
          <p className="text-xs truncate">{typeof adresse === 'object' ? `${adresse.rue}, ${adresse.ville}` : adresse}</p>
        </div>
        
        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
           <div className="flex items-center gap-1 text-slate-400">
              <Clock size={14} />
              <span className="text-xs font-medium">{tempsLivraison}</span>
           </div>
           <span className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-wider">Premium</span>
        </div>
      </div>
    </Link>
  );
}
