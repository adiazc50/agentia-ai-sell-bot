import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Brain, 
  Cloud, 
  Database, 
  Globe, 
  Smartphone,
  Cpu,
  Shield,
  Zap
} from "lucide-react";
import techBackground from "@/assets/tech-background.jpg";

const TechSection = () => {
  const technologies = [
    { name: "GPT", category: "IA" },
    { name: "AWS", category: "Cloud" },
    { name: "Azure", category: "Cloud" },
    { name: "Oracle Cloud", category: "Cloud" },
    { name: "Google Cloud", category: "Cloud" },
    { name: "Docker", category: "DevOps" },
    { name: "Kubernetes", category: "DevOps" },
    { name: "Twilio", category: "Comunicaciones" },
    { name: "OpenAI", category: "IA" },
    { name: "Copilot", category: "IA" },
    { name: "TensorFlow", category: "ML" },
    { name: "Python", category: "Backend" },
    { name: "React", category: "Frontend" },
    { name: "Node.js", category: "Backend" },
    { name: "Microsoft", category: "Enterprise" },
    { name: "Power BI", category: "Analytics" },
    { name: "Business Intelligence", category: "Analytics" },
    { name: "Robótica", category: "Robotics" },
    { name: "WhatsApp API", category: "Messaging" },
    { name: "Meta API", category: "Social" },
    { name: "MongoDB", category: "Database" },
    { name: "PostgreSQL", category: "Database" },
    { name: "Redis", category: "Cache" },
    { name: "Elasticsearch", category: "Search" }
  ];

  const capabilities = [
    {
      icon: Brain,
      title: "Inteligencia Artificial Avanzada",
      description: "Modelos de IA de última generación para comprensión y generación de lenguaje natural"
    },
    {
      icon: Cloud,
      title: "Infraestructura Escalable",
      description: "Arquitectura cloud que se adapta al crecimiento de tu empresa sin límites"
    },
    {
      icon: Database,
      title: "Integración Completa",
      description: "Conectamos con cualquier sistema: ERP, CRM, bases de datos y APIs existentes"
    },
    {
      icon: Globe,
      title: "Presencia Omnicanal",
      description: "Un solo agente que funciona en web, móvil, WhatsApp, redes sociales y teléfono"
    },
    {
      icon: Smartphone,
      title: "Experiencia Móvil",
      description: "Optimizado para dispositivos móviles con interfaces intuitivas y responsivas"
    },
    {
      icon: Cpu,
      title: "Procesamiento en Tiempo Real",
      description: "Respuestas instantáneas con procesamiento distribuido de alta velocidad"
    },
    {
      icon: Shield,
      title: "Seguridad Empresarial",
      description: "Protocolos de seguridad bancaria y cumplimiento GDPR para proteger datos"
    },
    {
      icon: Zap,
      title: "Implementación Rápida",
      description: "Despliegue con configuración personalizada para tu negocio"
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={techBackground} 
          alt="Technology Background" 
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 to-card/90" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Tecnología de{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              vanguardia
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Más que una agencia, somos una empresa de base tecnológica con desarrollo propio en IA y robótica
          </p>
          
          {/* Technology badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {technologies.map((tech, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="px-4 py-2 text-sm border-primary/30 hover:bg-primary/10 transition-colors duration-200"
              >
                {tech.name}
                <span className="ml-2 text-xs text-accent">{tech.category}</span>
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Capabilities grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((capability, index) => {
            const IconComponent = capability.icon;
            return (
              <Card 
                key={index}
                className="group hover:shadow-glow-accent transition-all duration-300 hover:scale-105 bg-card/80 backdrop-blur-sm border-border/50"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-accent flex items-center justify-center mx-auto mb-4 group-hover:shadow-glow-accent transition-all duration-300">
                    <IconComponent size={28} className="text-accent-foreground" />
                  </div>
                  <h3 className="text-foreground font-semibold mb-3 text-lg leading-tight">
                    {capability.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {capability.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Trust section */}
        <div className="text-center mt-16 p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Desarrollado 100% en Medellín, Colombia
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Nuestro equipo de ingenieros en IA trabaja desde el corazón de la innovación tecnológica colombiana, 
            creando soluciones que compiten a nivel mundial con el talento local.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TechSection;