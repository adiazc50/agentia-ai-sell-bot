import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MessageSquare, CreditCard, Calendar, Bot, Target, Rocket } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
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

const CASE_NUMBERS = [1, 2, 3, 5, 6, 7];
const ICONS = [Bot, Phone, MessageSquare, CreditCard, Calendar, Target];

const UseCasesSection = () => {
  const city = useCityFromPath();
  const cityText = city || "Colombia";
  const { t } = useLanguage();
  const navigate = useNavigate();

  const goToPlanes = () => {
    const el = document.getElementById("planes");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        document.getElementById("planes")?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  };

  const useCases = CASE_NUMBERS.map((n, i) => ({
    icon: ICONS[i],
    title: t(`usecases.case${n}.title`),
    description: t(`usecases.case${n}.desc`),
    features: [t(`usecases.case${n}.f1`), t(`usecases.case${n}.f2`), t(`usecases.case${n}.f3`)],
  }));

  return (
    <section id="casos-de-uso" role="region" aria-labelledby="casos-de-uso-title" className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 id="casos-de-uso-title" className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t("usecases.title")}{" "}
            <span className="gradient-text">{t("usecases.titleHighlight")}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("usecases.subtitle", { city: cityText })}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {useCases.map((useCase, index) => {
            const IconComponent = useCase.icon;
            return (
              <Card key={index} className="group transition-all duration-300 hover:scale-105 hover:-translate-y-1 glass-card border-primary/20 shadow-card hover:shadow-glow-primary">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 bg-gradient-to-br from-primary to-accent shadow-glow-primary group-hover:shadow-glow-accent">
                    <IconComponent size={24} className="text-primary-foreground" />
                  </div>
                  <h3 className="text-foreground text-lg leading-tight">{useCase.title}</h3>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{useCase.description}</p>
                  <ul className="space-y-2 mb-4">
                    {useCase.features.map((feature, fi) => (
                      <li key={fi} className="flex items-center gap-2 text-xs">
                        <span className="w-1 h-1 bg-accent rounded-full" />
                        <span className="text-accent">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full bg-gradient-primary hover:shadow-glow-primary transition-all duration-300"
                    onClick={() =>
                      window.open("https://wa.me/573009006005?text=" + encodeURIComponent(`${useCase.title} - ${cityText}`), "_blank")
                    }
                  >
                    {t("usecases.quote")}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA to pricing */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col items-center gap-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 rounded-2xl px-10 py-8 shadow-lg">
            <Rocket className="w-8 h-8 text-emerald-500" />
            <h3 className="text-2xl font-bold text-slate-900">
              {t("usecases.ctaTitle") !== "usecases.ctaTitle" ? t("usecases.ctaTitle") : "¿Listo para automatizar tu negocio?"}
            </h3>
            <p className="text-slate-500 max-w-md">
              {t("usecases.ctaSubtitle") !== "usecases.ctaSubtitle" ? t("usecases.ctaSubtitle") : "Elige el plan que mejor se adapte a tus necesidades y comienza hoy mismo."}
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-bold px-10 py-3 text-lg rounded-full shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-emerald-500/40 hover:scale-105"
              onClick={goToPlanes}
            >
              {t("usecases.ctaButton") !== "usecases.ctaButton" ? t("usecases.ctaButton") : "Ver planes y precios"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
