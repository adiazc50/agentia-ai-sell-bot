import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { MapPin, Search } from "lucide-react";

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

const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

function Pill({ slug, label, cc }: { slug: string; label: string; cc: string }) {
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

export default function CityHub() {
  const [q, setQ] = useState("");

  useEffect(() => {
    document.title = "Agentes de IA por ciudad | SoyAgentia";
    const d = document.querySelector('meta[name="description"]') || (() => {
      const m = document.createElement("meta");
      m.setAttribute("name", "description");
      document.head.appendChild(m);
      return m;
    })();
    d.setAttribute("content", "Cobertura nacional de Agentes de IA en Colombia y Ciudad de Panamá. Encuentra tu ciudad y automatiza ventas y soporte 24/7.");
  }, []);

  const shown = useMemo(() => {
    const nq = norm(q);
    if (!nq) return CITIES;
    return CITIES.filter(c => norm(c.label).includes(nq));
  }, [q]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <WhatsAppButton />

      <main className="pt-16">
        <section className="py-10">
          <div className="container mx-auto px-6">
            <h1 className="text-2xl md:text-4xl font-bold mb-2">
              Agentes de IA por ciudad
            </h1>
            <p className="text-muted-foreground mb-6">
              Colombia y Ciudad de Panamá • Implementación rápida • Soporte 24/7
            </p>

            <div className="w-full md:w-[420px] relative mb-6">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Buscar ciudad…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-full border border-accent/30
                           bg-background/70 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {shown.map(c => <Pill key={c.slug} {...c} />)}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
