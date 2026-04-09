import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import PricingSection from "@/components/PricingSection";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Planes y Precios | Agente de IA para WhatsApp - Agent IA"
        description="Planes desde $15 USD/mes. Elige el plan ideal para automatizar tu WhatsApp con IA. Prueba gratuita incluida."
        canonical="https://www.agentia.com.co/pricing"
      />
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
          <PricingSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
