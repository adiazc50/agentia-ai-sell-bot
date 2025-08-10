// src/pages/Index.tsx
import React, { Suspense, lazy } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CityLinks from "@/components/CityLinks";

const UseCasesSection = lazy(() => import("@/components/UseCasesSection"));
const TechSection     = lazy(() => import("@/components/TechSection"));
const CtaSection      = lazy(() => import("@/components/CtaSection"));

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Skip link accesible */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:bg-accent focus:text-accent-foreground focus:px-3 focus:py-2 focus:rounded-md"
      >
        Saltar al contenido
      </a>

      <Navbar />
      <WhatsAppButton />

      <main id="main-content" role="main" className="pt-16">
        <HeroSection />

        <Suspense
          fallback={
            <section className="py-20">
              <div className="container mx-auto px-6 animate-pulse text-muted-foreground">
                Cargando módulos…
              </div>
            </section>
          }
        >
          {/* Casos de uso */}
          <section className="scroll-mt-20 md:scroll-mt-24">
            <UseCasesSection />
          </section>

          {/* Tecnología */}
          <section>
            <TechSection />
          </section>

          {/* CTA (termina con “Únete a las empresas…”) */}
          <section className="scroll-mt-20 md:scroll-mt-24">
            <CtaSection />
          </section>

          {/* === SEO por ciudad (card colapsable se inyecta aquí) + Grid de ciudades === */}
          <section
            aria-labelledby="ciudades-title"
            role="region"
            className="container mx-auto px-6 my-12"
            id="city-seo-anchor" // <- el script inyecta el card aquí
          >
            <h2 id="ciudades-title" className="text-xl font-semibold mb-3">
              Agentes de IA por ciudad
            </h2>

            {/* Pills / enlaces a las 31 ciudades */}
            <CityLinks />
          </section>
        </Suspense>

        <Footer />
      </main>
    </div>
  );
};

export default Index;
