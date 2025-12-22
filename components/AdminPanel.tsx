
import React, { useState, useEffect } from 'react';
import { Product, StoreConfig } from '../types';
import { generateDescription, generateProductImage, animateProduct } from '../services/geminiService';

interface AdminPanelProps {
  products: Product[];
  categories: string[];
  storeConfig: StoreConfig;
  onAddProduct: (p: Product) => void;
  onUpdateProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
  onAddCategory: (name: string) => void;
  onDeleteCategory: (name: string) => void;
  onUpdateStoreConfig: (config: StoreConfig) => void;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  products, 
  categories, 
  storeConfig,
  onAddProduct, 
  onUpdateProduct, 
  onDeleteProduct, 
  onAddCategory, 
  onDeleteCategory, 
  onUpdateStoreConfig,
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'settings'>('inventory');
  
  // Product Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<string>(categories[0] || '');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  
  // Settings Form State
  const [config, setConfig] = useState<StoreConfig>(storeConfig);

  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [imgSize, setImgSize] = useState<"1K" | "2K" | "4K">("1K");
  
  const [newCatName, setNewCatName] = useState('');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  useEffect(() => {
    if (categories.length > 0 && !category) {
      setCategory(categories[0]);
    }
  }, [categories, category]);

  const generateSKU = (pName: string) => {
    const cleanName = pName.replace(/[^a-zA-Z\s]/g, '').trim();
    const prefix = cleanName ? cleanName.substring(0, 3).toUpperCase() : "GML";
    const timestamp = Date.now().toString().slice(-6);
    return `GML-${prefix}-${timestamp}`;
  };

  const handleAddOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !image) {
      alert('يرجى ملء الاسم والسعر ورابط الصورة على الأقل.');
      return;
    }
    
    const productData: Product = {
      id: editingId || `prod-${Date.now()}`,
      sku: editingId ? (products.find(p => p.id === editingId)?.sku || generateSKU(name)) : generateSKU(name),
      name,
      price: parseFloat(price),
      category: category || categories[0] || 'عام',
      image,
      description: description || 'وصف رائع لمنتج مميز من متجر جمال الفاخر.'
    };
    
    if (editingId) {
      onUpdateProduct(productData);
      setEditingId(null);
    } else {
      onAddProduct(productData);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setImage('');
    setDescription('');
    setEditingId(null);
  };

  const handleUpdateSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStoreConfig(config);
    alert("تم حفظ إعدادات المتجر بنجاح!");
  };

  const handleGenerateImg = async () => {
    if (!name) return alert("أدخل اسم المنتج لوصفه بالذكاء الاصطناعي");
    setIsGeneratingImg(true);
    const result = await generateProductImage(name, imgSize);
    if (result) setImage(result);
    setIsGeneratingImg(false);
  };

  const handleAnimate = async () => {
    if (!image) return alert("اختر صورة أولاً لتحريكها");
    setIsAnimating(true);
    const videoUrl = await animateProduct(image);
    if (videoUrl) window.open(videoUrl, '_blank');
    setIsAnimating(false);
  };

  const handleGenerateDescription = async () => {
    if (!name) return alert('أدخل اسم المنتج أولاً');
    setIsGeneratingDesc(true);
    const desc = await generateDescription(name, category);
    setDescription(desc);
    setIsGeneratingDesc(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleConfigImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setConfig({...config, backgroundImage: reader.result as string});
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl animate-in slide-in-from-bottom-4 duration-700">
      {productToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
            <h3 className="text-xl font-black mb-2">تأكيد الحذف</h3>
            <p className="text-slate-500 mb-8 text-sm">هل أنت متأكد من حذف "{productToDelete.name}"؟</p>
            <div className="flex gap-3">
              <button onClick={() => setProductToDelete(null)} className="flex-grow py-3 rounded-xl bg-slate-100 font-bold">إلغاء</button>
              <button onClick={() => { onDeleteProduct(productToDelete.id); setProductToDelete(null); }} className="flex-grow py-3 rounded-xl bg-red-500 text-white font-bold">حذف</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-slate-200 pb-6 gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 mb-2">لوحة التحكم</h2>
          <div className="flex gap-4 mt-4">
            <button 
              onClick={() => setActiveTab('inventory')}
              className={`pb-2 text-sm font-bold transition-all border-b-2 ${activeTab === 'inventory' ? 'border-amber-500 text-slate-900' : 'border-transparent text-slate-400'}`}
            >
              إدارة المخزون
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`pb-2 text-sm font-bold transition-all border-b-2 ${activeTab === 'settings' ? 'border-amber-500 text-slate-900' : 'border-transparent text-slate-400'}`}
            >
              تصميم وإعدادات المتجر
            </button>
          </div>
        </div>
        <button onClick={onClose} className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2">
          العودة للمتجر
        </button>
      </div>

      {activeTab === 'inventory' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-3">
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 h-fit">
              <h3 className="text-lg font-bold mb-6 border-r-4 border-amber-500 pr-3">التصنيفات</h3>
              <div className="flex flex-col gap-3 mb-6">
                <input type="text" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} placeholder="صنف جديد..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" />
                <button onClick={() => { if (newCatName.trim()) { onAddCategory(newCatName.trim()); setNewCatName(''); } }} className="bg-amber-600 text-white py-2 rounded-xl text-sm font-bold">إضافة</button>
              </div>
              <div className="space-y-1 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {categories.map(cat => (
                  <div key={cat} className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg group text-sm">
                    <span className="font-bold text-slate-600">{cat}</span>
                    <button onClick={() => onDeleteCategory(cat)} className="text-red-400 opacity-0 group-hover:opacity-100">×</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 sticky top-24">
              <h3 className="text-2xl font-black mb-8 flex items-center gap-2">
                <span className="bg-amber-500 w-2 h-8 rounded-full"></span>
                {editingId ? 'تعديل المنتج' : 'إضافة منتج'}
              </h3>
              <form onSubmit={handleAddOrUpdate} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-bold text-slate-500 mb-2">اسم المنتج</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" placeholder="قميص كلاسيك" required />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-bold text-slate-500 mb-2">الفئة</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none cursor-pointer">
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">السعر (ج.م)</label>
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" required />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold text-slate-500">صورة المنتج</label>
                    <div className="flex gap-2">
                      <select value={imgSize} onChange={(e) => setImgSize(e.target.value as any)} className="text-[10px] bg-slate-100 rounded px-2 cursor-pointer outline-none">
                        <option value="1K">1K</option>
                        <option value="2K">2K</option>
                        <option value="4K">4K</option>
                      </select>
                      <button type="button" onClick={handleGenerateImg} disabled={isGeneratingImg} className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded hover:bg-amber-100 transition-colors">
                        {isGeneratingImg ? 'جاري التوليد...' : 'توليد بالذكاء ✨'}
                      </button>
                    </div>
                  </div>
                  <input type="text" value={image} onChange={(e) => setImage(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-xs mb-3" placeholder="رابط الصورة..." />
                  <div className="flex gap-2">
                    <label className="flex-grow flex items-center justify-center h-12 border-2 border-slate-200 border-dashed rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 text-xs font-bold transition-colors">
                      رفع صورة
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                    <button type="button" onClick={handleAnimate} disabled={isAnimating} className="px-4 h-12 bg-blue-50 text-blue-600 rounded-2xl text-xs font-bold hover:bg-blue-100 transition-colors">
                      {isAnimating ? 'جاري التحريك...' : 'تحريك (Veo) 🎥'}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold text-slate-500">وصف المنتج</label>
                    <button type="button" onClick={handleGenerateDescription} disabled={isGeneratingDesc} className="text-[10px] font-bold text-amber-600 hover:underline">توليد وصف ✨</button>
                  </div>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl h-24 text-sm resize-none outline-none focus:ring-1 focus:ring-amber-500 transition-all"></textarea>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-grow bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl active:scale-95">
                    {editingId ? 'حفظ التعديلات' : 'إضافة للمتجر'}
                  </button>
                  {editingId && <button type="button" onClick={resetForm} className="px-6 bg-slate-200 rounded-2xl font-bold hover:bg-slate-300 transition-all">إلغاء</button>}
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-4 max-h-[85vh] overflow-y-auto pr-2 custom-scrollbar">
            <h3 className="text-xl font-black mb-6 border-r-4 border-slate-900 pr-3 sticky top-0 bg-gray-50/90 backdrop-blur-sm py-2 z-10">المخزون ({products.length})</h3>
            <div className="space-y-4 pb-12">
              {products.map(p => (
                <div key={p.id} className="bg-white p-4 rounded-3xl border border-slate-100 flex gap-4 group hover:shadow-lg transition-all border-r-4 border-r-transparent hover:border-r-amber-500">
                  <img src={p.image} className="w-16 h-20 object-cover rounded-xl shadow-sm" alt={p.name} />
                  <div className="flex-grow min-w-0 flex flex-col justify-center">
                    <h4 className="font-bold text-sm truncate text-slate-800">{p.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-1">{p.sku}</p>
                    <p className="text-amber-600 font-black text-xs mt-1">{p.price} ج.م</p>
                  </div>
                  <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingId(p.id); setName(p.name); setPrice(p.price.toString()); setCategory(p.category); setImage(p.image); setDescription(p.description); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100">✎</button>
                    <button onClick={() => setProductToDelete(p)} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100">×</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-8">
          {/* General Store Design */}
          <div className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-100">
            <h3 className="text-2xl font-black mb-8 flex items-center gap-2">
              <span className="bg-amber-500 w-2 h-8 rounded-full"></span>
              تصميم واجهة المتجر الأساسية
            </h3>
            <form onSubmit={handleUpdateSettings} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">رابط خلفية المتجر (Hero Background)</label>
                <div className="space-y-3">
                  <input 
                    type="text" 
                    value={config.backgroundImage} 
                    onChange={(e) => setConfig({...config, backgroundImage: e.target.value})} 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 text-xs" 
                    placeholder="https://..." 
                  />
                  <label className="flex items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-2xl cursor-pointer bg-slate-50 hover:bg-amber-50 transition-colors">
                    <div className="text-center">
                      <p className="text-xs text-slate-500 font-bold">رفع صورة خلفية جديدة</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleConfigImageUpload} />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">رقم التواصل (واتساب / هاتف)</label>
                  <input 
                    type="text" 
                    value={config.contactNumber} 
                    onChange={(e) => setConfig({...config, contactNumber: e.target.value})} 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500" 
                    placeholder="+20 ..." 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">عنوان الواجهة (Hero Title)</label>
                  <input 
                    type="text" 
                    value={config.heroTitle} 
                    onChange={(e) => setConfig({...config, heroTitle: e.target.value})} 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">النص الفرعي (Hero Subtitle)</label>
                <textarea 
                  value={config.heroSubtitle} 
                  onChange={(e) => setConfig({...config, heroSubtitle: e.target.value})} 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 h-24 resize-none" 
                />
              </div>

              <div className="border-t pt-8 mt-8">
                <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                  <span className="bg-amber-500 w-1.5 h-6 rounded-full"></span>
                  تنسيق النصوص في الواجهة
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Title Customization */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-800 text-sm border-b pb-1">تنسيق العنوان الرئيسي</h4>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2">لون العنوان</label>
                      <input 
                        type="color" 
                        value={config.heroTitleColor}
                        onChange={(e) => setConfig({...config, heroTitleColor: e.target.value})}
                        className="w-full h-10 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2">حجم الخط (بكسل): {config.heroTitleSize}px</label>
                      <input 
                        type="range" 
                        min="24" max="120" 
                        value={config.heroTitleSize}
                        onChange={(e) => setConfig({...config, heroTitleSize: parseInt(e.target.value)})}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                    </div>
                  </div>

                  {/* Subtitle Customization */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-800 text-sm border-b pb-1">تنسيق النص الفرعي</h4>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2">لون النص الفرعي</label>
                      <input 
                        type="color" 
                        value={config.heroSubtitleColor}
                        onChange={(e) => setConfig({...config, heroSubtitleColor: e.target.value})}
                        className="w-full h-10 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2">حجم الخط (بكسل): {config.heroSubtitleSize}px</label>
                      <input 
                        type="range" 
                        min="12" max="48" 
                        value={config.heroSubtitleSize}
                        onChange={(e) => setConfig({...config, heroSubtitleSize: parseInt(e.target.value)})}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                    </div>
                  </div>

                  {/* Alignment Customization */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-800 text-sm border-b pb-1">محاذاة المحتوى</h4>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2">اتجاه النص</label>
                      <div className="flex bg-slate-100 p-1 rounded-xl">
                        {(['right', 'center', 'left'] as const).map((align) => (
                          <button
                            key={align}
                            type="button"
                            onClick={() => setConfig({...config, heroAlignment: align})}
                            className={`flex-grow py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                              config.heroAlignment === align ? 'bg-white shadow-sm text-amber-600' : 'text-slate-500'
                            }`}
                          >
                            {align === 'right' ? 'يمين' : align === 'left' ? 'يسار' : 'توسيط'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-4">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">معاينة مباشرة (نصية):</p>
                      <div 
                        style={{ textAlign: config.heroAlignment }}
                        className="p-2 border border-slate-200 rounded bg-white text-xs truncate"
                      >
                        {config.heroTitle}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl active:scale-95 text-lg mt-8">
                حفظ التصميم وتحديث المتجر ✨
              </button>
            </form>
          </div>
        </div>
      )}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
};

export default AdminPanel;
