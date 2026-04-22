// src/components/HeroSection.tsx
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, MapPin, MessageSquare, Zap, Clock, TrendingUp, Rocket, ShieldCheck } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

// Mapa slug -> etiqueta bonita
const CITY_LABEL: Record<string, string> = {
  "medellin": "Medellín", "bogota": "Bogotá", "cali": "Cali", "barranquilla": "Barranquilla",
  "cartagena": "Cartagena", "bucaramanga": "Bucaramanga", "cucuta": "Cúcuta", "pereira": "Pereira",
  "manizales": "Manizales", "armenia": "Armenia", "ibague": "Ibagué", "pasto": "Pasto",
  "monteria": "Montería", "neiva": "Neiva", "villavicencio": "Villavicencio", "popayan": "Popayán",
  "sincelejo": "Sincelejo", "tunja": "Tunja", "yopal": "Yopal", "riohacha": "Riohacha",
  "quibdo": "Quibdó", "florencia": "Florencia", "mocoa": "Mocoa", "mitu": "Mitú",
  "san-andres": "San Andrés", "leticia": "Leticia", "inirida": "Inírida",
  "puerto-carreno": "Puerto Carreño", "valledupar": "Valledupar", "santa-marta": "Santa Marta",
  "ciudad-de-panama": "Ciudad de Panamá"
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

const HeroSection = () => {
  const city = useCityFromPath();
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px] opacity-30" />
        <div className="absolute bottom-1/4 -right-1/4 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px] opacity-30" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="relative p-8 md:p-12 rounded-3xl overflow-hidden"
          >
            {/* Glowing border */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none">
              <div
                className="absolute -inset-0.5 rounded-3xl opacity-60 blur-[2px]"
                style={{ background: "conic-gradient(from 45deg, hsl(152 69% 41%), hsl(152 60% 36%), hsl(152 69% 41%))" }}
              />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary via-accent to-primary opacity-30" />
              <div className="absolute inset-[2px] rounded-3xl bg-background/95 backdrop-blur-xl" />
              <div className="absolute inset-[2px] rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
            </div>

            {/* Corner accents */}
            {[
              { pos: "top-0 left-0", border: "border-l-2 border-t-2", rounded: "rounded-tl-3xl", color: "border-primary" },
              { pos: "top-0 right-0", border: "border-r-2 border-t-2", rounded: "rounded-tr-3xl", color: "border-accent" },
              { pos: "bottom-0 left-0", border: "border-l-2 border-b-2", rounded: "rounded-bl-3xl", color: "border-accent" },
              { pos: "bottom-0 right-0", border: "border-r-2 border-b-2", rounded: "rounded-br-3xl", color: "border-primary" },
            ].map((corner, i) => (
              <div key={i} className={`absolute ${corner.pos} w-16 h-16 ${corner.border} ${corner.rounded} ${corner.color} opacity-60`} />
            ))}

            {/* Content */}
            <div className="relative z-10">
              {/* Location badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="flex justify-center mb-6"
              >
                <div className="relative">
                  <div
                    className="absolute -inset-1.5 rounded-2xl blur-md opacity-40"
                    style={{ background: "linear-gradient(90deg, hsl(152 69% 41%), hsl(152 60% 36%))" }}
                  />
                  <div
                    className="absolute -inset-[3px] rounded-2xl"
                    style={{ border: "2px solid hsl(152 69% 41% / 0.6)", boxShadow: "0 0 10px 3px hsl(152 69% 41% / 0.3), 0 0 25px 6px hsl(152 69% 41% / 0.15)" }}
                  />
                  <div className="relative flex items-center gap-3 px-6 py-3 rounded-2xl border border-primary/40 bg-card/95 backdrop-blur-xl">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
                      <ShieldCheck className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="text-left">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                        {t("hero.worldwide")}
                      </span>
                      <p className="text-sm font-bold text-foreground leading-tight">
                        {city ? t("hero.cityAndWorld", { city }) : t("hero.countriesCities")}
                      </p>
                      <p className="text-xs text-muted-foreground">{t("hero.implementation")}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Badges */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/15 to-accent/15 border border-primary/40"
                >
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm text-primary font-semibold">{city ? t("hero.badge.aiAgents", { city }) : t("hero.badge.aiAgentsOnly")}</span>
                  <Zap className="w-4 h-4 text-accent" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.45 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-accent/15 to-primary/15 border border-accent/40"
                >
                  <Rocket className="w-4 h-4 text-accent" />
                  <span className="text-sm text-accent font-semibold">{t("hero.badge.quickSetup")}</span>
                </motion.div>
              </div>

              {/* H1 PRINCIPAL (SEO) */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-foreground"
              >
                {city ? (
                  <>
                    {t("hero.aiAgentsIn")}{" "}
                    <span className="relative inline-block">
                      <span className="gradient-text drop-shadow-[0_0_25px_hsl(152_69%_41%/0.3)]">{city}</span>
                      <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary rounded-full opacity-80" />
                    </span>
                  </>
                ) : (
                  <span className="relative inline-block">
                    <span className="gradient-text drop-shadow-[0_0_25px_hsl(152_69%_41%/0.3)]">{t("hero.aiAgentsTitle")}</span>
                    <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary rounded-full opacity-80" />
                  </span>
                )}
              </motion.h1>

              {/* Subtítulo */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
              >
                {t("hero.subtitle")}
                {" "}{city ? t("hero.subtitleCity", { city }) : t("hero.subtitleGeneric")}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.65 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-50 group-hover:opacity-80 transition-opacity" />
                  <Button
                    size="lg"
                    className="relative bg-gradient-to-r from-primary to-accent hover:shadow-glow-primary transition-all duration-300 text-lg px-8 py-6 group text-primary-foreground"
                    onClick={() => window.open("https://wa.me/573009006005", "_blank")}
                  >
                    {t("hero.ctaWhatsapp")}
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </Button>
                </motion.div>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary/50 text-primary hover:bg-primary/10 text-lg px-8 py-6"
                  onClick={() => window.location.href = '/casos-de-uso'}
                >
                  {t("hero.ctaUseCases")}
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="grid grid-cols-3 gap-4 md:gap-8 mt-12 max-w-2xl mx-auto"
              >
                {[
                  { value: "5 min", label: t("hero.stat.implementation") },
                  { value: "<3s", label: t("hero.stat.responseTime") },
                  { value: "24/7", label: t("hero.stat.support") },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="relative text-center p-4 md:p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                    whileHover={{ y: -4 }}
                  >
                    <div className="text-2xl md:text-4xl font-bold gradient-text">{stat.value}</div>
                    <div className="text-xs md:text-sm text-muted-foreground mt-2">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Trust line */}
              <p className="text-sm text-muted-foreground pt-6">
                {t("hero.trustLine")}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="absolute top-1/3 left-6 hidden lg:block"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 rounded-2xl blur-lg" />
            <div className="glass-card p-4 relative">
              <Bot className="w-8 h-8 text-primary" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="absolute bottom-1/3 right-6 hidden lg:block"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-accent/30 rounded-2xl blur-lg" />
            <div className="glass-card p-4 relative">
              <MessageSquare className="w-8 h-8 text-accent" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
