import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Sparkles, MessageSquare, Zap, Bot, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStateBySlug, getUSACityBySlug } from "@/data/seoUSA";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const AGENTIA_URL = "https://www.agentia.com.co";

const USACityLanding = () => {
  const { stateSlug, citySlug } = useParams<{ stateSlug: string; citySlug: string }>();
  const state = getStateBySlug(stateSlug || "");
  const city = state ? getUSACityBySlug(stateSlug || "", citySlug || "") : undefined;

  if (!state || !city) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">City not found</h1>
          <Button asChild><Link to="/usa">View all states</Link></Button>
        </div>
      </div>
    );
  }

  const nearbyCities = state.cities.filter(c => c.slug !== city.slug).slice(0, 8);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`AI Agents in ${city.name}, ${state.abbr} | Agentia`}
        description={`AI Agents in ${city.name}, ${state.name}. Automate your business with the #1 AI agents. 24/7 customer service, automated sales, intelligent support. Try Agentia free.`}
        canonical={`https://www.agentia.com.co/usa/${state.slug}/${city.slug}`}
        keywords={`AI agents ${city.name}, AI automation ${city.name} ${state.abbr}, AI customer service ${city.name}`}
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
            <Link to={`/usa/${state.slug}`} className="hover:text-foreground transition-colors">{state.name}</Link>
            <span>/</span>
            <span className="text-foreground">{city.name}</span>
          </nav>
        </div>

        <section className="container mx-auto px-4 py-12 md:py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-6 h-6 text-primary" />
              <span className="text-lg text-muted-foreground">{city.name}, {state.name} 🇺🇸</span>
              {city.population && <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">{city.population}</span>}
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">AI Agents in {city.name}</h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
              AI agents that automate customer service, sales, and support for your business in {city.name}, {state.name}. Available 24/7 with Agentia.
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
          <h2 className="text-3xl font-bold mb-8">What can AI agents do in {city.name}?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: MessageSquare, title: "24/7 Auto-Replies", desc: `Your business in ${city.name} never sleeps. Agentia AI agents automatically respond to every message with natural, intelligent replies.` },
              { icon: Zap, title: "Automated Sales", desc: `Convert conversations into sales. Our AI agents guide your ${city.name} customers from inquiry to purchase.` },
              { icon: Bot, title: "AI That Learns Your Business", desc: `Configure your AI agent with ${city.name}-specific business info and it will respond like a member of your team.` },
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

        <section className="container mx-auto px-4 py-16 border-t border-border/30">
          <h2 className="text-2xl font-bold mb-6">AI Agents in other {state.name} cities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {nearbyCities.map(c => (
              <Link key={c.slug} to={`/usa/${state.slug}/${c.slug}`}
                className="p-3 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all text-sm">
                <span className="font-medium text-foreground">{c.name}</span>
              </Link>
            ))}
          </div>
          <div className="mt-4">
            <Link to={`/usa/${state.slug}`} className="text-primary hover:underline text-sm">View all cities in {state.name} →</Link>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center p-12 rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
            <Sparkles className="w-8 h-8 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">AI Agents in {city.name}</h2>
            <p className="text-muted-foreground mb-8">Automate your business in {city.name}, {state.name} with the most advanced AI agents from Agentia.</p>
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

export default USACityLanding;
