import { MapPin, Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

type RestaurantCardProps = {
  id: string;
  nom: string;
  adresse: object | string;
  image?: string;
  note?: number;
  tempsLivraison?: string;
};

export default function RestaurantCard({ id, nom, adresse, image, note = 4.8, tempsLivraison = "25-35 min" }: RestaurantCardProps) {
  const bgImage = image || `https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=800&auto=format&fit=crop`;

  return (
    <Link to={`/restaurant/${id}`} className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 border border-slate-100 cursor-pointer flex flex-col h-full animate-slide-up block">
      
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img 
          src={bgImage} 
          alt={nom} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-80" />
        
        
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
          <Star size={14} className="fill-amber-400 text-amber-400" />
          <span className="text-sm font-bold text-slate-800">{note}</span>
        </div>
        
        
        <div className="absolute bottom-4 right-4 bg-emerald-500/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm text-white">
          <Clock size={14} />
          <span className="text-sm font-medium">{tempsLivraison}</span>
        </div>
      </div>

      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-slate-800 group-hover:text-emerald-600 transition-colors line-clamp-1">
            {nom}
          </h3>
        </div>
        
        <p className="flex items-start gap-1.5 text-slate-500 text-sm mt-auto pt-4">
          <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
          <span className="line-clamp-2">
            {typeof adresse === 'object' ? JSON.stringify(adresse) : adresse}
          </span>
        </p>
      </div>
    </Link>
  );
}
