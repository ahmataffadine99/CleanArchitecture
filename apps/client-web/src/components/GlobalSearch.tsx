import { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2, Search, Utensils, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GlobalSearchProps {
  onAddressSelect: (address: string, lat: number, lon: number) => void;
  placeholder?: string;
  className?: string;
}

export default function GlobalSearch({ 
  onAddressSelect, 
  placeholder = "Saisissez votre adresse pour voir les restos proches...", 
  className = ""
}: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [addressResults, setAddressResults] = useState<any[]>([]);
  const [restaurantResults, setRestaurantResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  useEffect(() => {
    if (!query || query.length < 2) {
      setAddressResults([]);
      setRestaurantResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const addrPromise = fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1&countrycodes=fr`)
          .then(res => res.json());

        const restPromise = fetch(`/api/restaurants`)
          .then(res => res.json())
          .then(data => {
            return data.filter((r: any) => 
              r.nom.toLowerCase().includes(query.toLowerCase()) || 
              r.categories?.some((c: string) => c.toLowerCase().includes(query.toLowerCase()))
            ).slice(0, 3);
          });

        const [addresses, restaurants] = await Promise.all([addrPromise, restPromise]);
        
        setAddressResults(addresses);
        setRestaurantResults(restaurants);
        setIsOpen(true);
      } catch (err) {
        console.error("Erreur recherche globale:", err);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const handleAddressClick = (item: any) => {
    const displayName = item.display_name;
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    
    setQuery(displayName);
    setIsOpen(false);
    onAddressSelect(displayName, lat, lon);
  };

  return (
    <div className={`relative ${className}`} ref={wrapperRef} style={{ isolation: 'isolate' }}>
      <div className="relative z-[1000]">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
          {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (query.length > 1) setIsOpen(true) }}
          placeholder={placeholder}
          className="w-full pl-14 pr-12 py-5 bg-white border-0 focus:ring-2 focus:ring-emerald-500 rounded-2xl md:rounded-[2.5rem] outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 text-lg shadow-xl"
          autoComplete="off"
        />
        {query && (
          <button 
            onClick={() => { setQuery(''); setAddressResults([]); setRestaurantResults([]); }}
            className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-300 hover:text-slate-500"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {isOpen && (addressResults.length > 0 || restaurantResults.length > 0) && (
        <div className="absolute z-[10001] w-full left-0 right-0 mt-3 bg-white border border-slate-100 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          
          <div className="max-h-[450px] overflow-y-auto no-scrollbar">
            
            {restaurantResults.length > 0 && (
              <div className="p-4 bg-emerald-50/30">
                <h3 className="px-3 py-2 text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-2">Restaurants correspondants</h3>
                <div className="space-y-1">
                  {restaurantResults.map((resto) => (
                    <div 
                      key={`resto-${resto.id}`}
                      onClick={() => { navigate(`/restaurant/${resto.id}`); setIsOpen(false); }}
                      className="px-4 py-3 hover:bg-white hover:shadow-md cursor-pointer flex items-center gap-4 transition-all rounded-xl group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white text-emerald-600 flex items-center justify-center shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <Utensils size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800">{resto.nom}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{resto.categories?.join(' • ')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            
            {addressResults.length > 0 && (
              <div className="p-4">
                <h3 className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Adresses de livraison (Proximité)</h3>
                <div className="space-y-1">
                  {addressResults.map((item) => (
                    <div 
                      key={`addr-${item.place_id}`}
                      onClick={() => handleAddressClick(item)}
                      className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-start gap-4 transition-all rounded-xl group"
                    >
                      <div className="mt-1 text-slate-300 group-hover:text-emerald-500 transition-colors">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 line-clamp-1">{item.display_name.split(',')[0]}</p>
                        <p className="text-[10px] font-medium text-slate-400 line-clamp-2 leading-relaxed">{item.display_name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100">
             <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest">
               EcoEATS — Livraison éco-responsable à Paris
             </p>
          </div>
        </div>
      )}
    </div>
  );
}
