import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { MapPin, Search, Globe } from "lucide-react";
import { allCountries } from "@/data/seoIndex";
import { usaStates, totalUSACities } from "@/data/seoUSA";

const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export default function CityHub() {
  const [q, setQ] = useState("");

  useEffect(() => {
    document.title = "Agentes de IA en el mundo | SoyAgentia";
    const d = document.querySelector('meta[name="description"]') || (() => {
      const m = document.createElement("meta");
      m.setAttribute("name", "description");
      document.head.appendChild(m);
      return m;
    })();
    d.setAttribute("content", "Cobertura mundial de Agentes de IA. 31 países, 50 estados de USA y más de 2.900 ciudades. Encuentra tu ciudad y automatiza ventas y soporte 24/7.");
  }, []);

  const totalCities = useMemo(() => {
    const countryCities = allCountries.reduce((sum, c) => sum + c.cities.length, 0);
    return countryCities + totalUSACities;
  }, []);

  const filteredCountries = useMemo(() => {
    const nq = norm(q);
    if (!nq) return allCountries;
    return allCountries.filter(c =>
      norm(c.name).includes(nq) || c.cities.some(city => norm(city.name).includes(nq))
    );
  }, [q]);

  const filteredStates = useMemo(() => {
    const nq = norm(q);
    if (!nq) return usaStates;
    return usaStates.filter(s =>
      norm(s.name).includes(nq) || s.cities.some(city => norm(city.name).includes(nq))
    );
  }, [q]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <WhatsAppButton />

      <main className="pt-16">
        <section className="py-10">
          <div className="container mx-auto px-6">
            <h1 className="text-2xl md:text-4xl font-bold mb-2">
              Agentes de IA en el mundo
            </h1>
            <p className="text-muted-foreground mb-2">
              {allCountries.length} países + 50 estados de USA &bull; +{totalCities.toLocaleString()} ciudades &bull; Soporte 24/7
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Globe className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">{allCountries.length} países</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">+{totalCities.toLocaleString()} ciudades</span>
              </div>
            </div>

            {/* Search */}
            <div className="w-full md:w-[420px] relative mb-8">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Buscar país, estado o ciudad..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-full border border-accent/30
                           bg-background/70 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>

            {/* Countries */}
            <h2 className="text-xl font-bold mb-4">Países</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
              {filteredCountries.map(country => (
                <Link
                  key={country.slug}
                  to={`/${country.slug}`}
                  className="group p-4 rounded-xl border border-border/50 bg-card/30 hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{country.flag}</span>
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{country.name}</h3>
                      <span className="text-xs text-muted-foreground">{country.cities.length} ciudades</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* USA */}
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl font-bold">Estados Unidos</h2>
              <Link to="/usa" className="text-primary text-sm hover:underline">Ver todo →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredStates.map(state => (
                <Link
                  key={state.slug}
                  to={`/usa/${state.slug}`}
                  className="group p-4 rounded-xl border border-border/50 bg-card/30 hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{state.name}</h3>
                      <span className="text-xs text-muted-foreground">{state.cities.length} cities</span>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-1 rounded">{state.abbr}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
