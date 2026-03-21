import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Utensils, Save, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

type Plat = {
  id: string;
  nom: string;
  description: string;
  prix: number;
  allergenes: string[];
  stock: number;
  imageUrl?: string | null;
  actif?: boolean;
  restaurantId?: string;
  categorie?: string;
};

export default function MenuManagement() {
  const [plats, setPlats] = useState<Plat[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlat, setEditingPlat] = useState<Plat | null>(null);
  
  const { token, user, restaurant } = useAuthStore();
  const restaurantId = user?.profilId;

  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    prix: '',
    allergenes: '',
    stock: '100',
    imageUrl: '',
    actif: true,
    categorie: 'PLAT',
    imageSource: 'url' as 'url' | 'local'
  });

  const chargerMenu = async () => {
    if (!token || !restaurantId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/restaurants/${restaurantId}/menu`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      const pts = [...data.disponibles, ...data.rupture].map(p => ({ ...p, restaurantId }));
      setPlats(pts);
    } catch (e) {
      console.error("Erreur chargement menu", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerMenu();
  }, [restaurantId, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !restaurantId) return;

    const payload = {
      nom: formData.nom,
      description: formData.description,
      prixEuros: parseFloat(formData.prix),
      allergenes: formData.allergenes.split(',').map(s => s.trim()).filter(s => s !== ''),
      stockJournalier: parseInt(formData.stock),
      imageUrl: formData.imageUrl || null,
      actif: formData.actif,
      categorie: formData.categorie
    };

    try {
      const url = editingPlat 
        ? `/api/plats/${editingPlat.id}` 
        : `/api/restaurant/${restaurantId}/plats`;
      
      const method = editingPlat ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowModal(false);
        setEditingPlat(null);
        resetForm();
        chargerMenu();
      } else {
        const errorText = await res.text();
        alert(`Erreur: ${errorText}`);
      }
    } catch (e) {
      console.error("Erreur sauvegarde", e);
    }
  };

  const resetForm = () => {
    setFormData({ 
      nom: '', description: '', prix: '', allergenes: '', 
      stock: '100', imageUrl: '', actif: true, categorie: 'PLAT', imageSource: 'url' 
    });
  };

  const handleEdit = (plat: Plat) => {
    setEditingPlat(plat);
    setFormData({
      nom: plat.nom,
      description: plat.description,
      prix: plat.prix.toString(),
      allergenes: plat.allergenes.join(', '),
      stock: plat.stock.toString(),
      imageUrl: plat.imageUrl || '',
      actif: plat.actif ?? true,
      categorie: plat.categorie || 'PLAT',
      imageSource: plat.imageUrl?.startsWith('data:image') ? 'local' : 'url'
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm("Supprimer ce plat définitivement ?")) return;
    try {
      await fetch(`/api/plats/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      chargerMenu();
    } catch (e) {
      console.error("Erreur suppression", e);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Gestion du Menu</h1>
          <p className="text-slate-500 font-medium">Carte de l'établissement : <span className="text-emerald-600">{restaurant?.nom || 'Chargement...'}</span></p>
        </div>
        <button 
          onClick={() => { setEditingPlat(null); resetForm(); setShowModal(true); }}
          className="bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] font-black flex items-center gap-2 hover:bg-black transition-all shadow-xl shadow-slate-200 hover:-translate-y-0.5"
        >
          <Plus size={20} /> AJOUTER UN PLAT
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Mise à jour de la carte...</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plats.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Utensils className="text-slate-200" size={40} />
                </div>
                <p className="text-slate-400 font-bold">Votre carte est vide pour le moment.</p>
              </div>
            )}
            {plats.map(plat => (
              <div key={plat.id} className="group flex flex-col p-5 rounded-[2rem] border border-slate-100 bg-slate-50/30 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/60 transition-all relative overflow-hidden">
                {!plat.actif && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg shadow-red-200 uppercase tracking-tighter">Épuisé</span>
                  </div>
                )}
                
                <div className="h-48 w-full rounded-2xl overflow-hidden mb-5 bg-slate-100">
                  {plat.imageUrl ? (
                    <img src={plat.imageUrl} alt={plat.nom} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-slate-300">
                      <ImageIcon size={48} strokeWidth={1} />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-black text-slate-800 text-lg leading-tight">{plat.nom}</h3>
                    <span className="text-emerald-600 font-black text-xl">{plat.prix}€</span>
                  </div>
                  <p className="text-slate-500 text-sm font-medium line-clamp-2 mb-4 h-10">{plat.description}</p>
                  
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-3 py-1 rounded-full">Stock: {plat.stock}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${plat.categorie === 'BOISSON' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                      {plat.categorie === 'BOISSON' ? 'Boisson' : 'Plat'}
                    </span>
                    {plat.allergenes.length > 0 && (
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full">Allergènes</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-slate-100">
                  <button onClick={() => handleEdit(plat)} className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
                    <Edit2 size={16} /> Modifier
                  </button>
                  <button onClick={() => handleDelete(plat.id)} className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Premium */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] flex flex-col">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                  {editingPlat ? 'Éditer le plat' : 'Nouveau au menu'}
                </h3>
                <p className="text-slate-500 font-medium">Remplissez les détails pour vos clients.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-600 shadow-sm border border-slate-100 transition-all hover:rotate-90">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nom du délice</label>
                    <input 
                      required
                      type="text" 
                      placeholder="ex: Burger Signature Avocat"
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl px-5 py-4 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                      value={formData.nom}
                      onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Composition & Histoire</label>
                    <textarea 
                      required
                      rows={4}
                      placeholder="Ingrédients locaux, passion..."
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl px-5 py-4 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 resize-none"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Catégorie</label>
                    <div className="flex gap-4">
                      {['PLAT', 'BOISSON'].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setFormData({...formData, categorie: cat})}
                          className={`flex-1 py-4 rounded-2xl font-bold transition-all border-2 ${
                            formData.categorie === cat 
                              ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
                              : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'
                          }`}
                        >
                          {cat === 'BOISSON' ? 'Boisson' : 'Plat'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Prix (€)</label>
                      <input 
                        required
                        type="number" step="0.01"
                        placeholder="14.00"
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl px-5 py-4 outline-none transition-all font-bold text-slate-700"
                        value={formData.prix}
                        onChange={(e) => setFormData({...formData, prix: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Stock</label>
                      <input 
                        required
                        type="number"
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl px-5 py-4 outline-none transition-all font-bold text-slate-700"
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Illustration</label>
                      <div className="flex bg-white p-1 rounded-xl border border-slate-100 gap-1">
                        <button type="button" onClick={() => setFormData({...formData, imageSource: 'url'})} className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all ${formData.imageSource === 'url' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500'}`}>URL</button>
                        <button type="button" onClick={() => setFormData({...formData, imageSource: 'local'})} className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all ${formData.imageSource === 'local' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500'}`}>FICHIER</button>
                      </div>
                    </div>

                    {formData.imageSource === 'url' ? (
                      <input type="url" placeholder="https://..." className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 outline-none text-sm font-medium" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} />
                    ) : (
                      <input type="file" accept="image/*" className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-slate-900 file:text-white cursor-pointer hover:file:bg-black" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setFormData({...formData, imageUrl: reader.result as string});
                          reader.readAsDataURL(file);
                        }
                      }} />
                    )}
                    
                    {formData.imageUrl && (
                      <div className="h-28 w-full rounded-2xl overflow-hidden border-2 border-white shadow-md relative">
                        <img src={formData.imageUrl} alt="Aperçu" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => setFormData({...formData, imageUrl: ''})} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg"><Trash2 size={14} /></button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Disponibilité</label>
                  <p className="text-sm font-bold text-slate-700">{formData.actif ? 'Produit en ligne' : 'Produit masqué'}</p>
                </div>
                <button type="button" onClick={() => setFormData({...formData, actif: !formData.actif})} className={`w-14 h-8 rounded-full transition-all relative p-1 ${formData.actif ? 'bg-emerald-500 shadow-inner' : 'bg-slate-300'}`}>
                  <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-all ${formData.actif ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Allergènes (Ex: GLUTEN, SOJA...)</label>
                <input type="text" placeholder="Séparez par des virgules" className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl px-5 py-4 outline-none transition-all font-bold text-slate-700" value={formData.allergenes} onChange={(e) => setFormData({...formData, allergenes: e.target.value})} />
              </div>

              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-100 text-slate-500 font-black py-5 rounded-[1.5rem] hover:bg-slate-200 transition-all">ANNULER</button>
                <button type="submit" className="flex-[2] bg-emerald-500 text-white font-black py-5 rounded-[1.5rem] hover:bg-emerald-600 shadow-xl shadow-emerald-100 transition-all flex items-center justify-center gap-3">
                  <Save size={20} /> {editingPlat ? 'ENREGISTRER' : 'AJOUTER À LA CARTE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
