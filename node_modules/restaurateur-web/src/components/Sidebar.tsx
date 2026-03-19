import { UtensilsCrossed, ChefHat, LayoutDashboard, Settings, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Sidebar() {
  const location = useLocation();
  const { restaurant, logout } = useAuthStore();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 h-screen sticky top-0 flex flex-col hidden md:flex">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <ChefHat size={18} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            {restaurant?.nom || 'EcoResto'}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-2">
        <Link 
          to="/orders" 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors font-medium ${
            isActive('/orders') 
              ? 'bg-emerald-500/10 text-emerald-500' 
              : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <LayoutDashboard size={18} className={isActive('/orders') ? 'text-emerald-500' : 'text-slate-400'} />
          Tableau de bord
        </Link>
        <Link 
          to="/menu" 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors font-medium ${
            isActive('/menu') 
              ? 'bg-emerald-500/10 text-emerald-500' 
              : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <UtensilsCrossed size={18} className={isActive('/menu') ? 'text-amber-500' : 'text-slate-400'} />
          Gestion du Menu
        </Link>
        <Link 
          to="/profile" 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors font-medium ${
            isActive('/profile') 
              ? 'bg-emerald-500/10 text-emerald-500' 
              : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Settings size={18} className={isActive('/profile') ? 'text-emerald-500' : 'text-slate-400'} />
          Profil Restaurant
        </Link>
      </nav>

      {/* Footer Profil */}
      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors cursor-pointer"
        >
          <LogOut size={18} />
          <span className="font-medium text-sm">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
