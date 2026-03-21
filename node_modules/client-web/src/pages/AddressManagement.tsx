import { useState } from 'react';
import { MapPin, Plus, Home, Briefcase, Trash2, ArrowLeft, X, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAddressStore } from '../store/addressStore';
import type { Address } from '../store/addressStore';
import AddressAutocomplete from '../components/AddressAutocomplete';

export default function AddressManagement() {
  const navigate = useNavigate();
  const { addresses, addAddress, removeAddress, updateAddress } = useAddressStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Omit<Address, 'id'>>({
    label: '',
    rue: '',
    ville: '',
    codePostal: '',
    telephone: '',
    type: 'home',
    latitude: 0,
    longitude: 0,
    complement: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateAddress(editingId, formData);
    } else {
      addAddress(formData);
    }
    closeModal();
  };

  const openModal = (addr?: Address) => {
    if (addr) {
      setEditingId(addr.id);
      setFormData({
        label: addr.label,
        rue: addr.rue,
        ville: addr.ville,
        codePostal: addr.codePostal,
        telephone: addr.telephone,
        type: addr.type,
        latitude: addr.latitude || 0,
        longitude: addr.longitude || 0,
        complement: addr.complement || '',
      });
    } else {
      setEditingId(null);
      setFormData({ label: '', rue: '', ville: '', codePostal: '', telephone: '', type: 'home', latitude: 0, longitude: 0, complement: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ label: '', rue: '', ville: '', codePostal: '', telephone: '', type: 'home', latitude: 0, longitude: 0, complement: '' });
  };

  const getIcon = (type: string) => {
    if (type === 'home') return Home;
    if (type === 'work') return Briefcase;
    return MapPin;
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 relative">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-slate-800 font-bold mb-8 transition-colors group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        RETOUR
      </button>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-6">
        <div className="text-center sm:text-left">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Mes Adresses</h1>
          <p className="text-slate-500 font-medium mt-2">Gérez vos lieux de livraison pour commander plus vite.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-black px-6 py-4 rounded-2xl shadow-xl shadow-emerald-100 transition-all flex items-center gap-2 whitespace-nowrap"
        >
          <Plus size={20} /> AJOUTER UNE ADRESSE
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        {addresses.map((addr) => {
          const Icon = getIcon(addr.type);
          return (
            <div key={addr.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative">
               <button 
                  onClick={() => removeAddress(addr.id)}
                  className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
               >
                  <Trash2 size={18} />
               </button>
               
               <div className="w-14 h-14 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                  <Icon size={28} />
               </div>
               
               <h3 className="text-xl font-black text-slate-800 mb-2">{addr.label}</h3>
               <p className="text-sm font-bold text-slate-400 leading-relaxed mb-6">{addr.rue}, {addr.codePostal} {addr.ville}</p>
               
               <div className="flex items-center justify-between">
                 <button 
                   onClick={() => openModal(addr)}
                   className="text-[10px] font-black text-emerald-600 hover:text-emerald-700 tracking-wider"
                 >
                   MODIFIER L'ADRESSE
                 </button>
                 <span className="text-[10px] font-bold text-slate-300 italic">{addr.telephone}</span>
               </div>
            </div>
          );
        })}

        {addresses.length === 0 && (
          <div className="sm:col-span-2 py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-400">
             <MapPin size={48} className="mb-4 opacity-20" />
             <p className="font-bold">Aucune adresse enregistrée.</p>
             <button onClick={() => openModal()} className="text-emerald-500 font-black mt-2">Cliquez ici pour en ajouter une</button>
          </div>
        )}
      </div>

      {/* Modal Ajout/Modification */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={closeModal}></div>
           <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl animate-in zoom-in slide-in-from-bottom-8 duration-300">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50 rounded-t-[2.5rem]">
                 <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                   {editingId ? 'Modifier l\'Adresse' : 'Nouvelle Adresse'}
                 </h2>
                 <button onClick={closeModal} className="p-2 hover:bg-white rounded-xl text-slate-400 transition-colors">
                    <X size={24} />
                 </button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                 <div className="grid grid-cols-2 gap-4 mb-4">
                    <button 
                      type="button" 
                      onClick={() => setFormData({...formData, type: 'home'})}
                      className={`flex items-center justify-center gap-2 p-4 rounded-2xl font-bold text-sm transition-all border-2 ${formData.type === 'home' ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-slate-50 border-transparent text-slate-400'}`}
                    >
                      <Home size={18} /> Maison
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setFormData({...formData, type: 'work'})}
                      className={`flex items-center justify-center gap-2 p-4 rounded-2xl font-bold text-sm transition-all border-2 ${formData.type === 'work' ? 'bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-slate-50 border-transparent text-slate-400'}`}
                    >
                      <Briefcase size={18} /> Bureau
                    </button>
                 </div>

                 <div className="space-y-4">
                  <input 
                    type="text" required placeholder="Nom de cette adresse (ex: Chez Maman)" 
                    value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-xl px-5 py-3 outline-none transition-all font-bold text-slate-700 text-sm"
                  />
                  
                  <div className="bg-slate-50 rounded-xl p-1 border-2 border-transparent focus-within:border-emerald-500 focus-within:bg-white transition-all">
                    <AddressAutocomplete 
                      value={formData.rue ? `${formData.rue}, ${formData.codePostal} ${formData.ville}` : ''}
                      onChange={() => {}} // L'utilisateur tape dans l'autocomplete
                      onSelect={(fullAddress, lat, lon) => {
                         // On tente d'extraire la rue, ville, CP depuis "27 Rue Cambronne, 75015 Paris" ou autre
                         // Souvent Nominatim renvoie "Numéro Rue, Ville, etc..."
                         const parts = fullAddress.split(',');
                         let rue = parts[0]?.trim() || '';
                         if (parts.length > 1 && !isNaN(parseInt(parts[0]))) {
                            rue = parts[0].trim() + ' ' + parts[1].trim(); // Numéro + Rue
                         }
                         
                         const cpAndVille = fullAddress.match(/(\d{5})\s+([^,]+)/);
                         
                         setFormData({
                           ...formData,
                           rue: rue || fullAddress,
                           codePostal: cpAndVille ? cpAndVille[1] : '',
                           ville: cpAndVille ? cpAndVille[2].trim() : (parts[parts.length - 2]?.trim() || parts[parts.length - 1]?.trim() || ''),
                           latitude: lat,
                           longitude: lon
                         });
                      }}
                      placeholder="Ville, Rue..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rue / Numéro</label>
                      <input 
                        type="text" required placeholder="Rue / Bâtiment" 
                        value={formData.rue} onChange={e => setFormData({...formData, rue: e.target.value})}
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-xl px-5 py-3 outline-none transition-all font-bold text-slate-700 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Complément (Étage...)</label>
                      <input 
                        type="text" placeholder="Bât. A, Apt 12..." 
                        value={formData.complement} onChange={e => setFormData({...formData, complement: e.target.value})}
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-xl px-5 py-3 outline-none transition-all font-bold text-slate-700 text-sm"
                      />
                    </div>
                  </div>
                  <input 
                    type="tel" required placeholder="Téléphone de contact" 
                    value={formData.telephone} onChange={e => setFormData({...formData, telephone: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-xl px-5 py-3 outline-none transition-all font-bold text-slate-700 text-sm"
                  />
                 </div>

                 <button 
                   type="submit" 
                   className="w-full bg-slate-900 text-white font-black py-5 rounded-3xl shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3 mt-4"
                 >
                    <Save size={20} /> {editingId ? 'ENREGISTRER LES MODIFICATIONS' : 'ENREGISTRER L\'ADRESSE'}
                 </button>
              </form>
           </div>
        </div>
      )}
    </main>
  );
}
