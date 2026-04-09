import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, BarChart3, Users, Megaphone, LayoutDashboard, Globe, Brain, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

import chatList from "@/assets/platform-chat-list.png";
import chatConversation from "@/assets/platform-chat-conversation.png";
import crmKanban from "@/assets/platform-crm-kanban.png";
import campaigns from "@/assets/platform-campaigns.png";
import dashboardStats from "@/assets/platform-dashboard-stats.png";
import analytics from "@/assets/platform-analytics.png";
import globalStats from "@/assets/platform-global-stats.png";

const slideData = [
  { image: chatList, icon: MessageSquare, titleKey: 'dshow.chatMgmt', descKey: 'dshow.chatMgmtDesc' },
  { image: chatConversation, icon: MessageSquare, titleKey: 'dshow.smartConvo', descKey: 'dshow.smartConvoDesc' },
  { image: crmKanban, icon: Brain, titleKey: 'dshow.smartCRM', descKey: 'dshow.smartCRMDesc' },
  { image: campaigns, icon: Megaphone, titleKey: 'dshow.massCampaigns', descKey: 'dshow.massCampaignsDesc' },
  { image: dashboardStats, icon: LayoutDashboard, titleKey: 'dshow.dashboard', descKey: 'dshow.dashboardDesc' },
  { image: analytics, icon: BarChart3, titleKey: 'dshow.analytics', descKey: 'dshow.analyticsDesc' },
  { image: globalStats, icon: Globe, titleKey: 'dshow.global', descKey: 'dshow.globalDesc' },
];

const DashboardShowcase = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const { t } = useLanguage();

  const goTo = useCallback((index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current]);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slideData.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slideData.length) % slideData.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slideData[current];
  const Icon = slide.icon;
  const prevIndex = (current - 1 + slideData.length) % slideData.length;
  const nextIndex = (current + 1) % slideData.length;

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0, scale: 0.9 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0, scale: 0.9 }),
  };

  const textVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  const includedLabel = { es: 'Incluido en tu plan', en: 'Included in your plan', pt: 'Incluído no seu plano' };

  return (
    <div className="relative select-none">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={prev} className="flex-shrink-0 w-9 h-9 rounded-full bg-secondary/80 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="hidden lg:block flex-shrink-0 w-32 opacity-40 blur-[1px] rounded-lg overflow-hidden border border-border/30 transition-all duration-500">
          <img src={slideData[prevIndex].image} alt="" className="w-full h-auto" />
        </div>

        <div className="flex-1 relative overflow-hidden rounded-xl border border-border/50 shadow-lg shadow-primary/5 min-h-[200px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <img src={slide.image} alt={t(slide.titleKey)} className="w-full h-auto object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="hidden lg:block flex-shrink-0 w-32 opacity-40 blur-[1px] rounded-lg overflow-hidden border border-border/30 transition-all duration-500">
          <img src={slideData[nextIndex].image} alt="" className="w-full h-auto" />
        </div>

        <button onClick={next} className="flex-shrink-0 w-9 h-9 rounded-full bg-secondary/80 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={textVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-3">
            <Icon className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wide">
              {t('dash.buyPlan') === 'Buy Plan' ? includedLabel.en : t('dash.buyPlan') === 'Comprar Plano' ? includedLabel.pt : includedLabel.es}
            </span>
          </div>
          <h4 className="text-xl font-bold mb-1 text-foreground">{t(slide.titleKey)}</h4>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">{t(slide.descKey)}</p>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-center gap-1.5 mt-5">
        {slideData.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="relative h-1.5 rounded-full overflow-hidden bg-muted-foreground/20 transition-all duration-300"
            style={{ width: i === current ? 32 : 10 }}
          >
            {i === current && (
              <motion.div
                className="absolute inset-0 rounded-full bg-primary"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 5, ease: "linear" }}
                style={{ transformOrigin: "left" }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DashboardShowcase;
