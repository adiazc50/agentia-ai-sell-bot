import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Award, Check, Sparkles } from "lucide-react";

const WhatsAppIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);
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
  const match = pathname.match(/^\/ciudades\/([^/]+)\/?/);
  if (match?.[1]) {
    const slug = match[1];
    return CITY_LABEL[slug] ?? slug.replace(/-/g, " ");
  }
  return null;
}

const ROTATE_KEYS = [
  "cta.rotate.0",
  "cta.rotate.1",
  "cta.rotate.2",
  "cta.rotate.3",
  "cta.rotate.4",
  "cta.rotate.5",
];

const PLATFORM_ICONS = [
  { name: "WhatsApp", color: "#25D366", svg: <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/> },
  { name: "Instagram", color: "#E4405F", svg: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/> },
  { name: "Messenger", color: "#0084FF", svg: <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.15.26.36.27.58l.05 1.82c.02.56.59.92 1.1.69l2.03-.89c.17-.08.36-.1.55-.06.88.24 1.82.37 2.86.37 5.64 0 10-4.13 10-9.7C22 6.13 17.64 2 12 2zm5.89 7.47-2.89 4.58c-.46.73-1.44.91-2.12.39l-2.3-1.72a.6.6 0 00-.72 0l-3.1 2.35c-.41.31-.95-.17-.68-.61l2.89-4.58c.46-.73 1.44-.91 2.12-.39l2.3 1.72a.6.6 0 00.72 0l3.1-2.35c.41-.31.95.17.68.61z"/> },
  { name: "TikTok", color: "#000000", svg: <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 010-5.78c.27 0 .54.04.8.1v-3.5a6.37 6.37 0 00-.8-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.05a8.27 8.27 0 004.84 1.56V7.16a4.83 4.83 0 01-1.08-.47z"/> },
  { name: "WordPress", color: "#21759B", svg: <path d="M12.158 12.786l-2.698 7.84c.806.236 1.657.365 2.54.365 1.047 0 2.051-.18 2.986-.51a.473.473 0 01-.04-.076l-2.788-7.62zM3.009 12c0 3.56 2.07 6.634 5.068 8.093L3.788 8.341A8.975 8.975 0 003.009 12zm17.159-1.06c0-1.112-.399-1.881-.741-2.48-.456-.741-.883-1.368-.883-2.109 0-.826.627-1.596 1.51-1.596.04 0 .078.005.116.007A8.963 8.963 0 0012 3.009c-3.36 0-6.317 1.725-8.037 4.338.226.007.44.011.62.011 1.006 0 2.565-.122 2.565-.122.519-.03.58.731.061.792 0 0-.521.061-1.101.091l3.502 10.42 2.105-6.312-1.497-4.108c-.519-.03-1.01-.091-1.01-.091-.518-.03-.457-.822.062-.792 0 0 1.59.122 2.534.122 1.007 0 2.566-.122 2.566-.122.519-.03.579.731.061.792 0 0-.522.061-1.101.091l3.474 10.337.96-3.2c.414-1.327.731-2.28.731-3.1zM20.991 12c0 3.083-1.607 5.79-4.03 7.335l2.474-7.152c.462-1.155.616-2.08.616-2.903 0-.298-.02-.575-.055-.834.64 1.114 1.003 2.394 1.003 3.756L20.991 12zM12 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/> },
];

const HeroSection = () => {
  const city = useCityFromPath();
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ROTATE_KEYS.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  const waText = encodeURIComponent(
    city
      ? `Hola, quiero implementar mi agente de IA en ${city}.`
      : "Hola, quiero implementar mi agente de IA."
  );
  const waHref = `https://wa.me/573009006005?text=${waText}`;

  const painPoints = [
    "Agente de IA que responde al instante, incluso a las 3 AM",
    "Vende, asesora y agenda citas sin intervención humana",
    "Clasifica cada lead en tu CRM automáticamente",
    "Hace seguimiento inteligente hasta cerrar la venta",
    "Disponible en WhatsApp, Instagram, Messenger, TikTok y página web",
  ];

  return (
    <section
      id="contacto"
      className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0">
        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Emerald glow top-left */}
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.07] blur-[120px]"
          style={{ background: "radial-gradient(circle, hsl(152 69% 41%), transparent 70%)" }}
        />
        {/* Teal glow bottom-right */}
        <div
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.05] blur-[120px]"
          style={{ background: "radial-gradient(circle, hsl(170 60% 45%), transparent 70%)" }}
        />
        {/* Accent line top */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 pt-24 pb-20">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-14 lg:gap-20">

          {/* Left — Main content */}
          <div className="flex-1 text-center lg:text-left">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center lg:justify-start mb-7"
            >
              <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-emerald-500/15 bg-white shadow-sm shadow-emerald-500/5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-slate-700 text-sm font-semibold tracking-wide">
                  {city
                    ? t("hero.badge.aiAgents", { city })
                    : t("cta.joinCompanies")}
                </span>
              </div>
            </motion.div>

            {/* H1 with rotating text */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-[3.5rem] lg:text-6xl font-extrabold leading-[1.08] tracking-tight mb-6"
            >
              <span className="text-slate-900">{t("cta.title")}{" "}</span>
              <span className="inline-block relative min-w-[200px] sm:min-w-[260px]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentIndex}
                    initial={{ y: 40, opacity: 0, filter: "blur(8px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: -40, opacity: 0, filter: "blur(8px)" }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-block bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 bg-clip-text text-transparent"
                  >
                    {t(ROTATE_KEYS[currentIndex])}
                  </motion.span>
                </AnimatePresence>
                {/* Underline accent */}
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 opacity-40"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                />
              </span>
              <br className="hidden sm:block" />
              <span className="text-slate-900">{t("cta.titleEnd")}</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-500 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed font-medium"
            >
              {t("cta.subtitle")}
            </motion.p>

            {/* Checklist */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.3 }}
              className="space-y-3 max-w-lg mx-auto lg:mx-0 mb-10 text-left"
            >
              {painPoints.map((point, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.35 + i * 0.08 }}
                  className="flex items-start gap-3 group"
                >
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                    <CheckCircle2 className="text-emerald-600" size={14} />
                  </div>
                  <span className="text-[15px] text-slate-600 leading-snug">{point}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.45 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <a href={waHref} target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  className="h-14 px-10 text-base font-bold rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-[0_8px_32px_rgba(16,185,129,0.3)] hover:shadow-[0_12px_40px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  <WhatsAppIcon size={22} className="mr-2.5" />
                  {t("cta.whatsapp")}
                  <ArrowRight className="ml-2.5" size={18} />
                </Button>
              </a>
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-10 text-base font-bold rounded-2xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-300"
                onClick={() => (window.location.href = "/casos-de-uso")}
              >
                {t("hero.ctaUseCases")}
              </Button>
            </motion.div>

          </div>

          {/* Right — Partner Diploma + Platform Icons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-full lg:w-[380px] shrink-0"
          >
            <div className="relative group">
              {/* Outer glow */}
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-amber-400/15 via-yellow-300/20 to-amber-500/15 blur-2xl group-hover:from-amber-400/25 group-hover:via-yellow-300/30 group-hover:to-amber-500/25 transition-all duration-700" />

              {/* Card */}
              <div className="relative rounded-3xl border border-amber-300/50 bg-gradient-to-br from-amber-50/90 via-white to-yellow-50/70 overflow-hidden shadow-xl shadow-amber-900/5">
                {/* Gold ribbon top */}
                <div className="w-full h-2 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400" />

                {/* Decorative corner accents */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-amber-300/50 rounded-tl-lg" />
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-300/50 rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-amber-300/50 rounded-bl-lg" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-amber-300/50 rounded-br-lg" />

                <div className="px-8 py-10 flex flex-col items-center text-center gap-4">
                  {/* Award icon with sparkle */}
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-400/30 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                      <Award className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 border-[3px] border-white flex items-center justify-center shadow-md">
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    </div>
                    <Sparkles className="absolute -top-3 -left-2 w-5 h-5 text-amber-400 animate-pulse" />
                  </div>

                  {/* Label */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-amber-600/80">
                      {t("hero.certified")}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent to-amber-300/50" />
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <div className="flex-1 h-px bg-gradient-to-l from-transparent to-amber-300/50" />
                  </div>

                  {/* Platform icons row */}
                  <div className="flex items-center justify-center gap-3 py-2">
                    {PLATFORM_ICONS.map((platform) => (
                      <div
                        key={platform.name}
                        className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border border-slate-100 bg-white hover:scale-110 hover:shadow-md transition-all duration-300 cursor-default"
                        title={platform.name}
                      >
                        <svg viewBox="0 0 24 24" className="w-5 h-5" fill={platform.color}>
                          {platform.svg}
                        </svg>
                      </div>
                    ))}
                  </div>

                  {/* Platform names */}
                  <h3 className="text-base font-bold text-slate-800 leading-tight tracking-tight">
                    {t("hero.officialPartner")}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                    {t("hero.certifiedDesc")}
                  </p>

                  {/* Bottom ribbon */}
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent mt-1" />
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
