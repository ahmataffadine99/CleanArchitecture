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
    <Link to={`/restaurant/${id}`} className="group relative bg-white rounded-[2rem] overflow-hidden border border-slate-100/80 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 flex flex-col h-full animate-slide-up block">
      {/* Image Cover */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-100">
        <img 
          src={bgImage} 
          alt={nom} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-40" />
        
        {/* Favori */}
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFavorite?.(); }}
          className={`absolute top-4 right-4 z-10 p-3 rounded-2xl backdrop-blur-md transition-all duration-300 shadow-lg ${isFavorite ? 'bg-rose-500 text-white' : 'bg-white/20 text-white hover:bg-white/40 border border-white/20'}`}
        >
          <Heart size={18} fill={isFavorite ? "currentColor" : "none"} className={isFavorite ? "animate-pulse" : ""} />
        </button>

        {/* Eco-Score Badge */}
        <div className="absolute top-4 left-4 bg-emerald-500/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg border border-emerald-400/30 text-white group-hover:scale-105 transition-transform">
          <Leaf size={14} fill="white" fillOpacity={0.2} />
          <span className="text-[10px] font-black tracking-widest uppercase">Eco {ecoScore}</span>
        </div>
        
        {/* Chips flottantes */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
          <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-md border border-slate-100 group-hover:translate-y-[-2px] transition-transform">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            <span className="text-sm font-black text-slate-800">{note}</span>
          </div>
          
          <div className="bg-slate-900/95 backdrop-blur-sm px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md text-white group-hover:translate-y-[-2px] transition-transform delay-75">
            <Clock size={14} className="text-emerald-400" />
            <span className="text-xs font-bold">{tempsLivraison}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-black text-slate-800 group-hover:text-emerald-600 transition-colors line-clamp-1 mb-2 tracking-tight">
          {nom}
        </h3>
        
        <p className="flex items-start gap-1.5 text-slate-400 text-xs font-medium leading-relaxed group-hover:text-slate-500 transition-colors">
          <MapPin size={14} className="text-emerald-500/70 shrink-0 mt-0.5" />
          <span className="line-clamp-2 italic">
            {typeof adresse === 'object' ? `${adresse.rue}, ${adresse.ville}` : adresse}
          </span>
        </p>
        
        {/* Footer info (optional vibe) */}
        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
           <span className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest">Partenaire Premium</span>
           <div className="flex gap-1">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-200" />
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-100" />
           </div>
        </div>
      </div>
    </Link>
  );
}
