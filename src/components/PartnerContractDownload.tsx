import { FileDown, FileText, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";

const PartnerContractDownload = () => {
  const { language } = useLanguage();
  const { exchangeRate } = useCurrency();

  const rate = exchangeRate?.rate ?? 4200;
  const formatUSD = (cop: number) => {
    const usd = Math.ceil((cop / rate) * 100) / 100;
    return `$${usd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
  };

  const openContract = () => {
    const isES = language === "es";
    const w = window.open("", "_blank");
    if (!w) return;

    const logoUrl = window.location.origin + "/logo-soyagentia.png";
    const docRef = "PA-" + new Date().getFullYear() + "-" + String(Date.now()).slice(-6);

    const styles = `
  @page { size: letter; margin: 2cm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; line-height: 1.65; font-size: 10.5pt; }

  /* ── Print pagination ── */
  h2, h3 { page-break-after: avoid; }
  table, .highlight, .form-section, .section-note, .signature-block, .footer-note { page-break-inside: avoid; }
  p, li { orphans: 3; widows: 3; }
  tr { page-break-inside: avoid; }

  /* ── Letterhead ── */
  .letterhead { display: flex; align-items: center; justify-content: space-between; padding: 0.8em 0 1em; border-bottom: 3px solid #16a34a; margin-bottom: 0.5em; }
  .letterhead-logo { height: 48px; }
  .letterhead-info { text-align: right; font-size: 8pt; color: #64748b; line-height: 1.5; }
  .letterhead-info strong { color: #0f172a; font-size: 9pt; }

  /* ── Document badge ── */
  .doc-badge { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2em; padding: 0.5em 1em; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; font-size: 8pt; color: #15803d; }
  .doc-badge .doc-ref { font-family: 'Courier New', monospace; font-weight: 700; font-size: 9pt; color: #166534; letter-spacing: 0.5px; }
  .doc-badge .doc-type { font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
  .doc-badge .doc-confidential { background: #166534; color: white; padding: 2px 8px; border-radius: 3px; font-weight: 700; font-size: 7pt; letter-spacing: 1.5px; text-transform: uppercase; }

  /* ── Header ── */
  .header { text-align: center; margin-bottom: 1.5em; padding-bottom: 0.8em; }
  .header h1 { font-size: 18pt; color: #0f172a; margin-bottom: 0.2em; letter-spacing: 0.5px; }
  .header p.subtitle { color: #16a34a; font-size: 11pt; font-weight: 600; }
  .header p.date { color: #94a3b8; font-size: 9pt; margin-top: 0.4em; }

  /* ── Content ── */
  h2 { font-size: 12pt; color: #1e40af; margin: 1.2em 0 0.4em; border-left: 4px solid #2563eb; padding-left: 0.5em; }
  h3 { font-size: 10.5pt; color: #334155; margin: 0.8em 0 0.3em; }
  p, li { margin-bottom: 0.35em; text-align: justify; }
  ul, ol { padding-left: 1.5em; }
  .field { border-bottom: 1px solid #94a3b8; display: inline-block; min-width: 250px; height: 1.2em; margin: 0 0.3em; }
  .field-short { min-width: 120px; }
  .signature-block { margin-top: 2em; display: flex; justify-content: space-between; gap: 3em; page-break-inside: avoid; }
  .signature-box { flex: 1; text-align: center; }
  .signature-line { border-top: 1px solid #1e293b; margin-top: 3em; padding-top: 0.5em; }
  .signature-box p { font-size: 9pt; color: #64748b; margin-bottom: 0.1em; }
  table { width: 100%; border-collapse: collapse; font-size: 9.5pt; margin: 0.8em 0; page-break-inside: avoid; }
  th { background: #f1f5f9; color: #334155; padding: 0.4em 0.6em; text-align: left; border: 1px solid #e2e8f0; }
  td { padding: 0.4em 0.6em; border: 1px solid #e2e8f0; }
  .highlight { background: #eff6ff; padding: 0.8em; border-radius: 6px; border-left: 4px solid #2563eb; margin: 0.8em 0; page-break-inside: avoid; }
  .checkbox-line { margin: 0.3em 0; }
  .checkbox { display: inline-block; width: 13px; height: 13px; border: 1.5px solid #64748b; margin-right: 0.5em; vertical-align: middle; }
  .form-section { background: #f8fafc; padding: 1.2em; border-radius: 8px; margin: 0.8em 0; border: 1px solid #e2e8f0; page-break-inside: avoid; }
  .form-row { display: flex; gap: 1.5em; margin-bottom: 0.6em; }
  .form-group { flex: 1; }
  .form-group label { display: block; font-size: 9pt; color: #64748b; margin-bottom: 0.2em; font-weight: 600; }
  .form-group .field { width: 100%; min-width: unset; }
  .section-note { background: #fef3c7; padding: 0.6em 0.8em; border-radius: 6px; border-left: 4px solid #f59e0b; margin: 0.8em 0; font-size: 9.5pt; page-break-inside: avoid; }

  /* ── Annex title ── */
  .annexe-title { page-break-before: always; text-align: center; margin-bottom: 1.2em; padding-top: 0.5em; padding-bottom: 0.8em; border-bottom: 3px solid #16a34a; }
  .annexe-title img { height: 36px; margin-bottom: 0.6em; }
  .annexe-title h1 { font-size: 16pt; color: #0f172a; }
  .annexe-title p { color: #64748b; font-size: 9.5pt; }
  .annexe-title .annex-ref { font-family: 'Courier New', monospace; font-size: 8pt; color: #16a34a; margin-top: 0.3em; }

  /* ── Watermark ── */
  .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-35deg); font-size: 80pt; color: rgba(22, 163, 74, 0.04); font-weight: 900; letter-spacing: 10px; pointer-events: none; z-index: -1; white-space: nowrap; }

  /* ── Footer notes (in-flow, not fixed) ── */
  .footer-note { margin-top: 2em; padding-top: 0.8em; border-top: 2px solid #e2e8f0; font-size: 8pt; color: #94a3b8; text-align: center; page-break-inside: avoid; }

  /* ── Screen only ── */
  @media screen {
    body { max-width: 21.59cm; margin: 0 auto; padding: 2cm; padding-top: 60px; background: #e2e8f0; }
    .print-page { background: white; padding: 2cm; margin-bottom: 0.5cm; box-shadow: 0 1px 6px rgba(0,0,0,0.12); min-height: 27.94cm; position: relative; }
  }

  @media print {
    body { padding: 0; margin: 0; background: white; }
    .no-print { display: none !important; }
    .print-page { padding: 0; margin: 0; box-shadow: none; min-height: auto; }
  }`;

    const dateStr = new Date().toLocaleDateString(isES ? "es-CO" : "en-US", { year: "numeric", month: "long", day: "numeric" });

    const contractBody = `
<div class="watermark">SOYAGENTIA</div>

<div class="letterhead">
  <img src="${logoUrl}" alt="SoyAgentia" class="letterhead-logo" />
  <div class="letterhead-info">
    <strong>AGENT IA SAS</strong><br/>
    NIT: 901.976.734-4<br/>
    ${isES ? "República de Colombia" : "Republic of Colombia"}<br/>
    contacto@soyagentia.com<br/>
    www.soyagentia.com
  </div>
</div>

<div class="doc-badge">
  <span class="doc-type">${isES ? "Documento Oficial" : "Official Document"}</span>
  <span class="doc-ref">${docRef}</span>
  <span class="doc-confidential">${isES ? "Confidencial" : "Confidential"}</span>
</div>

<div class="header">
  <h1>${isES ? "CONTRATO DE VINCULACIÓN" : "PARTNERSHIP AGREEMENT"}</h1>
  <p class="subtitle">${isES ? "Programa de Partners — SoyAgentia" : "Partner Program — SoyAgentia"}</p>
  <p class="date">${isES ? "Fecha de generación" : "Generated on"}: ${dateStr}</p>
</div>

<div class="highlight">
  <p><strong>${isES ? "Entre:" : "Between:"}</strong></p>
  <p><strong>AGENT IA SAS</strong>, ${isES ? "sociedad comercial colombiana identificada con" : "Colombian commercial company identified with"} NIT 901.976.734-4, ${isES ? "representada legalmente por" : "legally represented by"} <strong>Leily Kaory Londoño</strong>, ${isES ? "identificada con cédula de ciudadanía No." : "identified with ID No."} 1.000.919.249, ${isES ? "en su calidad de" : "in the capacity of"} <strong>${isES ? "Gerente General" : "General Manager"}</strong>, ${isES ? "en adelante" : "hereinafter"} <strong>"LA EMPRESA"</strong>,</p>
  <p>${isES ? "y" : "and"}</p>
  <p>${isES ? "La persona natural o jurídica que se identifica a continuación, en adelante" : "The natural or legal person identified below, hereinafter"} <strong>"EL PARTNER"</strong>.</p>
</div>

<h2>${isES ? "1. Datos del Partner" : "1. Partner Information"}</h2>
<div class="form-section">
  <h3>${isES ? "Persona Natural" : "Individual"}</h3>
  <div class="form-row">
    <div class="form-group"><label>${isES ? "Nombres" : "First Name(s)"}</label><span class="field"></span></div>
    <div class="form-group"><label>${isES ? "Apellidos" : "Last Name(s)"}</label><span class="field"></span></div>
  </div>
  <div class="form-row">
    <div class="form-group"><label>${isES ? "Tipo de documento" : "Document Type"}</label><span class="field field-short"></span></div>
    <div class="form-group"><label>${isES ? "Número de documento" : "Document Number"}</label><span class="field"></span></div>
  </div>
  <h3 style="margin-top:1.5em;">${isES ? "Empresa (si aplica)" : "Company (if applicable)"}</h3>
  <div class="form-row">
    <div class="form-group"><label>${isES ? "Razón social" : "Company Name"}</label><span class="field"></span></div>
    <div class="form-group"><label>NIT / ${isES ? "Identificación fiscal" : "Tax ID"}</label><span class="field"></span></div>
  </div>
  <h3 style="margin-top:1.5em;">${isES ? "Datos de contacto" : "Contact Information"}</h3>
  <div class="form-row">
    <div class="form-group"><label>Email</label><span class="field"></span></div>
    <div class="form-group"><label>${isES ? "Teléfono" : "Phone"}</label><span class="field"></span></div>
  </div>
  <div class="form-row">
    <div class="form-group"><label>${isES ? "Ciudad / País" : "City / Country"}</label><span class="field"></span></div>
    <div class="form-group"><label>${isES ? "Dirección" : "Address"}</label><span class="field"></span></div>
  </div>
</div>

<h2>${isES ? "2. Objeto del Contrato" : "2. Purpose of Agreement"}</h2>
<p>${isES ? "El presente contrato establece los términos y condiciones bajo los cuales el Partner se vincula al Programa de Partners de SoyAgentia, actuando como aliado comercial autorizado para la promoción, comercialización, implementación inicial y acompañamiento de los servicios y productos de la plataforma." : "This agreement establishes the terms and conditions under which the Partner joins the SoyAgentia Partner Program, acting as an authorized commercial partner for the promotion, sale, initial implementation, and support of the platform's services and products."}</p>

<h2>${isES ? "3. Inversión de Activación" : "3. Activation Investment"}</h2>
<div class="highlight">
  <p><strong>${isES ? "Inversión total:" : "Total investment:"}</strong> ${formatUSD(5000000)} (≈ $5.000.000 COP)</p>
  <ul>
    <li><strong>${isES ? "Licencias de Plataforma:" : "Platform Licenses:"}</strong> ${formatUSD(3000000)} (≈ $3.000.000 COP)</li>
    <li><strong>${isES ? "Activación de Partner:" : "Partner Activation:"}</strong> ${formatUSD(2000000)} (≈ $2.000.000 COP)</li>
  </ul>
  <p style="margin-top:0.5em;"><strong>${isES ? "Garantía de reembolso:" : "Refund guarantee:"}</strong> ${isES ? "Si la postulación no es aprobada, el valor total será devuelto en su totalidad." : "If the application is not approved, the full amount will be refunded."}</p>
</div>

<h2>${isES ? "4. Niveles del Programa" : "4. Program Tiers"}</h2>
<table>
  <thead><tr><th>${isES ? "Nivel" : "Tier"}</th><th>${isES ? "Margen Comercial" : "Commercial Margin"}</th><th>${isES ? "Facturación Requerida" : "Required Billing"}</th></tr></thead>
  <tbody>
    <tr><td><strong>Partner Ready</strong></td><td>15%</td><td>${isES ? "Desde el ingreso" : "From entry"}</td></tr>
    <tr><td><strong>Partner Silver</strong></td><td>20%</td><td>> ${formatUSD(15000000)}/mes (≈ $15.000.000 COP)</td></tr>
    <tr><td><strong>Partner Gold</strong></td><td>25%</td><td>> ${formatUSD(50000000)}/mes (≈ $50.000.000 COP)</td></tr>
  </tbody>
</table>
<p>${isES ? "Los porcentajes no son acumulables. Cada partner tendrá un único nivel vigente que podrá ser revisado trimestralmente." : "Percentages are not cumulative. Each partner will have a single active tier that may be reviewed quarterly."}</p>

<h2>${isES ? "5. Bono de Activación" : "5. Activation Bonus"}</h2>
<p>${isES ? "Durante los primeros 3 meses desde la activación oficial, el partner podrá recibir un 5% adicional sobre nuevas cuentas activadas y efectivamente pagadas. Este bono aplica únicamente sobre clientes nuevos y no incluye renovaciones, cuentas reactivadas, pruebas gratuitas ni ventas no cobradas." : "During the first 3 months from official activation, the partner may receive an additional 5% on new accounts that are activated and effectively paid. This bonus applies only to new clients and does not include renewals, reactivated accounts, free trials, or uncollected sales."}</p>

<h2>${isES ? "6. Obligaciones del Partner" : "6. Partner Obligations"}</h2>
<p>${isES ? "El Partner se compromete a:" : "The Partner agrees to:"}</p>
<ol>
  <li>${isES ? "Generar prospectos y oportunidades comerciales reales." : "Generate real prospects and business opportunities."}</li>
  <li>${isES ? "Realizar seguimiento comercial a sus leads." : "Follow up commercially on their leads."}</li>
  <li>${isES ? "Presentar adecuadamente la propuesta de valor de la plataforma." : "Adequately present the platform's value proposition."}</li>
  <li>${isES ? "Acompañar la activación e implementación inicial del cliente." : "Support client activation and initial implementation."}</li>
  <li>${isES ? "No alterar precios sin autorización." : "Not alter prices without authorization."}</li>
  <li>${isES ? "No prometer funcionalidades inexistentes." : "Not promise non-existent features."}</li>
  <li>${isES ? "No comprometer a la empresa jurídica o técnicamente sin autorización." : "Not commit the company legally or technically without authorization."}</li>
  <li>${isES ? "Mantener una relación activa con sus cuentas asignadas." : "Maintain an active relationship with assigned accounts."}</li>
  <li>${isES ? "Cumplir con los lineamientos de uso de marca." : "Comply with brand usage guidelines."}</li>
</ol>

<h2>${isES ? "7. Facturación Válida" : "7. Valid Billing"}</h2>
<p>${isES ? "Se entenderá como facturación válida aquella que cumpla simultáneamente con:" : "Valid billing is defined as billing that simultaneously meets:"}</p>
<ul>
  <li>${isES ? "Cliente registrado o atribuido al partner" : "Client registered or attributed to the partner"}</li>
  <li>${isES ? "Oportunidad reconocida por la empresa" : "Opportunity recognized by the company"}</li>
  <li>${isES ? "Licencia o suscripción activada" : "License or subscription activated"}</li>
  <li>${isES ? "Factura emitida o cobro registrado" : "Invoice issued or payment registered"}</li>
  <li>${isES ? "Pago efectivamente recibido" : "Payment effectively received"}</li>
  <li>${isES ? "Sin devoluciones, anulaciones o fraude" : "No refunds, cancellations or fraud"}</li>
  <li>${isES ? "Sin conflicto de atribución" : "No attribution conflict"}</li>
</ul>
<p>${isES ? "No es válida: ventas no cobradas, pruebas gratuitas, licencias bonificadas, operaciones simuladas, cuentas internas, descuentos no autorizados, cuentas en mora grave, reclamaciones no resueltas, clientes no trazables al partner." : "Not valid: uncollected sales, free trials, bonus licenses, simulated operations, internal accounts, unauthorized discounts, seriously delinquent accounts, unresolved claims, clients not traceable to the partner."}</p>

<h2>${isES ? "8. Rol del Partner" : "8. Partner Role"}</h2>
<p>${isES ? "El partner no solo actúa como canal comercial. También es un aliado de acompañamiento inicial para el cliente. Se espera que el partner:" : "The partner acts not only as a commercial channel but also as an initial support ally for the client. The partner is expected to:"}</p>
<ul>
  <li>${isES ? "Genere prospectos y oportunidades reales" : "Generate real prospects and opportunities"}</li>
  <li>${isES ? "Haga seguimiento comercial a sus leads" : "Follow up commercially on leads"}</li>
  <li>${isES ? "Presente adecuadamente la propuesta de valor" : "Adequately present the value proposition"}</li>
  <li>${isES ? "Cierre oportunidades dentro de condiciones autorizadas" : "Close opportunities within authorized conditions"}</li>
  <li>${isES ? "Acompañe la activación del cliente" : "Support client activation"}</li>
  <li>${isES ? "Apoye la implementación inicial" : "Support initial implementation"}</li>
  <li>${isES ? "Asesore al cliente en aspectos básicos" : "Advise the client on basic aspects"}</li>
  <li>${isES ? "Mantenga una relación activa con sus cuentas" : "Maintain an active relationship with accounts"}</li>
</ul>

<h2>${isES ? "9. Alcance de Implementación y Asesoría" : "9. Scope of Implementation and Advisory"}</h2>
<p>${isES ? "El partner deberá brindar como mínimo: acompañamiento comercial inicial, levantamiento básico de necesidad, apoyo en activación o puesta en marcha, orientación básica de uso, seguimiento temprano de adopción y canalización de requerimientos a la empresa." : "The partner must provide at minimum: initial commercial support, basic needs assessment, activation or launch support, basic usage guidance, early adoption follow-up, and channeling requirements to the company."}</p>
<p>${isES ? "No podrá asumir sin autorización: desarrollos técnicos avanzados no aprobados, promesas funcionales no existentes, compromisos contractuales en nombre de la empresa, ni soporte especializado de 2° o 3° nivel." : "Without authorization, the partner may not assume: unapproved advanced technical developments, non-existent functional promises, contractual commitments on behalf of the company, or specialized 2nd or 3rd level support."}</p>

<h2>${isES ? "10. Criterios de Permanencia y Retención" : "10. Retention and Permanence Criteria"}</h2>
<p>${isES ? "La permanencia en el programa dependerá del volumen vendido y la calidad del desempeño, evaluando: facturación efectiva, clientes activos, comportamiento de pago, seguimiento comercial, calidad del acompañamiento, retención de cuentas, uso adecuado de la marca y cumplimiento de lineamientos." : "Permanence in the program depends on sales volume and performance quality, evaluating: effective billing, active clients, payment behavior, commercial follow-up, support quality, account retention, proper brand usage, and guideline compliance."}</p>
<p>${isES ? "Para mantener Silver o Gold, retención mínima del 70% de clientes activos." : "To maintain Silver or Gold, minimum 70% active client retention."}</p>

<h2>${isES ? "11. Atribución de Clientes" : "11. Client Attribution"}</h2>
<p>${isES ? "Un cliente será reconocido como gestionado por el partner cuando: haya sido registrado en el canal definido, no exista conflicto previo de titularidad, exista trazabilidad razonable de la gestión, la empresa valide la atribución y la cuenta haya sido cerrada y pagada. La decisión final en caso de conflicto de atribución corresponderá a la empresa." : "A client will be recognized as managed by the partner when: registered through the defined channel, no prior ownership conflict exists, reasonable management traceability exists, the company validates the attribution, and the account has been closed and paid. The final decision in case of attribution conflict belongs to the company."}</p>

<h2>${isES ? "12. Pagos y Reconocimiento del Margen" : "12. Payments and Margin Recognition"}</h2>
<p>${isES ? "Los beneficios podrán reconocerse mediante: margen de reventa, descuento aplicado al proceso comercial o liquidación comercial posterior. Solo se reconocerán beneficios sobre ventas válidas, activas, trazables y efectivamente pagadas." : "Benefits may be recognized through: resale margin, discount applied to the commercial process, or subsequent commercial settlement. Benefits will only be recognized on valid, active, traceable, and effectively paid sales."}</p>

<h2>${isES ? "13. Causales de Suspensión o Retiro" : "13. Grounds for Suspension or Removal"}</h2>
<p>${isES ? "La empresa podrá suspender o retirar a un partner en casos como:" : "The company may suspend or remove a partner in cases such as:"}</p>
<ul>
  <li>${isES ? "Información falsa o incompleta" : "False or incomplete information"}</li>
  <li>${isES ? "Incumplimiento reiterado de lineamientos" : "Repeated failure to follow guidelines"}</li>
  <li>${isES ? "Uso indebido de la marca" : "Misuse of the brand"}</li>
  <li>${isES ? "Promesas no autorizadas al cliente" : "Unauthorized promises to clients"}</li>
  <li>${isES ? "Operaciones fraudulentas o simuladas" : "Fraudulent or simulated operations"}</li>
  <li>${isES ? "Mora grave" : "Serious payment default"}</li>
  <li>${isES ? "Afectación reputacional a la empresa" : "Reputational damage to the company"}</li>
  <li>${isES ? "Inactividad prolongada" : "Prolonged inactivity"}</li>
  <li>${isES ? "Malas prácticas comerciales o de implementación" : "Poor commercial or implementation practices"}</li>
</ul>
<p>${isES ? "La suspensión implica la pérdida de beneficios futuros, sin perjuicio de las obligaciones ya causadas y reconocidas." : "Suspension implies the loss of future benefits, without prejudice to obligations already incurred and recognized."}</p>

<h2>${isES ? "14. Modificación del Programa" : "14. Program Modification"}</h2>
<p>${isES ? "La empresa podrá actualizar, ajustar o modificar las condiciones del Programa de Partners cuando lo considere necesario por razones estratégicas, comerciales, operativas o financieras. Cualquier cambio relevante será comunicado por los canales oficiales definidos por la empresa." : "The company may update, adjust, or modify the Partner Program conditions when deemed necessary for strategic, commercial, operational, or financial reasons. Any relevant changes will be communicated through official channels defined by the company."}</p>

<h2>${isES ? "15. Aceptación de Términos" : "15. Acceptance of Terms"}</h2>
<div class="form-section">
  <div class="checkbox-line"><span class="checkbox"></span> ${isES ? "Acepto los términos y condiciones del Programa de Partners de SoyAgentia." : "I accept the terms and conditions of the SoyAgentia Partner Program."}</div>
  <div class="checkbox-line"><span class="checkbox"></span> ${isES ? "Declaro que la información proporcionada es verídica y completa." : "I declare that the information provided is truthful and complete."}</div>
  <div class="checkbox-line"><span class="checkbox"></span> ${isES ? "Acepto la política de privacidad y el tratamiento de datos personales." : "I accept the privacy policy and personal data processing."}</div>
  <div class="checkbox-line"><span class="checkbox"></span> ${isES ? "Entiendo que la activación como partner está sujeta a aprobación por parte de la empresa." : "I understand that partner activation is subject to company approval."}</div>
  <div class="checkbox-line"><span class="checkbox"></span> ${isES ? "He leído y acepto el Anexo A (Términos y Condiciones) y el Anexo B (Política de Privacidad) que forman parte integral de este contrato." : "I have read and accept Annex A (Terms and Conditions) and Annex B (Privacy Policy) which form an integral part of this agreement."}</div>
</div>
<div class="form-section" style="margin-top:1.5em;">
  <div class="form-row">
    <div class="form-group"><label>${isES ? "Lugar de firma" : "Place of signing"}</label><span class="field"></span></div>
    <div class="form-group"><label>${isES ? "Fecha de firma" : "Date of signing"}</label><span class="field field-short"></span></div>
  </div>
</div>
<div class="signature-block">
  <div class="signature-box"><div class="signature-line">
    <p><strong>${isES ? "Firma del Partner" : "Partner Signature"}</strong></p>
    <p>${isES ? "Nombre:" : "Name:"} _______________________</p>
    <p>${isES ? "Documento:" : "Document:"} _______________________</p>
  </div></div>
  <div class="signature-box"><div class="signature-line">
    <p><strong>${isES ? "Por SoyAgentia" : "For SoyAgentia"}</strong></p>
    <p><strong>AGENT IA SAS</strong> — NIT: 901.976.734-4</p>
    <p>${isES ? "Nombre:" : "Name:"} Leily Kaory Londoño</p>
    <p>${isES ? "Cédula:" : "ID:"} 1.000.919.249</p>
    <p>${isES ? "Cargo:" : "Title:"} ${isES ? "Gerente General" : "General Manager"}</p>
  </div></div>
</div>`;

    const annexA = `
<div class="annexe-title">
  <img src="${logoUrl}" alt="SoyAgentia" />
  <h1>${isES ? "ANEXO A — TÉRMINOS Y CONDICIONES" : "ANNEX A — TERMS AND CONDITIONS"}</h1>
  <p>AGENT IA SAS — NIT: 901.976.734-4</p>
  <p class="annex-ref">${docRef} / ANNEX-A</p>
</div>

<h2>1. ${isES ? "IDENTIFICACIÓN DEL PRESTADOR" : "SERVICE PROVIDER IDENTIFICATION"}</h2>
<ul>
  <li><strong>${isES ? "Razón Social:" : "Company Name:"}</strong> AGENT IA SAS</li>
  <li><strong>NIT:</strong> 901.976.734-4</li>
  <li><strong>${isES ? "Domicilio:" : "Domicile:"}</strong> ${isES ? "República de Colombia" : "Republic of Colombia"}</li>
  <li><strong>Email:</strong> contacto@soyagentia.com</li>
  <li><strong>Website:</strong> www.soyagentia.com</li>
</ul>
<p>${isES ? "AGENT IA SAS es una sociedad comercial colombiana dedicada al desarrollo, distribución y operación de soluciones tecnológicas basadas en inteligencia artificial, con enfoque en servicios de mensajería automatizada a través de WhatsApp Business API y otras plataformas de comunicación." : "AGENT IA SAS is a Colombian commercial company dedicated to the development, distribution, and operation of AI-based technological solutions, focused on automated messaging services through WhatsApp Business API and other communication platforms."}</p>

<h2>2. ${isES ? "OBJETO Y ACEPTACIÓN" : "PURPOSE AND ACCEPTANCE"}</h2>
<p>${isES ? "Los presentes Términos y Condiciones regulan el acceso, uso y contratación de los servicios ofrecidos por Agent IA SAS a través de su plataforma digital www.soyagentia.com. Al registrarse y/o contratar cualquier servicio, el Usuario manifiesta su plena aceptación de estos Términos y Condiciones, la Política de Privacidad y cualquier documento complementario que se incorpore por referencia." : "These Terms and Conditions regulate access, use, and contracting of services offered by Agent IA SAS through its digital platform www.soyagentia.com. By registering and/or contracting any service, the User expresses full acceptance of these Terms and Conditions, the Privacy Policy, and any supplementary documents incorporated by reference."}</p>
<p>${isES ? "Agent IA se reserva el derecho de modificar los presentes Términos en cualquier momento, notificando al Usuario con al menos quince (15) días de anticipación. El uso continuado de los servicios tras la notificación constituirá aceptación de las modificaciones." : "Agent IA reserves the right to modify these Terms at any time, notifying the User at least fifteen (15) days in advance. Continued use of services after notification constitutes acceptance of modifications."}</p>

<h2>3. ${isES ? "DEFINICIONES" : "DEFINITIONS"}</h2>
<ul>
  <li><strong>${isES ? "Usuario:" : "User:"}</strong> ${isES ? "Toda persona natural o jurídica que accede, se registra o contrata los servicios de Agent IA." : "Any natural or legal person who accesses, registers, or contracts Agent IA services."}</li>
  <li><strong>${isES ? "Agente de IA:" : "AI Agent:"}</strong> ${isES ? "Software de inteligencia artificial configurado para interactuar con los clientes del Usuario a través de WhatsApp y otras plataformas." : "AI software configured to interact with the User's clients through WhatsApp and other platforms."}</li>
  <li><strong>${isES ? "Conversación:" : "Conversation:"}</strong> ${isES ? "Cada interacción realizada por el Agente de IA o el Usuario dentro de la plataforma." : "Each interaction made by the AI Agent or User within the platform."}</li>
  <li><strong>${isES ? "Datos del Cliente Final:" : "End Customer Data:"}</strong> ${isES ? "Información personal o comercial de los clientes del Usuario." : "Personal or commercial information of the User's clients."}</li>
  <li><strong>Meta:</strong> Meta Platforms, Inc., ${isES ? "propietaria de WhatsApp Business API." : "owner of WhatsApp Business API."}</li>
  <li><strong>${isES ? "Plan:" : "Plan:"}</strong> ${isES ? "Paquete de servicios contratado por el Usuario." : "Service package contracted by the User."}</li>
</ul>

<h2>4. ${isES ? "REQUISITOS DE REGISTRO Y USO" : "REGISTRATION AND USE REQUIREMENTS"}</h2>
<p>${isES ? "Para acceder a los servicios, el Usuario deberá: ser mayor de edad y tener capacidad legal para vincular contratos, proporcionar información veraz, completa y actualizada, ser responsable de la confidencialidad de sus credenciales y disponer de una línea activa de WhatsApp Business." : "To access services, the User must: be of legal age with legal capacity to bind contracts, provide truthful, complete, and updated information, be responsible for credential confidentiality, and have an active WhatsApp Business line."}</p>

<h2>5. ${isES ? "DESCRIPCIÓN DE LOS SERVICIOS" : "SERVICE DESCRIPTION"}</h2>
<p>${isES ? "Agent IA proporciona agentes de inteligencia artificial a través de WhatsApp Business API para: automatización de atención al cliente, gestión de leads, campañas masivas, notificaciones de pago y captura de datos. Los servicios se proporcionan según el Plan contratado. No se garantizan resultados comerciales específicos." : "Agent IA provides AI agents through WhatsApp Business API for: customer service automation, lead management, mass campaigns, payment notifications, and data capture. Services are provided according to the contracted Plan. No specific commercial results are guaranteed."}</p>

<h2>6. ${isES ? "CUMPLIMIENTO DE POLÍTICAS DE META (WHATSAPP)" : "META (WHATSAPP) POLICY COMPLIANCE"}</h2>
<p>${isES ? "El Usuario es responsable de que el contenido de los mensajes cumpla con las políticas de Meta. Agent IA NO será responsable por la suspensión o cancelación de la cuenta de WhatsApp del Usuario. Queda prohibido el envío de spam, contenido engañoso, discriminatorio, productos prohibidos o suplantación de identidad. El Usuario debe mantenerse actualizado con los cambios en las políticas de Meta." : "The User is responsible for ensuring message content complies with Meta policies. Agent IA will NOT be responsible for suspension or cancellation of the User's WhatsApp account. Spam, deceptive content, discrimination, prohibited products, or identity fraud are prohibited. The User must stay updated with Meta policy changes."}</p>

<h2>7. ${isES ? "CUMPLIMIENTO DE POLÍTICAS DE TIKTOK" : "TIKTOK POLICY COMPLIANCE"}</h2>
<p>${isES ? "Los servicios deben cumplir con los términos y políticas de TikTok (ByteDance Ltd.). Se utilizarán exclusivamente para gestionar mensajes directos de TikTok Business y automatización. El Usuario es el único responsable del contenido en TikTok. Agent IA no almacena, vende ni comparte datos de TikTok con terceros no autorizados. El Usuario puede revocar el acceso en cualquier momento." : "Services must comply with TikTok (ByteDance Ltd.) terms and policies. Used exclusively for managing TikTok Business direct messages and automation. The User is solely responsible for TikTok content. Agent IA does not store, sell, or share TikTok data with unauthorized third parties. The User can revoke access at any time."}</p>

<h2>8. ${isES ? "CUMPLIMIENTO DE POLÍTICAS DE INSTAGRAM (META)" : "INSTAGRAM (META) POLICY COMPLIANCE"}</h2>
<p>${isES ? "8.1. El Usuario reconoce que el uso de la integración con Instagram está sujeto al cumplimiento de las políticas de Meta Platforms, incluyendo: Política de la Plataforma de Instagram, Términos de uso de la API de Instagram Graph, Política de datos de Instagram para desarrolladores, y Directrices de la comunidad de Instagram." : "8.1. The User acknowledges that use of the Instagram integration is subject to compliance with Meta Platforms policies, including: Instagram Platform Policy, Instagram Graph API Terms of Use, Instagram Data Policy for Developers, and Instagram Community Guidelines."}</p>
<p>${isES ? "8.2. Agent IA utiliza la API de Instagram Graph exclusivamente para: gestionar mensajes directos (DMs) del Usuario, automatizar respuestas mediante el Agente de IA y centralizar conversaciones de múltiples plataformas." : "8.2. Agent IA uses the Instagram Graph API exclusively for: managing User direct messages (DMs), automating responses via the AI Agent, and centralizing multi-platform conversations."}</p>
<p>${isES ? "8.3. El Usuario es el ÚNICO responsable del contenido enviado a través de la integración con Instagram. Agent IA NO será responsable por la suspensión, restricción o cancelación de la cuenta de Instagram del Usuario por parte de Meta debido al incumplimiento de sus políticas." : "8.3. The User is SOLELY responsible for content sent through the Instagram integration. Agent IA will NOT be responsible for suspension, restriction, or cancellation of the User's Instagram account by Meta due to policy non-compliance."}</p>
<p>${isES ? "8.4. Queda expresamente prohibido utilizar la integración con Instagram para: envío masivo de mensajes no solicitados (spam), contenido que viole las directrices de la comunidad de Instagram, suplantación de identidad, recopilación automatizada de datos sin consentimiento, o cualquier actividad que infrinja derechos de propiedad intelectual de terceros." : "8.4. It is expressly prohibited to use the Instagram integration for: mass unsolicited messaging (spam), content violating Instagram community guidelines, identity fraud, automated data collection without consent, or any activity infringing third-party intellectual property rights."}</p>
<p>${isES ? "8.5. El Usuario acepta que Meta puede modificar las políticas de Instagram en cualquier momento y se compromete a cumplir con dichas modificaciones. Agent IA no asumirá responsabilidad por cambios en las políticas de Meta que afecten la operación de la integración con Instagram." : "8.5. The User accepts that Meta may modify Instagram policies at any time and commits to comply with such modifications. Agent IA will not assume responsibility for Meta policy changes affecting Instagram integration operation."}</p>

<h2>9. ${isES ? "CUMPLIMIENTO DE POLÍTICAS DE FACEBOOK MESSENGER (META)" : "FACEBOOK MESSENGER (META) POLICY COMPLIANCE"}</h2>
<p>${isES ? "9.1. El Usuario reconoce que el uso de la integración con Facebook Messenger está sujeto al cumplimiento de las políticas de Meta Platforms, incluyendo: Términos de la Plataforma de Facebook, Política de la Plataforma de Messenger, Normas comunitarias de Facebook y Política de datos de Meta para desarrolladores." : "9.1. The User acknowledges that use of the Facebook Messenger integration is subject to compliance with Meta Platforms policies, including: Facebook Platform Terms, Messenger Platform Policy, Facebook Community Standards, and Meta's Developer Data Policy."}</p>
<p>${isES ? "9.2. Agent IA utiliza la API de Messenger Platform exclusivamente para: gestionar mensajes de la Página de Facebook del Usuario, automatizar respuestas mediante el Agente de IA y centralizar conversaciones de múltiples plataformas." : "9.2. Agent IA uses the Messenger Platform API exclusively for: managing messages from the User's Facebook Page, automating responses via the AI Agent, and centralizing multi-platform conversations."}</p>
<p>${isES ? "9.3. El Usuario es el ÚNICO responsable del contenido enviado a través de la integración con Messenger. Agent IA NO será responsable por la suspensión, restricción o cancelación de la Página de Facebook del Usuario o del acceso a Messenger por parte de Meta debido al incumplimiento de sus políticas." : "9.3. The User is SOLELY responsible for content sent through the Messenger integration. Agent IA will NOT be responsible for suspension, restriction, or cancellation of the User's Facebook Page or Messenger access by Meta due to policy non-compliance."}</p>
<p>${isES ? "9.4. Queda expresamente prohibido utilizar la integración con Messenger para: envío masivo de mensajes no solicitados (spam), contenido que viole las normas comunitarias de Facebook, suplantación de identidad, recopilación automatizada de datos sin consentimiento, o cualquier actividad que infrinja derechos de propiedad intelectual de terceros." : "9.4. It is expressly prohibited to use the Messenger integration for: mass unsolicited messaging (spam), content violating Facebook Community Standards, identity fraud, automated data collection without consent, or any activity infringing third-party intellectual property rights."}</p>
<p>${isES ? "9.5. El Usuario acepta que Meta puede modificar las políticas de Messenger en cualquier momento y se compromete a cumplir con dichas modificaciones. Agent IA no asumirá responsabilidad por cambios en las políticas de Meta que afecten la operación de la integración con Messenger." : "9.5. The User accepts that Meta may modify Messenger policies at any time and commits to comply with such modifications. Agent IA will not assume responsibility for Meta policy changes affecting Messenger integration operation."}</p>

<h2>10. ${isES ? "CUMPLIMIENTO DE POLÍTICAS DE GOOGLE" : "GOOGLE POLICY COMPLIANCE"}</h2>
<p>${isES ? "10.1. En caso de que los Servicios incluyan integraciones con servicios de Google (incluyendo Google Business Profile, Google Ads, Google Analytics u otros productos de Google LLC), el Usuario se compromete a cumplir con: Los Términos de Servicio de Google, Las Políticas de Google Ads, La Política de Privacidad de Google y Las directrices de uso de las APIs de Google." : "9.1. If Services include integrations with Google services (including Google Business Profile, Google Ads, Google Analytics, or other Google LLC products), the User commits to comply with: Google Terms of Service, Google Ads Policies, Google Privacy Policy, and Google API usage guidelines."}</p>
<p>${isES ? "10.2. Agent IA NO será responsable por la suspensión, restricción o cancelación de cuentas de Google del Usuario derivada del incumplimiento de las políticas de Google por parte del Usuario." : "9.2. Agent IA will NOT be responsible for suspension, restriction, or cancellation of User's Google accounts resulting from User's non-compliance with Google policies."}</p>
<p>${isES ? "10.3. El Usuario reconoce que Google puede modificar sus políticas, APIs y términos de servicio en cualquier momento, y acepta que Agent IA no será responsable por cambios que afecten la disponibilidad o funcionalidad de las integraciones con Google." : "9.3. The User acknowledges that Google may modify its policies, APIs, and terms of service at any time, and accepts that Agent IA will not be responsible for changes affecting Google integration availability or functionality."}</p>
<p>${isES ? "10.4. El Usuario se obliga a no utilizar las integraciones con Google para actividades prohibidas por Google, incluyendo prácticas engañosas de marketing, manipulación de métricas, o cualquier actividad que viole las políticas de publicidad de Google." : "9.4. The User undertakes not to use Google integrations for activities prohibited by Google, including deceptive marketing practices, metric manipulation, or any activity violating Google advertising policies."}</p>

<h2>11. ${isES ? "CUMPLIMIENTO DE POLÍTICAS DE WORDPRESS" : "WORDPRESS POLICY COMPLIANCE"}</h2>
<p>${isES ? "11.1. El uso de la integración con WordPress (Automattic, Inc.) está sujeto al cumplimiento de: Los Términos de Servicio de WordPress.com, La Política de Uso Aceptable de WordPress, Las directrices para plugins y desarrolladores de WordPress, y Las políticas de privacidad y datos de Automattic." : "10.1. Use of the WordPress integration (Automattic, Inc.) is subject to compliance with: WordPress.com Terms of Service, WordPress Acceptable Use Policy, WordPress plugin and developer guidelines, and Automattic privacy and data policies."}</p>
<p>${isES ? "11.2. Agent IA proporciona un widget de chat inteligente que se integra con sitios WordPress del Usuario. El Usuario es el ÚNICO responsable de: garantizar que su sitio WordPress cumpla con todas las normativas aplicables (incluyendo cookies, privacidad, protección al consumidor), informar a los visitantes de su sitio web sobre el uso de inteligencia artificial en el chat, e implementar los avisos de privacidad y consentimiento requeridos por la legislación aplicable en su sitio WordPress." : "10.2. Agent IA provides an intelligent chat widget that integrates with User's WordPress sites. The User is SOLELY responsible for: ensuring their WordPress site complies with all applicable regulations (including cookies, privacy, consumer protection), informing site visitors about AI use in chat, and implementing privacy notices and consent required by applicable legislation on their WordPress site."}</p>
<p>${isES ? "11.3. Agent IA NO será responsable por el contenido del sitio WordPress del Usuario, ni por el incumplimiento de las políticas de WordPress por parte del Usuario." : "10.3. Agent IA will NOT be responsible for the content of the User's WordPress site, nor for the User's non-compliance with WordPress policies."}</p>
<p>${isES ? "11.4. El Usuario acepta que WordPress y Automattic pueden modificar sus políticas en cualquier momento." : "10.4. The User accepts that WordPress and Automattic may modify their policies at any time."}</p>

<h2>12. ${isES ? "CUMPLIMIENTO NORMATIVO COLOMBIANO ADICIONAL" : "ADDITIONAL COLOMBIAN REGULATORY COMPLIANCE"}</h2>
<p>${isES ? "12.1. Ley de Comercio Electrónico: Los presentes T&C se rigen adicionalmente por la Ley 527 de 1999 sobre comercio electrónico, firmas digitales y mensajes de datos." : "11.1. E-Commerce Law: These T&C are additionally governed by Law 527 of 1999 on electronic commerce, digital signatures, and data messages."}</p>
<p>${isES ? "12.2. Ley de Defensa del Consumidor en el Comercio Electrónico: Agent IA cumple con las disposiciones del Decreto 587 de 2016 sobre comercio electrónico y protección al consumidor en ventas a distancia." : "11.2. E-Commerce Consumer Protection: Agent IA complies with Decree 587 of 2016 on e-commerce and consumer protection in distance sales."}</p>
<p>${isES ? "12.3. Prevención de Lavado de Activos: El Usuario declara que los recursos utilizados para contratar los Servicios provienen de actividades lícitas y no están relacionados con lavado de activos, financiación del terrorismo u otras actividades ilícitas conforme a la Ley 1762 de 2015." : "11.3. Anti-Money Laundering: The User declares that resources used to contract Services come from lawful activities and are not related to money laundering, terrorism financing, or other illicit activities per Law 1762 of 2015."}</p>
<p>${isES ? "12.4. Facturación Electrónica: La facturación se realizará conforme a la Resolución 000042 de 2020 de la DIAN y demás normatividad vigente sobre facturación electrónica en Colombia." : "11.4. Electronic Invoicing: Invoicing shall be performed per DIAN Resolution 000042 of 2020 and other applicable e-invoicing regulations in Colombia."}</p>
<p>${isES ? "12.5. Disclaimer de IA: El Usuario reconoce expresamente que los Agentes de IA son sistemas probabilísticos basados en modelos de lenguaje que pueden generar respuestas inexactas, incompletas o inapropiadas. Agent IA NO garantiza la exactitud, completitud, idoneidad ni legalidad de las respuestas generadas. El Usuario es el ÚNICO responsable de supervisar, validar y corregir las respuestas del Agente de IA." : "11.5. AI Disclaimer: The User expressly acknowledges that AI Agents are probabilistic systems based on language models that may generate inaccurate, incomplete, or inappropriate responses. Agent IA does NOT guarantee the accuracy, completeness, suitability, or legality of generated responses. The User is SOLELY responsible for supervising, validating, and correcting AI Agent responses."}</p>
<p>${isES ? "12.6. Responsabilidad por Contenido de Terceras Plataformas: Agent IA actúa exclusivamente como intermediario tecnológico. No controla, revisa ni aprueba el contenido que el Usuario envía a través de las plataformas de terceros (Meta/WhatsApp, Meta/Instagram, Meta/Messenger, TikTok, Google, WordPress). Cualquier sanción, penalidad, multa o reclamación derivada del contenido del Usuario en dichas plataformas será responsabilidad exclusiva del Usuario." : "12.6. Third-Party Platform Content Liability: Agent IA acts exclusively as a technology intermediary. It does not control, review, or approve content the User sends through third-party platforms (Meta/WhatsApp, Meta/Instagram, Meta/Messenger, TikTok, Google, WordPress). Any sanction, penalty, fine, or claim arising from User content on such platforms shall be the User's sole responsibility."}</p>

<h2>13. ${isES ? "TRATAMIENTO DE DATOS PERSONALES" : "PERSONAL DATA PROCESSING"}</h2>
<p>${isES ? "Regido por la Ley 1581 de 2012 y el Decreto 1377 de 2013. Agent IA es Responsable del Tratamiento para datos del Usuario; el Usuario es Responsable del Tratamiento para datos de sus Clientes Finales, y Agent IA actúa como Encargado del Tratamiento. El Usuario debe obtener autorización previa de sus Clientes Finales, informarles sobre el tratamiento, derechos e identidad del Responsable. Se autoriza compartir datos con Meta, proveedores de nube, proveedores de IA, pasarelas de pago y proveedores de facturación." : "Governed by Law 1581 of 2012 and Decree 1377 of 2013. Agent IA is Data Controller for User data; the User is Data Controller for End Customer data, and Agent IA acts as Data Processor. The User must obtain prior authorization from End Customers, informing them about processing, rights, and Data Controller identity. Data sharing is authorized with Meta, cloud providers, AI providers, payment gateways, and billing providers."}</p>

<h2>14. ${isES ? "OBLIGACIONES DEL USUARIO" : "USER OBLIGATIONS"}</h2>
<p>${isES ? "Usar los servicios de forma lícita y ética, sin uso ilícito, fraudulento o engañoso, sin intentos de penetración al sistema, mantener actualizado el entrenamiento del Agente de IA, no revender/sublicenciar sin autorización, cumplir con leyes fiscales, laborales y de protección al consumidor, ser responsable de la precisión y legalidad del contenido, y mantener activa la cuenta de WhatsApp Business." : "Use services lawfully and ethically, no illicit, fraudulent, or deceptive use, no system penetration attempts, keep AI Agent training updated, no reselling/sublicensing without authorization, comply with tax, labor, and consumer protection laws, be responsible for content accuracy and legality, and maintain an active WhatsApp Business account."}</p>

<h2>15. ${isES ? "PLANES, PRECIOS Y FACTURACIÓN" : "PLANS, PRICING AND BILLING"}</h2>
<p>${isES ? "Los precios pueden ser modificados con 30 días de antelación. El pago se requiere por anticipado (mensual o anual). No se realizan reembolsos salvo lo dispuesto por la ley. Las conversaciones no consumidas no se acumulan. Se emiten facturas electrónicas conforme a la legislación tributaria colombiana." : "Prices may be modified with 30 days notice. Payment is required in advance (monthly or annual). No refunds except as required by law. Unconsumed conversations do not accumulate. Electronic invoices are issued per Colombian tax law."}</p>

<h2>16. ${isES ? "PROPIEDAD INTELECTUAL" : "INTELLECTUAL PROPERTY"}</h2>
<p>${isES ? "Todos los derechos de propiedad intelectual sobre la Plataforma, software, algoritmos y marca pertenecen a Agent IA. Los servicios otorgan una licencia limitada, no exclusiva, intransferible y revocable. El Usuario conserva la propiedad de su contenido de entrenamiento pero otorga licencia no exclusiva a Agent IA." : "All intellectual property rights on the Platform, software, algorithms, and brand belong to Agent IA. Services grant a limited, non-exclusive, non-transferable, revocable license. The User retains ownership of training content but grants a non-exclusive license to Agent IA."}</p>

<h2>17. ${isES ? "LIMITACIÓN DE RESPONSABILIDAD" : "LIMITATION OF LIABILITY"}</h2>
<p>${isES ? "Agent IA NO será responsable por daños directos o indirectos derivados del uso/indisponibilidad del servicio, pérdidas comerciales, pérdida de datos, daños a la reputación, errores en respuestas de IA, interrupciones del servicio por Meta/telecomunicaciones/fuerza mayor, suspensión de la cuenta de WhatsApp del Usuario por Meta, mal uso del servicio por el Usuario, ni reclamaciones de Clientes Finales. La responsabilidad se limita al valor de 3 meses de pagos del Usuario." : "Agent IA will NOT be responsible for direct or indirect damages from service use/unavailability, business losses, data loss, reputation damage, AI response errors, service interruptions from Meta/telecom/force majeure, suspension of User's WhatsApp account by Meta, User's misuse of services, or End Customer claims. Liability is capped at 3 months of User payments."}</p>

<h2>18. ${isES ? "INDEMNIZACIÓN" : "INDEMNIFICATION"}</h2>
<p>${isES ? "El Usuario indemnizará a Agent IA contra reclamaciones derivadas de: incumplimiento de los T&C por el Usuario, incumplimiento de políticas de Meta, tratamiento ilegal/no autorizado de datos, reclamaciones de terceros por contenido/productos/servicios del Usuario, y uso negligente/ilegal de los servicios." : "The User shall indemnify Agent IA against claims arising from: User's breach of T&C, Meta policy breach, illegal/unauthorized data processing, third-party claims from User's content/products/services, and negligent/illegal service use."}</p>

<h2>19. ${isES ? "SUSPENSIÓN Y TERMINACIÓN" : "SUSPENSION AND TERMINATION"}</h2>
<p>${isES ? "Agent IA podrá suspender/terminar sin previo aviso por: incumplimiento de T&C o políticas de Meta, uso fraudulento/ilegal/abusivo, falta de pago (5 días después del vencimiento), órdenes judiciales/administrativas, o actividades que pongan en riesgo la seguridad de la plataforma. El Usuario puede cancelar en cualquier momento, con efecto al final del período de facturación, sin reembolsos parciales." : "Agent IA may suspend/terminate without notice for: T&C or Meta policy breach, fraudulent/illegal/abusive use, non-payment (5 days after due date), court/administrative orders, or activities risking platform security. The User may cancel at any time, effective at end of billing period, without partial refunds."}</p>

<h2>20. ${isES ? "NIVEL DE SERVICIO (SLA)" : "SERVICE LEVEL AGREEMENT (SLA)"}</h2>
<p>${isES ? "Objetivo de disponibilidad mensual del 99.9% (excluyendo mantenimiento y fuerza mayor). Mantenimiento notificado con 24 horas de anticipación. El SLA no aplica a fallos de la API de Meta, problemas de conectividad del Usuario, fuerza mayor ni incumplimientos de T&C." : "99.9% monthly uptime target (excluding maintenance and force majeure). Maintenance notified 24 hours in advance. SLA does not apply to Meta API failures, User connectivity issues, force majeure, or T&C breaches."}</p>

<h2>21. ${isES ? "CONFIDENCIALIDAD" : "CONFIDENTIALITY"}</h2>
<p>${isES ? "Ambas partes mantendrán la confidencialidad de la información compartida durante 2 años después de la terminación del contrato." : "Both parties shall maintain confidentiality of shared information for 2 years after contract termination."}</p>

<h2>22. ${isES ? "FUERZA MAYOR Y CASO FORTUITO" : "FORCE MAJEURE"}</h2>
<p>${isES ? "Ninguna de las partes será responsable por eventos de fuerza mayor conforme al Artículo 64 del Código Civil colombiano, incluyendo: desastres naturales, pandemias, conflictos armados, terrorismo, fallos de telecomunicaciones, cambios regulatorios y cambios en políticas de Meta." : "Neither party shall be responsible for force majeure events per Colombian Civil Code Article 64, including: natural disasters, pandemics, armed conflicts, terrorism, telecom failures, regulatory changes, and Meta policy changes."}</p>

<h2>23. ${isES ? "PROTECCIÓN AL CONSUMIDOR" : "CONSUMER PROTECTION"}</h2>
<p>${isES ? "Los usuarios consumidores gozan de las garantías de la Ley 1480 de 2011. Derecho de retracto de 5 días hábiles si el servicio no ha comenzado." : "Consumer users enjoy guarantees under Law 1480 of 2011. 5 business day right of withdrawal if the service has not started."}</p>

<h2>24. ${isES ? "RESOLUCIÓN DE CONFLICTOS" : "DISPUTE RESOLUTION"}</h2>
<p>${isES ? "Período de negociación amistosa de 30 días. Sujeto a jurisdicción colombiana. Se aplica la ley colombiana." : "30-day friendly negotiation period. Subject to Colombian jurisdiction. Colombian law applies."}</p>

<h2>25. ${isES ? "DISPOSICIONES GENERALES" : "GENERAL PROVISIONS"}</h2>
<p>${isES ? "No se permite la cesión sin consentimiento escrito (Agent IA puede ceder libremente). Cláusula de separabilidad. Acuerdo completo con la Política de Privacidad. Cláusula de no renuncia." : "No assignment without written consent (Agent IA may assign freely). Severability clause. Complete agreement with Privacy Policy. Non-waiver clause."}</p>

<h2>26. ${isES ? "CONTACTO" : "CONTACT"}</h2>
<ul>
  <li><strong>Email:</strong> contacto@soyagentia.com</li>
  <li><strong>Website:</strong> www.soyagentia.com</li>
</ul>`;

    const annexB = `
<div class="annexe-title">
  <img src="${logoUrl}" alt="SoyAgentia" />
  <h1>${isES ? "ANEXO B — POLÍTICA DE PRIVACIDAD" : "ANNEX B — PRIVACY POLICY"}</h1>
  <p>AGENT IA SAS — NIT: 901.976.734-4</p>
  <p class="annex-ref">${docRef} / ANNEX-B</p>
</div>

<h2>1. ${isES ? "RESPONSABLE DEL TRATAMIENTO" : "DATA CONTROLLER"}</h2>
<ul>
  <li><strong>${isES ? "Razón Social:" : "Company Name:"}</strong> AGENT IA SAS</li>
  <li><strong>NIT:</strong> 901.976.734-4</li>
  <li><strong>${isES ? "Oficial de Protección de Datos:" : "Data Protection Officer:"}</strong> notificaciones@induretros.com</li>
  <li><strong>${isES ? "Notificaciones:" : "Notifications:"}</strong> notificaciones@soyagentia.com</li>
</ul>
<p>${isES ? "Agent IA es Responsable del Tratamiento para datos del Usuario; Encargado del Tratamiento para datos de Clientes Finales." : "Agent IA is Data Controller for User data; Data Processor for End Customer data."}</p>

<h2>2. ${isES ? "MARCO LEGAL" : "LEGAL FRAMEWORK"}</h2>
<ul>
  <li>${isES ? "Constitución Política de Colombia, Artículo 15" : "Colombian Constitution, Article 15"}</li>
  <li>${isES ? "Ley 1581 de 2012 (Protección General de Datos Personales)" : "Law 1581 of 2012 (General Personal Data Protection)"}</li>
  <li>${isES ? "Decreto 1377 de 2013" : "Decree 1377 of 2013"}</li>
  <li>${isES ? "Decreto 1074 de 2015" : "Decree 1074 of 2015"}</li>
  <li>${isES ? "Ley 1266 de 2008 (Habeas data financiero)" : "Law 1266 of 2008 (Financial habeas data)"}</li>
  <li>${isES ? "Circular Externa 002 de 2015 de la SIC" : "External Circular 002 of 2015 of the SIC"}</li>
</ul>

<h2>3. ${isES ? "DATOS PERSONALES RECOPILADOS" : "PERSONAL DATA COLLECTED"}</h2>
<h3>${isES ? "Datos del Usuario (Agent IA como Responsable):" : "User Data (Agent IA as Controller):"}</h3>
<ul>
  <li>${isES ? "Identificación: nombre, tipo/número de documento, NIT" : "Identification: name, document type/number, NIT"}</li>
  <li>${isES ? "Contacto: email, teléfono, dirección, ciudad" : "Contact: email, phone, address, city"}</li>
  <li>${isES ? "Comerciales: nombre de la empresa, nombre de contacto" : "Commercial: company name, contact name"}</li>
  <li>${isES ? "Acceso: credenciales cifradas" : "Access: encrypted credentials"}</li>
  <li>${isES ? "Financieros: información de pago y facturación" : "Financial: payment and billing info"}</li>
  <li>${isES ? "Uso: registros de actividad, registros de acceso, dirección IP" : "Usage: activity logs, access logs, IP address"}</li>
</ul>
<h3>${isES ? "Datos de Clientes Finales (Usuario como Responsable):" : "End Customer Data (User as Controller):"}</h3>
<ul>
  <li>${isES ? "Número de teléfono (WhatsApp)" : "Phone number (WhatsApp)"}</li>
  <li>${isES ? "Nombre (cuando se proporciona)" : "Name (when provided)"}</li>
  <li>${isES ? "Contenido de conversaciones" : "Conversation content"}</li>
  <li>${isES ? "Datos proporcionados voluntariamente (pedidos, preferencias, consultas)" : "Voluntarily provided data (orders, preferences, queries)"}</li>
  <li>${isES ? "Metadatos de conversaciones (fecha, hora, duración)" : "Conversation metadata (date, time, duration)"}</li>
</ul>

<h2>4. ${isES ? "FINALIDADES DEL TRATAMIENTO" : "PROCESSING PURPOSES"}</h2>
<h3>${isES ? "Finalidades principales (necesarias para el servicio):" : "Primary purposes (necessary for service):"}</h3>
<ul>
  <li>${isES ? "Registro y autenticación del Usuario" : "User registration and authentication"}</li>
  <li>${isES ? "Prestación del servicio" : "Service provision"}</li>
  <li>${isES ? "Procesamiento de pagos y facturación" : "Payment processing and billing"}</li>
  <li>${isES ? "Soporte técnico y atención al cliente" : "Technical support and customer service"}</li>
  <li>${isES ? "Operación del Agente de IA" : "AI Agent operation"}</li>
  <li>${isES ? "Cumplimiento legal y regulatorio" : "Legal and regulatory compliance"}</li>
</ul>
<h3>${isES ? "Finalidades secundarias (con consentimiento):" : "Secondary purposes (with consent):"}</h3>
<ul>
  <li>${isES ? "Comunicaciones comerciales y promocionales" : "Commercial and promotional communications"}</li>
  <li>${isES ? "Análisis estadístico del uso de la plataforma" : "Statistical analysis of platform usage"}</li>
  <li>${isES ? "Mejora de algoritmos de IA" : "AI algorithm improvement"}</li>
  <li>${isES ? "Personalización de la experiencia del usuario" : "User experience personalization"}</li>
  <li>${isES ? "Encuestas de satisfacción" : "Satisfaction surveys"}</li>
</ul>

<h2>5. ${isES ? "AUTORIZACIÓN Y CONSENTIMIENTO" : "AUTHORIZATION AND CONSENT"}</h2>
<p>${isES ? "Los Usuarios autorizan el tratamiento de datos al registrarse. El Usuario garantiza obtener la autorización de los Clientes Finales para: la recopilación de datos personales, el almacenamiento y procesamiento de datos, la transferencia a Agent IA como Encargado del Tratamiento y el procesamiento de conversaciones por IA. El Usuario debe conservar evidencia de las autorizaciones." : "Users authorize data processing by registering. The User guarantees obtaining End Customer authorization for: personal data collection, data storage and processing, transfer to Agent IA as Data Processor, and AI processing of conversations. The User must retain evidence of authorizations."}</p>

<h2>6. ${isES ? "TRANSFERENCIA Y TRANSMISIÓN DE DATOS" : "DATA TRANSFER AND TRANSMISSION"}</h2>
<p>${isES ? "Transferencias nacionales: a Encargados del Tratamiento con contratos de protección adecuados. Transferencias internacionales a:" : "National transfers: to Data Processors with adequate protection contracts. International transfers to:"}</p>
<ul>
  <li>Meta Platforms, Inc. (${isES ? "EE.UU." : "USA"}) — ${isES ? "Integración WhatsApp Business API" : "WhatsApp Business API integration"}</li>
  <li>TikTok/ByteDance Ltd. (Singapore/${isES ? "EE.UU." : "USA"}) — TikTok Business API</li>
  <li>Meta Platforms, Inc. (${isES ? "EE.UU." : "USA"}) — ${isES ? "Integración API de Instagram Graph" : "Instagram Graph API integration"}</li>
  <li>Meta Platforms, Inc. (${isES ? "EE.UU." : "USA"}) — ${isES ? "Integración Facebook Messenger API" : "Facebook Messenger API integration"}</li>
  <li>Google LLC (${isES ? "EE.UU." : "USA"}) — ${isES ? "Integración Google Business / Analytics" : "Google Business / Analytics integration"}</li>
  <li>${isES ? "Proveedores de infraestructura en la nube" : "Cloud infrastructure providers"}</li>
  <li>${isES ? "Proveedores de modelos de IA" : "AI model providers"}</li>
</ul>
<p>${isES ? "Todas las transferencias internacionales incluyen mecanismos de protección adecuados." : "All international transfers include adequate protection mechanisms."}</p>

<h2>7. ${isES ? "DERECHOS DE LOS TITULARES" : "DATA SUBJECT RIGHTS"}</h2>
<ul>
  <li>${isES ? "Acceder, actualizar y rectificar datos personales" : "Access, update, and rectify personal data"}</li>
  <li>${isES ? "Solicitar prueba de autorización" : "Request proof of authorization"}</li>
  <li>${isES ? "Información sobre el uso de datos" : "Information about data use"}</li>
  <li>${isES ? "Presentar quejas ante la SIC" : "File complaints with the SIC"}</li>
  <li>${isES ? "Revocar la autorización y solicitar eliminación de datos" : "Revoke authorization and request data deletion"}</li>
  <li>${isES ? "Acceso gratuito a datos personales" : "Free access to personal data"}</li>
</ul>
<p>${isES ? "Contacto: notificaciones@induretros.com. Consultas respondidas en 10 días hábiles. Reclamos respondidos en 15 días hábiles." : "Contact: notificaciones@induretros.com. Queries answered within 10 business days. Claims answered within 15 business days."}</p>

<h2>8. ${isES ? "MEDIDAS DE SEGURIDAD" : "SECURITY MEASURES"}</h2>
<ul>
  <li>${isES ? "Cifrado TLS/SSL en tránsito, AES-256 en reposo" : "TLS/SSL encryption in transit, AES-256 at rest"}</li>
  <li>${isES ? "Autenticación segura con contraseñas cifradas" : "Secure authentication with encrypted passwords"}</li>
  <li>${isES ? "Control de acceso basado en roles (RBAC)" : "Role-based access control (RBAC)"}</li>
  <li>${isES ? "Monitoreo continuo de infraestructura" : "Continuous infrastructure monitoring"}</li>
  <li>${isES ? "Copias de seguridad periódicas" : "Periodic backups"}</li>
  <li>${isES ? "Políticas de seguridad de la información para el personal" : "Information security policies for personnel"}</li>
  <li>${isES ? "Procedimientos de respuesta a incidentes" : "Incident response procedures"}</li>
</ul>

<h2>9. ${isES ? "RETENCIÓN DE DATOS" : "DATA RETENTION"}</h2>
<ul>
  <li>${isES ? "Datos del Usuario: conservados durante el contrato y 5 años adicionales para cumplimiento legal/fiscal" : "User data: retained during contract and 5 additional years for legal/tax compliance"}</li>
  <li>${isES ? "Datos de Clientes Finales (conversaciones): conservados mientras la cuenta esté activa, luego máximo 6 meses después de la terminación, y eliminación segura" : "End Customer data (conversations): retained while account is active, then maximum 6 months after termination, then securely deleted"}</li>
  <li>${isES ? "El Usuario puede solicitar eliminación anticipada sujeta a obligaciones legales de retención" : "The User may request early deletion subject to legal retention obligations"}</li>
</ul>

<h2>10. ${isES ? "INTEGRACIÓN CON TIKTOK" : "TIKTOK INTEGRATION"}</h2>
<p>${isES ? "Utilizado para gestión de mensajes directos de TikTok Business y respuestas automatizadas. Datos recopilados: información del perfil de TikTok Business, mensajes directos enviados/recibidos, datos de interacción con seguidores, tokens de acceso OAuth. Los tokens se cifran y renuevan automáticamente. El Usuario puede desconectar su cuenta en cualquier momento." : "Used for TikTok Business direct message management and automated responses. Data collected: TikTok Business profile info, direct messages sent/received, follower interaction data, OAuth access tokens. Tokens are encrypted and auto-renewed. The User can disconnect their account at any time."}</p>

<h2>11. ${isES ? "INTEGRACIÓN CON INSTAGRAM (META)" : "INSTAGRAM (META) INTEGRATION"}</h2>
<p>${isES ? "11.1. Agent IA integra la API de Instagram Graph de Meta Platforms para permitir a los Usuarios gestionar mensajes directos y respuestas automatizadas." : "11.1. Agent IA integrates the Meta Platforms Instagram Graph API to allow Users to manage direct messages and automated responses."}</p>
<p>${isES ? "11.2. Datos recopilados a través de Instagram: información del perfil de Instagram Business del Usuario (nombre de usuario, ID de cuenta), mensajes directos (DMs) recibidos y enviados, datos de interacción de los seguidores, tokens de acceso OAuth, y contenido multimedia compartido en conversaciones." : "11.2. Data collected through Instagram: User's Instagram Business profile info (username, account ID), direct messages (DMs) received and sent, follower interaction data, OAuth access tokens, and multimedia content shared in conversations."}</p>
<p>${isES ? "11.3. Uso de los datos de Instagram: procesamiento y respuesta automatizada de mensajes directos mediante el Agente de IA, gestión centralizada de conversaciones junto con otros canales, y análisis de interacciones para mejorar la atención al cliente." : "11.3. Instagram data use: automated DM processing and response via AI Agent, centralized conversation management with other channels, and interaction analysis to improve customer service."}</p>
<p>${isES ? "11.4. Los datos de Instagram se almacenan con encriptación en tránsito y en reposo. Los tokens de acceso se almacenan de forma encriptada y se renuevan automáticamente. Los datos se retienen conforme a la sección 9 de esta Política." : "11.4. Instagram data is stored with encryption in transit and at rest. Access tokens are stored encrypted and auto-renewed. Data is retained per section 9 of this Policy."}</p>
<p>${isES ? "11.5. El Usuario puede desconectar su cuenta de Instagram en cualquier momento desde la configuración de la Plataforma. Al desconectar, los tokens se eliminan inmediatamente." : "11.5. The User can disconnect their Instagram account at any time from Platform settings. Upon disconnection, tokens are immediately deleted."}</p>
<p>${isES ? "11.6. Agent IA cumple con la Política de la Plataforma de Meta para Instagram y las directrices de la API de Instagram Graph. Agent IA no vende, comparte ni utiliza los datos de Instagram para fines distintos a los descritos en esta Política." : "11.6. Agent IA complies with Meta's Instagram Platform Policy and Instagram Graph API guidelines. Agent IA does not sell, share, or use Instagram data for purposes other than those described in this Policy."}</p>

<h2>12. ${isES ? "INTEGRACIÓN CON FACEBOOK MESSENGER (META)" : "FACEBOOK MESSENGER (META) INTEGRATION"}</h2>
<p>${isES ? "12.1. Agent IA integra la API de Messenger Platform de Meta Platforms para permitir a los Usuarios gestionar mensajes de su Página de Facebook y automatizar respuestas." : "12.1. Agent IA integrates Meta Platforms' Messenger Platform API to allow Users to manage messages from their Facebook Page and automate responses."}</p>
<p>${isES ? "12.2. Datos recopilados a través de Messenger: información del perfil de la Página de Facebook del Usuario (nombre de página, ID de página), mensajes recibidos y enviados a través de Messenger, datos de interacción de los usuarios que envían mensajes a la Página, tokens de acceso OAuth, y contenido multimedia compartido en conversaciones." : "12.2. Data collected through Messenger: User's Facebook Page profile info (page name, page ID), messages received and sent through Messenger, user interaction data from people messaging the Page, OAuth access tokens, and multimedia content shared in conversations."}</p>
<p>${isES ? "12.3. Uso de los datos de Messenger: procesamiento y respuesta automatizada de mensajes mediante el Agente de IA, gestión centralizada de conversaciones junto con otros canales (WhatsApp, Instagram, TikTok), y análisis de interacciones para mejorar la atención al cliente." : "12.3. Messenger data use: automated message processing and response via AI Agent, centralized conversation management with other channels (WhatsApp, Instagram, TikTok), and interaction analysis to improve customer service."}</p>
<p>${isES ? "12.4. Los datos de Messenger se almacenan con encriptación en tránsito y en reposo. Los tokens de acceso se almacenan de forma encriptada y se renuevan automáticamente. Los datos se retienen conforme a la sección 9 de esta Política." : "12.4. Messenger data is stored with encryption in transit and at rest. Access tokens are stored encrypted and auto-renewed. Data is retained per section 9 of this Policy."}</p>
<p>${isES ? "12.5. El Usuario puede desconectar su Página de Facebook de la integración con Messenger en cualquier momento desde la configuración de la Plataforma. Al desconectar, los tokens se eliminan inmediatamente." : "12.5. The User can disconnect their Facebook Page from the Messenger integration at any time from Platform settings. Upon disconnection, tokens are immediately deleted."}</p>
<p>${isES ? "12.6. Agent IA cumple con la Política de la Plataforma de Meta y las directrices de Messenger Platform. Agent IA no vende, comparte ni utiliza los datos de Messenger para fines distintos a los descritos en esta Política." : "12.6. Agent IA complies with Meta's Platform Policy and Messenger Platform guidelines. Agent IA does not sell, share, or use Messenger data for purposes other than those described in this Policy."}</p>

<h2>13. ${isES ? "INTEGRACIÓN CON GOOGLE" : "GOOGLE INTEGRATION"}</h2>
<p>${isES ? "13.1. En caso de integraciones con servicios de Google (Google Business Profile, Google Analytics, u otros), Agent IA podrá recopilar: información del perfil de Google Business del Usuario, datos de interacción con clientes a través de Google Business Messages, métricas y datos analíticos (cuando el Usuario autorice la integración con Google Analytics), y tokens de acceso OAuth." : "12.1. For integrations with Google services (Google Business Profile, Google Analytics, or others), Agent IA may collect: User's Google Business profile info, client interaction data through Google Business Messages, metrics and analytics data (when User authorizes Google Analytics integration), and OAuth access tokens."}</p>
<p>${isES ? "13.2. Uso de los datos de Google: gestión de comunicaciones con clientes a través de los canales de Google, análisis de rendimiento e interacción, y mejora de la atención al cliente automatizada." : "12.2. Google data use: client communication management through Google channels, performance and interaction analysis, and automated customer service improvement."}</p>
<p>${isES ? "13.3. Los datos se almacenan con los mismos estándares de seguridad aplicados a todas las integraciones. El Usuario puede revocar el acceso en cualquier momento." : "12.3. Data is stored with the same security standards applied to all integrations. The User may revoke access at any time."}</p>
<p>${isES ? "13.4. Agent IA cumple con la Política de Datos de Google para Desarrolladores y los Requisitos de Verificación de APIs de Google." : "12.4. Agent IA complies with Google's Developer Data Policy and Google API Verification Requirements."}</p>

<h2>14. ${isES ? "INTEGRACIÓN CON WORDPRESS" : "WORDPRESS INTEGRATION"}</h2>
<p>${isES ? "14.1. Agent IA ofrece un widget de chat inteligente para sitios WordPress. Los datos recopilados incluyen: información del visitante del sitio web que interactúa con el chat (dirección IP anonimizada, datos de navegación), contenido de las conversaciones del chat, datos proporcionados voluntariamente por el visitante (nombre, email, teléfono, consultas), y metadatos de la sesión de chat." : "13.1. Agent IA offers an intelligent chat widget for WordPress sites. Data collected includes: website visitor info interacting with chat (anonymized IP address, browsing data), chat conversation content, voluntarily provided visitor data (name, email, phone, queries), and chat session metadata."}</p>
<p>${isES ? "14.2. Uso de los datos de WordPress: funcionamiento del chat inteligente con IA, captura de leads y datos de contacto, y análisis de interacciones para mejorar la experiencia del usuario." : "13.2. WordPress data use: AI-powered intelligent chat operation, lead and contact data capture, and interaction analysis to improve user experience."}</p>
<p>${isES ? "14.3. El Usuario que integre el widget de chat en su sitio WordPress es Responsable del Tratamiento de los datos de los visitantes de su sitio. El Usuario debe: informar a los visitantes sobre el uso de IA en el chat, obtener el consentimiento necesario según la legislación aplicable, incluir la información del tratamiento en su política de privacidad, y cumplir con la normatividad de cookies aplicable." : "13.3. The User integrating the chat widget on their WordPress site is the Data Controller for site visitor data. The User must: inform visitors about AI use in chat, obtain necessary consent per applicable legislation, include processing information in their privacy policy, and comply with applicable cookie regulations."}</p>
<p>${isES ? "14.4. Agent IA actúa como Encargado del Tratamiento para los datos recopilados a través del widget de WordPress." : "13.4. Agent IA acts as Data Processor for data collected through the WordPress widget."}</p>

<h2>15. ${isES ? "EVALUACIÓN DE IMPACTO Y REGISTROS" : "IMPACT ASSESSMENT AND RECORDS"}</h2>
<p>${isES ? "15.1. Agent IA mantiene un registro actualizado de las bases de datos conforme a la Circular Externa 002 de 2015 de la Superintendencia de Industria y Comercio y el Registro Nacional de Bases de Datos (RNBD)." : "14.1. Agent IA maintains an updated database registry per External Circular 002 of 2015 of the Superintendence of Industry and Commerce and the National Database Registry (RNBD)."}</p>
<p>${isES ? "15.2. Agent IA realiza evaluaciones periódicas de impacto en la protección de datos para las actividades de tratamiento que impliquen riesgos significativos para los derechos y libertades de los titulares." : "14.2. Agent IA performs periodic data protection impact assessments for processing activities that involve significant risks to data subjects' rights and freedoms."}</p>
<p>${isES ? "15.3. Agent IA implementa el principio de responsabilidad demostrada (accountability) conforme al Decreto 1377 de 2013, manteniendo evidencia de las medidas adoptadas para garantizar el cumplimiento de la normatividad de protección de datos." : "14.3. Agent IA implements the demonstrated accountability principle per Decree 1377 of 2013, maintaining evidence of measures adopted to ensure data protection compliance."}</p>

<h2>16. ${isES ? "COOKIES Y TECNOLOGÍAS DE SEGUIMIENTO" : "COOKIES AND TRACKING TECHNOLOGIES"}</h2>
<p>${isES ? "La plataforma utiliza cookies para mejorar la experiencia del usuario. El Usuario puede configurar su navegador para rechazar cookies (puede afectar la funcionalidad)." : "The platform uses cookies to improve user experience. The User may configure their browser to reject cookies (may affect functionality)."}</p>

<h2>17. ${isES ? "TRATAMIENTO DE DATOS DE MENORES" : "MINOR DATA PROCESSING"}</h2>
<p>${isES ? "Los servicios son exclusivos para adultos. Agent IA no recopila intencionalmente datos de menores. Eliminación inmediata si se detectan datos de menores sin autorización del representante legal." : "Services are exclusive to adults. Agent IA does not intentionally collect minor data. Immediate deletion if minor data is detected without legal representative authorization."}</p>

<h2>18. ${isES ? "INCIDENTES DE SEGURIDAD" : "SECURITY INCIDENTS"}</h2>
<p>${isES ? "Se notifica a la SIC dentro de los 15 días hábiles siguientes al conocimiento del incidente. Se informa a los afectados si el incidente presenta riesgo significativo a sus derechos. Se documenta el incidente, efectos y medidas correctivas." : "The SIC is notified within 15 business days of incident knowledge. Affected individuals are informed if the incident poses significant risk to their rights. The incident, effects, and corrective measures are documented."}</p>

<h2>19. ${isES ? "MODIFICACIONES A LA POLÍTICA" : "POLICY MODIFICATIONS"}</h2>
<p>${isES ? "Agent IA puede modificar esta política en cualquier momento. Las modificaciones se notifican por email o aviso en la plataforma. El uso continuado del servicio implica aceptación de las modificaciones." : "Agent IA may modify this policy at any time. Modifications are notified by email or platform notice. Continued service use implies acceptance of modifications."}</p>

<h2>20. ${isES ? "AUTORIDAD DE SUPERVISIÓN" : "SUPERVISORY AUTHORITY"}</h2>
<ul>
  <li><strong>${isES ? "Superintendencia de Industria y Comercio (SIC)" : "Superintendence of Industry and Commerce (SIC)"}</strong></li>
  <li>${isES ? "Dirección: Carrera 13 No. 27-00, Bogotá D.C., Colombia" : "Address: Carrera 13 No. 27-00, Bogotá D.C., Colombia"}</li>
  <li>${isES ? "Línea gratuita: 01 8000 910 165" : "Toll-free: 01 8000 910 165"}</li>
  <li>Website: www.sic.gov.co</li>
</ul>

<h2>21. ${isES ? "CONTACTO" : "CONTACT"}</h2>
<ul>
  <li><strong>${isES ? "Oficial de Protección de Datos:" : "Data Protection Officer:"}</strong> AGENT IA SAS</li>
  <li><strong>Email:</strong> notificaciones@induretros.com</li>
  <li><strong>${isES ? "Notificaciones:" : "Notifications:"}</strong> notificaciones@soyagentia.com</li>
  <li><strong>Email ${isES ? "general:" : "general:"}</strong> contacto@soyagentia.com</li>
  <li><strong>Website:</strong> www.soyagentia.com</li>
</ul>`;

    const html = `<!DOCTYPE html>
<html lang="${isES ? "es" : "en"}">
<head>
<meta charset="UTF-8"/>
<title>${isES ? "Contrato de Partner - SoyAgentia" : "Partner Agreement - SoyAgentia"}</title>
<style>${styles}</style>
</head>
<body>
<div class="no-print" style="position:fixed;top:0;left:0;right:0;background:linear-gradient(135deg,#0f172a,#1e293b);color:white;padding:12px 24px;display:flex;align-items:center;z-index:100;gap:12px;box-shadow:0 2px 8px rgba(0,0,0,0.3);">
  <img src="${logoUrl}" alt="SoyAgentia" style="height:28px;" />
  <span style="flex:1;font-weight:600;font-size:14px;">${isES ? "Contrato de Partner + Anexos" : "Partner Agreement + Annexes"}</span>
  <span style="font-size:11px;color:#94a3b8;margin-right:8px;">${docRef}</span>
  <button onclick="window.print()" style="background:#16a34a;color:white;border:none;padding:10px 24px;border-radius:6px;cursor:pointer;font-weight:700;font-size:13px;letter-spacing:0.3px;">
    ${isES ? "Imprimir / Guardar PDF" : "Print / Save PDF"}
  </button>
</div>
<div class="print-page">
${contractBody}

<div class="footer-note">
  <p><strong>SoyAgentia</strong> — ${isES ? "Programa de Partners" : "Partner Program"} | www.soyagentia.com</p>
  <p>${isES ? "Este documento incluye el Contrato de Vinculación, Anexo A (Términos y Condiciones) y Anexo B (Política de Privacidad)." : "This document includes the Partnership Agreement, Annex A (Terms and Conditions), and Annex B (Privacy Policy)."}</p>
  <p style="margin-top:0.3em; font-size:7pt; color:#cbd5e1;">${isES ? "Ref:" : "Ref:"} ${docRef}</p>
</div>

<!-- ANEXO A -->
${annexA}

<!-- ANEXO B -->
${annexB}

<div class="footer-note">
  <p><strong>${isES ? "— Fin del documento —" : "— End of document —"}</strong></p>
  <p>${isES ? "Contrato de Vinculación + Anexo A (Términos y Condiciones) + Anexo B (Política de Privacidad)" : "Partnership Agreement + Annex A (Terms and Conditions) + Annex B (Privacy Policy)"}</p>
  <p style="margin-top:0.3em;">AGENT IA SAS — NIT: 901.976.734-4 — www.soyagentia.com — contacto@soyagentia.com</p>
  <p style="margin-top:0.3em; font-size:7pt; color:#cbd5e1;">${isES ? "Ref:" : "Ref:"} ${docRef} | ${isES ? "Versión" : "Version"}: 2.0 | ${isES ? "Vigente desde" : "Effective from"}: ${dateStr}</p>
</div>

</div>
</body>
</html>`;

    w.document.write(html);
    w.document.close();
  };

  return (
    <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="p-8 md:p-10 text-center">
            <div className="p-4 rounded-2xl bg-primary/10 w-fit mx-auto mb-5">
              <FileText className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              {language === "es" ? "Contrato de Vinculación" : "Partnership Agreement"}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-2">
              {language === "es"
                ? "Descarga el contrato oficial del Programa de Partners con todos los anexos incluidos."
                : "Download the official Partner Program agreement with all annexes included."}
            </p>
            <p className="text-xs text-muted-foreground max-w-lg mx-auto mb-6">
              {language === "es"
                ? "Incluye: Contrato de Vinculación + Anexo A (Términos y Condiciones) + Anexo B (Política de Privacidad)"
                : "Includes: Partnership Agreement + Annex A (Terms & Conditions) + Annex B (Privacy Policy)"}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="hero" size="xl" onClick={openContract}>
                <FileDown className="w-5 h-5 mr-2" />
                {language === "es" ? "Descargar Contrato" : "Download Agreement"}
              </Button>
              <Button variant="outline" size="xl" onClick={openContract}>
                <Printer className="w-5 h-5 mr-2" />
                {language === "es" ? "Imprimir Contrato" : "Print Agreement"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              {language === "es"
                ? "El contrato se abrirá en una nueva ventana. Desde allí podrás imprimirlo o guardarlo como PDF."
                : "The agreement will open in a new window. From there you can print it or save it as PDF."}
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default PartnerContractDownload;
