import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, Clock, TrendingUp, Users } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const CITY_LABEL: Record<string, string> = {
  medellin: "Medellín", bogota: "Bogotá", cali: "Cali", barranquilla: "Barranquilla",
  cartagena: "Cartagena", bucaramanga: "Bucaramanga", cucuta: "Cúcuta", pereira: "Pereira",
  manizales: "Manizales", armenia: "Armenia", ibague: "Ibagué", pasto: "Pasto",
  monteria: "Montería", neiva: "Neiva", villavicencio: "Villavicencio", popayan: "Popayán",
  sincelejo: "Sincelejo", tunja: "Tunja", yopal: "Yopal", riohacha: "Riohacha",
  quibdo: "Quibdó", florencia: "Florencia", mocoa: "Mocoa", mitu: "Mitú",
  "san-andres": "San Andrés", leticia: "Leticia", inirida: "Inírida",
  "puerto-carreno": "Puerto Carreño", valledupar: "Valledupar", "santa-marta": "Santa Marta",
  "ciudad-de-panama": "Ciudad de Panamá",
};

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
  const { t } = useLanguage();

  const waText = encodeURIComponent(`Hola, quiero implementar agentes de IA en ${cityText}.`);
  const waHref = `https://wa.me/573009006005?text=${waText}`;

  return (
    <section id="contacto" className="py-20 bg-gradient-to-br from-muted/50 to-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 border border-primary/20 rounded-full animate-pulse" />
        <div className="absolute bottom-20 right-16 w-24 h-24 border border-accent/20 rounded-full animate-pulse delay-500" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            {t("cta.title")}{" "}
            <span className="gradient-text">{t("cta.titleHighlight")}</span>{" "}
            {t("cta.titleEnd")}
          </h2>

          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            {t("cta.subtitle")}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Clock, value: "24/7", label: t("hero.stat.support") },
              { icon: Users, value: "10K", label: "calls/min" },
              { icon: TrendingUp, value: "ROI", label: "1st month" },
              { icon: MessageCircle, value: "100%", label: "Automated" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <s.icon className="text-accent mr-2" size={24} />
                  <span className="text-3xl font-bold text-foreground">{s.value}</span>
                </div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button asChild size="lg" className="bg-gradient-primary hover:shadow-glow-primary transition-all duration-300 text-xl px-12 py-8 group min-w-[280px]">
              <a href={waHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-3 group-hover:scale-110 transition-transform" size={24} />
                {t("cta.whatsapp")}
                <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" size={24} />
              </a>
            </Button>
          </div>

          <div className="mt-12 space-y-4">
            <p className="text-muted-foreground text-sm">
              ✓ {t("cta.trust1")} • ✓ {t("cta.trust2")} • ✓ {t("cta.trust3")}
            </p>
            <p className="text-accent font-medium">{t("cta.joinCompanies")}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
