// src/components/TechSection.tsx
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Brain,
  Cloud,
  Database,
  Globe,
  Smartphone,
  Cpu,
  Shield,
  Zap,
} from "lucide-react";
import techBackground from "@/assets/tech-background.jpg";

const technologies = [
  { name: "GPT", category: "IA" },
  { name: "AWS", category: "Cloud" },
  { name: "Azure", category: "Cloud" },
  { name: "Oracle Cloud", category: "Cloud" },
  { name: "Google Cloud", category: "Cloud" },
  { name: "Docker", category: "DevOps" },
  { name: "Kubernetes", category: "DevOps" },
  { name: "Twilio", category: "Comunicaciones" },
  { name: "OpenAI", category: "IA" },
  { name: "Copilot", category: "IA" },
  { name: "TensorFlow", category: "ML" },
  { name: "Python", category: "Backend" },
  { name: "React", category: "Frontend" },
  { name: "Node.js", category: "Backend" },
  { name: "Microsoft", category: "Enterprise" },
  { name: "Power BI", category: "Analytics" },
  { name: "Business Intelligence", category: "Analytics" },
  { name: "Robótica", category: "Robotics" },
  { name: "WhatsApp API", category: "Messaging" },
  { name: "Meta API", category: "Social" },
  { name: "MongoDB", category: "Database" },
  { name: "PostgreSQL", category: "Database" },
  { name: "Redis", category: "Cache" },
  { name: "Elasticsearch", category: "Search" },
];

const capabilities = [
  {
    icon: Brain,
    title: "Inteligencia Artificial Avanzada",
    description:
      "Modelos de IA de última generación para comprensión y generación de lenguaje natural",
  },
  {
    icon: Cloud,
    title: "Infraestructura Escalable",
    description:
      "Arquitectura cloud que se adapta al crecimiento de tu empresa sin límites",
  },
  {
    icon: Database,
    title: "Integración Completa",
    description:
      "Conectamos con cualquier sistema: ERP, CRM, bases de datos y APIs existentes",
  },
  {
    icon: Globe,
    title: "Presencia Omnicanal",
    description:
      "Un solo agente que funciona en web, móvil, WhatsApp, redes sociales y teléfono",
  },
  {
    icon: Smartphone,
    title: "Experiencia Móvil",
    description:
      "Optimizado para dispositivos móviles con interfaces intuitivas y responsivas",
  },
  {
    icon: Cpu,
    title: "Procesamiento en Tiempo Real",
    description:
      "Respuestas instantáneas con procesamiento distribuido de alta velocidad",
  },
  {
    icon: Shield,
    title: "Seguridad Empresarial",
    description:
      "Protocolos de seguridad y buenas prácticas para proteger datos sensibles",
  },
  {
    icon: Zap,
    title: "Rápida implementación",
    description: "Despliegue con configuración personalizada para tu negocio",
  },
];

const TechSection = () => {
  const datePublished = new Date().toISOString().slice(0, 10);
  const keywords = technologies.map((t) => t.name).join(", ");

  // ---- FAQ (contenido + JSON-LD) ----
  const faqs = [
    {
      q: "¿Qué es un Agente de IA y en qué me ayuda?",
      a: "Es un software autónomo que entiende lenguaje natural y ejecuta tareas: prospección, atención 24/7, agendamiento, seguimiento de leads, cobros y más. Se conecta a tus sistemas para trabajar solo.",
    },
    {
      q: "¿En cuánto tiempo lo implementan?",
      a: "En 48–72 horas dejamos el agente funcionando en un primer flujo (MVP) y continuamos iterando semanalmente para optimizar métricas de negocio.",
    },
    {
      q: "¿Con qué canales y sistemas se integra?",
      a: "Webchat, WhatsApp, Instagram, Facebook, voz (llamadas), y con ERP/CRM o bases de datos vía API: HubSpot, Salesforce, Odoo, SAP, PostgreSQL, MongoDB, etc.",
    },
    {
      q: "¿Cómo medimos el ROI?",
      a: "Definimos KPIs (leads, Citas/ventas, AHT, conversión, recuperaciones) y tableros. En promedio, se ve impacto el primer mes al automatizar tareas repetitivas.",
    },
    {
      q: "¿Qué hay de seguridad y cumplimiento?",
      a: "Aplicamos buenas prácticas de seguridad (cifrado en tránsito, mínimos privilegios, controles de acceso) y respetamos políticas de datos del cliente.",
    },
    {
      q: "¿Cuál es el costo?",
      a: "Modelo por suscripción + consumo de canales (p. ej. WhatsApp/voz). Cotizamos según volúmenes, complejidad de flujos e integraciones requeridas.",
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      {/* === TECNOLOGÍA === */}
      <section
        id="tecnologia"
        role="region"
        aria-labelledby="tech-title"
        className="py-20 relative overflow-hidden"
        itemScope
        itemType="https://schema.org/TechArticle"
      >
        {/* Microdatos del artículo */}
        <meta itemProp="author" content="SoyAgentia" />
        <meta itemProp="publisher" content="Agent IA SAS" />
        <meta itemProp="datePublished" content={datePublished} />
        <meta itemProp="keywords" content={keywords} />

        {/* Fondo */}
        <div className="absolute inset-0 z-0">
          <img
            src={techBackground}
            alt="Tecnología de IA avanzada desarrollada en Medellín para empresas colombianas"
            className="w-full h-full object-cover opacity-10"
            itemProp="image"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/95 to-card/90" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Encabezado */}
          <div className="text-center mb-16">
            <h2
              id="tech-title"
              className="text-4xl md:text-5xl font-bold text-foreground mb-6"
              itemProp="headline"
            >
              <span className="sr-only">Desarrollo IA Medellín - </span>
              Tecnología{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                AVANZADA
              </span>{" "}
              para automatizar tu crecimiento
            </h2>
            <p
              className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8"
              itemProp="description"
            >
              Más que una agencia, somos una{" "}
              <strong>empresa de base tecnológica en Medellín</strong> con
              desarrollo propio en <em>IA y robótica empresarial</em>.
            </p>

            {/* Badges como lista semántica */}
            <ul
              aria-label="Tecnologías y plataformas utilizadas"
              className="flex flex-wrap justify-center gap-3 mb-12"
            >
              {technologies.map((tech, i) => (
                <li
                  key={i}
                  itemProp="about"
                  itemScope
                  itemType="https://schema.org/DefinedTerm"
                >
                  <Badge
                    variant="outline"
                    className="px-4 py-2 text-sm border-primary/30 hover:bg-primary/10 transition-colors duration-200"
                  >
                    <span itemProp="name">{tech.name}</span>
                    <meta itemProp="inDefinedTermSet" content={tech.category} />
                    <span className="ml-2 text-xs text-accent">
                      {tech.category}
                    </span>
                  </Badge>
                </li>
              ))}
            </ul>
          </div>

          {/* Capacidades (H3 por tarjeta) */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            itemProp="articleBody"
          >
            {capabilities.map((cap, i) => {
              const Icon = cap.icon;
              const titleId = `cap-title-${i}`;
              return (
                <Card
                  key={i}
                  className="group hover:shadow-glow-accent transition-all duration-300 hover:scale-105 bg-card/80 backdrop-blur-sm border-border/50"
                  role="article"
                  aria-labelledby={titleId}
                  itemScope
                  itemType="https://schema.org/DefinedTerm"
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-accent flex items-center justify-center mx-auto mb-4 group-hover:shadow-glow-accent transition-all duration-300">
                      <Icon
                        size={28}
                        className="text-accent-foreground"
                        aria-hidden="true"
                      />
                    </div>
                    <h3
                      id={titleId}
                      className="text-foreground font-semibold mb-3 text-lg leading-tight"
                      itemProp="name"
                    >
                      {cap.title}
                    </h3>
                    <p
                      className="text-muted-foreground text-sm leading-relaxed"
                      itemProp="description"
                    >
                      {cap.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Cinta de confianza */}
          <section
            role="region"
            aria-labelledby="dev-colombia"
            className="text-center mt-16 p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50"
          >
            <h3 id="dev-colombia" className="text-2xl font-bold text-foreground mb-4">
              Desarrollado 100% en Medellín, Colombia
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nuestro equipo de ingenieros en IA trabaja desde el corazón de la innovación
              tecnológica colombiana, creando soluciones que compiten a nivel mundial con talento local.
            </p>
          </section>
        </div>
      </section>

      {/* === NOSOTROS (H2 propio) === */}
      <section
        id="nosotros"
        role="region"
        aria-labelledby="about-title"
        className="container mx-auto px-6 mt-16 mb-4"
        itemScope
        itemType="https://schema.org/Organization"
      >
        <h2 id="about-title" className="text-3xl font-bold text-foreground mb-6 text-center">
          <span className="bg-gradient-primary bg-clip-text text-transparent">Nosotros</span>
        </h2>

        <div className="max-w-4xl mx-auto space-y-6 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-sm border border-primary/20 p-8">
          <p className="text-muted-foreground text-lg leading-relaxed">
            En Agentia, creemos en el poder del trabajo colectivo para conquistar el futuro.
            Nuestro equipo multidisciplinario opera entre <strong>Colombia y Panamá</strong> con un
            único objetivo: crear agentes de inteligencia artificial que redefinan procesos,
            impulsen la productividad y generen transformaciones reales en las organizaciones.
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Bajo el liderazgo de nuestro CEO, <strong>Alejandro Díaz —campeón mundial de robótica—</strong>,
            incorporamos experiencia en innovación tecnológica y visión disruptiva, sin perder jamás
            el valor principal: el talento de cada integrante de Agentia. Creamos soluciones de IA
            que impactan desde el primer día.
          </p>

          {/* microdatos mínimos */}
          <meta itemProp="name" content="SoyAgentia - Agent IA SAS" />
          <link itemProp="url" href="https://soyagentia.com/" />
          <meta itemProp="foundingDate" content="2024" />
          <meta itemProp="telephone" content="+57-300-900-6005" />
        </div>
      </section>

      {/* === FAQ (colapsable + JSON-LD) === */}
      <section
        id="faq"
        role="region"
        aria-labelledby="faq-title"
        className="container mx-auto px-6 mt-16 mb-8"
      >
        <h2 id="faq-title" className="text-3xl font-bold text-foreground mb-6 text-center">
          <span className="bg-gradient-primary bg-clip-text text-transparent">Preguntas frecuentes</span>
        </h2>

        <div className="max-w-4xl mx-auto space-y-3">
          {faqs.map((item, i) => (
            <details
              key={i}
              className="group rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm transition-all"
            >
              <summary
                className="cursor-pointer list-none select-none px-5 py-4 flex items-start justify-between gap-4"
                aria-controls={`faq-panel-${i}`}
                aria-expanded="false"
              >
                <h3 className="font-semibold text-foreground text-base leading-snug">
                  {item.q}
                </h3>
                <span
                  className="shrink-0 rounded-full w-6 h-6 grid place-items-center border border-border/60 text-sm transition-transform group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <div
                id={`faq-panel-${i}`}
                className="px-5 pb-5 pt-0 text-sm text-muted-foreground leading-relaxed"
              >
                {item.a}
              </div>
            </details>
          ))}
        </div>

        {/* JSON-LD para rich results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </section>
    </>
  );
};

export default TechSection;
