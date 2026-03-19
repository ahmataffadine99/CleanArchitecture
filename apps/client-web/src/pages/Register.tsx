import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, AlertCircle, Loader2, Utensils, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [adresse, setAdresse] = useState('');
  const [telephone, setTelephone] = useState('');
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
          role: 'CLIENT',
          nom: name,
          adresse,
          telephone
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'inscription");
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
    <div className="min-h-screen flex items-center justify-center -mt-16 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-emerald-100 text-emerald-600 rounded-3xl mb-6 shadow-xl shadow-emerald-100/50">
            <Utensils size={32} />
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Bienvenue !</h1>
          <p className="text-slate-500 font-medium mt-3">Rejoignez la communauté éco-responsable.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-200/40 p-10 border border-emerald-50">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-5 py-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-bold tracking-tight">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nom complet</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                  <User size={20} />
                </div>
                <input 
                  type="text" required
                  autoComplete="name"
                  placeholder="Jean Dupont"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                <div className="relative group">
                  <input 
                    type="email" required
                    autoComplete="email"
                    placeholder="nom@exemple.com"
                    className="w-full px-4 py-3.5 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Téléphone</label>
                <div className="relative group">
                  <input 
                    type="tel" required
                    placeholder="06 12 34 56 78"
                    className="w-full px-4 py-3.5 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Adresse de livraison complète</label>
              <div className="relative group">
                <input 
                  type="text" required
                  placeholder="123 rue de la Paix, 75001 Paris"
                  className="w-full px-4 py-3.5 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Mot de passe</label>
                <div className="relative group">
                  <input 
                    type="password" required
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3.5 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2 col-span-2 sm:col-span-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Confirmer mot de passe</label>
                <div className="relative group">
                  <input 
                    type="password" required
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3.5 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full bg-emerald-600 text-white font-black py-4 mt-2 rounded-[1.5rem] shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <UserPlus size={24} />
                  <span>S'INSCRIRE</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-50 text-center">
            <p className="text-slate-500 font-medium tracking-tight text-sm">
              Déjà membre ?{' '}
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
