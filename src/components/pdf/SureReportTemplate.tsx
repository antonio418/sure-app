import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Premium Corporate Theme
const primaryBlue = '#1d4ed8'; // Corporate Intelligence Blue
const slateDark = '#0b1120'; // Cyber-Forense Navy Deep
const slateText = '#64748b'; // Muted slate
const dangerRed = '#991b1b'; // Institutional Crimson Red
const successGreen = '#065f46'; // Emerald Trust
const warningYellow = '#b45309'; // Gold Amber
const surfaceGray = '#f8fafc'; // Premium off-white surface

// Register custom fonts to support Arabic (RTL) natively
Font.register({
  family: 'Cairo',
  fonts: [
    { src: '/fonts/Cairo-Regular.ttf', fontWeight: 'normal' },
    { src: '/fonts/Cairo-Bold.ttf', fontWeight: 'bold' }
  ]
});

// Register Cyrillic font
Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/fonts/Roboto-Regular.ttf', fontWeight: 'normal' }
  ]
});

// Register Devanagari font
Font.register({
  family: 'NotoSansDevanagari',
  fonts: [
    { src: '/fonts/NotoSansDevanagari-Regular.ttf', fontWeight: 'normal' }
  ]
});

// Register CJK font
Font.register({
  family: 'NotoSansSC',
  fonts: [
    { src: '/fonts/NotoSansSC-Regular.otf', fontWeight: 'normal' }
  ]
});

const styles = StyleSheet.create({
  // COVER PAGE STYLES
  coverPage: {
    padding: 60,
    fontFamily: 'Helvetica',
    position: 'relative',
    color: '#ffffff',
    border: `12px solid ${primaryBlue}`,
    backgroundColor: slateDark,
  },
  coverLogo: {
    width: 60,
    height: 60,
    objectFit: 'contain',
    marginBottom: 40,
  },
  coverWatermark: {
    position: 'absolute',
    top: '30%',
    left: '-20%',
    width: '140%',
    opacity: 0.03,
    transform: 'rotate(-45deg)',
    fontSize: 160,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    zIndex: -1,
  },
  coverHeader: {
    fontSize: 14,
    color: primaryBlue,
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginBottom: 10,
    fontWeight: 'bold'
  },
  coverTitle: {
    fontSize: 48,
    lineHeight: 1.1,
    fontWeight: 'extrabold',
    marginBottom: 20,
    color: '#ffffff',
  },
  coverDivider: {
    width: 80,
    height: 4,
    backgroundColor: primaryBlue,
    marginBottom: 20,
  },
  coverDataMatrix: {
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: 20,
    borderLeft: `4px solid ${primaryBlue}`,
  },
  coverMatrixRow: {
    flexDirection: 'row',
    marginBottom: 10,
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    paddingBottom: 5,
  },
  coverMatrixLabel: { width: '40%', fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, lineHeight: 1.4 },
  coverMatrixValue: { width: '60%', fontSize: 12, color: '#ffffff', fontWeight: 'bold', lineHeight: 1.4 },
  coverFooter: {
    position: 'absolute',
    bottom: 60,
    left: 60,
    right: 60,
    borderTop: '1px solid #334155',
    paddingTop: 20,
  },
  coverFooterText: {
    fontSize: 9,
    color: '#94a3b8',
    lineHeight: 1.5,
  },

  // INNER PAGES STYLES
  innerPage: {
    paddingTop: 50,
    paddingBottom: 80,
    paddingHorizontal: 50,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    position: 'relative',
  },
  ribbonRed: { position: 'absolute', top: 0, left: 0, right: 0, height: 8, backgroundColor: dangerRed },
  ribbonGreen: { position: 'absolute', top: 0, left: 0, right: 0, height: 8, backgroundColor: successGreen },
  
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 15,
    borderBottom: '2px solid #f1f5f9',
  },
  headerLeftText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: slateDark,
    letterSpacing: 2,
  },
  headerRightImage: {
    width: 30,
    height: 30,
    objectFit: 'contain',
  },
  
  execSummaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: slateDark,
    textTransform: 'uppercase',
    marginBottom: 15,
    letterSpacing: 1,
  },
  
  // Risk Score Box (Premium look)
  riskBoxWrapper: {
    flexDirection: 'row',
    backgroundColor: surfaceGray,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 30,
    border: '1px solid #e2e8f0',
  },
  riskBoxScore: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: 130,
    borderRight: '1px solid #e2e8f0',
  },
  riskBoxDetails: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  scoreNumberRed: { fontSize: 42, fontWeight: 'bold', color: dangerRed },
  scoreNumberGreen: { fontSize: 42, fontWeight: 'bold', color: successGreen },
  scoreSub: { fontSize: 10, color: slateText, textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 },
  riskVerdictTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  riskVerdictRed: { color: dangerRed },
  riskVerdictGreen: { color: successGreen },
  riskVerdictDesc: { fontSize: 10, color: slateText, lineHeight: 1.5 },

  // Target Grid
  targetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 30,
    borderTop: '1px solid #e2e8f0',
    borderLeft: '1px solid #e2e8f0',
  },
  targetCell: {
    width: '50%',
    padding: 15,
    borderBottom: '1px solid #e2e8f0',
    borderRight: '1px solid #e2e8f0',
  },
  targetLabel: { fontSize: 8, color: slateText, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  targetValue: { fontSize: 12, color: slateDark, fontWeight: 'bold' },

  // Findings Section
  findingsTitle: {
    fontSize: 16,
    color: slateDark,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 15,
    paddingBottom: 8,
    borderBottom: '2px solid #e2e8f0',
  },
  findingCard: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: surfaceGray,
    borderLeft: `4px solid ${dangerRed}`,
    borderRadius: '0 4px 4px 0',
  },
  findingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  findingTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: slateDark,
    flex: 1,
  },
  findingBadge: {
    fontSize: 8,
    backgroundColor: '#fee2e2',
    color: dangerRed,
    padding: '3px 8px',
    borderRadius: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  findingDesc: {
    fontSize: 10,
    color: slateText,
    lineHeight: 1.6,
  },
  cleanCard: {
    marginBottom: 15,
    padding: 20,
    backgroundColor: '#ecfdf5',
    borderLeft: `4px solid ${successGreen}`,
    borderRadius: '0 4px 4px 0',
  },

  // Footer Inner
  innerFooter: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderTop: '1px solid #e2e8f0',
    paddingTop: 15,
  },
  footerDisclaimer: {
    width: '80%',
    fontSize: 7,
    color: '#94a3b8',
    lineHeight: 1.5,
  },
  pageNumber: {
    fontSize: 9,
    color: slateDark,
    fontWeight: 'bold',
  },
  // SIGNATURE BLOCK
  signatureBlock: {
    marginTop: 30,
    borderTop: `2px solid ${slateDark}`,
    paddingTop: 15,
  },
  signatureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: slateDark,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 15,
  },
  signatureGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureItem: {
    width: '30%',
    borderLeft: `2px solid ${primaryBlue}`,
    paddingLeft: 10,
  },
  signatureAgent: { fontSize: 10, fontWeight: 'bold', color: slateDark, marginBottom: 4 },
  signatureId: { fontSize: 8, color: slateText, fontFamily: 'Courier', marginBottom: 4 },
  signatureHash: { fontSize: 6, color: primaryBlue, fontFamily: 'Courier' },
  
  // Risk Scale Legend
  scaleLegendWrapper: {
    marginBottom: 20,
    border: '1px solid #e2e8f0',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#ffffff',
  },
  scaleLegendTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: slateDark,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
    borderBottom: '1px solid #f1f5f9',
    paddingBottom: 4,
  },
  scaleGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scaleSegment: {
    width: '24%',
    padding: 6,
    borderRadius: 4,
    alignItems: 'center',
  },
  scaleSegmentTitle: {
    fontSize: 7,
    fontWeight: 'bold',
    marginBottom: 3,
    textTransform: 'uppercase',
  },
  scaleSegmentRange: {
    fontSize: 8,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  scaleSegmentDesc: {
    fontSize: 6,
    color: slateText,
    textAlign: 'center',
    lineHeight: 1.3,
  },
});

export interface ReportData {
  companyName: string;
  website: string;
  taxId: string;
  riskScore: number;
  dateGenerated: string;
  recommendations?: string;
  anomalies: { title: string; description: string }[];
}

interface SureReportTemplateProps {
  data: ReportData;
  reportId?: string;
  language?: string;
}

const pdfTranslations: Record<string, any> = {
  en: {
    coverHeader: "Transactional Forensic Certificate",
    coverTitle: "Artificial Intelligence Dossier",
    officialCertId: "Official Certificate ID",
    auditedEntity: "Audited Entity (Target)",
    validatedTax: "Validated Tax Identifier",
    reportIssueDate: "Report Issue Date",
    execSummary: "Executive Risk Summary",
    scoreOver: "Score / 100",
    redAlert: "RED ALERT - HIGH RISK OPERATION",
    greenLight: "GREEN LIGHT - INTEGRITY VERIFIED",
    redAlertDesc: "The multi-agent ecosystem has detected high-caliber red flags, indicating potential fraud, predatory asymmetry, or fictitious existence. We advise freezing transfers.",
    greenLightDesc: "Corporate identity and contract architecture have been cryptographically scanned. No critical thermodynamic or contractual anomalies observed.",
    targetName: "Investigated Entity Name",
    targetVat: "VAT / Tax Registration",
    targetDomain: "Georeferenced Domain Spectrum",
    agentsInvolved: "Agents Involved",
    findingsTitle: "Anomalies and Detected Fraud Vectors",
    cleanOpTitle: "Operation without Red Flags",
    cleanOpDesc: "The algorithms certify that the legal structure, tax registration documents, and physical existence present no probabilistic deviations from their official claims.",
    critAlertBadge: "Critical Alert",
    signatureTitle: "Cryptographic Chain of Custody & Validation",
    agentDD: "Roberto (Due Diligence)",
    agentLegal: "Moisés (Legal & Contracts)",
    agentTech: "Alcides (Tech & Chem)",
    conclusionsTitle: "Forensic Conclusions & Recommendations",
    legalNotice: "LEGAL NOTICE: This B2B Certificate is generated in \"Good Faith\" by AI. It does not constitute legal advice or financial instruction. Operated by MB Procdi under the laws of the Republic of Lithuania. Use of this document implies acceptance of the Master Services Agreement attached at the end of the report.",
    pageStr: "Page",
    msaTitle: "MASTER FORENSIC SERVICES AGREEMENT",
    msaClient: "CLIENT: Client / Platform User",
    msaContractor: "CONTRACTOR: MB PROCDI",
    msa1Title: "1. Scope of Services",
    msa1Desc1: "MB Procdi agrees to provide an autonomous multi-agent intelligence analysis (RMA) on the documents submitted by the Client through its SURE Forensics platform. The result of this service is a \"B2B Risk Certificate\" that details possible anomalies, contractual asymmetries, and technical inconsistencies.",
    msa1Desc2: "Furthermore, for the acquisition of technological products, we complement this algorithmic shielding with a deep audit of intellectual property rights, specifically verifying the existence of valid patents and their respective jurisdictions. To this end, we deploy an elite human intelligence team composed of former patent directors and researchers from recognized European universities.",
    msa2Title: "2. Limitation of Liability and \"Good Faith\" Clause (CRITICAL CLAUSE)",
    msa2Desc1: "The B2B Risk Certificate is generated autonomously and in \"Good Faith\" by artificial intelligence algorithms, based on network data cross-referencing, semantic analysis, and probability matrices. MB Procdi (operating entity of the SURE Forensics platform) is an Operational Intelligence Provider, not a registered financial advisor, law firm, or regulatory entity.",
    msa2Desc2: "The Client acknowledges and agrees that:",
    msa2Bullet1: "• The analysis may contain false positives or false negatives.",
    msa2Bullet2: "• The Intelligence Dossier does not constitute binding legal advice, a punitive dictate, or an instruction to execute or abort a financial transaction.",
    msa2Bullet3: "• The final decision to proceed with any commercial transaction, bank transfer, or contract signing rests 100% under the Client's responsibility.",
    msa2Bullet4: "• Under no circumstances will MB Procdi, its founders, its AI platform (SURE), or its affiliates be liable for any direct, indirect, incidental, or consequential financial loss, loss of profit, or legal disputes arising from the Client's transactions, regardless of the findings presented in the Intelligence Dossier.",
    msa3Title: "3. Service Level Agreement (SLA)",
    msa3Desc: "Upon receipt of the complete documentation and payment confirmation, MB Procdi will deliver the final Intelligence Dossier within 24 to 48 business hours.",
    msa4Title: "4. Confidentiality",
    msa4Desc: "MB Procdi will treat all generated information as strictly confidential and may under no circumstances provide it to third parties without the written authorization of the contracting company.",
    msa5Title: "5. Governing Law",
    msa5Desc: "This Agreement shall be governed by the laws and jurisdiction of the Republic of Lithuania."
  },
  es: {
    coverHeader: "Certificado Forense Transaccional",
    coverTitle: "Dossier de Inteligencia Artificial",
    officialCertId: "ID de Certificado Oficial",
    auditedEntity: "Entidad Auditada (Objetivo)",
    validatedTax: "Identificador Fiscal Validado",
    reportIssueDate: "Fecha de Emisión del Reporte",
    execSummary: "Resumen Ejecutivo de Riesgo",
    scoreOver: "Puntaje / 100",
    redAlert: "ALERTA ROJA - OPERACIÓN DE ALTO RIESGO",
    greenLight: "LUZ VERDE - INTEGRIDAD VERIFICADA",
    redAlertDesc: "El ecosistema multi-agente ha detectado alertas rojas de alto calibre, indicando posible fraude, asimetría predatoria o existencia ficticia. Aconsejamos congelar transferencias.",
    greenLightDesc: "La identidad corporativa y la arquitectura del contrato han sido escaneadas criptográficamente. No se observaron anomalías críticas.",
    targetName: "Nombre de Entidad Investigada",
    targetVat: "Registro Fiscal / IVA",
    targetDomain: "Espectro de Dominio Georeferenciado",
    agentsInvolved: "Agentes Involucrados",
    findingsTitle: "Anomalías y Vectores de Fraude Detectados",
    cleanOpTitle: "Operación sin Alertas Rojas",
    cleanOpDesc: "Los algoritmos certifican que la estructura legal, los documentos de registro fiscal y la existencia física no presentan desviaciones probabilísticas respecto a sus afirmaciones oficiales.",
    critAlertBadge: "Alerta Crítica",
    signatureTitle: "Cadena de Custodia Criptográfica y Validación",
    agentDD: "Roberto (Debida Diligencia)",
    agentLegal: "Moisés (Legal y Contratos)",
    agentTech: "Alcides (Técnico y Químico)",
    conclusionsTitle: "Conclusiones Forenses y Recomendaciones",
    legalNotice: "AVISO LEGAL: Este Certificado B2B es generado de \"Buena Fe\" por IA. No constituye asesoría legal ni instrucción financiera. Operado por MB Procdi bajo las leyes de la República de Lituania. El uso de este documento implica la aceptación del Acuerdo de Servicios Maestro adjunto al final del reporte.",
    pageStr: "Página",
    msaTitle: "ACUERDO MAESTRO DE SERVICIOS FORENSES",
    msaClient: "CLIENTE: Cliente / Usuario de Plataforma",
    msaContractor: "CONTRATISTA: MB PROCDI",
    msa1Title: "1. Alcance de los Servicios",
    msa1Desc1: "MB Procdi acuerda proveer un análisis de inteligencia multi-agente autónomo (RMA) sobre los documentos enviados por el Cliente mediante la plataforma SURE Forensics. El resultado es un \"Certificado de Riesgo B2B\" que detalla posibles anomalías, asimetrías contractuales e inconsistencias técnicas.",
    msa1Desc2: "Además, para la adquisición de productos tecnológicos, complementamos este blindaje algorítmico con una profunda auditoría de derechos de propiedad intelectual, verificando específicamente la existencia de patentes válidas y sus respectivas jurisdicciones.",
    msa2Title: "2. Limitación de Responsabilidad y Cláusula de \"Buena Fe\" (CLÁUSULA CRÍTICA)",
    msa2Desc1: "El Certificado de Riesgo B2B se genera de forma autónoma y de \"Buena Fe\" por algoritmos de IA, basándose en cruce de datos, análisis semántico y matrices de probabilidad. MB Procdi es un Proveedor de Inteligencia Operacional, no un asesor financiero.",
    msa2Desc2: "El Cliente reconoce y acepta que:",
    msa2Bullet1: "• El análisis puede contener falsos positivos o falsos negativos.",
    msa2Bullet2: "• El Dossier de Inteligencia no constituye un dictamen legal vinculante, un dictado punitivo ni una instrucción para ejecutar o abortar una transacción.",
    msa2Bullet3: "• La decisión final de proceder con cualquier transacción comercial, transferencia bancaria o firma de contrato recae 100% bajo la responsabilidad del Cliente.",
    msa2Bullet4: "• Bajo ninguna circunstancia MB Procdi o sus afiliados serán responsables por ninguna pérdida financiera derivada de las transacciones del Cliente.",
    msa3Title: "3. Acuerdo de Nivel de Servicio (SLA)",
    msa3Desc: "Tras la recepción de la documentación completa y confirmación de pago, MB Procdi entregará el Dossier de Inteligencia final dentro de 24 a 48 horas hábiles.",
    msa4Title: "4. Confidencialidad",
    msa4Desc: "MB Procdi tratará toda la información generada como estrictamente confidencial y bajo ninguna circunstancia la proveerá a terceros sin la autorización escrita de la empresa contratante.",
    msa5Title: "5. Ley Aplicable",
    msa5Desc: "Este Acuerdo se regirá por las leyes y la jurisdicción de la República de Lituania."
  },
  pt: {
    coverHeader: "Certificado Forense Transacional",
    coverTitle: "Dossiê de Inteligência Artificial",
    officialCertId: "ID do Certificado Oficial",
    auditedEntity: "Entidade Auditada (Alvo)",
    validatedTax: "Identificador Fiscal Validado",
    reportIssueDate: "Data de Emissão do Relatório",
    execSummary: "Resumo Executivo de Risco",
    scoreOver: "Pontuação / 100",
    redAlert: "ALERTA VERMELHO - OPERAÇÃO DE ALTO RISCO",
    greenLight: "LUZ VERDE - INTEGRIDADE VERIFICADA",
    redAlertDesc: "O ecossistema multiagente detectou sinais de alerta de alto calibre, indicando potencial fraude, assimetria predatória ou existência fictícia. Aconselhamos o congelamento de transferências.",
    greenLightDesc: "A identidade corporativa e a arquitetura do contrato foram verificadas criptograficamente. Não foram observadas anomalias críticas.",
    targetName: "Nome da Entidade Investigada",
    targetVat: "Registro Fiscal / IVA",
    targetDomain: "Espectro de Domínio Georreferenciado",
    agentsInvolved: "Agentes Envolvidos",
    findingsTitle: "Anomalias e Vetores de Fraude Detectados",
    cleanOpTitle: "Operação sem Alertas Vermelhos",
    cleanOpDesc: "Os algoritmos certificam que a estrutura legal, os documentos de registro fiscal e a existência física não apresentam desvios probabilísticos em relação às suas declarações oficiais.",
    critAlertBadge: "Alerta Crítico",
    signatureTitle: "Cadeia de Custódia Criptográfica e Validação",
    agentDD: "Roberto (Due Diligence)",
    agentLegal: "Moisés (Legal e Contratos)",
    agentTech: "Alcides (Técnico e Químico)",
    conclusionsTitle: "Conclusões Forenses e Recomendações",
    legalNotice: "AVISO LEGAL: Este Certificado B2B é gerado de \"Boa Fé\" por IA. Não constitui aconselhamento jurídico ou instrução financeira. Operado por MB Procdi sob as leis da República da Lituânia. O uso deste documento implica a aceitação do Contrato Principal de Serviços em anexo no final do relatório.",
    pageStr: "Página",
    msaTitle: "CONTRATO PRINCIPAL DE SERVIÇOS FORENSES",
    msaClient: "CLIENTE: Cliente / Usuário da Plataforma",
    msaContractor: "CONTRATADA: MB PROCDI",
    msa1Title: "1. Escopo dos Serviços",
    msa1Desc1: "A MB Procdi concorda em fornecer uma análise de inteligência multiagente autônoma (RMA) sobre os documentos enviados pelo Cliente através de sua plataforma SURE Forensics. O resultado deste serviço é um \"Certificado de Risco B2B\" que detalha possíveis anomalias, assimetrias contratuais e inconsistências técnicas.",
    msa1Desc2: "Além disso, para a aquisição de produtos tecnológicos, complementamos essa proteção algorítmica com uma auditoria profunda dos direitos de propriedade intelectual.",
    msa2Title: "2. Limitação de Responsabilidade e Cláusula de \"Boa Fé\" (CLÁUSULA CRÍTICA)",
    msa2Desc1: "O Certificado de Risco B2B é gerado de forma autônoma e de \"Boa Fé\" por algoritmos de inteligência artificial, com base no cruzamento de dados de rede, análise semântica e matrizes de probabilidade. A MB Procdi é uma Provedora de Inteligência Operacional, não um consultor financeiro.",
    msa2Desc2: "O Cliente reconhece e concorda que:",
    msa2Bullet1: "• A análise pode conter falsos positivos ou falsos negativos.",
    msa2Bullet2: "• O Dossiê de Inteligência não constitui um parecer legal vinculativo, um ditame punitivo ou uma instrução para executar ou abortar uma transação.",
    msa2Bullet3: "• A decisão final de prosseguir com qualquer transação comercial, transferência bancária ou assinatura de contrato é de responsabilidade 100% do Cliente.",
    msa2Bullet4: "• Sob nenhuma circunstância a MB Procdi ou suas afiliadas serão responsáveis por qualquer perda financeira derivada das transações do Cliente.",
    msa3Title: "3. Acordo de Nível de Serviço (SLA)",
    msa3Desc: "Após o recebimento da documentação completa e confirmação de pagamento, a MB Procdi entregará o Dossiê de Inteligência final dentro de 24 a 48 horas úteis.",
    msa4Title: "4. Confidencialidade",
    msa4Desc: "A MB Procdi tratará todas as informações geradas como estritamente confidenciais e não as fornecerá a terceiros sem a autorização por escrito da empresa contratante.",
    msa5Title: "5. Lei Aplicável",
    msa5Desc: "Este Contrato será regido pelas leis e jurisdição da República da Lituânia."
  },
  fr: {
    coverHeader: "Certificat Légal Transactionnel",
    coverTitle: "Dossier d'Intelligence Artificielle",
    officialCertId: "ID de Certificat Officiel",
    auditedEntity: "Entité Auditée (Cible)",
    validatedTax: "Identifiant Fiscal Validé",
    reportIssueDate: "Date d'Émission du Rapport",
    execSummary: "Résumé Exécutif des Risques",
    scoreOver: "Score / 100",
    redAlert: "ALERTE ROUGE - OPÉRATION À HAUT RISQUE",
    greenLight: "FEU VERT - INTÉGRITÉ VÉRIFIÉE",
    redAlertDesc: "L'écosystème multi-agents a détecté des signaux d'alerte de haut calibre, indiquant une fraude potentielle, une asymétrie prédatrice ou une existence fictive. Nous conseillons de geler les transferts.",
    greenLightDesc: "L'identité de l'entreprise et l'architecture du contrat ont été scannées cryptographiquement. Aucune anomalie critique observée.",
    targetName: "Nom de l'Entité Enquêtée",
    targetVat: "Numéro de TVA / Enregistrement Fiscal",
    targetDomain: "Spectre de Domaine Géoréférencé",
    agentsInvolved: "Agents Impliqués",
    findingsTitle: "Anomalies et Vecteurs de Fraude Détectés",
    cleanOpTitle: "Opération sans Alerte Rouge",
    cleanOpDesc: "Les algorithmes certifient que la structure légale, les documents fiscaux et l'existence physique ne présentent aucun écart probabiliste.",
    critAlertBadge: "Alerte Critique",
    signatureTitle: "Chaîne de Garde Cryptographique et Validation",
    agentDD: "Roberto (Due Diligence)",
    agentLegal: "Moisés (Légal & Contrats)",
    agentTech: "Alcides (Technique & Chimique)",
    conclusionsTitle: "Conclusions Médico-légales et Recommandations",
    legalNotice: "AVIS LÉGAL: Ce certificat B2B est généré de \"Bonne Foi\" par l'IA. Il ne constitue pas un conseil juridique. Le contrat cadre s'applique.",
    pageStr: "Page",
    msaTitle: "CONTRAT CADRE DE SERVICES MÉDICO-LÉGAUX",
    msaClient: "CLIENT : Utilisateur de la Plateforme",
    msaContractor: "ENTREPRENEUR : MB PROCDI",
    msa1Title: "1. Étendue des Services",
    msa1Desc1: "MB Procdi s'engage à fournir une analyse...",
    msa1Desc2: "De plus, pour l'acquisition de produits...",
    msa2Title: "2. Limitation de Responsabilité (CLAUSE CRITIQUE)",
    msa2Desc1: "Le Certificat est généré de manière autonome...",
    msa2Desc2: "Le Client reconnaît et accepte que :",
    msa2Bullet1: "• L'analyse peut contenir de faux positifs.",
    msa2Bullet2: "• Le Dossier ne constitue pas un avis juridique.",
    msa2Bullet3: "• La décision finale incombe 100% au Client.",
    msa2Bullet4: "• MB Procdi n'est pas responsable des pertes.",
    msa3Title: "3. Accord de Niveau de Service",
    msa3Desc: "MB Procdi livrera le Dossier final dans les 24-48 heures.",
    msa4Title: "4. Confidentialité",
    msa4Desc: "Les informations sont strictement confidentielles.",
    msa5Title: "5. Loi Applicable",
    msa5Desc: "Ce Contrat est régi par les lois de la République de Lituanie."
  },
  de: {
    coverHeader: "Transaktionales Forensisches Zertifikat",
    coverTitle: "Dossier der Künstlichen Intelligenz",
    officialCertId: "Offizielle Zertifikats-ID",
    auditedEntity: "Geprüftes Unternehmen (Ziel)",
    validatedTax: "Validierte Steuernummer",
    reportIssueDate: "Ausstellungsdatum des Berichts",
    execSummary: "Zusammenfassung der Risiken",
    scoreOver: "Punktzahl / 100",
    redAlert: "ROTER ALARM - HOCHRISIKO-OPERATION",
    greenLight: "GRÜNES LICHT - INTEGRITÄT ÜBERPRÜFT",
    redAlertDesc: "Das Multi-Agenten-Ökosystem hat schwerwiegende Warnsignale für potenziellen Betrug oder fiktive Existenz erkannt. Überweisungen einfrieren.",
    greenLightDesc: "Unternehmensidentität und Vertragsarchitektur wurden kryptographisch gescannt. Keine kritischen Anomalien beobachtet.",
    targetName: "Name des untersuchten Unternehmens",
    targetVat: "Umsatzsteuer-ID / Steuerregistrierung",
    targetDomain: "Georeferenziertes Domain-Spektrum",
    agentsInvolved: "Beteiligte Agenten",
    findingsTitle: "Erkannte Anomalien und Betrugsvektoren",
    cleanOpTitle: "Operation ohne Rote Flaggen",
    cleanOpDesc: "Die Algorithmen bestätigen, dass die rechtliche Struktur und die physische Existenz keine Abweichungen aufweisen.",
    critAlertBadge: "Kritischer Alarm",
    signatureTitle: "Kryptographische Beweiskette und Validierung",
    agentDD: "Roberto (Due Diligence)",
    agentLegal: "Moisés (Recht & Verträge)",
    agentTech: "Alcides (Technik & Chemie)",
    conclusionsTitle: "Forensische Schlussfolgerungen und Empfehlungen",
    legalNotice: "RECHTLICHER HINWEIS: Dieses Zertifikat wird von einer KI erstellt und stellt keine Rechtsberatung dar.",
    pageStr: "Seite",
    msaTitle: "RAHMENVERTRAG FÜR FORENSISCHE DIENSTLEISTUNGEN",
    msaClient: "KUNDE: Plattformbenutzer",
    msaContractor: "AUFTRAGNEHMER: MB PROCDI",
    msa1Title: "1. Leistungsumfang",
    msa1Desc1: "MB Procdi erbringt eine autonome Analyse...",
    msa1Desc2: "Darüber hinaus prüfen wir geistiges Eigentum...",
    msa2Title: "2. Haftungsbeschränkung (KRITISCHE KLAUSEL)",
    msa2Desc1: "Das Zertifikat wird autonom erstellt...",
    msa2Desc2: "Der Kunde erkennt an und stimmt zu, dass:",
    msa2Bullet1: "• Die Analyse Fehlalarme enthalten kann.",
    msa2Bullet2: "• Das Dossier keine Rechtsberatung darstellt.",
    msa2Bullet3: "• Die endgültige Entscheidung beim Kunden liegt.",
    msa2Bullet4: "• MB Procdi nicht für Verluste haftet.",
    msa3Title: "3. Service-Level-Agreement",
    msa3Desc: "Lieferung innerhalb von 24-48 Stunden nach Zahlung.",
    msa4Title: "4. Vertraulichkeit",
    msa4Desc: "Alle Informationen werden streng vertraulich behandelt.",
    msa5Title: "5. Geltendes Recht",
    msa5Desc: "Es gilt das Recht der Republik Litauen."
  },
  zh: {
    coverHeader: "交易取证证书",
    coverTitle: "人工智能档案",
    officialCertId: "官方证书编号",
    auditedEntity: "被审计实体（目标）",
    validatedTax: "已验证的税务识别码",
    reportIssueDate: "报告发布日期",
    execSummary: "风险执行摘要",
    scoreOver: "得分 / 100",
    redAlert: "红色警报 - 高风险操作",
    greenLight: "绿灯 - 完整性已验证",
    redAlertDesc: "多智能体生态系统检测到严重危险信号，表明存在潜在欺诈或虚构实体。建议冻结转账。",
    greenLightDesc: "企业身份和合同架构已通过加密扫描。未观察到严重异常。",
    targetName: "被调查实体名称",
    targetVat: "增值税 / 税务注册",
    targetDomain: "地理定位域名",
    agentsInvolved: "参与的智能体",
    findingsTitle: "检测到的异常和欺诈载体",
    cleanOpTitle: "无红色警报的操作",
    cleanOpDesc: "算法证明，法律结构和物理存在与其官方声明没有概率偏差。",
    critAlertBadge: "严重警报",
    signatureTitle: "加密监管链验证",
    agentDD: "Roberto (尽职调查)",
    agentLegal: "Moisés (法律与合同)",
    agentTech: "Alcides (技术与化学)",
    conclusionsTitle: "取证结论与建议",
    legalNotice: "法律声明：此B2B证书由AI生成，不构成法律建议。受立陶宛共和国法律管辖。",
    pageStr: "页码",
    msaTitle: "取证服务主协议",
    msaClient: "客户：平台用户",
    msaContractor: "承包商：MB PROCDI",
    msa1Title: "1. 服务范围",
    msa1Desc1: "提供自主的智能体分析服务...",
    msa1Desc2: "此外，我们审计知识产权...",
    msa2Title: "2. 责任限制（关键条款）",
    msa2Desc1: "此证书自主生成，非财务顾问。",
    msa2Desc2: "客户承认并同意：",
    msa2Bullet1: "• 分析可能包含误报。",
    msa2Bullet2: "• 档案不构成法律指令。",
    msa2Bullet3: "• 决定权100%在于客户。",
    msa2Bullet4: "• MB Procdi不对损失负责。",
    msa3Title: "3. 服务级别协议",
    msa3Desc: "在24-48小时内交付最终档案。",
    msa4Title: "4. 保密性",
    msa4Desc: "严格保密，未经授权不提供给第三方。",
    msa5Title: "5. 适用法律",
    msa5Desc: "受立陶宛共和国法律管辖。"
  },
  ru: {
    coverHeader: "Транзакционный криминалистический сертификат",
    coverTitle: "Досье искусственного интеллекта",
    officialCertId: "Официальный ID сертификата",
    auditedEntity: "Аудируемая компания (Цель)",
    validatedTax: "Подтвержденный налоговый номер",
    reportIssueDate: "Дата выпуска отчета",
    execSummary: "Краткий обзор рисков",
    scoreOver: "Балл / 100",
    redAlert: "КРАСНАЯ ТРЕВОГА - ВЫСОКОРИСКОВАЯ ОПЕРАЦИЯ",
    greenLight: "ЗЕЛЕНЫЙ СВЕТ - ЦЕЛОСТНОСТЬ ПОДТВЕРЖДЕНА",
    redAlertDesc: "Многоагентная экосистема обнаружила серьезные сигналы опасности (мошенничество или фиктивность). Рекомендуем заморозить переводы.",
    greenLightDesc: "Корпоративная личность отсканирована криптографически. Критических аномалий не выявлено.",
    targetName: "Название исследуемой компании",
    targetVat: "НДС / Налоговая регистрация",
    targetDomain: "Геопривязанный домен",
    agentsInvolved: "Вовлеченные агенты",
    findingsTitle: "Выявленные аномалии и векторы мошенничества",
    cleanOpTitle: "Операция без красных флагов",
    cleanOpDesc: "Алгоритмы подтверждают, что юридическая структура и физическое существование соответствуют заявлениям.",
    critAlertBadge: "Критическая тревога",
    signatureTitle: "Криптографическая цепочка контроля и валидация",
    agentDD: "Roberto (Due Diligence)",
    agentLegal: "Moisés (Юриспруденция)",
    agentTech: "Alcides (Технологии)",
    conclusionsTitle: "Криминалистические выводы и рекомендации",
    legalNotice: "ПРАВОВОЕ УВЕДОМЛЕНИЕ: Сертификат создан ИИ. Не является юридической консультацией.",
    pageStr: "Страница",
    msaTitle: "ГЛАВНОЕ СОГЛАШЕНИЕ ОБ УСЛУГАХ",
    msaClient: "КЛИЕНТ: Пользователь платформы",
    msaContractor: "ПОДРЯДЧИК: MB PROCDI",
    msa1Title: "1. Объем услуг",
    msa1Desc1: "MB Procdi обязуется предоставить автономный анализ...",
    msa1Desc2: "Также мы проводим аудит интеллектуальной собственности...",
    msa2Title: "2. Ограничение ответственности",
    msa2Desc1: "Сертификат создается ИИ на основе анализа данных.",
    msa2Desc2: "Клиент признает и соглашается:",
    msa2Bullet1: "• Анализ может содержать ложноположительные результаты.",
    msa2Bullet2: "• Досье не является обязательным юридическим советом.",
    msa2Bullet3: "• Окончательное решение остается за клиентом.",
    msa2Bullet4: "• MB Procdi не несет ответственности за убытки.",
    msa3Title: "3. Соглашение об уровне услуг",
    msa3Desc: "Доставка отчета в течение 24-48 часов.",
    msa4Title: "4. Конфиденциальность",
    msa4Desc: "Строгая конфиденциальность всей информации.",
    msa5Title: "5. Применимое право",
    msa5Desc: "Подчиняется законам Литовской Республики."
  },
  ar: {
    coverHeader: "شهادة جنائية للمعاملات",
    coverTitle: "ملف الذكاء الاصطناعي",
    officialCertId: "رقم الشهادة الرسمي",
    auditedEntity: "الكيان الخاضع للتدقيق (الهدف)",
    validatedTax: "المعرف الضريبي المعتمد",
    reportIssueDate: "تاريخ إصدار التقرير",
    execSummary: "الملخص التنفيذي للمخاطر",
    scoreOver: "النتيجة / 100",
    redAlert: "تنبيه أحمر - عملية عالية المخاطر",
    greenLight: "ضوء أخضر - تم التحقق من النزاهة",
    redAlertDesc: "اكتشف النظام علامات حمراء عالية العيار تشير إلى احتيال محتمل. ننصح بتجميد التحويلات.",
    greenLightDesc: "تم مسح الهوية المؤسسية وهيكل العقد. لم تلاحظ أي تشوهات جسيمة.",
    targetName: "اسم الكيان الذي تم التحقيق معه",
    targetVat: "ضريبة القيمة المضافة / التسجيل الضريبي",
    targetDomain: "نطاق المجال الجغرافي",
    agentsInvolved: "الوكلاء المشاركون",
    findingsTitle: "التشوهات وناقلات الاحتيال المكتشفة",
    cleanOpTitle: "عملية بدون علامات حمراء",
    cleanOpDesc: "تؤكد الخوارزميات أن الهيكل القانوني والوجود المادي لا يظهران انحرافات احتمالية.",
    critAlertBadge: "تنبيه حرج",
    signatureTitle: "سلسلة الحفظ والتشفير والتحقق",
    agentDD: "Roberto (العناية الواجبة)",
    agentLegal: "Moisés (الامثال القانوني)",
    agentTech: "Alcides (التقنية)",
    conclusionsTitle: "الاستنتاجات والتوصيات",
    legalNotice: "إشعار قانوني: يتم إنشاء هذه الشهادة بواسطة الذكاء الاصطناعي. لا تشكل نصيحة قانونية.",
    pageStr: "صفحة",
    msaTitle: "الاتفاقية الرئيسية للخدمات",
    msaClient: "العميل: مستخدم المنصة",
    msaContractor: "المقاول: MB PROCDI",
    msa1Title: "1. نطاق الخدمات",
    msa1Desc1: "يتم تقديم تحليل مستقل للذكاء الاصطناعي...",
    msa1Desc2: "بالإضافة إلى تدقيق الملكية الفكرية...",
    msa2Title: "2. حدود المسؤولية",
    msa2Desc1: "الشهادة يتم إنشاؤها بـحسن نية.",
    msa2Desc2: "يقر العميل ويوافق على ما يلي:",
    msa2Bullet1: "• قد يحتوي التحليل على إيجابيات كاذبة.",
    msa2Bullet2: "• الملف ليس نصيحة قانونية.",
    msa2Bullet3: "• القرار النهائي يقع على عاتق العميل 100%.",
    msa2Bullet4: "• الشركة ليست مسؤولة عن أي خسارة مالية.",
    msa3Title: "3. اتفاقية مستوى الخدمة",
    msa3Desc: "تسليم التقرير خلال 24 إلى 48 ساعة عمل.",
    msa4Title: "4. السرية",
    msa4Desc: "يتم التعامل مع المعلومات بسرية تامة.",
    msa5Title: "5. القانون الحاكم",
    msa5Desc: "يخضع لقوانين جمهورية ليتوانيا."
  },
  hi: {
    coverHeader: "लेनदेन फोरेंसिक प्रमाण पत्र",
    coverTitle: "कृत्रिम बुद्धिमत्ता डोजियर",
    officialCertId: "आधिकारिक प्रमाणपत्र आईडी",
    auditedEntity: "लेखा परीक्षित इकाई (लक्ष्य)",
    validatedTax: "मान्य कर पहचानकर्ता",
    reportIssueDate: "रिपोर्ट जारी करने की तिथि",
    execSummary: "कार्यकारी जोखिम सारांश",
    scoreOver: "स्कोर / 100",
    redAlert: "रेड अलर्ट - उच्च जोखिम संचालन",
    greenLight: "ग्रीन लाइट - अखंडता सत्यापित",
    redAlertDesc: "सिस्टम ने उच्च-कैलिबर लाल झंडे का पता लगाया है, जो संभावित धोखाधड़ी का संकेत देता है। स्थानान्तरण को फ्रीज करें।",
    greenLightDesc: "कॉर्पोरेट पहचान और अनुबंध वास्तुकला को स्कैन किया गया है। कोई महत्वपूर्ण विसंगतियां नहीं देखी गईं।",
    targetName: "जांच की गई इकाई का नाम",
    targetVat: "वैट / कर पंजीकरण",
    targetDomain: "भू-संदर्भित डोमेन स्पेक्ट्रम",
    agentsInvolved: "शामिल एजेंट",
    findingsTitle: "विसंगतियां और धोखाधड़ी वैक्टर",
    cleanOpTitle: "लाल झंडे के बिना संचालन",
    cleanOpDesc: "एल्गोरिदम प्रमाणित करते हैं कि कानूनी संरचना और भौतिक अस्तित्व में कोई विचलन नहीं है।",
    critAlertBadge: "गंभीर चेतावनी",
    signatureTitle: "क्रिप्टोग्राफिक चेन ऑफ कस्टडी",
    agentDD: "Roberto (उचित परिश्रम)",
    agentLegal: "Moisés (कानूनी)",
    agentTech: "Alcides (तकनीकी)",
    conclusionsTitle: "फोरेंसिक निष्कर्ष और सिफारिशें",
    legalNotice: "कानूनी सूचना: यह प्रमाण पत्र AI द्वारा उत्पन्न किया गया है। यह कानूनी सलाह नहीं है।",
    pageStr: "पृष्ठ",
    msaTitle: "फोरेंसिक सेवा मास्टर समझौता",
    msaClient: "ग्राहक: प्लेटफ़ॉर्म उपयोगकर्ता",
    msaContractor: "ठेकेदार: MB PROCDI",
    msa1Title: "1. सेवाओं का दायरा",
    msa1Desc1: "स्वायत्त बुद्धि विश्लेषण प्रदान करता है...",
    msa1Desc2: "बौद्धिक संपदा अधिकारों का ऑडिट...",
    msa2Title: "2. दायित्व की सीमा",
    msa2Desc1: "प्रमाणपत्र एआई द्वारा उत्पन्न किया गया है।",
    msa2Desc2: "ग्राहक स्वीकार करता है और सहमत है:",
    msa2Bullet1: "• विश्लेषण में झूठी सकारात्मकता हो सकती है।",
    msa2Bullet2: "• यह कानूनी सलाह नहीं है।",
    msa2Bullet3: "• निर्णय पूरी तरह से ग्राहक पर निर्भर है।",
    msa2Bullet4: "• MB Procdi नुकसान के लिए उत्तरदायी नहीं है।",
    msa3Title: "3. सेवा स्तर समझौता",
    msa3Desc: "24-48 घंटों के भीतर रिपोर्ट की डिलीवरी।",
    msa4Title: "4. गोपनीयता",
    msa4Desc: "सख्त गोपनीयता बनाए रखी जाएगी।",
    msa5Title: "5. शासी कानून",
    msa5Desc: "लिथुआनिया गणराज्य के कानूनों द्वारा शासित।"
  }
};

export const SureReportTemplate: React.FC<SureReportTemplateProps> = ({ data, reportId, language = "en" }) => {
  const isHighRisk = data.riskScore > 50;
  
  // Ensure fallback to english if language is not explicitly defined in our dictionary
  const baseT = pdfTranslations[language] || pdfTranslations["en"];
  const t = {
    ...baseT,
    scaleTitle: language === 'es' ? "Índice de Escala de Riesgo Forense SURE" : "SURE Forensic Risk Scale Index",
    scale020Title: language === 'es' ? "Riesgo Bajo" : "Low Risk",
    scale020Desc: language === 'es' ? "Integridad verificada, contraparte elegible" : "Verified integrity, compliant counterparty",
    scale2150Title: language === 'es' ? "Riesgo Moderado" : "Moderate Risk",
    scale2150Desc: language === 'es' ? "Anomalías menores o datos KYC incompletos" : "Minor anomalies or incomplete KYC data",
    scale5175Title: language === 'es' ? "Riesgo Alto" : "High Risk",
    scale5175Desc: language === 'es' ? "Discrepancias graves o desvíos de origen" : "Severe discrepancies or origin mismatches",
    scale76100Title: language === 'es' ? "Riesgo Crítico" : "Critical Risk",
    scale76100Desc: language === 'es' ? "Sospecha de falsificación o licencia vencida" : "Structural forgery or expired license suspected",
  };
  const isArabic = language === 'ar';
  const isRussian = language === 'ru';
  const isChinese = language === 'zh';
  const isHindi = language === 'hi';

  // Helper function to strip unsupported characters (Arabic, Cyrillic, CJK, Devanagari) that break react-pdf layout engine
  const sanitizeText = (text: string) => {
    if (!text) return text;
    let sanitized = text;

    if (isArabic) {
      // Keep Latin-1 + Arabic ranges
      sanitized = sanitized.replace(/[^\x00-\xFF\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/g, '');
    } else if (isRussian) {
      // Keep Latin-1 + Standard Cyrillic
      sanitized = sanitized.replace(/[^\x00-\xFF\u0400-\u04FF]/g, '');
    } else if (isChinese) {
      // Keep Latin-1 + CJK Unified + CJK Ext A
      sanitized = sanitized.replace(/[^\x00-\xFF\u4E00-\u9FFF\u3400-\u4DBF]/g, '');
      try {
        sanitized = sanitized.replace(new RegExp('[^\\x00-\\xFF\\u4E00-\\u9FFF\\u3400-\\u4DBF\\u{20000}-\\u{2A6DF}]', 'gu'), '');
      } catch (e) {}
    } else if (isHindi) {
      // Keep Latin-1 + Devanagari
      sanitized = sanitized.replace(/[^\x00-\xFF\u0900-\u097F]/g, '');
    } else {
      // For English, Spanish, Portuguese, French, German: Keep only Latin-1 (code points 0-255)
      sanitized = sanitized.replace(/[^\x00-\xFF]/g, '');
    }

    return sanitized.replace(/\(\s*\)/g, '').replace(/\s{2,}/g, ' ').trim();
  };

  const safeData = {
    ...data,
    companyName: sanitizeText(data.companyName),
    recommendations: sanitizeText(data.recommendations || ''),
    anomalies: data.anomalies.map(a => ({
      title: sanitizeText(a.title),
      description: sanitizeText(a.description)
    }))
  };

  let pageStyleOverrides: any = {};
  if (isArabic) {
    pageStyleOverrides = { fontFamily: 'Cairo', textAlign: 'right' };
  } else if (isRussian) {
    pageStyleOverrides = { fontFamily: 'Roboto' };
  } else if (isChinese) {
    pageStyleOverrides = { fontFamily: 'NotoSansSC' };
  } else if (isHindi) {
    pageStyleOverrides = { fontFamily: 'NotoSansDevanagari' };
  }

  return (
    <Document title={`Reporte SURE - ${safeData.companyName}`} author="SURE Forensics AI" creator="Antigravity">
      
      {/* 1. PORTADA CORPORATIVA PREMIUM */}
      <Page size="A4" style={{ ...styles.coverPage, ...pageStyleOverrides }}>
        <Text style={styles.coverWatermark}>SURE</Text>
        
        {/* Placeholder for Logo, will fallback gracefully if image fails */}
        <Image style={styles.coverLogo} src="/logo-sure.png" />
        
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={{ ...styles.coverHeader, textAlign: isArabic ? 'right' : 'left' }}>{t.coverHeader}</Text>
          <Text style={{ ...styles.coverTitle, textAlign: isArabic ? 'right' : 'left' }}>{t.coverTitle}</Text>
          <View style={{ ...styles.coverDivider, alignSelf: isArabic ? 'flex-end' : 'flex-start' }} />
          
          <View style={{ ...styles.coverDataMatrix, borderLeft: isArabic ? 'none' : `4px solid ${primaryBlue}`, borderRight: isArabic ? `4px solid ${primaryBlue}` : 'none' }}>
            {reportId && (
              <View style={styles.coverMatrixRow}>
                <Text style={styles.coverMatrixLabel}>{t.officialCertId}</Text>
                <Text style={{ ...styles.coverMatrixValue, fontFamily: 'Courier', color: primaryBlue }}>{reportId}</Text>
              </View>
            )}
            <View style={styles.coverMatrixRow}>
              <Text style={styles.coverMatrixLabel}>{t.auditedEntity}</Text>
              <Text style={styles.coverMatrixValue}>{safeData.companyName}</Text>
            </View>
            <View style={styles.coverMatrixRow}>
              <Text style={styles.coverMatrixLabel}>{t.validatedTax}</Text>
              <Text style={styles.coverMatrixValue}>{safeData.taxId}</Text>
            </View>
            <View style={{ ...styles.coverMatrixRow, borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
              <Text style={styles.coverMatrixLabel}>{t.reportIssueDate}</Text>
              <Text style={styles.coverMatrixValue}>{safeData.dateGenerated}</Text>
            </View>
          </View>
        </View>

        <View style={styles.coverFooter}>
          <Text style={styles.coverFooterText}>
            CONFIDENTIAL. This dossier has been autonomously generated by the SURE Forensics AI agent network. Designed exclusively for corporate capital protection and SME transactional due diligence.
          </Text>
        </View>
      </Page>

      {/* 2. PÁGINAS INTERNAS (Cuerpo del Reporte) */}
      <Page size="A4" style={{ ...styles.innerPage, ...pageStyleOverrides }}>
        {/* Dynamic Risk Ribbon */}
        <View style={isHighRisk ? styles.ribbonRed : styles.ribbonGreen} fixed />

        {/* Minimalist Corporate Header */}
        <View style={{ ...styles.headerContainer, flexDirection: isArabic ? 'row-reverse' : 'row' }} fixed>
          <View style={{ alignItems: isArabic ? 'flex-end' : 'flex-start' }}>
            <Text style={styles.headerLeftText}>SURE FORENSICS <Text style={{ color: primaryBlue }}>//</Text> INTELLIGENCE DOSSIER</Text>
            {reportId && <Text style={{ fontSize: 8, color: slateText, marginTop: 4, fontFamily: 'Courier' }}>ID: {reportId}</Text>}
          </View>
          <Image style={styles.headerRightImage} src="/logo-sure.png" />
        </View>

        <Text style={{ ...styles.execSummaryTitle, textAlign: isArabic ? 'right' : 'left' }}>{t.execSummary}</Text>

        {/* Risk Level Panel */}
        <View style={styles.riskBoxWrapper}>
          <View style={styles.riskBoxScore}>
            <Text style={isHighRisk ? styles.scoreNumberRed : styles.scoreNumberGreen}>{safeData.riskScore}</Text>
            <Text style={styles.scoreSub}>{t.scoreOver}</Text>
          </View>
          <View style={styles.riskBoxDetails}>
            <Text style={{ ...styles.riskVerdictTitle, ...(isHighRisk ? styles.riskVerdictRed : styles.riskVerdictGreen) }}>
              {isHighRisk ? t.redAlert : t.greenLight}
            </Text>
            <Text style={styles.riskVerdictDesc}>
              {isHighRisk ? t.redAlertDesc : t.greenLightDesc}
            </Text>
          </View>
        </View>

        {/* Risk Scale Legend Index */}
        <View style={styles.scaleLegendWrapper}>
          <Text style={styles.scaleLegendTitle}>{t.scaleTitle}</Text>
          <View style={styles.scaleGrid}>
            <View style={{ ...styles.scaleSegment, backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderLeft: '3px solid #065f46' }}>
              <Text style={{ ...styles.scaleSegmentTitle, color: '#065f46' }}>{t.scale020Title}</Text>
              <Text style={{ ...styles.scaleSegmentRange, color: '#065f46' }}>0 - 20</Text>
              <Text style={styles.scaleSegmentDesc}>{t.scale020Desc}</Text>
            </View>
            <View style={{ ...styles.scaleSegment, backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderLeft: '3px solid #b45309' }}>
              <Text style={{ ...styles.scaleSegmentTitle, color: '#b45309' }}>{t.scale2150Title}</Text>
              <Text style={{ ...styles.scaleSegmentRange, color: '#b45309' }}>21 - 50</Text>
              <Text style={styles.scaleSegmentDesc}>{t.scale2150Desc}</Text>
            </View>
            <View style={{ ...styles.scaleSegment, backgroundColor: '#fff7ed', border: '1px solid #fed7aa', borderLeft: '3px solid #f59e0b' }}>
              <Text style={{ ...styles.scaleSegmentTitle, color: '#f59e0b' }}>{t.scale5175Title}</Text>
              <Text style={{ ...styles.scaleSegmentRange, color: '#f59e0b' }}>51 - 75</Text>
              <Text style={styles.scaleSegmentDesc}>{t.scale5175Desc}</Text>
            </View>
            <View style={{ ...styles.scaleSegment, backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderLeft: '3px solid #991b1b' }}>
              <Text style={{ ...styles.scaleSegmentTitle, color: '#991b1b' }}>{t.scale76100Title}</Text>
              <Text style={{ ...styles.scaleSegmentRange, color: '#991b1b' }}>76 - 100</Text>
              <Text style={styles.scaleSegmentDesc}>{t.scale76100Desc}</Text>
            </View>
          </View>
        </View>

        {/* Target Profile Matrix */}
        <View style={styles.targetGrid}>
          <View style={styles.targetCell}>
            <Text style={styles.targetLabel}>{t.targetName}</Text>
            <Text style={styles.targetValue}>{safeData.companyName}</Text>
          </View>
          <View style={styles.targetCell}>
            <Text style={styles.targetLabel}>{t.targetVat}</Text>
            <Text style={styles.targetValue}>{safeData.taxId}</Text>
          </View>
          <View style={styles.targetCell}>
            <Text style={styles.targetLabel}>{t.targetDomain}</Text>
            <Text style={styles.targetValue}>{safeData.website}</Text>
          </View>
          <View style={styles.targetCell}>
            <Text style={styles.targetLabel}>{t.agentsInvolved}</Text>
            <Text style={styles.targetValue}>Roberto, Moisés, Alcides</Text>
          </View>
        </View>

        {/* Findings / Triggers Section */}
        <View>
          <Text style={styles.findingsTitle}>{t.findingsTitle}</Text>
          
          {safeData.anomalies.length === 0 ? (
             <View style={styles.cleanCard}>
                <Text style={{ ...styles.findingTitle, color: successGreen, marginBottom: 5 }}>{t.cleanOpTitle}</Text>
                <Text style={styles.findingDesc}>{t.cleanOpDesc}</Text>
             </View>
          ) : (
            safeData.anomalies.map((anomaly, idx) => (
              <View wrap={false} style={styles.findingCard} key={idx}>
                <View style={styles.findingHeader}>
                  <Text style={styles.findingTitle}>{idx + 1}. {anomaly.title}</Text>
                  <Text style={styles.findingBadge}>{t.critAlertBadge}</Text>
                </View>
                <Text style={styles.findingDesc}>{anomaly.description}</Text>
              </View>
            ))
          )}
        </View>

        {/* Signature Block */}
        <View style={styles.signatureBlock} wrap={false}>
          <Text style={styles.signatureTitle}>{t.signatureTitle}</Text>
          <View style={styles.signatureGrid}>
            <View style={styles.signatureItem}>
              <Text style={styles.signatureAgent}>{t.agentDD}</Text>
              <Text style={styles.signatureId}>NODE ID: ROB-9X</Text>
              <Text style={styles.signatureHash}>HASH: a8f7b...9c2</Text>
            </View>
            <View style={styles.signatureItem}>
              <Text style={styles.signatureAgent}>{t.agentLegal}</Text>
              <Text style={styles.signatureId}>NODE ID: MOI-2B</Text>
              <Text style={styles.signatureHash}>HASH: f4d2e...1a8</Text>
            </View>
            <View style={styles.signatureItem}>
              <Text style={styles.signatureAgent}>{t.agentTech}</Text>
              <Text style={styles.signatureId}>NODE ID: ALC-7V</Text>
              <Text style={styles.signatureHash}>HASH: e9c4f...8b1</Text>
            </View>
          </View>
        </View>

        {/* Conclusions and Recommendations Section */}
        {safeData.recommendations && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ ...styles.findingsTitle, borderBottom: 'none', marginBottom: 10 }}>{t.conclusionsTitle}</Text>
            <View style={{ padding: 15, backgroundColor: surfaceGray, borderRadius: 4, border: '1px solid #e2e8f0' }}>
              <Text style={{ fontSize: 10, color: slateDark, lineHeight: 1.6, fontWeight: isHighRisk ? 'bold' : 'normal' }}>
                {safeData.recommendations}
              </Text>
            </View>
          </View>
        )}

        {/* Corporate Footer (repeats) */}
        <View style={styles.innerFooter} fixed>
          <Text style={styles.footerDisclaimer}>
            {t.legalNotice}
          </Text>
          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
            `${t.pageStr} ${pageNumber} / ${totalPages}`
          )} fixed />
        </View>

      </Page>

      {/* 3. PÁGINAS LEGAL (Acuerdo Maestro) */}
      <Page size="A4" style={{ ...styles.innerPage, ...pageStyleOverrides }}>
        <View style={{ ...styles.headerContainer, flexDirection: isArabic ? 'row-reverse' : 'row' }} fixed>
          <View style={{ alignItems: isArabic ? 'flex-end' : 'flex-start' }}>
            <Text style={styles.headerLeftText}>SURE FORENSICS <Text style={{ color: primaryBlue }}>//</Text> LEGAL & COMPLIANCE</Text>
          </View>
          <Image style={styles.headerRightImage} src="/logo-sure.png" />
        </View>

        <Text style={{ ...styles.execSummaryTitle, textAlign: isArabic ? 'right' : 'left' }}>{t.msaTitle}</Text>
        
        <View style={{ marginTop: 10, marginBottom: 20 }}>
          <Text style={{ fontSize: 9, color: slateText, marginBottom: 5 }}>• {t.msaClient}</Text>
          <Text style={{ fontSize: 9, color: slateText, marginBottom: 15 }}>• {t.msaContractor}</Text>

          <Text style={{ fontSize: 10, fontWeight: 'bold', color: slateDark, marginBottom: 4 }}>{t.msa1Title}</Text>
          <Text style={{ fontSize: 9, color: slateText, marginBottom: 4, lineHeight: 1.5 }}>
            {t.msa1Desc1}
          </Text>
          <Text style={{ fontSize: 9, color: slateText, marginBottom: 12, lineHeight: 1.5 }}>
            {t.msa1Desc2}
          </Text>

          <Text style={{ fontSize: 10, fontWeight: 'bold', color: dangerRed, marginBottom: 4 }}>{t.msa2Title}</Text>
          <Text style={{ fontSize: 9, color: slateText, marginBottom: 6, lineHeight: 1.5 }}>
            {t.msa2Desc1}
          </Text>
          <Text style={{ fontSize: 9, color: slateText, marginBottom: 4 }}>{t.msa2Desc2}</Text>
          <Text style={{ fontSize: 9, color: slateText, marginBottom: 2, marginLeft: 10 }}>{t.msa2Bullet1}</Text>
          <Text style={{ fontSize: 9, color: slateText, marginBottom: 2, marginLeft: 10 }}>{t.msa2Bullet2}</Text>
          <Text style={{ fontSize: 9, color: slateText, marginBottom: 2, marginLeft: 10 }}>{t.msa2Bullet3}</Text>
          <Text style={{ fontSize: 9, color: slateText, marginBottom: 12, marginLeft: 10, lineHeight: 1.4 }}>{t.msa2Bullet4}</Text>

          <Text style={{ fontSize: 10, fontWeight: 'bold', color: slateDark, marginBottom: 4 }}>{t.msa4Title.replace(/^\d+/, "3")}</Text>
          <Text style={{ fontSize: 9, color: slateText, marginBottom: 12, lineHeight: 1.5 }}>
            {t.msa4Desc}
          </Text>

          <Text style={{ fontSize: 10, fontWeight: 'bold', color: slateDark, marginBottom: 4 }}>{t.msa5Title.replace(/^\d+/, "4")}</Text>
          <Text style={{ fontSize: 9, color: slateText, marginBottom: 12, lineHeight: 1.5 }}>
            {t.msa5Desc}
          </Text>
        </View>
        
        {/* Corporate Footer (repeats) */}
        <View style={styles.innerFooter} fixed>
          <Text style={styles.footerDisclaimer}>
            {t.legalNotice}
          </Text>
          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
            `${t.pageStr} ${pageNumber} / ${totalPages}`
          )} fixed />
        </View>
      </Page>
    </Document>
  );
};
