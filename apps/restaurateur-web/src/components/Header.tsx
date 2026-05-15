import { UtensilsCrossed, ShoppingBag, User } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { Link } from 'react-router-dom';

export default function Header() {
  const { items, total, toggleCart } = useCartStore();
  const totalItems = items.reduce((acc, item) => acc + item.quantite, 0);
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <Link to="/" className="flex items-center gap-2 cursor-pointer group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <UtensilsCrossed size={22} strokeWidth={2} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">
              Eco<span className="text-emerald-500">EATS</span>
            </span>
          </Link>

          
          <div className="flex items-center gap-x-4">
            <button className="flex items-center gap-2 text-slate-500 hover:text-emerald-500 transition-colors font-medium text-sm">
              <User size={18} />
              <span className="hidden sm:inline">Mon Compte</span>
            </button>
            <div className="h-6 w-px bg-slate-200 mx-1"></div>
            <button 
              onClick={toggleCart} 
              className="relative flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-full font-medium text-sm transition-colors cursor-pointer"
            >
              <ShoppingBag size={18} className="text-emerald-500" />
              <span>{total().toFixed(2)} €</span>
              
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
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
