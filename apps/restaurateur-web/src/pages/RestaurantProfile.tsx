import { useState, useEffect } from 'react';
import { Store, Camera, Save, Globe, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import AddressAutocomplete from '../components/AddressAutocomplete';

export default function RestaurantProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const { token, restaurant, setRestaurant } = useAuthStore();

  const [formData, setFormData] = useState({
    nom: '',
    adresse: '',
    latitude: 0,
    longitude: 0,
    imageUrl: '',
  });

  useEffect(() => {
    fetchRestaurant();
  }, [token]);

  const fetchRestaurant = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/restaurant/mon-restaurant', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRestaurant(data);
        setFormData({
          nom: data.nom,
          adresse: data.adresse,
          latitude: data.coordonnees?.latitude || 0,
          longitude: data.coordonnees?.longitude || 0,
          imageUrl: data.imageUrl || '',
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !restaurant) return;

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/restaurant/${restaurant.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        if (res.status === 204) {
          await fetchRestaurant();
        } else {
          const updated = await res.json();
          setRestaurant(updated);
        }
        setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        throw new Error('Erreur lors de la mise à jour');
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Impossible de mettre à jour le profil.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 gap-4">
        <Loader2 className="animate-spin text-emerald-500" size={48} />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Chargement du profil...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-800 flex items-center gap-4">
          <div className="p-3 bg-emerald-600 text-white rounded-[1.5rem] shadow-xl shadow-emerald-200">
            <Store size={32} />
          </div>
          Identité de l'Enseigne
        </h1>
        <p className="text-slate-500 mt-4 font-medium text-lg leading-relaxed">Gérez l'image et les informations de votre établissement sur EcoEATS.</p>
      </div>

      {message && (
        <div className={`mb-8 p-6 rounded-[2rem] flex items-center gap-4 animate-in slide-in-from-top duration-500 shadow-lg ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-emerald-100/50' : 'bg-red-50 text-red-700 border border-red-100 shadow-red-100/50'
          }`}>
          {message.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
          <span className="font-black tracking-tight">{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-slate-100 p-10 lg:p-14 relative">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-14 relative z-10">
            
            <div className="flex flex-col items-center gap-6">
              <div className="relative group">
                <div className="w-56 h-56 rounded-[3rem] overflow-hidden border-8 border-slate-50 shadow-2xl bg-slate-100 group-hover:opacity-90 transition-all duration-500 ring-2 ring-slate-100">
                  <img
                    src={formData.imageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop"}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <label className="absolute -bottom-2 -right-2 bg-slate-900 text-white p-4 rounded-[1.5rem] shadow-2xl cursor-pointer hover:bg-black transition-all hover:scale-110 active:scale-95 border-4 border-white">
                  <Camera size={24} />
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 leading-relaxed">
                  Image de couverture
                </p>
                <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full border border-slate-200 uppercase tracking-tighter">HD Recommandé</span>
              </div>
            </div>

            
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Dénomination Sociale</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                    <Store size={22} />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-[1.5rem] outline-none transition-all font-black text-slate-700 text-xl placeholder:text-slate-300"
                    placeholder="Votre nom de restaurant"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Adresse Géographique</label>
                <div className="relative group">
                  <AddressAutocomplete 
                    value={formData.adresse}
                    onChange={() => {}}
                    onSelect={(adresse, lat, lon) => setFormData({ ...formData, adresse, latitude: lat, longitude: lon })}
                    placeholder="Tour Eiffel, Paris"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Lien vers pack média (URL)</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                    <Globe size={22} />
                  </div>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-[1.5rem] outline-none transition-all font-black text-slate-700 text-xl placeholder:text-slate-300"
                    placeholder="Lien externe si nécessaire"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-12 py-6 bg-slate-900 text-white rounded-[1.5rem] font-black text-lg shadow-2xl shadow-slate-300 hover:bg-black hover:shadow-slate-400 transition-all flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed group active:scale-95"
            >
              {saving ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <Save size={26} className="group-hover:translate-y-0.5 transition-transform" />
              )}
              SAUVEGARDER LE PROFIL
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
