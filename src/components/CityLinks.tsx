import { useMemo, useState } from "react";
import { MapPin, Search, ChevronDown, ArrowRight, Globe } from "lucide-react";
import { allCountries } from "@/data/seoIndex";
import { useLanguage } from "@/contexts/LanguageContext";

// Show top countries as pills
const TOP_COUNTRIES = allCountries.slice(0, 12);

const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

function CountryPill({ slug, name, flag, cityCount }: { slug: string; name: string; flag: string; cityCount: number }) {
  return (
    <a
      href={`/${slug}`}
      title={`Agentes de IA en ${name}`}
      className="inline-flex items-center gap-2 rounded-full border border-accent/40
                 bg-background/60 hover:bg-accent/10 hover:border-accent/60
                 transition-colors text-sm px-3.5 py-1.5"
    >
      <span>{flag}</span>
      <span className="font-semibold whitespace-nowrap">{name}</span>
      <span className="text-xs text-muted-foreground">{cityCount} ciudades</span>
    </a>
  );
}

export default function CityLinks() {
  const [q, setQ] = useState("");
  const { t } = useLanguage();

  const restCountries = allCountries.slice(12);

  const filtered = useMemo(() => {
    const nq = norm(q);
    if (!nq) return restCountries;
    return restCountries.filter(c => norm(c.name).includes(nq) || c.cities.some(city => norm(city.name).includes(nq)));
  }, [q]);

  return (
    <section aria-labelledby="coverage" className="py-8 border-y border-border/40 bg-card/20">
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="text-accent" size={18} />
          <h2 id="coverage" className="text-lg md:text-xl font-bold">{t("coverage.title")}</h2>
        </div>

        {/* Top countries */}
        <div className="flex flex-wrap gap-2 mb-3">
          {TOP_COUNTRIES.map(c => (
            <CountryPill key={c.slug} slug={c.slug} name={c.name} flag={c.flag} cityCount={c.cities.length} />
          ))}
          <a
            href="/usa"
            title="Agentes de IA en Estados Unidos"
            className="inline-flex items-center gap-2 rounded-full border border-accent/40
                       bg-background/60 hover:bg-accent/10 hover:border-accent/60
                       transition-colors text-sm px-3.5 py-1.5"
          >
            <span>🇺🇸</span>
            <span className="font-semibold whitespace-nowrap">Estados Unidos</span>
            <span className="text-xs text-muted-foreground">50 estados</span>
          </a>
        </div>

        {/* Expandable */}
        <details className="group">
          <summary className="list-none w-full cursor-pointer select-none">
            <div className="flex items-center justify-between rounded-full border border-accent/40 bg-gradient-to-r from-accent/10 to-primary/10 hover:from-accent/20 hover:to-primary/20 px-4 py-2 transition-all shadow-[0_0_10px_0_rgba(0,0,0,0.08)] group-open:shadow-[0_0_18px_0_rgba(0,0,0,0.12)]">
              <span className="text-sm font-medium">{t("coverage.viewMore")}</span>
              <ChevronDown size={16} className="text-accent transition-transform group-open:rotate-180" />
            </div>
          </summary>

          <div className="mt-3">
            <label className="w-full md:w-[360px] relative block mb-3">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder={t("coverage.searchPlaceholder")}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full h-9 pl-8 pr-3 rounded-full border border-accent/30 bg-background/70 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </label>

            <div className="flex flex-wrap gap-2">
              {filtered.map(c => (
                <CountryPill key={c.slug} slug={c.slug} name={c.name} flag={c.flag} cityCount={c.cities.length} />
              ))}
            </div>

            <div className="mt-4">
              <a
                href="/ciudades/"
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-background bg-gradient-primary hover:shadow-glow-primary transition-all"
                title="Ver todos los países y ciudades"
              >
                {t("coverage.viewAll")}
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </details>
      </div>
    </section>
  );
}
