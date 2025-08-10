// src/components/HeroSection.tsx
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Clock, TrendingUp, MapPin } from "lucide-react";
import heroImage from "@/assets/hero-ai-robot.jpg";
import { useLocation } from "react-router-dom";

// Mapa slug -> etiqueta bonita
const CITY_LABEL: Record<string, string> = {
  "medellin": "Medellín","bogota": "Bogotá","cali": "Cali","barranquilla": "Barranquilla",
  "cartagena": "Cartagena","bucaramanga": "Bucaramanga","cucuta": "Cúcuta","pereira": "Pereira",
  "manizales": "Manizales","armenia": "Armenia","ibague": "Ibagué","pasto": "Pasto",
  "monteria": "Montería","neiva": "Neiva","villavicencio": "Villavicencio","popayan": "Popayán",
  "sincelejo": "Sincelejo","tunja": "Tunja","yopal": "Yopal","riohacha": "Riohacha",
  "quibdo": "Quibdó","florencia": "Florencia","mocoa": "Mocoa","mitu": "Mitú",
  "san-andres": "San Andrés","leticia": "Leticia","inirida": "Inírida",
  "puerto-carreno": "Puerto Carreño","valledupar": "Valledupar","santa-marta": "Santa Marta",
  "ciudad-de-panama": "Ciudad de Panamá"
};

function useCityFromPath() {
  const { pathname } = useLocation();
  const match = pathname.match(/^\/ciudades\/([^/]+)\/?/);
  if (match?.[1]) {
    const slug = match[1];
    return CITY_LABEL[slug] ?? slug.replace(/-/g, " ");
  }
  return "Colombia";
}

const HeroSection = () => {
  const city = useCityFromPath();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero pt-16">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt={`Agentes de IA y automatización${city ? " en " + city : ""}`}
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background/95" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-primary/20 text-sm">
            <MapPin size={16} className="text-primary" />
            <span className="text-foreground">
              {city === "Colombia" ? "Cobertura nacional en Colombia" : `Cobertura en ${city} y todo el país`}
            </span>
          </div>

          {/* H1 PRINCIPAL (SEO) */}
          <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
            {city === "Colombia" ? (
              <>
                Agentes de IA en{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">Colombia</span>: ventas y automatización 24/7
              </>
            ) : (
              <>
                Agentes de IA en{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">{city}</span>: ventas y automatización 24/7
              </>
            )}
          </h1>

          {/* Subtítulo */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            <strong>Automatiza ventas, marketing y soporte</strong> con agentes conversacionales integrados a WhatsApp, web y CRM.
            <br className="hidden md:block" />
            Implementación ágil y soporte continuo para empresas {city === "Colombia" ? "en todo el país" : `en ${city}`}.
          </p>

          {/* Beneficios clave */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-accent">
              <Zap size={16} />
              <span>Aumento inmediato de productividad</span>
            </div>
            <div className="flex items-center gap-2 text-accent">
              <Clock size={16} />
              <span>Automatización 24/7</span>
            </div>
            <div className="flex items-center gap-2 text-accent">
              <TrendingUp size={16} />
              <span>ROI desde el primer mes</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button
              size="lg"
              className="bg-gradient-primary hover:shadow-glow-primary transition-all duration-300 text-lg px-8 py-6 group"
              onClick={() => window.open("https://wa.me/573009006005", "_blank")}
            >
              Contactar por WhatsApp
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-accent/50 text-accent hover:bg-accent/10 text-lg px-8 py-6"
              onClick={() => document.getElementById("casos-uso")?.scrollIntoView({ behavior: "smooth" })}
            >
              Ver casos de uso
            </Button>
          </div>

          {/* Trust indicator */}
          <p className="text-sm text-muted-foreground pt-4">
            Más que una agencia: desarrollo propio en IA y robótica para resultados medibles
          </p>
        </div>
      </div>

      {/* Animated accents */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-primary rounded-full animate-pulse" />
      <div className="absolute bottom-32 right-16 w-3 h-3 bg-accent rounded-full animate-pulse delay-500" />
      <div className="absolute top-1/2 left-4 w-1 h-1 bg-primary-glow rounded-full animate-pulse delay-1000" />
    </section>
  );
};

export default HeroSection;
