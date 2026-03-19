import { useState, useRef, useEffect } from 'react';
import { UtensilsCrossed, ShoppingBag, User, LogOut, ChevronDown, History, Gift, MapPin } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const { total, toggleCart } = useCartStore();
  const { user, logout } = useAuthStore();
  const totalItems = useCartStore(state => state.items.reduce((acc, item) => acc + item.quantite, 0));
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  const menuItems = [
    { icon: History, label: "Mes commandes", action: () => { navigate('/history'); setIsDropdownOpen(false); } },
    { icon: MapPin, label: "Suivi livraison", action: () => { navigate('/tracking'); setIsDropdownOpen(false); } },
    { icon: Gift, label: "Mes points de fidélité", action: () => { navigate('/loyalty'); setIsDropdownOpen(false); }, badge: "Nouveau" }
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <UtensilsCrossed size={22} strokeWidth={2} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">
              Eco<span className="text-emerald-500 border-b-4 border-emerald-100">EATS</span>
            </span>
          </Link>

          {/* Navigation - Right */}
          <div className="flex items-center gap-x-4">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 text-slate-700 font-black text-sm bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-2xl border border-slate-100 transition-colors"
                >
                  <User size={16} className="text-emerald-500" />
                  <span className="hidden sm:inline">{user.email.split('@')[0]}</span>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
                    <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Mon Compte</p>
                      <p className="font-bold text-slate-800 truncate">{user.email}</p>
                    </div>
                    <div className="py-2">
                      {menuItems.map((item, i) => (
                        <button 
                          key={i} 
                          onClick={item.action}
                          className="w-full flex items-center justify-between px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <item.icon size={16} />
                            {item.label}
                          </div>
                          {item.badge && (
                            <span className="text-[9px] font-black uppercase text-amber-600 bg-amber-100 px-2 py-0.5 rounded-md">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="p-2 border-t border-slate-50 bg-slate-50/50">
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-colors"
                      >
                        <LogOut size={16} />
                        Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login"
                className="flex items-center gap-2 text-slate-500 hover:text-emerald-500 transition-all font-black text-sm px-4 py-2 hover:bg-emerald-50 rounded-2xl"
              >
                <User size={18} />
                <span className="hidden sm:inline uppercase tracking-tight">Connexion</span>
              </Link>
            )}
            
            <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>
            
            <button 
              onClick={toggleCart} 
              className="relative flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-2xl font-black text-sm transition-all cursor-pointer shadow-xl shadow-slate-200 active:scale-95"
            >
              <ShoppingBag size={18} className="text-emerald-400" />
              <span className="tabular-nums">{total().toFixed(2)} €</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-black text-white shadow-lg ring-2 ring-white animate-in zoom-in">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
