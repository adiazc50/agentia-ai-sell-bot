// src/pages/Index.tsx
import React, { Suspense, lazy } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CityLinks from "@/components/CityLinks";
import { useLanguage } from "@/contexts/LanguageContext";

const PricingSection = lazy(() => import("@/components/PricingSection"));


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
        <HeroSection />

        <Suspense fallback={<LoadingFallback />}>
          <PricingSection />

          {/* Video tutorial: Cómo comprar tu Agente de IA */}
          <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
            <div className="container mx-auto px-6">
              <div className="text-center mb-10">
                <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-4">
                  Tutorial
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                  ¿Cómo comprar tu Agente de IA para WhatsApp e Instagram?
                </h2>
                <p className="text-slate-500 max-w-xl mx-auto">
                  Mira este video paso a paso y aprende lo fácil que es adquirir tu agente de inteligencia artificial para WhatsApp, Instagram, Messenger, TikTok o tu página web.
                </p>
              </div>
              <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/10 border border-slate-200">
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src="https://www.youtube.com/embed/99i_qXQWDxo"
                    title="Cómo comprar tu Agente de IA para WhatsApp, Instagram y Messenger - SoyAgentia"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Social Proof / Testimonios */}
          <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
            <div className="container mx-auto px-6">
              {/* Header */}
              <div className="text-center mb-14">
                <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-5">
                  Resultados reales
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                  Nuestra IA ya ha respondido{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                    millones de mensajes
                  </span>
                </h2>
                <p className="text-slate-400 max-w-3xl mx-auto text-lg">
                  Agentes de inteligencia artificial para WhatsApp, Instagram, Messenger, TikTok y página web que ya operan en más de 35 países, respondiendo, calificando leads y cerrando ventas las 24 horas del día.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                {[
                  { value: "Millones", label: "de respuestas IA entregadas" },
                  { value: "24/7", label: "atención sin pausas" },
                  { value: "35+", label: "países operando" },
                  { value: "4.9/5", label: "calificación promedio" },
                ].map((stat) => (
                  <div key={stat.value} className="text-center p-5 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                      {stat.value}
                    </p>
                    <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Testimonials */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    quote: "Automatizamos todo el proceso de inscripción y consultas. Pasamos de 2 personas respondiendo WhatsApp a que la IA lo haga mejor que nosotros.",
                    name: "Transportes Gran Bretaña",
                    flag: "\u{1F1E8}\u{1F1F4}",
                    country: "Colombia",
                    photo: "/testimonials/Transportes Gran Bretaña.jpg",
                  },
                  {
                    quote: "Ahora asesoramos y atendemos por WhatsApp a las 2 AM sin que nadie esté despierto. Disminuyó nuestra carga operativa un 80%.",
                    name: "Nelly Seguros LTDA.",
                    flag: "\u{1F1E8}\u{1F1F4}",
                    country: "Colombia",
                    photo: "/testimonials/NellySeguros.png",
                  },
                  {
                    quote: "La IA maneja miles de conversaciones diarias en nuestra tienda online. Responde sobre tallas, precios, envíos. Increíble.",
                    name: "Laura Patricia R.",
                    flag: "\u{1F1E8}\u{1F1F4}",
                    country: "Colombia",
                    photo: "/testimonials/laura-patricia.png",
                  },
                  {
                    quote: "Tenemos agentes de IA en 4 países atendiendo consultas 24/7. La calificación de leads mejoró un 80% y nuestro equipo solo atiende clientes listos para comprar.",
                    name: "Diego Alejandro V.",
                    flag: "\u{1F1F2}\u{1F1FD}",
                    country: "México",
                    photo: "/testimonials/DIEGO MX.png",
                  },
                  {
                    quote: "Los pedidos por WhatsApp aumentaron un 60% desde que el agente toma pedidos y reservas automáticamente. La implementación fue facilísima.",
                    name: "Jose L.",
                    flag: "\u{1F1F5}\u{1F1EA}",
                    country: "Perú",
                    photo: "/testimonials/Jose L.png",
                  },
                  {
                    quote: "Desde que implementamos el agente de IA, nuestras citas médicas se agendan solas. Redujimos un 70% las llamadas perdidas y los pacientes están más satisfechos.",
                    name: "María Fernanda L.",
                    flag: "\u{1F1E8}\u{1F1F4}",
                    country: "Colombia",
                    photo: "/testimonials/maria-fernanda.png",
                  },
                ].map((t) => (
                  <div
                    key={t.name}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:bg-white/10 transition-colors"
                  >
                    <p className="text-slate-300 text-sm leading-relaxed mb-5 italic">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      {t.photo ? (
                        <img
                          src={t.photo}
                          alt={t.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                          {t.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="text-white font-semibold text-sm">{t.name}</p>
                        <p className="text-slate-400 text-xs">{t.flag} {t.country}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

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

          {/* SEO Content Block */}
          <section className="py-16 bg-gradient-to-b from-white to-slate-50">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto space-y-8 text-slate-600 text-sm leading-relaxed">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                  Agentes de IA para WhatsApp, Instagram, Messenger, TikTok y Página Web
                </h2>
                <p>
                  <strong>SoyAgentia</strong> es la plataforma líder en <strong>agentes de inteligencia artificial</strong> para empresas en Latinoamérica. Nuestros <strong>agentes de IA para WhatsApp</strong> responden mensajes, venden productos, agendan citas y califican leads automáticamente, las 24 horas del día, los 7 días de la semana.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Agente de IA para WhatsApp</h3>
                    <p>Automatiza la atención en WhatsApp con un <strong>agente de IA para WhatsApp</strong> que responde al instante, asesora sobre productos y servicios, agenda citas y cierra ventas sin intervención humana.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Agente de IA para Instagram</h3>
                    <p>Nuestro <strong>agente de IA para Instagram</strong> responde DMs automáticamente, gestiona consultas de productos desde stories y convierte seguidores en clientes las 24 horas.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Agente de IA para Messenger</h3>
                    <p>El <strong>agente de IA para Messenger</strong> atiende todas las consultas de Facebook Messenger, califica leads y los dirige a tu equipo de ventas cuando están listos para comprar.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Agente de IA para TikTok</h3>
                    <p>Con el <strong>agente de IA para TikTok</strong> puedes gestionar comentarios y mensajes de tu audiencia de forma automática, convirtiendo la interacción en oportunidades de venta.</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Agente de IA para Página Web</h3>
                  <p>Integra un <strong>agente de IA para tu página web</strong> o WordPress que actúa como un chat inteligente: atiende visitantes, responde preguntas frecuentes, captura datos de contacto y aumenta las conversiones de tu sitio web.</p>
                </div>
                <p className="text-xs text-slate-400">
                  SoyAgentia opera en Colombia, México, Perú, Argentina, Chile, España, Panamá y más de 35 países. Agentes de IA certificados para WhatsApp Business, Instagram, Facebook Messenger, TikTok y WordPress.
                </p>
              </div>
            </div>
          </section>
        </Suspense>

        <Footer />
      </main>
    </div>
  );
};

export default Index;
