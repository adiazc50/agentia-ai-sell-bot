import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, Clock, ShieldCheck, Zap, BarChart3 } from "lucide-react";
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

  const waText = encodeURIComponent(
    city
      ? `Hola, quiero implementar mi agente de IA en ${city}.`
      : "Hola, quiero implementar mi agente de IA."
  );
  const waHref = `https://wa.me/573009006005?text=${waText}`;

  return (
    <section
      id="contacto"
      className="relative py-28 overflow-hidden bg-white"
    >
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-[0.07] blur-[120px]"
        style={{ background: "radial-gradient(ellipse, hsl(152 69% 41%), transparent 70%)" }}
      />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">

          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-emerald-600 text-sm font-medium tracking-wide uppercase">
                {t("cta.joinCompanies")}
              </span>
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold text-center leading-[1.1] mb-6 tracking-tight">
            <span className="text-slate-900">{t("cta.title")}{" "}</span>
            <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
              {t("cta.titleHighlight")}
            </span>
            <span className="text-slate-900">{" "}{t("cta.titleEnd")}</span>
          </h2>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-slate-500 text-center max-w-3xl mx-auto mb-14 leading-relaxed">
            {t("cta.subtitle")}
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto mb-14">
            {[
              { icon: Zap, value: "5 min", label: t("cta.trust1") },
              { icon: Clock, value: "24/7", label: t("cta.trust2") },
              { icon: BarChart3, value: "100%", label: t("cta.trust3") },
            ].map((stat, i) => (
              <div
                key={i}
                className="group relative text-center p-6 rounded-2xl border border-slate-200 bg-slate-50/50 transition-all duration-300 hover:border-emerald-500/30 hover:bg-emerald-50/50 hover:shadow-lg hover:shadow-emerald-500/5"
              >
                <stat.icon className="mx-auto mb-3 text-emerald-500 opacity-70 group-hover:opacity-100 transition-opacity" size={22} />
                <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-1 tracking-tight">{stat.value}</div>
                <div className="text-xs md:text-sm text-slate-400 font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a href={waHref} target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="h-14 px-10 text-base font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.45)] transition-all duration-300"
              >
                <MessageCircle className="mr-2" size={20} />
                {t("cta.whatsapp")}
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </a>
          </div>

          {/* Trust line */}
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {[t("cta.trust1"), t("cta.trust2"), t("cta.trust3")].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <ShieldCheck className="text-emerald-500/70" size={16} />
                <span className="text-sm text-slate-400">{item}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default CtaSection;
