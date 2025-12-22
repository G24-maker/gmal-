
import React from 'react';
import { CartItem } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, q: number) => void;
  onRemove: (id: string) => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, items, onUpdateQuantity, onRemove }) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className={`fixed top-0 left-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-2xl font-bold">سلة التسوق</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <svg className="mx-auto mb-4 opacity-20" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                <p>السلة فارغة حالياً</p>
              </div>
            ) : (
              items.map(item => (
                <div key={item.id} className="flex gap-4 group">
                  <img src={item.image} className="w-20 h-24 object-cover rounded-md flex-shrink-0" alt={item.name} />
                  <div className="flex-grow">
                    <h3 className="font-bold text-slate-900">{item.name}</h3>
                    <p className="text-amber-600 font-semibold mb-2">{item.price} ج.م</p>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded border flex items-center justify-center hover:bg-slate-50"
                      >-</button>
                      <span className="font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded border flex items-center justify-center hover:bg-slate-50"
                      >+</button>
                    </div>
                  </div>
                  <button 
                    onClick={() => onRemove(item.id)}
                    className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="p-6 border-t bg-slate-50">
            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-600 font-medium">إجمالي السعر:</span>
              <span className="text-2xl font-bold text-slate-900">{total} ج.م</span>
            </div>
            <button 
              disabled={items.length === 0}
              className="w-full bg-amber-600 text-white py-4 rounded-lg font-bold hover:bg-amber-700 transition-all shadow-lg disabled:bg-slate-300 disabled:shadow-none"
            >
              إتمام الطلب
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
