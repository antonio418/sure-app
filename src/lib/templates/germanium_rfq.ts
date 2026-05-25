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

  // Forcing strictly English as per user request. Spanish and Portuguese translation overrides removed.

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
