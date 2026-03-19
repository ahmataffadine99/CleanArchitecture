import { UtensilsCrossed, ShoppingBag, User, LogOut } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';

export default function Header() {
  const { total, toggleCart } = useCartStore();
  const { user, logout } = useAuthStore();
  const totalItems = useCartStore(state => state.items.reduce((acc, item) => acc + item.quantite, 0));

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
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2 text-slate-700 font-black text-sm bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                  <User size={16} className="text-emerald-500" />
                  <span className="hidden sm:inline">{user.email.split('@')[0]}</span>
                </div>
                <button 
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  title="Déconnexion"
                >
                  <LogOut size={20} />
                </button>
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
