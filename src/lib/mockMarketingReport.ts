import { ReportData } from '@/components/pdf/SureReportTemplate';

export const mockMarketingReport: ReportData = {
  companyName: "GLOBAL PETROCORP HOLDINGS (REDACTED)",
  taxId: "CENSURADO POR SEGURIDAD",
  website: "www.globalpetrocorp-redacted.com",
  dateGenerated: new Date().toLocaleDateString(),
  riskScore: 99,
  anomalies: [
    {
      title: "Entidad Corporativa No Verificable - Suplantación de Jurisdicción",
      description: "La entidad emisora no aparece en los registros públicos accesibles de la jurisdicción declarada. La apropiación de nombres corporativos genéricos asociados al sector petrolero para otorgar credibilidad a una oferta comercial es un patrón estadísticamente frecuente en esquemas de fraude. No se proporciona licencia del Ministerio de Energía, ni número de identificación fiscal verificable."
    },
    {
      title: "Anomalías Sistémicas de Precios - Desviación del 60% del Benchmark Global",
      description: "Se identificaron desviaciones materiales en la mayoría de los productos declarados respecto a los benchmarks de mercado globales vigentes. Ninguna refinería legítima con producto real vendería a este descuento sin justificación contractual extraordinaria. Esta inconsistencia sugiere que la matriz de precios fue construida con datos arbitrarios para captar la atención de compradores incautos."
    },
    {
      title: "Arquitectura de Mecanismos de Pago Anticipado",
      description: "El documento contiene múltiples mecanismos de pago anticipado integrados en sus procedimientos contractuales: (A) Tarifa de 'Extensión de Tanque' pagadera antes de cualquier inspección verificada; (B) Depósito anticipado de USD $250,000 como 'Garantía de Asignación' mediante transferencia T/T sin protección fiduciaria. Este es el mecanismo operativo central documentado en esquemas de fraude de anticipo."
    },
    {
      title: "Imposibilidad Logística y Geográfica",
      description: "El documento declara puertos de carga y volúmenes de exportación que son físicamente imposibles para la ubicación declarada. La combinación de esta imposibilidad con una dirección corporativa no específica (apartamento residencial) hace que la oferta sea estructuralmente no creíble."
    }
  ],
  recommendations: "SÍNTESIS EJECUTIVA FINAL — SURE TRANSACTIONAL CERTIFICATE: Los agentes convergen de forma unánime en un veredicto de riesgo extremo. ACCIÓN OBLIGATORIA: (1) NO emitir ICPO bajo ninguna circunstancia. (2) NO transferir fondos de ningún tipo (tarifas de extensión, depósitos de garantía). (3) NO compartir datos bancarios ni información corporativa con esta entidad. [NOTA: Este reporte de demostración ilustra el nivel de profundidad analítica que la plataforma SURE ejecuta autónomamente para proteger capital corporativo. Los datos presentados aquí son ficticios con propósitos de mercadeo]."
};

export const mockMarketingReportEN: ReportData = {
  companyName: "GLOBAL PETROCORP HOLDINGS (REDACTED)",
  taxId: "CENSORED FOR SECURITY",
  website: "www.globalpetrocorp-redacted.com",
  dateGenerated: new Date().toLocaleDateString(),
  riskScore: 99,
  anomalies: [
    {
      title: "Unverifiable Corporate Entity - Jurisdictional Spoofing",
      description: "The issuing entity does not appear in accessible public records within the declared jurisdiction. The appropriation of generic corporate names associated with the oil sector to grant credibility to a commercial offer is a statistically frequent pattern in fraud schemes. Neither an Energy Ministry license nor a verifiable tax identification number is provided."
    },
    {
      title: "Systemic Price Anomalies - 60% Deviation from Global Benchmark",
      description: "Material deviations were identified in the majority of declared products compared to current global market benchmarks. No legitimate refinery with real product would sell at this discount without extraordinary contractual justification. This inconsistency suggests the pricing matrix was constructed using arbitrary data to attract unwary buyers."
    },
    {
      title: "Advance Payment Mechanism Architecture",
      description: "The document contains multiple advance payment mechanisms embedded within its contractual procedures: (A) 'Tank Extension Fee' payable before any verified inspection; (B) USD $250,000 upfront deposit as an 'Allocation Guarantee' via T/T wire transfer without fiduciary protection. This is the central operational mechanism documented in advance fee fraud schemes."
    },
    {
      title: "Logistical and Geographic Impossibility",
      description: "The document declares loading ports and export volumes that are physically impossible for the declared location. The combination of this impossibility with a non-specific corporate address (residential apartment) makes the offer structurally not credible."
    }
  ],
  recommendations: "FINAL EXECUTIVE SYNTHESIS — SURE TRANSACTIONAL CERTIFICATE: The agents converge unanimously on an extreme risk verdict. MANDATORY ACTION: (1) DO NOT issue an ICPO under any circumstances. (2) DO NOT transfer funds of any kind (extension fees, guarantee deposits). (3) DO NOT share banking data or corporate information with this entity. [NOTE: This demonstration report illustrates the depth of analytical due diligence the SURE platform autonomously executes to protect corporate capital. The data presented here is fictional for marketing purposes]."
};
