import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { Gift, Star, Trophy, Zap, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Palier = {
  nom: string;
  points: number;
  couleur: string;
  bgCouleur: string;
  avantages: string[];
  icon: typeof Star;
};

const PALIERS: Palier[] = [
  {
    nom: 'Bronze',
    points: 0,
    couleur: 'text-amber-600',
    bgCouleur: 'bg-amber-50 border-amber-200',
    avantages: ['Accès aux offres de base', 'Historique de commandes'],
    icon: Star,
  },
  {
    nom: 'Argent',
    points: 50,
    couleur: 'text-slate-400',
    bgCouleur: 'bg-slate-50 border-slate-200',
    avantages: ['5% de réduction sur votre prochaine commande', 'Priorité au support'],
    icon: Zap,
  },
  {
    nom: 'Or',
    points: 100,
    couleur: 'text-yellow-500',
    bgCouleur: 'bg-yellow-50 border-yellow-200',
    avantages: ['10% de réduction permanente', 'Livraison offerte une fois/mois', 'Support prioritaire'],
    icon: Trophy,
  },
  {
    nom: 'Platine',
    points: 250,
    couleur: 'text-indigo-500',
    bgCouleur: 'bg-indigo-50 border-indigo-200',
    avantages: ['15% de réduction permanente', 'Livraison offerte', 'Accès VIP aux nouveaux restaurants'],
    icon: Gift,
  },
];

export default function LoyaltyPage() {
  const { user, token } = useAuthStore();
  const [points, setPoints] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPoints = async () => {
      if (!user?.profilId || !token) { setLoading(false); return; }
      try {
        const res = await fetch(`/api/clients/${user.profilId}/points`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setPoints(data.pointsFidelite ?? 0);
        }
      } catch (err) {
        console.error('Erreur points fidélité:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPoints();
  }, [user, token]);

  const getPalierActuel = () => {
    const paliers = [...PALIERS].reverse();
    return paliers.find(p => points >= p.points) ?? PALIERS[0];
  };

  const getPalierSuivant = () => {
    return PALIERS.find(p => p.points > points);
  };

  const palierActuel = getPalierActuel();
  const palierSuivant = getPalierSuivant();
  const progressionPct = palierSuivant
    ? Math.min(100, ((points - palierActuel.points) / (palierSuivant.points - palierActuel.points)) * 100)
    : 100;

  if (!user) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center px-4">
        <Gift size={48} className="text-slate-300 mb-4" />
        <h2 className="text-2xl font-black text-slate-800">Connectez-vous</h2>
        <p className="text-slate-500 mt-2 mb-6">Vous devez être connecté pour voir vos points.</p>
        <button onClick={() => navigate('/login')} className="bg-emerald-500 text-white px-8 py-3 rounded-2xl font-bold">Se connecter</button>
      </div>
    );
  }

  const PalierIcon = palierActuel.icon;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Mes Points de Fidélité</h1>
        <p className="text-slate-500 font-medium mt-2">Chaque euro dépensé vous rapporte 1 point 🌿</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-emerald-500 w-12 h-12" />
        </div>
      ) : (
        <>
          {/* Carte Statut */}
          <div className="relative bg-slate-900 text-white rounded-[2.5rem] p-8 sm:p-10 mb-8 overflow-hidden shadow-2xl shadow-slate-400/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl -ml-16 -mb-16"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                <div>
                  <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Niveau actuel</p>
                  <div className={`flex items-center gap-3 ${palierActuel.couleur}`}>
                    <PalierIcon size={28} />
                    <span className="text-3xl font-black">{palierActuel.nom}</span>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Total cumulé</p>
                  <span className="text-5xl font-black text-emerald-400">{points}</span>
                  <span className="text-slate-400 ml-2 font-bold">pts</span>
                </div>
              </div>

              {/* Barre de progression vers le palier suivant */}
              {palierSuivant ? (
                <div>
                  <div className="flex justify-between text-xs font-bold mb-3">
                    <span className="text-slate-400">{palierActuel.nom}</span>
                    <span className="text-emerald-400">{palierSuivant.points - points} pts manquants pour {palierSuivant.nom}</span>
                  </div>
                  <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-1000"
                      style={{ width: `${progressionPct}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold mt-2 text-slate-500">
                    <span>{palierActuel.points} pts</span>
                    <span>{palierSuivant.points} pts</span>
                  </div>
                </div>
              ) : (
                <div className="bg-indigo-500/20 rounded-2xl p-4 flex items-center gap-3">
                  <Trophy size={20} className="text-indigo-400" />
                  <p className="text-sm font-bold text-indigo-300">🎉 Vous avez atteint le niveau maximum ! Félicitations.</p>
                </div>
              )}
            </div>
          </div>

          {/* Grille des Paliers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {PALIERS.map((palier) => {
              const Icon = palier.icon;
              const isUnlocked = points >= palier.points;
              const isCurrent = palier === palierActuel;
              return (
                <div 
                  key={palier.nom}
                  className={`p-5 rounded-2xl border transition-all ${isCurrent ? palier.bgCouleur + ' shadow-md' : isUnlocked ? 'bg-white border-slate-100' : 'bg-slate-50 border-slate-100 opacity-50'}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${isCurrent ? 'bg-white shadow-sm' : 'bg-slate-100'}`}>
                    <Icon size={20} className={isUnlocked ? palier.couleur : 'text-slate-400'} />
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-black text-sm ${isUnlocked ? 'text-slate-800' : 'text-slate-400'}`}>{palier.nom}</h3>
                    {isCurrent && <span className="text-[9px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md">ACTUEL</span>}
                    {!isUnlocked && <span className="text-[9px] font-black bg-slate-100 text-slate-400 px-2 py-0.5 rounded-md">🔒 {palier.points} pts</span>}
                  </div>
                  <ul className="space-y-1 mt-3">
                    {palier.avantages.map((av, i) => (
                      <li key={i} className={`text-[10px] font-medium flex items-start gap-1.5 ${isUnlocked ? 'text-slate-600' : 'text-slate-400'}`}>
                        <span className="text-emerald-400 mt-0.5">✓</span> {av}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* CTA Commander */}
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-emerald-200">
            <div className="text-white">
              <h3 className="text-xl font-black mb-1">Gagnez plus de points !</h3>
              <p className="text-emerald-100 text-sm font-medium">Chaque commande vous rapproche du palier suivant.</p>
            </div>
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 bg-white text-emerald-700 font-black px-6 py-3 rounded-xl hover:bg-emerald-50 transition-all shadow-md whitespace-nowrap text-sm"
            >
              <ShoppingBag size={18} /> Commander maintenant <ArrowRight size={16} />
            </button>
          </div>
        </>
      )}
    </main>
  );
}
