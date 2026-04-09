import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Bot, MessageSquare, Rocket, Sparkles, Zap, ExternalLink,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import PricingSection from "@/components/PricingSection";
import { platforms } from "@/data/platforms";
import type { PlatformConfig } from "@/data/platforms";
import { useLanguage } from "@/contexts/LanguageContext";

const AGENTIA_URL = "https://www.agentia.com.co";

/* ───────────────── Hero ───────────────── */
const PlatformHero: React.FC<{ p: PlatformConfig }> = ({ p }) => {
  const { t } = useLanguage();
  return (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
    {/* Background blobs */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute top-1/4 -left-1/4 w-[400px] h-[400px] rounded-full blur-[100px] opacity-30"
        style={{ background: `${p.color}33` }}
      />
      <div
        className="absolute bottom-1/4 -right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] opacity-30"
        style={{ background: `${p.colorAlt}33` }}
      />
    </div>

    {/* Grid pattern */}
    <div className="absolute inset-0 pointer-events-none">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to right, ${p.color}0D 1px, transparent 1px), linear-gradient(to bottom, ${p.color}0D 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />
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
              style={{ background: `conic-gradient(from 45deg, ${p.color}, ${p.colorAlt}, ${p.color})` }}
            />
            <div
              className="absolute inset-0 rounded-3xl opacity-30"
              style={{ background: `linear-gradient(to right, ${p.color}, ${p.colorAlt}, ${p.color})` }}
            />
            <div className="absolute inset-[2px] rounded-3xl bg-background/95 backdrop-blur-xl" />
            <div
              className="absolute inset-[2px] rounded-3xl"
              style={{ background: `linear-gradient(to bottom right, ${p.color}0D, transparent, ${p.colorAlt}0D)` }}
            />
          </div>

          {/* Corner accents */}
          {[
            { pos: "top-0 left-0", border: "border-l-2 border-t-2", rounded: "rounded-tl-3xl" },
            { pos: "top-0 right-0", border: "border-r-2 border-t-2", rounded: "rounded-tr-3xl" },
            { pos: "bottom-0 left-0", border: "border-l-2 border-b-2", rounded: "rounded-bl-3xl" },
            { pos: "bottom-0 right-0", border: "border-r-2 border-b-2", rounded: "rounded-br-3xl" },
          ].map((corner, i) => (
            <div
              key={i}
              className={`absolute ${corner.pos} w-16 h-16 ${corner.border} ${corner.rounded} opacity-60`}
              style={{ borderColor: i % 2 === 0 ? p.color : p.colorAlt }}
            />
          ))}

          {/* Content */}
          <div className="relative z-10">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <div
                  className="absolute -inset-1.5 rounded-2xl blur-md opacity-40"
                  style={{ background: `linear-gradient(90deg, ${p.color}, ${p.colorAlt})` }}
                />
                <div
                  className="absolute -inset-[3px] rounded-2xl"
                  style={{
                    border: `2px solid ${p.color}99`,
                    boxShadow: `0 0 10px 3px ${p.color}4D, 0 0 25px 6px ${p.color}26`,
                  }}
                />
                <div
                  className="relative flex items-center gap-3 px-6 py-3 rounded-2xl bg-card/95 backdrop-blur-xl"
                  style={{ borderColor: `${p.color}66`, borderWidth: 1, borderStyle: "solid" }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                    style={{
                      background: `linear-gradient(to bottom right, ${p.color}, ${p.colorAlt})`,
                      boxShadow: `0 10px 15px -3px ${p.color}4D`,
                    }}
                  >
                    <p.badgeIcon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-left">
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: p.color }}
                    >
                      {t("platform.certified")}
                    </span>
                    <h3 className="text-sm md:text-base font-bold text-foreground leading-tight">
                      {t(`${p.i18n}.badge`)}
                    </h3>
                    <p className="text-xs text-muted-foreground">{t(`${p.i18n}.badgeSub`)}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature pills */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border"
                style={{
                  background: `linear-gradient(to right, ${p.color}1A, ${p.colorAlt}1A)`,
                  borderColor: `${p.color}66`,
                }}
              >
                <Zap className="w-4 h-4" style={{ color: p.color }} />
                <span className="text-sm font-semibold" style={{ color: p.color }}>
                  {t("platform.aiAutomation")}
                </span>
                <Sparkles className="w-4 h-4" style={{ color: p.colorAlt }} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border"
                style={{
                  background: `linear-gradient(to right, ${p.colorAlt}1A, ${p.color}1A)`,
                  borderColor: `${p.colorAlt}66`,
                }}
              >
                <Rocket className="w-4 h-4" style={{ color: p.colorAlt }} />
                <span className="text-sm font-semibold" style={{ color: p.colorAlt }}>
                  {t("platform.immediateSetup")}
                </span>
              </motion.div>
            </div>

            {/* H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-foreground"
            >
              {t(`${p.i18n}.headline`)}{" "}
              <span className="relative inline-block">
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${p.color}, ${p.colorAlt})`,
                    filter: `drop-shadow(0 0 25px ${p.color}4D)`,
                  }}
                >
                  {p.name}
                </span>
                <span
                  className="absolute -bottom-2 left-0 right-0 h-1 rounded-full opacity-80"
                  style={{ background: `linear-gradient(to right, ${p.color}, ${p.colorAlt}, ${p.color})` }}
                />
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            >
              {t(`${p.i18n}.subtitle`)}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="relative group">
                <div
                  className="absolute -inset-1 rounded-xl blur opacity-50 group-hover:opacity-80 transition-opacity"
                  style={{ background: `linear-gradient(to right, ${p.color}, ${p.colorAlt})` }}
                />
                <Button
                  size="lg"
                  className="relative transition-all duration-300 text-lg px-8 py-6 group text-white"
                  style={{ background: `linear-gradient(to right, ${p.color}, ${p.colorAlt})` }}
                  asChild
                >
                  <a href={AGENTIA_URL} target="_blank" rel="noopener noreferrer">
                    {t("platform.startNow")}
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </a>
                </Button>
              </motion.div>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6"
                style={{ borderColor: `${p.color}80`, color: p.color }}
                asChild
              >
                <a href={AGENTIA_URL} target="_blank" rel="noopener noreferrer">
                  {t("platform.viewPlans")}
                  <ExternalLink className="ml-2" size={16} />
                </a>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="grid grid-cols-3 gap-4 md:gap-8 mt-12 max-w-2xl mx-auto"
            >
              {p.statValues.map((value, index) => (
                <motion.div
                  key={index}
                  className="relative text-center p-4 md:p-6 rounded-xl border"
                  style={{
                    background: `linear-gradient(to bottom right, ${p.color}1A, ${p.colorAlt}0D)`,
                    borderColor: `${p.color}33`,
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <div
                    className="text-2xl md:text-4xl font-bold bg-clip-text text-transparent"
                    style={{ backgroundImage: `linear-gradient(135deg, ${p.color}, ${p.colorAlt})` }}
                  >
                    {value}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground mt-2">{t(`${p.i18n}.s${index + 1}`)}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Floating elements */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute top-1/3 left-6 hidden lg:block"
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl blur-lg" style={{ background: `${p.color}4D` }} />
          <div className="glass-card p-4 relative">
            <Bot className="w-8 h-8" style={{ color: p.color }} />
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
          <div className="absolute inset-0 rounded-2xl blur-lg" style={{ background: `${p.colorAlt}4D` }} />
          <div className="glass-card p-4 relative">
            <MessageSquare className="w-8 h-8" style={{ color: p.colorAlt }} />
          </div>
        </div>
      </motion.div>
    </div>
  </section>
  );
};

/* ───────────────── Features ───────────────── */
const PlatformFeatures: React.FC<{ p: PlatformConfig }> = ({ p }) => {
  const { t } = useLanguage();
  return (
  <section className="py-24 relative">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          {t("platform.whatCanDo")}{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: `linear-gradient(135deg, ${p.color}, ${p.colorAlt})` }}
          >
            {t("platform.agentIA")}
          </span>{" "}
          {t("platform.in")} {p.name}?
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {t("platform.featuresSubtitle", { platform: p.name })}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {p.featureIcons.map((Icon, index) => {
          const n = index + 1;
          return (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-6 group transition-all duration-500 hover:border-opacity-30"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = `${p.color}4D`;
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 40px ${p.color}1F`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "";
                (e.currentTarget as HTMLElement).style.boxShadow = "";
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300"
                style={{ background: `linear-gradient(to bottom right, ${p.color}33, ${p.colorAlt}33)` }}
              >
                <Icon className="w-6 h-6" style={{ color: p.color }} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t(`${p.i18n}.f${n}.t`)}</h3>
              <p className="text-muted-foreground">{t(`${p.i18n}.f${n}.d`)}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
  );
};

/* ───────────────── CTA ───────────────── */
const PlatformCta: React.FC<{ p: PlatformConfig }> = ({ p }) => {
  const { t } = useLanguage();
  return (
  <section className="py-20 relative overflow-hidden">
    {/* Background */}
    <div className="absolute inset-0 opacity-20">
      <div
        className="absolute top-10 left-10 w-32 h-32 border rounded-full animate-pulse"
        style={{ borderColor: `${p.color}33` }}
      />
      <div
        className="absolute bottom-20 right-16 w-24 h-24 border rounded-full animate-pulse"
        style={{ borderColor: `${p.colorAlt}33`, animationDelay: "500ms" }}
      />
      <div
        className="absolute top-1/2 right-1/4 w-16 h-16 border rounded-full animate-pulse"
        style={{ borderColor: `${p.color}33`, animationDelay: "1000ms" }}
      />
    </div>

    <div className="container mx-auto px-6 relative z-10">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight"
        >
          {t(`${p.i18n}.cta`).split(p.name)[0]}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: `linear-gradient(135deg, ${p.color}, ${p.colorAlt})` }}
          >
            {p.name}
          </span>
          {t(`${p.i18n}.cta`).split(p.name)[1] || "?"}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto"
        >
          {t(`${p.i18n}.ctaSub`)}
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="relative group">
            <div
              className="absolute -inset-1 rounded-xl blur opacity-50 group-hover:opacity-80 transition-opacity"
              style={{ background: `linear-gradient(to right, ${p.color}, ${p.colorAlt})` }}
            />
            <Button
              asChild
              size="lg"
              className="relative transition-all duration-300 text-xl px-12 py-8 group min-w-[280px] text-white"
              style={{ background: `linear-gradient(to right, ${p.color}, ${p.colorAlt})` }}
            >
              <a href={AGENTIA_URL} target="_blank" rel="noopener noreferrer">
                <p.icon className="mr-3 group-hover:scale-110 transition-transform" size={24} />
                {t("platform.buyNow")}
                <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" size={24} />
              </a>
            </Button>
          </motion.div>
        </motion.div>

        {/* Trust elements */}
        <div className="mt-12 space-y-4">
          <p className="text-muted-foreground text-sm">
            {t("platform.trustSetup")} &bull; {t("platform.trustSupport")} &bull; {t("platform.trustResults")}
          </p>
          <p className="font-medium" style={{ color: p.color }}>
            {t("platform.joinCompanies", { platform: p.name })}
          </p>
        </div>
      </div>
    </div>
  </section>
  );
};

/* PlatformPricing removed — now uses shared PricingSection component */

/* ───────────────── Page ───────────────── */
const PlatformPage: React.FC = () => {
  const { platform: slug } = useParams<{ platform: string }>();
  const p = slug ? platforms[slug] : undefined;

  if (!p) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:bg-accent focus:text-accent-foreground focus:px-3 focus:py-2 focus:rounded-md"
      >
        Skip to content
      </a>

      <Navbar />
      <WhatsAppButton />

      <main id="main-content" role="main" className="pt-16">
        <PlatformHero p={p} />
        <PlatformFeatures p={p} />
        <PricingSection accentColor={p.color} accentColorAlt={p.colorAlt} />
        <PlatformCta p={p} />
        <Footer />
      </main>
    </div>
  );
};

export default PlatformPage;
