import { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2, Search } from 'lucide-react';

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (address: string, lat: number, lon: number) => void;
  placeholder?: string;
  className?: string;
}

export default function AddressAutocomplete({ value, onChange, onSelect, placeholder = "Rechercher une adresse...", className = "" }: AddressAutocompleteProps) {
  const [query, setQuery] = useState(value || '');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lastSelectedRef = useRef(value || '');

  // Sync state if controlled value changes externally (e.g. from API)
  useEffect(() => {
    if (value !== query) {
      setQuery(value || '');
      lastSelectedRef.current = value || '';
    }
  }, [value]);

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

  // Debounced search
  useEffect(() => {
    // Si la requête est vide ou identique à la dernière valeur sélectionnée, on ne cherche pas
    if (!query || query.length < 3 || query === lastSelectedRef.current) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1&countrycodes=fr`);
        const data = await res.json();
        setResults(data);
        setIsOpen(true);
      } catch (err) {
        console.error("Erreur géocodage:", err);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (item: any) => {
    const displayName = item.display_name;
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    
    lastSelectedRef.current = displayName;
    setQuery(displayName);
    setIsOpen(false);
    setResults([]);
    onSelect(displayName, lat, lon);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);
  };

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      <div className="relative group">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors z-10">
          {isLoading ? <Loader2 size={24} className="animate-spin" /> : <MapPin size={24} />}
        </div>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => { if (query.length > 2) setIsOpen(true) }}
          placeholder={placeholder}
          className="w-full pl-16 pr-6 py-6 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-[1.5rem] outline-none transition-all font-black text-slate-700 text-xl placeholder:text-slate-300"
          autoComplete="off"
        />
      </div>

      {isOpen && results.length > 0 && (
        <ul className="absolute z-[100] w-full mt-3 bg-white border border-slate-100 rounded-[1.5rem] shadow-2xl overflow-hidden max-h-80 overflow-y-auto animate-in slide-in-from-top-2 duration-200">
          {results.map((item, index) => (
            <li 
              key={item.place_id || index}
              onClick={() => handleSelect(item)}
              className="px-6 py-4 hover:bg-emerald-50 cursor-pointer flex items-start gap-4 transition-colors border-b border-slate-50 last:border-0"
            >
              <div className="mt-1 p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:bg-white transition-colors">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-base font-bold text-slate-800 line-clamp-1">
                  {item.address?.house_number} {item.address?.road || item.display_name.split(',')[0]}
                </p>
                <p className="text-xs font-medium text-slate-400 line-clamp-1 mt-1">
                  {item.display_name}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

