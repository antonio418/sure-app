"use client";

// Ruta dedicada para "Proyectos — Asistente Avanzado".
// Reutiliza el mismo componente de /auditoria-rma; el propio componente detecta
// que la URL termina en /proyectos (usePathname) y entra directo en modo Proyectos.
import AuditoriaRmaPage from "../page";

export default function ProyectosPage() {
  return <AuditoriaRmaPage />;
}
