export interface ImportDiligenceTemplateVars {
  nombre_contacto: string;
  nombre_empresa: string;
  productos_importados: string;
  ice_breaker: string;
  language?: 'es' | 'pt' | 'en';
  isProcdi?: boolean;
}

export function generateImportDiligenceHtml(vars: ImportDiligenceTemplateVars): string {
  let greeting = `Dear ${vars.nombre_contacto || 'Executive Team'},`;
  let subject = `Detecting Supply Chain Fraud with 90% Precision - ${vars.nombre_empresa}`;
  let signoff = "Best regards,";
  
  let emailBody = `
    <p>A single fake counterparty — supplier or buyer — can cost up to 5% of your annual revenue, and tie up your most expensive people in weeks of manual review.</p>
    <p>SURE verifies any counterparty in 7 minutes:</p>
    <ul style="margin: 6pt 0; padding-left: 20px;">
      <li style="margin-bottom: 4pt;">An exact risk score, backed by verifiable evidence.</li>
      <li style="margin-bottom: 4pt;">A fraction of a law firm's cost.</li>
      <li style="margin-bottom: 4pt;">Your team back to negotiating — not reading hundreds of pages.</li>
    </ul>
    <p>Doubting a counterparty is reasonable. See it for yourself, free, on a document of your choice.</p>
    <p>Worth 15 minutes this week?</p>
  `;
  
  if (vars.language === 'es') {
    greeting = `Estimado/a ${vars.nombre_contacto || 'Equipo Directivo'},`;
    subject = `¿Es posible detectar a un estafador con un 90% de precisión? - ${vars.nombre_empresa}`;
    signoff = "Cordialmente,";
    
    emailBody = `
      <p>Una sola contraparte falsa — proveedor o comprador — puede costar hasta el 5% de sus ingresos anuales y consumir semanas de revisión manual de su gente más valiosa.</p>
      <p>SURE verifica a cualquier contraparte en 7 minutos:</p>
      <ul style="margin: 6pt 0; padding-left: 20px;">
        <li style="margin-bottom: 4pt;">Un score de riesgo exacto, respaldado por evidencia verificable.</li>
        <li style="margin-bottom: 4pt;">Una fracción del costo de un bufete de abogados.</li>
        <li style="margin-bottom: 4pt;">Su equipo, de vuelta a negociar — no a leer cientos de páginas.</li>
      </ul>
      <p>Dudar de una contraparte es razonable. Compruébelo usted mismo, gratis, con un documento de su elección.</p>
      <p>¿Vale 15 minutos esta semana?</p>
    `;
  } else if (vars.language === 'pt') {
    greeting = `Prezado(a) ${vars.nombre_contacto || 'Equipe Diretiva'},`;
    subject = `Detectando Fraudes na Cadeia de Suprimentos com 90% de Precisão - ${vars.nombre_empresa}`;
    signoff = "Atenciosamente,";
    
    emailBody = `
      <p>Uma única contraparte falsa — fornecedor ou comprador — pode custar até 5% da sua receita anual e consumir semanas de revisão manual do seu pessoal mais valioso.</p>
      <p>A SURE verifica qualquer contraparte em 7 minutos:</p>
      <ul style="margin: 6pt 0; padding-left: 20px;">
        <li style="margin-bottom: 4pt;">Um score de risco exato, respaldado por evidências verificáveis.</li>
        <li style="margin-bottom: 4pt;">Uma fração do custo de um escritório de advocacia.</li>
        <li style="margin-bottom: 4pt;">Sua equipe de volta a negociar — não a ler centenas de páginas.</li>
      </ul>
      <p>Duvidar de uma contraparte é razoável. Comprove você mesmo, grátis, com um documento à sua escolha.</p>
      <p>Vale 15 minutos esta semana?</p>
    `;
  }

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${subject}</title>
<style>
  body { 
    font-family: Calibri, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
    color: #2b3035; 
    line-height: 1.12; 
    background-color: #f8fafc;
    padding: 20px;
    margin: 0;
    font-size: 11pt;
  }
  p {
    margin-top: 0;
    margin-bottom: 6pt;
  }
  .email-container { 
    max-width: 650px; 
    margin: 0 auto; 
    padding: 40px; 
    background-color: #ffffff;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  }
  h2 { 
    color: #0f172a; 
    margin-top: 30px;
    margin-bottom: 10px;
    font-size: 18px;
    font-weight: 700;
  }
  .highlight-box {
    background-color: #fff1f2;
    border-left: 4px solid #e11d48;
    padding: 15px 20px;
    margin: 20px 0;
    border-radius: 0 4px 4px 0;
  }
  .highlight-box p {
    margin: 0;
    color: #881337;
    font-size: 15px;
  }
  .tech-box {
    background-color: #f0f9ff;
    border: 1px solid #bae6fd;
    padding: 20px;
    margin: 20px 0;
    border-radius: 6px;
  }
  .signature { 
    margin-top: 40px; 
    border-top: 1px solid #e2e8f0; 
    padding-top: 25px; 
    font-size: 14px;
    color: #475569;
  }
  .ice-breaker {
    font-style: italic;
    color: #475569;
    margin-bottom: 25px;
  }
  .secure-badge {
    display: inline-block;
    background-color: #0f172a;
    color: #00e5ff;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: bold;
    letter-spacing: 1px;
    margin-top: 15px;
  }
</style>
</head>
<body>
<div class="email-container">
  
  <p style="font-weight: bold; margin-bottom: 6pt;">${greeting}</p>
  
  <div style="font-size: 11pt; color: #2b3035; line-height: 1.12;">
    ${emailBody}
  </div>
  
  <div class="signature">
    ${vars.isProcdi ? `
      <p style="margin-bottom: 5px;">
        ${signoff}<br><br>
        <strong style="font-size: 16px; color: #0f172a;">Antonio Baronas</strong><br>
        <span style="color: #475569; font-weight: 500;">Sourcing Integration Team | PROCDI</span><br>
        Ph: +37068941110<br>
        e-mail: <a href="mailto:antonio@procdi.com" style="color: #0284c7; text-decoration: none;">antonio@procdi.com</a><br><br>
        
        <!-- PROCDI Logo -->
        <img src="https://sure-app-nine.vercel.app/logo-procdi.svg" alt="PROCDI" style="width: 80px; height: auto; margin: 8px 0; display: block;" />
        
        <span style="font-size: 12px; color: #64748b; display: block; margin-top: 5px; line-height: 1.4;">
          Company code: 307515454<br>
          Partizanų g. 61-806, LT-49282<br>
          Kaunas, Lithuania
        </span>
      </p>
    ` : `
      <p style="margin-bottom: 5px;">
        ${signoff}<br><br>
        <strong style="font-size: 16px; color: #0f172a;">Antonio Baronas</strong><br>
        <span style="color: #475569; font-weight: 500;">Director | MB PROCDI</span><br>
        Ph: +37068941110<br>
        e-mail: <a href="mailto:antonio@procdi.com" style="color: #0284c7; text-decoration: none;">antonio@procdi.com</a><br><br>

        <!-- PROCDI Logo -->
        <img src="https://sure-app-nine.vercel.app/logo-procdi.svg" alt="PROCDI" style="width: 80px; height: auto; margin: 8px 0; display: block;" />

        <span style="font-size: 12px; color: #64748b; display: block; margin-top: 5px; line-height: 1.4;">
          Company code: 307515454<br>
          Partizanų g. 61-806, LT-49282<br>
          Kaunas, Lithuania
        </span>
      </p>
    `}
  </div>
</div>
</body>
</html>
  `;
}
