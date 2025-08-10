import { useMemo, useState } from "react";
import { MapPin, Search, ChevronDown, ArrowRight } from "lucide-react";

// --- mismas ciudades ---
const CITIES = [
  { slug: "bogota", label: "Bogotá", cc: "CO" },
  { slug: "medellin", label: "Medellín", cc: "CO" },
  { slug: "cali", label: "Cali", cc: "CO" },
  { slug: "barranquilla", label: "Barranquilla", cc: "CO" },
  { slug: "cartagena", label: "Cartagena", cc: "CO" },
  { slug: "bucaramanga", label: "Bucaramanga", cc: "CO" },
  { slug: "cucuta", label: "Cúcuta", cc: "CO" },
  { slug: "pereira", label: "Pereira", cc: "CO" },
  { slug: "manizales", label: "Manizales", cc: "CO" },
  { slug: "armenia", label: "Armenia", cc: "CO" },
  { slug: "ibague", label: "Ibagué", cc: "CO" },
  { slug: "pasto", label: "Pasto", cc: "CO" },
  { slug: "monteria", label: "Montería", cc: "CO" },
  { slug: "neiva", label: "Neiva", cc: "CO" },
  { slug: "villavicencio", label: "Villavicencio", cc: "CO" },
  { slug: "popayan", label: "Popayán", cc: "CO" },
  { slug: "sincelejo", label: "Sincelejo", cc: "CO" },
  { slug: "tunja", label: "Tunja", cc: "CO" },
  { slug: "yopal", label: "Yopal", cc: "CO" },
  { slug: "riohacha", label: "Riohacha", cc: "CO" },
  { slug: "quibdo", label: "Quibdó", cc: "CO" },
  { slug: "florencia", label: "Florencia", cc: "CO" },
  { slug: "mocoa", label: "Mocoa", cc: "CO" },
  { slug: "mitu", label: "Mitú", cc: "CO" },
  { slug: "san-andres", label: "San Andrés", cc: "CO" },
  { slug: "leticia", label: "Leticia", cc: "CO" },
  { slug: "inirida", label: "Inírida", cc: "CO" },
  { slug: "puerto-carreno", label: "Puerto Carreño", cc: "CO" },
  { slug: "valledupar", label: "Valledupar", cc: "CO" },
  { slug: "santa-marta", label: "Santa Marta", cc: "CO" },
  { slug: "ciudad-de-panama", label: "Ciudad de Panamá", cc: "PA" },
];

const TOP_SLUGS = [
  "bogota","medellin","cali","barranquilla","cartagena","bucaramanga",
  "cucuta","pereira","villavicencio","santa-marta","manizales","armenia",
];

const TOP  = CITIES.filter(c => TOP_SLUGS.includes(c.slug));
const REST = CITIES.filter(c => !TOP_SLUGS.includes(c.slug));

const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

function PillLink({ slug, label, cc }: { slug: string; label: string; cc: string }) {
  return (
    <a
      href={`/ciudades/${slug}/`}
      title={`Agentes de IA en ${label}`}
      className="inline-flex items-center gap-2 rounded-full border border-accent/40
                 bg-background/60 hover:bg-accent/10 hover:border-accent/60
                 transition-colors text-sm px-3.5 py-1.5"
    >
      <MapPin className="w-3.5 h-3.5 text-accent" />
      <span className="font-semibold whitespace-nowrap">Agentes de IA en {label}</span>
      <span className="text-xs text-sky-400">{cc}</span>
    </a>
  );
}

export default function CityLinks() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const nq = norm(q);
    if (!nq) return REST;
    return REST.filter((c) => norm(c.label).includes(nq));
  }, [q]);

  return (
    <section aria-labelledby="cities" className="py-8 border-y border-border/40 bg-card/20">
      <div className="container mx-auto px-6">
        {/* Título */}
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="text-accent" size={18} />
          <h2 id="cities" className="text-lg md:text-xl font-bold">Cobertura por ciudad</h2>
        </div>

        {/* Píldoras principales (SEO) */}
        <div className="flex flex-wrap gap-2 mb-3">
          {TOP.map((c) => (
            <PillLink key={c.slug} {...c} />
          ))}
        </div>

        {/* Plegable brand-style */}
        <details className="group">
          <summary className="list-none w-full cursor-pointer select-none">
            <div
              className="
                flex items-center justify-between rounded-full
                border border-accent/40
                bg-gradient-to-r from-accent/10 to-primary/10
                hover:from-accent/20 hover:to-primary/20
                px-4 py-2 transition-all
                shadow-[0_0_10px_0_rgba(0,0,0,0.08)]
                group-open:shadow-[0_0_18px_0_rgba(0,0,0,0.12)]
              "
            >
              <span className="text-sm font-medium">Ver más ciudades</span>
              <ChevronDown
                size={16}
                className="text-accent transition-transform group-open:rotate-180"
              />
            </div>
          </summary>

          <div className="mt-3">
            {/* Buscador */}
            <label className="w-full md:w-[360px] relative block mb-3">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Buscar ciudad…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full h-9 pl-8 pr-3 rounded-full border border-accent/30
                           bg-background/70 text-sm
                           focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </label>

            {/* Píldoras restantes */}
            <div className="flex flex-wrap gap-2">
              {filtered.map((c) => (
                <PillLink key={c.slug} {...c} />
              ))}
            </div>

            {/* Botón a /ciudades/ con colores de marca */}
            <div className="mt-4">
              <a
                href="/ciudades/"
                className="
                  inline-flex items-center gap-2 rounded-full
                  px-4 py-2 text-sm font-medium
                  text-background bg-gradient-primary
                  hover:shadow-glow-primary transition-all
                "
                title="Ver todas las ciudades"
              >
                Ver todas las ciudades
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </details>
      </div>
    </section>
  );
}
