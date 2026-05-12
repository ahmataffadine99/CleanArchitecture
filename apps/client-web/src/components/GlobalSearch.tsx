import { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2, Search, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GlobalSearchProps {
  onAddressSelect: (address: string, lat: number, lon: number) => void;
  placeholder?: string;
  className?: string;
}

export default function GlobalSearch({ 
  onAddressSelect, 
  placeholder = "Trouver une adresse ou un restaurant...", 
  className = ""
}: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [addressResults, setAddressResults] = useState<any[]>([]);
  const [restaurantResults, setRestaurantResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  // Combined Search
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
        // 1. Search Addresses (Nominatim)
        const addrPromise = fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=3&addressdetails=1&countrycodes=fr`)
          .then(res => res.json());

        // 2. Search Restaurants (Our API)
        const restPromise = fetch(`/api/restaurants`)
          .then(res => res.json())
          .then(data => {
            // Filter locally for the demo
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

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
          {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (query.length > 1) setIsOpen(true) }}
          placeholder={placeholder}
          className="w-full pl-14 pr-6 py-4 bg-white border-0 focus:ring-0 rounded-2xl md:rounded-[2.5rem] outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 text-lg shadow-none"
          autoComplete="off"
        />
      </div>

      {isOpen && (addressResults.length > 0 || restaurantResults.length > 0) && (
        <ul className="absolute z-[9999] w-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-3xl shadow-2xl overflow-hidden max-h-[400px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-300">
          
          {/* Restaurants Section */}
          {restaurantResults.length > 0 && (
            <div className="p-2">
              <h3 className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Restaurants</h3>
              {restaurantResults.map((resto) => (
                <li 
                  key={`resto-${resto.id}`}
                  onClick={() => { navigate(`/restaurant/${resto.id}`); setIsOpen(false); }}
                  className="px-4 py-3 hover:bg-emerald-50 cursor-pointer flex items-center gap-4 transition-colors rounded-2xl group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <Utensils size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800">{resto.nom}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{resto.categories?.join(', ')}</p>
                  </div>
                </li>
              ))}
            </div>
          )}

          {/* Separation line */}
          {restaurantResults.length > 0 && addressResults.length > 0 && <div className="h-px bg-slate-50 mx-4" />}

          {/* Addresses Section */}
          {addressResults.length > 0 && (
            <div className="p-2">
              <h3 className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Adresses de livraison</h3>
              {addressResults.map((item) => (
                <li 
                  key={`addr-${item.place_id}`}
                  onClick={() => {
                    setQuery(item.display_name);
                    setIsOpen(false);
                    onAddressSelect(item.display_name, parseFloat(item.lat), parseFloat(item.lon));
                  }}
                  className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-start gap-4 transition-colors rounded-2xl group"
                >
                  <div className="mt-1 text-slate-300 group-hover:text-emerald-500 transition-colors">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 line-clamp-1">{item.display_name.split(',')[0]}</p>
                    <p className="text-[10px] font-medium text-slate-400 line-clamp-1">{item.display_name}</p>
                  </div>
                </li>
              ))}
            </div>
          )}
        </ul>
      )}
    </div>
  );
}
