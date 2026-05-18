# Implementación de Plantilla HTML (RFQ Germanio) y Mail Merge

Este plan detalla cómo transformaremos el documento MS Word en una plantilla HTML integrada en el sistema de envíos de SURE, usando una estrategia de "Inyección de Variables" (Mail Merge) para mantener la rigidez de las especificaciones técnicas mientras se añade una apertura dinámica con IA.

## Revisión de Redacción (Copywriting Review)

He transcrito tus 4 imágenes. A continuación te presento el borrador con la **redacción corregida y mejorada** para darle un tono aún más nativo, ejecutivo y corporativo en inglés:

---

**Subject:** Request for Quotation (RFQ) – High-Purity Germanium Materials (Ge / GeO2)

**Dear {{Nombre_Contacto}},**

We are pleased to submit this Request for Quotation (RFQ) to **{{Nombre_Empresa}}** for high-purity germanium materials. We are actively seeking to establish a reliable supply partnership to support our client's advanced semiconductor and photonic applications.

{{Oracion_Rompehielo_IA}} *(Aquí la IA insertará la oración comentando sobre su empresa o perfil)*.

### REQUEST FOR QUOTATION (RFQ)
**High-Purity Germanium Materials for Semiconductor Applications**

**1. INTRODUCTION**
The buyer, a company specializing in advanced photonic materials and semiconductor applications, is seeking reliable suppliers for high-purity germanium materials. This Request for Quotation (RFQ) is issued to qualified distributors and resellers to establish a long-term supply partnership capable of fulfilling progressive material requirements over a 4-year period.

**2. MATERIALS REQUIRED**
The materials described below are presented in order of preference. The first-choice material is referred to as "Material #1". The alternative material, to be supplied only if "Material #1" is unavailable or less viable, is referred to as "Material #2".

*(Las tablas mantendrán exactamente tu estructura original en HTML, con bordes y celdas azules)*

**2.1 Material #1: Germanium Metal (Semiconductor Grade)**
*   **Chemical Symbol:** Ge
*   **CAS Number:** 7440-56-4
*   **Purity Required:** 5N (≥99.999%) or higher (TBA)
*   **Physical Forms Accepted:** Granules, Bullets, Powder, Blocks, Ingots
*   **Origin:** Can include recycled scrap (optical or semiconductor source material)
*   **Description:** High-purity germanium metal used in infrared optics, fiber optics, and semiconductor applications.

**2.2 Material #2: Germanium Dioxide (GeO2)**
*   **Chemical Formula:** GeO2
*   **CAS Number:** 1310-53-8
*   **Purity Required:** 5N (≥99.999%) or higher (TBA)
*   **Physical Forms Accepted:** White Crystalline Powder, Granules, Pressed Blocks
*   **Origin:** Can include refined or recycled source material
*   **Description:** High-purity germanium dioxide used as a raw material for conversion into semiconductor-grade germanium metal through reduction.

**3. PROGRESSIVE PURCHASE SCHEDULE (4-Year Plan)**
*Note: The following schedule represents our projected requirements for BOTH Material #1 or Material #2 combined. Quantities may be adjusted based on actual production needs.*

*(Tabla de 4 años de compras intacta)*

**Total 4-Year Requirement: 14,100 kg (14.1 metric tons)**

**4. DELIVERY TERMS**
*   **Incoterms:** Ex-Works (EXW) - Incoterms® 2020
*   **Carrier:** DHL
*   **Delivery Address:** Carrier will pick up the material directly at your warehouse.
*   **Lead Time:** To be quoted by supplier (standard and expedited options).
*   **Partial Shipments:** Acceptable with prior agreement.
*   **Packaging Requirements:** Inert atmosphere, moisture-proof, and clearly labeled with material specifications.

**5. PAYMENT TERMS**
*   **Preferred Currency:** USD or EUR
*   **Payment Methods (TBA):** Letter of Credit (LC), Documentary Letter of Credit (DLC), Standby Letter of Credit (SBLC), or alternative secure methods.
*   *Note: Specific payment terms to be finalized during commercial negotiations.*

**6. COMPLIANCE & REGULATORY**
Both parties shall ensure strict compliance with all applicable export, import, and international trade regulations, including any licensing requirements related to germanium.

**7. QUALITY ASSURANCE & DOCUMENTATION**
*   **Certificate of Analysis (CoA):** Required with each shipment, detailing purity levels, impurity analysis, and physical properties.
*   **Material Safety Data Sheet (MSDS/SDS):** Required in English.
*   **Quality Certifications:** ISO 9001 or equivalent quality management certification preferred.
*   **Export/Import Compliance:** Supplier must comply with all applicable export control regulations, import licensing requirements, and dual-use goods controls.
*   **Traceability:** Full traceability of material origin (primary production or recycled source).
*   **Testing Methods:** ICP-MS, ICP-OES, or equivalent analytical methods for purity verification.

**8. QUOTATION REQUIREMENTS**
Suppliers are requested to provide the following information in their formal quotation:
*   **Unit Price (USD/EUR per kg)** for Material #1 (5N) OR Material #2 (5N).
*   **Volume Discount Structure:** Price breaks for larger quantities.
*   **Minimum Order Quantity (MOQ):** Per material and per shipment.
*   **Lead Time:** Standard delivery time from order confirmation.
*   **Payment Terms Offered:** LC, DLC, SBLC, or secure alternatives.
*   **Company Profile:** Brief description, years in business, and certifications.
*   **Technical Support:** Availability of technical consultation and after-sales support.

**9. GENERAL CONDITIONS**
*   The buyer reserves the right to accept or reject any or all quotations without providing reasons.
*   This RFQ does not constitute a binding purchase commitment. A formal Purchase Order will be issued upon supplier selection.
*   Quantities specified are estimates and may be adjusted based on actual production requirements.
*   All technical information shared during this RFQ process is strictly confidential and subject to Non-Disclosure Agreements (NDA).

---

## Cambios Técnicos Propuestos

1. **Transformación HTML:** Tomaré el texto revisado de arriba y escribiré el código HTML completo, recreando exactamente las tablas (con fondo azul y bordes) y las listas.
2. **Reconfiguración del Agente IA (`send-batch/route.ts`):** 
   - La IA de Gemini **solo** generará 1 oración en inglés analizando la empresa objetivo (`{{Oracion_Rompehielo_IA}}`).
   - El script reemplazará automáticamente variables como `{{Nombre_Empresa}}` por `lead.empresa`.
3. **Firma HTML Institucional:** Se agregará al final del correo una firma profesional que incluya los datos de tu empresa (Logistics Global Corp / SURE Ecosystem) y enlaces relevantes.

> [!IMPORTANT]
> **Revisión Requerida:** Por favor, revisa el texto en inglés en la sección superior y confirma si el tono y las correcciones de redacción están aprobadas. Una vez apruebes, procederé a programar la inyección HTML en el backend de SURE.
