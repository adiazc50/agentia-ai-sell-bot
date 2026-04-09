import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Sparkles, MessageSquare, Zap, Bot, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCountryBySlug, getCityBySlug } from "@/data/seoIndex";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const AGENTIA_URL = "https://www.agentia.com.co";

const CityLanding = () => {
  const { countrySlug, citySlug } = useParams<{ countrySlug: string; citySlug: string }>();
  const country = getCountryBySlug(countrySlug || "");
  const city = country ? getCityBySlug(countrySlug || "", citySlug || "") : undefined;

  if (!country || !city) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Ciudad no encontrada</h1>
          <Button asChild><Link to="/">Volver al inicio</Link></Button>
        </div>
      </div>
    );
  }

  const nearbyCities = country.cities.filter(c => c.slug !== city.slug).slice(0, 8);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`Agentes de IA en ${city.name}, ${country.name} | Agentia`}
        description={`Agentes de IA en ${city.name}, ${country.name}. Automatiza ventas, soporte y atención al cliente 24/7 con inteligencia artificial. Prueba Agentia gratis.`}
        canonical={`https://www.agentia.com.co/${country.slug}/${city.slug}`}
        keywords={`agentes de IA ${city.name}, inteligencia artificial ${city.name}, automatización ${city.name} ${country.name}, bot IA ${city.name}`}
      />
      <Navbar />
      <WhatsAppButton />

      <main className="pt-24">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 pt-8">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Inicio</Link>
            <span>/</span>
            <Link to={`/${country.slug}`} className="hover:text-foreground transition-colors">{country.name}</Link>
            <span>/</span>
            <span className="text-foreground">{city.name}</span>
          </nav>
        </div>

        {/* Hero */}
        <section className="container mx-auto px-4 py-12 md:py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-6 h-6 text-primary" />
              <span className="text-lg text-muted-foreground">{city.name}, {country.name} {country.flag}</span>
              {city.population && <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">{city.population} hab.</span>}
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              Agentes de IA en {city.name}
            </h1>
            <p className="text-lg text-muted-foreground mb-4 max-w-2xl">{city.description}</p>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
              Agentes de inteligencia artificial que automatizan ventas, atención al cliente y soporte de tu negocio en {city.name} con Agentia.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-lg px-8 py-6" asChild>
                <a href={AGENTIA_URL} target="_blank" rel="noopener noreferrer">
                  Comenzar ahora <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <Button variant="outline" size="lg" className="border-primary/50 text-primary text-lg px-8 py-6" asChild>
                <a href="/#planes">Ver planes</a>
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 py-16 border-t border-border/30">
          <h2 className="text-3xl font-bold mb-8">¿Qué hacen los agentes de IA en {city.name}?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: MessageSquare, title: "Respuestas Automáticas 24/7", desc: `Tu negocio en ${city.name} nunca duerme. Los agentes de IA de Agentia responden automáticamente a cada mensaje con respuestas naturales e inteligentes.` },
              { icon: Zap, title: "Ventas Automatizadas", desc: `Convierte conversaciones en ventas. Nuestros agentes de IA guían a tus clientes en ${city.name} desde la consulta hasta la compra.` },
              { icon: Bot, title: "IA que Aprende tu Negocio", desc: `Configura tu agente de IA con información específica de tu negocio en ${city.name} y responderá como un experto de tu equipo.` },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
                className="p-6 rounded-xl border border-border/50 bg-card/50">
                <f.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Other cities */}
        <section className="container mx-auto px-4 py-16 border-t border-border/30">
          <h2 className="text-2xl font-bold mb-6">Agentes de IA en otras ciudades de {country.name}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {nearbyCities.map(c => (
              <Link key={c.slug} to={`/${country.slug}/${c.slug}`}
                className="p-3 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all text-sm">
                <span className="font-medium text-foreground">{c.name}</span>
              </Link>
            ))}
          </div>
          <div className="mt-4">
            <Link to={`/${country.slug}`} className="text-primary hover:underline text-sm">
              Ver todas las ciudades de {country.name} →
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center p-12 rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
            <Sparkles className="w-8 h-8 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Agentes de IA en {city.name}</h2>
            <p className="text-muted-foreground mb-8">Automatiza tu negocio en {city.name}, {country.name} con los agentes de IA más avanzados de Agentia.</p>
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-lg px-8 py-6" asChild>
              <a href={AGENTIA_URL} target="_blank" rel="noopener noreferrer">
                Comenzar ahora <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CityLanding;
