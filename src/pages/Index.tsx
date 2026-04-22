// src/pages/Index.tsx
import React, { Suspense, lazy } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CityLinks from "@/components/CityLinks";
import { useLanguage } from "@/contexts/LanguageContext";

const PricingSection = lazy(() => import("@/components/PricingSection"));
const CtaSection = lazy(() => import("@/components/CtaSection"));

const LoadingFallback = () => {
  const { t } = useLanguage();
  return (
    <section className="py-20">
      <div className="container mx-auto px-6 animate-pulse text-muted-foreground">
        {t("common.loading")}
      </div>
    </section>
  );
};

const Index: React.FC = () => {
  const { t } = useLanguage();

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
        <Suspense fallback={<LoadingFallback />}>
          <CtaSection />
        </Suspense>

        <HeroSection />

        <Suspense fallback={<LoadingFallback />}>
          <PricingSection />

          <section
            aria-labelledby="ciudades-title"
            role="region"
            className="container mx-auto px-6 my-12"
            id="city-seo-anchor"
          >
            <h2 id="ciudades-title" className="text-xl font-semibold mb-3">
              {t("index.citiesTitle")}
            </h2>
            <CityLinks />
          </section>
        </Suspense>

        <Footer />
      </main>
    </div>
  );
};

export default Index;
