
import React, { useState } from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (p: Product) => void;
  onQuickView?: (p: Product) => void;
}

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc';

const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart, onQuickView }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('default');

  const filteredAndSortedProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'price-asc') {
        return a.price - b.price;
      } else if (sortBy === 'price-desc') {
        return b.price - a.price;
      } else if (sortBy === 'name-asc') {
        return a.name.localeCompare(b.name, 'ar');
      }
      return 0; // default (initial order)
    });

  return (
    <div id="product-grid" className="space-y-8 scroll-mt-24">
      {/* Search and Sort Section */}
      <div className="flex flex-col md:flex-row gap-4 items-center max-w-4xl mx-auto mb-12">
        {/* Search Input */}
        <div className="relative flex-grow w-full">
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-slate-400"
            >
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
          </div>
          <input
            type="text"
            placeholder="ابحث عن ملابسك المفضلة هنا..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-12 pl-6 py-4 rounded-2xl bg-white border border-slate-200 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-300 text-slate-800 placeholder-slate-400"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative w-full md:w-56">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="w-full appearance-none bg-white border border-slate-200 rounded-2xl px-6 py-4 text-slate-700 font-bold text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none shadow-sm cursor-pointer transition-all pr-10 md:pr-6 pl-10"
          >
            <option value="default">الترتيب الافتراضي</option>
            <option value="price-asc">السعر: من الأقل للأعلى</option>
            <option value="price-desc">السعر: من الأعلى للأقل</option>
            <option value="name-asc">الاسم: أ - ي</option>
          </select>
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </div>
        </div>
      </div>

      {filteredAndSortedProducts.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
          <div className="mb-4 flex justify-center text-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">عذراً، لم نجد ما تبحث عنه</h3>
          <p className="text-slate-500">جرب البحث بكلمات أخرى أو تصفح الأقسام المختلفة.</p>
          <button 
            onClick={() => { setSearchTerm(''); setSortBy('default'); }}
            className="mt-6 text-amber-600 font-bold hover:underline"
          >
            مسح جميع المرشحات
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredAndSortedProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart} 
              onQuickView={onQuickView}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
