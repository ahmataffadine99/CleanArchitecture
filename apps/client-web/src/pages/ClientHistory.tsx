import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { Loader2, Clock, ChefHat, Package, CheckCircle2, AlertCircle, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type CommandeClient = {
  id: string;
  restaurantId: string;
  statut: string;
  totalCentimes: number;
  creeLe: string;
  articles: Array<{ nom: string; quantite: number }>;
};

const STEPS = [
  { id: 'PAYEE', label: 'En attente de validation', icon: Clock },
  { id: 'EN_PREPARATION', label: 'En cuisine', icon: ChefHat },
  { id: 'PRETE', label: 'Prête', icon: Package },
  { id: 'LIVREE', label: 'Livrée', icon: CheckCircle2 }
];

export default function ClientHistory() {
  const { user, token } = useAuthStore();
  const [commandes, setCommandes] = useState<CommandeClient[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommandes = async () => {
      if (!user?.profilId || !token) return;
      try {
        const res = await fetch(`/api/clients/${user.profilId}/commandes`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCommandes(data.reverse()); // Plus récents d'abord
        }
      } catch (err) {
        console.error("Erreur chargement commandes:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCommandes();
    const interval = setInterval(fetchCommandes, 10000); // Polling toutes les 10s
    return () => clearInterval(interval);
  }, [user, token]);

  if (!user) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center px-4">
        <AlertCircle size={48} className="text-slate-300 mb-4" />
        <h2 className="text-2xl font-black text-slate-800">Connectez-vous</h2>
        <p className="text-slate-500 mt-2 mb-6">Vous devez être connecté pour voir vos commandes.</p>
        <button onClick={() => navigate('/login')} className="bg-emerald-500 text-white px-8 py-3 rounded-2xl font-bold">Se connecter</button>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Mes commandes</h1>
        <p className="text-slate-500 font-medium mt-2">Suivez l'état de préparation de vos festins en temps réel.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-emerald-500 w-12 h-12" />
        </div>
      ) : commandes.length === 0 ? (
        <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 border-dashed text-center shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={32} className="text-slate-300" />
          </div>
          <p className="text-xl font-black text-slate-800 mb-2">Vous n'avez pas encore commandé</p>
          <p className="text-slate-500 mb-8">Découvrez nos restaurants engagés et régalez-vous !</p>
          <button onClick={() => navigate('/')} className="bg-emerald-500 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-600 transition-all text-sm">EXPLORER LES RESTAURANTS</button>
        </div>
      ) : (
        <div className="space-y-6">
          {commandes.map((cmd) => {
            const date = new Date(cmd.creeLe);
            const isRefus = ['REFUSEE', 'ABANDONNEE'].includes(cmd.statut);
            
            // Pour la Timeline, on force le statut ACCEPTEE à correspondre à EN_PREPARATION visuellement
            let currentStepIdx = STEPS.findIndex(s => s.id === cmd.statut);
            if (cmd.statut === 'ACCEPTEE') currentStepIdx = 1;
            if (cmd.statut === 'EN_LIVRAISON') currentStepIdx = 2; // avant livraison finale

            return (
              <div key={cmd.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 overflow-hidden relative group">
                {/* Header Carte */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-6 mb-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                       <h3 className="text-xl font-black text-slate-800">Commande {cmd.id.split('-')[0].toUpperCase()}</h3>
                       {isRefus && (
                         <span className="bg-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg">Annulée</span>
                       )}
                    </div>
                    <p className="text-sm text-slate-500 font-medium">
                      Passée le {date.toLocaleDateString()} à {date.toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="font-black text-2xl text-slate-800">
                    {(cmd.totalCentimes / 100).toFixed(2)} €
                  </div>
                </div>

                {/* Détail de la commande */}
                <div className="mb-8">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Articles commandés</p>
                  <ul className="text-sm font-bold text-slate-700 space-y-2">
                    {cmd.articles.map((art, idx) => (
                      <li key={idx} className="flex gap-3">
                         <span className="text-slate-400 w-4">{art.quantite}x</span> 
                         <span>{art.nom}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Timeline de progression (Seulement si commande active) */}
                {!isRefus && (
                  <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-100">
                    <div className="relative flex justify-between">
                      {/* Ligne de fond */}
                      <div className="absolute top-5 left-8 right-8 h-1 bg-slate-200 rounded-full z-0 hidden sm:block"></div>
                      
                      {/* Ligne de progression */}
                      <div 
                        className="absolute top-5 left-8 h-1 bg-emerald-500 rounded-full z-0 transition-all duration-1000 hidden sm:block delay-300" 
                        style={{ width: `${Math.max(0, currentStepIdx) * (100 / (STEPS.length - 1))}%` }}
                      ></div>

                      {/* ÉTAPES */}
                      {STEPS.map((step, index) => {
                        const isCompleted = index <= currentStepIdx;
                        const isCurrent = index === currentStepIdx;
                        
                        return (
                          <div key={step.id} className="relative z-10 flex flex-col items-center">
                            <div 
                              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 shadow-sm ${
                                isCurrent ? 'bg-emerald-500 text-white scale-110 shadow-emerald-200 ring-4 ring-emerald-50' : 
                                isCompleted ? 'bg-emerald-100 text-emerald-600' : 
                                'bg-white text-slate-300 border border-slate-200'
                              }`}
                            >
                              <step.icon size={20} className={isCurrent ? 'animate-pulse' : ''} />
                            </div>
                            <span className={`text-[10px] sm:text-xs font-bold mt-3 text-center sm:whitespace-nowrap transition-colors duration-500 ${isCurrent ? 'text-emerald-600' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
