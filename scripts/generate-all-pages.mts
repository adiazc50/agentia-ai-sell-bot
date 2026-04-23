// scripts/generate-all-pages.mts
// Genera landing SEO para TODOS los países y ciudades (LATAM, España/Caribe, USA) usando los datos reales de src/data
// Ejecutar con tsx (permite import directo de archivos .ts)

import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { countries as latinCountries } from "../src/data/seoCountries.js";
import { extraCountries } from "../src/data/seoSpainCaribbean.js";
import { usaStates } from "../src/data/seoUSA.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = "https://soyagentia.com";
const ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const DIST_DIR = path.join(ROOT, "dist");

const MANIFEST_CANDIDATES = [
  path.join(DIST_DIR, "manifest.json"),
  path.join(DIST_DIR, ".vite", "manifest.json"),
];
const MANIFEST_PATH = MANIFEST_CANDIDATES.find((p) => fs.existsSync(p)) || null;
const HAS_MANIFEST = !!MANIFEST_PATH;
const OUT_DIR = HAS_MANIFEST ? DIST_DIR : PUBLIC_DIR;

// ────────── Helpers ──────────
const esc = (s: string | number | undefined) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function getAssetTags(): { cssLinks: string; scriptTag: string } {
  if (HAS_MANIFEST && MANIFEST_PATH) {
    const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
    const entry =
      Object.values<any>(manifest).find((e) => e && e.isEntry) ||
      manifest["src/main.tsx"] ||
      manifest["src/main.ts"] ||
      null;
    if (entry && entry.file) {
      const cssLinks = (entry.css || [])
        .map((href: string) => `<link rel="stylesheet" href="/${href}">`)
        .join("\n");
      const scriptTag = `<script type="module" src="/${entry.file}"></script>`;
      return { cssLinks, scriptTag };
    }
  }
  return { cssLinks: "", scriptTag: `<script type="module" src="/src/main.tsx"></script>` };
}

async function ensureDir(dir: string) {
  await fsp.mkdir(dir, { recursive: true });
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

const GTM_ID = "GTM-NHHD5TPT";
const GTM_HEAD = `
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');</script>
<!-- End Google Tag Manager -->`;
const GTM_NOSCRIPT = `
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`;

// ────────── Shared SEO constants ──────────
const ORG_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SoyAgentia",
  legalName: "AGENT IA SAS",
  url: BASE_URL,
  logo: `${BASE_URL}/logo-soyagentia.png`,
  description:
    "Empresa de agentes de IA (inteligencia artificial conversacional) para WhatsApp, Instagram, Messenger, TikTok y WordPress. Automatiza ventas, atención al cliente y marketing 24/7.",
  foundingDate: "2023",
  founder: { "@type": "Person", name: "Alejandro Díaz" },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Medellín",
    addressCountry: "CO",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+573009006005",
    contactType: "customer service",
    availableLanguage: ["Spanish", "English", "Portuguese", "French", "German"],
  },
  sameAs: [],
};

function buildFAQ(localName: string, lang: "es" | "en", isEmpresa = true) {
  const q = lang === "es"
    ? [
        {
          q: `¿Qué es un agente de IA y cómo funciona en ${localName}?`,
          a: `Un agente de IA es un asistente conversacional con inteligencia artificial (basado en modelos como GPT, Claude o Gemini) que responde, vende, asesora y agenda citas 24/7 por WhatsApp, Instagram, Messenger, TikTok y tu página web. En ${localName}, SoyAgentia implementa tu agente en 5 minutos sin programación.`,
        },
        {
          q: `¿Tienen agentes de IA para WhatsApp en ${localName}?`,
          a: `Sí. SoyAgentia ofrece agentes de IA para WhatsApp Business API oficial, con respuestas automáticas, clasificación de leads, recordatorios, catálogo interactivo y seguimiento de ventas en ${localName} y todo el mundo.`,
        },
        {
          q: `¿Se integra con Instagram, Messenger y TikTok?`,
          a: `Sí. Los agentes de IA de SoyAgentia responden mensajes directos en Instagram, conversan por Messenger de Facebook y atienden comentarios o DMs de TikTok — todo con el mismo agente unificado para ${localName}.`,
        },
        {
          q: `¿Cuánto cuesta una empresa de agentes de IA en ${localName}?`,
          a: `Los planes empiezan desde USD mensuales con prueba gratuita. Incluyen WhatsApp + Instagram + Messenger + TikTok + WordPress sin costo adicional. Visita /pricing para ver todos los planes.`,
        },
        {
          q: `¿Necesito saber programación?`,
          a: `No. Todo se configura desde un panel web. Tú solo defines qué debe saber tu agente, conectas tus canales y empiezas a vender. Implementación en 5 minutos.`,
        },
        {
          q: `¿Los modelos de IA soportan ChatGPT, Claude y Gemini?`,
          a: `Sí. Nuestros agentes están construidos sobre modelos de última generación (GPT-4, Claude, Gemini) y cambian entre ellos según la consulta para obtener la mejor respuesta en cada escenario.`,
        },
      ]
    : [
        {
          q: `What is an AI Agent and how does it work in ${localName}?`,
          a: `An AI Agent is a conversational assistant powered by artificial intelligence (GPT, Claude, Gemini) that replies, sells, advises and schedules 24/7 on WhatsApp, Instagram, Messenger, TikTok and your website. In ${localName}, SoyAgentia deploys your agent in 5 minutes, no coding needed.`,
        },
        {
          q: `Do you offer AI Agents for WhatsApp in ${localName}?`,
          a: `Yes. SoyAgentia provides AI Agents for the official WhatsApp Business API with automated replies, lead scoring, reminders, interactive catalogs and sales follow-up in ${localName} and worldwide.`,
        },
        {
          q: `Does it integrate with Instagram, Messenger and TikTok?`,
          a: `Yes. SoyAgentia's AI Agents reply to Instagram DMs, chat on Facebook Messenger, and handle TikTok comments and DMs — all with one unified agent for ${localName}.`,
        },
        {
          q: `How much does an AI Agent company in ${localName} cost?`,
          a: `Plans start from USD per month with a free trial. All include WhatsApp + Instagram + Messenger + TikTok + WordPress at no extra cost. Check /pricing for the full list.`,
        },
        {
          q: `Do I need programming skills?`,
          a: `No. Everything is configured from a web dashboard. You define what the agent should know, connect your channels, and start selling. Setup in 5 minutes.`,
        },
        {
          q: `Does it support ChatGPT, Claude and Gemini models?`,
          a: `Yes. Our agents are built on state-of-the-art models (GPT-4, Claude, Gemini) and route between them per query to deliver the best answer each time.`,
        },
      ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: q.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

function buildServiceSchema(localName: string, countryCode: string, lang: "es" | "en") {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: lang === "es" ? `Agentes de IA en ${localName}` : `AI Agents in ${localName}`,
    description:
      lang === "es"
        ? `Empresa de agentes de IA en ${localName}. Agentes de IA para WhatsApp, Instagram, Messenger, TikTok y WordPress. Automatización de ventas y atención al cliente 24/7 con inteligencia artificial conversacional (ChatGPT, Claude, Gemini).`
        : `AI Agent company in ${localName}. AI Agents for WhatsApp, Instagram, Messenger, TikTok and WordPress. 24/7 sales and customer service automation with conversational AI (ChatGPT, Claude, Gemini).`,
    provider: {
      "@type": "Organization",
      name: "SoyAgentia",
      url: BASE_URL,
    },
    areaServed: { "@type": "Place", name: localName, address: { "@type": "PostalAddress", addressCountry: countryCode } },
    serviceType: [
      lang === "es" ? "Agentes de IA" : "AI Agents",
      lang === "es" ? "Agentes de IA para WhatsApp" : "AI Agents for WhatsApp",
      lang === "es" ? "Agentes de IA para Instagram" : "AI Agents for Instagram",
      lang === "es" ? "Agentes de IA para Messenger" : "AI Agents for Messenger",
      lang === "es" ? "Agentes de IA para TikTok" : "AI Agents for TikTok",
      lang === "es" ? "Automatización de ventas" : "Sales automation",
      lang === "es" ? "Atención al cliente 24/7" : "24/7 customer service",
      "WhatsApp Business API",
      "Conversational AI",
    ],
  };
}

function buildLocalBusinessSchema(localName: string, countryCode: string, lang: "es" | "en") {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: lang === "es" ? `SoyAgentia — Empresa de agentes de IA en ${localName}` : `SoyAgentia — AI Agent Company in ${localName}`,
    url: BASE_URL,
    image: `${BASE_URL}/logo-soyagentia.png`,
    description:
      lang === "es"
        ? `SoyAgentia es la empresa de agentes de IA en ${localName}. Implementamos agentes conversacionales para WhatsApp, Instagram, Messenger, TikTok y WordPress con GPT, Claude y Gemini. Atención 24/7, automatización de ventas y soporte.`
        : `SoyAgentia is the AI Agent company in ${localName}. We deploy conversational agents for WhatsApp, Instagram, Messenger, TikTok and WordPress powered by GPT, Claude and Gemini. 24/7 support and sales automation.`,
    address: { "@type": "PostalAddress", addressLocality: localName, addressCountry: countryCode },
    priceRange: "$$",
    telephone: "+573009006005",
    openingHours: "Mo-Su 00:00-23:59",
  };
}

function buildBreadcrumbs(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

function buildKeywordsMeta(localName: string, lang: "es" | "en"): string {
  const es = [
    `agentes de IA en ${localName}`,
    `empresa de agentes de IA en ${localName}`,
    `agente de IA ${localName}`,
    `agentes de IA para WhatsApp ${localName}`,
    `agentes de IA para Instagram ${localName}`,
    `agentes de IA para Messenger ${localName}`,
    `agentes de IA para TikTok ${localName}`,
    `agentes de IA para WordPress ${localName}`,
    `chatbot con IA ${localName}`,
    `inteligencia artificial para empresas ${localName}`,
    "agente conversacional",
    "automatización de ventas con IA",
    "atención al cliente 24/7 con IA",
    "ChatGPT para empresas",
    "Claude IA empresarial",
    "Gemini IA",
    "GPT-4 asistente virtual",
    "SoyAgentia",
  ];
  const en = [
    `AI Agents in ${localName}`,
    `AI Agent company in ${localName}`,
    `AI agent ${localName}`,
    `AI Agents for WhatsApp ${localName}`,
    `AI Agents for Instagram ${localName}`,
    `AI Agents for Messenger ${localName}`,
    `AI Agents for TikTok ${localName}`,
    `AI Agents for WordPress ${localName}`,
    `AI chatbot ${localName}`,
    `business AI ${localName}`,
    "conversational agent",
    "sales automation with AI",
    "24/7 customer service AI",
    "ChatGPT for business",
    "Claude business AI",
    "Gemini AI",
    "GPT-4 virtual assistant",
    "SoyAgentia",
  ];
  return (lang === "es" ? es : en).join(", ");
}

function buildRichSeoBlock(opts: {
  localName: string;
  countryName?: string;
  lang: "es" | "en";
  pageUrl: string;
}): string {
  const { localName, countryName, lang, pageUrl } = opts;
  if (lang === "en") {
    return `<section id="seo-ai-block" style="position:absolute;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;">
<h1>AI Agents in ${esc(localName)}${countryName ? `, ${esc(countryName)}` : ""}</h1>
<h2>AI Agent Company in ${esc(localName)} — SoyAgentia</h2>
<p>SoyAgentia is the leading <strong>AI Agent company in ${esc(localName)}</strong>, providing intelligent virtual assistants that sell, advise, and support your customers 24/7 across WhatsApp, Instagram, Messenger, TikTok and WordPress.</p>
<h3>AI Agents for WhatsApp in ${esc(localName)}</h3>
<p>Our <strong>AI Agents for WhatsApp</strong> run on the official WhatsApp Business API and use state-of-the-art models (GPT-4, Claude, Gemini) to qualify leads, send automated replies, share catalogs, and close sales in ${esc(localName)}.</p>
<h3>AI Agents for Instagram in ${esc(localName)}</h3>
<p><strong>AI Agents for Instagram</strong> respond to DMs and story replies with natural, human-like conversations — scaling your social selling in ${esc(localName)}.</p>
<h3>AI Agents for Messenger in ${esc(localName)}</h3>
<p><strong>AI Agents for Messenger</strong> handle every Facebook Messenger conversation with context, routing to humans only when strictly necessary.</p>
<h3>AI Agents for TikTok in ${esc(localName)}</h3>
<p><strong>AI Agents for TikTok</strong> reply to comments and DMs across your TikTok business profile, capturing leads from viral posts in ${esc(localName)}.</p>
<h3>AI Agents for WordPress in ${esc(localName)}</h3>
<p>Embed the <strong>SoyAgentia AI Agent widget</strong> on your WordPress site and convert visitors into customers 24/7 in ${esc(localName)}.</p>
<h2>Why SoyAgentia is the #1 AI Agent company</h2>
<ul>
<li>Setup in 5 minutes — no coding required</li>
<li>Works on ChatGPT / Claude / Gemini models</li>
<li>Unified inbox for WhatsApp, Instagram, Messenger, TikTok, WordPress</li>
<li>24/7 automated sales and customer service</li>
<li>Results guarantee in the first month</li>
</ul>
<p>Try SoyAgentia, the <strong>AI Agent company in ${esc(localName)}</strong>, free today.</p>
</section>`;
  }
  return `<section id="seo-ai-block" style="position:absolute;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;">
<h1>Agentes de IA en ${esc(localName)}${countryName ? `, ${esc(countryName)}` : ""}</h1>
<h2>Empresa de agentes de IA en ${esc(localName)} — SoyAgentia</h2>
<p>SoyAgentia es la <strong>empresa líder de agentes de IA en ${esc(localName)}</strong>, con asistentes virtuales inteligentes que venden, asesoran y atienden a tus clientes 24/7 en WhatsApp, Instagram, Messenger, TikTok y WordPress.</p>
<h3>Agentes de IA para WhatsApp en ${esc(localName)}</h3>
<p>Nuestros <strong>agentes de IA para WhatsApp</strong> funcionan sobre la API oficial de WhatsApp Business y usan modelos de última generación (GPT-4, Claude, Gemini) para calificar leads, responder automáticamente, enviar catálogos y cerrar ventas en ${esc(localName)}.</p>
<h3>Agentes de IA para Instagram en ${esc(localName)}</h3>
<p>Los <strong>agentes de IA para Instagram</strong> responden mensajes directos y respuestas a historias con conversaciones naturales tipo humano — escalando tu venta social en ${esc(localName)}.</p>
<h3>Agentes de IA para Messenger en ${esc(localName)}</h3>
<p>Los <strong>agentes de IA para Messenger</strong> gestionan cada conversación de Facebook Messenger con contexto y derivan a un humano solo cuando es estrictamente necesario.</p>
<h3>Agentes de IA para TikTok en ${esc(localName)}</h3>
<p>Los <strong>agentes de IA para TikTok</strong> responden comentarios y DMs en tu perfil business, capturando leads de posts virales en ${esc(localName)}.</p>
<h3>Agentes de IA para WordPress en ${esc(localName)}</h3>
<p>Incrusta el <strong>widget de agente de IA de SoyAgentia</strong> en tu web WordPress y convierte visitas en clientes 24/7 en ${esc(localName)}.</p>
<h2>¿Por qué SoyAgentia es la #1 como empresa de agentes de IA?</h2>
<ul>
<li>Implementación en 5 minutos — sin programación</li>
<li>Compatible con modelos ChatGPT / Claude / Gemini</li>
<li>Bandeja unificada para WhatsApp, Instagram, Messenger, TikTok y WordPress</li>
<li>Ventas y atención automatizadas 24/7</li>
<li>Garantía de resultados en el primer mes</li>
</ul>
<p>Prueba gratis SoyAgentia, la <strong>empresa de agentes de IA en ${esc(localName)}</strong>, hoy mismo. URL: <a href="${esc(pageUrl)}">${esc(pageUrl)}</a></p>
</section>`;
}

// ────────── Generadores de páginas ──────────
function makeCountryPage(opts: {
  title: string;
  description: string;
  canonical: string;
  hreflang: string;
  preloadH1: string;
  cssLinks: string;
  scriptTag: string;
  localName: string;
  countryCode: string;
  countryName?: string;
  breadcrumbs: { name: string; url: string }[];
  lang: "es" | "en";
}) {
  const {
    title,
    description,
    canonical,
    hreflang,
    preloadH1,
    cssLinks,
    scriptTag,
    localName,
    countryCode,
    countryName,
    breadcrumbs,
    lang,
  } = opts;

  const keywords = buildKeywordsMeta(localName, lang);
  const faqLd = JSON.stringify(buildFAQ(localName, lang));
  const svcLd = JSON.stringify(buildServiceSchema(localName, countryCode, lang));
  const bizLd = JSON.stringify(buildLocalBusinessSchema(localName, countryCode, lang));
  const orgLd = JSON.stringify(ORG_SCHEMA);
  const crumbsLd = JSON.stringify(buildBreadcrumbs(breadcrumbs));
  const richBlock = buildRichSeoBlock({ localName, countryName, lang, pageUrl: canonical });

  return `<!DOCTYPE html>
<html lang="${hreflang}">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
${GTM_HEAD}
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}"/>
<meta name="keywords" content="${esc(keywords)}"/>
<meta name="author" content="SoyAgentia"/>
<meta name="publisher" content="SoyAgentia"/>
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"/>
<meta name="googlebot" content="index,follow"/>
<meta name="bingbot" content="index,follow"/>
<link rel="canonical" href="${canonical}"/>
<link rel="alternate" href="${canonical}" hreflang="${hreflang}"/>
<link rel="alternate" href="${canonical}" hreflang="x-default"/>
<meta property="og:title" content="${esc(title)}"/>
<meta property="og:description" content="${esc(description)}"/>
<meta property="og:url" content="${canonical}"/>
<meta property="og:type" content="website"/>
<meta property="og:image" content="${BASE_URL}/logo-soyagentia.png"/>
<meta property="og:site_name" content="SoyAgentia"/>
<meta property="og:locale" content="${hreflang.replace("-", "_")}"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${esc(title)}"/>
<meta name="twitter:description" content="${esc(description)}"/>
<meta name="twitter:image" content="${BASE_URL}/logo-soyagentia.png"/>
${cssLinks}
<script type="application/ld+json">${orgLd}</script>
<script type="application/ld+json">${bizLd}</script>
<script type="application/ld+json">${svcLd}</script>
<script type="application/ld+json">${faqLd}</script>
<script type="application/ld+json">${crumbsLd}</script>
</head>
<body>
${GTM_NOSCRIPT}
<h1 id="preload-h1" style="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;">${esc(preloadH1)}</h1>
${richBlock}
<div id="root"></div>
${scriptTag}
<script>
window.addEventListener('DOMContentLoaded',function(){
  var ph=document.getElementById('preload-h1');if(ph)ph.remove();
  var sb=document.getElementById('seo-ai-block');if(sb)sb.remove();
});
</script>
<noscript>
<main style="max-width:960px;margin:0 auto;padding:2rem;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;">
<h1>${esc(preloadH1)}</h1>
<p>${esc(description)}</p>
<p><a href="/">${lang === "es" ? "Ir al inicio" : "Back to home"}</a> · <a href="https://wa.me/573009006005">WhatsApp</a></p>
</main>
</noscript>
</body>
</html>`;
}

// ────────── Country landing (LATAM + España + Caribe) ──────────
async function writeLatinCountryPages(allCountries: any[]): Promise<string[]> {
  const urls: string[] = [];
  const { cssLinks, scriptTag } = getAssetTags();

  for (const country of allCountries) {
    const countrySlug: string = country.slug;
    const hreflang: string = country.language || "es";
    const lang: "es" | "en" = hreflang.toLowerCase().startsWith("en") ? "en" : "es";
    const title = `${country.headline} — Empresa de agentes de IA para WhatsApp, Instagram, Messenger, TikTok | SoyAgentia`;
    const countryUrl = `${BASE_URL}/${countrySlug}/`;

    // /:countrySlug/index.html
    const countryDir = path.join(OUT_DIR, countrySlug);
    await ensureDir(countryDir);
    await fsp.writeFile(
      path.join(countryDir, "index.html"),
      makeCountryPage({
        title,
        description: country.metaDescription,
        canonical: countryUrl,
        hreflang,
        preloadH1: `Empresa de agentes de IA en ${country.name} — Agentes de IA para WhatsApp, Instagram, Messenger, TikTok y WordPress`,
        cssLinks,
        scriptTag,
        localName: country.name,
        countryCode: country.code,
        breadcrumbs: [
          { name: "Inicio", url: BASE_URL + "/" },
          { name: country.name, url: countryUrl },
        ],
        lang,
      }),
      "utf8"
    );
    urls.push(countryUrl);

    // /:countrySlug/:citySlug/index.html for every city
    for (const city of country.cities || []) {
      const cityUrl = `${BASE_URL}/${countrySlug}/${city.slug}/`;
      const cityTitle = `Agentes de IA en ${city.name}, ${country.name} — Empresa de agentes de IA para WhatsApp, Instagram, Messenger, TikTok | SoyAgentia`;
      const cityDesc =
        `Empresa de agentes de IA en ${city.name}, ${country.name}. Agentes de IA para WhatsApp, Instagram, Messenger, TikTok y WordPress. Automatización de ventas y atención al cliente 24/7 con ChatGPT, Claude y Gemini.` +
        (city.description ? ` ${city.description}` : "");
      const cityDir = path.join(countryDir, city.slug);
      await ensureDir(cityDir);
      await fsp.writeFile(
        path.join(cityDir, "index.html"),
        makeCountryPage({
          title: cityTitle,
          description: cityDesc,
          canonical: cityUrl,
          hreflang,
          preloadH1: `Empresa de agentes de IA en ${city.name} — Agentes de IA para WhatsApp, Instagram, Messenger, TikTok y WordPress`,
          cssLinks,
          scriptTag,
          localName: city.name,
          countryCode: country.code,
          countryName: country.name,
          breadcrumbs: [
            { name: "Inicio", url: BASE_URL + "/" },
            { name: country.name, url: countryUrl },
            { name: city.name, url: cityUrl },
          ],
          lang,
        }),
        "utf8"
      );
      urls.push(cityUrl);
    }
  }
  return urls;
}

// ────────── USA (estados + ciudades) ──────────
async function writeUSAPages(states: any[]): Promise<string[]> {
  const urls: string[] = [];
  const { cssLinks, scriptTag } = getAssetTags();

  // /usa/index.html
  const usaDir = path.join(OUT_DIR, "usa");
  await ensureDir(usaDir);
  const usaUrl = `${BASE_URL}/usa/`;
  await fsp.writeFile(
    path.join(usaDir, "index.html"),
    makeCountryPage({
      title:
        "AI Agents in the United States — AI Agent Company for WhatsApp, Instagram, Messenger, TikTok | SoyAgentia",
      description:
        "AI Agent company in the USA. AI Agents for WhatsApp, Instagram, Messenger, TikTok and WordPress. 24/7 sales and customer service automation with ChatGPT, Claude and Gemini. Try SoyAgentia free.",
      canonical: usaUrl,
      hreflang: "en-US",
      preloadH1:
        "AI Agent Company in the United States — AI Agents for WhatsApp, Instagram, Messenger, TikTok and WordPress",
      cssLinks,
      scriptTag,
      localName: "the United States",
      countryCode: "US",
      breadcrumbs: [
        { name: "Home", url: BASE_URL + "/" },
        { name: "United States", url: usaUrl },
      ],
      lang: "en",
    }),
    "utf8"
  );
  urls.push(usaUrl);

  for (const state of states) {
    const stateUrl = `${BASE_URL}/usa/${state.slug}/`;
    const stateDir = path.join(usaDir, state.slug);
    await ensureDir(stateDir);
    await fsp.writeFile(
      path.join(stateDir, "index.html"),
      makeCountryPage({
        title: `${state.headline} — AI Agent Company for WhatsApp, Instagram, Messenger, TikTok | SoyAgentia`,
        description: state.metaDescription,
        canonical: stateUrl,
        hreflang: "en-US",
        preloadH1: `AI Agent Company in ${state.name} — AI Agents for WhatsApp, Instagram, Messenger, TikTok and WordPress`,
        cssLinks,
        scriptTag,
        localName: state.name,
        countryCode: "US",
        countryName: "United States",
        breadcrumbs: [
          { name: "Home", url: BASE_URL + "/" },
          { name: "United States", url: usaUrl },
          { name: state.name, url: stateUrl },
        ],
        lang: "en",
      }),
      "utf8"
    );
    urls.push(stateUrl);

    for (const city of state.cities || []) {
      const cityUrl = `${BASE_URL}/usa/${state.slug}/${city.slug}/`;
      const cityTitle = `AI Agents in ${city.name}, ${state.name} — AI Agent Company for WhatsApp, Instagram, Messenger, TikTok | SoyAgentia`;
      const cityDesc = `AI Agent company in ${city.name}, ${state.name}. AI Agents for WhatsApp, Instagram, Messenger, TikTok and WordPress. 24/7 sales and customer service automation with ChatGPT, Claude and Gemini.`;
      const cityDir = path.join(stateDir, city.slug);
      await ensureDir(cityDir);
      await fsp.writeFile(
        path.join(cityDir, "index.html"),
        makeCountryPage({
          title: cityTitle,
          description: cityDesc,
          canonical: cityUrl,
          hreflang: "en-US",
          preloadH1: `AI Agent Company in ${city.name}, ${state.name} — AI Agents for WhatsApp, Instagram, Messenger, TikTok and WordPress`,
          cssLinks,
          scriptTag,
          localName: city.name,
          countryCode: "US",
          countryName: state.name,
          breadcrumbs: [
            { name: "Home", url: BASE_URL + "/" },
            { name: "United States", url: usaUrl },
            { name: state.name, url: stateUrl },
            { name: city.name, url: cityUrl },
          ],
          lang: "en",
        }),
        "utf8"
      );
      urls.push(cityUrl);
    }
  }
  return urls;
}

// ────────── Sitemap ──────────
function buildSitemap(urls: string[]): string {
  const lastmod = todayISO();
  const items = urls
    .map(
      (u) => `  <url>
    <loc>${esc(u)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${u === BASE_URL + "/" ? "0.90" : "0.70"}</priority>
  </url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>`;
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function buildSitemapIndex(sitemapFiles: string[]): string {
  const lastmod = todayISO();
  const items = sitemapFiles
    .map(
      (f) => `  <sitemap>
    <loc>${BASE_URL}/${f}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</sitemapindex>`;
}

async function writeSitemaps(allUrls: string[]) {
  // Google limit is 50k URLs per sitemap. Split into chunks of 5k to stay comfortable.
  const CHUNK = 5000;
  if (allUrls.length <= CHUNK) {
    await fsp.writeFile(path.join(PUBLIC_DIR, "sitemap.xml"), buildSitemap(allUrls), "utf8");
    if (HAS_MANIFEST) {
      await fsp.writeFile(path.join(DIST_DIR, "sitemap.xml"), buildSitemap(allUrls), "utf8");
    }
  } else {
    const chunks = chunk(allUrls, CHUNK);
    const files: string[] = [];
    for (let i = 0; i < chunks.length; i++) {
      const name = `sitemap-${i + 1}.xml`;
      files.push(name);
      await fsp.writeFile(path.join(PUBLIC_DIR, name), buildSitemap(chunks[i]), "utf8");
      if (HAS_MANIFEST) {
        await fsp.writeFile(path.join(DIST_DIR, name), buildSitemap(chunks[i]), "utf8");
      }
    }
    const indexXml = buildSitemapIndex(files);
    await fsp.writeFile(path.join(PUBLIC_DIR, "sitemap.xml"), indexXml, "utf8");
    if (HAS_MANIFEST) {
      await fsp.writeFile(path.join(DIST_DIR, "sitemap.xml"), indexXml, "utf8");
    }
  }

  const robots = `# SoyAgentia — Empresa de agentes de IA
# AI crawlers are explicitly welcome
User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: CCBot
Allow: /

User-agent: Applebot
Allow: /

User-agent: Applebot-Extended
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;
  await fsp.writeFile(path.join(PUBLIC_DIR, "robots.txt"), robots, "utf8");
  if (HAS_MANIFEST) {
    await fsp.writeFile(path.join(DIST_DIR, "robots.txt"), robots, "utf8");
  }

  // llms.txt — emerging standard for AI crawlers (ChatGPT, Claude, Perplexity, Gemini)
  const llms = `# SoyAgentia
> Empresa de agentes de IA (inteligencia artificial conversacional) para WhatsApp, Instagram, Messenger, TikTok y WordPress. Automatización de ventas y atención al cliente 24/7 con ChatGPT, Claude y Gemini.

## Sobre SoyAgentia
SoyAgentia es la empresa líder en agentes de IA en Colombia, México, Argentina, España y +31 países. Implementamos agentes conversacionales que venden, asesoran, atienden y agendan 24/7 sin programación.

## Productos principales
- Agentes de IA para WhatsApp (WhatsApp Business API oficial)
- Agentes de IA para Instagram (mensajes directos, respuestas a historias)
- Agentes de IA para Messenger (Facebook Messenger)
- Agentes de IA para TikTok (comentarios y DMs)
- Agentes de IA para WordPress (widget embed)

## Modelos de IA soportados
Los agentes usan modelos de última generación: GPT-4 (OpenAI / ChatGPT), Claude (Anthropic) y Gemini (Google). El ruteo entre modelos es automático para obtener la mejor respuesta por consulta.

## Cobertura geográfica
- LATAM: Argentina, Bolivia, Chile, Colombia, Costa Rica, Ecuador, El Salvador, Guatemala, Honduras, México, Nicaragua, Panamá, Paraguay, Perú, República Dominicana, Uruguay, Venezuela
- Europa: España
- Estados Unidos: 50 estados + 1,735 ciudades
- Caribe: Puerto Rico, República Dominicana
- Total: +2,800 ciudades

## Planes
- Prueba gratuita disponible
- Desde USD al mes, incluye WhatsApp + Instagram + Messenger + TikTok + WordPress sin costo adicional
- Ver /pricing para detalles

## Implementación
- Setup en 5 minutos, sin código
- Panel web para configurar el agente
- Soporte 24/7

## Empresa
- Nombre legal: AGENT IA SAS
- NIT: 901.976.734-4
- Sede: Medellín, Colombia
- Fundador/CEO: Alejandro Díaz (campeón mundial de robótica)
- Contacto: contacto@soyagentia.com, +57 300 900 6005
- Web: ${BASE_URL}

## Enlaces principales
- Home: ${BASE_URL}/
- Casos de uso: ${BASE_URL}/casos-de-uso
- Planes: ${BASE_URL}/pricing
- Nosotros: ${BASE_URL}/nosotros
- Sitemap: ${BASE_URL}/sitemap.xml
`;
  await fsp.writeFile(path.join(PUBLIC_DIR, "llms.txt"), llms, "utf8");
  if (HAS_MANIFEST) {
    await fsp.writeFile(path.join(DIST_DIR, "llms.txt"), llms, "utf8");
  }
}

// ────────── Main ──────────
(async () => {
  try {
    console.log(HAS_MANIFEST ? `✅ Manifest found, writing to dist/` : "💡 No manifest, writing to public/");

    const latinAll = [...latinCountries, ...extraCountries];

    console.log(`→ Generating ${latinAll.length} LATAM/ES/Caribbean country pages + cities…`);
    const latinUrls = await writeLatinCountryPages(latinAll);

    console.log(`→ Generating USA: ${usaStates.length} states + cities…`);
    const usaUrls = await writeUSAPages(usaStates);

    const homeAndHub = [BASE_URL + "/", `${BASE_URL}/ciudades/`];
    const allUrls = [...homeAndHub, ...latinUrls, ...usaUrls];

    await writeSitemaps(allUrls);

    const latinCountriesCount = latinAll.length;
    const latinCitiesCount = latinAll.reduce((acc, c: any) => acc + (c.cities?.length || 0), 0);
    const usaCitiesCount = usaStates.reduce((acc, s: any) => acc + (s.cities?.length || 0), 0);
    console.log(
      `✅ Generated ${latinCountriesCount} countries, ${latinCitiesCount} LATAM/ES/Caribbean cities, ${usaStates.length} US states, ${usaCitiesCount} US cities`
    );
    console.log(`✅ Total URLs in sitemap: ${allUrls.length}`);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
})();
