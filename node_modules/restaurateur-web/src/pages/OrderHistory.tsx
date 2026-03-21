import { useState, useEffect } from 'react';
import { History as HistoryIcon, CheckCircle2, Search, Calendar, ChevronRight, XCircle, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

type Commande = {
  id: string;
  statut: string;
  prixPlatsCentimes: number;
  creeLe: string;
  articles: Array<{
    nom: string;
    quantite: number;
  }>;
  livreurNom?: string;
};

export default function OrderHistory() {
  const [search, setSearch] = useState("");
  const { token, user } = useAuthStore();
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const chargerDonnees = async () => {
      if (!token || !user?.profilId) return;
      try {
        const res = await fetch(`/api/restaurant/${user.profilId}/commandes`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const dateCounts: Record<string, number> = {};
            const sorted = [...data].sort((a, b) => new Date(a.creeLe).getTime() - new Date(b.creeLe).getTime());
            const enriched = sorted.map(cmd => {
              const dStr = new Date(cmd.creeLe).toDateString();
              dateCounts[dStr] = (dateCounts[dStr] || 0) + 1;
              return { ...cmd, numJour: dateCounts[dStr] };
            }).reverse();
            setCommandes(enriched as Commande[]);
          }
        }
      } catch (err) {
        console.error("Erreur chargement historique", err);
      } finally {
        setLoading(false);
      }
    };
    chargerDonnees();
  }, [token, user?.profilId]);

  // Filtrer les commandes d'historique (Livrée, Refusée, Abandonnée, Prête)
  const pastOrders = commandes
    .filter(c => ['LIVREE', 'REFUSEE', 'ABANDONNEE', 'EN_LIVRAISON'].includes(c.statut))
    .filter(c => 
      c.id.toLowerCase().includes(search.toLowerCase()) || 
      (c as any).numJour.toString().includes(search)
    )
    .sort((a, b) => new Date(b.creeLe).getTime() - new Date(a.creeLe).getTime())
    .reverse();

  const [selectedOrder, setSelectedOrder] = useState<Commande | null>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
       <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Historique des commandes</h1>
        <p className="text-slate-500">Données en direct de la base de données (API).</p>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
        <div className="p-6 border-b border-slate-100 flex gap-4 bg-slate-50/50">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Rechercher par N° de commande ou ID..."
              className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 outline-none transition-all shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="bg-white text-slate-600 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors border border-slate-200 shadow-sm">
            <Calendar size={18} /> Filtres
          </button>
        </div>

        <div>
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
            </div>
          ) : pastOrders.length === 0 ? (
            <div className="text-center py-20">
               <p className="text-slate-400 font-medium">Aucune commande historique trouvée.</p>
            </div>
          ) : (
            pastOrders.map((order) => {
              const dateObj = new Date(order.creeLe);
              const dateStr = `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString()}`;
              const isRefus = ['REFUSEE', 'ABANDONNEE'].includes(order.statut);
              
              return (
                <div 
                  key={order.id} 
                  onClick={() => setSelectedOrder(order)}
                  className="group border-b border-slate-50 last:border-0 p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer gap-4"
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-sm ${isRefus ? 'bg-red-50 text-red-500 border-red-100' : 'bg-emerald-50 text-emerald-500 border-emerald-100'}`}>
                      {isRefus ? <XCircle size={28} /> : <CheckCircle2 size={28} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-black text-slate-700 bg-white px-2.5 py-1 rounded-xl border border-slate-200 shadow-sm">
                          #{(order as any).numJour}
                        </span>
                        <span className="text-sm font-mono font-bold text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-xl shadow-sm">ID: {order.id.split('-')[0].toUpperCase()}</span>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${isRefus ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'}`}>
                          {order.statut}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-500 line-clamp-1">
                        {order.articles.map(a => `${a.quantite}x ${a.nom}`).join(', ')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between md:justify-end gap-10 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-left md:text-right">
                      <p className="font-black text-slate-800 text-xl">{(order.prixPlatsCentimes / 100).toFixed(2)} €</p>
                      <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 justify-start md:justify-end mt-1 uppercase tracking-wider">
                        <HistoryIcon size={12} /> {dateStr}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all shadow-sm">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* MODAL FACTURE / TICKET */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:p-0 print:bg-white">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 print:shadow-none print:w-full">
            
            {/* Header Facture */}
            <div className="bg-slate-900 text-white p-6 text-center relative print:bg-white print:text-black print:border-b-2 print:border-black">
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="absolute top-4 right-4 h-8 w-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors print:hidden"
              >
                <XCircle size={18} />
              </button>
              <h2 className="text-xl font-black tracking-tight mb-1 uppercase">EcoEATS TICKET</h2>
              <p className="text-slate-400 font-medium text-[10px] print:text-slate-600">Reçu de transaction</p>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-center mb-6 pb-6 border-b border-dashed border-slate-200">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Commande N°</p>
                  <p className="text-lg font-black text-slate-800">#{(selectedOrder as any).numJour}</p>
                  <p className="text-[10px] font-mono text-slate-400 mt-1">ID: {selectedOrder.id.substring(0, 8)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date</p>
                  <p className="text-xs font-bold text-slate-800 flex items-center justify-end gap-1.5">
                    <Calendar size={12} className="text-slate-400" />
                    {new Date(selectedOrder.creeLe).toLocaleDateString()}
                  </p>
                  <p className="text-[10px] font-bold text-slate-500 mt-1">{new Date(selectedOrder.creeLe).toLocaleTimeString()}</p>
                </div>
              </div>

              <div className="mb-6 p-3 bg-slate-50 rounded-xl border border-slate-100 print:border-none print:bg-white print:p-0">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Infos Client</p>
                <p className="font-bold text-sm text-slate-800">{(selectedOrder as any).clientNom || "Client en Ligne"}</p>
                <div className="text-xs font-medium text-slate-500 mt-1 space-y-0.5">
                  {(() => {
                    const dbPhone = (selectedOrder as any).clientTelephone;
                    const addressStr = (selectedOrder as any).adresseLivraison || "";
                    const hasValidDbPhone = dbPhone && dbPhone !== 'Non renseigné' && dbPhone.length > 3;
                    
                    const extractedPhoneMatch = addressStr.match(/Tél:\s*([^\n]+)/i);
                    const parsedPhone = extractedPhoneMatch ? extractedPhoneMatch[1] : null;

                    const finalPhone = hasValidDbPhone ? dbPhone : parsedPhone;
                    const cleanAddress = addressStr.replace(/\s*-\s*Tél:\s*[^\n]+/i, '');

                    return (
                      <>
                        {finalPhone && <p>Tél: <span className="font-bold text-slate-700">{finalPhone}</span></p>}
                        <p>Livraison: {cleanAddress || "Sur place / Non renseigné"}</p>
                      </>
                    );
                  })()}
                  <p className="text-[10px] text-slate-400 mt-1">Ref Client: {selectedOrder.id.split('-')[1] || 'Anonyme'}</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Articles</p>
                <div className="space-y-3">
                  {selectedOrder.articles.map((art, idx) => (
                    <div key={idx} className="flex justify-between items-start">
                      <div className="flex gap-2 text-xs font-bold text-slate-800">
                        <span className="text-slate-400 w-5 text-right">{art.quantite}x</span>
                        <span className="flex-1">{art.nom}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-800">—</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 print:bg-white print:border-black print:border-2">
                <div className="flex justify-between items-center mb-1 text-xs font-bold text-slate-500">
                  <span>Sous-total HT</span>
                  <span>{((selectedOrder.prixPlatsCentimes / 100) * 0.9).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between items-center mb-3 text-xs font-bold text-slate-500">
                  <span>TVA (10%)</span>
                  <span>{((selectedOrder.prixPlatsCentimes / 100) * 0.1).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-200 text-lg font-black text-slate-900">
                  <span>TOTAL</span>
                  <span>{(selectedOrder.prixPlatsCentimes / 100).toFixed(2)} €</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 print:hidden flex justify-between items-center">
              <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 ${['REFUSEE', 'ABANDONNEE'].includes(selectedOrder.statut) ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'}`}>
                {selectedOrder.statut}
              </span>
              <button 
                onClick={handlePrint}
                className="bg-slate-900 text-white px-5 py-2 rounded-xl font-bold text-xs hover:bg-black transition-colors shadow-md shadow-slate-200"
              >
                Imprimer / PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
