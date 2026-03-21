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
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sync state if controlled value changes externally
  useEffect(() => {
    setQuery(value);
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
    if (!query || query === value) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        // Limitation à la France + limit 5. Vous pouvez enlever countrycodes pour monde.
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1&countrycodes=fr`);
        const data = await res.json();
        setResults(data);
        setIsOpen(true);
      } catch (err) {
        console.error("Erreur géocodage:", err);
      } finally {
        setIsLoading(false);
      }
    }, 500); // 500ms debounce (Nominatim req rate limit < 1/sec)

    return () => clearTimeout(timer);
  }, [query, value]);

  const handleSelect = (item: any) => {
    const displayName = item.display_name;
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    
    setQuery(displayName);
    setIsOpen(false);
    onChange(displayName);
    onSelect(displayName, lat, lon);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);
    if (!isOpen && val.length > 2) setIsOpen(true);
  };

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isLoading ? <Loader2 size={18} className="text-emerald-500 animate-spin" /> : <Search size={18} className="text-slate-400" />}
        </div>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => { if (query.length > 2) setIsOpen(true) }}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-medium text-slate-800"
          autoComplete="off"
        />
      </div>

      {isOpen && results.length > 0 && (
        <ul className="absolute z-[100] w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
          {results.map((item, index) => (
            <li 
              key={item.place_id || index}
              onClick={() => handleSelect(item)}
              className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-start gap-3 transition-colors border-b border-slate-50 last:border-0"
            >
              <MapPin size={18} className="text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold text-slate-800 line-clamp-1">
                  {item.address?.house_number} {item.address?.road || item.display_name.split(',')[0]}
                </p>
                <p className="text-xs font-medium text-slate-500 line-clamp-1 mt-0.5">
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
