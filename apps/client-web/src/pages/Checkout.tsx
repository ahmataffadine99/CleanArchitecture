import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { CheckCircle2, Loader2, MapPin, CreditCard, ChevronLeft, LogIn } from 'lucide-react';

export default function Checkout() {
  const { items, total, clearCart } = useCartStore();
  const { token, user } = useAuthStore();
  const navigate = useNavigate();

  const [rue, setRue] = useState('');
  const [ville, setVille] = useState('');
  const [codePostal, setCodePostal] = useState('');
  const [telephone, setTelephone] = useState('');
  
  const [numCarte, setNumCarte] = useState('');
  const [dateExp, setDateExp] = useState('');
  const [cvv, setCvv] = useState('');
  
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [error, setError] = useState<string | null>(null);
  const [facture, setFacture] = useState<any>(null);

  const clientId = user?.profilId;

  const processOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !clientId || items.length === 0) return;
    
    setStep('processing');
    setError(null);

    try {
      // 1. Vider l'ancien panier serveur
      await fetch(`/api/panier/${clientId}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // 2. Synchroniser le panier local Zustand vers le Backend
      for (const item of items) {
        const resAdd = await fetch('/api/panier/articles', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ clientId, platId: item.id, quantite: item.quantite })
        });
        if (!resAdd.ok) throw new Error("Erreur synchro : " + item.nom);
      }

      // 3. Passer la commande
      const resOrder = await fetch('/api/commandes', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          clientId,
          adresseLivraison: `${rue}, ${codePostal} ${ville} - Tél: ${telephone}`
        })
      });

      if (!resOrder.ok) throw new Error("Erreur création commande.");
      const orderData = await resOrder.json();

      // 4. Payer la commande
      const resPay = await fetch(`/api/commandes/${orderData.id}/payer`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ clientId })
      });

      if (!resPay.ok) throw new Error("Erreur paiement.");
      const factureData = await resPay.json();

      setFacture(factureData);
      clearCart();
      setStep('success');

    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
      setStep('form');
    }
  };

  if (!token) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center flex flex-col items-center">
        <div className="h-20 w-20 bg-emerald-50 text-emerald-600 rounded-[2rem] flex items-center justify-center mb-8 shadow-xl shadow-emerald-100">
          <LogIn size={32} />
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">Authentification requise</h2>
        <p className="text-slate-500 font-medium mb-10 text-lg leading-relaxed">
          Connectez-vous pour finaliser votre commande et profiter d'un suivi personnalisé de votre repas.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Link 
            to="/login" 
            state={{ from: { pathname: '/checkout' } }}
            className="flex-1 bg-slate-900 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-slate-200 hover:bg-black transition-all"
          >
            SE CONNECTER
          </Link>
          <Link 
            to="/register"
            className="flex-1 bg-emerald-50 text-emerald-600 font-black py-5 rounded-[1.5rem] hover:bg-emerald-100 transition-all border border-emerald-100"
          >
            S'INSCRIRE
          </Link>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center animate-in fade-in slide-in-from-bottom duration-700">
        <div className="flex justify-center mb-10">
          <div className="h-32 w-32 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-100">
            <CheckCircle2 size={64} strokeWidth={2.5} />
          </div>
        </div>
        <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tighter">C'est en route !</h1>
        <p className="text-xl text-slate-500 mb-12 max-w-lg mx-auto font-medium">
          Merci {user?.email.split('@')[0]}, votre commande est confirmée. Le restaurateur commence tout juste à préparer votre festin.
        </p>
        
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 sm:p-8 max-w-sm mx-auto text-left shadow-2xl shadow-emerald-900/5">
          <h3 className="font-black text-slate-800 mb-5 border-b border-slate-100 pb-4 text-lg tracking-tight">Résumé de Facturation</h3>
          <ul className="space-y-4 mb-6">
            <li className="flex flex-col gap-1 text-sm">
               <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Facture ID</span>
               <span className="font-mono text-xs bg-slate-50 px-3 py-1.5 rounded-lg text-slate-600 border border-slate-100">{facture?.factureId}</span>
            </li>
            <li className="text-xs text-slate-600 leading-relaxed bg-emerald-50/50 p-4 rounded-2xl border border-emerald-50 italic font-medium">
               "{facture?.detail}"
            </li>
          </ul>
          
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-black transition-all shadow-xl shadow-slate-200 text-sm"
          >
            RETOUR À L'ACCUEIL
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-6 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 hover:text-emerald-500 transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Finalisez votre commande</h1>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 mb-6 font-bold text-sm text-center animate-in shake duration-500">
          {error}
        </div>
      )}

      {items.length === 0 && step !== 'processing' ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-100 border-dashed text-center shadow-sm">
          <p className="text-lg font-black text-slate-300 mb-6">Votre panier semble vide...</p>
          <button onClick={() => navigate('/')} className="bg-emerald-500 text-white font-black px-8 py-3 rounded-xl hover:bg-emerald-600 transition-all text-sm">DÉCOUVRIR LES RESTAURANTS</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Formulaire Adresse & Paiement */}
          <div className="lg:col-span-3 space-y-6">
            <form onSubmit={processOrder} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40 space-y-10">
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
                    <MapPin size={20} />
                  </div>
                  <h2 className="text-xl font-black text-slate-800 tracking-tight">Destination</h2>
                </div>
                
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Rue & Numéro</label>
                    <input 
                      type="text" required
                      value={rue} onChange={(e) => setRue(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-xl px-5 py-3 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 text-sm"
                      placeholder="Ex: 24 Quai de la Rapée"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Ville</label>
                      <input 
                        type="text" required
                        value={ville} onChange={(e) => setVille(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-xl px-5 py-3 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 text-sm"
                        placeholder="Paris"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">CP</label>
                      <input 
                        type="text" required
                        value={codePostal} onChange={(e) => setCodePostal(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-xl px-5 py-3 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 text-sm"
                        placeholder="75012"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 pt-1 border-t border-slate-50">
                    <label className="text-xs font-black text-emerald-500 uppercase tracking-widest ml-1">Numéro de Téléphone (Obligatoire)</label>
                    <input 
                      type="tel" required
                      value={telephone} onChange={(e) => setTelephone(e.target.value)}
                      className="w-full bg-emerald-50/50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-xl px-5 py-3 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 text-sm"
                      placeholder="Ex: 06 12 34 56 78"
                    />
                  </div>
                </div>
              </section>

              <section className="pt-10 border-t border-slate-50">
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
                    <CreditCard size={24} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">Paiement Sécurisé</h2>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Numéro de carte</label>
                    <input 
                      type="text" required maxLength={19}
                      value={numCarte} onChange={(e) => setNumCarte(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 font-mono text-lg tracking-widest"
                      placeholder="XXXX XXXX XXXX XXXX"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Expire le (MM/YY)</label>
                      <input 
                        type="text" required maxLength={5}
                        value={dateExp} onChange={(e) => setDateExp(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 font-mono text-lg"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">CVV</label>
                      <input 
                        type="password" required maxLength={3}
                        value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 font-mono text-lg"
                        placeholder="•••"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <div className="pt-12 border-t border-slate-100">
                <div className="flex justify-between items-end mb-8">
                  <span className="text-slate-400 font-black uppercase tracking-widest text-xs">Total de la commande</span>
                  <span className="text-4xl font-black text-slate-900 leading-none">{total().toFixed(2)} €</span>
                </div>
                <button 
                  type="submit" 
                  disabled={step === 'processing'}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 focus:ring-8 focus:ring-emerald-100 text-white font-black py-6 rounded-3xl shadow-2xl shadow-emerald-200 hover:-translate-y-1 transition-all flex items-center justify-center gap-4 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {step === 'processing' ? (
                    <>
                      <Loader2 className="animate-spin" size={24} />
                      <span className="tracking-tight uppercase">Traitement sécurisé...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard size={24} />
                      <span className="tracking-tight uppercase">CONFIRMER LE PAIEMENT</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Récapitulatif Panier Vertical */}
          <div className="lg:col-span-2">
            <div className="sticky top-8 space-y-8">
              <div className="bg-slate-900 text-white p-10 rounded-[3.5rem] shadow-2xl shadow-slate-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl group-hover:bg-emerald-500/30 transition-all duration-700"></div>
                
                <h2 className="text-2xl font-black mb-8 relative z-10">Votre Panier</h2>
                <ul className="space-y-6 relative z-10">
                  {items.map(item => (
                    <li key={item.id} className="flex justify-between items-center group/item">
                      <div className="flex items-center gap-4">
                        <span className="h-10 w-10 flex items-center justify-center bg-white/10 rounded-xl text-xs font-black border border-white/10 group-hover/item:bg-white group-hover/item:text-slate-900 transition-colors">{item.quantite}x</span>
                        <span className="font-bold text-slate-200 group-hover/item:text-white transition-colors">{item.nom}</span>
                      </div>
                      <span className="font-black text-emerald-400">{(item.prix * item.quantite).toFixed(2)} €</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-10 pt-8 border-t border-white/10 space-y-4 relative z-10">
                  <div className="flex justify-between text-sm font-bold text-slate-400">
                    <span>Livraison Éco</span>
                    <span className="text-emerald-400">OFFERTE</span>
                  </div>
                  <div className="flex justify-between text-xl font-black pt-2">
                    <span>Total</span>
                    <span className="text-emerald-400">{total().toFixed(2)} €</span>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 p-8 rounded-[2.5rem] border border-emerald-100 shadow-xl shadow-emerald-100/50">
                <div className="flex items-center gap-4 text-emerald-700 mb-2">
                  <CheckCircle2 size={24} />
                  <span className="font-black tracking-tight">Engagement EcoEATS</span>
                </div>
                <p className="text-emerald-600/80 text-sm font-medium leading-relaxed italic">
                  Chaque commande passée avec nous réduit l'empreinte carbone moyenne d'un repas de 15% grâce à nos circuits courts.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}
    </main>
  );
}
