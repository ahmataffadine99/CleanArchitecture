import { useState, useRef, useEffect } from 'react';
import { UtensilsCrossed, ShoppingBag, User, LogOut, ChevronDown, History, Gift, MapPin, Heart } from 'lucide-react';
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
    { icon: User, label: "Mes informations", action: () => { navigate('/profile'); setIsDropdownOpen(false); } },
    { icon: History, label: "Mes commandes", action: () => { navigate('/history'); setIsDropdownOpen(false); } },
    { icon: Heart, label: "Mes favoris", action: () => { navigate('/favorites'); setIsDropdownOpen(false); } },
    { icon: MapPin, label: "Mes Adresses", action: () => { navigate('/addresses'); setIsDropdownOpen(false); } },
    { icon: Gift, label: "Mes points de fidélité", action: () => { navigate('/loyalty'); setIsDropdownOpen(false); }, badge: "Nouveau" }
  ];

  return (
    <header className="sticky top-0 z-[100] w-full bg-white/70 backdrop-blur-xl border-b border-slate-100/50 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 cursor-pointer group">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 group-hover:rotate-6 transition-all duration-500">
              <UtensilsCrossed size={24} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-800 flex items-baseline">
              Eco<span className="text-emerald-500">EATS</span>
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full ml-1" />
            </span>
          </Link>

          {/* Navigation - Right */}
          <div className="flex items-center gap-x-5">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 text-slate-700 font-black text-xs bg-slate-50 hover:bg-slate-100 px-4 py-2.5 rounded-2xl border border-slate-100/50 transition-all active:scale-95"
                >
                  <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center text-[10px]">
                    {user.email[0].toUpperCase()}
                  </div>
                  <span className="hidden sm:inline uppercase tracking-widest">{user.email.split('@')[0]}</span>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-4 w-72 bg-white rounded-[2rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 z-[101]">
                    <div className="p-6 border-b border-slate-50 bg-gradient-to-br from-slate-50 to-white">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Espace Membre</p>
                      <p className="font-black text-slate-800 truncate text-sm">{user.email}</p>
                    </div>
                    <div className="p-2">
                      {menuItems.map((item, i) => (
                        <button 
                          key={i} 
                          onClick={item.action}
                          className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-bold text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <item.icon size={18} className="opacity-50 group-hover:opacity-100" />
                            {item.label}
                          </div>
                          {item.badge && (
                            <span className="text-[9px] font-black uppercase text-white bg-emerald-500 px-2.5 py-1 rounded-lg shadow-sm">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="p-3 border-t border-slate-50">
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-5 py-4 text-sm font-black text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                      >
                        <LogOut size={18} />
                        DÉCONNEXION
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login"
                className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 transition-all font-black text-xs uppercase tracking-widest px-4 py-2.5 bg-slate-50 hover:bg-emerald-50 rounded-2xl border border-slate-100/50"
              >
                <User size={18} />
                Connexion
              </Link>
            )}
            
            <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>
            
            <button 
              onClick={toggleCart} 
              className="relative flex items-center gap-3 bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-2xl font-black text-sm transition-all cursor-pointer shadow-xl shadow-slate-900/10 hover:shadow-emerald-500/20 active:scale-95 group"
            >
              <ShoppingBag size={20} className="text-emerald-400 group-hover:animate-bounce" />
              <span className="tabular-nums tracking-tight">{total().toFixed(2)} €</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-[11px] font-black text-white shadow-lg ring-4 ring-white animate-in zoom-in duration-500">
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
