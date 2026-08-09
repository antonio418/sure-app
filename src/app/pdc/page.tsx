"use client";

// Ruta pública limpia para SURE PDC (planes de contingencia).
// Reutiliza la página existente de /rma/contingencia para que el enlace /pdc
// usado en marketing/LinkedIn funcione directamente, con URL limpia.
import ContingenciaPage from "../rma/contingencia/page";

export default function PdcPage() {
  return <ContingenciaPage />;
}
