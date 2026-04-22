import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import UseCasesSection from "@/components/UseCasesSection";

const UseCases: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <WhatsAppButton />
      <main className="pt-16">
        <UseCasesSection />
      </main>
      <Footer />
    </div>
  );
};

export default UseCases;
