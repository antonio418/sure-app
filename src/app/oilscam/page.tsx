'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { 
  ShieldAlert, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Cpu, 
  Search, 
  Scale, 
  Check, 
  Copy, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Globe,
  Lock,
  Zap,
  HelpCircle,
  FileSignature
} from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useLanguage } from '@/context/LanguageContext';
import { Language } from '@/lib/translations';

const RMAPdfGenerator = dynamic(
  () => import('@/components/pdf/RMAPdfGenerator'),
  { ssr: false, loading: () => <div className="text-xs text-slate-400">Loading PDF engine...</div> }
);

const oilscamTranslations: Record<string, Record<string, string>> = {
  en: {
    live_scanner: "Live Scanner",
    badge_stop: "Stop Oil Scams Instantly",
    title_1: "Audit Your Oil Offers in",
    title_2: "Real Time with AI.",
    desc: "Commodity trading is plagued by shell companies, forged tank letters, and hijacked refinery domains. Drop your PDF offers (SCO, FCO, ICPO, CIS) into our automated digital sieve to verify anomalies before signing anything.",
    view_sample: "View Live Sample Report: LLP R******L (Risk Score: 96/100)",
    tank_title: "Rotterdam & Houston Tanks",
    tank_desc: "Automatically cross-references tank storage coordinates for fake lease documents.",
    domain_title: "Domain Registry Audit",
    domain_desc: "Flags sender domains registered within 6 months to spot spoofed refineries.",
    signee_title: "Signee Identity Verification",
    signee_desc: "Scans signature registries, corporate registrations, and blacklist databases.",
    agent_matrix_title: "4-Agent Forensic Matrix",
    agent_matrix_desc: "Harnesses multi-agent synthesis to compile a unified Risk Certificate.",
    free_beta: "Free Beta Access",
    verify_title: "Verify Your Petroleum Offer",
    promo_code: "Promo Access Code",
    promo_desc: "Default promo code is active for unlimited free validation scans.",
    email: "Corporate Email *",
    phone: "Contact Phone *",
    company: "Company Name (Optional)",
    target_lang: "Target Report Language",
    drop_pdf: "Drop Petroleum Offer PDF *",
    drag_drop: "Drag & Drop PDF file",
    limit_desc: "SCO, FCO, CIS, or lease letters up to 10MB",
    agree_terms: "I agree to submit this document for automated cryptographic audit under SURE protocols.",
    scan_btn: "Scan Offer For Scams",
    stay_page: "PLEASE STAY ON THIS PAGE. Processing large petroleum PDFs requires intense AI calculations (Up to 3 minutes).",
    scan_progress: "Forensic Document Scan in Progress",
    scan_progress_desc: "Multi-Agent framework actively verifying coordinates, compliance and integrity.",
    progress_matrix: "Progress Matrix",
    scan_another: "Scan Another Offer",
    forensic_result: "Forensic Result",
    risk_score: "Risk Matrix Score",
    exec_recs: "💡 Executive Recommendations",
    structural_findings: "🚨 Structural Findings & Anomalies",
    no_anomalies: "✅ No significant commercial oil scam anomalies detected in this document.",
    completed_on: "Scan completed on",
    certified_by: "Certified by SURE.",
    node_roberto_role: "Document Integrity",
    node_moises_role: "Coherence & Logic",
    node_alcides_role: "Context Mapping",
    node_consolidator_role: "Executive Certificate",
    node_status_auditing: "Auditing...",
    node_status_finished: "Finished",
    node_status_standby: "Standby",
    node_label: "NODE:",

    // Missing UI keys
    audited_transaction: "Audited Transaction",
    forensic_certificate_text: "Forensic Risk Certificate (Text)",
    copied: "Copied!",
    copy_text: "Copy Text",
    formatting_report: "Analysis finished. Formatting report...",
    footer_rights: "OilScam Alert & SURE Infrastructure Intelligence. All rights reserved.",

    // Log Keys
    log_initializing: "Initializing OilScam Alert Digital Sieve...",
    log_access_granted: "Access granted for: DEMO ACCESS PORTAL",
    log_retrieving_sample: "Retrieving sample document 'LLP_R******L_SCO_FAKE.pdf' from archives...",
    log_roberto_complete: "ROBERTO (Document Integrity) -> Analysis complete. 6 critical discrepancies logged.",
    log_moises_complete: "MOISÉS (Coherence Auditor) -> Analysis complete. 4 physical impossibilities found.",
    log_alcides_complete: "ALCIDES (Sanctions Specialist) -> Analysis complete. Direct Russian ESPO sanctions risk flagged.",
    log_consolidator_complete: "CONSOLIDATOR -> Forensic Transactional Certificate generated successfully!",
    log_uploading: "Uploading petroleum document to secure analytical vault...",
    log_documents_secured: "Documents secured. Booting specialized analytical AI sub-agents...",
    log_deploying_agent: "Deploying {param} ({param2}) to verify anomalies...",
    log_agent_complete: "Analysis complete for agent: {param}",
    log_consolidating: "Consolidating subordinate insights. Executing Executive Risk Synthesis...",
    log_dispatching: "Forensic Certificate compiled and dispatched to: {param}",
    log_warning_formatting: "Warning: PDF formatting slightly degraded, showing structured text report instead.",

    // Demo Report Recommendations
    demo_recommendations: "EXECUTIVE CONSOLIDATOR DETERMINATION — IRREVERSIBLE RISK TREND IDENTIFIED. All three subordinate agents (ROBERTO, MOISÉS, and ALCIDES) have issued independent REJECT determinations. Their findings are not contradictory — they are mutually reinforcing across every analytical dimension: identity, contractual structure, chemical/technical integrity, pricing, and geopolitical/sanctions compliance. No positive KYC element from any agent is sufficient to offset the critical findings below. We estimate that it is not possible to reverse the risk trend found regarding the eligibility of this supplier.\n\nACTIONABLE STEPS (for reference and due diligence record purposes only — engagement is not recommended):\n1. DO NOT TRANSFER ANY FUNDS under any payment term described in this document (MT103, TT Wire, or otherwise). The 2%/5%/10% advance deposit structures across all three transaction procedures require irreversible SWIFT wire transfers to seller-nominated accounts before cargo verification. This is the primary financial extraction mechanism.\n2. DO NOT SIGN any ICPO, SPA, CI, NCNDA, or IMFPA with this entity without a prior, independent legal opinion.\n3. ESPO CRUDE EXCLUSION: ESPO is a Russian pipeline crude grade. Labeling it as 'Kazakhstan origin' constitutes a factual misrepresentation exposing you to secondary sanctions under OFAC and EU regulations.\n4. JP54 EXCLUSION: Immediately exclude JP54 ('Colonial Grade 54') from any discussion. It is a fictitious product designation used in advance-fee commodity schemes.\n5. TECHNICAL SPECIFICATION AUDIT: The spec sheets contain multiple critical errors (physically impossible values, wrong units, fabricated names 'Mathane' and 'Putanes') indicating they were not generated by a qualified laboratory.",

    // Demo Anomalies
    demo_anomaly_01_title: "Residential Apartment as Corporate Headquarters",
    demo_anomaly_01_desc: "The registered operational address of LLP R******L across all 15 pages is '[REDACTED STREET ADDRESS], Balkhash, Kazakhstan' — a residential apartment unit. A company claiming the capacity to export up to 3,000,000 barrels/month of crude oil from a residential address represents a structural credibility inconsistency of the highest order.",
    demo_anomaly_02_title: "ESPO Crude Oil: Critical Origin Misrepresentation & Sanctions Exposure",
    demo_anomaly_02_desc: "The document offers 'ESPO CRUDE OIL' with 'ORIGIN: KAZAKHSTAN.' ESPO is a Russian pipeline crude grade exclusively transported via the Transneft system. Kazakhstan has no physical connection to it. Any party transacting this product may face severe secondary sanctions liability under OFAC and EU.",
    demo_anomaly_03_title: "JP54 ('Colonial Grade 54'): Fictitious Commercial Product",
    demo_anomaly_03_desc: "The offer includes 'JET FUEL AVIATION KEROSENE COLONIAL GRADE 54 (JP54).' JP54 is not a standardized or commercially traded civilian aviation fuel. It is universally recognized in petroleum fraud investigation literature as a fictitious product designation used in advance-fee schemes.",
    demo_anomaly_04_title: "D6 Virgin Fuel Oil: Non-Standardized Product at Physically Impossible Volumes",
    demo_anomaly_04_desc: "'D6 Virgin Fuel Oil' does not correspond to any recognized ISO/ASTM standard. The offered quantity of up to 800,000,000 gallons per month (approx. 19,000,000 barrels) is equivalent to a top-10 global producer volume, at physically and economically impossible sub-cost pricing.",
    demo_anomaly_05_title: "Advance Payment Mechanism (2%/5%/10% Deposits) Before Verification",
    demo_anomaly_05_desc: "The buyer is required to transfer irreversible MT103 wire deposits before cargo verification. This includes a 10% payment to a 'seller-nominated escrow company' that is entirely controlled by the seller. This is the primary financial extraction mechanism in petroleum fraud typologies.",
    demo_anomaly_06_title: "Implausible Aggregate Supply Volumes Across Nine Products Simultaneously",
    demo_anomaly_06_desc: "The document simultaneously claims the capacity to supply up to 3,000,000 BBL/month of Jet A-1, ESPO Crude, and JP54, along with 800,000,000 gallons/month of D6 and huge volumes of Mazut, LPG, and LNG. This aggregate volume exceeds the total export capacity of multiple national exporters combined.",
    demo_anomaly_07_title: "Below-Market Pricing Across All Products (Bait Pricing Pattern)",
    demo_anomaly_07_desc: "All products are offered at prices significantly below prevailing market benchmarks (e.g. ESPO crude at $46–52/BBL CIF vs. $65–75/BBL market spot). This is a behavioral manipulation tactic designed to bypass corporate due diligence controls.",
    demo_anomaly_08_title: "EN590 Specification: Three Major Technical Non-Compliances",
    demo_anomaly_08_desc: "The specification sheet contains physical impossibilities: (1) Summer CFPP value declared as +50.0°C (legal max is +5.0°C); (2) Oxidation Stability declared as 460 g/m³ (legal max is 25 g/m³, showing a copy-paste error from lubricity parameters); (3) Polycyclic Aromatic Hydrocarbons at 11.0% m/m (legal max is 8.0% m/m).",
    demo_anomaly_09_title: "Jet A-1 Specification: Four Fundamental Technical Errors",
    demo_anomaly_09_desc: "Contains critical specification errors: (1) Flash Point declared as 'Max 42°C' instead of Min 38°C; (2) Smoke Point declared in 'Mj/Lkg' instead of mm; (3) Net Specific Energy declared as 'Min 19 Mm' instead of Min 42.8 MJ/kg; (4) Density unit declared as 'Kg/m²' (a surface unit) instead of Kg/m³.",
    demo_anomaly_10_title: "LPG Specification: Describes Natural Gas, Mismatched Parameters",
    demo_anomaly_10_desc: "Declares a minimum methane content of 85.0 Mol%, describing pipeline-quality natural gas (LNG), not Liquefied Petroleum Gas (which must contain >90% propane/butanes). Additionally lists fabricated chemical names 'MATHANE' and 'PUTANES' instead of methane and butanes.",
    demo_anomaly_11_title: "Page 14 Critical Mislabeling: Petcoke Parameters Mislabeled as ESPO Crude",
    demo_anomaly_11_desc: "The table lists a 'Real Density of 2.10 g/cm³' (crude oil density is ~0.85; 2.10 matches calcined coke) along with moisture, ash, and particle size distributions over 8mm. This petcoke datasheet mislabeled as ESPO crude indicates a severe document assembly failure.",
    demo_anomaly_12_title: "Loading Port Listed as 'TBA' Across All Nine Products",
    demo_anomaly_12_desc: "Lists 'TBA' (To Be Announced) as the loading port for all nine products. In legitimate CIF trading, the loading terminal is a legally required element to calculate freight, insurance, and transit. Its absence prevents any logistics validation.",
    demo_anomaly_13_title: "Director Name Discrepancy & Unverifiable Executive Identity",
    demo_anomaly_13_desc: "Spells the General Director's surname as 'M*********' in the signature block and 'M*********' in the body text. Furthermore, no public profile, company registry, or industry directory corroborates the existence or track record of this individual.",
    demo_anomaly_14_title: "Document Template Assembly Failure & Duplicate Pages",
    demo_anomaly_14_desc: "Pages 2 and 3 are verbatim duplicates of each other. Volatile parameters, petcoke tables, and density units are transposed across multiple sections, confirming a document assembled from pre-existing fraudulent templates.",

    demo_raw_report: "EXECUTIVE DETERMINATION: LLP R******L\n========================================\nRISK SCORE: 96/100 | STATUS: REJECTED\n\nEXECUTIVE RECOMMENDATIONS:\nAll three subordinate agents (ROBERTO, MOISÉS, and ALCIDES) have issued independent REJECT determinations. Their findings are mutually reinforcing across every analytical dimension. We estimate that it is not possible to reverse the risk trend found regarding the eligibility of this supplier.\n\nCRITICAL ANOMALIES:\n1. Residential Apartment as Corporate Headquarters.\n2. ESPO Crude Oil: Critical Origin Misrepresentation & Sanctions Exposure.\n3. JP54 ('Colonial Grade 54'): Fictitious Commercial Product.\n4. D6 Virgin Fuel Oil: Non-Standardized Product at Physically Impossible Volumes.\n5. Advance Payment Mechanism (2%/5%/10% Deposits) Before Verification."
  },
  es: {
    live_scanner: "Escáner en Vivo",
    badge_stop: "Detén Fraudes de Petróleo al Instante",
    title_1: "Audita tus Ofertas de Petróleo en",
    title_2: "Tiempo Real con IA.",
    desc: "El comercio de commodities está plagado de empresas fantasma, cartas de tanques falsificadas y dominios de refinerías hackeados. Sube tus ofertas en PDF (SCO, FCO, ICPO, CIS) a nuestro tamiz digital automatizado para verificar anomalías antes de firmar.",
    view_sample: "Ver Reporte de Muestra en Vivo: LLP R******L (Riesgo: 96/100)",
    tank_title: "Tanques de Rotterdam y Houston",
    tank_desc: "Verifica automáticamente las coordenadas de almacenamiento de tanques para detectar documentos de arrendamiento falsos.",
    domain_title: "Auditoría de Registro de Dominios",
    domain_desc: "Marca los dominios de remitentes registrados en los últimos 6 meses para detectar refinerías falsas.",
    signee_title: "Verificación de Identidad del Firmante",
    signee_desc: "Escanea registros de firmas, registros corporativos y bases de datos de listas negras.",
    agent_matrix_title: "Matriz Forense de 4 Agentes",
    agent_matrix_desc: "Utiliza la síntesis multi-agente para compilar un Certificado de Riesgo unificado.",
    free_beta: "Acceso Bêta Gratuito",
    verify_title: "Verifica Tu Oferta de Petróleo",
    promo_code: "Código de Acceso Promo",
    promo_desc: "El código promocional por defecto está activo para escaneos de validación ilimitados gratuitos.",
    email: "Correo Corporativo *",
    phone: "Teléfono de Contacto *",
    company: "Nombre de la Empresa (Opcional)",
    target_lang: "Idioma del Reporte Destino",
    drop_pdf: "Sube el PDF de la Oferta de Petróleo *",
    drag_drop: "Arrastra y suelta el archivo PDF",
    limit_desc: "SCO, FCO, CIS o cartas de arrendamiento hasta 10MB",
    agree_terms: "Acepto enviar este documento para auditoría criptográfica automatizada bajo los protocolos SURE.",
    scan_btn: "Buscar Fraudes en la Oferta",
    stay_page: "POR FAVOR PERMANECE EN ESTA PÁGINA. Procesar PDFs de petróleo grandes requiere cálculos intensos de IA (Hasta 3 minutos).",
    scan_progress: "Escaneo Forense de Documento en Progreso",
    scan_progress_desc: "El marco multi-agente verifica activamente coordenadas, cumplimiento e integridad.",
    progress_matrix: "Matriz de Progreso",
    scan_another: "Escanear Otra Oferta",
    forensic_result: "Resultado Forense",
    risk_score: "Puntuación de Matriz de Riesgo",
    exec_recs: "💡 Recomendaciones Ejecutivas",
    structural_findings: "🚨 Hallazgos Estructurales y Anomalías",
    no_anomalies: "✅ No se detectaron anomalías significativas de fraude de petróleo en este documento.",
    completed_on: "Escaneo completado el",
    certified_by: "Certificado por SURE.",
    node_roberto_role: "Integridad de Documento",
    node_moises_role: "Coherencia y Lógica",
    node_alcides_role: "Mapeo de Contexto",
    node_consolidator_role: "Certificado Ejecutivo",
    node_status_auditing: "Analizando...",
    node_status_finished: "Finalizado",
    node_status_standby: "En Espera",
    node_label: "NODO:",

    // Missing UI keys
    audited_transaction: "Transacción Auditada",
    forensic_certificate_text: "Certificado de Riesgo Forense (Texto)",
    copied: "¡Copiado!",
    copy_text: "Copiar Texto",
    formatting_report: "Análisis finalizado. Formateando informe...",
    footer_rights: "OilScam Alert & SURE Infrastructure Intelligence. Todos los derechos reservados.",

    // Log Keys
    log_initializing: "Inicializando el tamiz digital OilScam Alert...",
    log_access_granted: "Acceso concedido para: PORTAL DE ACCESO DEMO",
    log_retrieving_sample: "Recuperando el documento de muestra 'LLP_R******L_SCO_FAKE.pdf' de los archivos...",
    log_roberto_complete: "ROBERTO (Integridad de Documento) -> Análisis completo. 6 discrepancias críticas registradas.",
    log_moises_complete: "MOISÉS (Auditor de Coherencia) -> Análisis completo. 4 imposibilidades físicas encontradas.",
    log_alcides_complete: "ALCIDES (Especialista en Sanciones) -> Análisis completo. Riesgo de sanciones directas al ESPO ruso marcado.",
    log_consolidator_complete: "CONSOLIDATOR -> ¡Certificado Forense Transaccional generado con éxito!",
    log_uploading: "Subiendo documento de petróleo a la bóveda analítica segura...",
    log_documents_secured: "Documentos asegurados. Iniciando subagentes de IA analíticos especializados...",
    log_deploying_agent: "Desplegando a {param} ({param2}) para verificar anomalías...",
    log_agent_complete: "Análisis completo para el agente: {param}",
    log_consolidating: "Consolidando hallazgos de los subagentes. Ejecutando Síntesis Ejecutiva de Riesgos...",
    log_dispatching: "Certificado Forense compilado y enviado a: {param}",
    log_warning_formatting: "Advertencia: El formato del PDF se ha degradado ligeramente, mostrando el informe en formato de texto.",

    // Demo recommendations & anomalies
    demo_recommendations: "DETERMINACIÓN DE CONSOLIDADOR EJECUTIVO — IDENTIFICADA TENDENCIA DE RIESGO IRREVERSIBLE. Los tres agentes subordinados (ROBERTO, MOISÉS y ALCIDES) han emitido determinaciones de RECHAZO independientes. Sus hallazgos no son contradictorios — se refuerzan mutuamente en todas las dimensiones analíticas: identidad, estructura contractual, integridad química/técnica, precios y cumplimiento geopolítico/sanciones. Ningún elemento KYC positivo de ningún agente es suficiente para compensar los hallazgos críticos a continuación. Estimamos que no es posible revertir la tendencia de riesgo encontrada sobre la elegibilidad de este proveedor.\n\nPASOS ACCIONABLES (solo para fines de referencia y registro de debida diligencia — no se recomienda la interacción):\n1. NO TRANSFIERA NINGÚN FONDO bajo ningún término de pago descrito en este documento (MT103, transferencia bancaria TT u otro). Las estructuras de depósito anticipado del 2%/5%/10% en los tres procedimientos de transacción requieren transferencias bancarias SWIFT irreversibles a cuentas nominadas por el vendedor antes de la verificación de la carga. Este es el mecanismo principal de extracción financiera.\n2. NO FIRME ningún ICPO, SPA, CI, NCNDA o IMFPA con esta entidad sin una opinión legal previa e independiente.\n3. EXCLUSIÓN DE CRUDO ESPO: ESPO is a Russian pipeline crude grade. Labeling it as 'Kazakhstan origin' constitutes a factual misrepresentation exposing you to secondary sanctions under OFAC and EU regulations.\n4. EXCLUSIÓN DE JP54: Excluya inmediatamente a JP54 ('Colonial Grade 54') de cualquier discusión. Es una designación de producto ficticia utilizada en esquemas de fraude de productos básicos con tarifas pagadas por adelantado.\n5. AUDIT DE ESPECIFICACIONES TÉCNICAS: Las hojas de especificaciones contienen múltiples errores críticos (valores físicamente imposibles, unidades incorrectas, nombres fabricados 'Mathane' y 'Putanes') que indican que no fueron generadas por un laboratorio calificado.",

    demo_anomaly_01_title: "Apartamento Residencial como Sede Corporativa",
    demo_anomaly_01_desc: "La dirección operativa registrada de LLP R******L en las 15 páginas es '[REDACTED STREET ADDRESS], Balkhash, Kazajistán', un apartamento residencial. Una empresa que afirma tener capacidad para exportar hasta 3,000,000 de barriles al mes de crudo desde una dirección residencial representa una inconsistencia de credibilidad estructural del más alto nivel.",
    demo_anomaly_02_title: "Crudo ESPO: Tergiversación de Origen Crítica y Exposición a Sanciones",
    demo_anomaly_02_desc: "El documento ofrece 'CRUDO ESPO' con 'ORIGEN: KAZAJISTÁN'. ESPO es un crudo de oleoducto ruso transportado exclusivamente a través del sistema Transneft. Kazajistán no tiene conexión física con él. Cualquier parte que negocie este producto puede enfrentar una responsabilidad severa de sanciones secundarias bajo la OFAC y la UE.",
    demo_anomaly_03_title: "JP54 ('Colonial Grade 54'): Producto Comercial Ficticio",
    demo_anomaly_03_desc: "La oferta incluye 'COMBUSTIBLE DE AVIACIÓN COLONIAL GRADE 54 (JP54)'. JP54 no es un combustible de aviación civil estandarizado ni comercializado. Es reconocido universalmente en la literatura de investigación de fraudes petroleros como una designación ficticia utilizada en esquemas de tarifas por adelantado.",
    demo_anomaly_04_title: "Fuel Oil Virgen D6: Producto No Estandarizado a Volúmenes Imposibles",
    demo_anomaly_04_desc: "'D6 Virgin Fuel Oil' no corresponde a ningún estándar ISO/ASTM reconocido. La cantidad ofrecida de hasta 800,000,000 de galones por mes (aprox. 19,000,000 de barriles) equivale a un volumen de producción del top 10 mundial, a precios por debajo del costo física y económicamente imposibles.",
    demo_anomaly_05_title: "Mecanismo de Pago Anticipado (Depósitos 2%/5%/10%) Antes de Verificación",
    demo_anomaly_05_desc: "El comprador debe transferir depósitos bancarios irreversibles MT103 antes de la verificación de la carga. Esto incluye un pago del 10% a una 'compañía de depósito en garantía nominada por el vendedor' que está totalmente controlada por el vendedor. Este es el mecanismo principal de extracción financiera.",
    demo_anomaly_06_title: "Volúmenes de Suministro Agregados Inverosímiles de Forma Simultánea",
    demo_anomaly_06_desc: "El documento afirma simultáneamente tener capacidad para suministrar hasta 3,000,000 BBL/mes de Jet A-1, ESPO Crude y JP54, junto con 800,000,000 de galones/mes de D6 y enormes volúmenes de Mazut, GLP y GNL. Este volumen agregado supera la capacidad total de exportación de múltiples países juntos.",
    demo_anomaly_07_title: "Precios por Debajo del Mercado en Todos los Productos (Patrón de Cebo)",
    demo_anomaly_07_desc: "Todos los productos se ofrecen a precios significativamente inferiores a los del mercado (por ejemplo, crudo ESPO a 46–52 $/BBL CIF frente a los 65–75 $/BBL del mercado spot). Esta es una táctica de manipulación para eludir los controles corporativos.",
    demo_anomaly_08_title: "Especificación EN590: Tres Incumplimientos Técnicos Mayores",
    demo_anomaly_08_desc: "La hoja de especificaciones contiene imposibilidades físicas: (1) Valor CFPP de verano declarado como +50.0°C (el máximo legal es +5.0°C); (2) Estabilidad a la oxidación declarada como 460 g/m³ (el máximo es 25 g/m³, error de copiar y pegar); (3) Hidrocarburos Aromáticos Policíclicos al 11.0% m/m (máximo legal es 8.0% m/m).",
    demo_anomaly_09_title: "Especificación Jet A-1: Cuatro Errores Técnicos Fundamentales",
    demo_anomaly_09_desc: "Contiene errores críticos: (1) Punto de inflamación declarado como 'Max 42°C' en lugar de Min 38°C; (2) Punto de humo declarado en 'Mj/Lkg' en lugar de mm; (3) Energía específica neta declarada como 'Min 19 Mm' en lugar de Min 42.8 MJ/kg; (4) Unidad de densidad declarada como 'Kg/m²' (unidad de superficie) en lugar de Kg/m³.",
    demo_anomaly_10_title: "Especificación GLP: Describe Gas Natural, Parámetros Incorrectos",
    demo_anomaly_10_desc: "Declares a minimum methane content of 85.0 Mol%, describing pipeline-quality natural gas (LNG), not Liquefied Petroleum Gas (which must contain >90% propane/butanes). Además, enumera nombres químicos fabricados 'MATHANE' y 'PUTANES' en lugar de metano y butanos.",
    demo_anomaly_11_title: "Etiquetado Crítico Pág. 14: Petcoke Etiquetado como Crudo ESPO",
    demo_anomaly_11_desc: "La tabla enumera una 'Densidad real de 2.10 g/cm³' (la densidad del crudo es ~0.85; 2.10 coincide con el coque calcinado) junto con distribuciones de humedad, cenizas y tamaño de partículas superiores a 8 mm. Esta hoja de datos de petcoke etiquetada como crudo ESPO indica un grave fallo de ensamblaje.",
    demo_anomaly_12_title: "Puerto de Carga Listado como 'TBA' (Por Anunciar) en Todos los Productos",
    demo_anomaly_12_desc: "Enumera 'TBA' (To Be Announced) como el puerto de carga para los nueve productos. En el comercio CIF legítimo, el puerto de carga es un elemento legalmente requerido para calcular el flete y tránsito. Su ausencia impide cualquier validación logística.",
    demo_anomaly_13_title: "Discrepancia del Nombre del Director e Identidad Incomprobable",
    demo_anomaly_13_desc: "Deletrea el apellido del Director General como 'M*********' en el bloque de firmas y 'M*********' en el cuerpo del texto. Además, ningún perfil público, registro corporativo o directorio industrial corrobora la existencia o historial de este individuo.",
    demo_anomaly_14_title: "Fallo de Ensamblaje del Modulo y Páginas Duplicadas",
    demo_anomaly_14_desc: "Las páginas 2 y 3 son duplicados exactos entre sí. Los parámetros volátiles, las tablas de petcoke y las unidades de densidad están transpuestos en varias secciones, lo que confirma un documento ensamblado a partir de plantillas fraudulentas preexistentes.",

    demo_raw_report: "DETERMINACIÓN EJECUTIVA: LLP R******L\n========================================\nPUNTUACIÓN DE RIESGO: 96/100 | ESTADO: RECHAZADO\n\nRECOMENDACIONES EJECUTIVAS:\nLos tres agentes subordinados (ROBERTO, MOISÉS y ALCIDES) han emitido decisiones de RECHAZO independientes. Sus hallazgos se refuerzan mutuamente. Estimamos que no es posible revertir la tendencia de riesgo encontrada sobre este proveedor.\n\nHALLAZGOS CRÍTICOS:\n1. Apartamento residencial como sede corporativa.\n2. Crudo ESPO: Falsificación de origen y riesgo de sanciones.\n3. JP54 ('Colonial Grade 54'): Producto comercial ficticio.\n4. Fuel Oil Virgen D6: Volúmenes imposibles a precios falsos.\n5. Método de pago anticipado (Depósitos bancarios 2%/5%/10%) sin verificación de carga."
  },
  fr: {
    live_scanner: "Scanner en Direct",
    badge_stop: "Arrêtez Instantanément les Escroqueries au Pétrole",
    title_1: "Auditez Vos Offres de Pétrole en",
    title_2: "Temps Réel avec l'IA.",
    desc: "Le commerce des matières premières est miné par les sociétés écrans, les fausses lettres de réservoir et les domaines de raffinerie piratés. Déposez vos offres PDF (SCO, FCO, ICPO, CIS) dans notre passoire numérique automatisée pour vérifier les anomalies avant de signer.",
    view_sample: "Voir le Rapport d'Échantillon en Direct: LLP R******L (Score de Risque: 96/100)",
    tank_title: "Réservoirs Rotterdam & Houston",
    tank_desc: "Vérifie automatiquement les coordonnées de stockage des réservoirs pour repérer les faux documents de location.",
    domain_title: "Audit du Registre des Domaines",
    domain_desc: "Signale les domaines d'expéditeurs enregistrés depuis moins de 6 mois pour repérer les fausses raffineries.",
    signee_title: "Vérification de l'Identité du Signataire",
    signee_desc: "Parcourt les registres de signatures, les enregistrements d'entreprises et les bases de données de listes noires.",
    agent_matrix_title: "Matrice Forensique à 4 Agents",
    agent_matrix_desc: "Utilise la synthèse multi-agents pour compiler un Certificat de Risque unifié.",
    free_beta: "Accès Bêta Gratuit",
    verify_title: "Vérifiez Votre Offre de Pétrole",
    promo_code: "Code d'Accès Promotionnel",
    promo_desc: "Le code promo par défaut est actif pour des analyses de validation gratuites et illimitées.",
    email: "E-mail de l'Entreprise *",
    phone: "Téléphone de Contact *",
    company: "Nom de l'Entreprise (Optionnel)",
    target_lang: "Langue Cible du Rapport",
    drop_pdf: "Déposer le PDF de l'Offre de Pétrole *",
    drag_drop: "Glisser & Déposer le fichier PDF",
    limit_desc: "SCO, FCO, CIS, ou lettres de location jusqu'à 10 Mo",
    agree_terms: "J'accepte de soumettre ce document pour un audit cryptographique automatisé selon les protocoles SURE.",
    scan_btn: "Scanner l'Offre pour les Fraudes",
    stay_page: "VEUILLEZ RESTER SUR CETTE PAGE. Le traitement des PDF de pétrole volumineux nécessite des calculs d'IA intenses (Jusqu'à 3 minutes).",
    scan_progress: "Analyse Forensique du Document en Cours",
    scan_progress_desc: "Le cadre multi-agents vérifie activement les coordonnées, la conformité et l'intégrité.",
    progress_matrix: "Matrice de Progression",
    scan_another: "Scanner une Autre Offre",
    forensic_result: "Résultat Forensique",
    risk_score: "Score de la Matrice de Risque",
    exec_recs: "💡 Recommandations Exécutives",
    structural_findings: "🚨 Anomalies & Constats Structurels",
    no_anomalies: "✅ Aucune anomalie majeure de fraude pétrolière détectée dans ce document.",
    completed_on: "Analyse complétée le",
    certified_by: "Certifié par SURE.",
    node_roberto_role: "Intégrité du Document",
    node_moises_role: "Cohérence & Logique",
    node_alcides_role: "Cartographie Contextuelle",
    node_consolidator_role: "Certificat Exécutif",
    node_status_auditing: "Analyse...",
    node_status_finished: "Terminé",
    node_status_standby: "En Attente",
    node_label: "NŒUD:",

    // Missing UI keys
    audited_transaction: "Transaction Auditée",
    forensic_certificate_text: "Certificat de Risque Forensique (Texte)",
    copied: "Copié !",
    copy_text: "Copier le texte",
    formatting_report: "Analyse terminée. Formatage du rapport...",
    footer_rights: "OilScam Alert & SURE Infrastructure Intelligence. Tous droits réservés.",

    // Log Keys
    log_initializing: "Initialisation du tamis numérique OilScam Alert...",
    log_access_granted: "Accès accordé pour : PORTAIL D'ACCÈS DE DÉMO",
    log_retrieving_sample: "Récupération du document d'échantillon 'LLP_R******L_SCO_FAKE.pdf' depuis les archives...",
    log_roberto_complete: "ROBERTO (Intégrité du document) -> Analyse complétée. 6 divergences critiques enregistrées.",
    log_moises_complete: "MOISÉS (Auditeur de cohérence) -> Analyse complétée. 4 impossibilités physiques trouvées.",
    log_alcides_complete: "ALCIDES (Cartographie contextuelle) -> Analyse complétée. Risque de sanctions directes sur l'ESPO russe signalé.",
    log_consolidator_complete: "CONSOLIDATOR -> Certificat de transaction forensique généré avec succès !",
    log_uploading: "Téléchargement du document pétrolier vers la chambre d'analyse sécurisée...",
    log_documents_secured: "Documents sécurisés. Démarrage des sous-agents IA d'analyse spécialisés...",
    log_deploying_agent: "Déploiement de {param} ({param2}) pour vérifier les anomalies...",
    log_agent_complete: "Analyse complétée pour l'agent : {param}",
    log_consolidating: "Consolidation des résultats des sous-agents. Exécution de la synthèse exécutive des risques...",
    log_dispatching: "Certificat forensique compilé et envoyé à : {param}",
    log_warning_formatting: "Attention : Formatage du PDF légèrement dégradé, affichage du rapport au format texte.",

    // Demo recommendations & anomalies
    demo_recommendations: "DÉTERMINATION DU CONSOLIDATEUR EXÉCUTIF — TENDANCE DE RISQUE IRRÉVERSIBLE IDENTIFIÉE. Les trois agents subordonnés (ROBERTO, MOISÉS et ALCIDES) ont émis des décisions indépendantes de REJET. Leurs conclusions ne sont pas contradictoires — elles se renforcent mutuellement dans toutes les dimensions analytiques : identité, structure contractuelle, intégrité chimique/technique, tarification et conformité géopolitique/sanctions. Aucun élément de KYC positif de la part d'un agent n'est suffisant pour compenser les conclusions critiques ci-dessous. Nous estimons qu'il n'est pas possible d'inverser la tendance de risque concernant l'éligibilité de ce fournisseur.\n\nMESURES ACTIONNABLES (pour référence et archive de diligence raisonnable uniquement — l'engagement n'est pas recommandé) :\n1. NE TRANSFÉREZ AUCUN FOND sous aucune condition de paiement décrite dans ce document (MT103, virement TT ou autre). Les structures de dépôt de garantie de 2%/5%/10% dans les trois procédures de transaction exigent des virements bancaires SWIFT irréversibles vers des comptes désignés par le vendeur avant la vérification de la cargaison. C'est le principal mécanisme d'extraction financière.\n2. NE SIGNEZ aucun ICPO, SPA, CI, NCNDA ou IMFPA avec cette entité sans un avis juridique préalable et indépendant.\n3. EXCLUSION DU BRUT ESPO : L'ESPO est une qualité de brut russe transportée par pipeline. Le déclarer comme étant 'd'origine Kazakhstan' constitue une fausse déclaration vous exposant à des sanctions secondaires en vertu des réglementations de l'OFAC et de l'UE.\n4. EXCLUSION DU JP54 : Excluez immédiatement le JP54 ('Colonial Grade 54') de toute discussion. Il s'agit d'une désignation de produit fictive utilisée dans les escroqueries de matières premières à frais avancés.\n5. AUDIT DES SPÉCIFICATIONS TECHNIQUES : Les fiches techniques contiennent de multiples erreurs critiques (valeurs physiquement impossibles, mauvaises unités, noms fabriqués 'Mathane' and 'Putanes') indiquant qu'elles n'ont pas été générées par un laboratoire qualifié.",

    demo_anomaly_01_title: "Appartement Résidentiel comme Siège Social",
    demo_anomaly_01_desc: "L'adresse opérationnelle enregistrée de LLP R******L sur les 15 pages est '[REDACTED STREET ADDRESS], Balkhash, Kazakhstan' — un appartement résidentiel. Une entreprise prétendant exporter jusqu'à 3 000 000 de barils/mois de pétrole brut depuis une adresse résidentielle représente une incohérence de crédibilité structurelle de premier ordre.",
    demo_anomaly_02_title: "Brut ESPO : Fausse Déclaration d'Origine Critique & Risque de Sanctions",
    demo_anomaly_02_desc: "Le document propose du 'BRUT ESPO' avec 'ORIGINE : KAZAKHSTAN'. L'ESPO est une qualité de brut de pipeline russe exclusivement transportée via le système Transneft. Le Kazakhstan n'a aucun lien physique avec ce brut. Toute partie négociant ce produit s'expose à de graves sanctions de l'OFAC et de l'UE.",
    demo_anomaly_03_title: "JP54 ('Colonial Grade 54') : Produit Commercial Fictif",
    demo_anomaly_03_desc: "L'offre comprend du 'CARBURANT D'AVIATION JP54'. Le JP54 n'est pas un carburant d'aviation civile standardisé ou négocié commercialement. Il est universellement reconnu dans la littérature d'enquête sur les fraudes pétrolières comme une désignation fictive utilisée dans les fraudes à frais avancés.",
    demo_anomaly_04_title: "Fuel Oil Vierge D6 : Produit Non Standardisé à des Volumes Physiquement Impossibles",
    demo_anomaly_04_desc: "Le 'D6 Virgin Fuel Oil' ne correspond à aucune norme ISO/ASTM reconnue. La quantité offerte de 800 000 000 de gallons par mois (environ 19 000 000 de barils) équivaut au volume d'un top 10 des producteurs mondiaux, à des prix défiant toute concurrence physiquement et économiquement impossibles.",
    demo_anomaly_05_title: "Mécanisme de Paiement Anticipé (Dépôts de 2%/5%/10%) Avant Vérification",
    demo_anomaly_05_desc: "L'adresse e-mail ou le compte de dépôt est à transférer par virement irréversible MT103 avant la vérification de cargaison. Cela comprend un paiement de 10% à une 'société séquestre désignée par le vendeur' entièrement contrôlée par le vendeur. Il s'agit du principal mécanisme d'extraction financière.",
    demo_anomaly_06_title: "Volume d'Approvisionnement Global Implausible sur Neuf Produits Simultanément",
    demo_anomaly_06_desc: "Le document revendique simultanément la capacité de fournir jusqu'à 3 000 000 barils/mois de Jet A-1, de brut ESPO et de JP54, ainsi que 800 000 000 gallons/mois de D6 et d'énormes volumes de Mazut, GPL et GNL. Ce volume combiné dépasse la capacité d'exportation totale de plusieurs pays exportateurs réunis.",
    demo_anomaly_07_title: "Tarification Inférieure au Marché sur Tous les Produits (Modèle d'Appât)",
    demo_anomaly_07_desc: "Tous les produits sont proposés à des prix nettement inférieurs aux références du marché (ex : brut ESPO à 46-52 $/baril CIF contre 65-75 $/baril sur le marché). Il s'agit d'une tactique de manipulation psychologique conçue pour contourner les contrôles de diligence raisonnable.",
    demo_anomaly_08_title: "Spécification EN590 : Trois Non-Conformités Techniques Majeures",
    demo_anomaly_08_desc: "La fiche technique contient des impossibilités physiques : (1) Valeur CFPP d'été déclarée à +50,0°C (le maximum légal est de +5,0°C) ; (2) Stabilité à l'oxydation déclarée à 460 g/m³ (le maximum légal est de 25 g/m³, montrant une erreur de copier-coller) ; (3) Hydrocarbures aromatiques polycycliques à 11,0% m/m (le maximum légal est de 8,0% m/m).",
    demo_anomaly_09_title: "Spécification Jet A-1 : Quatre Erreurs Techniques Fondamentales",
    demo_anomaly_09_desc: "Contient des erreurs critiques : (1) Point d'éclair déclaré à 'Max 42°C' au lieu de Min 38°C ; (2) Point de fumée déclaré en 'Mj/Lkg' au lieu de mm ; (3) Énergie spécifique nette déclarée comme 'Min 19 Mm' au lieu de Min 42.8 MJ/kg ; (4) Unité de densité déclarée en 'Kg/m²' (une unité de surface) au lieu de Kg/m³.",
    demo_anomaly_10_title: "Spécification GPL : Décrit du Gaz Naturel avec Paramètres Incohérents",
    demo_anomaly_10_desc: "Déclare une teneur minimale en méthane de 85,0 Mol%, décrivant du gaz naturel de qualité pipeline (GNL), et non du gaz de pétrole liquéfié (qui doit contenir plus de 90% de propane/butane). De plus, il liste des noms chimiques fabriqués 'MATHANE' et 'PUTANES' au lieu de méthane et butane.",
    demo_anomaly_11_title: "Erreur d'Étiquetage Critique Page 14 : Paramètres du Coke de Pétrole Étiquetés comme Brut ESPO",
    demo_anomaly_11_desc: "Le tableau indique une 'Densité réelle de 2,10 g/cm³' (la densité du brut est d'environ 0,85 ; 2,10 correspond au coke calciné) ainsi que la teneur en humidité, en cendres et la distribution de la taille des particules supérieure à 8 mm. Cette fiche technique de coke de pétrole étiquetée comme brut ESPO indique une grave défaillance d'assemblage de documents.",
    demo_anomaly_12_title: "Port de Chargement Indiqué comme 'À Déterminer' sur Tous les Produits",
    demo_anomaly_12_desc: "Indique 'TBA' (To Be Announced) comme port de chargement pour les neuf produits. Dans les transactions CIF légitimes, le terminal de chargement est un élément légalement requis pour calculer le fret, l'assurance et le transit. Son absence empêche toute validation logistique.",
    demo_anomaly_13_title: "Divergence du Nom du Directeur & Identité Exécutive Invérifiable",
    demo_anomaly_13_desc: "L'orthographe du nom de famille du directeur général est écrite 'M*********' dans le bloc de signature et 'M*********' dans le corps du texte. De plus, aucun profil public, registre d'entreprise ou annuaire industriel ne corrobore l'existence ou l'historique de cet individu.",
    demo_anomaly_14_title: "Défaillance d'Assemblage du Modèle de Document & Pages Dupliquées",
    demo_anomaly_14_desc: "Les pages 2 et 3 sont des doublons textuels l'une de l'autre. Les paramètres volatils, les tableaux de coke de pétrole et les unités de densité sont transposés dans plusieurs sections, confirmant un document assemblé à partir de modèles frauduleux préexistants.",

    demo_raw_report: "DÉTERMINATION EXÉCUTIVE : LLP R******L\n========================================\nSCORE DE RISQUE : 96/100 | STATUT : REJETÉ\n\nRECOMMANDATIONS EXÉCUTIVES :\nLes trois agents subordonnés (ROBERTO, MOISÉS et ALCIDES) ont émis des décisions de REJET indépendantes. Leurs conclusions se renforcent mutuellement. Nous estimons qu'il n'est pas possible d'inverser la tendance de risque concernant ce fournisseur.\n\nANOMALIES CRITIQUES :\n1. Appartement résidentiel comme siège social.\n2. Brut ESPO : Fausse déclaration d'origine et risque de sanctions.\n3. JP54 ('Colonial Grade 54') : Produit commercial fictif.\n4. Fuel Oil Vierge D6 : Volumes impossibles à prix fictifs.\n5. Dépôts bancaires anticipés (2%/5%/10%) sans vérification de cargaison."
  },
  de: {
    live_scanner: "Live-Scanner",
    badge_stop: "Öl-Betrug sofort stoppen",
    title_1: "Prüfen Sie Ihre Ölangebote in",
    title_2: "Echtzeit mit KI.",
    desc: "Der Rohstoffhandel ist von Briefkastenfirmen, gefälschten Tankanweisungen und gehackten Raffinerie-Domains geplagt. Laden Sie Ihre PDF-Angebote (SCO, FCO, ICPO, CIS) in unser automatisisiertes digitales Sieb hoch, um Anomalien vor der Unterzeichnung zu prüfen.",
    view_sample: "Live-Musterbericht anzeigen: LLP R******L (Risiko-Score: 96/100)",
    tank_title: "Rotterdam & Houston Tanks",
    tank_desc: "Gleicht Tanklagerkoordinaten automatisch ab, um gefälschte Mietdokumente zu erkennen.",
    domain_title: "Domain-Registrierungs-Audit",
    domain_desc: "Markiert Absender-Domains, die in den letzten 6 Monaten registriert wurden, um gefälschte Raffinerien zu erkennen.",
    signee_title: "Identitätsprüfung des Unterzeichners",
    signee_desc: "Scannt Unterschriftenregister, Unternehmensregister und Blacklist-Datenbanken.",
    agent_matrix_title: "4-Agenten Forensik-Matrix",
    agent_matrix_desc: "Nutzt die Multi-Agenten-Synthese, um ein einheitliches Risikozertifikat zu erstellen.",
    free_beta: "Kostenloser Beta-Zugang",
    verify_title: "Prüfen Sie Ihr Ölangebot",
    promo_code: "Promo-Zugangscode",
    promo_desc: "Der Standard-Promo-Code ist für unbegrenzte kostenlose Validierungs-Scans aktiv.",
    email: "Unternehmens-E-Mail *",
    phone: "Kontakttelefon *",
    company: "Unternehmensname (Optional)",
    target_lang: "Berichtssprache",
    drop_pdf: "Ölangebot PDF hochladen *",
    drag_drop: "PDF-Datei hierher ziehen",
    limit_desc: "SCO, FCO, CIS oder Mietdokumente bis 10MB",
    agree_terms: "Ich stimme der Übermittlung dieses Dokuments zur automatischen kryptografischen Prüfung unter SURE-Protokollen zu.",
    scan_btn: "Angebot auf Betrug scannen",
    stay_page: "BITTE BLEIBEN SIE AUF DIESER SEITE. Die Verarbeitung großer PDFs erfordert intensive KI-Berechnungen (Bis zu 3 Minuten).",
    scan_progress: "Forensischer Dokumentenscan läuft",
    scan_progress_desc: "Das Multi-Agenten-Framework prüft aktiv Koordinaten, Compliance und Integrität.",
    progress_matrix: "Fortschrittsmatrix",
    scan_another: "Anderes Angebot scannen",
    forensic_result: "Forensisches Ergebnis",
    risk_score: "Risiko-Score",
    exec_recs: "💡 Executive Empfehlungen",
    structural_findings: "🚨 Strukturelle Anomalien",
    no_anomalies: "✅ Keine signifikanten Ölbetrugs-Anomalien in diesem Dokument gefunden.",
    completed_on: "Scan abgeschlossen am",
    certified_by: "Zertifiziert durch SURE.",
    node_roberto_role: "Dokumentenintegrität",
    node_moises_role: "Kohärenz & Logik",
    node_alcides_role: "Kontext-Mapping",
    node_consolidator_role: "Exekutiv-Zertifikat",
    node_status_auditing: "Prüfung...",
    node_status_finished: "Abgeschlossen",
    node_status_standby: "Standby",
    node_label: "KNOTEN:",

    // UI & logs fallback
    audited_transaction: "Geprüfte Transaktion",
    forensic_certificate_text: "Forensisches Risikozertifikat (Text)",
    copied: "Kopiert!",
    copy_text: "Text kopieren",
    formatting_report: "Analyse abgeschlossen. Bericht wird formatiert...",
    footer_rights: "OilScam Alert & SURE Infrastructure Intelligence. Alle Rechte vorbehalten."
  },
  pt: {
    live_scanner: "Scanner em Tempo Real",
    badge_stop: "Pare Golpes de Petróleo Instantaneamente",
    title_1: "Audite suas Ofertas de Petróleo em",
    title_2: "Tempo Real com IA.",
    desc: "O comércio de commodities é assolado por empresas de fachada, cartas de tanques falsificadas e domínios de refinarias hackeados. Envie suas ofertas em PDF (SCO, FCO, ICPO, CIS) em nossa peneira digital automatizada para verificar anomalias antes de assinar.",
    view_sample: "Visualizar Relatório de Amostra: LLP R******L (Pontuação de Risco: 96/100)",
    tank_title: "Tanques de Rotterdam & Houston",
    tank_desc: "Cruza automaticamente as coordenadas de armazenamento dos tanques para detectar documentos de aluguel falsos.",
    domain_title: "Auditoria de Registro de Domínio",
    domain_desc: "Sinaliza domínios de remetentes registrados em menos de 6 meses para identificar refinarias falsas.",
    signee_title: "Verificação de Identidade do Assinante",
    signee_desc: "Verifica registros de assinaturas, cadastros corporativos e bancos de dados de listas negras.",
    agent_matrix_title: "Matriz Forense de 4 Agentes",
    agent_matrix_desc: "Utiliza a síntese multi-agente para compilar um Certificado de Risco unificado.",
    free_beta: "Acesso Beta Gratuito",
    verify_title: "Verifique Sua Oferta de Petróleo",
    promo_code: "Código de Acesso Promocional",
    promo_desc: "O código promocional padrão está ativo para varreduras de validação gratuitas e ilimitadas.",
    email: "E-mail Corporativo *",
    phone: "Telefone de Contacto *",
    company: "Nome da Empresa (Opcional)",
    target_lang: "Idioma do Relatório",
    drop_pdf: "Enviar PDF da Oferta de Petróleo *",
    drag_drop: "Arraste e solte o arquivo PDF",
    limit_desc: "SCO, FCO, CIS ou cartas de aluguel de até 10MB",
    agree_terms: "Concordo em enviar este documento para auditoria criptográfica automatizada sob os protocolos SURE.",
    scan_btn: "Escanear Oferta Contra Golpes",
    stay_page: "POR FAVOR PERMANEÇA NESTA PÁGINA. O processamento de PDFs de petróleo grandes exige cálculos intensos de IA (Até 3 minutos).",
    scan_progress: "Varredura Forense de Documento em Progresso",
    scan_progress_desc: "O ecossistema multi-agente verifica ativamente coordenadas, conformidade e integridade.",
    progress_matrix: "Matriz de Progresso",
    scan_another: "Escanear Outra Oferta",
    forensic_result: "Resultado Forense",
    risk_score: "Pontuação de Risco",
    exec_recs: "💡 Recomendações Executivas",
    structural_findings: "🚨 Constatações Estruturais e Anomalias",
    no_anomalies: "✅ Nenhuma anomalia de golpe de petróleo detectada neste documento.",
    completed_on: "Varredura concluída em",
    certified_by: "Certificado por SURE.",
    node_roberto_role: "Integridade de Documento",
    node_moises_role: "Coerência e Lógica",
    node_alcides_role: "Mapeamento de Contexto",
    node_consolidator_role: "Certificado Executivo",
    node_status_auditing: "Analisando...",
    node_status_finished: "Concluído",
    node_status_standby: "Em Espera",
    node_label: "NÓ:",

    // UI & logs fallback
    audited_transaction: "Transação Auditada",
    forensic_certificate_text: "Certificado de Risco Forense (Texto)",
    copied: "Copiado!",
    copy_text: "Copiar texto",
    formatting_report: "Análise concluída. Formatando relatório...",
    footer_rights: "OilScam Alert & SURE Infrastructure Intelligence. Todos os direitos reservados."
  },
  zh: {
    live_scanner: "在线扫描仪",
    badge_stop: "立即阻止石油欺诈",
    title_1: "审查您的石油报价",
    title_2: "人工智能实时。",
    desc: "大宗商品交易饱受空壳公司、伪造油罐信函和被劫持炼油厂域名的困扰。将您的 PDF 报价（SCO、FCO、ICPO、CIS）拖入我们的自动化数字筛中，以便在签署任何内容之前验证异常情况。",
    view_sample: "查看实时样本报告：LLP R******L (风险评分: 96/100)",
    tank_title: "鹿特丹与休斯顿储罐",
    tank_desc: "自动交叉比对储罐存储坐标以查找虚假租赁文件。",
    domain_title: "域名注册审计",
    domain_desc: "标记在 6 个月内注册的发件人域名，以发现假冒的炼油厂。",
    signee_title: "签署人身份验证",
    signee_desc: "扫描签名注册表、企业注册信息和黑名单数据库。",
    agent_matrix_title: "4-智能体取证矩阵",
    agent_matrix_desc: "利用多智能体合成来编制统一的风险证书。",
    free_beta: "免费测试访问权",
    verify_title: "验证您的石油报价",
    promo_code: "促销访问代码",
    promo_desc: "默认促销代码已激活，可用于无限次免费验证扫描。",
    email: "企业电子邮箱 *",
    phone: "联系电话 *",
    company: "公司名称 (选填)",
    target_lang: "目标报告语言",
    drop_pdf: "拖入石油报价 PDF 文件 *",
    drag_drop: "拖放 PDF 文件",
    limit_desc: "SCO, FCO, CIS 或最高 10MB 的租赁信函",
    agree_terms: "我同意根据 SURE 协议提交此文件进行自动加密审计。",
    scan_btn: "扫描报价防诈骗",
    stay_page: "请在此页面停留。处理大型石油 PDF 需要密集的 AI 计算（最多需要 3 分钟）。",
    scan_progress: "取证文件扫描正在进行中",
    scan_progress_desc: "多智能体框架正在积极验证坐标、合规性和完整性。",
    progress_matrix: "进度矩阵",
    scan_another: "扫描另一个报价",
    forensic_result: "取证结果",
    risk_score: "风险矩阵评分",
    exec_recs: "💡 执行建议",
    structural_findings: "🚨 结构性发现与异常",
    no_anomalies: "✅ 在此文件中未检测到重大的商业石油欺诈异常。",
    completed_on: "扫描完成于",
    certified_by: "经 SURE 认证。",
    node_roberto_role: "文件完整性",
    node_moises_role: "一致性与逻辑",
    node_alcides_role: "上下文映射",
    node_consolidator_role: "行政证书",
    node_status_auditing: "审计中...",
    node_status_finished: "已完成",
    node_status_standby: "待命",
    node_label: "节点:",

    // UI & logs fallback
    audited_transaction: "审计的交易",
    forensic_certificate_text: "法医风险证书 (文本)",
    copied: "已复制!",
    copy_text: "复制文本",
    formatting_report: "分析完成。正在格式化报告...",
    footer_rights: "OilScam Alert & SURE Infrastructure Intelligence. 保留所有权利。"
  },
  ru: {
    live_scanner: "Живой сканер",
    badge_stop: "Мгновенно остановить нефтяное мошенничество",
    title_1: "Аудит ваших нефтяных предложений в",
    title_2: "Реальном времени с ИИ.",
    desc: "Торговля сырьевыми товарами наводнена фирмами-однодневками, поддельными письмами о резервуарах и угнанными доменами нефтеперерабатывающих заводов. Загрузите свои PDF-предложения (SCO, FCO, ICPO, CIS) в наше цифровое сито для проверки аномалий перед подписанием.",
    view_sample: "Посмотреть образец отчета: LLP R******L (Оценка риска: 96/100)",
    tank_title: "Резервуары в Роттердаме и Хьюстоне",
    tank_desc: "Автоматически сопоставляет координаты резервуаров для обнаружения поддельных документов об аренде.",
    domain_title: "Аудит реестра доменов",
    domain_desc: "Помечает домены отправителей, зарегистрированные в течение последних 6 месяцев, для обнаружения поддельных сайтов.",
    signee_title: "Верификация личности подписанта",
    signee_desc: "Сканирует реестры подписей, корпоративные регистрации и базы данных черных списков.",
    agent_matrix_title: "Судебная матрица из 4 агентов",
    agent_matrix_desc: "Использует мультиагентный синтез для компиляции единого сертификата риска.",
    free_beta: "Бесплатный бета-доступ",
    verify_title: "Проверьте свое нефтяное предложение",
    promo_code: "Промокод для доступа",
    promo_desc: "Промокод по умолчанию активен для неограниченного количества бесплатных сканирований.",
    email: "Корпоративный e-mail *",
    phone: "Контактный телефон *",
    company: "Название компании (Опционально)",
    target_lang: "Язык итогового отчета",
    drop_pdf: "Загрузить PDF-файл предложения *",
    drag_drop: "Перетащите PDF-файл сюда",
    limit_desc: "SCO, FCO, CIS или письма об аренде размером до 10 МБ",
    agree_terms: "Я согласен отправить этот документ для автоматического криптографического аудита по протоколам SURE.",
    scan_btn: "Сканировать предложение на мошенничество",
    stay_page: "ПОЖАЛУЙСТА, ОСТАВАЙТЕСЬ НА ЭТОЙ СТРАНИЦЕ. Обработка больших файлов требует интенсивных вычислений ИИ (До 3 минут).",
    scan_progress: "Выполняется сканирование документа",
    scan_progress_desc: "Мультиагентная платформа активно проверяет координаты, соответствие требованиям и целостность.",
    progress_matrix: "Матрица прогресса",
    scan_another: "Сканировать другое предложение",
    forensic_result: "Результат проверки",
    risk_score: "Оценка риска",
    exec_recs: "💡 Рекомендации руководства",
    structural_findings: "🚨 Выявленные аномалии и угрозы",
    no_anomalies: "✅ В этом документе не обнаружено признаков мошенничества с нефтью.",
    completed_on: "Сканирование завершено",
    certified_by: "Сертифицировано SURE.",
    node_roberto_role: "Целостность документа",
    node_moises_role: "Логика и последовательность",
    node_alcides_role: "Анализ контекста",
    node_consolidator_role: "Итоговый сертификат",
    node_status_auditing: "Анализ...",
    node_status_finished: "Готово",
    node_status_standby: "В ожидании",
    node_label: "УЗЕЛ:",

    // UI & logs fallback
    audited_transaction: "Проверенная транзакция",
    forensic_certificate_text: "Судебный сертификат риска (Текст)",
    copied: "Скопировано!",
    copy_text: "Копировать текст",
    formatting_report: "Анализ завершен. Форматирование отчета...",
    footer_rights: "OilScam Alert & SURE Infrastructure Intelligence. Все права защищены."
  },
  ar: {
    live_scanner: "ماسيح مباشر",
    badge_stop: "وقف احتيال النفط فوراً",
    title_1: "دقق عروض النفط الخاصة بك في",
    title_2: "الوقت الفعلي مع الذكاء الاصطناعي.",
    desc: "تجارة السلع موبوءة بالشركات الوهمية ورسائل الخزانات المزورة ونطاقات المصافي المخترقة. قم بإسقاط عروض PDF الخاصة بك (SCO, FCO, ICPO, CIS) في غربالنا الرقمي الآلي للتحقق من العيوب قبل توقيع أي شيء.",
    view_sample: "عرض تقرير العينة المباشر: LLP R******L (درجة الخطورة: 96/100)",
    tank_title: "خزانات روتردام وهيوستن",
    tank_desc: "يقوم بمطابقة إحداثيات تخزين الخزان تلقائيًا لاكتشاف مستندات الإيجار المزيفة.",
    domain_title: "تدقيق سجل النطاق",
    domain_desc: "يعلم نطاقات المرسلين المسجلين في غضون 6 أشهر لاكتشاف المصافي المزيفة.",
    signee_title: "التحقق من هوية الموقع",
    signee_desc: "يمسح سجلات التواقيع والتسجيلات المؤسسية وقواعد بيانات القوائم السوداء.",
    agent_matrix_title: "مصفوفة التحليل الجنائي من 4 وكلاء",
    agent_matrix_desc: "يستفيد من التوليف متعدد الوكلاء لتجميع شهادة مخاطر موحدة.",
    free_beta: "وصول تجريبي مجاني",
    verify_title: "التحقق من عرض النفط الخاص بك",
    promo_code: "رمز الوصول الترويجي",
    promo_desc: "الرمز الترويجي الافتراضي نشط لعمليات مسح تحقق مجانية غير محدودة.",
    email: "البريد الإلكتروني للشركة *",
    phone: "هاتف الاتصال *",
    company: "اسم الشركة (اختياري)",
    target_lang: "لغة التقرير المستهدفة",
    drop_pdf: "إسقاط ملف PDF لعرض النفط *",
    drag_drop: "سحب وإفلات ملف PDF",
    limit_desc: "SCO أو FCO أو CIS أو خطابات إيجار تصل إلى 10 ميجابايت",
    agree_terms: "أوافق على تقديم هذا المستند للتدقيق التشفيري الآلي بموجب بروتوكولات SURE.",
    scan_btn: "مسح العرض بحثًا عن الاحتيال",
    stay_page: "يرجى البقاء في هذه الصفحة. يتطلب معالجة ملفات PDF الكبيرة للنفط حسابات مكثفة للذكاء الاصطناعي (تصل إلى 3 دقائق).",
    scan_progress: "مسح مستندات الأدلة الجنائية قيد التنفيذ",
    scan_progress_desc: "يقوم الإطار متعدد الوكلاء بالتحقق بفاعلية من الإحداثيات والامتثال والنزاهة.",
    progress_matrix: "مصفوفة التقدم",
    scan_another: "مسح عرض آخر",
    forensic_result: "النتيجة الجنائية",
    risk_score: "درجة مصفوفة المخاطر",
    exec_recs: "💡 التوصيات التنفيذية",
    structural_findings: "🚨 التشوهات المكتشفة والنتائج الهيكلية",
    no_anomalies: "✅ لم يتم الكشف عن أي عيوب احتيال نفطي تجاري ذات أهمية في هذا المستند.",
    completed_on: "اكتمل المسح في",
    certified_by: "معتمد من SURE.",
    node_roberto_role: "سلامة المستندات",
    node_moises_role: "الاتساق والمنطق",
    node_alcides_role: "رسم خرائط السياق",
    node_consolidator_role: "الشهادة التنفيذية",
    node_status_auditing: "تدقيق...",
    node_status_finished: "انتهى",
    node_status_standby: "في الانتظار",
    node_label: "عقدة:",

    // UI & logs fallback
    audited_transaction: "المعاملة المدققة",
    forensic_certificate_text: "شهادة مخاطر جنائية (نصية)",
    copied: "تم النسخ!",
    copy_text: "نسخ النص",
    formatting_report: "اكتمل التحليل. جاري تنسيق التقرير...",
    footer_rights: "OilScam Alert & SURE Infrastructure Intelligence. جميع الحقوق محفوظة."
  },
  hi: {
    live_scanner: "लाइव स्कैनर",
    badge_stop: "पेट्रोलियम धोखाधड़ी तुरंत रोकें",
    title_1: "अपने पेट्रोलियम प्रस्तावों का ऑडिट करें",
    title_2: "एआई के साथ वास्तविक समय में।",
    desc: "कमोडिटी ट्रेडिंग शेल कंपनियों, जाली टैंक पत्रों और अपहृत रिफाइनरी डोमेन से ग्रस्त है। किसी भी चीज़ पर हस्ताक्षर करने से पहले विसंगतियों को सत्यापित करने के लिए अपने पीडीएफ प्रस्तावों (SCO, FCO, ICPO, CIS) को हमारे स्वचालित डिजिटल छलनी में डालें।",
    view_sample: "लाइव नमूना रिपोर्ट देखें: LLP R******L (जोखिम स्कोर: 96/100)",
    tank_title: "रॉटरडैम और ह्यूस्टन टैंक",
    tank_desc: "फर्जी पट्टा दस्तावेजों के लिए टैंक भंडारण निर्देशांक को स्वचालित रूप से क्रॉस-रेफरेंस करता.",
    domain_title: "डोमेन रजिस्ट्री ऑडिट",
    domain_desc: "फर्जी रिफाइनरियों को खोजने के लिए 6 महीने के भीतर पंजीकृत प्रेषक डोमेन को फ़्लैग करता है।",
    signee_title: "हस्ताक्षरकर्ता पहचान सत्यापन",
    signee_desc: "हस्ताक्षर रजिस्ट्रियों, कॉर्पोरेट पंजीकरणों और ब्लैकलिस्ट डेटाबेस को स्कैन करता है।",
    agent_matrix_title: "4-एजेंट फोरेंसिक मैट्रिक्स",
    agent_matrix_desc: "एक एकीकृत जोखिम प्रमाणपत्र संकलित करने के लिए बहु-एजेंट संश्लेषण का उपयोग करता है।",
    free_beta: "मुफ़्त बीटा एक्सेस",
    verify_title: "अपने पेट्रोलियम ऑफ़र को सत्यापित करें",
    promo_code: "प्रोमो एक्सेस कोड",
    promo_desc: "असीमित मुफ्त सत्यापन स्कैन के लिए डिफ़ॉल्ट प्रोमो कोड सक्रिय है।",
    email: "कॉर्पोरेट ईमेल *",
    phone: "संपर्क फोन *",
    company: "कंपनी का नाम (वैकल्पिक)",
    target_lang: "लक्षित रिपोर्ट भाषा",
    drop_pdf: "पेट्रोलियम ऑफ़र पीडीएफ डालें *",
    drag_drop: "पीडीएफ फाइल खींचें और छोड़ें",
    limit_desc: "SCO, FCO, CIS या 10MB तक के लीज पत्र",
    agree_terms: "मैं SURE प्रोटोकॉल के तहत स्वचालित क्रिप्टोग्राफ़िक ऑडिट के लिए इस दस्तावेज़ को सबमिट करने के लिए सहमत हूँ।",
    scan_btn: "घोटाले के लिए ऑफ़र स्कैन करें",
    stay_page: "कृपया इस पृष्ठ पर बने रहें। बड़े पेट्रोलियम पीडीएफ को संसाधित करने के लिए गहन एआई गणना की आवश्यकता होती है (3 मिनट तक)।",
    scan_progress: "फोरेंसिक दस्तावेज़ स्कैन प्रगति पर है",
    scan_progress_desc: "बहु-एजेंट ढांचा सक्रिय रूप से निर्देशांक, अनुपालन और अखंडता की पुष्टि कर रहा है।",
    progress_matrix: "प्रगति मैट्रिक्स",
    scan_another: "दूसरा ऑफ़र स्कैन करें",
    forensic_result: "फोरेंसिक परिणाम",
    risk_score: "जोखिम स्कोर",
    exec_recs: "💡 कार्यकारी सिफारिशें",
    structural_findings: "🚨 संरचनात्मक निष्कर्ष और विसंगतियां",
    no_anomalies: "✅ इस दस्तावेज़ में कोई महत्वपूर्ण पेट्रोलियम घोटाला विसंगति नहीं पाई गई।",
    completed_on: "स्कैन पूरा हुआ",
    certified_by: "SURE द्वारा प्रमाणित।",
    node_roberto_role: "दस्तावेज़ अखंडता",
    node_moises_role: "सामंजस्य और तर्क",
    node_alcides_role: "संदर्भ मानचित्रण",
    node_consolidator_role: "कार्यकारी प्रमाणपत्र",
    node_status_auditing: "ऑडिटिंग...",
    node_status_finished: "समाप्त",
    node_status_standby: "स्टैंडबाय",
    node_label: "नोड:",

    // UI & logs fallback
    audited_transaction: "ऑडिट किया गया लेन-देन",
    forensic_certificate_text: "फोरेंसिक जोखिम प्रमाणपत्र (पाठ)",
    copied: "कॉपी किया गया!",
    copy_text: "पाठ कॉपी करें",
    formatting_report: "विश्लेषण पूरा हुआ। रिपोर्ट प्रारूपित की जा रही है...",
    footer_rights: "OilScam Alert & SURE Infrastructure Intelligence. सभी अधिकार सुरक्षित।"
  }
};

const AgentStatusNode = ({ id, name, role, status, icon: Icon, t }: any) => {
  const isRunning = status === 'running';
  const isSuccess = status === 'success';

  const translatedRole = 
    role === 'Document Integrity' ? t('node_roberto_role') :
    role === 'Coherence & Logic' ? t('node_moises_role') :
    role === 'Context Mapping' ? t('node_alcides_role') :
    role === 'Executive Certificate' ? t('node_consolidator_role') : role;

  const statusText = 
    isRunning ? t('node_status_auditing') :
    isSuccess ? t('node_status_finished') : t('node_status_standby');

  return (
    <div className={`p-5 rounded-2xl border transition-all duration-500 ${
      isRunning ? 'border-red-500 bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.25)] animate-pulse' :
      isSuccess ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]' :
      'border-slate-800 bg-slate-900/60'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
          isRunning ? 'border-red-500/50 text-red-400' :
          isSuccess ? 'border-emerald-500/50 text-emerald-400' :
          'border-slate-800 text-slate-500'
        }`}>
          {isRunning ? <Loader2 className="w-5 h-5 animate-spin" /> : 
           isSuccess ? <CheckCircle2 className="w-5 h-5" /> : 
           <Icon className="w-5 h-5" />}
        </div>
        <div className="text-right">
          <div className="text-[10px] font-mono text-slate-500">{t('node_label')} {id}</div>
          <div className={`text-[9px] font-mono font-bold uppercase ${
            isRunning ? 'text-red-400' :
            isSuccess ? 'text-emerald-400' : 'text-slate-600'
          }`}>
            {statusText}
          </div>
        </div>
      </div>
      <div>
        <h4 className={`text-sm font-bold ${isRunning || isSuccess ? 'text-white' : 'text-slate-400'}`}>{name}</h4>
        <p className="text-[9px] text-slate-500 uppercase tracking-wider">{translatedRole}</p>
      </div>
    </div>
  );
};

export default function OilScamAlertPage() {
  const { language, setLanguage } = useLanguage();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [reportLanguage, setReportLanguage] = useState('en');
  const [userContext, setUserContext] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [betaCode, setBetaCode] = useState('');
  const [isBetaActive, setIsBetaActive] = useState(true);

  // Force English by default on mounting /oilscam
  useEffect(() => {
    setLanguage('en');
    setReportLanguage('en');
  }, []);

  const t = (key: string) => {
    return oilscamTranslations[language]?.[key] || oilscamTranslations["en"]?.[key] || key;
  };

  const [status, setStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [progress, setProgress] = useState(0);
  
  // Real-time localizable logs state
  const [logs, setLogs] = useState<any[]>([]);
  
  const [finalReport, setFinalReport] = useState<any | null>(null);
  const [rawReport, setRawReport] = useState<string | null>(null);
  const [parseError, setParseError] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [agentStatus, setAgentStatus] = useState<Record<string, 'idle'|'running'|'success'|'error'>>({
    roberto: 'idle', moises: 'idle', alcides: 'idle', consolidator: 'idle'
  });

  const addLog = (key: string, param?: string, param2?: string) => {
    setLogs((prev) => [...prev, {
      time: new Date().toLocaleTimeString(),
      key,
      param,
      param2
    }]);
  };

  const renderLogText = (log: any) => {
    const timeStr = `[${log.time}] `;
    let message = t(log.key);
    if (log.param) {
      message = message.replace('{param}', log.param);
    }
    if (log.param2) {
      message = message.replace('{param2}', log.param2);
    }
    return timeStr + message;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleCopy = () => {
    const currentRawReport = finalReport?.isDemo ? t('demo_raw_report') : rawReport;
    if (currentRawReport) {
      navigator.clipboard.writeText(currentRawReport);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLoadDemo = () => {
    setLogs([
      { time: new Date().toLocaleTimeString(), key: 'log_initializing' },
      { time: new Date().toLocaleTimeString(), key: 'log_access_granted' },
      { time: new Date().toLocaleTimeString(), key: 'log_retrieving_sample' },
      { time: new Date().toLocaleTimeString(), key: 'log_roberto_complete' },
      { time: new Date().toLocaleTimeString(), key: 'log_moises_complete' },
      { time: new Date().toLocaleTimeString(), key: 'log_alcides_complete' },
      { time: new Date().toLocaleTimeString(), key: 'log_consolidator_complete' }
    ]);
    setAgentStatus({
      roberto: 'success',
      moises: 'success',
      alcides: 'success',
      consolidator: 'success'
    });
    setRawReport('demo_raw_report');
    setFinalReport({
      isDemo: true,
      companyName: 'LLP R******L ("R******L COMPANY" LLP) [ANONYMIZED]',
      riskScore: 96,
      dateGenerated: new Date().toLocaleDateString()
    });
    setProgress(100);
    setStatus('success');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !phone || files.length === 0) {
      setErrorMessage("Please fill all required fields and upload at least one document.");
      return;
    }
    if (!acceptedTerms) {
      setErrorMessage("You must accept the terms of the digital review.");
      return;
    }

    try {
      setStatus('uploading');
      setErrorMessage('');
      setLogs([]);
      addLog('log_initializing');

      if (isBetaActive && betaCode.trim() && betaCode.toUpperCase() !== 'OILFREE26') {
        throw new Error("Invalid Beta Access Code. Please use 'OILFREE26' for free promotional scanning.");
      }

      const safeEmail = email.replace(/[^a-zA-Z0-9]/g, '_');
      const safePhone = phone.replace(/[^a-zA-Z0-9+]/g, '');
      
      addLog('log_uploading');
      const uploadedPaths: string[] = [];
      for (const file of files) {
        const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filePath = `oilscam_${safeEmail}_TEL_${safePhone}/${Date.now()}_${cleanFileName}`;
        const { error } = await supabase.storage.from('temp_dossiers').upload(filePath, file);
        if (error) throw error;
        uploadedPaths.push(filePath);
      }

      setStatus('analyzing');
      setProgress(10);
      addLog('log_documents_secured');

      const subordinateAgents = ['roberto', 'moises', 'alcides'];
      const subordinateNames = ['ROBERTO', 'MOISÉS', 'ALCIDES'];
      const subordinateRoles = ['Document Integrity Agent', 'Coherence & Logic Auditor', 'Relationship & Context Mapping'];

      const fetchAgent = async (agent: string, name: string, role: string) => {
        setAgentStatus(prev => ({ ...prev, [agent]: 'running' }));
        addLog('log_deploying_agent', name, role);

        const formData = new FormData();
        uploadedPaths.forEach(path => formData.append('filePath', path));
        formData.append('agent', agent);
        formData.append('targetLanguage', reportLanguage);
        
        const oilScamFocus = `OIL SCAM AUDIT PROTOCOL: Focus strictly on verifying petroleum-specific fraud anomalies. Validate tank storage coordination documents, verify seller email domain registration status, flag Russian refinery sanction violations, check for shell bank intermediates, and cross-reference standard EN590/Jet A1 escrow procedures. ` + userContext;
        formData.append('userContext', oilScamFocus);
        
        const response = await fetch('/api/analyze', { method: 'POST', body: formData });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || `Agent ${name} encountered an analysis exception.`);
        
        setAgentStatus(prev => ({ ...prev, [agent]: 'success' }));
        addLog('log_agent_complete', name);
        return `\n\n--- REPORT BY ${name} (${role}) ---\n${data.report}`;
      };

      const subordinateReports = [];
      for (let i = 0; i < subordinateAgents.length; i++) {
        const report = await fetchAgent(subordinateAgents[i], subordinateNames[i], subordinateRoles[i]);
        subordinateReports.push(report);
        setProgress(20 + (i * 20));
      }

      setProgress(75);
      addLog('log_consolidating');
      setAgentStatus(prev => ({ ...prev, consolidator: 'running' }));

      const consolidatorFormData = new FormData();
      uploadedPaths.forEach(path => consolidatorFormData.append('filePath', path));
      consolidatorFormData.append('agent', 'consolidator');
      consolidatorFormData.append('targetLanguage', reportLanguage);
      consolidatorFormData.append('previousReports', subordinateReports.join('\n'));
      consolidatorFormData.append('email', email);
      
      const consolidatorResponse = await fetch('/api/analyze', { method: 'POST', body: consolidatorFormData });
      const consolidatorData = await consolidatorResponse.json();
      
      if (!consolidatorResponse.ok) throw new Error(consolidatorData.error || `Consolidator agent failed to compile certificate.`);
      
      setAgentStatus(prev => ({ ...prev, consolidator: 'success' }));
      addLog('log_dispatching', email);
      setProgress(90);

      if (consolidatorData.report) {
        setRawReport(consolidatorData.report);
      }

      try {
        const jsonMatch = consolidatorData.report.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          parsed.dateGenerated = new Date().toLocaleDateString();
          setFinalReport(parsed);
          setParseError(false);
        } else {
          throw new Error("No JSON boundaries found");
        }
      } catch (e) {
        addLog('log_warning_formatting');
        setParseError(true);
        setFinalReport(null);
      }

      setProgress(100);
      setStatus('success');

    } catch (error: any) {
      console.error("Analysis Failure:", error);
      setErrorMessage(error.message || "Connection timed out during heavy document processing.");
      setStatus('error');
    }
  };

  // Helper variables for dynamic rendering of demo vs real report
  const recommendationsText = finalReport?.isDemo ? t('demo_recommendations') : finalReport?.recommendations;
  const anomaliesList = finalReport?.isDemo ? [
    { title: t('demo_anomaly_01_title'), description: t('demo_anomaly_01_desc') },
    { title: t('demo_anomaly_02_title'), description: t('demo_anomaly_02_desc') },
    { title: t('demo_anomaly_03_title'), description: t('demo_anomaly_03_desc') },
    { title: t('demo_anomaly_04_title'), description: t('demo_anomaly_04_desc') },
    { title: t('demo_anomaly_05_title'), description: t('demo_anomaly_05_desc') },
    { title: t('demo_anomaly_06_title'), description: t('demo_anomaly_06_desc') },
    { title: t('demo_anomaly_07_title'), description: t('demo_anomaly_07_desc') },
    { title: t('demo_anomaly_08_title'), description: t('demo_anomaly_08_desc') },
    { title: t('demo_anomaly_09_title'), description: t('demo_anomaly_09_desc') },
    { title: t('demo_anomaly_10_title'), description: t('demo_anomaly_10_desc') },
    { title: t('demo_anomaly_11_title'), description: t('demo_anomaly_11_desc') },
    { title: t('demo_anomaly_12_title'), description: t('demo_anomaly_12_desc') },
    { title: t('demo_anomaly_13_title'), description: t('demo_anomaly_13_desc') },
    { title: t('demo_anomaly_14_title'), description: t('demo_anomaly_14_desc') }
  ] : finalReport?.anomalies;
  const rawReportText = finalReport?.isDemo ? t('demo_raw_report') : rawReport;

  return (
    <div className="min-h-screen bg-[#090d16] text-white flex flex-col items-center justify-between font-open-sans relative selection:bg-red-500/20 selection:text-red-300">
      
      {/* Background Glowing Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-950/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-950/15 rounded-full blur-[120px] pointer-events-none" />
      </div>

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-10 border-b border-white/5 bg-[#090d16]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(239,68,68,0.4)]">
            🛡️
          </div>
          <span className="font-montserrat font-black text-lg tracking-widest uppercase text-white">
            OILSCAM <span className="text-red-500">ALERT</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider font-bold text-[10px] hidden sm:flex">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span> {t('live_scanner')}
          </span>
          
          <div className="relative flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Lang:</span>
            <select
              value={language}
              onChange={(e) => {
                const lang = e.target.value as Language;
                setLanguage(lang);
                setReportLanguage(lang);
              }}
              className="bg-transparent text-xs text-white font-bold focus:outline-none cursor-pointer border-none pr-1"
            >
              <option value="en" className="bg-slate-950 text-white">🇺🇸 EN</option>
              <option value="es" className="bg-slate-950 text-white">🇪🇸 ES</option>
              <option value="fr" className="bg-slate-950 text-white">🇫🇷 FR</option>
              <option value="de" className="bg-slate-950 text-white">🇩🇪 DE</option>
              <option value="pt" className="bg-slate-950 text-white">🇧🇷 PT</option>
              <option value="zh" className="bg-slate-950 text-white">🇨🇳 ZH</option>
              <option value="ru" className="bg-slate-950 text-white">🇷🇺 RU</option>
              <option value="ar" className="bg-slate-950 text-white">🇦🇪 AR</option>
              <option value="hi" className="bg-slate-950 text-white">🇮🇳 HI</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-7xl mx-auto px-6 py-12 flex-grow flex flex-col items-center justify-center z-10">
        
        {status === 'analyzing' || status === 'success' ? (
          /* ========================================================
             PROCESSING & SUCCESS STATE VIEW
             ======================================================== */
          <div className="w-full max-w-4xl bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl relative overflow-hidden">
            
            {status === 'analyzing' && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-xs text-center font-bold mb-6 animate-pulse flex items-center justify-center gap-2">
                <AlertTriangle size={16} /> {t('stay_page')}
              </div>
            )}

            <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-6">
              <div>
                <h2 className="text-xl font-black text-white">{t('scan_progress')}</h2>
                <p className="text-slate-400 text-xs mt-1">{t('scan_progress_desc')}</p>
              </div>
              <span className="text-2xl">⚡</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <AgentStatusNode id="ROB-9X" name="ROBERTO" role="Document Integrity" status={agentStatus.roberto} icon={Search} t={t} />
              <AgentStatusNode id="MOI-2B" name="MOISÉS" role="Coherence & Logic" status={agentStatus.moises} icon={Scale} t={t} />
              <AgentStatusNode id="ALC-7V" name="ALCIDES" role="Context Mapping" status={agentStatus.alcides} icon={Cpu} t={t} />
              <AgentStatusNode id="EXE-1A" name="CONSOLIDATOR" role="Executive Certificate" status={agentStatus.consolidator} icon={CheckCircle2} t={t} />
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-xs text-slate-400 font-bold mb-2">
                <span>{t('progress_matrix')}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-gradient-to-r from-red-500 to-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
              </div>
            </div>

            {/* Simulated Live Console logs */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-[10px] h-32 overflow-y-auto shadow-inner text-slate-400">
              {logs.map((log, i) => (
                <div key={i} className="mb-1">
                  <span className="text-red-500 font-bold">{`>`}</span> {renderLogText(log)}
                </div>
              ))}
            </div>

            {status === 'success' && (
              <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col items-center w-full">
                
                {!parseError && finalReport ? (
                  /* Renders beautiful visual report if JSON parsed successfully */
                  <div className="w-full bg-slate-950/60 border border-white/5 rounded-2xl p-6 md:p-8 text-left relative overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6 mb-6 gap-4">
                      <div>
                        <span className="text-[10px] bg-red-500/10 border border-red-500/30 text-red-400 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          {t('forensic_result')}
                        </span>
                        <h3 className="text-2xl font-black text-white mt-2">
                          {finalReport.companyName || t('audited_transaction')}
                        </h3>
                      </div>
                      
                      <div className="text-right">
                        <span className="text-xs text-slate-500 block">{t('risk_score')}</span>
                        <span className={`text-3xl font-black ${
                          finalReport.riskScore > 60 ? 'text-red-500' :
                          finalReport.riskScore > 30 ? 'text-amber-500' : 'text-emerald-500'
                        }`}>
                          {finalReport.riskScore}/100
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-8">
                      <h4 className="font-bold text-slate-200 text-sm mb-2 flex items-center gap-1.5">
                        {t('exec_recs')}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-line">
                        {recommendationsText}
                      </p>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-black text-white text-xs uppercase tracking-wider border-b border-slate-800 pb-2 mb-4">
                        {t('structural_findings')}
                      </h4>
                      
                      {anomaliesList && anomaliesList.length > 0 ? (
                        <div className="space-y-3">
                          {anomaliesList.map((anom: any, idx: number) => (
                            <div key={idx} className="bg-slate-900/60 border border-slate-800/80 border-l-4 border-l-red-500 p-4 rounded-r-xl">
                              <h5 className="font-bold text-white text-sm flex items-center gap-2">
                                <span className="text-xs text-slate-500 font-mono">{(idx + 1).toString().padStart(2, '0')}</span>
                                {anom.title}
                              </h5>
                              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                {anom.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 p-5 rounded-xl text-center text-xs font-bold">
                          {t('no_anomalies')}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-800 pt-6 mt-6">
                      <p className="text-[10px] text-slate-500">
                        {t('completed_on')} {finalReport.dateGenerated}. {t('certified_by')}
                      </p>
                      <RMAPdfGenerator finalReport={{ ...finalReport, recommendations: recommendationsText, anomalies: anomaliesList }} language={reportLanguage} />
                    </div>
                  </div>
                ) : (
                  /* Renders plain structured text transcript if JSON fails to parse */
                  <div className="w-full bg-slate-950/60 border border-white/5 rounded-2xl p-6 text-left">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-white">{t('forensic_certificate_text')}</h3>
                      <button 
                        onClick={handleCopy}
                        className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                          copied ? 'bg-emerald-500 text-black' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        }`}
                      >
                        {copied ? <><Check size={12} /> {t('copied')}</> : <><Copy size={12} /> {t('copy_text')}</>}
                      </button>
                    </div>
                    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-5 font-mono text-[10px] text-slate-300 leading-relaxed max-h-[350px] overflow-y-auto whitespace-pre-wrap select-all shadow-inner">
                      {rawReportText || t('formatting_report')}
                    </div>
                  </div>
                )}

                <div className="mt-8 flex flex-col items-center">
                  <button 
                    onClick={() => {
                      setStatus('idle');
                      setFiles([]);
                    }}
                    className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider border border-white/5 cursor-pointer"
                  >
                    {t('scan_another')}
                  </button>
                </div>

              </div>
            )}

          </div>
        ) : (
          /* ========================================================
             INITIAL INTRO & FORM UPLOADER VIEW
             ======================================================== */
          <div className="w-full grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Description Column */}
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                <ShieldAlert size={14} /> {t('badge_stop')}
              </span>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
                {t('title_1')} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-amber-500">
                  {t('title_2')}
                </span>
              </h2>
              
              <p className="text-base text-slate-400 max-w-2xl font-light leading-relaxed">
                {t('desc')}
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleLoadDemo}
                  className="px-6 py-3.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(239,68,68,0.1)] flex items-center gap-2 cursor-pointer group"
                >
                  <Search size={14} className="group-hover:scale-110 transition-transform" />
                  {t('view_sample')}
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 pt-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-red-400 flex-shrink-0 shadow-[0_0_10px_rgba(239,68,68,0.05)]">
                    <Search size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{t('tank_title')}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t('tank_desc')}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-red-400 flex-shrink-0 shadow-[0_0_10px_rgba(239,68,68,0.05)]">
                    <Globe size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{t('domain_title')}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t('domain_desc')}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-red-400 flex-shrink-0 shadow-[0_0_10px_rgba(239,68,68,0.05)]">
                    <FileSignature size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{t('signee_title')}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t('signee_desc')}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-red-400 flex-shrink-0 shadow-[0_0_10px_rgba(239,68,68,0.05)]">
                    <Zap size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{t('agent_matrix_title')}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t('agent_matrix_desc')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Uploader Card Column */}
            <div className="lg:col-span-5">
              <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative">
                
                {/* Free Beta Badge */}
                <div className="absolute top-4 right-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full tracking-wider animate-pulse">
                  {t('free_beta')}
                </div>

                <h3 className="font-display font-bold text-lg text-white mb-6">{t('verify_title')}</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {isBetaActive && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl mb-4 text-xs text-emerald-300">
                      <label className="block text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                        {t('promo_code')}
                      </label>
                      <input 
                        type="text" 
                        value={betaCode}
                        onChange={(e) => setBetaCode(e.target.value)}
                        placeholder="OILFREE26"
                        className="w-full bg-slate-900 border border-emerald-500/30 rounded-xl px-3 py-2 text-white font-mono font-bold tracking-wider uppercase focus:outline-none"
                      />
                      <span className="text-[9px] text-slate-500 mt-1 block">{t('promo_desc')}</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{t('email')}</label>
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="trader@company.com"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{t('phone')}</label>
                      <input 
                        type="tel" 
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+370 600 00000"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{t('company')}</label>
                      <input 
                        type="text" 
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Refinery Broker Ltd"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{t('target_lang')}</label>
                      <select
                        value={reportLanguage}
                        onChange={(e) => {
                          const lang = e.target.value as Language;
                          setReportLanguage(lang);
                          setLanguage(lang);
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 transition-colors"
                      >
                        <option value="en">🇺🇸 English</option>
                        <option value="es">🇪🇸 Español</option>
                        <option value="fr">🇫🇷 Français</option>
                        <option value="de">🇩🇪 Deutsch</option>
                        <option value="pt">🇧🇷 Português</option>
                        <option value="zh">🇨🇳 中文</option>
                        <option value="ru">🇷🇺 Русский</option>
                        <option value="ar">🇦🇪 العربية</option>
                        <option value="hi">🇮🇳 हिन्दी</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{t('drop_pdf')}</label>
                    <div className="border-2 border-dashed border-slate-800 rounded-2xl p-6 text-center hover:bg-slate-900/50 transition-colors cursor-pointer relative">
                      <input 
                        type="file" 
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
                      />
                      <UploadCloud className="w-8 h-8 text-red-500 mx-auto mb-2" />
                      <p className="text-xs font-bold mb-0.5">{t('drag_drop')}</p>
                      <p className="text-[10px] text-slate-500">{t('limit_desc')}</p>
                    </div>
                    
                    {files.length > 0 && (
                      <div className="mt-3">
                        {files.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-lg border border-slate-800 text-xs">
                            <FileText className="w-4 h-4 text-red-400" />
                            <span className="truncate flex-1">{f.name}</span>
                            <span className="text-[10px] text-slate-500">{(f.size / 1024 / 1024).toFixed(2)} MB</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex items-start gap-2.5">
                    <input 
                      type="checkbox" 
                      id="oil-terms" 
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="mt-0.5 w-3.5 h-3.5 rounded border-slate-800 bg-slate-900 text-red-500 focus:ring-red-500 cursor-pointer"
                    />
                    <label htmlFor="oil-terms" className="text-[11px] text-slate-400 cursor-pointer select-none leading-relaxed">
                      {t('agree_terms')}
                    </label>
                  </div>

                  {errorMessage && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl flex items-start gap-2 text-xs">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <p>{errorMessage}</p>
                    </div>
                  )}

                  <div className="pt-4">
                    <button 
                      type="submit"
                      disabled={files.length === 0 || !email || !phone || !acceptedTerms}
                      className={`w-full py-3.5 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all ${
                        files.length === 0 || !email || !phone || !acceptedTerms
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white shadow-[0_0_20px_rgba(239,68,68,0.35)]'
                      }`}
                    >
                      <Search size={14} /> {t('scan_btn')}
                    </button>
                  </div>

                </form>

              </div>
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-6 border-t border-white/5 bg-[#05080f]/90 text-center z-10">
        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
          &copy; {new Date().getFullYear()} {t('footer_rights')}
        </p>
      </footer>

    </div>
  );
}
