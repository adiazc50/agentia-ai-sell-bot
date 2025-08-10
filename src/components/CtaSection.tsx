import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, Clock, TrendingUp, Users } from "lucide-react";
import { useLocation } from "react-router-dom";

// Slug -> etiqueta
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

// Lee ciudad de /ciudades/:slug/
function useCityFromPath() {
  const { pathname } = useLocation();
  const match = pathname.match(/^\/ciudades\/([^/]+)\/?$/);
  if (!match) return null;
  const slug = decodeURIComponent(match[1]);
  return CITY_LABEL[slug] ?? slug.replace(/-/g, " ");
}

const CtaSection = () => {
  const city = useCityFromPath();
  const cityText = city || "Colombia";

  const waText = encodeURIComponent(
    `Hola, quiero implementar agentes de IA en ${cityText}. ¿Podemos agendar una demo?`
  );
  const waHref = `https://wa.me/573009006005?text=${waText}`;

  return (
    <section
      id="contacto"
      className="py-20 bg-gradient-to-br from-card to-background relative overflow-hidden"
      role="region"
      aria-labelledby="cta-title"
      itemScope
      itemType="https://schema.org/ContactPage"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 border border-primary/20 rounded-full animate-pulse" />
        <div className="absolute bottom-20 right-16 w-24 h-24 border border-accent/20 rounded-full animate-pulse delay-500" />
        <div className="absolute top-1/2 right-1/4 w-16 h-16 border border-primary-glow/20 rounded-full animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main CTA */}
          <h2
            id="cta-title"
            className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight"
          >
            <span className="sr-only">Contacta SoyAgentia {cityText} - </span>
            ¿Estás listo para tener un{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              robot vendiendo
            </span>{" "}
            por ti?
          </h2>

          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            No esperes más. <strong>Transforma tu empresa en {cityText}</strong>{" "}
            hoy mismo con <em>agentes de IA que trabajan 24/7</em> para hacer
            crecer tu negocio mientras tú te enfocas en lo que realmente importa.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12" aria-label="Indicadores clave">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="text-accent mr-2" size={24} />
                <span className="text-3xl font-bold text-foreground">24/7</span>
              </div>
              <p className="text-sm text-muted-foreground">Trabajo continuo</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="text-accent mr-2" size={24} />
                <span className="text-3xl font-bold text-foreground">10K</span>
              </div>
              <p className="text-sm text-muted-foreground">Llamadas/minuto</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="text-accent mr-2" size={24} />
                <span className="text-3xl font-bold text-foreground">ROI</span>
              </div>
              <p className="text-sm text-muted-foreground">Primer mes</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <MessageCircle className="text-accent mr-2" size={24} />
                <span className="text-3xl font-bold text-foreground">100%</span>
              </div>
              <p className="text-sm text-muted-foreground">Automatizado</p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-primary hover:shadow-glow-primary transition-all duration-300 text-xl px-12 py-8 group min-w-[280px]"
            >
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Contactar por WhatsApp - ${cityText}`}
                title={`Contactar por WhatsApp - ${cityText}`}
              >
                <MessageCircle className="mr-3 group-hover:scale-110 transition-transform" size={24} />
                Contáctanos por WhatsApp
                <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" size={24} />
              </a>
            </Button>
          </div>

          {/* Trust elements */}
          <div className="mt-12 space-y-4">
            <p className="text-muted-foreground text-sm">
              ✓ Implementación en 48 horas • ✓ Soporte técnico 24/7 • ✓ Garantía de resultados
            </p>
            <p className="text-accent font-medium">
              Únete a las empresas que ya están automatizando su futuro
            </p>
          </div>

          {/* Microdatos opcionales (ContactPoint) – accesibles y sin impacto visual */}
          <div className="sr-only" itemScope itemType="https://schema.org/ContactPoint">
            <meta itemProp="contactType" content="customer service" />
            <meta itemProp="telephone" content="+57-300-900-6005" />
            <meta itemProp="areaServed" content="CO" />
            <meta itemProp="availableLanguage" content="es" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
