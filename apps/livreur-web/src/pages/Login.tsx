import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Truck, Lock, Mail, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, motDePasse: password })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Identifiants invalides');
      }

      const { token, utilisateur } = await res.json();
      
      if (utilisateur.role !== 'LIVREUR') {
        throw new Error('Cet accès est réservé aux livreurs.');
      }

      setAuth(token, {
        id: utilisateur.id,
        email: utilisateur.email,
        role: utilisateur.role,
        profilId: utilisateur.profilId
      });
      
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="h-20 w-20 bg-emerald-500 text-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-200 animate-bounce-slow">
            <Truck size={40} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">EcoEATS <span className="text-emerald-500">Livreur</span></h1>
          <p className="text-slate-500 font-medium">Connectez-vous pour commencer votre service</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100 animate-in shake duration-500">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" required
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl pl-12 pr-6 py-4 outline-none transition-all font-bold text-slate-700"
                  placeholder="nom@exemple.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" required
                  value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl pl-12 pr-6 py-4 outline-none transition-all font-bold text-slate-700"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-emerald-200 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : 'SE CONNECTER'}
          </button>

          <p className="text-center text-sm font-bold text-slate-500 mt-6">
            Vous n'avez pas de compte ?{' '}
            <Link to="/register" className="text-emerald-600 hover:underline">
              Inscrivez-vous ici
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
