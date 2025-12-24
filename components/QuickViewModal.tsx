
import React from 'react';
import { Product } from '../types';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose, onAddToCart }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors text-slate-900"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>

        <div className="md:w-1/2 aspect-[3/4] md:aspect-auto">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center text-right">
          <div className="mb-6">
            <span className="bg-amber-50 text-amber-600 font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border border-amber-100 mb-4 inline-block">
              {product.category}
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">{product.name}</h2>
            <div className="flex items-center justify-end gap-2 mb-6">
              <span className="text-3xl font-black text-amber-600">{product.price}</span>
              <span className="text-lg font-bold text-slate-400">ج.م</span>
            </div>
            <p className="text-slate-600 leading-relaxed mb-8 text-lg">
              {product.description}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button 
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-amber-600 transition-all shadow-xl shadow-slate-200 active:scale-95 flex items-center justify-center gap-2"
              >
                إضافة للحقيبة
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              </button>
            </div>
            <p className="text-slate-400 text-xs font-mono">SKU: {product.sku}</p>
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 justify-end">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-900">شحن سريع</p>
                <p className="text-[10px] text-slate-400">توصيل خلال 48 ساعة</p>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl text-amber-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-end">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-900">خامة فاخرة</p>
                <p className="text-[10px] text-slate-400">قطن 100%</p>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl text-amber-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
