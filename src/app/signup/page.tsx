"use client";
import { useState } from 'react';
import { ShieldCheck, Mail, Lock, Building, User, ArrowRight, ArrowLeft, RefreshCw, Copy, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  
  // UI State
  const [entityType, setEntityType] = useState<'COMPANY' | 'NATURAL'>('COMPANY');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [pvm, setPvm] = useState('');
  const [country, setCountry] = useState('');

  // Password Gen State
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let pwd = "";
    for (let i = 0; i < 16; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pwd);
  };

  const copyPassword = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          entityType,
          fullName,
          companyName,
          taxId,
          pvm,
          country
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al registrar la cuenta');
      }

      setSuccess(true);
      // Opcional: auto-login y redirigir
      setTimeout(() => {
        router.push('/login');
      }, 3000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[var(--color-sure-bg)] flex items-center justify-center p-4">
        <div className="glass p-10 rounded-2xl text-center max-w-md w-full border-t-4 border-green-500">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">¡Registro Exitoso!</h2>
          <p className="text-[var(--color-sure-subtext)] mb-6">Tu cuenta y perfil de facturación han sido creados correctamente.</p>
          <p className="text-sm text-gray-400">Redirigiendo al portal de acceso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-sure-bg)] text-[var(--color-sure-text)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-[rgba(0,229,255,0.05)] to-transparent pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-xl z-10">
        <div className="flex justify-center flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-[var(--color-sure-accent)]/20 flex flex-col items-center justify-center text-[var(--color-sure-accent)] border border-[var(--color-sure-accent)]/30 mb-4 shadow-[0_0_20px_rgba(0,229,255,0.2)]">
               <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-center text-3xl font-extrabold text-white tracking-tight font-montserrat">
            Crear Cuenta SURE
            </h2>
            <p className="mt-2 text-center text-sm text-[var(--color-sure-subtext)] uppercase tracking-widest font-bold">
            Portal de Inteligencia Forense
            </p>
        </div>

        <div className="glass py-8 px-6 sm:px-10 rounded-2xl shadow-2xl border-t-4 border-[var(--color-sure-accent)] relative">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Tipo de Entidad */}
            <div>
              <label className="block text-sm font-bold text-white mb-3 text-center">Selecciona tu perfil operativo</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setEntityType('COMPANY')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${entityType === 'COMPANY' ? 'border-[var(--color-sure-accent)] bg-[var(--color-sure-accent)]/10 text-white' : 'border-white/10 bg-black/20 text-gray-400 hover:border-white/30'}`}
                >
                  <Building className="w-6 h-6 mb-2" />
                  <span className="font-bold">Empresa</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEntityType('NATURAL')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${entityType === 'NATURAL' ? 'border-[var(--color-sure-accent)] bg-[var(--color-sure-accent)]/10 text-white' : 'border-white/10 bg-black/20 text-gray-400 hover:border-white/30'}`}
                >
                  <User className="w-6 h-6 mb-2" />
                  <span className="font-bold">Persona Natural</span>
                </button>
              </div>
            </div>

            <div className="border-t border-white/10 my-6"></div>

            {/* Campos Dinámicos */}
            {entityType === 'COMPANY' ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <div>
                  <label className="block text-sm font-bold text-white mb-2">Nombre de la Empresa (Legal)</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[var(--color-sure-accent)] focus:outline-none"
                    placeholder="Ej. Logistics Global Corp"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-white mb-2">País</label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[var(--color-sure-accent)] focus:outline-none"
                    placeholder="Ej. Estados Unidos"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">Tax ID / RUC</label>
                    <input
                      type="text"
                      required
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[var(--color-sure-accent)] focus:outline-none"
                      placeholder="Identificación fiscal"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">PVM (Opcional)</label>
                    <input
                      type="text"
                      value={pvm}
                      onChange={(e) => setPvm(e.target.value)}
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[var(--color-sure-accent)] focus:outline-none"
                      placeholder="Registro adicional"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <div>
                  <label className="block text-sm font-bold text-white mb-2">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[var(--color-sure-accent)] focus:outline-none"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">País</label>
                    <input
                      type="text"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[var(--color-sure-accent)] focus:outline-none"
                      placeholder="Ej. España"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">Tax ID / Identificación</label>
                    <input
                      type="text"
                      required
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[var(--color-sure-accent)] focus:outline-none"
                      placeholder="NIF, SSN, DNI..."
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="border-t border-white/10 my-6"></div>

            {/* Credenciales */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-white mb-2">Correo Electrónico (Login)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[var(--color-sure-accent)] focus:outline-none"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-2">Contraseña Segura</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                    <input
                      type="text" // Visible para que puedan copiarla fácilmente
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[var(--color-sure-accent)] focus:outline-none"
                      placeholder="Ingresa o genera una contraseña"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="px-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-white flex items-center justify-center tooltip-trigger"
                    title="Generar contraseña segura"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={copyPassword}
                    className="px-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-white flex items-center justify-center relative"
                    title="Copiar contraseña"
                  >
                    {copied ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">Te sugerimos generar una contraseña segura y guardarla en tu gestor.</p>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3 mt-4">
                  <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-[var(--color-sure-bg)] bg-[var(--color-sure-accent)] hover:bg-white focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Procesando Registro...' : 'Crear Cuenta SURE'}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>

          </form>

          <div className="mt-8 text-center border-t border-white/10 pt-6">
             <p className="text-[var(--color-sure-subtext)] mb-4">¿Ya tienes una cuenta?</p>
             <Link href="/login" className="text-white hover:text-[var(--color-sure-accent)] transition-colors flex items-center justify-center gap-2 font-bold">
                <ArrowLeft className="w-4 h-4" /> Ir a Iniciar Sesión
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
