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
  const [animatedPoints, setAnimatedPoints] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [simAmount, setSimAmount] = useState<number>(50);
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

  useEffect(() => {
    if (!loading && points > 0) {
      let start = 0;
      const duration = 1000;
      const step = Math.max(1, Math.floor(points / 60));
      const timer = setInterval(() => {
        start += step;
        if (start >= points) {
          setAnimatedPoints(points);
          clearInterval(timer);
        } else {
          setAnimatedPoints(start);
        }
      }, 16);
      return () => clearInterval(timer);
    } else if (!loading) {
      setAnimatedPoints(0);
    }
  }, [loading, points]);

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
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Zap size={14} /> Programme Fidélité
        </div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4">Mes Points de Fidélité</h1>
        <div className="flex items-center justify-center gap-2 text-slate-500 font-bold bg-white border border-slate-100 w-fit mx-auto px-6 py-3 rounded-2xl shadow-sm">
          <span>1 Euro dépensé</span>
          <ArrowRight size={16} className="text-emerald-500" />
          <span className="text-emerald-600">1 Point gagné</span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-emerald-500 w-12 h-12" />
        </div>
      ) : (
        <>
          {/* Carte Statut & Simulateur */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2 relative bg-slate-900 text-white rounded-[3rem] p-8 sm:p-10 overflow-hidden shadow-2xl shadow-slate-400/20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl -ml-16 -mb-16"></div>
              
              <div className="relative z-10 h-full flex flex-col justify-between">
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
                    <div className="flex items-baseline gap-2">
                      <span className="text-6xl font-black text-emerald-400">{animatedPoints}</span>
                      <span className="text-slate-400 font-bold text-xl">pts</span>
                    </div>
                  </div>
                </div>

                {/* Barre de progression vers le palier suivant */}
                {palierSuivant ? (
                  <div className="mt-auto">
                    <div className="flex justify-between text-xs font-bold mb-3">
                      <span className="text-slate-400">{palierActuel.nom}</span>
                      <span className="text-emerald-400">{palierSuivant.points - points} pts manquants pour {palierSuivant.nom}</span>
                    </div>
                    <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden p-1">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                        style={{ width: `${progressionPct}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-black mt-2 text-slate-500 uppercase tracking-widest">
                      <span>{palierActuel.points} pts</span>
                      <span>{palierSuivant.points} pts</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-indigo-500/20 rounded-2xl p-4 flex items-center gap-3 mt-auto">
                    <Trophy size={20} className="text-indigo-400" />
                    <p className="text-sm font-bold text-indigo-300">Vous avez atteint le niveau maximum ! Félicitations.</p>
                  </div>
                )}
              </div>
            </div>

            {/* L'Arche de Simulation */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8 flex flex-col items-center justify-between group transition-transform hover:scale-[1.02]">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Simulateur de Gain</h3>
              
              <div className="relative w-full aspect-[2/1] flex items-center justify-center mb-6">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 50">
                  <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="8"
                    strokeLinecap="round"
                    className="origin-center translate-y-[25px]"
                  />
                  <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="125.6"
                    strokeDashoffset={125.6 - (Math.min(100, simAmount / 2) / 100) * 125.6}
                    className="origin-center translate-y-[25px] transition-all duration-500 ease-out"
                  />
                </svg>
                <div className="absolute bottom-0 text-center translate-y-2">
                  <span className="text-4xl font-black text-slate-900">{simAmount}</span>
                  <span className="text-slate-400 font-bold block -mt-1 text-xs">POINTS</span>
                </div>
              </div>

              <div className="w-full space-y-4">
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                  <span>Commande de</span>
                  <span className="text-emerald-600">{simAmount} €</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="200" 
                  value={simAmount}
                  onChange={(e) => setSimAmount(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <p className="text-[10px] text-center text-slate-400 font-medium leading-tight">
                  Glissez pour simuler votre prochaine commande et voir vos futurs points.
                </p>
              </div>
            </div>
          </div>

          {/* Grille des Paliers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {PALIERS.map((palier) => {
              const Icon = palier.icon;
              const isUnlocked = points >= palier.points;
              const isCurrent = palier === palierActuel;
              return (
                <div 
                  key={palier.nom}
                  className={`p-6 rounded-3xl border transition-all duration-500 ${isCurrent ? palier.bgCouleur + ' shadow-lg scale-105 z-10' : isUnlocked ? 'bg-white border-slate-100' : 'bg-slate-50 border-slate-100 opacity-60'}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${isCurrent ? 'bg-white shadow-sm' : 'bg-slate-100'}`}>
                    <Icon size={24} className={isUnlocked ? palier.couleur : 'text-slate-400'} />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-black text-base ${isUnlocked ? 'text-slate-800' : 'text-slate-400'}`}>{palier.nom}</h3>
                    {isCurrent && <span className="text-[9px] font-black bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">ACTUEL</span>}
                    {!isUnlocked && <span className="text-[9px] font-black bg-slate-200 text-slate-500 px-2.5 py-1 rounded-full">LVL {palier.points}</span>}
                  </div>
                  <ul className="space-y-2 mt-4">
                    {palier.avantages.map((av, i) => (
                      <li key={i} className={`text-[11px] font-bold flex items-start gap-2 ${isUnlocked ? 'text-slate-600' : 'text-slate-400'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${isUnlocked ? 'bg-emerald-400' : 'bg-slate-300'}`}></div> {av}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Mon Impact Éco */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-1.5 bg-emerald-500 w-16 rounded-full"></div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Mon Impact Éco</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card CO2 */}
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all duration-700">
                <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-emerald-50 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mb-8 shadow-sm">
                    <Zap size={32} />
                  </div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">CO2 Économisé</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-slate-800">{(points * 0.45).toFixed(1)}</span>
                    <span className="text-slate-400 font-bold text-xl">kg</span>
                  </div>
                  <p className="text-sm font-medium text-slate-500 mt-6 leading-relaxed">
                    Équivalent à <span className="text-emerald-600 font-black">{(points * 2.5).toFixed(0)} km</span> en voiture thermique.
                  </p>
                </div>
              </div>

              {/* Card Emballages */}
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all duration-700">
                <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-indigo-50 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-3xl flex items-center justify-center mb-8 shadow-sm">
                    <ShoppingBag size={32} />
                  </div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Déchets évités</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-slate-800">{(points / 8.5).toFixed(0)}</span>
                    <span className="text-slate-400 font-bold text-xl">unités</span>
                  </div>
                  <p className="text-sm font-medium text-slate-500 mt-6 leading-relaxed">
                    Grâce à vos commandes sans couverts jetables.
                  </p>
                </div>
              </div>

              {/* Card Eco-Score */}
              <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl shadow-emerald-900/20 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                   <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-6">Votre Eco-Score</p>
                   <div className="flex items-center justify-center mb-8">
                      <div className="relative w-32 h-32">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                          <path className="text-white/10" strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2.5" />
                          <path className="text-emerald-500" strokeDasharray={`${Math.min(95, (points / 2.5))}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="font-black text-3xl">A+</span>
                          <span className="text-[8px] font-black text-emerald-400 tracking-tighter uppercase">Elite</span>
                        </div>
                      </div>
                   </div>
                   <p className="text-center text-xs font-bold text-slate-400 leading-relaxed">
                     Excellent ! Vous faites partie du <br/>
                     <span className="text-white">TOP 5% des éco-mangeurs</span>.
                   </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Commander */}
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-[2.5rem] p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl shadow-emerald-200 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="relative z-10 text-white text-center sm:text-left">
              <h3 className="text-3xl font-black mb-2">Gagnez plus de points !</h3>
              <p className="text-emerald-100 text-lg font-medium opacity-90">Chaque commande vous rapproche du palier suivant.</p>
            </div>
            <button 
              onClick={() => navigate('/')}
              className="relative z-10 flex items-center gap-3 bg-white text-emerald-700 font-black px-10 py-5 rounded-2xl hover:bg-emerald-50 hover:scale-105 active:scale-95 transition-all shadow-xl whitespace-nowrap text-lg"
            >
              <ShoppingBag size={24} /> Commander maintenant <ArrowRight size={20} />
            </button>
          </div>
        </>
      )}
    </main>
  );
}
