import { UtensilsCrossed, ChefHat, LayoutDashboard, Settings, LogOut, History, Activity, LifeBuoy } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Sidebar() {
  const location = useLocation();
  const { restaurant, logout } = useAuthStore();
  
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { path: '/', label: "Vue d'ensemble", icon: LayoutDashboard, color: "emerald" },
    { path: '/orders', label: "Commandes en direct", icon: Activity, color: "rose" },
    { path: '/history', label: "Historique", icon: History, color: "indigo" },
    { path: '/menu', label: "Gestion du Menu", icon: UtensilsCrossed, color: "amber" },
    { path: '/profile', label: "Profil Restaurant", icon: Settings, color: "cyan" },
    { path: '/support', label: "Support", icon: LifeBuoy, color: "slate" },
  ];

  return (
    <aside className="w-[280px] bg-slate-900 border-r border-slate-800 h-screen sticky top-0 flex flex-col hidden md:flex font-sans">
      {/* Logo */}
      <div className="h-24 flex items-center px-8 border-b border-slate-800/80">
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <ChefHat size={22} strokeWidth={2.5} />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-white block">
              {restaurant?.nom || 'EcoResto'}
            </span>
            <span className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider">Dashboard Partenaire</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto hidden-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link 
              key={item.path}
              to={item.path} 
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm ${
                active 
                  ? `bg-${item.color}-500 text-white shadow-lg shadow-${item.color}-500/20` 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon size={20} className={active ? "text-white" : `text-slate-500 group-hover:text-${item.color}-400`} />
              {item.label}
              {item.path === '/orders' && (
                <span className={`ml-auto w-2 h-2 rounded-full ${active ? 'bg-white' : 'bg-rose-500'} animate-pulse`}></span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Profil */}
      <div className="p-6 border-t border-slate-800/80 bg-slate-900/50">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
            <LogOut size={16} />
          </div>
          <div className="text-left flex-1">
            <span className="font-bold text-sm block">Déconnexion</span>
          </div>
        </button>
      </div>
    </aside>
  );
}
