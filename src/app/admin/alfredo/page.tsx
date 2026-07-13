"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { authedFetch } from '@/lib/apiClient';
import { useRouter } from 'next/navigation';
import { Users, Mail, TrendingUp, PlayCircle, Loader2, UploadCloud, Target, Plus, Folder, ArrowLeft, Trash2, ChevronUp, ChevronDown, CheckCircle, Snowflake, RefreshCcw, Pencil, Archive, Send } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'NEW':
    case 'lead_nuevo':
      return { label: '🆕 NUEVO', className: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' };
    case 'DRAFT':
      return { label: '📝 BORRADOR', className: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' };
    case 'APPROVED':
      return { label: '⏳ APROBADO', className: 'bg-orange-500/20 text-orange-400 border border-orange-500/30' };
    case 'PARKED':
      return { label: '⏸️ APARCADO', className: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' };
    case 'email_1_enviado':
      return { label: '✉️ ENVIADO 1', className: 'bg-purple-500/20 text-purple-400 border border-purple-500/30' };
    case 'email_2_enviado':
      return { label: '✉️ ENVIADO 2', className: 'bg-pink-500/20 text-pink-400 border border-pink-500/30' };
    case 'convertido':
      return { label: '🎉 RECIBIDO', className: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' };
    case 'BOUNCED':
      return { label: '🚨 REBOTADO', className: 'bg-red-500/20 text-red-400 border border-red-500/50' };
    case 'REJECTED':
    case 'cold':
      return { label: '🗑️ DESCARTADO', className: 'bg-zinc-500/20 text-zinc-400 border border-zinc-500/30' };
    default:
      return { label: status || 'DESCONOCIDO', className: 'bg-gray-500/20 text-gray-400 border border-gray-500/30' };
  }
};

export default function AlfredoAdminPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Projects State
  const [projects, setProjects] = useState<any[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string>('');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [newProject, setNewProject] = useState({ name: '', objective: '', originator: '', attachment_url: '', language: 'en' });
  const [creatingProject, setCreatingProject] = useState(false);

  // Leads State
  const [leads, setLeads] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [dispatching, setDispatching] = useState(false);
  const [stats, setStats] = useState({ total: 0, new: 0, sent: 0, converted: 0, cold: 0 });
  const [activeDraft, setActiveDraft] = useState<any>(null);
  const [approving, setApproving] = useState(false);
  const [approvingBatch, setApprovingBatch] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);
  // Alfredo Origination
  const [supplementaryInfo, setSupplementaryInfo] = useState('');
  const [alfredoLoading, setAlfredoLoading] = useState(false);
  const [targetLeadsCount, setTargetLeadsCount] = useState(20);
  const [currentIteration, setCurrentIteration] = useState(0);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/login');
      } else {
        setUser(session.user);
        fetchProjects();
      }
    });
  }, [router]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setProjects(data || []);
      if (data && data.length > 0 && !activeProjectId) {
        setActiveProjectId(data[0].id);
      }
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  // Fetch leads when active project changes
  useEffect(() => {
    if (activeProjectId) {
      fetchLeads(activeProjectId);
      setSupplementaryInfo('');
    }
  }, [activeProjectId]);

  const fetchLeads = async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('leads_campaign')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setLeads(data || []);
      
      const s = { total: data.length, new: 0, sent: 0, converted: 0, cold: 0 };
      data.forEach((l: any) => {
        if (l.status === 'lead_nuevo' || l.status === 'NEW') s.new++;
        else if (l.status === 'email_1_enviado' || l.status === 'email_2_enviado' || l.status === 'DRAFT' || l.status === 'APPROVED') s.sent++;
        else if (l.status === 'convertido') s.converted++;
        else if (l.status === 'cold') s.cold++;
      });
      setStats(s);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateProject = async () => {
    if (!newProject.name || !newProject.objective || !newProject.originator) return alert("Completa todos los campos");
    setCreatingProject(true);

    const payload: any = {
      name: newProject.name,
      objective: newProject.objective,
      originator: newProject.originator,
      language: newProject.language || 'en'
    };

    if (newProject.attachment_url.trim() !== '') {
      payload.attachment_url = newProject.attachment_url;
    }

    try {
      if (editingProjectId) {
        const { data, error } = await supabase.from('projects').update(payload).eq('id', editingProjectId).select().single();
        if (error) throw error;
        setProjects(projects.map(p => p.id === editingProjectId ? data : p));
      } else {
        const { data, error } = await supabase.from('projects').insert([payload]).select().single();
        if (error) throw error;
        setProjects([data, ...projects]);
        setActiveProjectId(data.id);
      }
      setShowNewProjectModal(false);
      setEditingProjectId(null);
      setNewProject({ name: '', objective: '', originator: '', attachment_url: '', language: 'en' });
    } catch (error: any) {
      alert("Error creando proyecto: " + error.message);
    } finally {
      setCreatingProject(false);
    }
  };

  const handleApproveDraft = async (leadId: string) => {
    setApproving(true);
    try {
      const payload: any = { lead_id: leadId };
      if (activeDraft && activeDraft.id === leadId) {
         payload.subject = activeDraft.email_1_subject;
         payload.content = activeDraft.email_1_content;
      }
      
      const res = await authedFetch('/api/campaigns/approve-single', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error desconocido");
      
      // Eliminado el alert molesto para mayor fluidez
      fetchLeads(activeProjectId);
      setActiveDraft(null);
    } catch (err: any) {
      alert("Error aprobando borrador: " + err.message);
    } finally {
      setApproving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !activeProjectId) return;
    setUploading(true);
    const file = e.target.files[0];
    const text = await file.text();
    
    try {
      const res = await authedFetch('/api/campaigns/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvData: text, project_id: activeProjectId })
      });
      if (!res.ok) throw new Error("Error en la carga de CSV");
      alert("Leads cargados exitosamente al proyecto.");
      fetchLeads(activeProjectId);
    } catch (error) {
      console.error(error);
      alert("Hubo un error cargando los leads.");
    } finally {
      setUploading(false);
    }
  };

  const triggerCampaign = async () => {
    if (!activeProjectId) return;
    if (!confirm("¿Generar y enviar borradores para los leads nuevos de ESTE proyecto?")) return;
    setSending(true);
    try {
      const res = await authedFetch('/api/campaigns/send-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: activeProjectId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error en el servidor");
      alert(`Borradores generados. Procesados: ${data.sentCount || 0}`);
      fetchLeads(activeProjectId);
    } catch (error: any) {
      alert(`Error ejecutando la campaña: ${error.message}`);
    } finally {
      setSending(false);
    }
  };

  const handleDispatchDrip = async () => {
    if (!confirm("¿Deseas despachar un lote de correos aprobados ahora mismo?")) return;
    setDispatching(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/campaigns/dispatch-drip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {})
        },
        body: JSON.stringify({ limit: 15 })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error despachando correos");
      
      if (data.dispatched > 0) {
        alert(`Despacho completado con éxito. Se enviaron ${data.dispatched} correo(s).`);
      } else {
        alert(`No hay correos pendientes o listos para enviar en este momento: ${data.message || ''}`);
      }
      
      if (activeProjectId) {
        fetchLeads(activeProjectId);
      }
    } catch (error: any) {
      alert(`Error en el despacho: ${error.message}`);
    } finally {
      setDispatching(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedLeads.length === 0) return;
    if (!confirm(`¿Estás seguro de eliminar ${selectedLeads.length} lead(s) seleccionado(s)?`)) return;
    setDeleting(true);
    try {
      const res = await authedFetch('/api/campaigns/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedLeads })
      });
      if (!res.ok) throw new Error("Error eliminando leads");
      setSelectedLeads([]);
      if (activeProjectId) fetchLeads(activeProjectId);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleApproveSelected = async () => {
    const draftsToApprove = leads.filter(l => selectedLeads.includes(l.id) && l.status === 'DRAFT').map(l => l.id);
    if (draftsToApprove.length === 0) {
      alert("No hay borradores (DRAFT) seleccionados para aprobar.");
      return;
    }
    
    if (!confirm(`¿Estás seguro de aprobar ${draftsToApprove.length} borrador(es) y pasarlos a la cola de envío?`)) return;
    
    setApprovingBatch(true);
    try {
      const res = await authedFetch('/api/campaigns/approve-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead_ids: draftsToApprove })
      });
      if (!res.ok) throw new Error("Error aprobando leads en lote");
      setSelectedLeads([]);
      if (activeProjectId) fetchLeads(activeProjectId);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setApprovingBatch(false);
    }
  };

  const handleUpdateStatusBatch = async (newStatus: string) => {
    if (selectedLeads.length === 0) return;
    if (!confirm(`¿Estás seguro de cambiar el estado de ${selectedLeads.length} lead(s) a ${newStatus}?`)) return;
    
    setUpdatingStatus(true);
    try {
      const res = await authedFetch('/api/campaigns/update-status-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead_ids: selectedLeads, status: newStatus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error actualizando leads");
      setSelectedLeads([]);
      if (activeProjectId) fetchLeads(activeProjectId);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const triggerAlfredo = async () => {
    if (!activeProjectId) return;
    setAlfredoLoading(true);
    setCurrentIteration(1);

    try {
      const iterationsNeeded = Math.ceil(targetLeadsCount / 20);
      let totalFound = 0;

      for (let i = 1; i <= iterationsNeeded; i++) {
        setCurrentIteration(i);
        const res = await authedFetch('/api/alfredo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
             supplementary_info: supplementaryInfo, 
             project_id: activeProjectId,
             iteration: i,
             limit: 20
          })
        });
        const data = await res.json();
        if (!res.ok) {
           console.error(`Error en iteración ${i}: ${data.error}`);
           if (i === 1) throw new Error(data.error);
           break; 
        }
        totalFound += (data.count || 0);
        
        // Wait 4 seconds between calls to avoid Gemini rate limiting
        if (i < iterationsNeeded) {
           await new Promise(r => setTimeout(r, 4000));
        }
      }

      alert(`Búsqueda completada. Alfredo extrajo un total de ${totalFound} prospectos válidos.`);
      fetchLeads(activeProjectId);
    } catch (error: any) {
      alert(`Error con Alfredo: ${error.message}`);
    } finally {
      setAlfredoLoading(false);
      setCurrentIteration(0);
    }
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const exportToCSV = () => {
    if (leads.length === 0) {
      alert("No hay contactos para exportar en este proyecto.");
      return;
    }

    // Columnas clave a exportar
    const columns = ['empresa', 'nombre_contacto', 'cargo', 'email', 'telefono', 'pais', 'sector', 'status', 'resend_status', 'created_at'];
    
    const csvRows = [];
    // Header
    csvRows.push(columns.join(','));

    // Filas
    for (const lead of sortedLeads) { // Exportamos los leads ordenados actuales
      const values = columns.map(col => {
        let val = lead[col];
        if (val === null || val === undefined) val = '';
        // Escapar comillas y comas
        const valStr = String(val).replace(/"/g, '""');
        return `"${valStr}"`;
      });
      csvRows.push(values.join(','));
    }

    const csvContent = "\uFEFF" + csvRows.join('\n'); // Agregamos BOM para que Excel lea tildes correctamente
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leads_proyecto_${activeProject?.name?.replace(/\s+/g, '_') || 'export'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sortedLeads = [...leads].sort((a, b) => {
    if (!sortConfig) return 0;
    
    if (sortConfig.key === 'status') {
      const statusPriority: Record<string, number> = {
        'DRAFT': 1,
        'APPROVED': 2,
        'NEW': 3,
        'lead_nuevo': 3
      };
      const pA = statusPriority[a.status] || 99;
      const pB = statusPriority[b.status] || 99;
      
      if (pA !== pB) {
         return sortConfig.direction === 'asc' ? pA - pB : pB - pA;
      }
      // Si tienen la misma prioridad, que se ordenen por fecha (los más nuevos primero)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }

    const aValue = a[sortConfig.key] || '';
    const bValue = b[sortConfig.key] || '';
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredLeads = sortedLeads.filter(lead => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'NEW') return lead.status === 'NEW' || lead.status === 'lead_nuevo';
    if (statusFilter === 'PARKED') return lead.status === 'PARKED';
    if (statusFilter === 'DRAFT') return lead.status === 'DRAFT';
    if (statusFilter === 'APPROVED') return lead.status === 'APPROVED';
    if (statusFilter === 'SENT') return lead.status === 'email_1_enviado' || lead.status === 'email_2_enviado';
    if (statusFilter === 'BOUNCED') return lead.status === 'BOUNCED' || lead.resend_status === 'bounced';
    if (statusFilter === 'REPLIED') return lead.status === 'convertido' || lead.has_replied === true;
    if (statusFilter === 'REJECTED') return lead.status === 'REJECTED' || lead.status === 'cold';
    return true;
  });

  if (loading) return <div className="min-h-screen bg-[#050a14] flex items-center justify-center text-[var(--color-sure-accent)] font-mono">LOADING ALFREDO SECURE NODE...</div>;

  const activeProject = projects.find(p => p.id === activeProjectId);

  return (
    <div className="min-h-screen bg-[#050a14] text-white font-sans">
      {/* Navbar */}
      <nav className="w-full px-8 py-4 flex justify-between items-center border-b border-white/5 bg-black/40">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-3 hover:text-[var(--color-sure-accent)] transition-colors text-slate-400">
             <ArrowLeft className="w-5 h-5" /> 
             <span className="font-bold tracking-widest uppercase text-xs">Volver al Hub</span>
          </Link>
          <div className="h-6 w-[1px] bg-white/10 hidden md:block"></div>
          <Image src="/logo-sure.png" alt="SURE Logo" width={32} height={32} className="object-contain hidden md:block" priority />
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold uppercase border border-green-500/20">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
             CRON ACTIVO (Vercel)
           </div>
           <div className="text-xs font-mono text-gray-500">{user?.email}</div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-10">
        
        {/* Project Selector Bar */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
           <div className="flex items-center gap-3 w-full md:w-auto">
              <Folder className="w-5 h-5 text-[var(--color-sure-accent)]" />
              <select 
                value={activeProjectId} 
                onChange={(e) => setActiveProjectId(e.target.value)}
                className="bg-black/50 border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-[var(--color-sure-accent)] font-bold min-w-[250px]"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>

              {activeProject && (
                 <button
                   onClick={async () => {
                     const newStatus = activeProject.status === 'active' ? 'paused' : 'active';
                     try {
                       const { error } = await supabase
                         .from('projects')
                         .update({ status: newStatus })
                         .eq('id', activeProject.id);
                       if (error) throw error;
                       setProjects(projects.map(p => p.id === activeProject.id ? { ...p, status: newStatus } : p));
                     } catch (err: any) {
                       alert("Error al actualizar estado: " + err.message);
                     }
                   }}
                   className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                     activeProject.status === 'active' 
                       ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20' 
                       : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                   }`}
                   title={activeProject.status === 'active' ? 'Campaña de envío automática activa' : 'Campaña de envío automática pausada'}
                 >
                   {activeProject.status === 'active' ? '● Envíos Activos' : '○ Envíos Pausados'}
                 </button>
               )}
           </div>
           
           <div className="flex items-center gap-4 w-full md:w-auto justify-between">
              {activeProject && (
                <div className="text-xs text-slate-400 hidden lg:block max-w-sm truncate">
                  <span className="text-white font-bold">Objetivo:</span> {activeProject.objective}
                </div>
              )}
              <button 
                onClick={() => {
                  setEditingProjectId(null);
                  setNewProject({ name: '', objective: '', originator: '', attachment_url: '', language: 'en' });
                  setShowNewProjectModal(true);
                }}
                className="bg-[var(--color-sure-accent)]/10 text-[var(--color-sure-accent)] hover:bg-[var(--color-sure-accent)] hover:text-black border border-[var(--color-sure-accent)]/50 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ml-auto"
              >
                <Plus className="w-4 h-4" /> Nuevo Proyecto
              </button>
              {activeProject && (
                <button 
                  onClick={() => {
                    setNewProject({
                      name: activeProject.name || '',
                      objective: activeProject.objective || '',
                      originator: activeProject.originator || '',
                      attachment_url: activeProject.attachment_url || '',
                      language: activeProject.language || 'en'
                    });
                    setEditingProjectId(activeProject.id);
                    setShowNewProjectModal(true);
                  }}
                  className="bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ml-4"
                >
                  <Pencil className="w-4 h-4" /> Editar
                </button>
              )}
           </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-montserrat font-black uppercase tracking-wider mb-2">Sales Pipeline</h1>
            <p className="text-gray-400 text-sm">Mostrando datos exclusivamente para el proyecto seleccionado.</p>
          </div>
          <div className="flex gap-4">
             {selectedLeads.length > 0 && (
               <>
                 <button 
                   onClick={handleApproveSelected}
                   disabled={approvingBatch}
                   className="bg-green-500/20 text-green-400 hover:bg-green-500/40 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors border border-green-500/30"
                 >
                   {approvingBatch ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                   Aprobar {leads.filter(l => selectedLeads.includes(l.id) && l.status === 'DRAFT').length} Draft{leads.filter(l => selectedLeads.includes(l.id) && l.status === 'DRAFT').length !== 1 ? 's' : ''}
                 </button>
                 <button 
                   onClick={handleDeleteSelected}
                   disabled={deleting}
                   className="bg-red-500/20 text-red-400 hover:bg-red-500/40 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors border border-red-500/30"
                 >
                   {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                   Eliminar
                 </button>
                 <button 
                   onClick={() => handleUpdateStatusBatch('PARKED')}
                   disabled={updatingStatus}
                   className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors border border-blue-500/30"
                 >
                   {updatingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : <Snowflake className="w-4 h-4" />}
                   Congelar
                 </button>
                 <button 
                   onClick={() => handleUpdateStatusBatch('NEW')}
                   disabled={updatingStatus}
                   className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/40 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors border border-purple-500/30"
                 >
                   {updatingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
                   Reactivar
                 </button>
                 <button 
                    onClick={() => handleUpdateStatusBatch('REJECTED')}
                    disabled={updatingStatus}
                    className="bg-zinc-500/20 text-zinc-400 hover:bg-zinc-500/40 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors border border-zinc-500/30"
                  >
                    {updatingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : <Archive className="w-4 h-4" />}
                    Descartar
                  </button>
               </>
             )}
             <label className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 cursor-pointer transition-colors">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                Subir Contactos (CSV)
                <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
             </label>
             <button onClick={exportToCSV} className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40 border border-emerald-500/30 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
                Exportar CSV
             </button>
             <button onClick={triggerCampaign} disabled={sending || !activeProjectId} className="bg-[var(--color-sure-accent)] text-black hover:bg-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
                Generar Correos (Draft)
             </button>
             <button 
                onClick={handleDispatchDrip} 
                disabled={dispatching || !activeProjectId} 
                className="bg-blue-600 text-white hover:bg-blue-500 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors border border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.2)]"
             >
                {dispatching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                ⚡ Despachar Cola
             </button>
          </div>
        </div>

        {/* Telemetry Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4"><Users className="w-6 h-6 text-blue-400" /><span className="text-2xl font-bold">{stats.total}</span></div>
            <p className="text-gray-400 text-sm font-mono uppercase">Total Proyecto</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4"><Target className="w-6 h-6 text-[var(--color-sure-accent)]" /><span className="text-2xl font-bold">{stats.new}</span></div>
            <p className="text-gray-400 text-sm font-mono uppercase">Pendientes (NEW)</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4"><Mail className="w-6 h-6 text-purple-400" /><span className="text-2xl font-bold">{stats.sent}</span></div>
            <p className="text-gray-400 text-sm font-mono uppercase">Correos Activos</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4"><TrendingUp className="w-6 h-6 text-green-400" /><span className="text-2xl font-bold">{stats.converted}</span></div>
            <p className="text-gray-400 text-sm font-mono uppercase">Respuestas</p>
          </div>
        </div>

        {/* ALFREDO ORIGINATION NODE */}
        <div className="bg-black/30 border border-[var(--color-sure-accent)]/30 rounded-3xl overflow-hidden mb-10 shadow-[0_0_30px_rgba(0,229,255,0.05)] relative p-8">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-sure-accent)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-full bg-[var(--color-sure-accent)]/10 border border-[var(--color-sure-accent)] flex items-center justify-center">
                    <Target className="w-5 h-5 text-[var(--color-sure-accent)]" />
                 </div>
                 <div>
                    <h2 className="text-xl font-bold text-white font-montserrat tracking-widest uppercase">Agent Alfredo</h2>
                 </div>
              </div>
              <p className="text-gray-400 text-sm mb-6 max-w-3xl leading-relaxed">
                 Alfredo analizará automáticamente el objetivo de este proyecto. Si lo deseas, puedes añadir restricciones geográficas o condiciones exclusivas abajo.
              </p>
              
              <div className="flex flex-col gap-4">
                 <textarea 
                    value={supplementaryInfo}
                    onChange={(e) => setSupplementaryInfo(e.target.value)}
                    placeholder="Información Suplementaria (Opcional) - Ej: Solo buscar empresas en Alemania y Francia, evitar brokers..." 
                    className="w-full bg-white/5 border border-[var(--color-sure-accent)]/30 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[var(--color-sure-accent)] focus:bg-white/10 transition-colors font-mono text-sm h-24 resize-none"
                 />
                 <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/5 flex-wrap gap-4">
                   <div className="flex items-center gap-3">
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Leads a extraer:</label>
                     <select 
                       value={targetLeadsCount} 
                       onChange={(e) => setTargetLeadsCount(Number(e.target.value))}
                       className="bg-black/50 border border-white/10 rounded-lg py-1.5 px-3 text-white focus:outline-none focus:border-[var(--color-sure-accent)] text-sm font-bold"
                     >
                        <option value={20}>20 Leads (Rápido)</option>
                        <option value={50}>50 Leads (Estándar)</option>
                        <option value={100}>100 Leads (Profundo)</option>
                     </select>
                   </div>
                   
                   <button 
                      onClick={triggerAlfredo} 
                      disabled={alfredoLoading || !activeProjectId} 
                      className="bg-[var(--color-sure-accent)] text-black px-8 py-3 rounded-xl font-bold hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap w-full md:w-auto"
                   >
                      {alfredoLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> {targetLeadsCount > 20 ? `SCANNING BATCH ${currentIteration}/${Math.ceil(targetLeadsCount/20)}...` : 'SCANNING...'}</> : <><PlayCircle className="w-5 h-5" /> DEPLOY ALFREDO</>}
                   </button>
                 </div>
              </div>
           </div>
        </div>

        {/* Leads Table */}
        <div className="bg-black/40 border border-white/10 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center flex-wrap gap-4">
             <div>
                <h2 className="text-lg font-bold">Contactos del Proyecto</h2>
                <div className="text-xs text-slate-500 font-mono">Mostrando registros vinculados a: {activeProject?.name}</div>
             </div>
             <div className="text-xs font-mono text-slate-400 flex gap-4">
                <div>Total: <span className="text-white font-bold">{leads.length}</span></div>
                <div>Filtrados: <span className="text-[var(--color-sure-accent)] font-bold">{filteredLeads.length}</span></div>
             </div>
          </div>
          
          {/* Status Filter Tab Bar */}
          <div className="p-6 border-b border-white/5 flex flex-wrap gap-2 items-center bg-white/5">
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2">Filtrar por Estado:</span>
             {[
               { id: 'ALL', label: 'Todos', count: leads.length },
               { id: 'NEW', label: '🆕 Nuevos', count: leads.filter(l => l.status === 'NEW' || l.status === 'lead_nuevo').length },
               { id: 'PARKED', label: '⏸️ Aparcados', count: leads.filter(l => l.status === 'PARKED').length },
               { id: 'DRAFT', label: '📝 Borradores', count: leads.filter(l => l.status === 'DRAFT').length },
               { id: 'APPROVED', label: '⏳ Aprobados', count: leads.filter(l => l.status === 'APPROVED').length },
               { id: 'SENT', label: '✉️ Enviados', count: leads.filter(l => l.status === 'email_1_enviado' || l.status === 'email_2_enviado').length },
               { id: 'BOUNCED', label: '🚨 Rebotados', count: leads.filter(l => l.status === 'BOUNCED' || l.resend_status === 'bounced').length },
               { id: 'REPLIED', label: '🎉 Recibidos', count: leads.filter(l => l.status === 'convertido' || l.has_replied === true).length },
               { id: 'REJECTED', label: '🗑️ Descartados', count: leads.filter(l => l.status === 'REJECTED' || l.status === 'cold').length },
             ].map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setStatusFilter(tab.id)}
                 className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                   statusFilter === tab.id
                     ? 'bg-[var(--color-sure-accent)] text-black font-extrabold shadow-[0_0_10px_rgba(0,229,255,0.2)]'
                     : 'bg-black/40 text-slate-400 hover:text-white border border-white/10'
                 }`}
               >
                 <span>{tab.label}</span>
                 <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                   statusFilter === tab.id ? 'bg-black/20 text-black font-bold' : 'bg-white/10 text-slate-300'
                 }`}>
                   {tab.count}
                 </span>
               </button>
             ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-white/5 text-xs uppercase font-mono">
                <tr>
                  <th className="px-6 py-4">
                     <input 
                       type="checkbox" 
                       className="w-4 h-4 rounded bg-black/50 border-white/20 text-[var(--color-sure-accent)] focus:ring-[var(--color-sure-accent)]"
                       checked={filteredLeads.length > 0 && filteredLeads.every(l => selectedLeads.includes(l.id))}
                       onChange={(e) => {
                         if (e.target.checked) {
                           const newSelected = Array.from(new Set([...selectedLeads, ...filteredLeads.map(l => l.id)]));
                           setSelectedLeads(newSelected);
                         } else {
                           const filteredIds = filteredLeads.map(l => l.id);
                           setSelectedLeads(selectedLeads.filter(id => !filteredIds.includes(id)));
                         }
                       }}
                     />
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('empresa')}>
                    <div className="flex items-center gap-1">Empresa {sortConfig?.key === 'empresa' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>)}</div>
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('nombre_contacto')}>
                    <div className="flex items-center gap-1">Contacto {sortConfig?.key === 'nombre_contacto' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>)}</div>
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('email')}>
                    <div className="flex items-center gap-1">Email {sortConfig?.key === 'email' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>)}</div>
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('sector')}>
                    <div className="flex items-center gap-1">Sector {sortConfig?.key === 'sector' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>)}</div>
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('created_at')}>
                    <div className="flex items-center gap-1">Fecha {sortConfig?.key === 'created_at' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>)}</div>
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('status')}>
                    <div className="flex items-center gap-1">Status Motor Drip {sortConfig?.key === 'status' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>)}</div>
                  </th>
                  <th className="px-6 py-4">Última Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.length === 0 ? (
                   <tr><td colSpan={8} className="px-6 py-10 text-center font-mono font-bold text-slate-500">No hay contactos {statusFilter !== 'ALL' ? 'con este estado' : ''} en este proyecto.</td></tr>
                ) : (
                   filteredLeads.map(lead => (
                     <tr key={lead.id} className="border-b border-white/5 hover:bg-white/5">
                       <td className="px-6 py-4">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded bg-black/50 border-white/20 text-[var(--color-sure-accent)] focus:ring-[var(--color-sure-accent)]"
                            checked={selectedLeads.includes(lead.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedLeads([...selectedLeads, lead.id]);
                              } else {
                                setSelectedLeads(selectedLeads.filter(id => id !== lead.id));
                              }
                            }}
                          />
                       </td>
                      <td className="px-6 py-4 font-bold text-white">
                        <div className="flex items-center gap-2">
                          <span>{lead.empresa}</span>
                          {lead.website && (
                            <a 
                              href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-emerald-400 hover:text-emerald-300 transition-colors flex-shrink-0"
                              title="Visitar Sitio Web"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5.172 8.354a2 2 0 11-2.828-2.828l3-3a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5z" clipRule="evenodd" />
                              </svg>
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-200">
                        <div className="flex items-center gap-2">
                          <span>{lead.nombre_contacto || 'Equipo Directivo'}</span>
                          {lead.nombre_contacto && (
                            <a 
                              href={`https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent((lead.nombre_contacto || '') + " " + (lead.empresa || ''))}`}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[#0077b5] hover:text-[#00a0dc] transition-colors flex-shrink-0"
                              title="Buscar en LinkedIn"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                              </svg>
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {lead.email?.startsWith('no-email-') ? (
                          <span className="text-slate-500 italic text-xs hover:text-slate-400 cursor-help" title="No se encontró o no superó la verificación de Hunter.io.">Sin correo verificado</span>
                        ) : (
                          lead.email
                        )}
                      </td>
                      <td className="px-6 py-4">{lead.sector}</td>
                      <td className="px-6 py-4 text-xs font-mono text-slate-400 whitespace-nowrap">
                         {new Date(lead.created_at).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2 items-start">
                          {lead.status === 'DRAFT' ? (
                            <button 
                              onClick={() => setActiveDraft(lead)}
                              className="px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/40 transition-colors cursor-pointer border border-yellow-500/30"
                            >
                              REVISAR DRAFT
                            </button>
                           ) : (() => {
                             const badge = getStatusBadge(lead.status);
                             return (
                               <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${badge.className}`}>
                                 {badge.label}
                               </span>
                             );
                           })()}
                           
                           {lead.resend_status && lead.resend_status !== 'pending' && (
                              <span className={`px-2 py-1 rounded text-[9px] uppercase font-bold tracking-wider border ${
                                 lead.resend_status === 'delivered' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                                 lead.resend_status === 'bounced' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                                 lead.resend_status === 'opened' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                                 lead.resend_status === 'clicked' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
                                 lead.resend_status === 'complained' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' :
                                 'bg-gray-500/10 text-gray-400 border-gray-500/30'
                              }`}>
                                {lead.resend_status === 'opened' && lead.has_opened ? '👀 OPENED' : 
                                 lead.resend_status === 'delivered' ? '✓ DELIVERED' : 
                                 lead.resend_status.toUpperCase()}
                              </span>
                           )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono">
                        {lead.status === 'email_1_enviado' && lead.email_1_enviado_at ? new Date(lead.email_1_enviado_at).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
           <div className="bg-[#0a101f] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h2 className="text-xl font-bold mb-4 font-montserrat">{editingProjectId ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}</h2>
              <div className="space-y-4">
                 <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Nombre del Proyecto</label>
                    <input type="text" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} placeholder="Ej: Medidores Asia Q3" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[var(--color-sure-accent)]" />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-[var(--color-sure-accent)] mb-1 uppercase">Modelo / Condiciones Estrictas del Correo</label>
                    <textarea value={newProject.objective} onChange={e => setNewProject({...newProject, objective: e.target.value})} placeholder="PEGA AQUÍ EL MODELO EXACTO Y CONDICIONES. Ej: Estimado {contacto}, somos compradores de cobre puro bajo estas condiciones: 1. Pureza 99.9%. 2. CIF Rotterdam..." className="w-full bg-black/50 border border-[var(--color-sure-accent)]/30 rounded-lg p-3 text-white h-40 focus:outline-none focus:border-[var(--color-sure-accent)]" />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Originador (Tu Nombre)</label>
                    <input type="text" value={newProject.originator} onChange={e => setNewProject({...newProject, originator: e.target.value})} placeholder="Ej: Antonio" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[var(--color-sure-accent)]" />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-blue-400 mb-1 uppercase">Enlace a Documento / LOI (Opcional)</label>
                    <input type="text" value={newProject.attachment_url} onChange={e => setNewProject({...newProject, attachment_url: e.target.value})} placeholder="Ej: https://drive.google.com/tu-loi.pdf" className="w-full bg-black/50 border border-blue-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500" />
                    <p className="text-[10px] text-slate-500 mt-1">Pega el link de Google Drive o OneDrive. La IA lo insertará en el correo. Seguro contra Spam.</p>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Idioma de la Campaña</label>
                    <select 
                      value={newProject.language || 'en'} 
                      onChange={e => setNewProject({...newProject, language: e.target.value})} 
                      className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[var(--color-sure-accent)] font-bold"
                    >
                       <option value="en">🇬🇧 Inglés (Default)</option>
                       <option value="es">🇪🇸 Español</option>
                       <option value="fr">🇫🇷 Francés</option>
                       <option value="de">🇩🇪 Alemán</option>
                       <option value="pt">🇧🇷 Portugués</option>
                       <option value="zh">🇨🇳 Chino</option>
                       <option value="ru">🇷🇺 Ruso</option>
                       <option value="ar">🇸🇦 Árabe</option>
                       <option value="hi">🇮🇳 Hindi</option>
                       <option value="lt">🇱🇹 Lituano</option>
                    </select>
                 </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                 <button onClick={() => { setShowNewProjectModal(false); setEditingProjectId(null); setNewProject({ name: '', objective: '', originator: '', attachment_url: '', language: 'en' }); }} className="px-4 py-2 rounded-lg text-slate-400 hover:text-white transition-colors">Cancelar</button>
                 <button onClick={handleCreateProject} disabled={creatingProject} className="bg-[var(--color-sure-accent)] text-black font-bold px-6 py-2 rounded-lg hover:bg-white transition-colors disabled:opacity-50">
                    {creatingProject ? 'Guardando...' : 'Guardar Proyecto'}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Draft Review Modal */}
      {activeDraft && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
           <div className="bg-[#0a101f] border border-[var(--color-sure-accent)]/30 rounded-2xl p-6 w-full max-w-2xl shadow-[0_0_50px_rgba(0,229,255,0.1)] max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4 font-montserrat flex items-center gap-2">
                <Mail className="w-5 h-5 text-yellow-400" />
                Revisar Borrador (Draft)
              </h2>
              <div className="space-y-4 mb-6">
                 <div className="grid grid-cols-2 gap-4 bg-black/30 p-4 rounded-xl border border-white/5">
                    <div>
                       <div className="text-[10px] text-slate-500 uppercase font-bold flex justify-between items-center mb-1">
                         <span>Destinatario</span>
                         <a 
                           href={`https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent((activeDraft.nombre_contacto || '') + " " + (activeDraft.empresa || ''))}`}
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="text-[#0077b5] hover:text-[#00a0dc] flex items-center gap-1 transition-colors"
                           title="Buscar Perfil en LinkedIn"
                         >
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                             <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a1.66 1.66 0 000 1.21V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
                           </svg>
                           <span className="text-[9px] font-bold">Buscar Perfil</span>
                         </a>
                       </div>
                       <div className="text-sm font-bold text-white">{activeDraft.nombre_contacto}</div>
                       <div className="text-xs text-slate-400">{activeDraft.email}</div>
                    </div>
                    <div>
                       <div className="text-[10px] text-slate-500 uppercase font-bold flex justify-between items-center mb-1">
                         <span>Empresa</span>
                         <div className="flex gap-3">
                           {activeDraft.website && (
                             <a 
                               href={activeDraft.website.startsWith('http') ? activeDraft.website : `https://${activeDraft.website}`}
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                               title="Visitar Sitio Web Oficial"
                             >
                               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                 <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5.172 8.354a2 2 0 11-2.828-2.828l3-3a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5z" clipRule="evenodd" />
                               </svg>
                               <span className="text-[9px] font-bold">Web Oficial</span>
                             </a>
                           )}
                           <a 
                             href={`https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(activeDraft.empresa || '')}`}
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="text-[#0077b5] hover:text-[#00a0dc] flex items-center gap-1 transition-colors"
                             title="Buscar Empresa en LinkedIn"
                           >
                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                               <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a1.66 1.66 0 000 1.21V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
                             </svg>
                             <span className="text-[9px] font-bold">Buscar LinkedIn</span>
                           </a>
                         </div>
                       </div>
                       <div className="text-sm font-bold text-white">{activeDraft.empresa}</div>
                       <div className="text-xs text-slate-400">{activeDraft.sector}</div>
                    </div>
                 </div>

                 {/* Pestañas (o apilado) para ver Email vs LinkedIn */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
{(() => {
                       const contentStr = (activeDraft.email_1_content || '').toLowerCase();
                       const isPortuguese = contentStr.includes('atenciosamente') || contentStr.includes('segurança') || contentStr.includes('bom dia');
                       const isSpanish = contentStr.includes('saludos') || contentStr.includes('estimado') || contentStr.includes('buenos días');
                       const isLithuanian = contentStr.includes('gerb') || contentStr.includes('laba diena') || contentStr.includes('marija ai') || contentStr.includes('odontologijos') || contentStr.includes('klinika') || contentStr.includes('šypsenos');
                       const isEnglish = !isPortuguese && !isSpanish && !isLithuanian;
                       const isNoName = !activeDraft.nombre_contacto || activeDraft.nombre_contacto.toLowerCase().includes('vacío') || activeDraft.nombre_contacto.toLowerCase().includes('vacio') || activeDraft.nombre_contacto.trim().length <= 2;
                       const lastName = isNoName ? '' : (activeDraft.nombre_contacto?.trim().split(' ').pop() || '');

                       const isMeters = activeProject?.name?.toLowerCase().includes('medidor') || 
                                        activeProject?.name?.toLowerCase().includes('meter') || 
                                        activeProject?.name?.toLowerCase().includes('cnel') || 
                                        activeProject?.name?.toLowerCase().includes('ecuador') || 
                                        activeProject?.objective?.toLowerCase().includes('medidor') || 
                                        activeProject?.objective?.toLowerCase().includes('meter') || 
                                        activeProject?.objective?.toLowerCase().includes('cnel') || 
                                        activeProject?.objective?.toLowerCase().includes('ecuador');

                       const lnShortEs = isMeters 
                         ? (isNoName 
                             ? `Estimado Proveedor, un placer. Gestiono el abastecimiento para un proyecto de 12k medidores inteligentes ANSI en Sudamérica. Vi su catálogo de medidores y me gustaría conectar.`
                             : `Estimado Sr. ${lastName}, un placer. Gestiono el abastecimiento para un proyecto de 12k medidores inteligentes ANSI en Sudamérica. Vi su catálogo de medidores y me gustaría conectar.`)
                         : `Dear Mr. ${lastName || 'Partner'}, un honor. He desarrollado una IA que detecta estafadores de comercio exterior con 90% de precisión. Quisiera conectar.`;

                       const lnShortEn = isMeters
                         ? (isNoName
                             ? `Dear Sales Manager, I'm managing sourcing for a major 12k ANSI smart meter grid project in South America. I noticed your ANSI portfolio and would love to connect. Best regards, Antonio`
                             : `Dear Mr. ${lastName}, I'm managing sourcing for a major 12k ANSI smart meter grid project in South America. I noticed your ANSI portfolio and would love to connect. Best regards, Antonio`)
                         : `Filtering fake buyers & sellers with 90% accuracy. I developed a forensic AI for international trade. I'd love to connect, Mr. ${lastName || 'Partner'}.`;

                       const lnShortPt = isMeters
                         ? (isNoName
                             ? `Prezado Fornecedor, prazer. Gerencio o fornecimento para um projeto de 12k medidores inteligentes ANSI na América do Sul. Vi seu portfólio de medidores e gostaria de conectar.`
                             : `Prezado Sr. ${lastName}, prazer. Gerencio o fornecimento para um projeto de 12k medidores inteligentes ANSI na América do Sul. Vi seu portfólio de medidores e gostaria de conectar.`)
                         : `Dear Mr. ${lastName || 'Partner'}, uma honra. Desenvolvi uma IA que detecta fraudadores no comércio internacional com 90% de precisão. Gostaria de conectar.`;

                       const lnShortLt = isMeters
                         ? (isNoName
                             ? `Gerb. Pardavimų Vadove, malonu susisiekti. Valdau 12 tūkst. ANSI išmaniųjų skaitiklių pirkimo paketą Pietų Amerikoje. Pastebėjau jūsų gaminamus ANSI skaitiklius ir norėčiau susisiekti.`
                             : `Gerb. ${lastName}, malonu susisiekti. Valdau 12 tūkst. ANSI išmaniųjų skaitiklių pirkimo paketą Pietų Amerikoje. Pastebėjau jūsų gaminamus ANSI skaitiklius ir norėčiau susisiekti.`)
                         : `Sveiki, malonu susisiekti. Sukūriau specializuotą medicinos DI asistentą „Marija AI“, kuris padeda odontologijos klinikoms pritraukti 15-20% daugiau pacientų ne darbo valandomis.`;
                       
                       const lnLongEn = isMeters
                         ? `Dear ${isNoName ? 'LATAM Sales Manager' : activeDraft.nombre_contacto},
I hope this email finds you well.

Our company is currently managing the technical integration and sourcing package for a bidding consortium preparing a turnkey proposal for a major smart grid expansion project for a leading utility in South America, encompassing the supply of approx. 12,000 advanced ANSI smart electricity meters with integrated 4G LTE telemetry.

We are conducting a preliminary sourcing process to select a reliable technology partner/manufacturer to supply the meters and provide technical backing for our bid. We are looking to establish an exclusive partnership for this specific opportunity with a manufacturer that can comply with the following critical requirements:

1. ANSI Standard Portfolio: Full compliance with ANSI C12.1, C12.10, C12.18, and C12.19. We require Form 2S (with disconnect), Form 3S, Form 4S, Form 9S, Form 12S (with disconnect), and Form 16S.
2. Telecommunications: Integrated 4G LTE communication module supporting bands compatible with South American carriers (including B2, B4, B8, and B28) concurrently, with fallback to 3G/2G. Fully internal antenna with gain >= +3 dBi and efficiency > 60%.
3. Interoperability: Willingness to support and certify compatibility with major HES platforms (including Trilliant and Honeywell NetSense).
4. Physical Design: 3.6 V Lithium battery for RTC, which must be fully accessible and replaceable from an external socket/compartment without breaking the main metrological enclosure seals.
5. Commercial & Logistics: 60-month factory warranty and standard industrial palletization.

Please note that to protect our bidding consortium's position, the exact name of the utility, country coordinates, and detailed bill of quantities will only be disclosed under a mutual Non-Disclosure and Non-Circumvention Agreement (NDA/NCND).

Please let us know if your company has ANSI C12 certified models that meet these requirements and if you are interested in discussing an exclusive partnership and price quotation under NDA.

We look forward to your prompt response.

Best regards,

Antonio Baronas
Sourcing Integration Team | PROCDI
Ph: +37068941110
e-mail: antonio@procdi.com

Company code: 307515454
Partizanų g. 61-806, LT-49282
Kaunas, Lithuania`
                         : `Is it possible to detect an international scammer with 90% precision before signing?
I have worked for years in international trade and dealt with hundreds of fake sellers and buyers. Today, scammers are not novices. They are extremely convincing, know the technical jargon perfectly, and present masterfully forged documents: from fake KEMA certificates to supposed bank guarantees.
There are even real suppliers faking documents to meet requirements they lack.
In this industry, an authentic buyer or seller is a treasure. But a single failed operation is enough to lose it all. Reputation and trust evaporate in a second. Faced with this terror, companies have reacted by creating lists of almost abusive requirements, generating a paranoia that ends up blocking 100% legitimate operations. Distrust reigns.
The problem with traditional due diligence is human fragility. An analyst reads one line at a time and must rely on their memory to recall what they read three hours or several days ago. The human eye gets tired after 40 pages and inevitably gets distracted by what happens around them in the office.
An overlooked detail can cost millions. And what is worse: it brings the loss of reputation, the destruction of trust, and the dismissal of valuable and honest workers due to errors that, humanly, were almost impossible to detect.
Artificial Intelligence does not operate like that. AI reads multiple documents in parallel. It analyzes math, law, and chemistry simultaneously. It doesn't have Friday afternoons, it doesn't get tired, and it crosses patterns at inhuman speed without ever getting distracted.
How do we unlock this paralysis in the industry?
Imagine this for a second:
1. What if we had a technology that detects a Scammer in minutes at an accessible cost?
2. What if it gave us precise instructions on what to demand from the counterparty to disarm their trap?
3. What if it crossed data on international sanctions and geographic technical impossibilities in real-time?
We have it, that's how SURE FORENSICS (RMA Project) was born.
Hiring traditional Due Diligence can cost tens of thousands of dollars and paralyze a business for weeks. SURE does the work of a team of 20 analysts in exactly 7 minutes.
Furthermore, for the acquisition of technological products, we complement this algorithmic shield with a deep audit of intellectual property rights, especially checking if there are valid patents and in which countries. For this, we have an elite human team made up of former patent directors and researchers from recognized European universities.
To prove it, I recently wanted to play around and test our new technological architecture. I started throwing old files from my own archives at it: SCO contracts, ICPO, Letters of Credit, BLs...
What I discovered was terrifying. The rate of undetectable falsehoods that had gone unnoticed by the human eye was immense.
Is Artificial Intelligence infallible? Absolutely NOT. But by giving you 90% certainty with objectively verifiable and mathematical evidence, it collapses any narrative defense of the transgressor.
The pragmatism is simple: Suppose you receive offers from 20 different suppliers for a critical acquisition. Instead of spending weeks analyzing blindly, you run the files through SURE FORENSIC. The system detects anomalies and assigns a Critical Risk Level to 17 of them.
You just saved your capital (and your team's jobs). Now, your staff can dedicate their energy and talent exclusively to negotiating with the 3 real suppliers, leveraged on a forensic report that tells them exactly where they stand.
Trust in international trade was broken. We just repaired it.
👇 If your trading desk has an ongoing operation, send me a direct message. Let's pass those documents through the SURE vault before you sign.`;

                       const lnLongEs = isMeters
                         ? lnLongEn
                         : `¿Es posible detectar a un estafador internacional con un 90% de precisión antes de firmar?
He trabajado por años en el comercio exterior y he lidiado con centenares de falsos vendedores y compradores. Hoy en día, los estafadores no son novatos. Son extremadamente convincentes, conocen la jerga técnica a la perfección y presentan documentos magistralmente falsificados: desde certificados KEMA hasta supuestas garantías bancarias.
Incluso hay proveedores reales falseando documentos para cumplir con requisitos de los cuales carecen.
En esta industria, un comprador o vendedor auténtico es un tesoro. Pero basta una sola operación fallida para perderlo todo. La reputación y la confianza se evaporan en un segundo. Ante este terror, las empresas han reaccionado creando listas de requisitos casi abusivos, lo que ha generado una paranoia que termina bloqueando operaciones 100% legítimas. La desconfianza reina.
El problema de la debida diligencia tradicional es la fragilidad humana. Un analista lee una línea a la vez y debe confiar en su memoria para recordar lo que leyó hace tres horas o varios días atrás. El ojo humano se cansa después de 40 páginas y se distrae inevitablemente con lo que ocurre a su alrededor en la oficina.
Un detalle pasado por alto puede costar millones. Y lo que es peor: acarrea la pérdida de reputación, la destrucción de la confianza y el despido de trabajadores valiosos y honestos por culpa de errores que, humanamente, eran casi imposibles de detectar.
La Inteligencia Artificial no opera así. La IA lee múltiples documentos en paralelo. Analiza matemáticas, leyes y química simultáneamente. No tiene viernes por la tarde, no se cansa, y cruza patrones a una velocidad inhumana sin distraerse jamás.
¿Cómo desbloqueamos esta parálisis en la industria?
Imagínate esto por un segundo:
1. ¿Y si tuviéramos una tecnología que detecte a un Scammer en minutos y a un costo accesible?
2. ¿Y si nos diera instrucciones precisas sobre qué exigirle a la contraparte para desarmar su trampa?
3. ¿Y si cruzara datos de sanciones internacionales e imposibilidades técnicas geográficas en tiempo real?
Lo tenemos, así nació SURE FORENSICS (Proyecto RMA).
Contratar una Due Diligence tradicional puede costar decenas de miles de dólares y paralizar un negocio durante semanas. SURE hace el trabajo de un equipo de 20 analistas en exactamente 7 minutos.
Además, para la adquisición de productos tecnológicos, complementamos este blindaje algorítmico con una auditoría profunda de derechos de propiedad intelectual y especialmente si existen patentes vigentes y en cuales países. Para ello, contamos con un equipo humano élite conformado por ex-directores de patentes e investigadores de reconocidas universidades europeas.
Para comprobarlo, hace poco quise jugar a poner a prueba nuestra nueva arquitectura tecnológica. Empecé a lanzarle expedientes antiguos de mis propios archivos: contratos SCO, ICPO, Cartas de Crédito, BLs…
Lo que descubrí fue aterrador. La tasa de falsedades indetectables que habían pasado desapercibidas ante el ojo humano era inmensa.
¿Es la Inteligencia Artificial infalible? Rotundamente NO. Pero al entregarte un 90% de certeza con evidencia objetivamente comprobable y matemática, derrumba cualquier defensa narrativa del transgresor.
El pragmatismo es simple: Supongamos que recibes ofertas de 20 proveedores distintos para una adquisición crítica. En lugar de gastar semanas analizando a ciegas, pasas los expedientes por SURE FORENSIC. El sistema detecta anomalías y asigna un Nivel de Risco Crítico a 17 de ellos.
Acabas de salvar tu capital (y los empleos de tu equipo). Ahora, tu personal puede dedicar su energía y talento exclusivamente a negociar con los 3 proveedores reales, apalancados en un reporte forense que les dice exactamente qué terreno pisan.
La confianza en el comercio internacional estaba rota. Acabamos de repararla.
👇 Si tu mesa de trading tiene una operación en curso, envíame un mensaje directo. Pasemos esos documentos por la bóveda de SURE antes de que firmes.`;

                       const lnLongPt = isMeters
                         ? lnLongEn
                         : `É possível detectar um fraudador internacional com 90% de precisão antes de assinar?
Trabalho há anos no comércio exterior e lidei com centenas de falsos vendedores e compradores. Hoje em dia, os fraudadores não são novatos. São extremamente convincentes, conhecem o jargão técnico com perfeição e apresentam documentos magistralmente falsificados: de falsos certificados KEMA a supostas garantias bancárias.
Existem até fornecedores reais falsificando documentos para cumprir requisitos que não possuem.
Nesta indústria, um comprador ou vendedor autêntico é um tesouro. Mas basta uma única operação falha para perder tudo. A reputação e a confiança evaporam num segundo. Diante desse terror, as empresas reagiram criando listas de requisitos quase abusivos, gerando uma paranoia que acaba bloqueando operações 100% legítimas. A desconfiança reina.
O problema da due diligence tradicional é a fragilidade humana. Um analista lê uma linha de cada vez e deve confiar na memória para lembrar o que leu há três horas ou vários dias atrás. O olho humano se cansa após 40 páginas e inevitavelmente se distrai com o que acontece ao redor no escritório.
Um detalhe negligenciado pode custar milhões. E o que é pior: acarreta a perda de reputação, a destruição da confiança e a demissão de trabalhadores valiosos e honestos por culpa de erros que, humanamente, eram quase impossíveis de detectar.
A Inteligência Artificial não opera assim. A IA lê vários documentos em paralelo. Analisa matemática, leis e química simultaneamente. Não tem sexta-feira à tarde, não se cansa e cruza padrões a uma velocidade desumana sem nunca se distrair.
Como desbloqueamos essa paralisia na indústria?
Imagine isso por um segundo:
1. E se tivéssemos uma tecnologia que detecta um Scammer em minutos e a um custo acessível?
2. E se nos desse instruções precisas sobre o que exigir da contraparte para desarmar sua armadilha?
3. E se cruzasse dados de sanções internacionais e impossibilidades técnicas geográficas em tempo real?
Nós temos, assim nasceu SURE FORENSICS (Projeto RMA).
Contratar uma Due Diligence tradicional pode costar dezenas de milhares de dólares e paralisar um negócio por semanas. SURE faz o trabalho de uma equipe de 20 analistas em exatamente 7 minutos.
Além disso, para a aquisição de produtos tecnológicos, complementamos esta blindagem algorítmica com uma auditoria profunda de direitos de propriedade intelectual e especialmente se existem patentes vigentes e em quais países. Para isso, contamos com uma equipe humana de elite formada por ex-diretores de patentes e pesquisadores de renomadas universidades europeias.
Para comprovar, recentemente quis brincar de testar nossa nova arquitetura tecnológica. Comecei a enviar arquivos antigos dos meus próprios arquivos: contratos SCO, ICPO, Cartas de Crédito, BLs…
O que descobri foi assustador. A taxa de falsidades indetectáveis que passaram despercebidas pelo olho humano era imensa.
A Inteligência Artificial é infalível? Rotundamente NÃO. Mas ao entregar 90% de certeza com evidências objetivamente comprováveis e matemáticas, derruba qualquer defesa narrativa do transgressor.
O pragmatismo é simples: Suponha que você receba ofertas de 20 fornecedores diferentes para uma aquisição crítica. Em vez de passar semanas analisando às cegas, você passa os arquivos pelo SURE FORENSIC. O sistema detecta anomalias e atribui um Nivel de Risco Crítico a 17 de eles.
Você acabou de salvar seu capital (e os empregos de sua equipe). Agora, sua equipe pode dedicar energia e talento exclusivamente a negociar com os 3 fornecedores reais, alavancados em um relatório forense que diz exatamente onde estão pisando.
A confiança no comércio internacional estava quebrada. Acabamos de consertá-la.
👇 Se sua mesa de trading tem uma operação em andamento, envie-me uma mensagem direta. Vamos passar esses documentos pelo cofre do SURE antes que você assine.`;

                       const lnLongLt = isMeters
                          ? lnLongEn
                          : `Laba diena, gerb. ${lastName},

Kreipiuosi, nes pastebėjau Jūsų sėkmingą veiklą odontologijos srityje Kaune.

Šiuolaikinės klinikos susiduria su dideliu administratoriaus perkrovimu – atsakant į pasikartojančius klausimus (kainos, laisvi laikai, PSD kompensacijos) sugaištama iki 60% laiko. Kai klinika nedirba (naktimis, savaitgaliais), potencialūs pacientai registruojasi pas konkurentus.

Mes sukūrėme „Marija AI“ – dirbtinio intelekto asistentą, kuris veikia Jūsų svetainėje 24/7, atsako lietuvių, anglų, rusų kalbomis ir registruoja pacientus tiesiai į Jūsų kalendorių (pvz., Google Calendar, API ar hibridiniu būdu).

Klinikose šis asistentas pritraukia 15-20% daugiau vizitų per pirmąsias 60 dienų. Mielai parengtume Jūsų klinikai nemokamą asmeninę demo versiją.

Ar būtų įdomu trumpai pasikalbėti apie šią galimybę?

Su pagarba,
Antonio Baronas
MB PROCDI direktorius`;

                       const shortNote = isEnglish ? lnShortEn : isPortuguese ? lnShortPt : isLithuanian ? lnShortLt : lnShortEs;
                       const longNote = isEnglish ? lnLongEn : isPortuguese ? lnLongPt : isLithuanian ? lnLongLt : lnLongEs;

                       return (
                          <>
                             {/* Nota Corta (Conexión) */}
                             <div>
                                <label className="block text-[10px] font-bold text-blue-400 mb-1 uppercase">Paso 1: Nota de Conexión (Pedir Amistad)</label>
                                <textarea
                                   readOnly
                                   value={shortNote}
                                   className="w-full bg-[#0a192f] border border-blue-500/30 rounded-lg p-3 text-blue-100 font-sans text-sm h-32 resize-none focus:outline-none focus:border-blue-500"
                                   onClick={(e) => {
                                      const target = e.target as HTMLTextAreaElement;
                                      target.select();
                                      navigator.clipboard.writeText(target.value);
                                      alert('¡Nota de conexión copiada!');
                                   }}
                                   title="Haz clic para copiar"
                                />
                                <div className="flex justify-between items-center mt-1">
                                   <p className="text-[9px] text-blue-400/60">Límite de LinkedIn: 200 caracteres</p>
                                   <p className={`text-[9px] font-bold ${shortNote.length > 200 ? 'text-red-400' : 'text-green-400'}`}>{shortNote.length}/200</p>
                                </div>
                             </div>

                             {/* Mensaje Largo (InMail) */}
                             <div>
                                <label className="block text-[10px] font-bold text-blue-400 mb-1 uppercase">Paso 2: InMail / Mensaje Directo</label>
                                <textarea
                                   readOnly
                                   value={longNote}
                                   className="w-full bg-[#0a192f] border border-blue-500/30 rounded-lg p-3 text-blue-100 font-sans text-sm h-48 resize-none focus:outline-none focus:border-blue-500 mb-4"
                                   onClick={(e) => {
                                      const target = e.target as HTMLTextAreaElement;
                                      target.select();
                                      navigator.clipboard.writeText(target.value);
                                      alert('¡Mensaje de LinkedIn copiado al portapapeles!');
                                   }}
                                   title="Haz clic para copiar"
                                />
                                <p className="text-[9px] text-blue-400/60 mt-1">Enviar tras ser aceptado o por InMail Premium</p>
                             </div>
                          </>
                       );
                    })()}
                 </div>



                 <div>
                    <label className="block text-[10px] font-bold text-[var(--color-sure-accent)] mb-1 uppercase">Asunto (Email 1)</label>
                    <input
                       value={activeDraft.email_1_subject || ''}
                       onChange={(e) => setActiveDraft({...activeDraft, email_1_subject: e.target.value})}
                       className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white font-bold text-sm focus:border-[var(--color-sure-accent)] outline-none"
                    />
                 </div>
                 
                 <div>
                    <label className="block text-[10px] font-bold text-[var(--color-sure-accent)] mb-1 uppercase">Cuerpo del Mensaje (Email 1)</label>
                    {activeDraft.email_1_content?.includes('<html') ? (
                       <div dangerouslySetInnerHTML={{ __html: activeDraft.email_1_content }} className="w-full bg-white text-black p-4 rounded-lg max-h-64 overflow-y-auto" /> 
                    ) : (
                       <textarea
                          value={activeDraft.email_1_content || ''}
                          onChange={(e) => setActiveDraft({...activeDraft, email_1_content: e.target.value})}
                          className="w-full bg-black/50 border border-white/10 rounded-lg p-4 text-white text-sm h-64 font-mono whitespace-pre-wrap focus:border-[var(--color-sure-accent)] outline-none"
                       />
                    )}
                 </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 border-t border-white/10 pt-4">
                 <button onClick={() => setActiveDraft(null)} className="px-4 py-2 rounded-lg text-slate-400 hover:text-white transition-colors text-sm font-bold">
                    Cerrar
                 </button>
                 <button 
                    onClick={() => handleApproveDraft(activeDraft.id)} 
                    disabled={approving} 
                    className="bg-green-500 text-black font-bold px-6 py-2 rounded-lg hover:bg-green-400 transition-colors disabled:opacity-50 flex items-center gap-2"
                 >
                    {approving ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
                    {approving ? 'Aprobando...' : 'Aprobar y Poner en Cola'}
                 </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
