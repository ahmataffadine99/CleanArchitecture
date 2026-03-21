import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, AlertCircle, Loader2, Store } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import AddressAutocomplete from '../components/AddressAutocomplete';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState({ latitude: 48.8566, longitude: 2.3522 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          motDePasse: password, 
          role: 'RESTAURATEUR',
          nom: restaurantName,
          adresse: address,
          latitude: coords.latitude,
          longitude: coords.longitude
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Échec de l'inscription");
      }

      setAuth(data.token, data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-emerald-600 text-white rounded-[1.5rem] mb-6 shadow-xl shadow-emerald-200">
            <Store size={32} />
          </div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">Devenir Partenaire</h2>
          <p className="mt-3 text-slate-500 font-medium">Rejoignez EcoEATS et boostez votre visibilité.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 p-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-5 py-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-bold tracking-tight">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nom de l'enseigne</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                  <Store size={20} />
                </div>
                <input
                  type="text" required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                  placeholder="ex: Le Petit Bistro"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Adresse</label>
              <AddressAutocomplete 
                value={address}
                onChange={setAddress}
                onSelect={(addr, lat, lon) => {
                  setAddress(addr);
                  setCoords({ latitude: lat, longitude: lon });
                }}
                placeholder="Ville, Rue..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email professionnel</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  type="email" required
                  autoComplete="email"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                  placeholder="contact@votre-resto.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Mot de passe</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type="password" required
                  autoComplete="new-password"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Confirmer le mot de passe</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type="password" required
                  autoComplete="new-password"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-5 px-4 rounded-[1.5rem] shadow-xl shadow-emerald-100 bg-emerald-600 hover:bg-emerald-700 text-white font-black transition-all items-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <UserPlus size={24} />
                  <span>CRÉER MON COMPTE</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <p className="text-slate-500 font-medium tracking-tight">
              Déjà partenaire ?{' '}
              <Link to="/login" className="text-emerald-600 font-black hover:text-emerald-700 transition-colors underline decoration-emerald-100 underline-offset-4">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
