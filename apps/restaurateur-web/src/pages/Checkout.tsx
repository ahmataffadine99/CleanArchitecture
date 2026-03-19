import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { CheckCircle2, Loader2, MapPin, CreditCard, ChevronLeft } from 'lucide-react';

export default function Checkout() {
  const { items, total, clearCart } = useCartStore();
  const navigate = useNavigate();

  const [rue, setRue] = useState('');
  const [ville, setVille] = useState('');
  const [codePostal, setCodePostal] = useState('');
  
  const [numCarte, setNumCarte] = useState('');
  const [dateExp, setDateExp] = useState('');
  const [cvv, setCvv] = useState('');
  
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [error, setError] = useState<string | null>(null);
  const [facture, setFacture] = useState<any>(null);

  const clientId = "client-1"; // Identifiant du Client du Seed

  const processOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    setStep('processing');
    setError(null);

    try {
      // 1. Vider l'ancien panier serveur du client courant
      await fetch(`/api/panier/${clientId}`, { method: 'DELETE' });

      // 2. Synchroniser le panier local Zustand vers le Backend
      for (const item of items) {
        const resAdd = await fetch('/api/panier/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clientId, platId: item.id, quantite: item.quantite })
        });
        if (!resAdd.ok) throw new Error("Erreur lors de la synchronisation de l'article : " + item.nom);
      }

      // 3. Passer la commande
      const resOrder = await fetch('/api/commandes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          adresseLivraison: `${rue}, ${codePostal} ${ville}`
        })
      });

      if (!resOrder.ok) throw new Error("Erreur lors de la création de la commande.");
      const orderData = await resOrder.json();

      // 4. Payer la commande simulée
      const resPay = await fetch(`/api/commandes/${orderData.id}/payer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId })
      });

      if (!resPay.ok) throw new Error("Plateforme de paiement momentanément indisponible.");
      const factureData = await resPay.json();

      // Succès !
      setFacture(factureData);
      clearCart();
      setStep('success');

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Une erreur inattendue est survenue.");
      setStep('form');
    }
  };

  if (step === 'success') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center animate-slide-up">
        <div className="flex justify-center mb-6">
          <div className="h-24 w-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center">
            <CheckCircle2 size={50} strokeWidth={2.5} />
          </div>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-800 mb-4">Commande Confirmée !</h1>
        <p className="text-lg text-slate-500 mb-8 max-w-lg mx-auto">
          Merci pour votre commande éthique. Votre repas est en cours de préparation et le livreur le plus proche a été alerté.
        </p>
        
        <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md mx-auto text-left shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-4">Résumé de Facturation</h3>
          <ul className="space-y-3 mb-6">
            <li className="flex justify-between text-sm">
               <span className="text-slate-500">N° Facture</span>
               <span className="font-medium text-slate-800 font-mono text-xs mt-0.5">{facture?.factureId}</span>
            </li>
            <li className="flex justify-between text-sm text-slate-500 whitespace-pre-line leading-relaxed bg-slate-50 p-4 rounded-xl mt-2">
               {facture?.detail}
            </li>
          </ul>
          
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-emerald-50 text-emerald-600 font-bold py-3 rounded-xl hover:bg-emerald-100 transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 text-slate-500 hover:text-emerald-500 transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 w-fit"
      >
        <ChevronLeft size={18} />
        <span className="font-medium text-sm">Retour au panier</span>
      </button>

      <h1 className="text-3xl font-extrabold text-slate-800 mb-8">Finalisez votre commande</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 mb-8 font-medium text-sm text-center">
          {error}
        </div>
      )}

      {items.length === 0 && step !== 'processing' ? (
        <div className="bg-slate-50 text-slate-500 p-12 rounded-3xl border border-slate-200 border-dashed text-center">
          <p className="text-lg font-medium">Votre panier est vide.</p>
          <button onClick={() => navigate('/')} className="mt-4 text-emerald-500 underline font-medium">Retourner aux restaurants</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Formulaire Adresse */}
          <form onSubmit={processOrder} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm h-fit">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="text-emerald-500" size={20} />
              <h2 className="text-xl font-bold text-slate-800">Adresse de livraison</h2>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Rue ou Avenue</label>
                <input 
                  type="text" required
                  value={rue} onChange={(e) => setRue(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal"
                  placeholder="Ex: 10 Rue de la Paix"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Ville</label>
                  <input 
                    type="text" required
                    value={ville} onChange={(e) => setVille(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal"
                    placeholder="Ex: Paris"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Code Postal</label>
                  <input 
                    type="text" required
                    value={codePostal} onChange={(e) => setCodePostal(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal"
                    placeholder="Ex: 75000"
                  />
                </div>
              </div>
            </div>

            {/* Paiement */}
            <div className="mt-8 pt-8 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <CreditCard className="text-emerald-500" size={20} />
                <h2 className="text-xl font-bold text-slate-800">Paiement</h2>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Numéro de carte</label>
                  <input 
                    type="text" required maxLength={19}
                    value={numCarte} onChange={(e) => setNumCarte(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal font-mono"
                    placeholder="0000 0000 0000 0000"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Date d'expiration</label>
                    <input 
                      type="text" required maxLength={5}
                      value={dateExp} onChange={(e) => setDateExp(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal font-mono"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Code de sécurité (CVV)</label>
                    <input 
                      type="text" required maxLength={3}
                      value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal font-mono"
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-100">
              <div className="flex justify-between items-end mb-6">
                <span className="text-slate-500 font-medium">Montant total</span>
                <span className="text-2xl font-black text-slate-800">{total().toFixed(2)} €</span>
              </div>
              <button 
                type="submit" 
                disabled={step === 'processing'}
                className="w-full bg-emerald-500 hover:bg-emerald-600 focus:ring-4 focus:ring-emerald-500/30 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all outline-none flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {step === 'processing' ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Traitement en cours...</span>
                  </>
                ) : (
                  <>
                    <CreditCard size={20} />
                    <span>Valider et Payer</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Récap panier */}
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 h-fit">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Votre commande</h2>
            <ul className="space-y-4">
              {items.map(item => (
                <li key={item.id} className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100/50">
                  <div>
                    <span className="font-bold text-slate-800">{item.quantite}x </span>
                    <span className="text-slate-600 font-medium">{item.nom}</span>
                  </div>
                  <span className="font-bold text-emerald-600">{(item.prix * item.quantite).toFixed(2)} €</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-6 border-t border-slate-200/60 flex justify-between text-slate-500">
              <span>Frais de livraison estimés</span>
              <span>Calculés lors du Checkout</span>
            </div>
          </div>

        </div>
      )}
    </main>
  );
}
