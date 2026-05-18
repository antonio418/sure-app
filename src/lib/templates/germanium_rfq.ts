export interface GermaniumRFQTemplateVars {
  nombre_contacto: string;
  nombre_empresa: string;
  ice_breaker: string;
  language?: 'es' | 'pt' | 'en';
}

export function generateGermaniumRFQHtml(vars: GermaniumRFQTemplateVars): string {
  let greeting = `Dear ${vars.nombre_contacto || 'Team'},`;
  let intro = `We are pleased to submit this Request for Quotation (RFQ) to <strong>${vars.nombre_empresa}</strong> for high-purity germanium materials. We are actively seeking to establish a reliable supply partnership to support our client's advanced semiconductor and photonic applications.`;
  let reqTitle = `REQUEST FOR QUOTATION (RFQ)`;
  let reqSub = `High-Purity Germanium Materials for Semiconductor Applications`;
  
  let section1Title = "1. INTRODUCTION";
  let section1Text = "The buyer, a company specializing in advanced photonic materials and semiconductor applications, is seeking reliable suppliers for high-purity germanium materials. This Request for Quotation (RFQ) is issued to qualified distributors and resellers to establish a long-term supply partnership capable of fulfilling progressive material requirements over a 4-year period.";
  
  let section2Title = "2. MATERIALS REQUIRED";
  let section2Text = `The materials described below are presented in order of preference. The first-choice material is referred to as "Material #1". The alternative material, to be supplied only if "Material #1" is unavailable or less viable, is referred to as "Material #2".`;
  
  let section3Title = "3. PROGRESSIVE PURCHASE SCHEDULE (4-Year Plan)";
  let section3Text = `<em>Note: The following schedule represents our projected requirements for BOTH Material #1 or Material #2 combined. Quantities may be adjusted based on actual production needs. <strong>If you do not have the complete volumes available, a partial volume is also of interest to us. Please do not hesitate to respond.</strong></em>`;
  
  let section4Title = "4. DELIVERY TERMS";
  let section4List = `
  <li><strong>Incoterms:</strong> Ex-Works (EXW) - Incoterms&reg; 2020</li>
  <li><strong>Carrier:</strong> DHL</li>
  <li><strong>Delivery Address:</strong> Carrier will pick up the material directly at your warehouse.</li>
  <li><strong>Lead Time:</strong> To be quoted by supplier (standard and expedited options).</li>
  <li><strong>Partial Shipments:</strong> Acceptable with prior agreement.</li>
  <li><strong>Packaging Requirements:</strong> Inert atmosphere, moisture-proof, and clearly labeled with material specifications.</li>
  `;
  
  let section5Title = "5. PAYMENT TERMS";
  let section5List = `
  <li><strong>Preferred Currency:</strong> USD or EUR</li>
  <li><strong>Payment Methods (TBA):</strong> Letter of Credit (LC), Documentary Letter of Credit (DLC), Standby Letter of Credit (SBLC), or alternative secure methods.</li>
  `;
  let section5Note = `<em>Note: Specific payment terms to be finalized during commercial negotiations.</em>`;
  
  let section6Title = "6. COMPLIANCE & REGULATORY";
  let section6Text = "Both parties shall ensure strict compliance with all applicable export, import, and international trade regulations, including any licensing requirements related to germanium.";

  let section7Title = "7. QUALITY ASSURANCE & DOCUMENTATION";
  let section7List = `
  <li><strong>Certificate of Analysis (CoA):</strong> Required with each shipment, detailing purity levels, impurity analysis, and physical properties.</li>
  <li><strong>Material Safety Data Sheet (MSDS/SDS):</strong> Required in English.</li>
  <li><strong>Quality Certifications:</strong> ISO 9001 or equivalent quality management certification preferred.</li>
  <li><strong>Export/Import Compliance:</strong> Supplier must comply with all applicable export control regulations, import licensing requirements, and dual-use goods controls.</li>
  <li><strong>Traceability:</strong> Full traceability of material origin (primary production or recycled source).</li>
  <li><strong>Testing Methods:</strong> ICP-MS, ICP-OES, or equivalent analytical methods for purity verification.</li>
  `;

  let section8Title = "8. QUOTATION REQUIREMENTS";
  let section8Text = "Suppliers are requested to provide the following information in their formal quotation:";
  let section8List = `
  <li><strong>Unit Price (USD/EUR per kg)</strong> for Material #1 (5N) OR Material #2 (5N).</li>
  <li><strong>Volume Discount Structure:</strong> Price breaks for larger quantities.</li>
  <li><strong>Minimum Order Quantity (MOQ):</strong> Per material and per shipment.</li>
  <li><strong>Lead Time:</strong> Standard delivery time from order confirmation.</li>
  <li><strong>Payment Terms Offered:</strong> LC, DLC, SBLC, or secure alternatives.</li>
  <li><strong>Company Profile:</strong> Brief description, years in business, and certifications.</li>
  <li><strong>Technical Support:</strong> Availability of technical consultation and after-sales support.</li>
  `;

  let section9Title = "9. GENERAL CONDITIONS";
  let section9List = `
  <li>The buyer reserves the right to accept or reject any or all quotations without providing reasons.</li>
  <li>This RFQ does not constitute a binding purchase commitment. A formal Purchase Order will be issued upon supplier selection.</li>
  <li>Quantities specified are estimates and may be adjusted based on actual production requirements.</li>
  <li>All technical information shared during this RFQ process is strictly confidential and subject to Non-Disclosure Agreements (NDA).</li>
  `;
  
  let footerTitle = "QUOTATION SUBMISSION";
  let footerText = `
<p><strong>Please submit your quotation by email to:</strong> <a href="mailto:antonio@procdi.com" style="color: #4472C4;">antonio@procdi.com</a><br>
<strong>Subject Line:</strong> RFQ Germanium Materials - ${vars.nombre_empresa}<br>
For clarifications, please contact: <a href="mailto:antonio@procdi.com" style="color: #4472C4;">antonio@procdi.com</a></p>
<p>We look forward to receiving your competitive quotation.</p>
  `;

  if (vars.language === 'es') {
    greeting = `Estimado/a ${vars.nombre_contacto || 'Equipo Directivo'},`;
    intro = `Nos complace presentar formalmente esta Solicitud de Cotización (RFQ) a <strong>${vars.nombre_empresa}</strong> para la provisión de materiales de germanio de alta pureza. Nuestro objetivo es establecer una alianza de suministro sólida y a largo plazo para respaldar las aplicaciones fotónicas y de semiconductores de nuestro cliente. (Las especificaciones técnicas a continuación se detallan en el estándar internacional en inglés).`;
    reqTitle = `SOLICITUD DE COTIZACIÓN (RFQ)`;
    reqSub = `Materiales de Germanio de Alta Pureza para Aplicaciones de Semiconductores`;
    
    section1Title = "1. INTRODUCCIÓN";
    section1Text = "El comprador, una empresa especializada en materiales fotónicos avanzados y aplicaciones de semiconductores, busca proveedores confiables para materiales de germanio de alta pureza. Esta Solicitud de Cotización (RFQ) se emite a distribuidores y revendedores calificados para establecer una asociación de suministro a largo plazo capaz de cumplir con los requisitos progresivos de material durante un período de 4 años.";
    
    section2Title = "2. MATERIALES REQUERIDOS";
    section2Text = `Los materiales descritos a continuación se presentan en orden de preferencia. El material de primera opción se denomina "Material #1". El material alternativo, que se suministrará solo si el "Material #1" no está disponible o es menos viable, se denomina "Material #2".`;
    
    section3Title = "3. CRONOGRAMA DE COMPRAS PROGRESIVAS (Plan de 4 Años)";
    section3Text = `<em>Nota: El siguiente cronograma representa nuestros requisitos proyectados para el Material #1 o el Material #2 combinados. Las cantidades pueden ajustarse según las necesidades reales de producción. <strong>Si no dispone de los volúmenes completos, un volumen parcial también es de nuestro interés. Por favor no dude en responder.</strong></em>`;
    
    section4Title = "4. TÉRMINOS DE ENTREGA";
    section4List = `
    <li><strong>Incoterms:</strong> Ex-Works (EXW) - Incoterms&reg; 2020</li>
    <li><strong>Transportista (Carrier):</strong> DHL</li>
    <li><strong>Dirección de Entrega:</strong> El transportista recogerá el material directamente en su almacén.</li>
    <li><strong>Tiempo de entrega (Lead Time):</strong> A ser cotizado por el proveedor (opciones estándar y aceleradas).</li>
    <li><strong>Envíos parciales:</strong> Aceptables con acuerdo previo.</li>
    <li><strong>Requisitos de embalaje:</strong> Atmósfera inerte, a prueba de humedad y claramente etiquetado con las especificaciones del material.</li>
    `;
    
    section5Title = "5. TÉRMINOS DE PAGO";
    section5List = `
    <li><strong>Moneda preferida:</strong> USD o EUR</li>
    <li><strong>Métodos de Pago:</strong> Carta de Crédito (LC), Carta de Crédito Documentaria (DLC), Carta de Crédito Standby (SBLC), u otros métodos seguros alternativos.</li>
    `;
    section5Note = `<em>Nota: Los términos de pago específicos se finalizarán durante las negociaciones comerciales.</em>`;
    
    section6Title = "6. CUMPLIMIENTO Y NORMATIVA";
    section6Text = "Ambas partes garantizarán el estricto cumplimiento de todas las regulaciones aplicables de exportación, importación y comercio internacional, incluidos los requisitos de licencias relacionados con el germanio.";
    
    section7Title = "7. GARANTÍA DE CALIDAD Y DOCUMENTACIÓN";
    section7List = `
    <li><strong>Certificado de Análisis (CoA):</strong> Requerido con cada envío, detallando niveles de pureza, análisis de impurezas y propiedades físicas.</li>
    <li><strong>Hoja de Datos de Seguridad (MSDS/SDS):</strong> Requerida en Inglés.</li>
    <li><strong>Certificaciones de Calidad:</strong> Se prefiere ISO 9001 o certificación de gestión de calidad equivalente.</li>
    <li><strong>Cumplimiento de Exportación/Importación:</strong> El proveedor debe cumplir con las regulaciones de control de exportaciones aplicables y controles de bienes de doble uso.</li>
    <li><strong>Trazabilidad:</strong> Trazabilidad completa del origen del material.</li>
    <li><strong>Métodos de prueba:</strong> ICP-MS, ICP-OES o métodos analíticos equivalentes para verificación de pureza.</li>
    `;
    
    section8Title = "8. REQUISITOS DE COTIZACIÓN";
    section8Text = "Se solicita a los proveedores proporcionar la siguiente información en su cotización formal:";
    section8List = `
    <li><strong>Precio Unitario (USD/EUR por kg)</strong> para Material #1 (5N) O Material #2 (5N).</li>
    <li><strong>Estructura de descuentos por volumen:</strong> Precios preferenciales para cantidades mayores.</li>
    <li><strong>Cantidad Mínima de Pedido (MOQ):</strong> Por material y por envío.</li>
    <li><strong>Tiempo de entrega (Lead Time):</strong> Tiempo de entrega estándar desde la confirmación del pedido.</li>
    <li><strong>Términos de pago ofrecidos:</strong> LC, DLC, SBLC o alternativas seguras.</li>
    <li><strong>Perfil de la empresa:</strong> Breve descripción, años en el negocio y certificaciones.</li>
    <li><strong>Soporte técnico:</strong> Disponibilidad de consulta técnica y soporte postventa.</li>
    `;
    
    section9Title = "9. CONDICIONES GENERALES";
    section9List = `
    <li>El comprador se reserva el derecho de aceptar o rechazar cualquier cotización sin proporcionar motivos.</li>
    <li>Esta RFQ no constituye un compromiso de compra vinculante. Se emitirá una Orden de Compra formal al seleccionar al proveedor.</li>
    <li>Las cantidades son estimadas y pueden ajustarse según los requisitos reales de producción.</li>
    <li>Toda la información técnica compartida durante este proceso es estrictamente confidencial.</li>
    `;
    
    footerTitle = "ENVÍO DE COTIZACIÓN";
    footerText = `
<p><strong>Por favor envíe su cotización por correo electrónico a:</strong> <a href="mailto:antonio@procdi.com" style="color: #4472C4;">antonio@procdi.com</a><br>
<strong>Asunto del Correo:</strong> RFQ Germanium Materials - ${vars.nombre_empresa}<br>
Para aclaraciones, por favor contacte a: <a href="mailto:antonio@procdi.com" style="color: #4472C4;">antonio@procdi.com</a></p>
<p>Esperamos recibir su cotización competitiva.</p>
    `;

  } else if (vars.language === 'pt') {
    greeting = `Prezado(a) ${vars.nombre_contacto || 'Equipe Diretiva'},`;
    intro = `Temos o prazer de apresentar formalmente esta Solicitação de Cotação (RFQ) à <strong>${vars.nombre_empresa}</strong> para o fornecimento de materiais de germânio de alta pureza. Nosso objetivo é estabelecer uma aliança de fornecimento sólida e de longo prazo para apoiar as aplicações fotônicas e de semicondutores do nosso cliente. (As especificações técnicas abaixo são detalhadas no padrão internacional em inglês).`;
    reqTitle = `SOLICITAÇÃO DE COTAÇÃO (RFQ)`;
    reqSub = `Materiais de Germânio de Alta Pureza para Aplicações de Semicondutores`;
    
    section1Title = "1. INTRODUÇÃO";
    section1Text = "O comprador, uma empresa especializada em materiais fotônicos avançados e aplicações de semicondutores, busca fornecedores confiáveis para materiais de germânio de alta pureza. Esta Solicitação de Cotação (RFQ) é emitida para distribuidores e revendedores qualificados para estabelecer uma parceria de fornecimento a longo prazo capaz de atender aos requisitos progressivos de material durante um período de 4 anos.";
    
    section2Title = "2. MATERIAIS NECESSÁRIOS";
    section2Text = `Os materiais descritos abaixo são apresentados em ordem de preferência. O material de primeira escolha é denominado "Material #1". O material alternativo, a ser fornecido apenas se o "Material #1" não estiver disponível ou for menos viável, é denominado "Material #2".`;
    
    section3Title = "3. CRONOGRAMA DE COMPRAS PROGRESSIVAS (Plano de 4 Anos)";
    section3Text = `<em>Nota: O cronograma a seguir representa nossos requisitos projetados para o Material #1 ou o Material #2 combinados. As quantidades podem ser ajustadas com base nas necessidades reais de produção. <strong>Se você não tiver os volumes completos disponíveis, um volume parcial também é do nosso interesse. Por favor, não hesite em responder.</strong></em>`;
    
    section4Title = "4. TERMOS DE ENTREGA";
    section4List = `
    <li><strong>Incoterms:</strong> Ex-Works (EXW) - Incoterms&reg; 2020</li>
    <li><strong>Transportadora (Carrier):</strong> DHL</li>
    <li><strong>Endereço de Entrega:</strong> A transportadora recolherá o material diretamente em seu armazém.</li>
    <li><strong>Tempo de entrega (Lead Time):</strong> A ser cotado pelo fornecedor (opções padrão e expressas).</li>
    <li><strong>Envios Parciais:</strong> Aceitáveis mediante acordo prévio.</li>
    <li><strong>Requisitos de Embalagem:</strong> Atmosfera inerte, à prova de umidade e claramente rotulado com as especificações do material.</li>
    `;
    
    section5Title = "5. TERMOS DE PAGAMENTO";
    section5List = `
    <li><strong>Moeda Preferida:</strong> USD ou EUR</li>
    <li><strong>Métodos de Pagamento:</strong> Carta de Crédito (LC), Carta de Crédito Documentária (DLC), Carta de Crédito Standby (SBLC) ou alternativas seguras.</li>
    `;
    section5Note = `<em>Nota: Termos de pagamento específicos serão finalizados durante as negociações comerciais.</em>`;
    
    section6Title = "6. CONFORMIDADE E REGULAMENTAÇÃO";
    section6Text = "Ambas as partes devem garantir estrita conformidade com todas as regulamentações aplicáveis de exportação, importação e comércio internacional, incluindo quaisquer requisitos de licenciamento relacionados ao germânio.";
    
    section7Title = "7. GARANTIA DE QUALIDADE E DOCUMENTAÇÃO";
    section7List = `
    <li><strong>Certificado de Análise (CoA):</strong> Obrigatório com cada envio, detalhando os níveis de pureza, análise de impurezas e propriedades físicas.</li>
    <li><strong>Ficha de Dados de Segurança (MSDS/SDS):</strong> Necessária em Inglês.</li>
    <li><strong>Certificações de Qualidade:</strong> ISO 9001 ou certificação equivalente preferida.</li>
    <li><strong>Conformidade de Exportação/Importação:</strong> O fornecedor deve cumprir todas as regulamentações aplicáveis de controle de exportação e bens de uso duplo.</li>
    <li><strong>Rastreabilidade:</strong> Rastreabilidade total da origem do material.</li>
    <li><strong>Métodos de Teste:</strong> ICP-MS, ICP-OES ou métodos analíticos equivalentes para verificação de pureza.</li>
    `;
    
    section8Title = "8. REQUISITOS DE COTAÇÃO";
    section8Text = "Solicita-se aos fornecedores que forneçam as seguintes informações em sua cotação formal:";
    section8List = `
    <li><strong>Preço Unitário (USD/EUR por kg)</strong> para Material #1 (5N) OU Material #2 (5N).</li>
    <li><strong>Estrutura de desconto por volume:</strong> Descontos para quantidades maiores.</li>
    <li><strong>Quantidade Mínima de Pedido (MOQ):</strong> Por material e por envio.</li>
    <li><strong>Tempo de Entrega (Lead Time):</strong> Tempo padrão de entrega desde a confirmação do pedido.</li>
    <li><strong>Termos de Pagamento Oferecidos:</strong> LC, DLC, SBLC ou alternativas seguras.</li>
    <li><strong>Perfil da Empresa:</strong> Breve descrição, anos de atividade e certificações.</li>
    <li><strong>Suporte Técnico:</strong> Disponibilidade de consulta técnica e suporte pós-venda.</li>
    `;
    
    section9Title = "9. CONDIÇÕES GERAIS";
    section9List = `
    <li>O comprador reserva-se o direito de aceitar ou rejeitar quaisquer cotações sem fornecer motivos.</li>
    <li>Este RFQ não constitui um compromisso de compra vinculativo. Um Pedido de Compra formal será emitido mediante seleção do fornecedor.</li>
    <li>As quantidades especificadas são estimativas e podem ser ajustadas com base nos requisitos reais.</li>
    <li>Todas as informações técnicas compartilhadas durante este processo são estritamente confidenciais.</li>
    `;
    
    footerTitle = "ENVIO DA COTAÇÃO";
    footerText = `
<p><strong>Por favor, envie sua cotação por e-mail para:</strong> <a href="mailto:antonio@procdi.com" style="color: #4472C4;">antonio@procdi.com</a><br>
<strong>Assunto do E-mail:</strong> RFQ Germanium Materials - ${vars.nombre_empresa}<br>
Para esclarecimentos, por favor contate: <a href="mailto:antonio@procdi.com" style="color: #4472C4;">antonio@procdi.com</a></p>
<p>Aguardamos receber a sua cotação competitiva.</p>
    `;
  }

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>RFQ Preview</title>
<style>
  body { 
    font-family: Arial, Helvetica, sans-serif; 
    color: #333333; 
    line-height: 1.6; 
    background-color: #f4f4f4;
    padding: 20px;
  }
  .email-container { 
    max-width: 800px; 
    margin: 0 auto; 
    padding: 40px; 
    background-color: #ffffff;
    box-shadow: 0 4px 8px rgba(0,0,0,0.05);
    border-radius: 4px;
  }
  table { 
    width: 100%; 
    border-collapse: collapse; 
    margin-bottom: 25px; 
    border: 1px solid #1e3a8a; 
  }
  th, td { 
    border: 1px solid #1e3a8a; 
    padding: 12px; 
    text-align: left; 
    font-size: 14px;
  }
  th { 
    background-color: #1e3a8a; 
    color: #ffffff; 
    font-weight: bold; 
    font-size: 15px;
  }
  .sub-header { 
    background-color: #e0e7ff; 
    color: #1e3a8a; 
    font-weight: bold; 
  }
  h3, h4 { 
    color: #1e3a8a; 
    margin-top: 30px;
  }
  .signature { 
    margin-top: 40px; 
    border-top: 2px solid #eaeaea; 
    padding-top: 20px; 
    font-size: 13px;
    color: #666;
  }
  .highlight {
    background-color: #fef08a;
    padding: 2px 4px;
    border-radius: 3px;
  }
</style>
</head>
<body>
<div class="email-container">
  <p><strong>Subject:</strong> \${reqTitle}</p>
  <hr style="border: 0; border-top: 1px solid #eaeaea; margin-bottom: 30px;">

  <p><strong>\${greeting}</strong></p>
  
  <p>\${intro}</p>
  
  <p><em><span class="highlight">\${vars.ice_breaker}</span></em></p>
  
  <h3 style="border-bottom: 2px solid #1e3a8a; padding-bottom: 5px;">\${reqTitle}</h3>
  
  <h4>\${section1Title}</h4>
  <p>\${section1Text}</p>
  
  <h4>\${section2Title}</h4>
  <p style="font-size: 14px;">\${section2Text}</p>
  
  <table>
    <tr><th colspan="2">2.1 Material #1: Germanium Metal (Semiconductor Grade)</th></tr>
    <tr><td class="sub-header" width="30%">Material Name:</td><td><strong>Germanium Metal (Semiconductor Grade)</strong></td></tr>
    <tr><td class="sub-header">Chemical Symbol:</td><td>Ge</td></tr>
    <tr><td class="sub-header">CAS Number:</td><td>7440-56-4</td></tr>
    <tr><td class="sub-header">Purity Required:</td><td>5N (&ge;99.999%) or higher (TBA)</td></tr>
    <tr><td class="sub-header">Physical Forms Accepted:</td><td>Granules, Bullets, Powder, Blocks, Ingots</td></tr>
    <tr><td class="sub-header">Origin:</td><td>Can include recycled scrap (optical or semiconductor source material)</td></tr>
    <tr><td class="sub-header">Description:</td><td>High-purity germanium metal used in infrared optics, fiber optics, and semiconductor applications.</td></tr>
  </table>

  <table>
    <tr><th colspan="2">2.2 Material #2: Germanium Dioxide (GeO2)</th></tr>
    <tr><td class="sub-header" width="30%">Material Name:</td><td><strong>Germanium Dioxide (Germania)</strong></td></tr>
    <tr><td class="sub-header">Chemical Formula:</td><td>GeO<sub>2</sub></td></tr>
    <tr><td class="sub-header">CAS Number:</td><td>1310-53-8</td></tr>
    <tr><td class="sub-header">Purity Required:</td><td>5N (&ge;99.999%) or higher (TBA)</td></tr>
    <tr><td class="sub-header">Physical Forms Accepted:</td><td>White Crystalline Powder, Granules, Pressed Blocks</td></tr>
    <tr><td class="sub-header">Origin:</td><td>Can include refined or recycled source material</td></tr>
    <tr><td class="sub-header">Description:</td><td>High-purity germanium dioxide used as a raw material for conversion into semiconductor-grade germanium metal through reduction.</td></tr>
  </table>
  
  <h4>\${section3Title}</h4>
  <p style="font-size: 13px; color: #555; margin-bottom: 15px;">\${section3Text}</p>
  <table>
    <tr>
      <th>Period</th>
      <th>Monthly Quantity</th>
      <th>Period Total</th>
      <th>Cumulative Total</th>
    </tr>
    <tr><td class="sub-header">Year 1, H1 (6 months)</td><td>50 kg/month</td><td>300 kg</td><td>300 kg</td></tr>
    <tr><td class="sub-header">Year 1, H2 (6 months)</td><td>100 kg/month</td><td>600 kg</td><td>900 kg</td></tr>
    <tr><td class="sub-header">Year 2 (12 months)</td><td>200 kg/month</td><td>2,400 kg</td><td>3,300 kg</td></tr>
    <tr><td class="sub-header">Year 3 (12 months)</td><td>400 kg/month</td><td>4,800 kg</td><td>8,100 kg</td></tr>
    <tr><td class="sub-header">Year 4 (12 months)</td><td>500 kg/month</td><td>6,000 kg</td><td>14,100 kg</td></tr>
  </table>
  <p><strong>Total 4-Year Requirement: 14,100 kg (14.1 metric tons)</strong></p>
  
  <h4>\${section4Title}</h4>
  <ul>\${section4List}</ul>

  <h4>\${section5Title}</h4>
  <ul>\${section5List}</ul>
  <p>\${section5Note}</p>

  <h4>\${section6Title}</h4>
  <p>\${section6Text}</p>

  <h4>\${section7Title}</h4>
  <ul>\${section7List}</ul>

  <h4>\${section8Title}</h4>
  <p>\${section8Text}</p>
  <ul>\${section8List}</ul>

  <h4>\${section9Title}</h4>
  <ul>\${section9List}</ul>

  <h4>\${footerTitle}</h4>
  \${footerText}
  
  <div class="signature">
    <p>
      Best regards,<br><br>
      <strong style="font-size: 16px; color: #1e3a8a;">Antonio Baronas</strong><br>
      <span style="color: #555;">Director of Procurement</span><br>
      Ph: +37068941110<br>
      e-mail: <a href="mailto:antonio@procdi.com" style="color: #2563eb; text-decoration: none;">antonio@procdi.com</a><br><br>
      <strong style="color: #1e3a8a; font-size: 15px;">Logistics Global Corp / PROCDI</strong><br>
      <span style="font-size: 12px; color: #555;">
        Company code: 307515454<br>
        Partizanų g. 61-806, LT-49282<br>
        Kaunas, Lithuania
      </span>
    </p>
    
    <div style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed #eaeaea;">
      <p style="margin: 0; font-size: 12px; color: #888;">
        <em>Secured and Verified by:</em><br>
        <strong style="color: #1e3a8a; font-size: 14px;"><a href="https://sure-platform.vercel.app/" style="color: #1e3a8a; text-decoration: none;">SURE Ecosystem</a></strong><br>
        Global Procurement Division
      </p>
    </div>
  </div>
</div>
</body>
</html>
  `;
}
