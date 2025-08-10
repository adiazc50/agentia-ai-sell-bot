// scripts/generate-city-pages.cjs
// Genera 31 landings por ciudad + sitemap/robots
// DEV: /public con <script src="/src/main.tsx">
// PROD: si hay manifest en dist/ o dist/.vite/, escribe en /dist usando /assets/*.js y /assets/*.css

const fs = require("fs");
const fsp = fs.promises;
const path = require("path");

const BASE_URL = "https://soyagentia.com";
const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const DIST_DIR = path.join(ROOT, "dist");

const MANIFEST_CANDIDATES = [
  path.join(DIST_DIR, "manifest.json"),
  path.join(DIST_DIR, ".vite", "manifest.json"),
];
const MANIFEST_PATH = MANIFEST_CANDIDATES.find((p) => fs.existsSync(p)) || null;
const HAS_MANIFEST = !!MANIFEST_PATH;

const OUT_BASE = HAS_MANIFEST
  ? path.join(DIST_DIR, "ciudades")
  : path.join(PUBLIC_DIR, "ciudades");

// 30 capitales CO + Ciudad de Panamá
const CITIES = [
  { slug: "medellin", name: "Medellín", country: "CO", locale: "es-CO" },
  { slug: "bogota", name: "Bogotá", country: "CO", locale: "es-CO" },
  { slug: "cali", name: "Cali", country: "CO", locale: "es-CO" },
  { slug: "barranquilla", name: "Barranquilla", country: "CO", locale: "es-CO" },
  { slug: "cartagena", name: "Cartagena", country: "CO", locale: "es-CO" },
  { slug: "bucaramanga", name: "Bucaramanga", country: "CO", locale: "es-CO" },
  { slug: "cucuta", name: "Cúcuta", country: "CO", locale: "es-CO" },
  { slug: "pereira", name: "Pereira", country: "CO", locale: "es-CO" },
  { slug: "manizales", name: "Manizales", country: "CO", locale: "es-CO" },
  { slug: "armenia", name: "Armenia", country: "CO", locale: "es-CO" },
  { slug: "ibague", name: "Ibagué", country: "CO", locale: "es-CO" },
  { slug: "pasto", name: "Pasto", country: "CO", locale: "es-CO" },
  { slug: "monteria", name: "Montería", country: "CO", locale: "es-CO" },
  { slug: "neiva", name: "Neiva", country: "CO", locale: "es-CO" },
  { slug: "villavicencio", name: "Villavicencio", country: "CO", locale: "es-CO" },
  { slug: "popayan", name: "Popayán", country: "CO", locale: "es-CO" },
  { slug: "sincelejo", name: "Sincelejo", country: "CO", locale: "es-CO" },
  { slug: "tunja", name: "Tunja", country: "CO", locale: "es-CO" },
  { slug: "yopal", name: "Yopal", country: "CO", locale: "es-CO" },
  { slug: "riohacha", name: "Riohacha", country: "CO", locale: "es-CO" },
  { slug: "quibdo", name: "Quibdó", country: "CO", locale: "es-CO" },
  { slug: "florencia", name: "Florencia", country: "CO", locale: "es-CO" },
  { slug: "mocoa", name: "Mocoa", country: "CO", locale: "es-CO" },
  { slug: "mitu", name: "Mitú", country: "CO", locale: "es-CO" },
  { slug: "san-andres", name: "San Andrés", country: "CO", locale: "es-CO" },
  { slug: "leticia", name: "Leticia", country: "CO", locale: "es-CO" },
  { slug: "inirida", name: "Inírida", country: "CO", locale: "es-CO" },
  { slug: "puerto-carreno", name: "Puerto Carreño", country: "CO", locale: "es-CO" },
  { slug: "valledupar", name: "Valledupar", country: "CO", locale: "es-CO" },
  { slug: "santa-marta", name: "Santa Marta", country: "CO", locale: "es-CO" },
  { slug: "ciudad-de-panama", name: "Ciudad de Panamá", country: "PA", locale: "es-PA" },
];

// ---------- Helpers ----------
const esc = (s) =>
  String(s).replace(/&/g, "&amp;")
           .replace(/</g, "&lt;")
           .replace(/>/g, "&gt;")
           .replace(/"/g, "&quot;");

function getNearby(slug, n = 3) {
  const idx = CITIES.findIndex((c) => c.slug === slug);
  if (idx === -1) return [];
  const out = [];
  for (let i = 1; i <= n; i++) out.push(CITIES[(idx + i) % CITIES.length]);
  return out;
}

function getAssetTags() {
  if (HAS_MANIFEST && MANIFEST_PATH) {
    const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
    const entry =
      Object.values(manifest).find((e) => e && e.isEntry) ||
      manifest["src/main.tsx"] ||
      manifest["src/main.ts"] ||
      null;

    if (entry && entry.file) {
      const cssLinks = (entry.css || [])
        .map((href) => `<link rel="stylesheet" href="/${href}">`)
        .join("\n");
      const scriptTag = `<script type="module" src="/${entry.file}"></script>`;
      return { cssLinks, scriptTag };
    }
  }
  return { cssLinks: "", scriptTag: `<script type="module" src="/src/main.tsx"></script>` };
}

// ---------- Contenido largo por ciudad (visible + colapsable) ----------
const LONG_CONTENT = {
  medellin: `
    <h1>Agentes de IA y automatización de ventas en Medellín</h1>
    <p><strong>¿Buscas una empresa de agentes de IA en Medellín</strong> que impulse tu adquisición y atención 24/7?
    En SoyAgentia diseñamos e implementamos <em>agentes conversacionales</em> que prospectan, califican y venden por voz y chat,
    se integran a WhatsApp y a tu web, y se conectan con CRM/ERP para automatizar seguimiento, agendamiento y postventa.</p>

    <h2>Lo que resolvemos</h2>
    <ul>
      <li>Prospección y ventas 24/7: captura leads, calificación automática y traspaso a tu equipo comercial.</li>
      <li>Atención al cliente omnicanal: WhatsApp, web, Instagram y Facebook con respuestas consistentes.</li>
      <li>Agendamiento y recordatorios: citas, demos y seguimiento sin intervención humana.</li>
      <li>Recuperación de cartera: flujos personalizados por segmento y comportamiento.</li>
    </ul>

    <h2>Cómo trabajamos</h2>
    <ol>
      <li><strong>Diagnóstico express:</strong> objetivos de ventas y procesos clave.</li>
      <li><strong>Diseño del agente:</strong> prompts, flujos, tono de marca y compliance.</li>
      <li><strong>Integración:</strong> WhatsApp Business API, web widget, CRM/ERP, VoIP.</li>
      <li><strong>Optimización continua:</strong> reportes, A/B de mensajes y mejora de conversión.</li>
    </ol>

    <h2>Integraciones y sectores</h2>
    <p>Conectamos con HubSpot, Zoho, Salesforce, Pipedrive, SAP/ERP, pasarelas de pago y telefonía.
    En Medellín impactamos <strong>inmobiliario, salud, educación, retail/ecommerce, turismo</strong> y servicios B2B.</p>

    <h2>Beneficios medibles</h2>
    <ul>
      <li>Más leads contactados en menos tiempo (voz y chat en paralelo).</li>
      <li>Respuesta inmediata 24/7 y consistencia de marca.</li>
      <li>Menos costos operativos y más cierres por seguimiento oportuno.</li>
      <li>Visibilidad: analítica y trazabilidad de cada conversación.</li>
    </ul>

    <p>¿Listo para tener un robot vendiendo por ti en Medellín?
    <a href="https://wa.me/573009006005" target="_blank" rel="noopener">Hablemos por WhatsApp</a>.</p>
  `,
  bogota: `
    <h1>Agentes de IA en Bogotá para ventas y servicio al cliente 24/7</h1>
    <p><strong>Si tu empresa en Bogotá</strong> necesita escalar contacto comercial y soporte sin aumentar costo fijo,
    nuestros <em>agentes de IA</em> atienden múltiples canales, hablan por voz y chat, califican oportunidades y
    alimentan tu CRM con datos limpios para que tu equipo solo invierta tiempo en leads con intención.</p>

    <h2>Qué hacemos diferente</h2>
    <ul>
      <li><strong>Ventas asistidas por IA:</strong> guiones conversacionales que manejan objeciones y cierran citas.</li>
      <li><strong>Omnicanal real:</strong> WhatsApp, web, redes y telefonía integrados.</li>
      <li><strong>Orquestación:</strong> routing a ejecutivos, CRMs y calendarios en tiempo real.</li>
      <li><strong>Cumplimiento:</strong> políticas de privacidad, auditoría y registros.</li>
    </ul>

    <h2>Casos frecuentes en Bogotá</h2>
    <ul>
      <li>B2B y servicios profesionales multisede.</li>
      <li>Inmobiliarias y constructoras con alto volumen de leads digitales.</li>
      <li>Educación (colegios/universidades) y salud (agendamiento clínico).</li>
      <li>BPO/call centers que necesitan IA de primer nivel para contención.</li>
    </ul>

    <h2>Integraciones</h2>
    <p>HubSpot, Salesforce, Zoho, Pipedrive, SAP/ERP, VoIP (SIP), formularios y pasarela de pagos.
    Reportes por cohorte, fuente de tráfico y canal de cierre.</p>

    <h2>Por qué SoyAgentia</h2>
    <ul>
      <li>Implementación ágil y acompañamiento continuo.</li>
      <li>Optimización de prompts y entrenamiento por sector.</li>
      <li>Datos centralizados para marketing y ventas.</li>
    </ul>

    <p>¿Quieres aumentar la velocidad de respuesta y conversión en Bogotá?
    <a href="https://wa.me/573009006005" target="_blank" rel="noopener">Escríbenos</a> y te mostramos un piloto.</p>
  `,
  cali: `
    <h1>Agentes de IA en Cali para captación y fidelización de clientes</h1>
    <p>En Cali, los <strong>agentes de IA</strong> de SoyAgentia automatizan ventas, soporte y cobros,
    conectando canales digitales con tu operación en planta o tienda. Responden de inmediato, priorizan oportunidades
    y mantienen conversaciones consistentes con tu marca.</p>

    <h2>Soluciones clave</h2>
    <ul>
      <li><strong>Prospección 24/7:</strong> respuesta en WhatsApp y web con calificación automática.</li>
      <li><strong>Atención y postventa:</strong> dudas, garantías, tracking y NPS sin fricción.</li>
      <li><strong>Cartera:</strong> recordatorios inteligentes y acuerdos de pago con seguimiento.</li>
      <li><strong>Marketing:</strong> campañas conversacionales y remarketing con datos reales.</li>
    </ul>

    <h2>Integraciones y sectores</h2>
    <p>HubSpot, Zoho, Pipedrive, SAP/ERP, VoIP. Impacto especial en <strong>retail/ecommerce, salud,
    educación, turismo y servicios B2B</strong> del Valle del Cauca.</p>

    <h2>Resultados</h2>
    <ul>
      <li>Mayor contacto efectivo y menos tiempos muertos.</li>
      <li>Mejor experiencia de cliente y tasa de re-compra.</li>
      <li>Costos controlados con cobertura 24/7.</li>
    </ul>

    <p>Activa hoy un agente de IA en Cali:
    <a href="https://wa.me/573009006005" target="_blank" rel="noopener">agenda una demo</a>.</p>
  `,
};

// ---------- HEAD ----------
function makeHead(city, extraCssLinks = "") {
  const brand = "SoyAgentia";
  const cityName = city.name;
  const canonical = `${BASE_URL}/ciudades/${city.slug}/`;
  const title = `Agentes de IA en ${cityName} | Automatización y Ventas 24/7 - ${brand}`;
  const description = `Agentes de IA en ${cityName}: ventas 24/7, atención al cliente y automatización de procesos con integración a WhatsApp, web y CRM. Despliegue ágil y soporte continuo.`;

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: brand,
    url: canonical,
    image: `${BASE_URL}/og-image-soyagentia.jpg`,
    address: { "@type": "PostalAddress", addressLocality: cityName, addressCountry: city.country },
    areaServed: { "@type": "City", name: cityName },
    telephone: "+57-300-900-6005",
    sameAs: ["https://wa.me/573009006005"],
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: BASE_URL + "/" },
      { "@type": "ListItem", position: 2, name: "Ciudades", item: `${BASE_URL}/ciudades/` },
      { "@type": "ListItem", position: 3, name: `Agentes de IA en ${cityName}`, item: canonical },
    ],
  };

  // hreflang: solo autorreferencia + x-default (evitamos alternates falsos)
  const hrefLangSelf = `<link rel="alternate" hreflang="${city.locale}" href="${esc(canonical)}" />`;
  const hrefLangDefault = `<link rel="alternate" hreflang="x-default" href="${esc(canonical)}" />`;

  return `
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large" />
    <link rel="canonical" href="${esc(canonical)}" />
    ${hrefLangSelf}
    ${hrefLangDefault}

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${esc(canonical)}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:image" content="${BASE_URL}/og-image-soyagentia.jpg?city=${encodeURIComponent(city.slug)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="${brand}" />
    <meta property="og:locale" content="${city.locale.replace('-', '_')}" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <meta name="twitter:image" content="${BASE_URL}/og-image-soyagentia.jpg?city=${encodeURIComponent(city.slug)}" />

    <!-- Dublin Core -->
    <meta name="DC.title" content="${esc(title)}" />
    <meta name="DC.description" content="${esc(description)}" />
    <meta name="DC.identifier" content="${esc(canonical)}" />
    <meta name="DC.language" content="${city.locale}" />

    <!-- JSON-LD -->
    <script type="application/ld+json">${JSON.stringify(localBusiness)}</script>
    <script type="application/ld+json">${JSON.stringify(breadcrumbs)}</script>

    ${extraCssLinks}
  `;
}

// ---------- BODY (con bloque SEO visible + acordeón) ----------
function makeBody(city, scriptTag = "") {
  const cityName = city.name;
  const nearby = getNearby(city.slug, 3);

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `¿Implementan Agentes de IA en ${cityName} y cuál es el tiempo de despliegue?`,
        acceptedAnswer: {
          "@type": "Answer",
          text:
            `Sí, implementamos Agentes de IA en ${cityName}. El despliegue es ágil, con integración a WhatsApp, web y CRM, pruebas y puesta en producción en pocos días.`,
        },
      },
      {
        "@type": "Question",
        name: "¿Qué procesos puedo automatizar con sus agentes?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Ventas y prospección 24/7 (voz y chat), atención multicanal, agendamiento y recordatorios, " +
            "recuperación de cartera, encuestas calificadoras y flujos con ERP/CRM.",
        },
      },
      {
        "@type": "Question",
        name: "¿Ofrecen soporte y mejora continua?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Sí. Realizamos monitoreo, optimización de prompts y entrenamiento continuo para mantener conversión y calidad.",
        },
      },
    ],
  };

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Agentes de IA y Automatización de Ventas",
    areaServed: { "@type": "City", name: cityName },
    provider: { "@type": "Organization", name: "SoyAgentia", url: BASE_URL },
  };

  const nearbyHTML = nearby
    .map(n => `<a href="/ciudades/${n.slug}/" style="text-decoration:underline">Agentes de IA en ${esc(n.name)}</a>`)
    .join(" • ");

  const longHTML = LONG_CONTENT[city.slug] || `
    <h2>Agentes de IA en ${esc(cityName)}</h2>
    <p>Implementamos agentes conversacionales para ventas, soporte y postventa en ${esc(cityName)} con integración a WhatsApp, web y CRM.</p>
  `;

  return `
  <body>
    <!-- H1 de respaldo para analizadores que no ejecutan JS (se elimina al cargar). -->
    <h1 id="preload-h1-city"
        style="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;">
      Agentes de IA en ${esc(cityName)} | Automatización y Ventas 24/7
    </h1>

    <div id="root"></div>

    <!-- Card SEO (colapsable) que reubicamos justo sobre la sección “Ciudades” -->
    <section id="city-seo"
      style="
        opacity:0;height:0;overflow:hidden;
        max-width:1200px;margin:2rem auto;padding:0;
        border:1px solid var(--border, #e5e7eb);
        border-radius:16px;background:var(--card, #fff);
        box-shadow:0 8px 24px rgba(0,0,0,.06);
      "
      aria-label="Información SEO por ciudad"
    >
      <div style="display:flex;align-items:center;justify-content:space-between;gap:.75rem;padding:1rem 1.25rem;border-bottom:1px solid var(--border,#e5e7eb)">
        <div style="display:flex;align-items:center;gap:.75rem;">
          <span style="
            display:inline-flex;align-items:center;justify-content:center;
            width:36px;height:36px;border-radius:9999px;
            background:linear-gradient(135deg,var(--accent,#06b6d4),var(--primary,#111827));
            color:#fff;font-weight:700;">IA</span>
          <h2 style="margin:0;font-size:1.125rem;color:var(--foreground,#111827);">
            Agentes de IA en ${esc(cityName)} — cómo trabajamos
          </h2>
        </div>
        <button id="city-seo-toggle"
          style="
            border:none;border-radius:9999px;padding:.5rem .9rem;
            background:var(--primary,#111827);color:#fff;cursor:pointer;
            font-weight:600;
          ">
          Leer más
        </button>
      </div>

      <div id="city-seo-content" style="display:none;padding:1rem 1.25rem;color:var(--foreground,#111827);">
        <div style="line-height:1.7">
          ${longHTML}
        </div>

        <div style="margin-top:1rem;color:var(--muted-foreground,#6b7280);font-size:.95rem;">
          Ciudades cercanas: ${nearbyHTML} •
          <a href="/ciudades/" style="text-decoration:underline">Ver todas</a>
        </div>
      </div>
    </section>

    <script>
      (function () {
        // 1) Eliminar el H1 placeholder para no duplicar con el H1 del Hero de la SPA
        document.addEventListener('DOMContentLoaded', function(){
          var ph = document.getElementById('preload-h1-city');
          if (ph) ph.remove();
        });

        // 2) Reubicar el card justo encima de la sección “Ciudades” (ancla #city-seo-anchor en la SPA)
        var card = document.getElementById('city-seo');
        var content = document.getElementById('city-seo-content');
        var btn = document.getElementById('city-seo-toggle');

        function place() {
          var anchor = document.getElementById('city-seo-anchor');
          if (anchor && card) {
            anchor.appendChild(card);
            card.style.opacity = '1';
            card.style.height = 'auto';
            card.style.overflow = 'visible';
            return true;
          }
          return false;
        }

        var tries = 0;
        (function waitAnchor(){
          if (!place() && tries < 80) {
            tries++; setTimeout(waitAnchor, 150);
          } else if (!place()) {
            card.style.opacity = '1';
            card.style.height = 'auto';
            card.style.overflow = 'visible';
          }
        })();

        if (btn && content) {
          btn.addEventListener('click', function(){
            var open = content.style.display !== 'none';
            content.style.display = open ? 'none' : 'block';
            btn.textContent = open ? 'Leer más' : 'Ocultar';
          });
        }
      })();
    </script>

    ${scriptTag}
    <script type="application/ld+json">${JSON.stringify(faq)}</script>
    <script type="application/ld+json">${JSON.stringify(service)}</script>

    <noscript>
      <main style="max-width:960px;margin:0 auto;padding:2rem;font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,Arial;">
        <h1 style="font-size:2rem;font-weight:800;margin-bottom:.75rem;">Agentes de IA en ${esc(cityName)}</h1>
        <p>Esta página requiere JavaScript para mostrar la versión completa. Visita el hub de ciudades o contáctanos por WhatsApp.</p>
        <p style="margin-top:.75rem;">
          <a href="/ciudades/" style="text-decoration:underline;">Ver todas las ciudades</a> ·
          <a href="https://wa.me/573009006005" style="text-decoration:underline;">WhatsApp</a>
        </p>
      </main>
    </noscript>
  </body>`;
}

function makeHtml(city) {
  const { cssLinks, scriptTag } = getAssetTags();
  return `<!DOCTYPE html>
<html lang="es">
<head>
${makeHead(city, cssLinks)}
</head>
${makeBody(city, scriptTag)}
</html>`;
}

// ---------- Escritura ----------
async function ensureDir(dir) { await fsp.mkdir(dir, { recursive: true }); }

async function writeCity(city) {
  const dir = path.join(OUT_BASE, city.slug);
  await ensureDir(dir);
  await fsp.writeFile(path.join(dir, "index.html"), makeHtml(city), "utf8");
}

function todayISO() { return new Date().toISOString().slice(0, 10); }

function buildSitemap(urls) {
  const lastmod = todayISO();
  const items = urls.map((u) => `  <url>
    <loc>${esc(u)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${u === BASE_URL + "/" ? "0.90" : "0.80"}</priority>
  </url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>`;
}

async function writeSitemapAndRobots() {
  const urls = [BASE_URL + "/", ...CITIES.map((c) => `${BASE_URL}/ciudades/${c.slug}/`)];
  await fsp.writeFile(path.join(PUBLIC_DIR, "sitemap.xml"), buildSitemap(urls), "utf8");
  await fsp.writeFile(
    path.join(PUBLIC_DIR, "robots.txt"),
    `User-agent: *
Allow: /
Sitemap: ${BASE_URL}/sitemap.xml
`,
    "utf8"
  );
}

async function writeIndexHub() {
  const hubDir = OUT_BASE;
  await ensureDir(hubDir);
  const { cssLinks, scriptTag } = getAssetTags();

  const collection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Agentes de IA por ciudad",
    url: `${BASE_URL}/ciudades/`,
  };
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: BASE_URL + "/" },
      { "@type": "ListItem", position: 2, name: "Ciudades", item: `${BASE_URL}/ciudades/` },
    ],
  };

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Agentes de IA por ciudad | SoyAgentia</title>
  <meta name="description" content="Cobertura nacional de Agentes de IA en Colombia y Ciudad de Panamá. Encuentra tu ciudad y automatiza ventas y soporte 24/7.">
  <meta name="robots" content="index,follow,max-image-preview:large" />
  <link rel="canonical" href="${BASE_URL}/ciudades/">
  <!-- hreflang autorreferente + x-default -->
  <link rel="alternate" href="${BASE_URL}/ciudades/" hreflang="es-co" />
  <link rel="alternate" href="${BASE_URL}/ciudades/" hreflang="es" />
  <link rel="alternate" href="${BASE_URL}/ciudades/" hreflang="x-default" />
  ${cssLinks}
  <script type="application/ld+json">${JSON.stringify(collection)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbs)}</script>
</head>
<body>
  <!-- H1 de respaldo (se elimina al cargar) -->
  <h1 id="preload-h1-ciudades" style="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;">
    Agentes de IA por ciudad en Colombia y Ciudad de Panamá
  </h1>
  <div id="root"></div>
  ${scriptTag}
  <script>
    window.addEventListener('DOMContentLoaded', function () {
      var ph = document.getElementById('preload-h1-ciudades');
      if (ph) ph.remove();
    });
  </script>
</body>
</html>`;
  await fsp.writeFile(path.join(hubDir, "index.html"), html, "utf8");
}

// ---------- Main ----------
(async () => {
  try {
    if (!HAS_MANIFEST) {
      console.log("💡 No hay manifest: usando /src/main.tsx (DEV). Tras el build, se reescriben en dist/.");
    } else {
      console.log(`✅ Manifest: ${MANIFEST_PATH}`);
      console.log("✅ Escribiendo landings con assets hasheados en dist/ciudades/…");
    }

    await ensureDir(OUT_BASE);
    for (const city of CITIES) await writeCity(city);
    await writeIndexHub();
    await writeSitemapAndRobots();

    const where = HAS_MANIFEST ? "./dist/ciudades/" : "./public/ciudades/";
    console.log(`✅ Generadas ${CITIES.length} páginas de ciudad en ${where}`);
    console.log(`✅ sitemap.xml y robots.txt listos en ./public/`);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
})();
