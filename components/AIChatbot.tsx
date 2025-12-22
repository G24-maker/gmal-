
import React, { useState, useRef, useEffect } from 'react';
import { getSmartResponse, textToSpeech } from '../services/geminiService';
import { StoreConfig } from '../types';

interface AIChatbotProps {
  storeConfig: StoreConfig;
}

const AIChatbot: React.FC<AIChatbotProps> = ({ storeConfig }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string; sources?: any[] }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const history = messages.map(m => ({ role: m.role === 'model' ? 'model' : 'user', parts: [{ text: m.text }] }));
    
    // Inject contact info into the query context for the model
    const enhancedQuery = `${userMsg} (Note for AI: The store's contact number is ${storeConfig.contactNumber})`;
    const response = await getSmartResponse(enhancedQuery, history);
    
    setMessages(prev => [...prev, { role: 'model', text: response.text, sources: response.sources }]);
    setIsTyping(false);

    const audioBytes = await textToSpeech(response.text.substring(0, 200));
    if (audioBytes) {
      // In a real browser context, we'd use the Web Audio API to play these raw bytes.
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[100] w-14 h-14 md:w-16 md:h-16 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[100] w-[90vw] max-w-[400px] h-[70vh] max-h-[600px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-100 animate-in slide-in-from-bottom-8 duration-500">
          <div className="bg-slate-900 text-white p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
            <h3 className="font-amiri text-2xl font-bold">مساعد GAMAL الذكي</h3>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Powered by Gemini 3 Pro</p>
            <button onClick={() => setIsOpen(false)} className="absolute top-6 left-6 text-slate-500 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-5 space-y-4 custom-scrollbar">
            {messages.length === 0 && (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                </div>
                <h4 className="font-bold text-slate-800 mb-2">أهلاً بك في متجر جمال</h4>
                <p className="text-sm text-slate-500 leading-relaxed">أنا مساعدك الشخصي لتنسيق الملابس واختيار أفضل القطع التي تناسب ذوقك الرفيع.</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-slate-100 text-slate-800 rounded-tr-none shadow-sm' : 'bg-amber-600 text-white rounded-tl-none shadow-md'}`}>
                  {m.text}
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/20">
                      <p className="text-[10px] font-black mb-2 uppercase opacity-80">روابط ومصادر ذات صلة:</p>
                      {m.sources.map((s: any, idx: number) => (
                        <a key={idx} href={s.web?.uri || s.maps?.uri} target="_blank" rel="noopener noreferrer" className="block text-[10px] underline truncate hover:text-slate-200 transition-colors mb-1">
                          {s.web?.title || s.maps?.title || 'زيارة الرابط'}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-end">
                <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-2xl rounded-tl-none text-xs flex items-center gap-2">
                  <span className="animate-bounce">●</span>
                  <span className="animate-bounce delay-100">●</span>
                  <span className="animate-bounce delay-200">●</span>
                  جاري التفكير
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 bg-slate-50 border-t flex gap-2">
            <input 
              value={input} 
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              placeholder="اسأل عن الموضة، الفروع، أو التنسيقات..."
              className="flex-grow bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-sm"
            />
            <button onClick={handleSend} className="bg-slate-900 text-white p-3.5 rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform rotate-180"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </button>
          </div>
        </div>
      )}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
      `}</style>
    </>
  );
};

export default AIChatbot;
