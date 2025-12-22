
import React from 'react';

interface HeaderProps {
  cartCount: number;
  contactNumber: string;
  onCartClick: () => void;
  onAdminClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, contactNumber, onCartClick, onAdminClick }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
      {/* Top Bar with Contact Info */}
      <div className="bg-slate-900 text-white py-1.5 px-4 text-[10px] md:text-xs text-center font-bold tracking-wider">
        <span>للتواصل المباشر: {contactNumber}</span>
        <span className="mx-4 text-slate-600">|</span>
        <span>شحن مجاني للطلبات فوق 2000 ج.م</span>
      </div>

      <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="font-amiri text-3xl md:text-4xl font-bold tracking-widest text-slate-900 cursor-pointer hover:text-amber-600 transition-colors">
            GAMAL
          </h1>
          <nav className="hidden md:flex gap-6 text-slate-600 font-bold text-sm">
            <a href="#" className="hover:text-amber-600 transition-colors">الرئيسية</a>
            <a href="#" className="hover:text-amber-600 transition-colors">المجموعات</a>
            <a href="#" className="hover:text-amber-600 transition-colors">عن المتجر</a>
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={onAdminClick}
            className="px-3 py-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-500 text-[10px] md:text-xs font-black uppercase tracking-tighter"
            title="لوحة التحكم"
          >
            الإدارة
          </button>
          
          <button 
            onClick={onCartClick}
            className="relative p-2.5 hover:bg-slate-100 rounded-full transition-colors group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-700 group-hover:text-amber-600 transition-colors">
              <circle cx="8" cy="21" r="1"/>
              <circle cx="19" cy="21" r="1"/>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-amber-600 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full animate-pulse">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
