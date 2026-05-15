import { useState, useEffect } from 'react';
import { TrendingUp, ShoppingBag, DollarSign, Activity, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

type Commande = {
  id: string;
  statut: string;
  prixPlatsCentimes: number;
  creeLe: string;
  clientNom?: string;
  livreurNom?: string;
  articles: Array<{
    nom: string;
    quantite: number;
  }>;
};

export default function DashboardHome() {
  const { token, restaurant, user } = useAuthStore();
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const chargerDonnees = async () => {
      if (!token || !user?.profilId) return;
      try {
        const res = await fetch(`/api/restaurant/${user.profilId}/commandes`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setCommandes(data);
        }
      } catch (err) {
        console.error("Erreur chargement commandes", err);
      } finally {
        setLoading(false);
      }
    };
    chargerDonnees();
    const interval = setInterval(chargerDonnees, 10000);
    return () => clearInterval(interval);
  }, [token, user?.profilId]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
      </div>
    );
  }

  const commandesDuJour = commandes.filter(c => {
    const today = new Date().toDateString();
    return new Date(c.creeLe).toDateString() === today;
  });

  const chiffreAffairesJour = commandesDuJour
    .filter(c => ['PAYEE', 'EN_PREPARATION', 'PRETE', 'LIVREE'].includes(c.statut))
    .reduce((acc, c) => acc + (c.prixPlatsCentimes / 100), 0);

  const totalTerminees = commandes.filter(c => c.statut === 'LIVREE' || c.statut === 'PRETE').length;
  const tauxAcceptation = commandes.length > 0 
    ? Math.round(((commandes.length - commandes.filter(c => c.statut === 'REFUSEE' || c.statut === 'ABANDONNEE').length) / commandes.length) * 100) 
    : 100;

  const topItemsMap: Record<string, number> = {};
  commandesDuJour.forEach(c => {
    c.articles.forEach(a => {
      topItemsMap[a.nom] = (topItemsMap[a.nom] || 0) + a.quantite;
    });
  });
  const topItems = Object.entries(topItemsMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([nom, quantite]) => ({ nom, ventes: quantite, img: '' }));

  -
  const getLast7DaysData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toDateString();
      const sales = commandes
        .filter(c => new Date(c.creeLe).toDateString() === dateStr && ['PAYEE', 'EN_PREPARATION', 'PRETE', 'LIVREE'].includes(c.statut))
        .reduce((sum, c) => sum + (c.prixPlatsCentimes / 100), 0);
      data.push({
        label: `${d.getDate()}/${d.getMonth() + 1}`,
        sales
      });
    }
    const maxSale = Math.max(...data.map(d => d.sales), 50);
    return { data, maxSale: maxSale * 1.2 };
  };

  const salesTrend = getLast7DaysData();

  const stats = [
    { label: "CA du jour", value: `${chiffreAffairesJour.toFixed(2)} €`, icon: DollarSign, trend: "Temps réel", color: "emerald" },
    { label: "Commandes du jour", value: commandesDuJour.length.toString(), icon: ShoppingBag, trend: "Aujourd'hui", color: "blue" },
    { label: "Taux d'acceptation", value: `${tauxAcceptation}%`, icon: Activity, trend: "Global", color: "indigo" },
    { label: "Total terminées", value: totalTerminees.toString(), icon: TrendingUp, trend: "Historique", color: "amber" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Bonjour, {restaurant?.nom || "Partenaire"}</h1>
        <p className="text-slate-500">Voici un aperçu de vos vraies données (liées à l'API).</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-${stat.color}-50 text-${stat.color}-500`}>
                <stat.icon size={24} />
              </div>
              <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg">
                {stat.trend}
              </span>
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">En cuisine (Plats en préparation)</h2>
              <span className="bg-orange-50 text-orange-600 text-xs font-black px-3 py-1 rounded-full">
                {commandesDuJour.filter(c => c.statut === 'EN_PREPARATION').length} ACTIVES
              </span>
            </div>
            <div className="space-y-4">
              {commandesDuJour.filter(c => c.statut === 'EN_PREPARATION').length === 0 && (
                <p className="text-slate-400 text-sm py-4 italic">Les fourneaux attendent...</p>
              )}
              {commandesDuJour.filter(c => c.statut === 'EN_PREPARATION').map(cmd => (
                <div key={cmd.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-orange-200 transition-colors">
                  <div>
                    <h4 className="font-bold text-slate-800">Commande #{cmd.id.slice(0, 5)}</h4>
                    <p className="text-xs text-slate-400">Client: {cmd.clientNom || 'Inconnu'}</p>
                    <div className="flex gap-2 mt-1">
                      {cmd.articles.map((a, i) => (
                        <span key={i} className="text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-500">
                          {a.quantite}x {a.nom}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-800">{(cmd.prixPlatsCentimes / 100).toFixed(2)} €</p>
                    <p className="text-[10px] font-bold text-orange-500 uppercase">Préparation en cours</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          
          <div className="bg-white rounded-3xl border border-blue-100 p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">En attente de collecte</h2>
              <span className="bg-blue-50 text-blue-600 text-xs font-black px-3 py-1 rounded-full">
                {commandesDuJour.filter(c => c.statut === 'PRETE').length} PRÊTES
              </span>
            </div>
            <div className="space-y-4">
              {commandesDuJour.filter(c => c.statut === 'PRETE').length === 0 && (
                <p className="text-slate-400 text-sm py-4 italic">Aucune commande n'attend de coursier.</p>
              )}
              {commandesDuJour.filter(c => c.statut === 'PRETE').map(cmd => (
                <div key={cmd.id} className="flex items-center justify-between p-4 bg-blue-50/30 rounded-2xl border border-blue-100">
                  <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm">
                      <ShoppingBag size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">Commande #{cmd.id.slice(0, 5)}</h4>
                      <p className="text-xs text-blue-600 font-bold">
                        {cmd.livreurNom ? `Livreur : ${cmd.livreurNom}` : "Recherche de livreur..."}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] bg-blue-500 text-white px-2 py-1 rounded-lg font-black animate-pulse">
                      PRÊTE
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium italic">En attente de retrait</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm flex flex-col">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Articles populaires</h2>
          <div className="space-y-6 flex-1">
            {topItems.length === 0 && (
              <p className="text-slate-400 text-sm">Pas encore de plats vendus aujourd'hui.</p>
            )}
            {topItems.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl border border-slate-100">
                  {item.img}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{item.nom}</h4>
                  <p className="text-xs text-slate-400 font-medium">{item.ventes} ventes aujourd'hui</p>
                </div>
                <div className="text-sm font-black text-slate-800">
                  #{i + 1}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-50">
             <div className="bg-emerald-50 p-4 rounded-2xl">
                <p className="text-emerald-700 text-xs font-bold mb-1 italic">Note de performance</p>
                <p className="text-emerald-900 text-[10px] leading-relaxed">
                  Votre CA de ce jour (<b>{chiffreAffairesJour.toFixed(2)}€</b>) est calculé sur les commandes payées depuis minuit.
                </p>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Évolution des ventes (CA) - 7 derniers jours</h2>
        <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 pb-6">
          {salesTrend.data.map((day, i) => (
            <div key={i} className="flex-1 h-full flex flex-col items-center relative">
              <div className="w-full bg-slate-100 rounded-t-xl relative group flex-1 h-full">
                <div 
                  className="absolute bottom-0 w-full bg-emerald-500 rounded-t-xl group-hover:bg-emerald-400 transition-colors" 
                  style={{ height: `${(day.sales / salesTrend.maxSale) * 100}%`, minHeight: '4px' }}
                >
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-lg pointer-events-none whitespace-nowrap z-10">
                    {day.sales.toFixed(2)} €
                  </span>
                </div>
              </div>
              <span className="absolute -bottom-6 text-[10px] sm:text-xs font-bold text-slate-400 whitespace-nowrap">{day.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
