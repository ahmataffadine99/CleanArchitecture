import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { User, Mail, Phone, ShieldCheck, Loader2, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ProfileInfo() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.profilId) return;
      try {
        const token = localStorage.getItem('ecoeats-auth-client');
        const parsed = JSON.parse(token || '{}');
        const res = await fetch(`/api/profil/${user.profilId}`, {
          headers: { 'Authorization': `Bearer ${parsed.state.token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setFormData({
            nom: data.nom || '',
            email: data.email || '',
            telephone: data.telephone || ''
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('ecoeats-auth-client');
      const parsed = JSON.parse(token || '{}');
      const res = await fetch('/api/profil', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${parsed.state.token}`
        },
        body: JSON.stringify({
          clientId: user?.profilId,
          ...formData
        })
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        const err = await res.json();
        setMessage({ type: 'error', text: err.message || 'Une erreur est survenue.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in">
        <Loader2 className="animate-spin text-emerald-500 mb-4" size={32} />
        <p className="text-slate-400 font-medium italic">Chargement de votre profil...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
          <User size={32} fill="currentColor" fillOpacity={0.2} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Mes informations</h1>
          <p className="text-slate-500 font-medium">Gérez vos coordonnées et préférences personnelles</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Résumé de compte */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-200/50 sticky top-24">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <ShieldCheck className="text-emerald-500" size={18} />
              Statut du compte
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Rôle</p>
                <p className="font-bold text-slate-700 capitalize">{user?.role === 'CLIENT' ? 'Client Éco' : user?.role}</p>
              </div>
              
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <p className="text-[10px] font-bold text-emerald-600/70 uppercase tracking-widest mb-1">Points Fidélité</p>
                <p className="text-2xl font-black text-emerald-600">{profile?.pointsFidelite || 0} pts</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-xs text-slate-400 italic leading-relaxed">
                Vos données sont sécurisées et ne sont jamais partagées avec des tiers sans votre consentement.
              </p>
            </div>
          </div>
        </div>

        {/* Formulaire de modification */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
            <div className="space-y-4">
              <div className="group">
                <label className="block text-sm font-bold text-slate-700 mb-2 px-1">Nom complet</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                  <input
                    type="text"
                    required
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all font-medium text-slate-800"
                    placeholder="Jean Dupont"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-bold text-slate-700 mb-2 px-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all font-medium text-slate-800"
                    placeholder="jean.dupont@exemple.com"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-bold text-slate-700 mb-2 px-1">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                  <input
                    type="tel"
                    required
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all font-medium text-slate-800"
                    placeholder="06 12 34 56 78"
                  />
                </div>
              </div>
            </div>

            {message.text && (
              <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in zoom-in-95 ${
                message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
              }`}>
                {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <p className="text-sm font-bold">{message.text}</p>
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-slate-900 hover:bg-black text-white font-black py-4 rounded-2xl shadow-lg shadow-slate-900/10 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Save size={20} className="group-hover:scale-110 transition-transform" />
                    Enregistrer les modifications
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
