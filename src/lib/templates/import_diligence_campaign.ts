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
    <p>Is it possible to detect an international scammer with 90% precision before signing?</p>
    <p>I have worked for years in international trade and dealt with hundreds of fake sellers and buyers. Today, scammers are not novices. They are extremely convincing, know the technical jargon perfectly, and present masterfully forged documents: from fake KEMA certificates to supposed bank guarantees.<br>
    There are even real suppliers faking documents to meet requirements they lack.</p>
    <p>In this industry, an authentic buyer or seller is a treasure. But a single failed operation is enough to lose it all. Reputation and trust evaporate in a second. Faced with this terror, companies have reacted by creating lists of almost abusive requirements, generating a paranoia that ends up blocking 100% legitimate operations. Distrust reigns.</p>
    <p>The problem with traditional due diligence is human fragility. An analyst reads one line at a time and must rely on their memory to recall what they read three hours or several days ago. The human eye gets tired after 40 pages and inevitably gets distracted by what happens around them in the office.</p>
    <p>An overlooked detail can cost millions. And what is worse: it brings the loss of reputation, the destruction of trust, and the dismissal of valuable and honest workers due to errors that, humanly, were almost impossible to detect.</p>
    <p>Artificial Intelligence does not operate like that. AI reads multiple documents in parallel. It analyzes math, law, and chemistry simultaneously. It doesn't have Friday afternoons, it doesn't get tired, and it crosses patterns at inhuman speed without ever getting distracted.</p>
    <p>How do we unlock this paralysis in the industry?<br>
    Imagine this for a second:<br>
    1. What if we had a technology that detects a Scammer in minutes at an accessible cost?<br>
    2. What if it gave us precise instructions on what to demand from the counterparty to disarm their trap?<br>
    3. What if it crossed data on international sanctions and geographic technical impossibilities in real-time?</p>
    <p>We have it, that's how <strong>SURE FORENSICS</strong> (RMA Project) was born.</p>
    <p>Hiring traditional Due Diligence can cost tens of thousands of dollars and paralyze a business for weeks. SURE does the work of a team of 20 analysts in exactly 7 minutes.<br>
    Furthermore, for the acquisition of technological products, we complement this algorithmic shield with a deep audit of intellectual property rights, especially checking if there are valid patents and in which countries. For this, we have an elite human team made up of former patent directors and researchers from recognized European universities.</p>
    <p>To prove it, I recently wanted to play around and test our new technological architecture. I started throwing old files from my own archives at it: SCO contracts, ICPO, Letters of Credit, BLs...<br>
    What I discovered was terrifying. The rate of undetectable falsehoods that had gone unnoticed by the human eye was immense.</p>
    <p>Is Artificial Intelligence infallible? Absolutely NOT. But by giving you 90% certainty with objectively verifiable and mathematical evidence, it collapses any narrative defense of the transgressor.</p>
    <p>The pragmatism is simple: Suppose you receive offers from 20 different suppliers for a critical acquisition. Instead of spending weeks analyzing blindly, you run the files through SURE FORENSIC. The system detects anomalies and assigns a Critical Risk Level to 17 of them.</p>
    <p>You just saved your capital (and your team's jobs). Now, your staff can dedicate their energy and talent exclusively to negotiating with the 3 real suppliers, leveraged on a forensic report that tells them exactly where they stand.</p>
    <p>Trust in international trade was broken. We just repaired it.</p>
    <p>👇 If your trading desk has an ongoing operation, send me a direct message. Let's pass those documents through the SURE vault before you sign.</p>
  `;
  
  if (vars.language === 'es') {
    greeting = `Estimado/a ${vars.nombre_contacto || 'Equipo Directivo'},`;
    subject = `¿Es posible detectar a un estafador con un 90% de precisión? - ${vars.nombre_empresa}`;
    signoff = "Cordialmente,";
    
    emailBody = `
      <p>¿Es posible detectar a un estafador internacional con un 90% de precisión antes de firmar?</p>
      <p>He trabajado por años en el comercio exterior y he lidiado con centenares de falsos vendedores y compradores. Hoy en día, los estafadores no son novatos. Son extremadamente convincentes, conocen la jerga técnica a la perfección y presentan documentos magistralmente falsificados: desde certificados KEMA hasta supuestas garantías bancarias.<br>
      Incluso hay proveedores reales falseando documentos para cumplir con requisitos de los cuales carecen.</p>
      <p>En esta industria, un comprador o vendedor auténtico es un tesoro. Pero basta una sola operación fallida para perderlo todo. La reputación y la confianza se evaporan en un segundo. Ante este terror, las empresas han reaccionado creando listas de requisitos casi abusivos, lo que ha generado una paranoia que termina bloqueando operaciones 100% legítimas. La desconfianza reina.</p>
      <p>El problema de la debida diligencia tradicional es la fragilidad humana. Un analista lee una línea a la vez y debe confiar en su memoria para recordar lo que leyó hace tres horas o varios días atrás. El ojo humano se cansa después de 40 páginas y se distrae inevitablemente con lo que ocurre a su alrededor en la oficina.</p>
      <p>Un detalle pasado por alto puede costar millones. Y lo que es peor: acarrea la pérdida de reputación, la destrucción de la confianza y el despido de trabajadores valiosos y honestos por culpa de errores que, humanamente, eran casi imposibles de detectar.</p>
      <p>La Inteligencia Artificial no opera así. La IA lee múltiples documentos en paralelo. Analiza matemáticas, leyes y química simultáneamente. No tiene viernes por la tarde, no se cansa, y cruza patrones a una velocidad inhumana sin distraerse jamás.</p>
      <p>¿Cómo desbloqueamos esta parálisis en la industria?<br>
      Imagínate esto por un segundo:<br>
      1. ¿Y si tuviéramos una tecnología que detecte a un Scammer en minutos y a un costo accesible?<br>
      2. ¿Y si nos diera instrucciones precisas sobre qué exigirle a la contraparte para desarmar su trampa?<br>
      3. ¿Y si cruzara datos de sanciones internacionales e imposibilidades técnicas geográficas en tiempo real?</p>
      <p>Lo tenemos, así nació <strong>SURE FORENSICS</strong> (Proyecto RMA).</p>
      <p>Contratar una Due Diligence tradicional puede costar decenas de miles de dólares y paralizar un negocio durante semanas. SURE hace el trabajo de un equipo de 20 analistas en exactamente 7 minutos.<br>
      Además, para la adquisición de productos tecnológicos, complementamos este blindaje algorítmico con una auditoría profunda de derechos de propiedad intelectual y especialmente si existen patentes vigentes y en cuales países. Para ello, contamos con un equipo humano élite conformado por ex-directores de patentes e investigadores de reconocidas universidades europeas.</p>
      <p>Para comprobarlo, hace poco quise jugar a poner a prueba nuestra nueva arquitectura tecnológica. Empecé a lanzarle expedientes antiguos de mis propios archivos: contratos SCO, ICPO, Cartas de Crédito, BLs…<br>
      Lo que descubrí fue aterrador. La tasa de falsedades indetectables que habían pasado desapercibidas ante el ojo humano era inmensa.</p>
      <p>¿Es la Inteligencia Artificial infalible? Rotundamente NO. Pero al entregarte un 90% de certeza con evidencia objetivamente comprobable y matemática, derrumba cualquier defensa narrativa del transgresor.</p>
      <p>El pragmatismo es simple: Supongamos que recibes ofertas de 20 proveedores distintos para una adquisición crítica. En lugar de gastar semanas analizando a ciegas, pasas los expedientes por SURE FORENSIC. El sistema detecta anomalías y asigna un Nivel de Riesgo Crítico a 17 de ellos.</p>
      <p>Acabas de salvar tu capital (y los empleos de tu equipo). Ahora, tu personal puede dedicar su energía y talento exclusivamente a negociar con los 3 proveedores reales, apalancados en un reporte forense que les dice exactamente qué terreno pisan.</p>
      <p>La confianza en el comercio internacional estaba rota. Acabamos de repararla.</p>
      <p>👇 Si tu mesa de trading tiene una operación en curso, envíame un mensaje directo. Pasemos esos documentos por la bóveda de SURE antes de que firmes.</p>
    `;
  } else if (vars.language === 'pt') {
    greeting = `Prezado(a) ${vars.nombre_contacto || 'Equipe Diretiva'},`;
    subject = `Detectando Fraudes na Cadeia de Suprimentos com 90% de Precisão - ${vars.nombre_empresa}`;
    signoff = "Atenciosamente,";
    
    emailBody = `
      <p>É possível detectar um fraudador internacional com 90% de precisão antes de assinar?</p>
      <p>Trabalho há anos no comércio exterior e lidei com centenas de falsos vendedores e compradores. Hoje em dia, os fraudadores não são novatos. São extremamente convincentes, conhecem o jargão técnico com perfeição e apresentam documentos magistralmente falsificados: de falsos certificados KEMA a supostas garantias bancárias.<br>
      Existem até fornecedores reais falsificando documentos para cumprir requisitos que não possuem.</p>
      <p>Nesta indústria, um comprador ou vendedor autêntico é um tesouro. Mas basta uma única operação falha para perder tudo. A reputação e a confiança evaporam num segundo. Diante desse terror, as empresas reagiram criando listas de requisitos quase abusivos, gerando uma paranoia que acaba bloqueando operações 100% legítimas. A desconfiança reina.</p>
      <p>O problema da due diligence tradicional é a fragilidade humana. Um analista lê uma linha de cada vez e deve confiar na memória para lembrar o que leu há três horas ou vários dias atrás. O olho humano se cansa após 40 páginas e inevitavelmente se distrai com o que acontece ao redor no escritório.</p>
      <p>Um detalhe negligenciado pode custar milhões. E o que é pior: acarreta a perda de reputação, a destruição da confiança e a demissão de trabalhadores valiosos e honestos por culpa de erros que, humanamente, eram quase impossíveis de detectar.</p>
      <p>A Inteligência Artificial não opera assim. A IA lê vários documentos em paralelo. Analisa matemática, leis e química simultaneamente. Não tem sexta-feira à tarde, não se cansa e cruza padrões a uma velocidade desumana sem nunca se distrair.</p>
      <p>Como desbloqueamos essa paralisia na indústria?<br>
      Imagine isso por um segundo:<br>
      1. E se tivéssemos uma tecnologia que detecta um Scammer em minutos e a um custo acessível?<br>
      2. E se nos desse instruções precisas sobre o que exigir da contraparte para desarmar sua armadilha?<br>
      3. E se cruzasse dados de sanções internacionais e impossibilidades técnicas geográficas em tempo real?</p>
      <p>Nós temos, assim nasceu <strong>SURE FORENSICS</strong> (Projeto RMA).</p>
      <p>Contratar uma Due Diligence tradicional pode custar dezenas de milhares de dólares e paralisar um negócio por semanas. SURE faz o trabalho de uma equipe de 20 analistas em exatamente 7 minutos.<br>
      Além disso, para a aquisição de produtos tecnológicos, complementamos esta blindagem algorítmica com uma auditoria profunda de direitos de propriedade intelectual e especialmente se existem patentes vigentes e em quais países. Para isso, contamos com uma equipe humana de elite formada por ex-diretores de patentes e pesquisadores de renomadas universidades europeias.</p>
      <p>Para comprovar, recentemente quis brincar de testar nossa nova arquitetura tecnológica. Comecei a enviar arquivos antigos dos meus próprios arquivos: contratos SCO, ICPO, Cartas de Crédito, BLs…<br>
      O que descobri foi assustador. A taxa de falsidades indetectáveis que passaram despercebidas pelo olho humano era imensa.</p>
      <p>A Inteligência Artificial é infalível? Rotundamente NÃO. Mas ao entregar 90% de certeza com evidências objetivamente comprováveis e matemáticas, derruba qualquer defesa narrativa do transgressor.</p>
      <p>O pragmatismo é simples: Suponha que você receba ofertas de 20 fornecedores diferentes para uma aquisição crítica. Em vez de passar semanas analisando às cegas, você passa os arquivos pelo SURE FORENSIC. O sistema detecta anomalias e atribui um Nível de Risco Crítico a 17 deles.</p>
      <p>Você acabou de salvar seu capital (e os empregos de sua equipe). Agora, sua equipe pode dedicar energia e talento exclusivamente a negociar com os 3 fornecedores reais, alavancados em um relatório forense que diz exatamente onde estão pisando.</p>
      <p>A confiança no comércio internacional estava quebrada. Acabamos de consertá-la.</p>
      <p>👇 Se sua mesa de trading tem uma operação em andamento, envie-me uma mensagem direta. Vamos passar esses documentos pelo cofre do SURE antes que você assine.</p>
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
        <a href="mailto:alfredo@sure-forensic.com" style="color: #0284c7; text-decoration: none; font-size: 13px;">alfredo@sure-forensic.com</a><br>
        <span style="color: #64748b;">Managing Director</span><br>
      </p>
      <p style="margin-top: 0; font-size: 13px;">
        <a href="https://www.sureforensic.com" style="color: #0284c7; text-decoration: none; font-weight: 600;">SURE Forensics & Risk Assurance</a><br>
        <span style="color: #94a3b8;">Kaunas, Lithuania | Global Risk Division</span>
      </p>
      
      <div class="secure-badge">
        SURE PROTECTED OUTREACH
      </div>
    `}
  </div>
</div>
</body>
</html>
  `;
}
