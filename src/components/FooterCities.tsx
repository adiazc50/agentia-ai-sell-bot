import { MapPin } from "lucide-react";

const CITIES = [
  { slug: "bogota", label: "Bogotá" },
  { slug: "medellin", label: "Medellín" },
  { slug: "cali", label: "Cali" },
  { slug: "barranquilla", label: "Barranquilla" },
  { slug: "cartagena", label: "Cartagena" },
  { slug: "bucaramanga", label: "Bucaramanga" },
  { slug: "cucuta", label: "Cúcuta" },
  { slug: "pereira", label: "Pereira" },
  { slug: "villavicencio", label: "Villavicencio" },
  { slug: "santa-marta", label: "Santa Marta" },
  { slug: "manizales", label: "Manizales" },
  { slug: "armenia", label: "Armenia" },
];

function Pill({ slug, label }: { slug: string; label: string }) {
  return (
    <a
      href={`/ciudades/${slug}/`}
      title={`Agentes de IA en ${label}`}
      className="inline-flex items-center gap-2 rounded-full border border-accent/40
                 bg-background/60 hover:bg-accent/10 hover:border-accent/60
                 transition-colors text-xs px-3 py-1"
    >
      <MapPin className="w-3.5 h-3.5 text-accent" />
      <span className="font-semibold whitespace-nowrap">Agentes de IA en {label}</span>
    </a>
  );
}

export default function FooterCities() {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {CITIES.map((c) => (
          <Pill key={c.slug} {...c} />
        ))}
      </div>

      <div>
        <a href="/ciudades/" className="text-sm text-primary hover:underline">
          Ver todas las ciudades →
        </a>
      </div>
    </div>
  );
}
