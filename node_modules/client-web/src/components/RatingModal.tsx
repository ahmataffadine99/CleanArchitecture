import { useState } from 'react';
import { Star, X, Send, Loader2 } from 'lucide-react';

type RatingModalProps = {
  commandeId: string;
  restaurantNom: string;
  token: string;
  onClose: () => void;
  onSuccess: () => void;
};

export default function RatingModal({ commandeId, restaurantNom, token, onClose, onSuccess }: RatingModalProps) {
  const [note, setNote] = useState(5);
  const [commentaire, setCommentaire] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/commandes/${commandeId}/avis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ note, commentaire })
      });

      if (res.ok) {
        onSuccess();
      } else {
        const err = await res.json();
        alert(`Erreur: ${err.error || 'Impossible de soumettre la note'}`);
      }
    } catch (e) {
      console.error(e);
      alert("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-2xl font-black text-slate-900">Notez votre livraison</h3>
            <p className="text-slate-500 font-medium text-sm">Commande de {restaurantNom}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-all"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="flex flex-col items-center gap-4">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Votre note</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setNote(s)}
                  className="transition-transform active:scale-90"
                >
                  <Star 
                    size={40} 
                    className={`${s <= note ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} transition-colors duration-200`} 
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Commentaire (optionnel)</label>
            <textarea
              rows={3}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-amber-400 focus:bg-white rounded-2xl px-5 py-4 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 resize-none"
              placeholder="Comment s'est passée la livraison ?"
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white font-black py-5 rounded-[1.5rem] hover:bg-black shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
            ENVOYER LA NOTE
          </button>
        </form>
      </div>
    </div>
  );
}
