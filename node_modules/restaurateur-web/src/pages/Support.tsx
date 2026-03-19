import { MessageSquare, PhoneCall, Mail, LifeBuoy } from 'lucide-react';

export default function Support() {
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 text-center shadow-xl shadow-slate-200/40 hover:-translate-y-1 transition-transform cursor-pointer group">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
            <PhoneCall size={28} />
          </div>
          <h3 className="font-bold text-slate-800 text-xl mb-2">Assistance VIP</h3>
          <p className="text-slate-500 mb-6 text-sm">Appel prioritaire réservé aux restaurateurs.</p>
          <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-colors">
            0800 123 456
          </button>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 text-center shadow-2xl shadow-indigo-500/20 hover:-translate-y-1 transition-transform cursor-pointer relative overflow-hidden group">
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

        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 text-center shadow-xl shadow-slate-200/40 hover:-translate-y-1 transition-transform cursor-pointer group">
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
      
      <div className="bg-amber-50 rounded-[2rem] p-8 mt-12 border border-amber-100/50 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div>
          <h4 className="font-bold text-amber-900 text-xl mb-2">Centre d'aide en ligne</h4>
          <p className="text-amber-700 font-medium">Consultez nos tutoriels vidéo sur la gestion de votre tablette EcoEats et les bonnes pratiques pour augmenter vos ventes.</p>
        </div>
        <button className="bg-amber-500 text-white px-8 py-4 rounded-xl font-bold whitespace-nowrap shadow-lg shadow-amber-200 hover:bg-amber-400 transition-colors">
          Parcourir les guides
        </button>
      </div>
    </div>
  );
}
