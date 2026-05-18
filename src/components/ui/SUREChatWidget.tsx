"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Lock, Send, X, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function SUREChatWidget() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: language === 'es' 
        ? 'Hola. Soy el agente de soporte de SURE. ¿En qué te puedo ayudar hoy sobre tu infraestructura DNS o due diligence B2B?'
        : 'Hello. I am the SURE support agent. How can I help you today regarding your DNS infrastructure or B2B due diligence?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });
      
      const data = await res.json();
      if (data.message) {
        setMessages([...newMessages, { role: 'assistant', content: data.message }]);
      } else {
        setMessages([...newMessages, { role: 'assistant', content: language === 'es' ? 'Hubo un error de conexión.' : 'Connection error.' }]);
      }
    } catch (error) {
      setMessages([...newMessages, { role: 'assistant', content: language === 'es' ? 'Hubo un error al procesar tu mensaje.' : 'Error processing your message.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-open-sans">
      {isOpen ? (
        <div className="bg-[#1e293b] border border-emerald-500/30 rounded-2xl shadow-2xl w-[350px] h-[500px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-emerald-500 text-black font-bold p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5" /> 
              <span>{language === 'es' ? 'SURE Concierge' : 'SURE Concierge'}</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-emerald-600 p-1 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-black/50 text-sm flex flex-col gap-3">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`max-w-[85%] p-3 rounded-xl ${
                  msg.role === 'assistant' 
                    ? 'bg-[#0f172a] border border-slate-700 text-slate-300 rounded-tl-none self-start' 
                    : 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-100 rounded-tr-none self-end'
                }`}
              >
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div className="bg-[#0f172a] border border-slate-700 p-3 rounded-xl rounded-tl-none self-start flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                <span className="text-slate-400 text-xs">Pensando...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-slate-700 bg-[#1e293b] flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={language === 'es' ? "Escribe tu mensaje..." : "Type your message..."} 
              className="flex-1 bg-black/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-emerald-500" 
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 text-black p-2 rounded-lg transition-colors flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-emerald-500 hover:bg-emerald-400 text-black rounded-full shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center justify-center transition-transform hover:scale-110 relative group"
        >
          <MessageSquare className="w-8 h-8" />
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-black/80 text-white text-sm font-bold py-2 px-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-emerald-500/30 pointer-events-none">
            {language === 'es' ? '¿Dudas? Chatea con nosotros' : 'Questions? Chat with us'}
          </div>
        </button>
      )}
    </div>
  );
}
