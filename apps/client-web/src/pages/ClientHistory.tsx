import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { Loader2, Clock, ChefHat, Package, CheckCircle2, AlertCircle, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DeliveryMap from '../components/DeliveryMap';

type CommandeClient = {
  id: string;
  restaurantId: string;
  restaurantNom: string;
  statut: string;
  totalCentimes: number;
  creeLe: string;
  livreurNom?: string;
  tempsPreparationEstime?: number;
  articles: Array<{ nom: string; quantite: number }>;
  clientPosition?: { latitude: number; longitude: number };
  restaurantPosition?: { latitude: number; longitude: number };
};

function OrderCountdown({ creeLe, delaiMinutes }: { creeLe: string, delaiMinutes: number }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const target = new Date(creeLe).getTime() + delaiMinutes * 60000;
    
    const update = () => {
      const remaining = Math.max(0, target - Date.now());
      if (remaining === 0) {
        setTimeLeft('Prêt !');
        return;
      }
      const mins = Math.floor(remaining / 60000);
      const secs = Math.floor((remaining % 60000) / 1000);
      setTimeLeft(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [creeLe, delaiMinutes]);

  return <span>{timeLeft}</span>;
}

function DeliveryCountdown({ creeLe, preparationMinutes }: { creeLe: string, preparationMinutes: number }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    // On estime la livraison à 10 min après la fin de préparation
    const deliveryTarget = new Date(creeLe).getTime() + (preparationMinutes + 10) * 60000;
    
    const update = () => {
      const diff = deliveryTarget - Date.now();
      const isLate = diff < 0;
      const absDiff = Math.abs(diff);
      
      const mins = Math.floor(absDiff / 60000);
      const secs = Math.floor((absDiff % 60000) / 1000);
      const timeStr = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
      
      if (isLate) {
        setTimeLeft(`En retard de ${timeStr}`);
      } else {
        setTimeLeft(`~${timeStr} min`);
      }
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [creeLe, preparationMinutes]);

  return <span>{timeLeft}</span>;
}

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
  const [activeTab, setActiveTab] = useState<'tracking' | 'history'>('tracking');
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

  const filteredCommandes = commandes.filter(cmd => {
    const isFinished = ['LIVREE', 'REFUSEE', 'ABANDONNEE'].includes(cmd.statut);
    return activeTab === 'history' ? isFinished : !isFinished;
  });

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Mes commandes</h1>
        <p className="text-slate-500 font-medium mt-2">Suivez vos festins en temps réel ou retrouvez vos anciens plaisirs.</p>
      </div>

      {/* TABS */}
      <div className="flex gap-2 p-1.5 bg-slate-100 rounded-[1.5rem] mb-10 w-fit mx-auto sm:mx-0 shadow-inner">
        <button 
          onClick={() => setActiveTab('tracking')}
          className={`px-6 py-3 rounded-2xl text-sm font-black transition-all ${activeTab === 'tracking' ? 'bg-white text-emerald-600 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
        >
          SUIVI EN COURS
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`px-6 py-3 rounded-2xl text-sm font-black transition-all ${activeTab === 'history' ? 'bg-white text-emerald-600 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
        >
          HISTORIQUE
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-emerald-500 w-12 h-12" />
        </div>
      ) : filteredCommandes.length === 0 ? (
        <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 border-dashed text-center shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={32} className="text-slate-300" />
          </div>
          <p className="text-xl font-black text-slate-800 mb-2">
            {activeTab === 'tracking' ? "Aucune commande en cours" : "Pas encore d'historique"}
          </p>
          <p className="text-slate-500 mb-8">
            {activeTab === 'tracking' ? "Toutes vos commandes sont terminées ou vous n'avez pas encore commandé." : "Vos futures commandes terminées apparaîtront ici."}
          </p>
          {activeTab === 'tracking' && (
            <button onClick={() => navigate('/')} className="bg-emerald-500 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-600 transition-all text-sm">EXPLORER LES RESTAURANTS</button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredCommandes.map((cmd) => {
            const date = new Date(cmd.creeLe);
            const isRefus = ['REFUSEE', 'ABANDONNEE'].includes(cmd.statut);
            const isEnCours = ['PAYEE', 'ACCEPTEE', 'EN_PREPARATION', 'PRETE', 'EN_LIVRAISON'].includes(cmd.statut);
            
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
                       <h3 className="text-xl font-black text-slate-800">{cmd.restaurantNom}</h3>
                       <span className="text-slate-400 font-bold">#{cmd.id.split('-')[0].toUpperCase()}</span>
                       {isRefus && (
                         <span className="bg-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg">Annulée</span>
                       )}
                       {isEnCours && cmd.tempsPreparationEstime && (
                         <div className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg flex items-center gap-2">
                           <Loader2 size={14} className="animate-spin" />
                           <span className="text-xs font-black">
                             <OrderCountdown creeLe={cmd.creeLe} delaiMinutes={cmd.tempsPreparationEstime} />
                           </span>
                         </div>
                       )}
                       {cmd.statut === 'LIVREE' && (
                         <span className="bg-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                           <CheckCircle2 size={10} /> Livrée
                         </span>
                       )}
                    </div>
                    <p className="text-sm text-slate-500 font-medium">
                      Passée le {date.toLocaleDateString()} à {date.toLocaleTimeString()}
                    </p>
                    {cmd.livreurNom && (
                      <div className="mt-3 flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl border border-emerald-100 w-fit">
                         <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                         <span className="text-xs font-black">Livreur : {cmd.livreurNom}</span>
                         {cmd.statut === 'LIVREE' ? (
                           <span className="text-[10px] font-bold opacity-70 ml-2 text-emerald-800">
                             Commande bien arrivée.
                           </span>
                         ) : (
                           <span className="text-[10px] opacity-70 ml-2">
                             Arrivée estimée : <DeliveryCountdown creeLe={cmd.creeLe} preparationMinutes={cmd.tempsPreparationEstime || 15} />
                           </span>
                         )}
                      </div>
                    )}
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
                {isEnCours && (
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

                {/* Map pour le suivi en direct */}
                {(cmd.statut === 'EN_LIVRAISON' || cmd.statut === 'PRETE') && cmd.restaurantPosition && cmd.clientPosition && (
                  <div className="mt-8 h-[300px] w-full rounded-2xl overflow-hidden relative border border-slate-100 shadow-inner">
                    <DeliveryMap 
                      restaurant={cmd.restaurantPosition}
                      client={cmd.clientPosition}
                      mode="LIVRAISON"
                    />
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
