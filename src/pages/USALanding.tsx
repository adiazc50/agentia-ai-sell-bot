import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usaStates, totalUSACities } from "@/data/seoUSA";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const AGENTIA_URL = "https://www.agentia.com.co";

const USALanding = () => (
  <div className="min-h-screen bg-background">
    <SEOHead
      title="AI Agents in the USA | Agentia"
      description="AI Agents: Automate your American business with the #1 AI agents. Available 24/7 across all 50 states. Try Agentia free."
      canonical="https://www.agentia.com.co/usa"
      keywords="AI agents USA, AI agents United States, AI automation USA, AI customer service USA"
    />
    <Navbar />
    <WhatsAppButton />
    <main className="pt-24">
      <section className="container mx-auto px-4 py-16 md:py-24">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors text-sm">
          ← Back to home
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
          <span className="text-6xl mb-4 block">🇺🇸</span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">AI Agents in the United States</h1>
          <p className="text-xl text-muted-foreground mb-4 max-w-2xl">
            AI agents that automate your business across all 50 states. 24/7 customer service, automated sales, and intelligent support with Agentia.
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-md mb-8">
            {[
              { value: "50", label: "States" },
              { value: `+${totalUSACities}`, label: "Cities" },
              { value: "24/7", label: "Available" },
            ].map((s) => (
              <div key={s.label} className="text-center p-3 rounded-xl bg-primary/10 border border-primary/20">
                <div className="text-2xl font-bold gradient-text">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
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
        <h2 className="text-3xl font-bold mb-8">All 50 States</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {usaStates.map((state, i) => (
            <motion.div key={state.slug} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
              <Link to={`/usa/${state.slug}`} className="group block p-4 rounded-xl border border-border/50 bg-card/30 hover:border-primary/50 hover:bg-primary/5 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{state.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <MapPin className="w-3 h-3" /><span>{state.cities.length} cities</span><span>&bull;</span><span>{state.population}</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-1 rounded">{state.abbr}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center p-12 rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
          <Sparkles className="w-8 h-8 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">AI Agents across the USA</h2>
          <p className="text-muted-foreground mb-8">Join thousands of American businesses using AI agents with Agentia.</p>
          <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-lg px-8 py-6" asChild>
            <a href={AGENTIA_URL} target="_blank" rel="noopener noreferrer">Get started <ExternalLink className="w-4 h-4 ml-2" /></a>
          </Button>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default USALanding;
