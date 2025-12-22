
import React, { useState, useEffect } from 'react';
import { Product, CartItem, StoreConfig, DEFAULT_CATEGORIES, DEFAULT_STORE_CONFIG } from './types';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import AdminPanel from './components/AdminPanel';
import Cart from './components/Cart';
import AIChatbot from './components/AIChatbot';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    sku: 'GML-CL-001',
    name: 'بدلة كلاسيكية سوداء',
    price: 1200,
    category: 'بدل',
    image: 'https://images.unsplash.com/photo-1594932224827-c447e9c11823?q=80&w=800&auto=format&fit=crop',
    description: 'بدلة صوفية فاخرة تناسب الاجتماعات الرسمية والمناسبات الخاصة.'
  },
  {
    id: '2',
    sku: 'GML-SH-002',
    name: 'قميص أبيض قطني',
    price: 350,
    category: 'قمصان',
    image: 'https://images.unsplash.com/photo-1620012253295-c05718565d6d?q=80&w=800&auto=format&fit=crop',
    description: 'قميص مريح مصنوع من أجود أنواع القطن المصري.'
  },
  {
    id: '3',
    sku: 'GML-FO-003',
    name: 'حذاء جلدي بني',
    price: 550,
    category: 'أحذية',
    image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop',
    description: 'حذاء كلاسيكي يجمع بين الراحة والأناقة.'
  }
];

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('gamal_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('gamal_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [storeConfig, setStoreConfig] = useState<StoreConfig>(() => {
    const saved = localStorage.getItem('gamal_config');
    return saved ? JSON.parse(saved) : DEFAULT_STORE_CONFIG;
  });
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');

  useEffect(() => {
    localStorage.setItem('gamal_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('gamal_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('gamal_config', JSON.stringify(storeConfig));
  }, [storeConfig]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateCartQuantity = (id: string, q: number) => {
    if (q < 1) return removeFromCart(id);
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: q } : item));
  };

  const addProduct = (p: Product) => {
    setProducts(prev => [p, ...prev]);
  };

  const updateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addCategory = (name: string) => {
    if (!categories.includes(name)) {
      setCategories(prev => [...prev, name]);
    }
  };

  const deleteCategory = (name: string) => {
    setCategories(prev => prev.filter(c => c !== name));
    if (selectedCategory === name) setSelectedCategory('الكل');
  };

  const filteredProducts = selectedCategory === 'الكل' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} 
        contactNumber={storeConfig.contactNumber}
        onCartClick={() => setIsCartOpen(true)}
        onAdminClick={() => setIsAdminOpen(!isAdminOpen)}
      />
      
      <main className="flex-grow">
        {!isAdminOpen ? (
          <>
            <Hero config={storeConfig} />
            <div className="container mx-auto px-4 py-8">
              <div className="flex flex-wrap gap-4 mb-12 justify-center">
                {['الكل', ...categories].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-8 py-2.5 rounded-full transition-all duration-300 font-bold text-sm ${
                      selectedCategory === cat 
                        ? 'bg-slate-900 text-white shadow-xl scale-105' 
                        : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-100 shadow-sm'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <ProductGrid 
                products={filteredProducts} 
                onAddToCart={addToCart} 
              />
            </div>
          </>
        ) : (
          <AdminPanel 
            products={products} 
            categories={categories}
            storeConfig={storeConfig}
            onAddProduct={addProduct} 
            onUpdateProduct={updateProduct}
            onDeleteProduct={deleteProduct}
            onAddCategory={addCategory}
            onDeleteCategory={deleteCategory}
            onUpdateStoreConfig={setStoreConfig}
            onClose={() => setIsAdminOpen(false)}
          />
        )}
      </main>

      <footer className="bg-slate-900 text-white py-16 mt-12 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 border-b border-slate-800 pb-12">
            <div className="text-center md:text-right">
              <h2 className="font-amiri text-5xl mb-4 tracking-widest">GAMAL</h2>
              <p className="text-slate-400 text-sm">الأناقة تبدأ بلمسة جمال. نصمم للرجل الذي لا يقبل بأقل من الكمال.</p>
            </div>
            <div className="text-center">
              <h3 className="text-amber-500 font-bold mb-4">تواصل معنا</h3>
              <p className="text-2xl font-black text-white dir-ltr">{storeConfig.contactNumber}</p>
              <p className="text-slate-500 text-xs mt-2">متاحون لخدمتكم على مدار الساعة</p>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-amber-500 font-bold mb-4">تابعنا</h3>
              <div className="flex justify-center md:justify-start gap-6 text-xl">
                <a href="#" className="hover:text-amber-500 transition-colors">Instagram</a>
                <a href="#" className="hover:text-amber-500 transition-colors">Facebook</a>
                <a href="#" className="hover:text-amber-500 transition-colors">TikTok</a>
              </div>
            </div>
          </div>
          <p className="text-slate-600 text-[10px] text-center uppercase tracking-widest">© 2024 GAMAL LUXURY FASHION HOUSE. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>

      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart}
        onUpdateQuantity={updateCartQuantity}
        onRemove={removeFromCart}
      />

      <AIChatbot storeConfig={storeConfig} />
    </div>
  );
};

export default App;
