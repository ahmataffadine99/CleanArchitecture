import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { Power, Wallet, Award, Bell, Navigation, Package, Clock, MapPin } from 'lucide-react';

export default function Dashboard() {
  const { token, user, logout } = useAuthStore();
  const [livreur, setLivreur] = useState<any>(null);
  const [propositions, setPropositions] = useState<any[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    if (!user?.profilId || !token) return;
    try {
      const [resLivreur, resProps] = await Promise.all([
        fetch(`/api/livreurs/${user.profilId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`/api/livreurs/${user.profilId}/propositions`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (resLivreur.ok) {
        const data = await resLivreur.json();
        setLivreur(data);
        setIsOnline(data.statut !== 'INDISPONIBLE');
      }

      if (resProps.ok) {
        const dataProps = await resProps.json();
        setPropositions(dataProps);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (commandeId: string) => {
    if (!user?.profilId) return;
    try {
      const res = await fetch(`/api/livreurs/${user.profilId}/propositions/${commandeId}/accepter`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchStatus();
      }
    } catch (err) { console.error(err); }
  };

  const handleReject = async (commandeId: string) => {
    if (!user?.profilId) return;
    try {
      const res = await fetch(`/api/livreurs/${user.profilId}/propositions/${commandeId}/refuser`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchStatus();
      }
    } catch (err) { console.error(err); }
  };

  const toggleOnline = async () => {
    if (!user?.profilId || !token) return;
    const newStatut = isOnline ? 'INDISPONIBLE' : 'DISPONIBLE';
    try {
      const res = await fetch(`/api/livreurs/${user.profilId}/statut`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ statut: newStatut })
      });
      if (res.ok) {
        setIsOnline(!isOnline);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(() => {
      if (isOnline) {
        fetchStatus();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isOnline]);

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold">Chargement...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-6 py-6 sticky top-0 z-10 shadow-sm">
        <div className="flex justify-between items-center max-w-lg mx-auto">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">
              {livreur?.nom?.[0] || 'L'}
            </div>
            <div>
              <h1 className="font-black text-slate-900 tracking-tight">{livreur?.nom}</h1>
              <div className="flex items-center gap-2">
                {livreur?.estExpert && (
                  <span className="flex items-center gap-1 text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-black uppercase tracking-widest border border-indigo-100">
                    <Award size={10} /> Expert
                  </span>
                )}
                <span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                <span className="text-xs font-bold text-slate-400 capitalize">{isOnline ? 'En ligne' : 'Hors ligne'}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={toggleOnline}
            className={`p-4 rounded-3xl transition-all shadow-xl ${isOnline ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-white border-2 border-slate-100 text-slate-300 shadow-none'}`}
          >
            <Power size={24} />
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto p-6 space-y-8">
        {/* Portefeuille */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl group-hover:bg-emerald-500/30 transition-all duration-700"></div>
          <div className="flex items-center gap-3 text-slate-400 mb-2 relative z-10">
            <Wallet size={18} />
            <span className="text-xs font-black uppercase tracking-widest">Mon Portefeuille</span>
          </div>
          <div className="text-4xl font-black mb-6 relative z-10">
            {livreur?.portefeuille?.toFixed(2) || '0.00'} €
          </div>
          <button className="w-full bg-white/10 hover:bg-white/20 border border-white/10 py-3 rounded-2xl text-sm font-bold transition-all backdrop-blur-md">
            VOIR L'HISTORIQUE
          </button>
        </div>

        {/* État de Livraison */}
        {!isOnline ? (
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 text-center space-y-4 shadow-sm">
            <div className="h-20 w-20 bg-slate-50 text-slate-300 rounded-[2rem] flex items-center justify-center mx-auto">
              <Power size={32} />
            </div>
            <h2 className="text-xl font-black text-slate-800">Vous êtes déconnecté</h2>
            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[240px] mx-auto">
              Passez en ligne pour commencer à recevoir des propositions de livraison.
            </p>
            <button 
              onClick={toggleOnline}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-emerald-100 transition-all flex items-center justify-center gap-2 mt-4"
            >
              <Power size={20} />
              PASSER EN LIGNE
            </button>
          </div>
        ) : propositions.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 text-center space-y-4 shadow-sm relative overflow-hidden">
             <div className="absolute inset-0 bg-emerald-500/5 backdrop-blur-[2px] flex items-center justify-center">
                <div className="flex flex-col items-center">
                   <div className="relative">
                      <Bell size={48} className="text-emerald-500/20 animate-ping absolute" />
                      <Bell size={48} className="text-emerald-500 animate-bounce" />
                   </div>
                   <p className="mt-6 text-emerald-600 font-black uppercase tracking-tighter">Recherche de commandes...</p>
                </div>
             </div>
             <div className="invisible py-12">Spacer</div>
          </div>
        ) : (
          <div className="space-y-4">
             <h2 className="text-lg font-black text-slate-800 ml-2">Nouvelles demandes ({propositions.length})</h2>
             {propositions.map((prop: any) => (
                <div key={prop.commandeId} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6 animate-in zoom-in duration-300">
                   <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                         <div className="h-10 w-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                            <Package size={20} />
                         </div>
                         <div>
                            <p className="font-black text-slate-800 tracking-tight">{prop.restaurantNom}</p>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                               <Clock size={10} />
                               <span>Prête dans {prop.tempsPreparationEstime || '?'} min</span>
                            </div>
                         </div>
                      </div>
                      <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-xs font-black">
                         + {prop.montantLivraison.toFixed(2)} €
                      </div>
                   </div>

                   <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="flex items-start gap-3">
                         <div className="mt-1 h-2 w-2 rounded-full bg-indigo-500 shrink-0"></div>
                         <div className="space-y-0.5">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enlèvement</p>
                            <p className="text-xs font-bold text-slate-600 leading-tight">{prop.restaurantAdresse}</p>
                         </div>
                      </div>
                      <div className="flex items-start gap-3">
                         <div className="mt-1 h-2 w-2 rounded-full bg-emerald-500 shrink-0"></div>
                         <div className="space-y-0.5">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Livraison</p>
                            <p className="text-xs font-bold text-slate-600 leading-tight">{prop.clientAdresse}</p>
                         </div>
                      </div>
                   </div>
                   
                   <div className="flex gap-3">
                      <button 
                        onClick={() => handleReject(prop.commandeId)}
                        className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-400 font-bold py-4 rounded-2xl transition-all"
                      >
                        REFUSER
                      </button>
                      <button 
                        onClick={() => handleAccept(prop.commandeId)}
                        className="flex-[2] bg-slate-900 hover:bg-black text-white font-black py-4 rounded-2xl shadow-xl shadow-slate-200 transition-all"
                      >
                        ACCEPTER
                      </button>
                   </div>
                </div>
             ))}
          </div>
        )}

        {/* Commandes en cours */}
        {livreur?.commandesEnCoursIds?.length > 0 && (
          <div className="space-y-4">
             <h2 className="text-lg font-black text-slate-800 ml-2">En cours</h2>
             {livreur.commandesEnCoursIds.map((id: string) => (
               <div key={id} className="bg-white p-6 rounded-[2rem] border-2 border-emerald-500 shadow-xl shadow-emerald-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                      <Navigation size={24} />
                    </div>
                    <div>
                      <p className="font-black text-slate-800 text-sm"># {id.substring(0, 8)}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">En cours de livraison</p>
                    </div>
                  </div>
                  <button 
                    onClick={async () => {
                      try {
                        const res = await fetch(`/api/commandes/${id}/livree`, {
                          method: 'POST',
                          headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                          },
                          body: JSON.stringify({ livreurId: user?.profilId, pourboire: 0 })
                        });
                        if (res.ok) fetchStatus();
                      } catch (err) { console.error(err); }
                    }}
                    className="bg-emerald-500 text-white font-black px-4 py-2 rounded-xl text-xs hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100"
                  >
                    TERMINER
                  </button>
               </div>
             ))}
          </div>
        )}
      </main>

      {/* Logout */}
      <footer className="max-w-lg mx-auto px-6 mt-12">
        <button 
          onClick={logout}
          className="w-full py-4 text-slate-300 font-bold text-sm hover:text-red-500 transition-colors"
        >
          SE DÉCONNECTER
        </button>
      </footer>
    </div>
  );
}
