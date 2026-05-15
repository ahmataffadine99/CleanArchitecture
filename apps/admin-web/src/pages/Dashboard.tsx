import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, ShoppingBag, Utensils, TrendingUp, 
  LogOut, Bell, Search, Filter, Loader2, ArrowUpRight, 
  Clock, CheckCircle2, AlertCircle, MessageSquare, Sparkles, LayoutGrid, Award, X
} from 'lucide-react';

interface Stats {
  nbUtilisateurs: number;
  nbCommandes: number;
  nbRestaurants: number;
  revenuTotalEuros: number;
  co2TotalKg: number;
  tendances: {
    commandes: number;
    nouveauxComptes: number;
    restaurantsSemaine: number;
    enAttente: number;
    ticketsOuverts: number;
  };
  commandesRecentes: any[];
}

type Tab = 'dashboard' | 'users' | 'restaurants' | 'orders' | 'support' | 'categories' | 'livreurs';

export default function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('admin_token');
        const res = await fetch('/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setStats(await res.json());
        } else {
          const data = await res.json();
          setError(data.error || "Impossible de charger les statistiques.");
        }
      } catch (err) { 
        console.error(err);
        setError("Erreur de connexion au serveur.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const onTicketRead = () => {
    const fetchStats = async () => {
        try {
          const token = localStorage.getItem('admin_token');
          const res = await fetch('/api/admin/stats', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            setStats(await res.json());
          }
        } catch (err) { 
          console.error(err);
        }
      };
      fetchStats();
  };

  // ... (loading logic)

  const renderContent = () => {
    if (selectedRestaurant) return <RestaurantDetailsView restaurant={selectedRestaurant} onBack={() => setSelectedRestaurant(null)} />;

    if (loading && activeTab === 'dashboard') {
      return (
        <div className="flex flex-col items-center justify-center p-20 animate-in fade-in">
          <Loader2 className="animate-spin text-emerald-500 mb-4" size={32} />
          <p className="text-slate-400 font-medium italic">Chargement des données...</p>
        </div>
      );
    }

    if (error && activeTab === 'dashboard') {
      return (
        <div className="flex flex-col items-center justify-center p-20 text-center animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-red-500/10">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">{error}</h3>
          <p className="text-slate-500 mb-6 max-w-xs">Une erreur est survenue lors de la récupération des données en temps réel.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all"
          >
            Réessayer
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard': return <StatsView stats={stats} searchTerm={searchTerm} />;
      case 'users': return <UsersView searchTerm={searchTerm} />;
      case 'restaurants': return <RestaurantsView onManage={(r) => setSelectedRestaurant(r)} searchTerm={searchTerm} />;
      case 'orders': return <OrdersView searchTerm={searchTerm} />;
      case 'support': return <SupportView searchTerm={searchTerm} onTicketRead={onTicketRead} />;
      case 'livreurs': return <LivreursPerformanceView />;
      default: return <StatsView stats={stats} searchTerm={searchTerm} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-30">
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <BarChart3 size={16} />
            </div>
            <span className="text-lg font-black tracking-tight">EcoEATS <span className="text-emerald-500">Admin</span></span>
          </div>

          <nav className="space-y-1">
            <NavItem 
              icon={TrendingUp} label="Tableau de bord" 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')} 
            />
            <NavItem 
              icon={Users} label="Utilisateurs" 
              active={activeTab === 'users'} 
              onClick={() => setActiveTab('users')} 
            />
            <NavItem 
              icon={Utensils} label="Restaurants" 
              active={activeTab === 'restaurants'} 
              onClick={() => setActiveTab('restaurants')} 
            />
            <NavItem 
              icon={ShoppingBag} label="Commandes" 
              active={activeTab === 'orders'} 
              onClick={() => setActiveTab('orders')} 
            />
            <NavItem 
              icon={MessageSquare} label="Support" 
              active={activeTab === 'support'} 
              onClick={() => setActiveTab('support')} 
            />
            <div className="pt-4 mt-4 border-t border-slate-800">
              <NavItem 
                icon={Award} label="Livreurs TOP" 
                active={activeTab === 'livreurs'} 
                onClick={() => setActiveTab('livreurs')} 
              />
            </div>
          </nav>
        </div>

        {/* Logout */}
        <div className="mt-auto p-6 border-t border-slate-800">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all font-bold text-sm"
          >
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              {activeTab === 'dashboard' ? 'Bonjour, Administrateur' : 
               activeTab === 'users' ? 'Gestion des Utilisateurs' :
               activeTab === 'restaurants' ? 'Gestion des Restaurants' : 'Suivi des Commandes'}
            </h1>
            <p className="text-slate-500 font-medium">
              {activeTab === 'dashboard' ? "Voici ce qu'il se passe sur la plateforme aujourd'hui." : 
               `Consultez et gérez les ${activeTab === 'users' ? 'utilisateurs' : activeTab === 'restaurants' ? 'restaurants' : 'commandes'} d'EcoEATS.`}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white border border-slate-200 pl-12 pr-6 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 text-sm w-64 transition-all"
              />
            </div>
            <button 
              onClick={() => setActiveTab('support')}
              className="relative p-3 bg-white border border-slate-200 text-slate-400 hover:text-emerald-500 rounded-2xl transition-all shadow-sm group"
            >
              <Bell size={20} />
              {stats?.tendances.ticketsOuverts ? stats.tendances.ticketsOuverts > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white shadow-lg ring-2 ring-white animate-bounce">
                  {stats.tendances.ticketsOuverts}
                </span>
              ) : null}
            </button>
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
}

function StatsView({ stats, searchTerm }: { stats: Stats | null, searchTerm: string }) {
  if (!stats) return null;

  const filteredRecentOrders = (stats.commandesRecentes || []).filter(cmd => 
    cmd.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cmd.clientNom && cmd.clientNom.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (cmd.restaurantNom && cmd.restaurantNom.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          label="Chiffre d'Affaires" 
          value={`${stats.revenuTotalEuros.toFixed(2)} €`} 
          icon={TrendingUp} 
          color="text-emerald-600" 
          bgColor="bg-emerald-50"
          trend={`${stats.tendances.commandes >= 0 ? '+' : ''}${stats.tendances.commandes}% vs hier`}
        />
        <StatCard 
          label="Nouv. Comptes" 
          value={stats.nbUtilisateurs} 
          icon={Users} 
          color="text-blue-600" 
          bgColor="bg-blue-50"
          trend={`+${stats.tendances.nouveauxComptes} aujourd'hui`}
        />
        <StatCard 
          label="Commandes" 
          value={stats.nbCommandes} 
          icon={ShoppingBag} 
          color="text-indigo-600" 
          bgColor="bg-indigo-50"
          trend={`${stats.tendances.enAttente} en attente`}
        />
        <StatCard 
          label="Restaurants" 
          value={stats.nbRestaurants} 
          icon={Utensils} 
          color="text-amber-600" 
          bgColor="bg-amber-50"
          trend={`${stats.tendances.restaurantsSemaine} cette semaine`}
        />
        <StatCard 
          label="Impact Écologique" 
          value={`${stats.co2TotalKg} Kg CO2`} 
          icon={Sparkles} 
          color="text-emerald-500" 
          bgColor="bg-emerald-100/50"
          trend="Économisés vs voiture"
        />
      </div>

      {/* Recent Orders Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden h-fit">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-800">Commandes Récentes</h3>
            <button className="text-emerald-600 text-sm font-black hover:underline">Voir tout</button>
          </div>
          <div className="divide-y divide-slate-50">
            {filteredRecentOrders.map((cmd) => (
              <OrderRow key={cmd.id} order={cmd} />
            ))}
            {filteredRecentOrders.length === 0 && <div className="p-8 text-center text-slate-300 italic">Aucune commande correspondante</div>}
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden group border border-white/5 shadow-2xl">
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black tracking-tight">Santé Globale</h3>
                <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-black rounded-full border border-emerald-500/30 animate-pulse">
                  OPTIMAL
                </div>
              </div>
              
              <div className="space-y-6">
                <StatusRow label="API Engine" status="99.9%" />
                <StatusRow label="Base de données" status="Online" />
                <StatusRow label="Elastic Search" status="Online" />
              </div>
            </div>

            <div className="mt-10 p-6 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-sm">
              <p className="text-slate-400 text-xs font-bold mb-3 uppercase tracking-widest text-center">Performance Réseau</p>
              <div className="flex justify-between items-end gap-1 h-12 px-2">
                 {[40, 70, 45, 90, 65, 80, 50, 85, 95, 75, 60, 80].map((h, i) => (
                   <div key={i} className="flex-1 bg-emerald-500/40 rounded-t-sm animate-bounce" style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }} />
                 ))}
              </div>
            </div>
          </div>
          <BarChart3 size={200} className="absolute -bottom-20 -right-20 text-white/[0.02] group-hover:rotate-12 transition-transform duration-1000" />
        </div>
      </div>
    </div>
  );
}

function UsersView({ searchTerm }: { searchTerm: string }) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/admin/comptes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/admin/comptes/${id}/statut`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ estActif: !currentStatus })
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === id ? { ...u, estActif: !currentStatus } : u));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-slate-50 flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800">Gestion des Comptes</h3>
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{filteredUsers.length} comptes trouvés</span>
      </div>
      
      {loading ? (
        <div className="p-10 text-center text-slate-400 italic font-medium">Chargement...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <th className="px-8 py-4">Utilisateur</th>
                <th className="px-8 py-4">Rôle</th>
                <th className="px-8 py-4">Statut</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-all">
                  <td className="px-8 py-5">
                    <p className="font-bold text-slate-800 text-sm">{user.email}</p>
                    <p className="text-[10px] text-slate-400 font-medium">#{user.id.slice(0, 8)}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-black px-2 py-1 bg-slate-100 text-slate-600 rounded-lg">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full ${user.estActif ? 'bg-emerald-500' : 'bg-red-500'}`} />
                       <span className={`text-xs font-bold ${user.estActif ? 'text-emerald-600' : 'text-red-600'}`}>
                         {user.estActif ? 'ACTIF' : 'SUSPENDU'}
                       </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => toggleStatus(user.id, user.estActif)}
                      className={`text-xs font-black px-4 py-2 rounded-xl transition-all ${
                        user.estActif 
                          ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                          : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                      }`}
                    >
                      {user.estActif ? 'Suspendre' : 'Réactiver'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function RestaurantsView({ onManage, searchTerm }: { onManage: (r: any) => void, searchTerm: string }) {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const filteredRestaurants = restaurants.filter(r => 
    r.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.adresse.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const res = await fetch('/api/admin/restaurants', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setRestaurants(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {loading ? (
        <div className="col-span-full p-10 text-center text-slate-400 italic">Chargement...</div>
      ) : (
        filteredRestaurants.map((resto) => (
          <div key={resto.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-emerald-500/5 transition-all">
            <div className="aspect-video w-full bg-slate-50 relative overflow-hidden">
              {resto.imageUrl ? (
                <img src={resto.imageUrl} alt={resto.nom} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-200">
                  <Utensils size={40} />
                </div>
              )}
              <div className="absolute top-4 right-4">
                <span className="bg-white/90 backdrop-blur-md text-emerald-600 text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm">
                  ACTIF
                </span>
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-xl font-black text-slate-800 mb-2 truncate">{resto.nom}</h3>
              <p className="text-sm text-slate-400 font-medium mb-6 line-clamp-1">{resto.adresse}</p>
              <button 
                onClick={() => onManage(resto)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-emerald-600 transition-all shadow-lg shadow-slate-900/10"
              >
                Gérer l'établissement
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function RestaurantDetailsView({ restaurant: basicInfo, onBack }: { restaurant: any, onBack: () => void }) {
  const [restaurant, setRestaurant] = useState<any>(basicInfo);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullStats = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const res = await fetch(`/api/admin/restaurants/${basicInfo.id}/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const stats = await res.json();
          setRestaurant(stats);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFullStats();
  }, [basicInfo.id]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 font-bold text-sm hover:text-slate-800 transition-colors">
        <ArrowUpRight className="rotate-[225deg]" size={16} />
        Retour à la liste
      </button>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="h-48 bg-slate-900 relative">
          <div className="absolute -bottom-12 left-12 w-24 h-24 bg-white rounded-3xl shadow-xl border-4 border-white overflow-hidden">
             {restaurant.imageUrl ? <img src={restaurant.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-200"><Utensils size={32} /></div>}
          </div>
        </div>
        <div className="pt-16 p-12">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-black text-slate-800 mb-2">{restaurant.nom}</h2>
              <p className="text-slate-400 font-medium">{restaurant.adresse}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-12">
            <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-emerald-500/30 transition-colors group">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Ventes Totales</span>
              <span className="text-2xl font-black text-slate-800">{loading ? '...' : `${restaurant.ventesTotalesEuros?.toLocaleString('fr-FR')} €`}</span>
            </div>
            <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-blue-500/30 transition-colors group">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Commandes</span>
              <span className="text-2xl font-black text-slate-800">{loading ? '...' : restaurant.nbCommandes}</span>
            </div>
            <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-amber-500/30 transition-colors group">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Note Moyenne</span>
              <div className="flex items-center gap-2">
                 <span className="text-2xl font-black text-slate-800">{loading ? '...' : restaurant.noteMoyenne}</span>
                 {!loading && <TrendingUp size={16} className="text-emerald-500" />}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-12">
        <h3 className="text-xl font-black text-slate-800 mb-6">Informations de l'établissement</h3>
        <p className="text-slate-500 font-medium max-w-2xl">
          Cet établissement est géré directement par son propriétaire. En tant qu'administrateur, vous avez accès aux statistiques de vente et à l'historique des commandes pour assurer le bon fonctionnement de la plateforme.
        </p>
      </div>
    </div>
  );
}

function OrdersView({ searchTerm }: { searchTerm: string }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.clientNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.restaurantNom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const res = await fetch('/api/admin/commandes', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-slate-50 flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800">Suivi des Commandes</h3>
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{filteredOrders.length} commandes filtrées</span>
      </div>
      
      {loading ? (
        <div className="p-10 text-center text-slate-400 italic">Chargement...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <th className="px-8 py-4">ID Commande</th>
                <th className="px-8 py-4">Client</th>
                <th className="px-8 py-4">Restaurant</th>
                <th className="px-8 py-4">Total</th>
                <th className="px-8 py-4">Statut</th>
                <th className="px-8 py-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-all">
                  <td className="px-8 py-5">
                    <span className="font-bold text-slate-800 text-sm">#{order.id.slice(0, 8)}</span>
                  </td>
                  <td className="px-8 py-5">
                    <p className="font-bold text-slate-700 text-sm">{order.clientNom}</p>
                    <p className="text-[10px] text-slate-400">ID: {order.clientId.slice(0, 8)}</p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="font-bold text-slate-700 text-sm">{order.restaurantNom}</p>
                    <p className="text-[10px] text-slate-400">ID: {order.restaurantId.slice(0, 8)}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className="font-black text-slate-800 text-sm">{order.prixTotal.toFixed(2)} €</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${
                      order.statut === 'LIVREE' ? 'bg-emerald-100 text-emerald-600' :
                      order.statut === 'REFUSEE' ? 'bg-red-100 text-red-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {order.statut}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right font-medium text-slate-400 text-xs">
                    {new Date(order.creeLe).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="p-10 text-center text-slate-400 font-medium">Aucune commande trouvée.</div>
          )}
        </div>
      )}
    </div>
  );
}

function SupportView({ searchTerm, onTicketRead }: { searchTerm: string, onTicketRead: () => void }) {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [reply, setReply] = useState('');

  const filteredTickets = tickets.filter(t => 
    t.titre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (t.auteurNom && t.auteurNom.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/admin/tickets', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSendReply = async () => {
    if (!reply.trim() || !selectedTicket) return;
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/admin/tickets/${selectedTicket.id}/message`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ contenu: reply, auteurId: 'ADMIN' })
      });
      if (res.ok) {
        setReply('');
        fetchTickets(); // Refresh
        // Optionally update selectedTicket locally
        const updatedRes = await fetch(`/api/admin/tickets/${selectedTicket.id}`, {
             headers: { 'Authorization': `Bearer ${token}` }
        });
        // We don't have a single ticket fetch route yet but fetchTickets will do for now
      }
    } catch (err) {
      console.error(err);
    }
  };

  const closeTicket = async (id: string) => {
    try {
      const token = localStorage.getItem('admin_token');
      await fetch(`/api/admin/tickets/${id}/cloturer`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchTickets();
      if (selectedTicket?.id === id) setSelectedTicket(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-400 italic font-medium">Chargement du support...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[700px]">
      <div className="lg:col-span-1 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-50">
          <h3 className="text-lg font-bold text-slate-800">Tickets reçus</h3>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
          {filteredTickets.map((t) => (
            <button 
              key={t.id}
              onClick={async () => {
                setSelectedTicket(t);
                if (!t.estLu) {
                  try {
                    const token = localStorage.getItem('admin_token');
                    await fetch(`/api/admin/tickets/${t.id}/lire`, {
                      method: 'POST',
                      headers: { 'Authorization': `Bearer ${token}` }
                    });
                    t.estLu = true; // Local update
                    onTicketRead();
                  } catch (err) {
                    console.error(err);
                  }
                }
              }}
              className={`w-full p-6 text-left hover:bg-slate-50 transition-all ${selectedTicket?.id === t.id ? 'bg-emerald-50/50 border-r-4 border-emerald-500' : ''}`}
            >
              <div className="flex justify-between items-start mb-1 gap-2">
                <div className="flex items-center gap-2 truncate">
                  {!t.estLu && <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-lg shadow-rose-500/20 flex-shrink-0" />}
                  <span className="font-bold text-slate-800 truncate pr-2">{t.titre}</span>
                </div>
                <span className={`text-[10px] font-black px-2 py-1 rounded-full flex-shrink-0 ${t.statut === 'OUVERT' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                  {t.statut}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.auteurRole}</span>
                 <span className="text-[10px] font-bold text-emerald-600 truncate max-w-[100px]">{t.auteurNom}</span>
              </div>
              {t.messages && t.messages.length > 0 && (
                <p className="text-xs text-slate-400 truncate italic">"{t.messages[t.messages.length - 1]?.contenu}"</p>
              )}
              <div className="mt-2 text-[10px] font-medium text-slate-300">
                {new Date(t.creeLe).toLocaleDateString()}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        {selectedTicket ? (
          <>
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center font-black text-xl">
                  {selectedTicket.auteurNom?.[0] || '?'}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{selectedTicket.auteurNom} <span className="text-xs text-slate-400 font-medium whitespace-nowrap ml-2">({selectedTicket.auteurRole})</span></h3>
                  <p className="text-xs text-slate-400 font-medium">Ticket: {selectedTicket.titre}</p>
                </div>
              </div>
              {selectedTicket.statut === 'OUVERT' && (
                <button 
                  onClick={() => closeTicket(selectedTicket.id)}
                  className="text-xs font-black text-rose-500 hover:text-rose-600 uppercase tracking-tighter"
                >
                  Clôturer le ticket
                </button>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {selectedTicket.messages.map((m: any) => (
                <div key={m.id} className={`flex ${m.estAdmin ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium ${m.estAdmin ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-slate-100 text-slate-700 rounded-tl-none'}`}>
                    {m.contenu}
                  </div>
                </div>
              ))}
            </div>

            {selectedTicket.statut === 'OUVERT' && (
              <div className="p-6 border-t border-slate-50 bg-slate-50/30">
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    placeholder="Votre réponse..."
                    className="flex-1 bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    onKeyDown={e => e.key === 'Enter' && handleSendReply()}
                  />
                  <button 
                    onClick={handleSendReply}
                    className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    Envoyer
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mb-4">
              <MessageSquare size={32} />
            </div>
            <p className="text-slate-400 font-medium">Sélectionnez un ticket pour voir la discussion</p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- NEW VIEWS ---


function LivreursPerformanceView() {
  const [livreurs, setLivreurs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLivreurs = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const res = await fetch('/api/admin/livreurs', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setLivreurs(await res.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLivreurs();
  }, []);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-right duration-500">
      <div className="p-8 border-b border-slate-50 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-black text-slate-800">Performance Livreurs</h3>
          <p className="text-slate-400 text-sm font-medium">Suivi en temps réel de vos partenaires.</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <th className="px-8 py-4">Livreur</th>
              <th className="px-8 py-4">Missions</th>
              <th className="px-8 py-4">Gains</th>
              <th className="px-8 py-4">Éco-Score</th>
              <th className="px-8 py-4 text-right">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {livreurs.map((l) => (
              <tr key={l.id} className="hover:bg-slate-50/50 transition-all group">
                <td className="px-8 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black">
                      {l.nom[0]}
                    </div>
                    <span className="font-bold text-slate-800">{l.nom}</span>
                  </div>
                </td>
                <td className="px-8 py-4 font-bold text-slate-500">{l.coursesCount || l.courses || 0}</td>
                <td className="px-8 py-4 font-black text-slate-900">{(l.portefeuille || l.revenu || 0).toFixed(2)} €</td>
                <td className="px-8 py-4">
                  <span className="text-emerald-600 font-bold">+{l.ecoImpact || 0}kg CO2</span>
                </td>
                <td className="px-8 py-4 text-right">
                  <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${l.statut === 'DISPONIBLE' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    {l.statut || 'HORS-LIGNE'}
                  </span>
                </td>
              </tr>
            ))}
            {livreurs.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className="p-10 text-center text-slate-400 italic">Aucun livreur trouvé</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- HELPER COMPONENTS (PREMIUM UI) ---

function NavItem({ icon: Icon, label, active = false, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm mb-1.5 ${
        active 
          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-xl shadow-emerald-500/30 translate-x-2' 
          : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
      }`}
    >
      <Icon size={20} className={active ? 'animate-pulse' : 'opacity-70'} />
      {label}
    </button>
  );
}

function StatCard({ label, value, icon: Icon, color, bgColor, trend }: any) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:shadow-2xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-500 overflow-hidden relative">
      <div className="relative z-10">
        <div className={`w-14 h-14 ${bgColor} ${color} rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:rotate-12 group-hover:scale-110 transition-all duration-500`}>
          <Icon size={26} />
        </div>
        <div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{label}</p>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight mb-3">{value}</h3>
          {trend && (
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100/50">
              {trend}
            </span>
          )}
        </div>
      </div>
      <Icon size={120} className="absolute -bottom-8 -right-8 text-slate-50 group-hover:text-emerald-50/30 group-hover:scale-125 group-hover:rotate-12 transition-all duration-1000" />
    </div>
  );
}

function OrderRow({ order }: any) {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'LIVREE': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'ANNULEE': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };

  return (
    <div className="p-8 flex items-center justify-between hover:bg-slate-50/50 transition-all group border-b border-slate-50 last:border-0">
      <div className="flex items-center gap-6">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-lg transition-all border border-transparent group-hover:border-slate-100">
          <ShoppingBag size={24} />
        </div>
        <div>
          <p className="font-black text-slate-800 group-hover:text-emerald-600 transition-colors">#{order?.id?.slice(0, 8) || '00000000'}</p>
          <p className="text-xs text-slate-400 font-bold flex items-center gap-2 mt-1">
            <Clock size={14} className="text-slate-300" /> 
            {order?.creeLe ? new Date(order.creeLe).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-10">
        <div className="text-right">
          <p className="font-black text-slate-900 text-lg">{(order?.prixTotal || 0).toFixed(2)} €</p>
          <span className={`text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-widest mt-1 block w-fit ml-auto ${getStatusStyle(order?.statut || 'INCONNU')}`}>
            {order?.statut || 'INCONNU'}
          </span>
        </div>
        <button className="p-4 bg-white border border-slate-100 text-slate-300 hover:text-emerald-500 hover:border-emerald-200 rounded-2xl shadow-sm transition-all hover:scale-110 active:scale-95">
          <ArrowUpRight size={20} />
        </button>
      </div>
    </div>
  );
}

function StatusRow({ label, status }: { label: string, status: string }) {
  return (
    <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-all cursor-default group/row">
      <span className="text-slate-400 text-sm font-bold group-hover/row:text-slate-200 transition-colors">{label}</span>
      <span className="text-emerald-400 font-black text-xs tracking-widest bg-emerald-500/10 px-3 py-1 rounded-lg">{status}</span>
    </div>
  );
}
