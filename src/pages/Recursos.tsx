import React from "react";
import { Play } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEOHead from "@/components/SEOHead";

const videos = [
  {
    id: "ytGNrpEtbBo",
    badge: "Funcionalidades",
    badgeColor: "bg-violet-100 text-violet-700",
    title: "Funcionalidades del Agente de IA para WhatsApp e Instagram",
    description: "Descubre todas las funcionalidades que tu agente de inteligencia artificial tiene para WhatsApp, Instagram, Messenger, TikTok y web.",
  },
  {
    id: "99i_qXQWDxo",
    badge: "Tutorial",
    badgeColor: "bg-emerald-100 text-emerald-700",
    title: "¿Cómo comprar tu Agente de IA para WhatsApp?",
    description: "Mira este video paso a paso y aprende lo fácil que es adquirir tu agente de IA para WhatsApp, Instagram o cualquier plataforma.",
  },
  {
    id: "rMasYiqkRWE",
    badge: "Configuración",
    badgeColor: "bg-teal-100 text-teal-700",
    title: "¿Cómo configurar tu Agente de IA en WhatsApp e Instagram?",
    description: "Aprende a configurar tu agente de inteligencia artificial en minutos para WhatsApp, Instagram, Messenger y más. Ponlo a trabajar por ti.",
  },
];

const Recursos: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Tutoriales: Cómo usar Agentes de IA para WhatsApp, Instagram y más | SoyAgentia"
        description="Videos tutoriales sobre agentes de IA para WhatsApp, Instagram, Messenger, TikTok y página web. Aprende a comprar, configurar y usar tu agente de inteligencia artificial."
        canonical="https://soyagentia.com/recursos"
        keywords="tutorial agente IA WhatsApp, cómo configurar agente IA, agente inteligencia artificial tutorial, SoyAgentia recursos"
      />
      <Navbar />
      <WhatsAppButton />

      <main className="pt-16">
        {/* Header */}
        <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
          <div className="container mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-6">
              <Play className="w-3.5 h-3.5" />
              Recursos
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Tutoriales: Agentes de IA para WhatsApp, Instagram y más
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Todo lo que necesitas saber para sacar el máximo provecho de tu agente de inteligencia artificial. Videos paso a paso sobre cómo comprar, configurar y usar tu agente de IA en WhatsApp, Instagram, Messenger, TikTok y página web.
            </p>
          </div>
        </section>

        {/* Videos */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="space-y-20">
              {videos.map((video, index) => (
                <div
                  key={video.id}
                  className={`flex flex-col ${index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} gap-8 lg:gap-12 items-center`}
                >
                  {/* Video */}
                  <div className="w-full lg:w-3/5">
                    <div className="rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/10 border border-slate-200">
                      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                        <iframe
                          className="absolute inset-0 w-full h-full"
                          src={`https://www.youtube.com/embed/${video.id}`}
                          title={`${video.title} - SoyAgentia`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="w-full lg:w-2/5 text-center lg:text-left">
                    <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 ${video.badgeColor}`}>
                      {video.badge}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                      {video.title}
                    </h2>
                    <p className="text-slate-500 leading-relaxed">
                      {video.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
};

export default Recursos;
