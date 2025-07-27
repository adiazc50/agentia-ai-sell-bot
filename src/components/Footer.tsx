import { MapPin, Phone, Instagram, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-card border-t border-border/50 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              SoyAgentia
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Empresa de base tecnológica especializada en Agentes de Inteligencia Artificial 
              y robótica empresarial a medida.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-foreground font-medium">Agentia SAS</p>
              <p className="text-xs text-muted-foreground">
                Registro mercantil y documentos legales disponibles
              </p>
            </div>
          </div>
          
          {/* Contact info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground hover:text-accent transition-colors">
                <MapPin size={18} className="text-accent" />
                <span>Medellín, Colombia</span>
              </div>
              <a 
                href="tel:+573009006005" 
                className="flex items-center gap-3 text-muted-foreground hover:text-accent transition-colors"
              >
                <Phone size={18} className="text-accent" />
                <span>+57 300 900 6005</span>
              </a>
              <a 
                href="https://wa.me/573009006005" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted-foreground hover:text-accent transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-green-500">
                  <path d="M12.017 2C6.487 2 2.017 6.47 2.017 12c0 1.748.44 3.395 1.223 4.844L2 22l5.268-1.212C8.686 21.51 10.307 22 12.017 22c5.53 0 10-4.47 10-10S17.547 2 12.017 2zm5.985 14.116c-.223.622-1.314 1.182-1.808 1.182-.414 0-.957-.127-2.899-1.076-2.427-1.184-3.955-3.715-4.075-3.889-.12-.173-.972-1.294-.972-2.467s.617-1.751.834-1.992c.218-.24.478-.3.638-.3.16 0 .32.007.458.013.147.008.346-.055.54.414.2.484.68 1.66.74 1.78.06.12.1.262.02.425-.08.162-.12.263-.24.404-.12.14-.253.314-.362.421-.12.12-.245.25-.105.49.14.24.62 1.026 1.33 1.66 1.326 1.182 2.441 1.547 2.787 1.72.346.174.55.145.75-.087.2-.233.857-1.001 1.085-1.344.228-.343.457-.287.77-.173.314.115 1.992.94 2.334 1.111.342.171.57.257.653.4.083.142.083.826-.14 1.448z"/>
                </svg>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
          
          {/* Social links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Síguenos</h4>
            <div className="space-y-3">
              <a 
                href="https://instagram.com/soyagentia" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted-foreground hover:text-accent transition-colors"
              >
                <Instagram size={18} className="text-accent" />
                <span>@soyagentia</span>
              </a>
              <a 
                href="mailto:contacto@soyagentia.com" 
                className="flex items-center gap-3 text-muted-foreground hover:text-accent transition-colors"
              >
                <Mail size={18} className="text-accent" />
                <span>contacto@soyagentia.com</span>
              </a>
            </div>
            
            {/* Quick links */}
            <div className="pt-4">
              <h5 className="text-sm font-medium text-foreground mb-2">Servicios</h5>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>• Agentes de IA conversacionales</p>
                <p>• Automatización de ventas</p>
                <p>• Integración con ERP/CRM</p>
                <p>• Consultoría en IA</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="border-t border-border/50 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © {currentYear} Agentia SAS - SoyAgentia. Todos los derechos reservados.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Desarrollado con tecnología propia en Medellín, Colombia 🇨🇴
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;