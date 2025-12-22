
import React from 'react';
import { StoreConfig } from '../types';

interface HeroProps {
  config: StoreConfig;
}

const Hero: React.FC<HeroProps> = ({ config }) => {
  return (
    <section className="relative h-[65vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image managed by Admin Settings */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{ 
          backgroundImage: `url("${config.backgroundImage}")`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent"></div>
      </div>
      
      <div 
        className="relative z-10 w-full px-4 max-w-6xl animate-in fade-in zoom-in duration-1000"
        style={{ 
          textAlign: config.heroAlignment,
        }}
      >
        <h2 
          className="font-amiri mb-6 drop-shadow-2xl font-bold tracking-tight leading-tight"
          style={{ 
            color: config.heroTitleColor,
            fontSize: `${config.heroTitleSize}px`,
          }}
        >
          {config.heroTitle}
        </h2>
        <p 
          className="mb-10 font-medium tracking-wide max-w-3xl drop-shadow-lg opacity-90 leading-relaxed"
          style={{ 
            color: config.heroSubtitleColor,
            fontSize: `${config.heroSubtitleSize}px`,
            marginRight: config.heroAlignment === 'right' ? '0' : config.heroAlignment === 'center' ? 'auto' : 'auto',
            marginLeft: config.heroAlignment === 'left' ? '0' : config.heroAlignment === 'center' ? 'auto' : 'auto',
          }}
        >
          {config.heroSubtitle}
        </p>
        <div className={`flex flex-col sm:flex-row gap-4 ${
          config.heroAlignment === 'center' ? 'justify-center' : 
          config.heroAlignment === 'left' ? 'justify-start' : 'justify-end'
        }`}>
          <button className="bg-amber-600 hover:bg-amber-700 text-white px-12 py-4 rounded-full text-lg font-black transition-all transform hover:scale-105 shadow-2xl active:scale-95">
            تصفح المجموعة
          </button>
          <button className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/30 px-12 py-4 rounded-full text-lg font-black transition-all">
            عن جمال
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 13 5 5 5-5"/><path d="m7 6 5 5 5-5"/></svg>
      </div>
    </section>
  );
};

export default Hero;
