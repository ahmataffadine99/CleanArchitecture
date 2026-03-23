import { useState, useEffect } from 'react';
import { MessageSquare, LifeBuoy, Send, Clock, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function SupportPage() {
  const { user, token } = useAuthStore();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newTicket, setNewTicket] = useState({ titre: '', message: '' });
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [reply, setReply] = useState('');

  const profilId = user?.profilId || '';

  const fetchTickets = async () => {
    if (!profilId || !token) return;
    try {
      const res = await fetch(`/api/support/tickets/${profilId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setTickets(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchTickets();
  }, [profilId, token]);

  const handleCreateTicket = async () => {
    if (!newTicket.titre || !newTicket.message || !token) return;
    try {
      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          auteurId: profilId, 
          titre: newTicket.titre, 
          messageInitial: newTicket.message 
        })
      });
      if (res.ok) {
        setNewTicket({ titre: '', message: '' });
        setShowCreate(false);
        fetchTickets();
      }
    } catch (err) { console.error(err); }
  };

  const handleSendReply = async () => {
    if (!reply.trim() || !selectedTicket || !token) return;
    try {
      const res = await fetch(`/api/support/tickets/${selectedTicket.id}/message`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ contenu: reply, auteurId: profilId })
      });
      if (res.ok) {
        setReply('');
        fetchTickets();
        const data = await res.json();
        setSelectedTicket({ ...selectedTicket, messages: [...selectedTicket.messages, data] });
      }
    } catch (err) { console.error(err); }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl text-center max-w-md">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <LifeBuoy size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-4">Besoin d'aide ?</h2>
          <p className="text-slate-500 mb-8 font-medium">Veuillez vous connecter pour contacter notre support client.</p>
          <button className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl">SE CONNECTER</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-4xl mx-auto px-6 pt-12">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Support Client</h1>
            <p className="text-slate-500 font-medium italic">Une équipe à votre écoute 24h/24</p>
          </div>
          <div className="w-16 h-16 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center text-emerald-500 transform rotate-12">
            <MessageSquare size={32} />
          </div>
        </div>

        {selectedTicket ? (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col h-[600px] animate-in slide-in-from-right-4 duration-300">
            <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
              <div>
                <button onClick={() => setSelectedTicket(null)} className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1 block">← Retour</button>
                <h2 className="text-xl font-black text-slate-800">{selectedTicket.titre}</h2>
              </div>
              <span className={`text-[10px] font-black px-3 py-1 rounded-full ${selectedTicket.statut === 'OUVERT' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                {selectedTicket.statut}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-4 bg-white/50 backdrop-blur-sm">
              {selectedTicket.messages.map((m: any) => (
                <div key={m.id} className={`flex ${m.estAdmin ? 'justify-start' : 'justify-end'}`}>
                   <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium ${m.estAdmin ? 'bg-slate-100 text-slate-600 rounded-tl-none shadow-sm' : 'bg-slate-900 text-white rounded-tr-none shadow-lg shadow-slate-900/10'}`}>
                      {m.contenu}
                   </div>
                </div>
              ))}
            </div>
            {selectedTicket.statut === 'OUVERT' && (
              <div className="p-6 border-t border-slate-50 bg-white">
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    placeholder="Posez votre question..."
                    className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/5"
                    onKeyDown={e => e.key === 'Enter' && handleSendReply()}
                  />
                  <button onClick={handleSendReply} className="bg-emerald-500 text-white p-4 rounded-2xl shadow-xl shadow-emerald-500/20 hover:scale-105 transition-transform active:scale-95">
                    <Send size={24} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : showCreate ? (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-10 animate-in zoom-in-95 duration-300">
             <div className="flex justify-between items-center mb-8">
               <h2 className="text-2xl font-black text-slate-800">Ouvrir un ticket</h2>
               <button onClick={() => setShowCreate(false)} className="p-2 bg-slate-50 rounded-xl text-slate-400"><X size={20}/></button>
             </div>
             <div className="space-y-6">
                <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4 underline decoration-emerald-500/30 decoration-4">Sujet de votre demande</label>
                   <input 
                      type="text" 
                      value={newTicket.titre}
                      onChange={e => setNewTicket({...newTicket, titre: e.target.value})}
                      placeholder="Comment pouvons-nous vous aider ?"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/5"
                   />
                </div>
                <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4 underline decoration-emerald-500/30 decoration-4">Message détaillé</label>
                   <textarea 
                      rows={5}
                      value={newTicket.message}
                      onChange={e => setNewTicket({...newTicket, message: e.target.value})}
                      placeholder="Décrivez votre problème afin qu'Adli et son équipe puissent vous répondre le plus précisément possible..."
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/5 resize-none"
                   />
                </div>
                <button 
                  onClick={handleCreateTicket}
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-2xl shadow-slate-900/10 hover:bg-emerald-600 transition-all uppercase tracking-widest"
                >
                  Envoyer ma demande
                </button>
             </div>
          </div>
        ) : (
          <div className="space-y-6">
            <button 
              onClick={() => setShowCreate(true)}
              className="w-full bg-emerald-500 p-8 rounded-[2.5rem] flex items-center justify-between group shadow-2xl shadow-emerald-500/20 hover:-translate-y-1 transition-all"
            >
              <div className="flex items-center gap-6">
                 <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-white backdrop-blur-sm group-hover:scale-110 transition-transform">
                    <MessageSquare size={28} />
                 </div>
                 <div className="text-left">
                    <h3 className="text-xl font-black text-white">Nouveau Ticket</h3>
                    <p className="text-white/80 text-sm font-medium">Réponse en moins de 15 minutes</p>
                 </div>
              </div>
              <ChevronRight className="text-white opacity-40 group-hover:opacity-100 group-hover:translate-x-2 transition-all" size={32} />
            </button>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
               <div className="p-8 border-b border-slate-50">
                  <h3 className="font-black text-slate-800 uppercase tracking-tighter">Historique de vos échanges</h3>
               </div>
               <div className="divide-y divide-slate-50">
                  {loading ? (
                    <div className="p-12 text-center text-slate-300 italic">Chargement de vos tickets...</div>
                  ) : tickets.length === 0 ? (
                    <div className="p-16 text-center">
                       <LifeBuoy size={48} className="text-slate-100 mx-auto mb-4" />
                       <p className="text-slate-400 font-medium italic">Vous n'avez aucun ticket actif.</p>
                    </div>
                  ) : (
                    tickets.map(t => (
                      <button 
                        key={t.id}
                        onClick={() => setSelectedTicket(t)}
                        className="w-full p-8 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-6">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${t.statut === 'OUVERT' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-100 text-slate-400'}`}>
                            {t.statut === 'OUVERT' ? <Clock size={24}/> : <CheckCircle2 size={24}/>}
                          </div>
                          <div>
                            <h4 className="font-black text-slate-800 text-lg leading-tight mb-1">{t.titre}</h4>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{new Date(t.creeLe).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <span className={`text-[10px] font-black px-3 py-1.5 rounded-full ${t.statut === 'OUVERT' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                             {t.statut}
                           </span>
                           <ChevronRight size={16} className="text-slate-200" />
                        </div>
                      </button>
                    ))
                  )}
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
