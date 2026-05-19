"use client";

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MessageSquare, X, Send, MinusCircle, Paperclip, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabaseClient';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  imageBase64?: string;
}

export default function AIWidget() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Set initial localized message on mount or when pathname changes
  useEffect(() => {
    const fetchUser = async () => {
      let fetchedName = '';
      try {
        const { data } = await supabase.auth.getSession();
        const user = data.session?.user;
        if (user && user.user_metadata?.name) {
          fetchedName = user.user_metadata.name.split(' ')[0];
          setUserName(fetchedName);
        }
      } catch (err) {
        console.error(err);
      }

      const translatedGreeting = fetchedName ? `${t('support.initial_msg').split('!')[0]} ${fetchedName}! ` : '';
      const baseMsg = t('support.initial_msg').split('!').slice(1).join('!').trim();
      let initialMessage = translatedGreeting + (baseMsg || t('support.initial_msg'));

      // Keep chat history unless it's empty, in which case initialize
      if (messages.length === 0) {
        setMessages([{ role: 'assistant', content: initialMessage }]);
      }
    };
    
    fetchUser();
  }, [t, pathname, messages.length]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            setAttachedImage(event.target?.result as string);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !attachedImage) || isLoading) return;

    const newMsg: Message = { role: 'user', content: input, imageBase64: attachedImage || undefined };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setAttachedImage(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/support-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, newMsg],
          contextPath: pathname
        })
      });
      const data = await response.json();
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.reply || data.error || 'Connection error.' 
      }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'I am currently offline. Please contact support.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 h-14 bg-emerald-500 hover:bg-emerald-400 text-black rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center px-5 gap-3 transition-all duration-300 z-50 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
      >
        <MessageSquare className="w-6 h-6 shrink-0" />
        <span className="font-bold text-sm pr-1 truncate max-w-[250px]">
          {userName ? `Hola ${userName}, ` : 'Hola, '}¿tienes alguna duda?
        </span>
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-6 w-[380px] h-[550px] max-h-[80vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 z-50 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-white font-bold text-sm">{t('support') ? t('support.title') : 'SURE Support'}</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
            <MinusCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-grow p-4 overflow-y-auto flex flex-col gap-3">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                msg.role === 'user' 
                  ? 'bg-emerald-500 text-black rounded-br-none' 
                  : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
              }`}>
                {msg.imageBase64 && (
                  <div className="mb-2 rounded-lg overflow-hidden border border-emerald-400/30">
                    <img src={msg.imageBase64} alt="Attached" className="max-w-[200px] max-h-[200px] object-cover" />
                  </div>
                )}
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] p-3 rounded-2xl bg-slate-800 border border-slate-700 text-slate-400 text-xs flex gap-1 items-center">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-slate-800 border-t border-slate-700 rounded-b-2xl flex flex-col gap-2 relative">
          
          {/* Image Preview */}
          {attachedImage && (
            <div className="relative inline-block self-start mb-1 bg-slate-900 border border-slate-700 rounded-lg p-1">
              <img src={attachedImage} alt="Preview" className="h-16 w-auto object-contain rounded" />
              <button 
                onClick={() => setAttachedImage(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-400"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          <div className="flex gap-2 items-end">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-10 h-10 bg-slate-700 text-slate-300 rounded-xl flex items-center justify-center hover:bg-slate-600 transition-colors shrink-0"
              title="Attach Image"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              onPaste={handlePaste}
              placeholder={attachedImage ? "Add comment..." : t('support.placeholder')}
              className="flex-grow bg-slate-900 border border-slate-700 rounded-xl px-3 h-10 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <button 
              onClick={handleSend}
              disabled={(!input.trim() && !attachedImage) || isLoading}
              className="w-10 h-10 bg-emerald-500 text-black rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-400 transition-colors shrink-0"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
