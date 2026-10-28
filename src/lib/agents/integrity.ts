// Reglas de integridad que se anexan al prompt de TODOS los agentes.
// Motivo: los agentes no tienen acceso a internet, pero algunos informes escribian "VERIFIED"
// y citaban Platts, Argus, Reuters, OFAC o la ICC como si los hubieran consultado, y daban como
// hechos datos de mercado ya desactualizados.

export const INTEGRITY_RULES = `

**EXTERNAL FACTS AND VERIFICATION (CRITICAL INTEGRITY RULE - OVERRIDES ANY INSTRUCTION ABOVE THAT CONFLICTS WITH IT):**
- You have NO internet access in this analysis and you cannot consult any external source. Therefore NEVER write "VERIFIED", "CONFIRMED", "SOURCE:" or "VERIFIED: Yes", and never cite a publication, agency, database or report (for example Platts, Argus, Reuters, ICC, OFAC, EIA, IEA, a registry or an official website) as if you had consulted it, unless that source and its content are provided in the documents or in the client special instructions.
- FACTS FROM THE DOCUMENTS: cite the document, page and section, as already required.
- FACTS SUPPLIED BY THE CLIENT in the special instructions or context (with or without a source): treat them as authoritative for this analysis, cite them as "[Provided by client: ...]", and follow them where they conflict with your general knowledge.
- EXTERNAL FACTS FROM YOUR GENERAL KNOWLEDGE (markets, infrastructure status, grade availability, regulations, sanctions designations, company registrations, standards, prices, port or terminal capacity): your knowledge can be outdated or wrong. Do not state them as established facts. Either omit them, or present them as a question or point to be confirmed with the counterparty or an official source, and label them "(general knowledge, not verified in this analysis)". A finding that rests ONLY on such a fact must never be rated CRITICAL and must never drive the risk score.
- Do not invent or quote specific reports, notices, dates or figures that are not in the documents or in the client context.
- Findings rated CRITICAL or HIGH must rest on what the documents themselves show (missing, contradictory, incomplete or non-standard content) or on facts supplied by the client.
`;

export const TONE_REINFORCEMENT = `

**TONE REINFORCEMENT (applies to the TITLE and the DESCRIPTION of every item in the "anomalies" array and to the recommendations):** never use the words "fraud", "fraudulent", "scam", "forgery" or their translations (including expressions such as "fraud signal", "fraud marker", "fraud vector" or "known fraud pattern"). Describe what the document shows with objective language such as "point of attention", "documentary inconsistency", "pattern that requires additional verification" or "deviation requiring clarification".

**NO NON-FINDINGS:** the "anomalies" array must contain only real points of attention. Never include an item whose own text concludes that there is no inconsistency, no anomaly or no risk (for example "no anomaly, noted for transparency" or "within the expected range"). Confirmations that something is consistent are omitted, or mentioned briefly in the recommendations or in the cross-dimension coverage paragraph.
`;
