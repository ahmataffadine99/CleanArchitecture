import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Lock, Mail, User, Phone, Loader2, ArrowRight } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nom: formData.nom,
          email: formData.email,
          telephone: formData.telephone,
          motDePasse: formData.password,
          role: 'LIVREUR'
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Erreur lors de l\'inscription');
      }

      const { token, user } = await res.json();
      setAuth(token, user);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-md space-y-8 py-12">
        <div className="text-center space-y-4">
          <Link to="/login" className="inline-flex items-center gap-2 text-emerald-600 font-bold text-sm hover:gap-3 transition-all">
            <ArrowRight className="rotate-180" size={16} /> Retour à la connexion
          </Link>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Devenir <span className="text-emerald-500">Livreur</span></h1>
          <p className="text-slate-500 font-medium text-sm">Prêt à gagner de l'argent avec EcoEATS ?</p>
        </div>

        <form onSubmit={handleRegister} className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100 animate-in shake duration-500">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nom complet</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" required
                  value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl pl-12 pr-6 py-4 outline-none transition-all font-bold text-slate-700"
                  placeholder="Jean Dupont"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="email" required
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl pl-12 pr-6 py-4 outline-none transition-all font-bold text-slate-700"
                    placeholder="jean@exemple.fr"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="tel" required
                    value={formData.telephone} onChange={e => setFormData({...formData, telephone: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl pl-12 pr-6 py-4 outline-none transition-all font-bold text-slate-700"
                    placeholder="06 12 34 56 78"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="password" required
                    value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl pl-12 pr-6 py-4 outline-none transition-all font-bold text-slate-700"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Confirmer</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="password" required
                    value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl pl-12 pr-6 py-4 outline-none transition-all font-bold text-slate-700"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-3 disabled:opacity-70 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : 'CRÉER MON COMPTE'}
          </button>

          <p className="text-center text-xs text-slate-400 font-bold px-4">
            En continuant, vous acceptez nos <span className="text-slate-900 underline">Conditions Générales</span> de livraison.
          </p>
        </form>
      </div>
    </div>
  );
}
