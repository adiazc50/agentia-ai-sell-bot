import React from "react";
import { motion } from "framer-motion";
import { Trophy, Users, Globe, Rocket, Bot, Brain, Target, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

const AGENTIA_URL = "https://www.agentia.com.co";

const VALUE_ICONS = [Brain, Users, Target, Globe];

const Nosotros: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const values = VALUE_ICONS.map((icon, i) => ({
    icon,
    title: t(`about.value${i + 1}.title`),
    description: t(`about.value${i + 1}.desc`),
  }));

  const stats = [
    { value: "31+", label: t("about.citiesCovered") },
    { value: "5", label: t("about.platformsIntegrated") },
    { value: "24/7", label: t("about.continuousSupport") },
    { value: "<3s", label: t("about.aiResponseTime") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:bg-accent focus:text-accent-foreground focus:px-3 focus:py-2 focus:rounded-md"
      >
        {t("common.skipToContent")}
      </a>

      <Navbar />
      <WhatsAppButton />

      <main id="main-content" role="main" className="pt-16">
        {/* Hero */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px] opacity-40" />
            <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-accent/15 rounded-full blur-[120px] opacity-40" />
          </div>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
              >
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">{t("about.team")}</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8 text-foreground"
              >
                {t("about.title")}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 leading-relaxed"
              >
                {t("about.p1")}{" "}
                <strong className="text-foreground">
                  {t("about.p1Bold")}
                </strong>
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
              >
                {t("about.p2")}{" "}
                <strong className="text-foreground">{t("about.p2Name")}</strong> —
                <span className="gradient-text font-semibold">{t("about.p2Title")}</span>—
                {t("about.p2End")}
              </motion.p>
            </div>
          </div>
        </section>

        {/* CEO highlight */}
        <section className="py-16 relative">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <div className="relative p-8 md:p-12 rounded-3xl overflow-hidden">
                {/* Border glow */}
                <div className="absolute inset-0 rounded-3xl pointer-events-none">
                  <div className="absolute -inset-0.5 rounded-3xl opacity-60 blur-[2px]" style={{ background: "conic-gradient(from 45deg, hsl(152 69% 41%), hsl(152 60% 36%), hsl(152 69% 41%))" }} />
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary via-accent to-primary opacity-30" />
                  <div className="absolute inset-[2px] rounded-3xl bg-background/95 backdrop-blur-xl" />
                  <div className="absolute inset-[2px] rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                  {/* Trophy icon */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#FFD700]/20 rounded-full blur-xl" />
                      <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center shadow-xl shadow-[#FFD700]/30">
                        <Trophy className="w-12 h-12 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="text-center md:text-left">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">{t("about.p2Name")}</h2>
                    <p className="text-primary font-semibold mb-4">{t("about.ceoRole")}</p>
                    <p className="text-muted-foreground leading-relaxed">{t("about.ceoBio")}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="text-center p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20"
                >
                  <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                {t("about.valuesTitle")}{" "}
                <span className="gradient-text">{t("about.valuesHighlight")}</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {t("about.valuesSubtitle")}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-card p-6 group hover:border-primary/30 hover:glow-primary transition-all duration-500"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-muted/50 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Bot className="w-16 h-16 text-primary mx-auto mb-6" />
                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                  {t("about.ctaTitle")}{" "}
                  <span className="gradient-text">{t("about.ctaHighlight")}</span>?
                </h2>
                <p className="text-xl text-muted-foreground mb-10">
                  {t("about.ctaSubtitle")}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-50 group-hover:opacity-80 transition-opacity" />
                    <Button
                      size="lg"
                      className="relative bg-gradient-to-r from-primary to-accent text-primary-foreground text-lg px-8 py-6"
                      onClick={() => {
                        navigate("/");
                        setTimeout(() => {
                          document.getElementById("planes")?.scrollIntoView({ behavior: "smooth" });
                        }, 500);
                      }}
                    >
                        {t("about.ctaButton")}
                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                    </Button>
                  </motion.div>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-primary/50 text-primary hover:bg-primary/10 text-lg px-8 py-6"
                    asChild
                  >
                    <a href="/#planes">{t("about.ctaPlans")}</a>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
};

export default Nosotros;
