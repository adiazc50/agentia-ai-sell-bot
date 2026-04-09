import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Cloud, Database, Globe, Smartphone, Cpu, Shield, Zap } from "lucide-react";
import techBackground from "@/assets/tech-background.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

const technologies = [
  { name: "GPT", category: "IA" }, { name: "AWS", category: "Cloud" }, { name: "Azure", category: "Cloud" },
  { name: "Oracle Cloud", category: "Cloud" }, { name: "Google Cloud", category: "Cloud" },
  { name: "Docker", category: "DevOps" }, { name: "Kubernetes", category: "DevOps" },
  { name: "Twilio", category: "Comms" }, { name: "OpenAI", category: "IA" }, { name: "Copilot", category: "IA" },
  { name: "TensorFlow", category: "ML" }, { name: "Python", category: "Backend" },
  { name: "React", category: "Frontend" }, { name: "Node.js", category: "Backend" },
  { name: "Microsoft", category: "Enterprise" }, { name: "Power BI", category: "Analytics" },
  { name: "Business Intelligence", category: "Analytics" }, { name: "Robotics", category: "Robotics" },
  { name: "WhatsApp API", category: "Messaging" }, { name: "Meta API", category: "Social" },
  { name: "MongoDB", category: "Database" }, { name: "PostgreSQL", category: "Database" },
  { name: "Redis", category: "Cache" }, { name: "Elasticsearch", category: "Search" },
];

const CAP_ICONS = [Brain, Cloud, Database, Globe, Smartphone, Cpu, Shield, Zap];

const TechSection = () => {
  const { t } = useLanguage();

  const capabilities = Array.from({ length: 8 }, (_, i) => ({
    icon: CAP_ICONS[i],
    title: t(`tech.cap${i + 1}.title`),
    description: t(`tech.cap${i + 1}.desc`),
  }));

  const faqs = Array.from({ length: 6 }, (_, i) => ({
    q: t(`tech.faq${i + 1}.q`),
    a: t(`tech.faq${i + 1}.a`),
  }));

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question", name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <section id="tecnologia" role="region" aria-labelledby="tech-title" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={techBackground} alt="" className="w-full h-full object-cover opacity-10" loading="lazy" decoding="async" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/95 to-card/90" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 id="tech-title" className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {t("tech.title")}{" "}
              <span className="gradient-text">{t("tech.titleHighlight")}</span>{" "}
              {t("tech.titleEnd")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              {t("tech.subtitle")}
            </p>

            <ul aria-label={t("tech.techLabel")} className="flex flex-wrap justify-center gap-3 mb-12">
              {technologies.map((tech, i) => (
                <li key={i}>
                  <Badge variant="outline" className="px-4 py-2 text-sm border-primary/30 hover:bg-primary/10 transition-colors duration-200">
                    {tech.name}
                    <span className="ml-2 text-xs text-accent">{tech.category}</span>
                  </Badge>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilities.map((cap, i) => {
              const Icon = cap.icon;
              return (
                <Card key={i} className="group hover:shadow-glow-primary transition-all duration-300 hover:scale-105 hover:-translate-y-1 glass-card border-primary/20">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 group-hover:shadow-glow-primary transition-all duration-300">
                      <Icon size={28} className="text-accent-foreground" />
                    </div>
                    <h3 className="text-foreground font-semibold mb-3 text-lg leading-tight">{cap.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{cap.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <section className="text-center mt-16 p-8 rounded-2xl glass-card border-primary/20">
            <h3 className="text-2xl font-bold text-foreground mb-4">{t("tech.devTitle")}</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t("tech.devDesc")}</p>
          </section>
        </div>
      </section>

      {/* About section */}
      <section id="nosotros" className="container mx-auto px-6 mt-16 mb-4">
        <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
          <span className="gradient-text">{t("tech.aboutTitle")}</span>
        </h2>
        <div className="max-w-4xl mx-auto space-y-6 rounded-2xl glass-card border-primary/20 p-8">
          <p className="text-muted-foreground text-lg leading-relaxed">
            {t("about.p1")} <strong>{t("about.p1Bold")}</strong>
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {t("about.p2")} <strong>{t("about.p2Name")} —{t("about.p2Title")}—</strong>{t("about.p2End")}
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="container mx-auto px-6 mt-16 mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
          <span className="gradient-text">{t("tech.faqTitle")}</span>
        </h2>
        <div className="max-w-4xl mx-auto space-y-3">
          {faqs.map((item, i) => (
            <details key={i} className="group rounded-xl border border-primary/20 glass-card transition-all">
              <summary className="cursor-pointer list-none select-none px-5 py-4 flex items-start justify-between gap-4">
                <h3 className="font-semibold text-foreground text-base leading-snug">{item.q}</h3>
                <span className="shrink-0 rounded-full w-6 h-6 grid place-items-center border border-border/60 text-sm transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="px-5 pb-5 pt-0 text-sm text-muted-foreground leading-relaxed">{item.a}</div>
            </details>
          ))}
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      </section>
    </>
  );
};

export default TechSection;
