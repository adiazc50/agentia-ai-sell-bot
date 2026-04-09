import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Shield, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCountryBySlug } from "@/data/seoIndex";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const AGENTIA_URL = "https://www.agentia.com.co";

const CountryLanding = () => {
  const { countrySlug } = useParams<{ countrySlug: string }>();
  const country = getCountryBySlug(countrySlug || "");

  if (!country) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">País no encontrado</h1>
          <Button asChild><Link to="/">Volver al inicio</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`Agentes de IA en ${country.name} ${country.flag} | Agentia`}
        description={country.metaDescription}
        canonical={`https://www.agentia.com.co/${country.slug}`}
        keywords={`agentes de IA ${country.name}, inteligencia artificial ${country.name}, automatización ${country.capital}, bot IA ${country.name}`}
      />
      <Navbar />
      <WhatsAppButton />

      <main className="pt-24">
        {/* Hero */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors text-sm">
            ← Volver al inicio
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            <span className="text-6xl mb-4 block">{country.flag}</span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              {country.headline}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">{country.subheadline}</p>
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

        {/* Benefits */}
        <section className="container mx-auto px-4 py-16 border-t border-border/30">
          <h2 className="text-3xl font-bold mb-8">¿Por qué Agentes de IA en {country.name}?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {country.localBenefits.map((b, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="p-6 rounded-xl border border-border/50 bg-card/50">
                <Shield className="w-6 h-6 text-primary mb-3" />
                <p className="text-foreground">{b}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Industries */}
        <section className="container mx-auto px-4 py-16 border-t border-border/30">
          <h2 className="text-3xl font-bold mb-8">Industrias con Agentes de IA en {country.name}</h2>
          <div className="flex flex-wrap gap-3">
            {country.industries.map((ind, i) => (
              <span key={i} className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium">
                {ind}
              </span>
            ))}
          </div>
        </section>

        {/* Cities Grid */}
        <section className="container mx-auto px-4 py-16 border-t border-border/30" id="ciudades">
          <h2 className="text-3xl font-bold mb-4">
            Agentes de IA en las principales ciudades de {country.name}
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            Nuestros agentes de IA están disponibles en las {country.cities.length} ciudades más importantes de {country.name}.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {country.cities.map((city) => (
              <Link
                key={city.slug}
                to={`/${country.slug}/${city.slug}`}
                className="group p-4 rounded-xl border border-border/50 bg-card/30 hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-primary mt-1 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{city.name}</h3>
                    {city.population && <span className="text-xs text-muted-foreground">{city.population} hab.</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center p-12 rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
            <Sparkles className="w-8 h-8 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Agentes de IA en {country.name}</h2>
            <p className="text-muted-foreground mb-8">Únete a las empresas en {country.capital} y todo {country.name} que ya automatizan con Agentia.</p>
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

export default CountryLanding;
