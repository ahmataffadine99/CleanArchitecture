import { useState, useEffect } from 'react';
import { Check, X, Clock, Navigation, Loader2, UtensilsCrossed } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

type Commande = {
  id: string;
  restaurantId: string;
  statut: string;
  prixPlatsCentimes: number;
  creeLe: string;
  articles: Array<{
    id: string;
    nom: string;
    quantite: number;
    prixCentimes: number;
  }>;
};

export default function OrdersDashboard() {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [paniers, setPaniers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { token, user, restaurant, setRestaurant } = useAuthStore();
  const restaurantId = user?.profilId;

  const chargerInfosRestaurant = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/restaurant/mon-restaurant', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRestaurant(data);
      }
    } catch (err) {
      console.error("Erreur chargement resto", err);
    }
  };

  const chargerDonnees = async () => {
    if (!token || !restaurantId) return;
    
    try {
      const resCmd = await fetch(`/api/restaurant/${restaurantId}/commandes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resCmd.ok) {
        const data = await resCmd.json();
        if (Array.isArray(data)) setCommandes(data);
      }

      const resPan = await fetch(`/api/restaurant/${restaurantId}/paniers-actifs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resPan.ok) {
        const data = await resPan.json();
        if (Array.isArray(data)) setPaniers(data);
      }
    } catch (err) {
      console.error("Erreur chargement données", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!restaurant) {
      chargerInfosRestaurant();
    }
    chargerDonnees();
    const interval = setInterval(chargerDonnees, 5000);
    return () => clearInterval(interval);
  }, [restaurantId, token]);

  const handleAction = async (id: string, action: 'accepter' | 'refuser' | 'prete') => {
    if (!token) return;
    try {
      let body;
      if (action === 'accepter') {
        body = JSON.stringify({ tempsPreparationMinutes: 15 });
      }

      const res = await fetch(`/api/commandes/${id}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body
      });

      if (res.ok) {
        chargerDonnees();
      }
    } catch (e) {
      console.error("Erreur action", e);
    }
  };

  if (loading && !commandes.length) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
          <p className="text-slate-500 font-medium tracking-wide">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Tableau de bord</h1>
          <p className="text-slate-600">
            Gestion des commandes pour <span className="text-emerald-600 font-bold">{restaurant?.nom || 'votre établissement'}</span>.
          </p>
        </div>
        
        <div className="px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-bold border border-emerald-100 flex items-center gap-3 shadow-sm shadow-emerald-100/50">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          RÉSEAU CONNECTÉ
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
            <span className="animate-pulse h-3 w-3 rounded-full bg-indigo-500"></span>
          </div>
          <h2 className="text-xl font-bold text-slate-800">Clients en boutique</h2>
          <span className="text-slate-400 text-sm font-medium italic">(Consultation en temps réel)</span>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide -mx-2 px-2">
          {paniers.length === 0 && (
            <div className="bg-white border-2 border-slate-100 border-dashed rounded-3xl p-8 text-slate-400 text-sm italic w-full text-center shadow-sm">
              Aucun client actif dans votre restaurant pour le moment.
            </div>
          )}
          {paniers.map((p, i) => (
            <div key={i} className="min-w-[320px] bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow border-t-4 border-t-indigo-500">
              <div className="flex justify-between mb-3 items-center">
                <span className="text-[10px] font-extrabold text-indigo-500 bg-indigo-50 px-2.5 py-1 rounded-lg uppercase tracking-wider">Panier actif</span>
                <span className="text-slate-900 font-black text-lg">{p.total.toFixed(2)} €</span>
              </div>
              <div className="mb-4 text-xs font-semibold text-slate-500 flex items-center gap-2">
                Client #{p.clientId?.split('-')[0] || 'Anonyme'}
              </div>
              <ul className="space-y-2 mb-4">
                {p.articles.map((art: any, j: number) => (
                  <li key={j} className="text-sm font-medium text-slate-700 flex justify-between items-center bg-slate-50 px-3 py-1.5 rounded-xl">
                    <span className="flex items-center gap-2">
                      <span className="w-6 h-6 flex items-center justify-center bg-white rounded-lg text-xs font-bold text-slate-600 border border-slate-100">{art.quantite}x</span>
                      {art.nom}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="pt-3 border-t border-slate-50 flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                <Clock size={12} /> Actualisé il y a quelques secondes
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 h-fit">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
              <Clock size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Nouvelles demandes</h2>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">En attente de validation</p>
            </div>
            <span className="ml-auto bg-blue-600 text-white text-sm font-black px-4 py-1.5 rounded-2xl shadow-lg shadow-blue-200">
              {commandes.filter(c => ['EN_ATTENTE', 'PAYEE'].includes(c.statut)).length}
            </span>
          </div>

          <div className="space-y-6">
            {commandes.filter(c => ['EN_ATTENTE', 'PAYEE'].includes(c.statut)).length === 0 && (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="text-slate-200" size={32} />
                </div>
                <p className="text-slate-400 text-sm font-medium">Tout est à jour ! Aucune nouvelle demande.</p>
              </div>
            )}
            {commandes.filter(c => ['EN_ATTENTE', 'PAYEE'].includes(c.statut)).map(cmd => (
              <div key={cmd.id} className="border border-slate-100 rounded-3xl p-6 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all border-l-4 border-l-blue-500">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-mono text-slate-400 font-bold bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">ID: {cmd.id.split('-')[0].toUpperCase()}</span>
                  <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-tighter">PAYÉE</span>
                </div>
                <ul className="mb-6 space-y-2.5">
                  {cmd.articles.map((art, i) => (
                    <li key={i} className="text-sm font-bold text-slate-700 flex justify-between items-center group">
                      <span className="flex items-center gap-3">
                        <span className="w-8 h-8 flex items-center justify-center bg-white rounded-xl text-xs font-black text-slate-800 border-2 border-slate-100 group-hover:border-blue-200 transition-colors">{art.quantite}x</span>
                        {art.nom}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-3">
                  <button onClick={() => handleAction(cmd.id, 'accepter')} className="flex-[2] bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-2xl text-sm transition-all shadow-lg shadow-emerald-200 hover:-translate-y-0.5 flex items-center justify-center gap-2">
                    <Check size={20} /> ACCEPTER
                  </button>
                  <button onClick={() => handleAction(cmd.id, 'refuser')} className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 font-bold py-4 rounded-2xl text-sm transition-all flex items-center justify-center gap-2">
                    <X size={20} /> REFUSER
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 h-fit">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <Navigation size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">En cuisine</h2>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Plats en préparation</p>
            </div>
            <span className="ml-auto bg-amber-600 text-white text-sm font-black px-4 py-1.5 rounded-2xl shadow-lg shadow-amber-200">
              {commandes.filter(c => ['ACCEPTEE', 'EN_PREPARATION'].includes(c.statut)).length}
            </span>
          </div>

          <div className="space-y-6">
            {commandes.filter(c => ['ACCEPTEE', 'EN_PREPARATION'].includes(c.statut)).length === 0 && (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UtensilsCrossed className="text-slate-200" size={32} />
                </div>
                <p className="text-slate-400 text-sm font-medium">Les fourneaux attendent...</p>
              </div>
            )}
            {commandes.filter(c => ['ACCEPTEE', 'EN_PREPARATION'].includes(c.statut)).map(cmd => (
              <div key={cmd.id} className="border border-amber-100 rounded-3xl p-6 bg-amber-50/20 hover:bg-white hover:shadow-xl hover:shadow-amber-200/50 transition-all border-l-4 border-l-amber-500">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-mono text-slate-400 font-bold bg-white px-3 py-1 rounded-full border border-slate-100">ID: {cmd.id.split('-')[0].toUpperCase()}</span>
                  <span className="text-xs font-black text-amber-600 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-tighter">EN COURS</span>
                </div>
                <ul className="mb-6 space-y-2.5">
                  {cmd.articles.map((art, i) => (
                    <li key={i} className="text-sm font-bold text-slate-700 flex justify-between items-center group">
                      <span className="flex items-center gap-3">
                        <span className="w-8 h-8 flex items-center justify-center bg-white rounded-xl text-xs font-black text-slate-800 border-2 border-amber-100 group-hover:border-amber-300 transition-colors">{art.quantite}x</span>
                        {art.nom}
                      </span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => handleAction(cmd.id, 'prete')} className="w-full bg-slate-900 hover:bg-black text-white font-black py-4.5 rounded-2xl text-sm transition-all shadow-lg shadow-slate-300 hover:shadow-slate-400 hover:-translate-y-0.5">
                  MARQUER COMME "PRÊTE"
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
