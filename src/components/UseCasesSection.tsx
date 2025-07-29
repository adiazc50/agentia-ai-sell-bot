import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Phone, 
  MessageSquare, 
  ShoppingCart, 
  CreditCard, 
  Calendar,
  Bot,
  Target,
  Users
} from "lucide-react";

const UseCasesSection = () => {
  const useCases = [
    {
      icon: Bot,
      title: "Consultoría tecnológica IA",
      description: "Análisis y recomendaciones automatizadas para optimizar procesos empresariales con inteligencia artificial.",
      features: ["Análisis automático", "Recomendaciones IA", "Optimización continua"]
    },
    {
      icon: Phone,
      title: "Ventas automáticas por voz",
      description: "Agentes que realizan hasta 10,000 llamadas en un minuto para contactar clientes y cerrar ventas automáticamente.",
      features: ["Llamadas masivas", "Reconocimiento de voz", "Seguimiento inteligente"]
    },
    {
      icon: MessageSquare,
      title: "Atención en redes sociales",
      description: "Robots que responden mensajes en WhatsApp, Instagram, Facebook y otras plataformas 24/7.",
      features: ["Respuestas instantáneas", "Múltiples plataformas", "Personalización"]
    },
    {
      icon: ShoppingCart,
      title: "Ventas conectadas al inventario",
      description: "IA integrada con tu ERP que ofrece productos personalizados según el stock y preferencias del cliente.",
      features: ["Integración ERP", "Ofertas personalizadas", "Inventario en tiempo real"]
    },
    {
      icon: CreditCard,
      title: "Recuperación de cartera",
      description: "Robots inteligentes que hacen seguimiento a facturas vencidas y gestionan cobros de manera automática.",
      features: ["Seguimiento automático", "Recordatorios inteligentes", "Gestión de cobros"]
    },
    {
      icon: Calendar,
      title: "Agendamiento automático",
      description: "Agentes que coordinan citas, confirman disponibilidad y envían recordatorios sin intervención humana.",
      features: ["Coordinación inteligente", "Confirmaciones automáticas", "Recordatorios"]
    },
    {
      icon: Target,
      title: "Campañas de marketing masivas",
      description: "Ejecución de campañas omnicanal con IA que segmenta audiencias y personaliza mensajes automáticamente.",
      features: ["Segmentación IA", "Omnicanal", "Personalización masiva"]
    },
    {
      icon: Users,
      title: "Generación de leads",
      description: "IA conversacional que identifica, califica y nutre leads potenciales en múltiples canales digitales.",
      features: ["Identificación automática", "Calificación inteligente", "Nutrición de leads"]
    }
  ];

  return (
    <section id="casos-uso" className="py-20 bg-card/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Casos de uso que{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              transforman negocios
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Nuestros agentes de IA se adaptan a cualquier industria y proceso empresarial
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {useCases.map((useCase, index) => {
            const IconComponent = useCase.icon;
            return (
              <Card 
                key={index} 
                className="group transition-all duration-300 hover:scale-105 backdrop-blur-sm bg-gradient-to-br from-accent/20 to-primary/10 border-accent/40 shadow-glow-accent hover:shadow-glow-primary"
              >
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 bg-gradient-to-br from-accent to-primary shadow-glow-accent group-hover:shadow-glow-primary">
                    <IconComponent size={24} className="text-background" />
                  </div>
                  <CardTitle className="text-foreground text-lg leading-tight">
                    {useCase.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {useCase.description}
                  </p>
                  <div className="space-y-2">
                    {useCase.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2 text-xs">
                        <div className="w-1 h-1 bg-accent rounded-full" />
                        <span className="text-accent">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;