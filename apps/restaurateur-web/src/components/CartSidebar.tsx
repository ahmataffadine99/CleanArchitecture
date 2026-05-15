import { useCartStore } from '../store/cartStore';
import { useNavigate } from 'react-router-dom';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

export default function CartSidebar() {
  const navigate = useNavigate();
  const { items, isOpen, toggleCart, removeItem, addItem, clearCart, total } = useCartStore();

  if (!isOpen) return null;

  const totalItems = items.reduce((acc, item) => acc + item.quantite, 0);

  return (
    <>
      <div 
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50 transition-opacity"
        onClick={toggleCart}
      />
      
      <div className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 flex flex-col animate-slide-up sm:animate-none">
        
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2 text-slate-800">
            <ShoppingBag size={22} className="text-emerald-500" />
            <h2 className="text-xl font-bold">Votre Panier</h2>
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-sm font-semibold ml-2">
              {totalItems}
            </span>
          </div>
          <button 
            onClick={toggleCart}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                 <ShoppingBag size={40} className="text-slate-300" />
              </div>
              <p className="text-lg font-medium text-slate-500">Votre panier est vide</p>
              <p className="text-sm text-center">Ajoutez d'incroyables plats éthiques depuis nos restaurants partenaires !</p>
              <button 
                onClick={toggleCart}
                className="mt-6 px-6 py-2.5 bg-emerald-50 text-emerald-600 font-semibold rounded-full hover:bg-emerald-100 transition-colors"
              >
                Explorer les menus
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-500">Articles</span>
                <button 
                  onClick={clearCart}
                  className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
                >
                  <Trash2 size={14} /> Vider
                </button>
              </div>
              
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 line-clamp-1">{item.nom}</h4>
                      <div className="text-emerald-600 font-semibold text-sm mt-1">
                        {(item.prix * item.quantite).toFixed(2)} €
                      </div>
                    </div>
                    
                    
                    <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-full px-2 py-1 shadow-sm h-fit">
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-slate-400 hover:text-emerald-600 transition-colors"
                      >
                        {item.quantite === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                      </button>
                      <span className="font-semibold text-slate-700 w-4 text-center text-sm">{item.quantite}</span>
                      <button 
                        onClick={() => addItem(item, useCartStore.getState().restaurantId!)}
                        className="p-1 text-slate-400 hover:text-emerald-600 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        
        {items.length > 0 && (
          <div className="p-5 bg-white border-t border-slate-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-4 text-slate-600">
              <span className="text-sm font-medium">Sous-total</span>
              <span className="font-bold text-slate-800">{total().toFixed(2)} €</span>
            </div>
            <button 
              onClick={() => {
                toggleCart();
                navigate('/checkout');
              }}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-emerald-500/25 transition-all flex justify-between px-6 items-center group cursor-pointer"
            >
              <span>Commander</span>
              <div className="flex items-center gap-2">
                <span>{total().toFixed(2)} €</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
