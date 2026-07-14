"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { authedFetch } from '@/lib/apiClient';
import { ShieldCheck, Plus, Trash2, Key, Calendar, Mail, Loader2, Target } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function VIPHubPage() {
  const [tokens, setTokens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/login');
        return;
      }
      fetchTokens();
    };
    checkSession();
  }, [router]);

  const fetchTokens = async () => {
    try {
      const { data, error } = await supabase
        .from('vip_tokens')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        // Fallback si la tabla no existe aún (para evitar crash antes de ejecutar el SQL)
        console.error("Error fetching tokens:", error);
      } else {
        setTokens(data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const generateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;
    
    setIsGenerating(true);
    const safeName = newCompanyName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const token = `${safeName}_VIP_${randomSuffix}`;

    try {
      const res = await authedFetch('/api/vip-tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, company_name: newCompanyName })
      });
      
      if (!res.ok) throw new Error("Error en API");
      
      setNewCompanyName('');
      fetchTokens();
    } catch (error) {
      console.error("Error generating token:", error);
      alert("Error al generar el cupón. Asegúrate de haber ejecutado el script SQL en Supabase.");
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteToken = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este cupón?")) return;
    try {
      await authedFetch('/api/vip-tokens', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      fetchTokens();
    } catch (error) {
      console.error("Error deleting token", error);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#050a14] flex items-center justify-center text-emerald-500 font-mono"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#050a14] text-white font-sans flex flex-col p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[rgba(16,185,129,0.02)] to-transparent pointer-events-none" />
      
      <div className="max-w-7xl lg:max-w-[1440px] w-full mx-auto z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Image src="/logo-sure.png" alt="SURE Logo" width={50} height={50} className="object-contain hover:scale-105 transition-transform" />
            </Link>
            <div>
              <h1 className="text-3xl font-black text-white font-montserrat tracking-widest uppercase flex items-center gap-3">
                <ShieldCheck className="text-emerald-500 w-8 h-8" />
                VIP Access Hub
              </h1>
              <p className="text-slate-400 font-mono text-sm">Control centralizado de invitaciones Free Trial</p>
            </div>
          </div>
          <Link href="/admin" className="px-6 py-2 border border-white/10 rounded-full hover:bg-white/5 transition-colors text-sm font-bold uppercase tracking-wider text-slate-300">
            Volver al Master Hub
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Panel Izquierdo: Generar Cupón */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass p-6 rounded-3xl border border-white/10 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
               <h2 className="text-xl font-bold font-montserrat mb-4 flex items-center gap-2">
                 <Plus className="text-emerald-500 w-5 h-5" />
                 Generar Cupón
               </h2>
               <form onSubmit={generateToken} className="space-y-4 relative z-10">
                 <div>
                   <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Nombre de la Empresa o Contacto</label>
                   <input 
                     type="text" 
                     value={newCompanyName}
                     onChange={(e) => setNewCompanyName(e.target.value)}
                     placeholder="Ej. Shell, BP, Repsol..."
                     className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                     required
                   />
                 </div>
                 <button 
                   type="submit"
                   disabled={isGenerating || !newCompanyName}
                   className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                 >
                   {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Key className="w-5 h-5" />}
                   Crear VIP Token
                 </button>
               </form>
            </div>
            
            <div className="glass p-6 rounded-3xl border border-white/10 bg-slate-900/50">
               <h3 className="font-bold text-emerald-400 mb-2 text-sm uppercase">¿Cómo funciona?</h3>
               <p className="text-xs text-slate-400 leading-relaxed">
                 1. Genera un cupón escribiendo el nombre del cliente.<br/><br/>
                 2. Cópialo y envíaselo por LinkedIn o correo junto con el PDF.<br/><br/>
                 3. Cuando el cliente entre a <b>/intake</b> e introduzca este cupón, el sistema lo marcará como "Usado" y registrará su correo aquí.
               </p>
            </div>
          </div>

          {/* Panel Derecho: Lista de Cupones */}
          <div className="lg:col-span-3">
            <div className="glass rounded-3xl border border-white/10 overflow-hidden">
               <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/20">
                 <h2 className="text-xl font-bold font-montserrat">Registro de Cupones</h2>
                 <span className="text-xs font-mono text-emerald-500 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">Total: {tokens.length}</span>
               </div>
               
               <div className="p-0 overflow-x-auto">
                 <table className="w-full text-left text-sm text-slate-300">
                   <thead className="text-xs text-slate-500 uppercase bg-black/40">
                     <tr>
                       <th className="px-6 py-4">Cupón / Token</th>
                       <th className="px-6 py-4">Empresa Asignada</th>
                       <th className="px-6 py-4">Estado</th>
                       <th className="px-6 py-4">Correo (Lead)</th>
                       <th className="px-6 py-4 text-right">Acción</th>
                     </tr>
                   </thead>
                   <tbody>
                     {tokens.length === 0 ? (
                       <tr>
                         <td colSpan={5} className="px-6 py-8 text-center text-slate-500 font-mono">
                           No hay cupones generados todavía.
                         </td>
                       </tr>
                     ) : (
                       tokens.map((t) => (
                         <tr key={t.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                           <td className="px-6 py-4 font-mono font-bold text-emerald-400 flex items-center gap-2">
                             <Key className="w-4 h-4" />
                             {t.token}
                           </td>
                           <td className="px-6 py-4 font-bold">{t.company_name}</td>
                           <td className="px-6 py-4">
                             {t.is_used ? (
                               <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20 rounded-full">Usado</span>
                             ) : (
                               <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">Disponible</span>
                             )}
                           </td>
                           <td className="px-6 py-4">
                             {t.used_by_email ? (
                               <div className="flex items-center gap-2 text-xs">
                                 <Mail className="w-3 h-3 text-slate-500" />
                                 {t.used_by_email}
                               </div>
                             ) : (
                               <span className="text-slate-600 text-xs">-</span>
                             )}
                           </td>
                           <td className="px-6 py-4 text-right">
                             {!t.is_used && (
                               <button onClick={() => deleteToken(t.id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                                 <Trash2 className="w-4 h-4" />
                               </button>
                             )}
                           </td>
                         </tr>
                       ))
                     )}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
