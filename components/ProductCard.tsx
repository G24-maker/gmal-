
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group border border-slate-100">
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
          <button 
            onClick={() => onAddToCart(product)}
            className="bg-white text-slate-900 p-3 rounded-full hover:bg-teal-900 hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          </button>
        </div>
        <span className="absolute top-4 right-4 bg-slate-900/80 text-white px-3 py-1 text-xs rounded backdrop-blur-sm">
          {product.category}
        </span>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-1">{product.name}</h3>
        <p className="text-slate-500 text-sm line-clamp-2 mb-4 h-10">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-amber-600 font-bold text-xl">{product.price} ج.م</span>
          <button 
            onClick={() => onAddToCart(product)}
            className="text-slate-900 font-semibold hover:text-teal-900 text-sm transition-colors"
          >
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
