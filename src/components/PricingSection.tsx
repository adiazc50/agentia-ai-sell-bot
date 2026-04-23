import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Zap, Star, Crown, Rocket, Loader2, Settings2, ShieldCheck, MessageCircle, Gift, Award, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useNavigate } from "react-router-dom";
import { api, isAuthenticated, getUser } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import PaymentMethodSelector from "@/components/PaymentMethodSelector";

const AppLogosRow = () => (
  <div className="flex flex-col gap-1.5">
    <span className="text-xs font-medium text-muted-foreground">También disponible en:</span>
    <div className="flex items-center gap-2">
      {/* Messenger - proximamente */}
      {/* <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0078FF] to-[#00C6FF] flex items-center justify-center" title="Messenger">
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-current"><path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.15.26.36.27.58l.05 1.82c.02.56.59.92 1.1.69l2.03-.89c.17-.08.36-.1.55-.06.88.24 1.82.37 2.86.37 5.64 0 10-4.13 10-9.7C22 6.13 17.64 2 12 2zm5.89 7.47-2.89 4.58c-.46.73-1.44.91-2.12.39l-2.3-1.72a.6.6 0 0 0-.72 0l-3.1 2.35c-.41.31-.95-.17-.68-.61l2.89-4.58c.46-.73 1.44-.91 2.12-.39l2.3 1.72a.6.6 0 0 0 .72 0l3.1-2.35c.41-.31.95.17.68.61z"/></svg>
      </div> */}
      {/* Instagram - proximamente */}
      {/* <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] flex items-center justify-center" title="Instagram">
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
      </div> */}
      {/* TikTok - proximamente */}
      {/* <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center" title="TikTok">
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-current"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78c.27 0 .54.04.8.1v-3.5a6.37 6.37 0 0 0-.8-.05A6.34 6.34 0 0 0 3.15 15.3a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.05a8.27 8.27 0 0 0 4.84 1.56V7.16a4.83 4.83 0 0 1-1.08-.47z"/></svg>
      </div> */}
      {/* WordPress */}
      <div className="w-7 h-7 rounded-lg bg-[#21759B] flex items-center justify-center" title="WordPress">
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-current"><path d="M12.158 12.786l-2.698 7.84c.806.236 1.657.365 2.54.365 1.047 0 2.051-.18 2.986-.51a.473.473 0 0 1-.04-.076l-2.788-7.62zM3.009 12c0 3.56 2.07 6.634 5.068 8.093L3.788 8.341A8.975 8.975 0 0 0 3.009 12zm17.159-1.06c0-1.112-.399-1.881-.741-2.48-.456-.741-.883-1.368-.883-2.109 0-.826.627-1.596 1.51-1.596.04 0 .078.005.116.007A8.963 8.963 0 0 0 12 3.009c-3.36 0-6.317 1.725-8.037 4.338.226.007.44.011.62.011 1.006 0 2.565-.122 2.565-.122.519-.03.58.731.061.792 0 0-.521.061-1.101.091l3.502 10.42 2.105-6.312-1.497-4.108c-.519-.03-1.01-.091-1.01-.091-.518-.03-.457-.822.062-.792 0 0 1.59.122 2.534.122 1.007 0 2.566-.122 2.566-.122.519-.03.579.731.061.792 0 0-.522.061-1.101.091l3.474 10.337 .96-3.2c.414-1.327.731-2.28.731-3.1zM20.991 12c0 3.083-1.607 5.79-4.03 7.335l2.474-7.152c.462-1.155.616-2.08.616-2.903 0-.298-.02-.575-.055-.834.64 1.114 1.003 2.394 1.003 3.756L20.991 12zM12 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>
      </div>
    </div>
    <span className="text-[10px] text-muted-foreground/70">Sin costo adicional</span>
  </div>
);

// Los planes se cargan dinámicamente desde la DB (tabla Plans) via api.plans.list()
// Solo los iconos, features y "popular" se definen aquí como metadata por slug.
// Para agregar/modificar planes: actualizar la tabla Plans en MySQL y agregar el slug aquí.
const PLAN_META: Record<string, { icon: any; popular: boolean; features: string[] }> = {
  'plan-test': {
    icon: Zap,
    popular: false,
    features: [
      "pricing.feat.aiResponses",
      "pricing.feat.oneUser",
      "pricing.feat.trialDays",
      "pricing.feat.massMessages",
      "pricing.feat.verificationCharge",
      "pricing.feat.autoCharge",
    ],
  },
  'starter': {
    icon: Zap,
    popular: false,
    features: [
      "pricing.feat.aiResponsesMonth",
      "pricing.feat.oneUser",
      "pricing.feat.auto247",
      "pricing.feat.whatsapp",
      "pricing.feat.massMessages",
      "pricing.feat.recurringCharge",
    ],
  },
  'mini': {
    icon: Zap,
    popular: false,
    features: [
      "pricing.feat.aiResponsesMonth",
      "pricing.feat.oneUser",
      "pricing.feat.auto247",
      "pricing.feat.whatsapp",
      "pricing.feat.massMessages",
      "pricing.feat.basicPanel",
    ],
  },
  'basic': {
    icon: Star,
    popular: false,
    features: [
      "pricing.feat.aiResponsesMonth",
      "pricing.feat.oneUser",
      "pricing.feat.auto247",
      "pricing.feat.whatsapp",
      "pricing.feat.massMessages",
      "pricing.feat.fullPanel",
      "pricing.feat.monthlyReports",
    ],
  },
  'basico': {
    icon: Star,
    popular: false,
    features: [
      "pricing.feat.aiResponsesMonth",
      "pricing.feat.oneUser",
      "pricing.feat.auto247",
      "pricing.feat.whatsapp",
      "pricing.feat.massMessages",
      "pricing.feat.fullPanel",
      "pricing.feat.monthlyReports",
    ],
  },
  'plus': {
    icon: Crown,
    popular: true,
    features: [
      "pricing.feat.aiResponsesMonth",
      "pricing.feat.twoUsers",
      "pricing.feat.auto247",
      "pricing.feat.whatsapp",
      "pricing.feat.massMessages",
      "pricing.feat.advancedPanel",
      "pricing.feat.weeklyReports",
      "pricing.feat.prioritySupport",
    ],
  },
  'enterprise': {
    icon: Rocket,
    popular: false,
    features: [
      "pricing.feat.aiResponsesMonth",
      "pricing.feat.fiveUsers",
      "pricing.feat.auto247",
      "pricing.feat.whatsapp",
      "pricing.feat.massMessages",
      "pricing.feat.advancedPanel",
      "pricing.feat.realtimeReports",
      "pricing.feat.dedicatedSupport",
      "pricing.feat.advancedCustomization",
    ],
  },
};

// Users included per plan slug
const PLAN_USERS: Record<string, number> = {
  'plan-test': 1, 'starter': 1, 'mini': 1, 'basic': 1, 'basico': 1, 'plus': 2, 'enterprise': 5,
};

interface PlanDisplay {
  id: number;
  name: string;
  slug: string;
  icon: any;
  conversations: string;
  rawMessages: number;
  users: number;
  priceUSD: number | null;
  fixedPriceCOP: number | null;
  features: string[];
  popular: boolean;
  isTrial: boolean;
  trialDays: number | null;
}

const SEMIANNUAL_DISCOUNT = 0.10; // 10% discount for 6-month plans
const ANNUAL_DISCOUNT = 0.15; // 15% discount for annual plans

// Interpolate custom plan price between real plan tiers (rule of three)
const getInterpolatedPriceUSD = (messages: number, planTiers: { messages: number; price: number; name: string }[]): number => {
  if (planTiers.length === 0) return 0;
  // If below the first tier, return first tier price
  if (messages <= planTiers[0].messages) return planTiers[0].price;
  // If above the last tier, extrapolate using the last two tiers' cost-per-message rate
  const last = planTiers[planTiers.length - 1];
  if (messages >= last.messages) {
    const prev = planTiers.length >= 2 ? planTiers[planTiers.length - 2] : { messages: 0, price: 0 };
    const ratePerMsg = (last.price - prev.price) / Math.max(1, last.messages - prev.messages);
    const extraMessages = messages - last.messages;
    return Math.round((last.price + extraMessages * ratePerMsg) * 100) / 100;
  }
  // Find the two tiers we're between and interpolate
  for (let i = 0; i < planTiers.length - 1; i++) {
    const lower = planTiers[i];
    const upper = planTiers[i + 1];
    if (messages >= lower.messages && messages <= upper.messages) {
      const ratio = (messages - lower.messages) / (upper.messages - lower.messages);
      const price = lower.price + ratio * (upper.price - lower.price);
      return Math.round(price * 100) / 100;
    }
  }
  return last.price;
};

// Find which plan tier range a message count falls into
const findPlanRange = (messages: number, planTiers: { messages: number; price: number; name: string }[]): { lower: typeof planTiers[0] | null; upper: typeof planTiers[0] | null; exact: typeof planTiers[0] | null } => {
  for (const tier of planTiers) {
    if (messages === tier.messages) return { lower: null, upper: null, exact: tier };
  }
  if (messages < planTiers[0]?.messages) return { lower: null, upper: planTiers[0], exact: null };
  if (messages > planTiers[planTiers.length - 1]?.messages) return { lower: planTiers[planTiers.length - 1], upper: null, exact: null };
  for (let i = 0; i < planTiers.length - 1; i++) {
    if (messages > planTiers[i].messages && messages < planTiers[i + 1].messages) {
      return { lower: planTiers[i], upper: planTiers[i + 1], exact: null };
    }
  }
  return { lower: null, upper: null, exact: null };
};

/* ─── Plan Carousel ─── */
interface PlanCarouselProps {
  plans: PlanDisplay[];
  billingPeriod: "mensual" | "semestral" | "anual";
  loadingPlan: string | null;
  hasPurchasedPlanTest: boolean;
  t: (key: string) => string;
  formatPlanMonthly: (plan: PlanDisplay) => string;
  formatFromUSD: (usd: number) => string;
  getMonthlyDisplayUSD: (plan: PlanDisplay) => number | null;
  getPeriodTotalUSD: (plan: PlanDisplay) => number | null;
  getOriginalPeriodUSD: (plan: PlanDisplay) => number | null;
  getActiveDiscount: () => number;
  handleSelectPlan: (plan: PlanDisplay) => void;
}

const PlanCarousel = ({
  plans, billingPeriod, loadingPlan, hasPurchasedPlanTest, t,
  formatPlanMonthly, formatFromUSD, getMonthlyDisplayUSD, getPeriodTotalUSD,
  getOriginalPeriodUSD, getActiveDiscount, handleSelectPlan,
}: PlanCarouselProps) => {
  // Start at Starter (index 1)
  const startIdx = plans.length > 1 ? 1 : 0;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: false,
    skipSnaps: false,
    startIndex: startIdx,
    dragFree: true,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(startIdx);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => { emblaApi.off("select", onSelect); emblaApi.off("reInit", onSelect); };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  const discount = getActiveDiscount();
  const discountPct = Math.round(discount * 100);
  const periodLabel = billingPeriod === "anual" ? t("common.perYear") : billingPeriod === "semestral" ? t("common.perSemester") : t("common.perMonth");

  return (
    <div className="relative">
      {/* Navigation arrows */}
      <motion.button
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        animate={canScrollPrev ? { scale: [1, 1.15, 1], boxShadow: ["0 0 0 0 rgba(16,185,129,0)", "0 0 0 10px rgba(16,185,129,0.25)", "0 0 0 0 rgba(16,185,129,0)"] } : {}}
        transition={canScrollPrev ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" } : {}}
        className={`absolute -left-2 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
          canScrollPrev
            ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 border-2 border-white hover:from-emerald-600 hover:to-teal-600 cursor-pointer"
            : "bg-slate-100 text-slate-300 border border-slate-200 opacity-30 cursor-not-allowed"
        }`}
        aria-label="Previous plan"
      >
        <ChevronLeft className="w-6 h-6" />
      </motion.button>
      <motion.button
        onClick={scrollNext}
        disabled={!canScrollNext}
        animate={canScrollNext ? { scale: [1, 1.15, 1], boxShadow: ["0 0 0 0 rgba(16,185,129,0)", "0 0 0 10px rgba(16,185,129,0.25)", "0 0 0 0 rgba(16,185,129,0)"] } : {}}
        transition={canScrollNext ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" } : {}}
        className={`absolute -right-2 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
          canScrollNext
            ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 border-2 border-white hover:from-emerald-600 hover:to-teal-600 cursor-pointer"
            : "bg-slate-100 text-slate-300 border border-slate-200 opacity-30 cursor-not-allowed"
        }`}
        aria-label="Next plan"
      >
        <ChevronRight className="w-6 h-6" />
      </motion.button>

      {/* Carousel viewport */}
      <div className="overflow-hidden px-2 pt-8" ref={emblaRef}>
        <div className="flex gap-5">
          {plans.map((plan, index) => {
            const isTrial = !!plan.isTrial;
            const isTrialBlocked = isTrial && hasPurchasedPlanTest;
            const monthlyUSD = getMonthlyDisplayUSD(plan);
            const periodTotalUSD = getPeriodTotalUSD(plan);
            const originalPeriodUSD = getOriginalPeriodUSD(plan);
            const isActive = index === selectedIndex;

            return (
              <div
                key={plan.name}
                className="flex-[0_0_85%] sm:flex-[0_0_48%] lg:flex-[0_0_320px] min-w-0"
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  className={`relative h-full transition-all duration-500 ${isActive ? "scale-[1.03]" : "scale-100 opacity-80"}`}
                >
                  {/* Popular badge */}
                  {plan.popular && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
                      <motion.div
                        animate={{ scale: [1, 1.06, 1], y: [0, -2, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white text-sm font-extrabold px-7 py-2.5 rounded-full shadow-[0_4px_20px_rgba(16,185,129,0.5)] whitespace-nowrap flex items-center gap-2 border border-white/20"
                      >
                        <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                        {t("pricing.popular")}
                        <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                      </motion.div>
                    </div>
                  )}

                  {/* Card */}
                  <div className={`rounded-2xl h-full flex flex-col overflow-hidden transition-all duration-500 ${
                    plan.popular
                      ? "bg-white border-2 border-emerald-500/50 shadow-[0_8px_40px_rgba(16,185,129,0.15)] ring-2 ring-emerald-500/20"
                      : "bg-white border border-slate-200 shadow-md hover:shadow-xl hover:border-slate-300"
                  }`}>
                    {/* Top accent bar */}
                    <div className={`w-full ${
                      plan.popular
                        ? "h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500"
                        : isTrial
                          ? "h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400"
                          : "h-1 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200"
                    }`} />

                    <div className="p-6 flex flex-col flex-grow">
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-5">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          plan.popular
                            ? "bg-gradient-to-br from-emerald-500 to-teal-500 shadow-md shadow-emerald-500/25"
                            : isTrial
                              ? "bg-gradient-to-br from-amber-400 to-yellow-500 shadow-md shadow-amber-400/25"
                              : "bg-slate-100"
                        }`}>
                          <plan.icon className={`w-5 h-5 ${plan.popular || isTrial ? "text-white" : "text-slate-600"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-lg font-bold truncate ${plan.popular ? "text-emerald-700" : "text-slate-900"}`}>
                            {plan.name}
                          </h3>
                          <p className="text-slate-400 text-xs">{plan.conversations} {t("pricing.conversations")}</p>
                        </div>
                        {isTrial ? (
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${isTrialBlocked ? 'bg-slate-100 text-slate-400' : 'bg-amber-50 text-amber-600 border border-amber-200'}`}>
                            {isTrialBlocked ? 'Adquirido' : t("pricing.freeTrial")}
                          </span>
                        ) : ['starter', 'mini'].includes(plan.slug) ? (
                          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1 uppercase tracking-wide">
                            <Gift className="w-3 h-3" />
                            1 mes gratis
                          </span>
                        ) : null}
                      </div>

                      {/* Price */}
                      <div className="mb-5 pb-5 border-b border-slate-100">
                        {(() => {
                          if (isTrial) {
                            return (
                              <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-extrabold text-slate-900">$0</span>
                                <span className="text-slate-400 text-sm font-medium">USD /{t("common.perMonth").replace("/","")}</span>
                              </div>
                            );
                          }
                          if (billingPeriod !== "mensual" && plan.priceUSD) {
                            return (
                              <>
                                <div className="flex items-baseline gap-2 mb-2">
                                  <span className="text-slate-300 text-sm line-through">${formatFromUSD(plan.priceUSD)}</span>
                                  <span className="text-3xl font-extrabold text-slate-900">${formatFromUSD(monthlyUSD!)}</span>
                                  <span className="text-slate-400 text-xs">/mes</span>
                                </div>
                                <div className="bg-emerald-50/80 border border-emerald-100 rounded-xl p-3">
                                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">{t("pricing.payToday")}</p>
                                  <div className="flex items-baseline gap-2 flex-wrap">
                                    <span className="text-slate-300 text-xs line-through">${formatFromUSD(originalPeriodUSD!)}</span>
                                    <span className="text-lg font-extrabold text-emerald-600">${formatFromUSD(periodTotalUSD!)}</span>
                                    <span className="text-[10px] text-slate-400">{periodLabel}</span>
                                  </div>
                                  <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                                    {t("pricing.youSave")} ${formatFromUSD(Math.round((originalPeriodUSD! - periodTotalUSD!) * 100) / 100)} ({discountPct}%)
                                  </p>
                                </div>
                              </>
                            );
                          }
                          return (
                            <div className="flex items-baseline gap-1">
                              <span className="text-4xl font-extrabold text-slate-900">${formatPlanMonthly(plan)}</span>
                              <span className="text-slate-400 text-sm font-medium">/mes</span>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Features */}
                      <ul className="space-y-2.5 mb-6 flex-grow">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm">
                            <div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                              plan.popular ? "bg-emerald-100" : "bg-slate-100"
                            }`}>
                              <Check className={`w-3 h-3 ${plan.popular ? "text-emerald-600" : "text-slate-500"}`} />
                            </div>
                            <span className="text-slate-600 leading-snug">
                              {feature === 'pricing.feat.aiResponses' || feature === 'pricing.feat.aiResponsesMonth'
                                ? `${plan.conversations} ${t(feature)}`
                                : t(feature)}
                            </span>
                          </li>
                        ))}
                        <li className="pt-1">
                          <AppLogosRow />
                        </li>
                      </ul>

                      {/* CTA */}
                      {isTrialBlocked && (
                        <p className="text-xs text-red-500 text-center mb-2">Este plan solo se puede comprar una vez.</p>
                      )}
                      <Button
                        size="lg"
                        className={`w-full font-bold rounded-xl transition-all duration-300 ${
                          plan.popular
                            ? "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30"
                            : isTrial
                              ? "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-white shadow-md shadow-amber-500/20"
                              : "bg-slate-900 hover:bg-slate-800 text-white"
                        }`}
                        onClick={() => handleSelectPlan(plan)}
                        disabled={loadingPlan !== null || isTrialBlocked}
                      >
                        {loadingPlan === plan.name ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t("pricing.processing")}
                          </>
                        ) : (
                          isTrial ? t("pricing.startFreeTrial") : t("pricing.selectPlan")
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-2 mt-8">
        {plans.map((plan, i) => (
          <button
            key={plan.name}
            onClick={() => scrollTo(i)}
            className={`transition-all duration-300 rounded-full ${
              i === selectedIndex
                ? "w-8 h-2.5 bg-emerald-500"
                : "w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400"
            }`}
            aria-label={`Go to ${plan.name}`}
          />
        ))}
      </div>
    </div>
  );
};

const PricingSection = () => {
  const { t } = useLanguage();
  const [plans, setPlans] = useState<PlanDisplay[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [billingPeriod, setBillingPeriod] = useState<"mensual" | "semestral" | "anual">("mensual");
  const [customMessages, setCustomMessages] = useState<number>(0);
  const [customMessagesInput, setCustomMessagesInput] = useState<string>("0");
  const [customInitialized, setCustomInitialized] = useState(false);
  const [additionalUsers, setAdditionalUsers] = useState<number>(0);
  const [paymentMethodModal, setPaymentMethodModal] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<PlanDisplay | null>(null);
  const [userTransactions, setUserTransactions] = useState<any[]>([]);

  // Check if user already purchased Plan Test
  const hasPurchasedPlanTest = useMemo(() => {
    return userTransactions.some(
      (tx) => tx.plan_name?.toLowerCase().includes('plan test')
    );
  }, [userTransactions]);

  // Build sorted plan tiers for interpolation (non-trial plans with USD pricing)
  const planTiers = useMemo(() => {
    return plans
      .filter(p => !p.isTrial && p.priceUSD !== null && p.rawMessages > 0)
      .sort((a, b) => a.rawMessages - b.rawMessages)
      .map(p => ({ messages: p.rawMessages, price: p.priceUSD!, name: p.name, users: p.users, slug: p.slug }));
  }, [plans]);

  // Initialize custom messages to Starter plan when plans load
  useEffect(() => {
    if (planTiers.length > 0 && !customInitialized) {
      const starter = planTiers.find(t => t.slug === 'starter') || planTiers[0];
      setCustomMessages(starter.messages);
      setCustomMessagesInput(starter.messages.toString());
      setCustomInitialized(true);
    }
  }, [planTiers, customInitialized]);

  // Included users: plans up to Enterprise keep their defined users (1, 2, 5)
  // Beyond Enterprise: base Enterprise users + 5 per each extra $1,000 USD
  const getIncludedUsers = (messages: number): number => {
    if (planTiers.length === 0) return 1;
    // Exact match
    for (const tier of planTiers) {
      if (messages === tier.messages) return tier.users;
    }
    // Between two plans: interpolate their users
    for (let i = 0; i < planTiers.length - 1; i++) {
      const lower = planTiers[i];
      const upper = planTiers[i + 1];
      if (messages > lower.messages && messages < upper.messages) {
        const ratio = (messages - lower.messages) / (upper.messages - lower.messages);
        return Math.max(1, Math.round(lower.users + ratio * (upper.users - lower.users)));
      }
    }
    // Beyond last plan: base users + 5 per $1,000 USD extra
    const last = planTiers[planTiers.length - 1];
    if (messages > last.messages) {
      const extraUSD = getInterpolatedPriceUSD(messages, planTiers) - last.price;
      return last.users + Math.floor((extraUSD / 1000) * 5);
    }
    return planTiers[0].users;
  };

  // Additional users cost $15 USD each
  const ADDITIONAL_USER_COST_USD = 15;
  const { toast } = useToast();
  const navigate = useNavigate();
  const { exchangeRate } = useCurrency();

  // Raw TRM for USD → COP conversion (no commission)
  const trm = exchangeRate?.rate ?? 4200;

  // Convert USD to COP
  const usdToCop = (usd: number): number => Math.round(usd * trm);

  // Get plan monthly price in COP (for Wompi)
  const getPlanMonthlyCOP = (plan: PlanDisplay): number => {
    if (plan.fixedPriceCOP) return plan.fixedPriceCOP;
    return usdToCop(plan.priceUSD!);
  };

  // Additional users cost in COP
  const getAdditionalUsersCostCOP = (users: number): number => {
    return usdToCop(users * ADDITIONAL_USER_COST_USD);
  };

  // Always show USD amounts in pricing UI
  const formatFromUSD = (usd: number): string => {
    return `${Math.round(usd).toLocaleString('en-US')} USD`;
  };

  // Format a plan's monthly price for display (USD-only UI)
  const formatPlanMonthly = (plan: PlanDisplay): string => {
    if (plan.isTrial) {
      return `0 USD`;
    }
    if (plan.priceUSD !== null) {
      return formatFromUSD(plan.priceUSD);
    }
    const usd = Math.round(plan.fixedPriceCOP! / trm);
    return `${usd.toLocaleString('en-US')} USD`;
  };

  const getActiveDiscount = (): number => {
    if (billingPeriod === "semestral") return SEMIANNUAL_DISCOUNT;
    if (billingPeriod === "anual") return ANNUAL_DISCOUNT;
    return 0;
  };

  const getBillingMonths = (): number => {
    if (billingPeriod === "semestral") return 6;
    if (billingPeriod === "anual") return 12;
    return 1;
  };

  // Monthly display price in USD (with discount if applicable)
  const getMonthlyDisplayUSD = (plan: PlanDisplay): number | null => {
    if (!plan.priceUSD) return null;
    const discount = getActiveDiscount();
    if (discount > 0) {
      return Math.round(plan.priceUSD * (1 - discount) * 100) / 100;
    }
    return plan.priceUSD;
  };

  // Get total price in COP to charge via Wompi
  const getTotalPriceCOP = (plan: PlanDisplay): number => {
    const monthlyCOP = getPlanMonthlyCOP(plan);
    const discount = getActiveDiscount();
    const months = getBillingMonths();
    if (discount > 0) {
      const discountedMonthlyCOP = Math.round(monthlyCOP * (1 - discount));
      return discountedMonthlyCOP * months;
    }
    return monthlyCOP;
  };

  // Period total in USD for display
  const getPeriodTotalUSD = (plan: PlanDisplay): number | null => {
    if (!plan.priceUSD) return null;
    const discount = getActiveDiscount();
    const months = getBillingMonths();
    const discounted = Math.round(plan.priceUSD * (1 - discount) * 100) / 100;
    return Math.round(discounted * months * 100) / 100;
  };

  const getOriginalPeriodUSD = (plan: PlanDisplay): number | null => {
    if (!plan.priceUSD) return null;
    const months = getBillingMonths();
    return Math.round(plan.priceUSD * months * 100) / 100;
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.wompi.co/widget.js';
    script.async = true;
    document.body.appendChild(script);

    // Load plans from DB
    const loadPlans = async () => {
      try {
        const dbPlans = await api.plans.list();
        const arr = Array.isArray(dbPlans) ? dbPlans : [];
        const mapped: PlanDisplay[] = arr
          .filter((p: any) => p.status === 1)
          .map((p: any) => {
            const meta = PLAN_META[p.slug] || { icon: Zap, popular: false, features: [] };
            return {
              id: p.id,
              name: p.name,
              slug: p.slug,
              icon: meta.icon,
              conversations: Number(p.messages).toLocaleString('es-CO'),
              rawMessages: Number(p.messages),
              users: PLAN_USERS[p.slug] || 1,
              priceUSD: p.fixedPriceCOP ? null : Number(p.priceUSD),
              fixedPriceCOP: p.fixedPriceCOP ? Number(p.fixedPriceCOP) : null,
              features: meta.features,
              popular: meta.popular,
              isTrial: !!p.isTrial,
              trialDays: p.trialDays || null,
            };
          });
        setPlans(mapped);
      } catch (err) {
        console.error('Error loading plans:', err);
      } finally {
        setPlansLoading(false);
      }
    };
    loadPlans();

    const loadUserData = async () => {
      try {
        const [profileRes, transactions] = await Promise.all([
          api.profile.get(),
          api.transactions.list(),
        ]);
        if (profileRes) {
          const merged = {
            ...profileRes.user,
            company_name: profileRes.company?.name || null,
            nit: profileRes.company?.nit || null,
          };
          setUserProfile(merged);
        }
        if (transactions) setUserTransactions(transactions);
      } catch (err) {
        console.error('Error loading user data:', err);
      }
    };

    if (isAuthenticated()) {
      const user = getUser();
      setUserId(user?.id || user?.idUser || null);
      loadUserData();
    } else {
      setUserId(null);
      setUserProfile(null);
      setUserTransactions([]);
    }

    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  const handleSelectPlan = async (plan: PlanDisplay) => {
    if (!userId) {
      toast({
        title: t("pricing.loginFirst"),
        description: t("pricing.loginFirstDesc"),
      });
      navigate(`/auth?mode=register&plan=${plan.name.toLowerCase()}`);
      return;
    }

    // Block re-purchase of Plan Test
    if (plan.isTrial && hasPurchasedPlanTest) {
      toast({
        title: "Plan Test ya adquirido",
        description: "El Plan Test solo se puede comprar una vez. Elige otro plan para continuar.",
        variant: "destructive",
      });
      return;
    }

    // Go directly to Wompi payment
    handleWompiPayment(plan);
  };

  const handleWompiPayment = async (plan: PlanDisplay) => {
    setPaymentMethodModal(false);
    setLoadingPlan(plan.name);

    try {
      const totalPriceCOP = getTotalPriceCOP(plan);
      const priceInCents = totalPriceCOP * 100;
      const planSuffix = billingPeriod === "anual" ? " - Anual" : billingPeriod === "semestral" ? " - Semestral" : " - Mensual";
      const reference = `plan-${plan.name.toLowerCase()}-${billingPeriod}-${Date.now()}`;
      const currencyCode = 'COP';

      const data = await api.payments.wompiSignature({ reference, amountInCents: priceInCents, currency: currencyCode });

      await api.transactions.success({
        email: userProfile?.email || "",
        reference,
        plan_name: plan.name + planSuffix,
        amount: totalPriceCOP,
        currency: currencyCode,
        status: "PENDING",
        payment_gateway: "wompi",
      });

      const customerData: Record<string, string> = {};
      if (userProfile) {
        customerData.email = userProfile.email;
        customerData.fullName = userProfile.name || '';
        if (userProfile.phone) {
          let cleanPhone = String(userProfile.phone).replace(/\D/g, '');
          if (cleanPhone.startsWith('57') && cleanPhone.length > 10) {
            cleanPhone = cleanPhone.substring(2);
          }
          customerData.phoneNumber = cleanPhone;
          customerData.phoneNumberPrefix = '57';
        }
      }

      const checkout = new (window as any).WidgetCheckout({
        currency: currencyCode,
        amountInCents: priceInCents,
        reference,
        publicKey: data.publicKey,
        signature: { integrity: data.signature },
        redirectUrl: `${window.location.origin}/dashboard`,
        ...(Object.keys(customerData).length > 0 ? { customerData } : {}),
      });

      checkout.open(async (result: any) => {
        const transaction = result.transaction;
        await api.transactions.success({
          reference,
          status: transaction.status,
          wompi_transaction_id: transaction.id,
          payment_method: transaction.paymentMethod?.type,
        });

        if (transaction.status === 'APPROVED') {
          toast({ title: "¡Pago exitoso!", description: `Tu plan ${plan.name} ha sido activado.` });

          try {
            const sigData = await api.payments.wompiSignature({ reference: 'temp', amountInCents: 100, currency: 'COP' });
            const tokenCheckout = new (window as any).WidgetCheckout({
              publicKey: sigData.publicKey,
              widgetOperation: 'tokenize',
            });
            tokenCheckout.open(async (tokenResult: any) => {
              if (tokenResult.token && tokenResult.token.id) {
                await api.payments.tokenizeCard({
                  card_token: tokenResult.token.id,
                  plan_name: plan.name + planSuffix,
                  amount: totalPriceCOP,
                  currency: 'COP',
                  billing_period: billingPeriod,
                });
                toast({ title: "Cobro automático activado", description: "Tu tarjeta fue guardada para renovación automática." });
              }
              navigate("/dashboard");
            });
          } catch (tokenErr) {
            console.error('Tokenization error:', tokenErr);
            navigate("/dashboard");
          }
        } else if (transaction.status === 'DECLINED') {
          toast({ title: "Pago rechazado", description: "Por favor intenta con otro método de pago.", variant: "destructive" });
        } else if (transaction.status === 'PENDING') {
          toast({ title: "Pago pendiente", description: "Tu pago está siendo procesado." });
        }
      });

    } catch (error) {
      console.error('Error processing payment:', error);
      toast({ title: "Error", description: "No se pudo procesar el pago. Intenta de nuevo.", variant: "destructive" });
    } finally {
      setLoadingPlan(null);
    }
  };

  const handlePayPalPayment = async (plan: PlanDisplay) => {
    setPaymentMethodModal(false);
    setLoadingPlan(plan.name);

    try {
      const planSuffix = billingPeriod === "anual" ? " - Anual" : billingPeriod === "semestral" ? " - Semestral" : " - Mensual";
      
      // Calculate USD amount with discount
      const discount = getActiveDiscount();
      const months = getBillingMonths();
      // If plan has a USD price use it; otherwise convert COP to USD
      const monthlyUSD = plan.priceUSD ?? (plan.fixedPriceCOP! / trm);
      const discountedMonthly = Math.round(monthlyUSD * (1 - discount) * 100) / 100;
      const totalUSD = Math.round(discountedMonthly * months * 100) / 100;

      const data = await api.payments.paypalCreateSubscription({
        plan_name: plan.name,
        billing_period: billingPeriod,
        amount_usd: discountedMonthly,
        email: userProfile?.email || "",
        return_url: `${window.location.origin}/dashboard?paypal=success`,
        cancel_url: `${window.location.origin}/dashboard?paypal=cancelled`,
      });

      if (!data?.approval_url) throw new Error('No se recibió URL de aprobación');

      // Open PayPal in a new tab (works inside iframes)
      window.open(data.approval_url, '_blank');

    } catch (error) {
      console.error('PayPal payment error:', error);
      toast({ title: "Error", description: "No se pudo procesar el pago con PayPal. Intenta de nuevo.", variant: "destructive" });
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section id="planes" className="py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/20 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {/* Title */}
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3">
            {t("pricing.title")}{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 bg-clip-text text-transparent">
              {t("pricing.titleHighlight")}
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto mb-6 leading-relaxed">
            {t("pricing.subtitle")}
          </p>

          {/* Info strip — compact row */}
          <div className="inline-flex flex-wrap items-center justify-center gap-x-5 gap-y-2 px-6 py-3 rounded-2xl bg-slate-50 border border-slate-200/80 mb-8">
            <span className="flex items-center gap-1.5 text-sm text-slate-600">
              <Zap className="w-3.5 h-3.5 text-emerald-500" />
              {t("pricing.conversationNote")}
            </span>
            <span className="hidden sm:block w-px h-4 bg-slate-200" />
            <span className="flex items-center gap-1.5 text-sm text-slate-600">
              <Settings2 className="w-3.5 h-3.5 text-emerald-500" />
              {t("pricing.moreUsers")} <span className="font-semibold text-slate-900">$15 USD/mes</span> {t("pricing.perUser")}
            </span>
          </div>

          {/* Trust badges — single compact line */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            {[
              { key: "pricing.notifyPay", icon: MessageCircle },
              { key: "pricing.freeDataAccess", icon: ShieldCheck },
              { key: "pricing.freeDataLogging", icon: Check },
            ].map(({ key, icon: Icon }) => (
              <span
                key={key}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-white border border-slate-100 rounded-full px-3.5 py-1.5 shadow-sm"
              >
                <Icon className="w-3.5 h-3.5 text-emerald-500" />
                {t(key)}
              </span>
            ))}
          </div>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-slate-100 border border-slate-200/60">
            <button
              onClick={() => setBillingPeriod("mensual")}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                billingPeriod === "mensual"
                  ? "bg-white text-slate-900 shadow-md shadow-slate-900/5"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t("pricing.monthly")}
            </button>
            <button
              onClick={() => setBillingPeriod("semestral")}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 relative ${
                billingPeriod === "semestral"
                  ? "bg-white text-slate-900 shadow-md shadow-slate-900/5"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t("pricing.semiannual")}
              <span className="absolute -top-2.5 -right-1 bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                -10%
              </span>
            </button>
            <button
              onClick={() => setBillingPeriod("anual")}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 relative ${
                billingPeriod === "anual"
                  ? "bg-white text-slate-900 shadow-md shadow-slate-900/5"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t("pricing.annual")}
              <span className="absolute -top-2.5 -right-1 bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                -15%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Loading state */}
        {plansLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {!plansLoading && plans.length > 0 && (<>
        {/* Carousel */}
        <PlanCarousel
          plans={plans}
          billingPeriod={billingPeriod}
          loadingPlan={loadingPlan}
          hasPurchasedPlanTest={hasPurchasedPlanTest}
          t={t}
          formatPlanMonthly={formatPlanMonthly}
          formatFromUSD={formatFromUSD}
          getMonthlyDisplayUSD={getMonthlyDisplayUSD}
          getPeriodTotalUSD={getPeriodTotalUSD}
          getOriginalPeriodUSD={getOriginalPeriodUSD}
          getActiveDiscount={getActiveDiscount}
          handleSelectPlan={handleSelectPlan}
        />

        <p className="text-center text-xs text-muted-foreground/70 mt-6">
          *Los costos de envío de mensajes masivos son cobrados directamente por WhatsApp (Meta) según sus tarifas oficiales por conversación.
        </p>

        {/* Custom Plan Section */}
        {planTiers.length > 0 && (() => {
          const sliderMin = planTiers[0].messages;
          const sliderMax = Math.max(planTiers[planTiers.length - 1].messages * 2, 100000);
          const customPriceUSD = getInterpolatedPriceUSD(customMessages, planTiers);
          const additionalUsersCostUSD = additionalUsers * ADDITIONAL_USER_COST_USD;
          const totalMonthlyUSD = customPriceUSD + additionalUsersCostUSD;
          const range = findPlanRange(customMessages, planTiers);
          const costPerMsg = customMessages > 0 ? (customPriceUSD / customMessages) : 0;

          return (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12"
        >
          <div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Settings2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{t("pricing.customPlan")}</h3>
                <p className="text-slate-500">{t("pricing.customSubtitle")} — ajusta las respuestas a tu medida</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-[1fr,380px] gap-8">
              {/* Left: Slider + Plan markers */}
              <div className="space-y-6">
                {/* Messages input + slider */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-slate-600">{t("pricing.messagesPerMonth")}</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={customMessagesInput}
                        onChange={(e) => {
                          const rawValue = e.target.value.replace(/\D/g, '');
                          setCustomMessagesInput(rawValue);
                          const numValue = parseInt(rawValue) || 0;
                          if (numValue >= sliderMin) {
                            setCustomMessages(numValue);
                          }
                        }}
                        onBlur={() => {
                          const numValue = parseInt(customMessagesInput) || sliderMin;
                          const finalValue = Math.max(sliderMin, numValue);
                          setCustomMessages(finalValue);
                          setCustomMessagesInput(finalValue.toString());
                        }}
                        className="w-32 px-3 py-1.5 text-lg font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      />
                      <span className="text-xs text-slate-400">resp/mes</span>
                    </div>
                  </div>

                  <Slider
                    value={[Math.min(customMessages, sliderMax)]}
                    onValueChange={(value) => {
                      setCustomMessages(value[0]);
                      setCustomMessagesInput(value[0].toString());
                    }}
                    min={sliderMin}
                    max={sliderMax}
                    step={Math.max(1, Math.round((sliderMax - sliderMin) / 500))}
                    className="w-full"
                  />

                </div>

                {/* Current range indicator */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-5">
                  {range.exact ? (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-emerald-800">Equivale exactamente al {range.exact.name}</p>
                        <p className="text-xs text-emerald-600">${formatFromUSD(range.exact.price)} /mes — {range.exact.messages.toLocaleString("es-CO")} respuestas</p>
                      </div>
                    </div>
                  ) : range.lower && range.upper ? (
                    <div>
                      <p className="text-sm font-semibold text-slate-700 mb-3">Tu plan está entre:</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-white rounded-lg p-3 border border-emerald-200 text-center">
                          <p className="text-xs text-slate-500">{range.lower.name}</p>
                          <p className="text-sm font-bold text-slate-800">{range.lower.messages.toLocaleString("es-CO")} resp</p>
                          <p className="text-xs text-emerald-600 font-semibold">${formatFromUSD(range.lower.price)}</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                            <span className="text-white text-[10px] font-bold">~</span>
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1">Interpolado</span>
                        </div>
                        <div className="flex-1 bg-white rounded-lg p-3 border border-emerald-200 text-center">
                          <p className="text-xs text-slate-500">{range.upper.name}</p>
                          <p className="text-sm font-bold text-slate-800">{range.upper.messages.toLocaleString("es-CO")} resp</p>
                          <p className="text-xs text-emerald-600 font-semibold">${formatFromUSD(range.upper.price)}</p>
                        </div>
                      </div>
                    </div>
                  ) : range.lower ? (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                        <Rocket className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700">Más allá de {range.lower.name}</p>
                        <p className="text-xs text-slate-500">Precio extrapolado desde los planes superiores</p>
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                    <span>Costo por respuesta: <strong className="text-emerald-700">${costPerMsg.toFixed(4)} USD</strong></span>
                    <span>|</span>
                    <span>Usuarios incluidos: <strong className="text-emerald-700">{getIncludedUsers(customMessages)}</strong></span>
                  </div>
                </div>

                {/* Plan reference table */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wider">Referencia de planes</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {planTiers.map((tier) => {
                      const isMatch = customMessages === tier.messages;
                      const isInRange = (range.lower?.slug === tier.slug || range.upper?.slug === tier.slug);
                      return (
                        <button
                          key={tier.slug}
                          type="button"
                          onClick={() => {
                            setCustomMessages(tier.messages);
                            setCustomMessagesInput(tier.messages.toString());
                          }}
                          className={`p-3 rounded-lg border text-center transition-all cursor-pointer ${
                            isMatch
                              ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/25"
                              : isInRange
                                ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                                : "bg-white border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50"
                          }`}
                        >
                          <p className={`text-xs font-bold ${isMatch ? "text-white" : ""}`}>{tier.name}</p>
                          <p className={`text-[11px] ${isMatch ? "text-emerald-100" : "text-slate-400"}`}>{tier.messages.toLocaleString("es-CO")} resp</p>
                          <p className={`text-xs font-semibold mt-1 ${isMatch ? "text-white" : "text-emerald-600"}`}>${formatFromUSD(tier.price)}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right: Price + users + CTA */}
              <div className="flex flex-col justify-between">
                <div>
                  {/* Price display */}
                  <div className="mb-5">
                    {billingPeriod !== "mensual" ? (
                      <>
                        <div className="mb-2">
                          <span className="text-slate-400 text-sm line-through mr-2">
                            ${formatFromUSD(totalMonthlyUSD)}
                          </span>
                          <span className="text-3xl font-bold text-slate-900">
                            ${formatFromUSD(Math.round(totalMonthlyUSD * (1 - getActiveDiscount()) * 100) / 100)}
                          </span>
                          <span className="text-slate-500 text-sm"> {t("common.perMonth")}</span>
                        </div>
                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                          <p className="text-xs text-slate-500">{t("pricing.payToday")}</p>
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-slate-400 text-sm line-through">
                              ${formatFromUSD(totalMonthlyUSD * getBillingMonths())}
                            </span>
                            <span className="text-2xl font-bold text-emerald-600">
                              ${formatFromUSD(Math.round(totalMonthlyUSD * (1 - getActiveDiscount()) * getBillingMonths() * 100) / 100)}
                            </span>
                            <span className="text-xs text-slate-500">{billingPeriod === "anual" ? t("common.perYear") : t("common.perSemester")}</span>
                          </div>
                          <p className="text-xs text-emerald-600 mt-1">
                            {t("pricing.youSave")} ${formatFromUSD(Math.round(totalMonthlyUSD * getBillingMonths() * getActiveDiscount() * 100) / 100)} ({Math.round(getActiveDiscount() * 100)}%)
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <motion.span
                          key={totalMonthlyUSD}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-4xl font-bold text-slate-900"
                        >
                          ${formatFromUSD(totalMonthlyUSD)}
                        </motion.span>
                        <span className="text-slate-500 text-sm"> {t("common.perMonth")}</span>
                        {additionalUsers > 0 && (
                          <p className="text-xs text-slate-400 mt-1">
                            (Plan: ${formatFromUSD(customPriceUSD)} + Usuarios: ${formatFromUSD(additionalUsersCostUSD)})
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  {/* Users Section */}
                  <div className="bg-slate-50 rounded-xl p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-700">{t("pricing.includedUsers")}</span>
                      <span className="text-lg font-bold text-emerald-600">{getIncludedUsers(customMessages)}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-sm text-slate-500">{t("pricing.additionalUsers")}</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setAdditionalUsers(Math.max(0, additionalUsers - 1))}
                          className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold hover:border-emerald-300 hover:text-emerald-600 transition-colors"
                        >
                          -
                        </button>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={additionalUsers}
                          onChange={(e) => {
                            const value = parseInt(e.target.value.replace(/\D/g, '')) || 0;
                            setAdditionalUsers(Math.max(0, value));
                          }}
                          className="w-16 px-2 py-1 text-center font-bold bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        />
                        <button
                          type="button"
                          onClick={() => setAdditionalUsers(additionalUsers + 1)}
                          className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold hover:border-emerald-300 hover:text-emerald-600 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    {additionalUsers > 0 && (
                      <div className="mt-2 text-xs text-slate-500">
                        +${(additionalUsers * ADDITIONAL_USER_COST_USD).toLocaleString()} USD/mes ({additionalUsers} x $15 USD)
                      </div>
                    )}
                  </div>

                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-slate-600">{customMessages.toLocaleString("es-CO")} {t("pricing.conversations")}</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-slate-600">{getIncludedUsers(customMessages) + additionalUsers} {t("pricing.totalUsers")}</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-slate-600">{t("pricing.allEnterprise")}</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-slate-600">{t("pricing.dedicatedManager")}</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-slate-600">{t("pricing.slaGuaranteed")}</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-slate-600">Mensajes masivos vía Meta API oficial*</span>
                    </li>
                  </ul>
                  <div className="mb-6">
                    <AppLogosRow />
                  </div>
                </div>

                <Button
                  variant="hero"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    const customPlan = {
                      name: t("pricing.customPlan"),
                      icon: Settings2,
                      conversations: customMessages.toString(),
                      users: getIncludedUsers(customMessages) + additionalUsers,
                      priceUSD: totalMonthlyUSD,
                      fixedPriceCOP: null as number | null,
                      features: [],
                      popular: false,
                    };
                    handleSelectPlan(customPlan);
                  }}
                  disabled={loadingPlan !== null}
                >
                  {loadingPlan === t("pricing.customPlan") ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("pricing.processing")}
                    </>
                  ) : (
                    t("pricing.selectCustomPlan")
                  )}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
          );
        })()}
        </>)}
      </div>

      {/* Payment method selector removed - Wompi only */}
    </section>
  );
};

export default PricingSection;
