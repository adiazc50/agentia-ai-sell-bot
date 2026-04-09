import { useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Handshake, Rocket, Award, Crown, Star, Zap, ArrowRight, Target, Users,
  ShieldCheck, TrendingUp, BookOpen, RefreshCw, CheckCircle2, XCircle,
  FileText, AlertTriangle, Scale, Briefcase, GraduationCap, BarChart3,
  Eye, Ban, MessageSquare
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PartnerRegistrationForm from "@/components/PartnerRegistrationForm";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const Partners = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth" });
  const { t } = useLanguage();
  const { formatPrice, currency } = useCurrency();

  const formatCOP = (amount: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
  };

  const showUSD = (amountCOP: number) => {
    if (currency === 'USD') {
      return ` (${t('partner.usdEquivalent')} ${formatPrice(amountCOP)})`;
    }
    return '';
  };

  const levels = [
    {
      name: t('partner.readyName'),
      margin: "15%",
      icon: Rocket,
      borderColor: "border-emerald-500/30",
      badgeClass: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
      iconColor: "text-emerald-600",
      bgGradient: "from-emerald-500/10 to-emerald-600/5",
      description: t('partner.readyDesc'),
      requirement: `${t('partner.readyReq')}${showUSD(5000000)}`,
      conditions: [t('partner.readyCond1'), `${t('partner.readyCond2')}${showUSD(5000000)}`],
      benefits: [t('partner.readyBen1'), t('partner.readyBen2'), t('partner.readyBen3'), t('partner.readyBen4')],
      training: t('partner.readyTraining'),
    },
    {
      name: t('partner.silverName'),
      margin: "20%",
      icon: Award,
      borderColor: "border-slate-400/40",
      badgeClass: "bg-slate-400/10 text-slate-700 border-slate-400/30",
      iconColor: "text-slate-500",
      bgGradient: "from-slate-400/10 to-slate-500/5",
      description: t('partner.silverDesc'),
      requirement: `${t('partner.silverReq')}${showUSD(15000000)}`,
      conditions: [`${t('partner.silverCond1')}${showUSD(15000000)}`],
      benefits: [t('partner.silverBen1'), t('partner.silverBen2'), t('partner.silverBen3'), t('partner.silverBen4'), t('partner.silverBen5')],
      training: t('partner.silverTraining'),
    },
    {
      name: t('partner.goldName'),
      margin: "25%",
      icon: Crown,
      borderColor: "border-amber-400/40",
      badgeClass: "bg-amber-400/10 text-amber-700 border-amber-400/40",
      iconColor: "text-amber-500",
      bgGradient: "from-amber-400/10 to-amber-500/5",
      description: t('partner.goldDesc'),
      requirement: `${t('partner.goldReq')}${showUSD(50000000)}`,
      conditions: [`${t('partner.goldCond1')}${showUSD(50000000)}`],
      benefits: [t('partner.goldBen1'), t('partner.goldBen2'), t('partner.goldBen3'), t('partner.goldBen4'), t('partner.goldBen5')],
      training: t('partner.goldTraining'),
      featured: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="pt-28 pb-16 md:pt-36 md:pb-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div {...fadeIn} className="text-center max-w-4xl mx-auto">
              <Badge variant="outline" className="mb-5 px-4 py-1.5 text-sm font-medium border-primary/30 text-primary">
                <Handshake className="w-4 h-4 mr-2" />
                {t('partner.badge')}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                {t('partner.heroTitle1')} <span className="text-primary">{t('partner.heroTitle2')}</span> {t('partner.heroTitle3')}
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-8 max-w-3xl mx-auto">
                {t('partner.heroSubtitle')}
              </p>
              <Button variant="hero" size="xl" onClick={scrollToForm}>
                <Handshake className="w-5 h-5 mr-2" />
                {t('partner.applyNow')}
                <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* 1. Objetivo */}
        <section className="py-16 bg-card/50">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div {...fadeIn}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">{t('partner.objectiveTitle')}</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>{t('partner.objectiveP1')}</p>
                <p>{t('partner.objectiveP2')}</p>
                <p>{t('partner.objectiveP3')}</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 2. Enfoque */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div {...fadeIn}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">{t('partner.approachTitle')}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">{t('partner.approachSubtitle')}</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[1,2,3,4,5,6,7].map(i => (
                  <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg bg-card border border-border/50">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm text-foreground">{t(`partner.approach${i}`)}</span>
                  </div>
                ))}
              </div>
              <p className="text-muted-foreground text-sm mt-4 italic">{t('partner.approachNote')}</p>
            </motion.div>
          </div>
        </section>

        {/* 3. Quién puede ser partner */}
        <section className="py-16 bg-card/50">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div {...fadeIn}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">{t('partner.whoTitle')}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">{t('partner.whoSubtitle')}</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg bg-background border border-border/50">
                    <ArrowRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm text-foreground">{t(`partner.who${i}`)}</span>
                  </div>
                ))}
              </div>
              <p className="text-muted-foreground text-sm mt-4">{t('partner.whoNote')}</p>
            </motion.div>
          </div>
        </section>

        {/* 4. Requisitos de ingreso */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div {...fadeIn}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">{t('partner.reqTitle')}</h2>
              </div>
              <Card className="border border-primary/20">
                <CardContent className="p-6 space-y-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0 mt-0.5">{i}</span>
                      <span className="text-foreground">{t(`partner.req${i}`)}{i === 4 ? showUSD(5000000) : ''}</span>
                    </div>
                  ))}
                  <p className="text-muted-foreground text-sm pt-2 border-t border-border/50">{t('partner.reqNote')}</p>
                </CardContent>
              </Card>

              {/* Investment Breakdown */}
              <Card className="mt-6 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-1">{t('partner.investTitle')}</h3>
                  <p className="text-3xl font-extrabold text-primary mb-1">
                    {formatCOP(5000000)} <span className="text-base font-medium text-muted-foreground">COP</span>
                  </p>
                  {currency === 'USD' && (
                    <p className="text-sm text-muted-foreground mb-5">{t('partner.usdEquivalent')} {formatPrice(5000000)}</p>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-5 rounded-xl bg-background border border-border/50">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 rounded-lg bg-emerald-500/10">
                          <Rocket className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-foreground">{formatCOP(3000000)}</p>
                          <p className="text-xs text-muted-foreground">COP{currency === 'USD' ? ` (${t('partner.usdEquivalent')} ${formatPrice(3000000)})` : ''}</p>
                        </div>
                      </div>
                      <h4 className="font-semibold text-foreground mb-2">{t('partner.investLicenses')}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{t('partner.investLicensesDesc')}</p>
                    </div>

                    <div className="p-5 rounded-xl bg-background border border-border/50">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 rounded-lg bg-amber-500/10">
                          <GraduationCap className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-foreground">{formatCOP(2000000)}</p>
                          <p className="text-xs text-muted-foreground">COP{currency === 'USD' ? ` (${t('partner.usdEquivalent')} ${formatPrice(2000000)})` : ''}</p>
                        </div>
                      </div>
                      <h4 className="font-semibold text-foreground mb-2">{t('partner.investActivation')}</h4>
                      <ul className="space-y-1.5">
                        {[1,2,3].map(i => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                            {t(`partner.investAct${i}`)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-5 p-4 rounded-lg bg-amber-500/5 border border-amber-500/20 flex items-start gap-3">
                    <RefreshCw className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">{t('partner.investRefund')}</strong> {t('partner.investRefundDesc')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* 5-6. Niveles del programa */}
        <section className="py-16 bg-card/50">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div {...fadeIn} className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{t('partner.levelsTitle')}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">{t('partner.levelsSubtitle')}</p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {levels.map((level, index) => {
                const Icon = level.icon;
                return (
                  <motion.div
                    key={level.name}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                  >
                    <Card className={`relative h-full border-2 ${level.borderColor} bg-gradient-to-br ${level.bgGradient} hover:shadow-xl transition-all duration-300 ${level.featured ? 'md:-translate-y-3 shadow-lg' : ''}`}>
                      {level.featured && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Badge className="bg-primary text-primary-foreground shadow-md px-3">
                            <Star className="w-3 h-3 mr-1" /> {t('partner.maxLevel')}
                          </Badge>
                        </div>
                      )}
                      <CardContent className="p-7 flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`p-2.5 rounded-xl bg-background/80 ${level.iconColor}`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-foreground">{level.name}</h3>
                            <p className="text-xs text-muted-foreground">{level.description}</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <span className="text-4xl font-extrabold text-foreground">{level.margin}</span>
                          <span className="text-muted-foreground ml-1.5 text-sm">{t('partner.commercialMargin')}</span>
                        </div>

                        <Badge variant="outline" className={`mb-4 text-xs py-1.5 w-fit ${level.badgeClass}`}>
                          {level.requirement}
                        </Badge>

                        <div className="mb-4">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t('partner.conditions')}</p>
                          {level.conditions.map((c, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground mb-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                              {c}
                            </div>
                          ))}
                        </div>

                        <div className="mb-4">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t('partner.benefits')}</p>
                          <ul className="space-y-1.5">
                            {level.benefits.map((b, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <ArrowRight className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                                {b}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-auto pt-3 border-t border-border/50">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">{t('partner.training')}</p>
                          <p className="text-sm text-foreground flex items-start gap-2">
                            <GraduationCap className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                            {level.training}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 7. Regla de asignación */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div {...fadeIn}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">{t('partner.assignTitle')}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">{t('partner.assignSubtitle')}</p>
              <Card className="border border-border">
                <CardContent className="p-0">
                  <div className="grid grid-cols-3 gap-0 text-center border-b border-border bg-muted/50">
                    <div className="p-4 font-semibold text-foreground text-sm">{t('partner.tableLevel')}</div>
                    <div className="p-4 font-semibold text-foreground text-sm border-x border-border">{t('partner.tableBilling')}</div>
                    <div className="p-4 font-semibold text-foreground text-sm">{t('partner.tableMargin')}</div>
                  </div>
                  {[
                    { level: "Ready", billing: t('partner.tableFromEntry'), margin: "15%" },
                    { level: "Silver", billing: `> $15M COP/mes${showUSD(15000000)}`, margin: "20%" },
                    { level: "Gold", billing: `> $50M COP/mes${showUSD(50000000)}`, margin: "25%" },
                  ].map((row, i) => (
                    <div key={i} className={`grid grid-cols-3 gap-0 text-center ${i < 2 ? 'border-b border-border' : ''}`}>
                      <div className="p-4 text-sm font-medium text-foreground">{row.level}</div>
                      <div className="p-4 text-sm text-muted-foreground border-x border-border">{row.billing}</div>
                      <div className="p-4 text-sm font-bold text-primary">{row.margin}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <div className="mt-6 space-y-2">
                <p className="text-sm font-semibold text-foreground">{t('partner.keyRules')}</p>
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                    {t(`partner.rule${i}`)}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* 8. Bono de activación */}
        <section className="py-16 bg-card/50">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div {...fadeIn}>
              <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 via-background to-accent/5">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-2xl bg-primary/10">
                      <Zap className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">{t('partner.bonusTitle')}</h2>
                      <p className="text-primary font-semibold">{t('partner.bonusSubtitle')}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: t('partner.bonusDesc') }} />

                  <div className="grid sm:grid-cols-2 gap-6 mb-6">
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" /> {t('partner.bonusApplies')}
                      </p>
                      {[1,2,3,4].map(i => (
                        <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground mb-1.5">
                          <ArrowRight className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                          {t(`partner.bonusApply${i}`)}
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-destructive" /> {t('partner.bonusNotApplies')}
                      </p>
                      {[1,2,3,4].map(i => (
                        <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground mb-1.5">
                          <XCircle className="w-3.5 h-3.5 text-muted-foreground/50 mt-0.5 shrink-0" />
                          {t(`partner.bonusNotApply${i}`)}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Card className="bg-muted/50 border-border/50">
                    <CardContent className="p-4">
                      <p className="text-sm font-semibold text-foreground mb-1">{t('partner.bonusExample')}</p>
                      <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: t('partner.bonusExampleDesc') }} />
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* 9-20: Accordion sections */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div {...fadeIn}>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
                {t('partner.detailsTitle')}
              </h2>
              <Accordion type="multiple" className="space-y-3">
                <AccordionItem value="facturacion" className="border rounded-xl px-4 bg-card">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="flex items-center gap-2 text-left font-semibold">
                      <Scale className="w-5 h-5 text-primary shrink-0" />
                      {t('partner.accBillingTitle')}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-4 pb-5">
                    <p>Se entenderá como facturación válida aquella que cumpla simultáneamente con:</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary" /> Sí es válida:
                        </p>
                        {["Cliente registrado o atribuido al partner","Oportunidad reconocida por la empresa","Licencia o suscripción activada","Factura emitida o cobro registrado","Pago efectivamente recibido","Sin devoluciones, anulaciones o fraude","Sin conflicto de atribución"].map((item, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm mb-1">
                            <CheckCircle2 className="w-3 h-3 text-primary mt-1 shrink-0" />{item}
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-destructive" /> No es válida:
                        </p>
                        {["Ventas no cobradas","Pruebas gratuitas","Licencias bonificadas","Operaciones simuladas","Cuentas internas","Descuentos no autorizados","Cuentas en mora grave","Reclamación comercial no resuelta","Clientes no trazables al partner"].map((item, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm mb-1">
                            <XCircle className="w-3 h-3 text-muted-foreground/50 mt-1 shrink-0" />{item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="rol" className="border rounded-xl px-4 bg-card">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="flex items-center gap-2 text-left font-semibold">
                      <Briefcase className="w-5 h-5 text-primary shrink-0" />
                      {t('partner.accRoleTitle')}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-4 pb-5">
                    <p>El partner no solo actúa como canal comercial. También es un aliado de acompañamiento inicial para el cliente. Se espera que el partner:</p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {["Genere prospectos y oportunidades reales","Haga seguimiento comercial a sus leads","Presente adecuadamente la propuesta de valor","Cierre oportunidades dentro de condiciones autorizadas","Acompañe la activación del cliente","Apoye la implementación inicial","Asesore al cliente en aspectos básicos","Mantenga una relación activa con sus cuentas"].map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <ArrowRight className="w-3 h-3 text-primary mt-1 shrink-0" />{item}
                        </div>
                      ))}
                    </div>
                    <p className="text-sm">El partner aporta valor en cuatro frentes: <strong className="text-foreground">venta, seguimiento, implementación inicial y asesoría básica</strong>.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="alcance" className="border rounded-xl px-4 bg-card">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="flex items-center gap-2 text-left font-semibold">
                      <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                      {t('partner.accScopeTitle')}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-4 pb-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-2">El partner deberá brindar como mínimo:</p>
                        {["Acompañamiento comercial inicial","Levantamiento básico de necesidad","Apoyo en activación o puesta en marcha","Orientación básica de uso","Seguimiento temprano de adopción","Canalización de requerimientos a la empresa"].map((item, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm mb-1">
                            <CheckCircle2 className="w-3 h-3 text-primary mt-1 shrink-0" />{item}
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-2">No podrá asumir sin autorización:</p>
                        {["Desarrollos técnicos avanzados no aprobados","Promesas funcionales no existentes","Compromisos contractuales en nombre de la empresa","Soporte especializado de 2° o 3° nivel"].map((item, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm mb-1">
                            <Ban className="w-3 h-3 text-destructive mt-1 shrink-0" />{item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="permanencia" className="border rounded-xl px-4 bg-card">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="flex items-center gap-2 text-left font-semibold">
                      <RefreshCw className="w-5 h-5 text-primary shrink-0" />
                      {t('partner.accRetentionTitle')}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-4 pb-5">
                    <p>La permanencia en el programa dependerá del volumen vendido y la calidad del desempeño.</p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {["Facturación efectiva","Clientes activos","Comportamiento de pago","Seguimiento comercial","Calidad del acompañamiento","Retención de cuentas","Uso adecuado de la marca","Cumplimiento de lineamientos"].map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <ArrowRight className="w-3 h-3 text-primary mt-1 shrink-0" />{item}
                        </div>
                      ))}
                    </div>
                    <Card className="bg-muted/50 border-border/50">
                      <CardContent className="p-4">
                        <p className="text-sm font-semibold text-foreground mb-1">Regla de retención:</p>
                        <p className="text-sm">Para mantener Silver o Gold, retención mínima del <strong className="text-primary">70%</strong> de clientes activos.</p>
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="revision" className="border rounded-xl px-4 bg-card">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="flex items-center gap-2 text-left font-semibold">
                      <Eye className="w-5 h-5 text-primary shrink-0" />
                      {t('partner.accReviewTitle')}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-3 pb-5">
                    <p>El nivel será revisado de manera <strong className="text-foreground">trimestral</strong>. En cada revisión la empresa podrá:</p>
                    {["Mantener el nivel vigente","Subir el nivel","Bajar el nivel","Suspender beneficios","Requerir plan de mejora"].map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <ArrowRight className="w-3 h-3 text-primary mt-1 shrink-0" />{item}
                      </div>
                    ))}
                    <p className="text-sm">La decisión se tomará con base en desempeño real y cumplimiento integral del programa.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="marca" className="border rounded-xl px-4 bg-card">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="flex items-center gap-2 text-left font-semibold">
                      <AlertTriangle className="w-5 h-5 text-primary shrink-0" />
                      {t('partner.accBrandTitle')}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-3 pb-5">
                    <p>El partner se compromete a:</p>
                    {["No alterar precios sin autorización","No ofrecer condiciones no aprobadas","No prometer funcionalidades inexistentes","No usar piezas desactualizadas o no autorizadas","No comunicar mensajes engañosos al mercado","No comprometer a la empresa jurídica o técnicamente sin autorización"].map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <Ban className="w-3 h-3 text-destructive mt-1 shrink-0" />{item}
                      </div>
                    ))}
                    <p className="text-sm italic">El incumplimiento podrá dar lugar a suspensión o retiro del programa.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="atribucion" className="border rounded-xl px-4 bg-card">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="flex items-center gap-2 text-left font-semibold">
                      <MessageSquare className="w-5 h-5 text-primary shrink-0" />
                      {t('partner.accAttributionTitle')}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-3 pb-5">
                    <p>Un cliente será reconocido como gestionado por el partner cuando:</p>
                    {["Haya sido registrado en el canal definido","No exista conflicto previo de titularidad","Exista trazabilidad razonable de la gestión","La empresa valide la atribución","La cuenta haya sido cerrada y pagada"].map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-3 h-3 text-primary mt-1 shrink-0" />{item}
                      </div>
                    ))}
                    <p className="text-sm">La decisión final en caso de conflicto de atribución corresponderá a la empresa.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="pagos" className="border rounded-xl px-4 bg-card">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="flex items-center gap-2 text-left font-semibold">
                      <TrendingUp className="w-5 h-5 text-primary shrink-0" />
                      {t('partner.accPaymentsTitle')}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-3 pb-5">
                    <p>Los beneficios podrán reconocerse mediante:</p>
                    {["Margen de reventa","Descuento aplicado al proceso comercial","Liquidación comercial posterior"].map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <ArrowRight className="w-3 h-3 text-primary mt-1 shrink-0" />{item}
                      </div>
                    ))}
                    <p className="text-sm font-semibold text-foreground">Solo se reconocerán beneficios sobre ventas válidas, activas, trazables y efectivamente pagadas.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="suspension" className="border rounded-xl px-4 bg-card">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="flex items-center gap-2 text-left font-semibold">
                      <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
                      {t('partner.accSuspensionTitle')}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-3 pb-5">
                    <p>La empresa podrá suspender o retirar a un partner en casos como:</p>
                    {["Información falsa o incompleta","Incumplimiento reiterado de lineamientos","Uso indebido de la marca","Promesas no autorizadas al cliente","Operaciones fraudulentas o simuladas","Mora grave","Afectación reputacional a la empresa","Inactividad prolongada","Malas prácticas comerciales o de implementación"].map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <XCircle className="w-3 h-3 text-destructive mt-1 shrink-0" />{item}
                      </div>
                    ))}
                    <p className="text-sm italic">La suspensión implica la pérdida de beneficios futuros, sin perjuicio de las obligaciones ya causadas y reconocidas.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="modificacion" className="border rounded-xl px-4 bg-card">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="flex items-center gap-2 text-left font-semibold">
                      <FileText className="w-5 h-5 text-primary shrink-0" />
                      {t('partner.accModificationTitle')}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">
                    <p>
                      La empresa podrá actualizar, ajustar o modificar las condiciones del Programa de Partners cuando lo considere
                      necesario por razones estratégicas, comerciales, operativas o financieras. Cualquier cambio relevante será
                      comunicado por los canales oficiales definidos por la empresa.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>
          </div>
        </section>

        {/* Registration Form */}
        <section ref={formRef} id="partner-form" className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container mx-auto px-4 max-w-4xl">
            <PartnerRegistrationForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Partners;
