
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onQuickView?: (p: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onQuickView }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 group border border-slate-100 flex flex-col h-full">
      <div className="relative aspect-[3/4] overflow-hidden cursor-pointer">
        {/* Enhanced Hover Effect: Zoom + Subtle Pan + Rotation */}
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-[1.5s] ease-in-out group-hover:scale-110 group-hover:-translate-y-2 group-hover:rotate-1"
        />
        
        {/* Soft overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4">
          <button 
            onClick={() => onQuickView?.(product)}
            className="bg-white text-slate-900 p-4 rounded-full hover:bg-amber-600 hover:text-white transition-all transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-500 shadow-2xl"
            aria-label="عرض سريع"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
          
          <button 
            onClick={() => onAddToCart(product)}
            className="bg-white text-slate-900 p-4 rounded-full hover:bg-amber-600 hover:text-white transition-all transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-500 shadow-2xl"
            aria-label="إضافة إلى السلة"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          </button>
        </div>
        
        <span className="absolute top-4 right-4 bg-white/95 text-slate-900 font-black px-3 py-1.5 text-[10px] uppercase tracking-widest rounded-xl backdrop-blur-md shadow-lg border border-white/20">
          {product.category}
        </span>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 
          className="text-lg font-black text-slate-900 mb-1 group-hover:text-amber-600 transition-colors duration-300 cursor-pointer"
          onClick={() => onQuickView?.(product)}
        >
          {product.name}
        </h3>
        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-4 h-10 opacity-80">
          {product.description}
        </p>
        <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-4">
          <div className="flex flex-col">
            <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-0.5">السعر الحصري</span>
            <span className="text-amber-600 font-black text-xl">{product.price} <span className="text-xs">ج.م</span></span>
          </div>
          <button 
            onClick={() => onAddToCart(product)}
            className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-amber-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
          >
            أضف للحقيبة
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
