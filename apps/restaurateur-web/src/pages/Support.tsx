import { useState, useEffect } from 'react';
import { MessageSquare, PhoneCall, Mail, LifeBuoy, Send, Clock, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Support() {
  const { user, token } = useAuthStore();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newTicket, setNewTicket] = useState({ titre: '', message: '' });
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [reply, setReply] = useState('');

  const profilId = user?.profilId || '';

  const fetchTickets = async () => {
    if (!token || !profilId) return;
    try {
      const res = await fetch(`/api/support/tickets/${profilId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setTickets(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (profilId && token) fetchTickets();
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
        const updatedTicket = { ...selectedTicket, messages: [...selectedTicket.messages, data] };
        setSelectedTicket(updatedTicket);
      }
    } catch (err) { console.error(err); }
  };

  if (selectedTicket) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <button onClick={() => setSelectedTicket(null)} className="mb-6 text-slate-400 font-bold hover:text-slate-800 transition-colors flex items-center gap-2">
          ← Retour aux tickets
        </button>
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col h-[600px]">
          <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
            <h2 className="text-xl font-black text-slate-800">{selectedTicket.titre}</h2>
            <span className={`text-[10px] font-black px-3 py-1 rounded-full ${selectedTicket.statut === 'OUVERT' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
              {selectedTicket.statut}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-8 space-y-4">
            {selectedTicket.messages.map((m: any) => (
              <div key={m.id} className={`flex ${m.estAdmin ? 'justify-start' : 'justify-end'}`}>
                 <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium ${m.estAdmin ? 'bg-indigo-50 text-indigo-700 rounded-tl-none' : 'bg-slate-900 text-white rounded-tr-none'}`}>
                    {m.contenu}
                 </div>
              </div>
            ))}
          </div>
          {selectedTicket.statut === 'OUVERT' && (
            <div className="p-6 border-t border-slate-50 bg-slate-50/50">
              <div className="flex gap-4">
                <input 
                  type="text" 
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  placeholder="Écrivez votre message..."
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <button onClick={handleSendReply} className="bg-indigo-500 text-white p-3 rounded-xl hover:bg-indigo-600 transition-all">
                  <Send size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-10 text-center">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-6 transform -rotate-12 hover:rotate-0 transition-transform shadow-sm">
          <LifeBuoy size={32} />
        </div>
        <h1 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">Besoin d'aide ?</h1>
        <p className="text-slate-500 max-w-lg mx-auto text-lg leading-relaxed">
          Notre équipe partenaire est disponible 24/7 pour vous accompagner et résoudre vos problèmes.
        </p>
      </div>

      {!showCreate ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 text-center shadow-xl shadow-slate-200/40 hover:-translate-y-1 transition-transform group">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <PhoneCall size={28} />
              </div>
              <h3 className="font-bold text-slate-800 text-xl mb-2">Assistance VIP</h3>
              <p className="text-slate-500 mb-6 text-sm">Appel prioritaire réservé aux restaurateurs.</p>
              <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-colors">
                0800 123 456
              </button>
            </div>

            <div 
              onClick={() => setShowCreate(true)}
              className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 text-center shadow-2xl shadow-indigo-500/20 hover:-translate-y-1 transition-transform cursor-pointer relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="w-14 h-14 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare size={28} />
              </div>
              <h3 className="font-bold text-white text-xl mb-2">Chat en direct</h3>
              <p className="text-indigo-200 mb-6 text-sm line-clamp-2">Temps de réponse estimé : &lt; 2 minutes.</p>
              <button className="w-full bg-indigo-500 text-white font-bold py-3 rounded-xl hover:bg-indigo-400 transition-colors shadow-lg shadow-indigo-500/30">
                Démarrer le chat
              </button>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 text-center shadow-xl shadow-slate-200/40 hover:-translate-y-1 transition-transform group">
              <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Mail size={28} />
              </div>
              <h3 className="font-bold text-slate-800 text-xl mb-2">Email Support</h3>
              <p className="text-slate-500 mb-6 text-sm">Pour les litiges ou des questions non urgentes.</p>
              <button className="w-full bg-slate-50 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-100 transition-colors">
                Écrire un message
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <h3 className="font-bold text-slate-800">Vos tickets de support</h3>
              <button onClick={() => setShowCreate(true)} className="text-xs font-black text-indigo-600 uppercase tracking-widest">Nouveau ticket</button>
            </div>
            <div className="divide-y divide-slate-50">
              {loading ? (
                <div className="p-10 text-center text-slate-400 italic">Chargement...</div>
              ) : (
                tickets.map(t => (
                  <button 
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.statut === 'OUVERT' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-100 text-slate-400'}`}>
                        {t.statut === 'OUVERT' ? <Clock size={20} /> : <CheckCircle2 size={20} />}
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-slate-800">{t.titre}</h4>
                        <p className="text-xs text-slate-400">{new Date(t.creeLe).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <ArrowUpRight className="text-slate-200" size={20} />
                  </button>
                ))
              )}
              {tickets.length === 0 && !loading && (
                <div className="p-10 text-center text-slate-400 font-medium italic">Vous n'avez pas encore de ticket ouvert.</div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-10 max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-slate-800 mb-6">Ouvrir un ticket</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Sujet de votre demande</label>
              <input 
                type="text" 
                value={newTicket.titre}
                onChange={e => setNewTicket({...newTicket, titre: e.target.value})}
                placeholder="Ex: Problème avec ma tablette"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Message</label>
              <textarea 
                rows={4}
                value={newTicket.message}
                onChange={e => setNewTicket({...newTicket, message: e.target.value})}
                placeholder="Décrivez votre problème en quelques mots..."
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowCreate(false)}
                className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all"
              >
                Annuler
              </button>
              <button 
                onClick={handleCreateTicket}
                className="flex-1 py-4 bg-indigo-500 text-white rounded-2xl font-black text-sm hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20"
              >
                Envoyer le ticket
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-amber-50 rounded-[2rem] p-8 mt-12 border border-amber-100/50 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div>
          <h4 className="font-bold text-amber-900 text-xl mb-2">Centre d'aide en ligne</h4>
          <p className="text-amber-700 font-medium text-sm">Consultez nos tutoriels vidéo sur la gestion de votre tablette EcoEats et les bonnes pratiques pour augmenter vos ventes.</p>
        </div>
        <button className="bg-amber-500 text-white px-8 py-4 rounded-xl font-bold whitespace-nowrap shadow-lg shadow-amber-200 hover:bg-amber-400 transition-colors">
          Parcourir les guides
        </button>
      </div>
    </div>
  );
}

function ArrowUpRight({ className, size }: { className?: string, size?: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M7 17L17 7M17 7H7M17 7V17" />
    </svg>
  );
}
