import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Clock, TrendingUp, MapPin } from "lucide-react";
import heroImage from "@/assets/hero-ai-robot.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero pt-16">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="AI Robot Technology" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background/95" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-primary/20 text-sm">
            <MapPin size={16} className="text-primary" />
            <span className="text-foreground">Tecnología 100% desarrollada en Medellín</span>
          </div>
          
          {/* Main heading with enhanced SEO keywords */}
          <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
            <span className="sr-only">SoyAgentia Medellín - </span>
            Transforma tu empresa con{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Agentes de IA
            </span>{" "}
            hechos a medida
          </h1>
          
          {/* Subtitle with SEO keywords */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            <strong>Automatiza ventas, marketing, soporte</strong> y mucho más en Medellín. 
            <br className="hidden md:block" />
            Bienvenido a la era de los <em>robots inteligentes para negocios</em> desarrollados en Colombia.
          </p>
          
          {/* Key benefits */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-accent">
              <Zap size={16} />
              <span>Aumento inmediato de productividad</span>
            </div>
            <div className="flex items-center gap-2 text-accent">
              <Clock size={16} />
              <span>Automatización 24/7</span>
            </div>
            <div className="flex items-center gap-2 text-accent">
              <TrendingUp size={16} />
              <span>ROI desde el primer mes</span>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:shadow-glow-primary transition-all duration-300 text-lg px-8 py-6 group"
              onClick={() => window.open('https://wa.me/573009006005', '_blank')}
            >
              Contactar por WhatsApp
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-accent/50 text-accent hover:bg-accent/10 text-lg px-8 py-6"
              onClick={() => document.getElementById('casos-uso')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Ver casos de uso
            </Button>
          </div>
          
          {/* Trust indicator */}
          <p className="text-sm text-muted-foreground pt-4">
            Más que una agencia, somos una empresa de base tecnológica con desarrollo propio en IA y robótica
          </p>
        </div>
      </div>
      
      {/* Animated elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-primary rounded-full animate-pulse" />
      <div className="absolute bottom-32 right-16 w-3 h-3 bg-accent rounded-full animate-pulse delay-500" />
      <div className="absolute top-1/2 left-4 w-1 h-1 bg-primary-glow rounded-full animate-pulse delay-1000" />
    </section>
  );
};

export default HeroSection;