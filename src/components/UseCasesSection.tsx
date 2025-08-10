// src/components/UseCasesSection.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Phone,
  MessageSquare,
  ShoppingCart,
  CreditCard,
  Calendar,
  Bot,
  Target,
  Users,
} from "lucide-react";
import { useLocation } from "react-router-dom";

// Mapa de slugs -> etiqueta bonita
const CITY_LABEL: Record<string, string> = {
  medellin: "Medellín",
  bogota: "Bogotá",
  cali: "Cali",
  barranquilla: "Barranquilla",
  cartagena: "Cartagena",
  bucaramanga: "Bucaramanga",
  cucuta: "Cúcuta",
  pereira: "Pereira",
  manizales: "Manizales",
  armenia: "Armenia",
  ibague: "Ibagué",
  pasto: "Pasto",
  monteria: "Montería",
  neiva: "Neiva",
  villavicencio: "Villavicencio",
  popayan: "Popayán",
  sincelejo: "Sincelejo",
  tunja: "Tunja",
  yopal: "Yopal",
  riohacha: "Riohacha",
  quibdo: "Quibdó",
  florencia: "Florencia",
  mocoa: "Mocoa",
  mitu: "Mitú",
  "san-andres": "San Andrés",
  leticia: "Leticia",
  inirida: "Inírida",
  "puerto-carreno": "Puerto Carreño",
  "valledupar": "Valledupar",
  "santa-marta": "Santa Marta",
  "ciudad-de-panama": "Ciudad de Panamá",
};

// Lee la ciudad desde la ruta /ciudades/:slug/
function useCityFromPath() {
  const { pathname } = useLocation();
  const match = pathname.match(/^\/ciudades\/([^/]+)\/?$/);
  if (!match) return null; // Home u otras rutas => sin ciudad
  const slug = decodeURIComponent(match[1]);
  return CITY_LABEL[slug] ?? slug.replace(/-/g, " ");
}

const UseCasesSection = () => {
  const city = useCityFromPath();
  const cityText = city || "Colombia";

  const useCases = [
    {
      icon: Bot,
      title: "Consultoría tecnológica IA",
      description:
        "Análisis y recomendaciones automatizadas para optimizar procesos empresariales con inteligencia artificial.",
      features: ["Análisis automático", "Recomendaciones IA", "Optimización continua"],
    },
    {
      icon: Phone,
      title: "Ventas automáticas por voz",
      description:
        "Agentes que realizan hasta 10,000 llamadas en un minuto para contactar clientes y cerrar ventas automáticamente.",
      features: ["Llamadas masivas", "Reconocimiento de voz", "Seguimiento inteligente"],
    },
    {
      icon: MessageSquare,
      title: "Atención en redes sociales",
      description:
        "Robots que responden mensajes en WhatsApp, Instagram, Facebook y otras plataformas 24/7.",
      features: ["Respuestas instantáneas", "Múltiples plataformas", "Personalización"],
    },
    {
      icon: ShoppingCart,
      title: "Ventas conectadas al inventario",
      description:
        "IA integrada con tu ERP que ofrece productos personalizados según el stock y preferencias del cliente.",
      features: ["Integración ERP", "Ofertas personalizadas", "Inventario en tiempo real"],
    },
    {
      icon: CreditCard,
      title: "Recuperación de cartera",
      description:
        "Robots inteligentes que hacen seguimiento a facturas vencidas y gestionan cobros de manera automática.",
      features: ["Seguimiento automático", "Recordatorios inteligentes", "Gestión de cobros"],
    },
    {
      icon: Calendar,
      title: "Agendamiento automático",
      description:
        "Agentes que coordinan citas, confirman disponibilidad y envían recordatorios sin intervención humana.",
      features: ["Coordinación inteligente", "Confirmaciones automáticas", "Recordatorios"],
    },
    {
      icon: Target,
      title: "Campañas de marketing masivas",
      description:
        "Ejecución de campañas omnicanal con IA que segmenta audiencias y personaliza mensajes automáticamente.",
      features: ["Segmentación IA", "Omnicanal", "Personalización masiva"],
    },
    {
      icon: Users,
      title: "Generación de leads",
      description:
        "IA conversacional que identifica, califica y nutre leads potenciales en múltiples canales digitales.",
      features: ["Identificación automática", "Calificación inteligente", "Nutrición de leads"],
    },
  ];

  return (
    <section
      id="casos-de-uso" // 👈 coincide con tu Navbar
      role="region"
      aria-labelledby="casos-de-uso-title"
      className="py-20 bg-card/30"
      itemScope
      itemType="https://schema.org/Service"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2
            id="casos-de-uso-title"
            className="text-4xl md:text-5xl font-bold text-foreground mb-6"
            itemProp="name"
          >
            <span className="sr-only">Agentes IA {cityText} - </span>
            Casos de uso que{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              transforman negocios
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" itemProp="description">
            Nuestros <strong>agentes de IA en {cityText}</strong> se adaptan a cualquier industria y
            proceso empresarial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {useCases.map((useCase, index) => {
            const IconComponent = useCase.icon;
            const titleId = `usecase-title-${index}`;
            return (
              <Card
                key={index}
                className="group transition-all duration-300 hover:scale-105 backdrop-blur-sm bg-gradient-to-br from-accent/20 to-primary/10 border-accent/40 shadow-glow-accent hover:shadow-glow-primary"
                role="article"
                aria-labelledby={titleId}
                itemScope
                itemType="https://schema.org/Service"
                data-city={cityText}
              >
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 bg-gradient-to-br from-accent to-primary shadow-glow-accent group-hover:shadow-glow-primary">
                    <IconComponent size={24} className="text-background" aria-hidden="true" />
                  </div>
                  {/* h3 real para SEO semántico */}
                  <h3 id={titleId} className="text-foreground text-lg leading-tight" itemProp="name">
                    {useCase.title}
                  </h3>
                  {/* microdatos mínimos del Service */}
                  <meta itemProp="serviceType" content={useCase.title} />
                  <meta itemProp="areaServed" content={cityText} />
                  <link itemProp="url" href="https://soyagentia.com/" />
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed" itemProp="description">
                    {useCase.description}
                  </p>

                  {/* lista semántica de features */}
                  <ul className="space-y-2 mb-4">
                    {useCase.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-xs">
                        <span className="w-1 h-1 bg-accent rounded-full" aria-hidden="true" />
                        <span className="text-accent">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    aria-label={`Cotizar ${useCase.title} en ${cityText}`}
                    className="w-full bg-gradient-primary hover:shadow-glow-primary transition-all duration-300"
                    onClick={() =>
                      window.open(
                        "https://wa.me/573009006005?text=" +
                          encodeURIComponent(
                            `Hola, quiero cotizar el servicio de ${useCase.title} en ${cityText}`
                          ),
                        "_blank"
                      )
                    }
                  >
                    Cotiza ahora
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
