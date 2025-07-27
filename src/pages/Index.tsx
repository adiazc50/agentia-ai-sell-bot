import HeroSection from "@/components/HeroSection";
import UseCasesSection from "@/components/UseCasesSection";
import TechSection from "@/components/TechSection";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* WhatsApp floating button */}
      <WhatsAppButton />
      
      {/* Main content sections */}
      <HeroSection />
      <UseCasesSection />
      <TechSection />
      <CtaSection />
      <Footer />
    </div>
  );
};

export default Index;
