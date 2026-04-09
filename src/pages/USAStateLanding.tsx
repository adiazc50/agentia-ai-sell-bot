import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStateBySlug } from "@/data/seoUSA";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const AGENTIA_URL = "https://www.agentia.com.co";

const USAStateLanding = () => {
  const { stateSlug } = useParams<{ stateSlug: string }>();
  const state = getStateBySlug(stateSlug || "");

  if (!state) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">State not found</h1>
          <Button asChild><Link to="/usa">View all states</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`AI Agents in ${state.name} | Agentia`}
        description={state.metaDescription}
        canonical={`https://www.agentia.com.co/usa/${state.slug}`}
        keywords={`AI agents ${state.name}, AI automation ${state.name}, AI customer service ${state.capital}`}
      />
      <Navbar />
      <WhatsAppButton />
      <main className="pt-24">
        <div className="container mx-auto px-4 pt-8">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link to="/usa" className="hover:text-foreground transition-colors">USA</Link>
            <span>/</span>
            <span className="text-foreground">{state.name}</span>
          </nav>
        </div>

        <section className="container mx-auto px-4 py-12 md:py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">🇺🇸</span>
              <span className="font-mono text-lg text-muted-foreground bg-secondary px-3 py-1 rounded">{state.abbr}</span>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">{state.population}</span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">{state.headline}</h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
              AI agents that automate customer service, sales, and support for your business in {state.name}. Serving {state.cities.length} cities across the state with Agentia.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-lg px-8 py-6" asChild>
                <a href={AGENTIA_URL} target="_blank" rel="noopener noreferrer">Start free <ArrowRight className="w-5 h-5 ml-2" /></a>
              </Button>
              <Button variant="outline" size="lg" className="border-primary/50 text-primary text-lg px-8 py-6" asChild>
                <a href="/#planes">View plans</a>
              </Button>
            </div>
          </motion.div>
        </section>

        <section className="container mx-auto px-4 py-16 border-t border-border/30">
          <h2 className="text-3xl font-bold mb-4">Industries using AI Agents in {state.name}</h2>
          <div className="flex flex-wrap gap-3 mb-12">
            {state.industries.map((ind, i) => (
              <span key={i} className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium">{ind}</span>
            ))}
          </div>

          <h2 className="text-3xl font-bold mb-4">AI Agents in {state.name} cities</h2>
          <p className="text-muted-foreground mb-8">Agentia AI agents are available in {state.cities.length} cities across {state.name}.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {state.cities.map((city) => (
              <Link key={city.slug} to={`/usa/${state.slug}/${city.slug}`}
                className="group p-4 rounded-xl border border-border/50 bg-card/30 hover:border-primary/50 hover:bg-primary/5 transition-all">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-primary mt-1 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{city.name}</h3>
                    {city.population && <span className="text-xs text-muted-foreground">{city.population}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center p-12 rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
            <Sparkles className="w-8 h-8 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">AI Agents in {state.name}</h2>
            <p className="text-muted-foreground mb-8">Join businesses in {state.capital} and across {state.name} using AI agents with Agentia.</p>
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-lg px-8 py-6" asChild>
              <a href={AGENTIA_URL} target="_blank" rel="noopener noreferrer">Get started <ExternalLink className="w-4 h-4 ml-2" /></a>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default USAStateLanding;
