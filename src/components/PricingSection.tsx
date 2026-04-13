import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Zap, Star, Crown, Rocket, Loader2, Settings2, ShieldCheck, MessageCircle, Gift } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { api, isAuthenticated, getUser } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import PaymentMethodSelector from "@/components/PaymentMethodSelector";

const AppLogosRow = () => (
  <div className="flex flex-col gap-1.5">
    <span className="text-xs font-medium text-muted-foreground">También disponible en:</span>
    <div className="flex items-center gap-2">
      {/* Messenger - proximamente */}
      {/* <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0078FF] to-[#00C6FF] flex items-center justify-center" title="Messenger">
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-current"><path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.15.26.36.27.58l.05 1.82c.02.56.59.92 1.1.69l2.03-.89c.17-.08.36-.1.55-.06.88.24 1.82.37 2.86.37 5.64 0 10-4.13 10-9.7C22 6.13 17.64 2 12 2zm5.89 7.47-2.89 4.58c-.46.73-1.44.91-2.12.39l-2.3-1.72a.6.6 0 0 0-.72 0l-3.1 2.35c-.41.31-.95-.17-.68-.61l2.89-4.58c.46-.73 1.44-.91 2.12-.39l2.3 1.72a.6.6 0 0 0 .72 0l3.1-2.35c.41-.31.95.17.68.61z"/></svg>
      </div> */}
      {/* Instagram - proximamente */}
      {/* <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] flex items-center justify-center" title="Instagram">
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
      </div> */}
      {/* TikTok - proximamente */}
      {/* <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center" title="TikTok">
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-current"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78c.27 0 .54.04.8.1v-3.5a6.37 6.37 0 0 0-.8-.05A6.34 6.34 0 0 0 3.15 15.3a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.05a8.27 8.27 0 0 0 4.84 1.56V7.16a4.83 4.83 0 0 1-1.08-.47z"/></svg>
      </div> */}
      {/* WordPress */}
      <div className="w-7 h-7 rounded-lg bg-[#21759B] flex items-center justify-center" title="WordPress">
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-current"><path d="M12.158 12.786l-2.698 7.84c.806.236 1.657.365 2.54.365 1.047 0 2.051-.18 2.986-.51a.473.473 0 0 1-.04-.076l-2.788-7.62zM3.009 12c0 3.56 2.07 6.634 5.068 8.093L3.788 8.341A8.975 8.975 0 0 0 3.009 12zm17.159-1.06c0-1.112-.399-1.881-.741-2.48-.456-.741-.883-1.368-.883-2.109 0-.826.627-1.596 1.51-1.596.04 0 .078.005.116.007A8.963 8.963 0 0 0 12 3.009c-3.36 0-6.317 1.725-8.037 4.338.226.007.44.011.62.011 1.006 0 2.565-.122 2.565-.122.519-.03.58.731.061.792 0 0-.521.061-1.101.091l3.502 10.42 2.105-6.312-1.497-4.108c-.519-.03-1.01-.091-1.01-.091-.518-.03-.457-.822.062-.792 0 0 1.59.122 2.534.122 1.007 0 2.566-.122 2.566-.122.519-.03.579.731.061.792 0 0-.522.061-1.101.091l3.474 10.337 .96-3.2c.414-1.327.731-2.28.731-3.1zM20.991 12c0 3.083-1.607 5.79-4.03 7.335l2.474-7.152c.462-1.155.616-2.08.616-2.903 0-.298-.02-.575-.055-.834.64 1.114 1.003 2.394 1.003 3.756L20.991 12zM12 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>
      </div>
    </div>
    <span className="text-[10px] text-muted-foreground/70">Sin costo adicional</span>
  </div>
);

// Prices are defined in USD. Plan Test is a special fixed-COP plan (Wompi minimum).
const plans = [
  {
    name: "Plan Test",
    icon: Zap,
    conversations: "250",
    users: 1,
    priceUSD: null as number | null,
    fixedPriceCOP: 1500,
    features: [
      "250 respuestas de IA",
      "1 usuario incluido",
      "7 días de prueba",
      "Mensajes masivos vía Meta API oficial*",
      "Cobro de verificación: $0.39 USD",
      "Cobro automático al finalizar",
    ],
    popular: false,
    isTrial: true,
    trialDays: 7,
  },
  {
    name: "Starter",
    icon: Zap,
    conversations: "250",
    users: 1,
    priceUSD: 15,
    fixedPriceCOP: null as number | null,
    features: [
      "250 respuestas de IA/mes",
      "1 usuario incluido",
      "Respuestas automáticas 24/7",
      "Integración WhatsApp",
      "Mensajes masivos vía Meta API oficial*",
      "Cobro recurrente mensual",
    ],
    popular: false,
  },
  {
    name: "Mini",
    icon: Zap,
    conversations: "500",
    users: 1,
    priceUSD: 29,
    fixedPriceCOP: null as number | null,
    features: [
      "500 respuestas de IA/mes",
      "1 usuario incluido",
      "Respuestas automáticas 24/7",
      "Integración WhatsApp",
      "Mensajes masivos vía Meta API oficial*",
      "Panel de control básico",
    ],
    popular: false,
  },
  {
    nameKey: "plan.basic",
    name: "Basic",
    icon: Star,
    conversations: "1.200",
    users: 1,
    priceUSD: 59,
    fixedPriceCOP: null as number | null,
    features: [
      "1.200 respuestas de IA/mes",
      "1 usuario incluido",
      "Respuestas automáticas 24/7",
      "Integración WhatsApp",
      "Mensajes masivos vía Meta API oficial*",
      "Panel de control completo",
      "Reportes mensuales",
    ],
    popular: false,
  },
  {
    name: "Plus",
    icon: Crown,
    conversations: "3.500",
    users: 2,
    priceUSD: 99,
    fixedPriceCOP: null as number | null,
    features: [
      "3.500 respuestas de IA/mes",
      "2 usuarios incluidos",
      "Respuestas automáticas 24/7",
      "Integración WhatsApp",
      "Mensajes masivos vía Meta API oficial*",
      "Panel de control avanzado",
      "Reportes semanales",
      "Soporte prioritario",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    icon: Rocket,
    conversations: "7.500",
    users: 5,
    priceUSD: 199,
    fixedPriceCOP: null as number | null,
    features: [
      "7.500 respuestas de IA/mes",
      "5 usuarios incluidos",
      "Respuestas automáticas 24/7",
      "Integración WhatsApp",
      "Mensajes masivos vía Meta API oficial*",
      "Panel de control avanzado",
      "Reportes en tiempo real",
      "Soporte dedicado 24/7",
      "Personalización avanzada",
    ],
    popular: false,
  },
];

const SEMIANNUAL_DISCOUNT = 0.10; // 10% discount for 6-month plans
const ANNUAL_DISCOUNT = 0.15; // 15% discount for annual plans

// Custom plan pricing in USD (tiered)
const ENTERPRISE_PRICE_USD = 199;
const ENTERPRISE_MESSAGES = 7500;

const getCustomPlanPriceUSD = (messages: number): number => {
  if (messages <= ENTERPRISE_MESSAGES) return ENTERPRISE_PRICE_USD;

  let totalPrice = ENTERPRISE_PRICE_USD;
  let remaining = messages - ENTERPRISE_MESSAGES;

  // 7,501 - 10,000: $0.028/msg
  const tier1 = Math.min(remaining, 2500);
  totalPrice += tier1 * 0.028;
  remaining -= tier1;

  if (remaining > 0) {
    // 10,001 - 15,000: $0.027/msg
    const tier2 = Math.min(remaining, 5000);
    totalPrice += tier2 * 0.027;
    remaining -= tier2;
  }
  if (remaining > 0) {
    // 15,001 - 30,000: $0.025/msg
    const tier3 = Math.min(remaining, 15000);
    totalPrice += tier3 * 0.025;
    remaining -= tier3;
  }
  if (remaining > 0) {
    // 30,001 - 40,000: $0.024/msg
    const tier4 = Math.min(remaining, 10000);
    totalPrice += tier4 * 0.024;
    remaining -= tier4;
  }
  if (remaining > 0) {
    // 40,000+: $0.023/msg
    totalPrice += remaining * 0.023;
  }

  return Math.round(totalPrice * 100) / 100;
};

const PricingSection = () => {
  const { t } = useLanguage();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [billingPeriod, setBillingPeriod] = useState<"mensual" | "semestral" | "anual">("mensual");
  const [customMessages, setCustomMessages] = useState<number>(10000);
  const [customMessagesInput, setCustomMessagesInput] = useState<string>("10000");
  const [additionalUsers, setAdditionalUsers] = useState<number>(0);
  const [paymentMethodModal, setPaymentMethodModal] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<typeof plans[0] | null>(null);
  const [userTransactions, setUserTransactions] = useState<any[]>([]);

  // Check if user already purchased Plan Test
  // All logged transactions are implicitly approved (no status field in MySQL)
  const hasPurchasedPlanTest = useMemo(() => {
    return userTransactions.some(
      (tx) => tx.plan_name?.toLowerCase().includes('plan test')
    );
  }, [userTransactions]);

  // Calculate included users based on rule of 3 (Enterprise: 7,500 messages = 5 users)
  const getIncludedUsers = (messages: number): number => {
    const baseUsers = Math.floor((messages / 7500) * 5);
    return Math.max(5, baseUsers); // Minimum 5 users
  };

  // Additional users cost $15 USD each
  const ADDITIONAL_USER_COST_USD = 15;
  const { toast } = useToast();
  const navigate = useNavigate();
  const { exchangeRate } = useCurrency();

  // Raw TRM for USD → COP conversion (no commission)
  const trm = exchangeRate?.rate ?? 4200;

  // Convert USD to COP
  const usdToCop = (usd: number): number => Math.round(usd * trm);

  // Get plan monthly price in COP (for Wompi)
  const getPlanMonthlyCOP = (plan: typeof plans[0]): number => {
    if (plan.fixedPriceCOP) return plan.fixedPriceCOP;
    return usdToCop(plan.priceUSD!);
  };

  // Additional users cost in COP
  const getAdditionalUsersCostCOP = (users: number): number => {
    return usdToCop(users * ADDITIONAL_USER_COST_USD);
  };

  // Always show USD amounts in pricing UI
  const formatFromUSD = (usd: number): string => {
    return `${Math.round(usd).toLocaleString('en-US')} USD`;
  };

  // Format a plan's monthly price for display (USD-only UI)
  const formatPlanMonthly = (plan: typeof plans[0]): string => {
    if ((plan as any).isTrial) {
      return `0 USD`;
    }
    if (plan.priceUSD !== null) {
      return formatFromUSD(plan.priceUSD);
    }
    const usd = Math.round(plan.fixedPriceCOP! / trm);
    return `${usd.toLocaleString('en-US')} USD`;
  };

  const getActiveDiscount = (): number => {
    if (billingPeriod === "semestral") return SEMIANNUAL_DISCOUNT;
    if (billingPeriod === "anual") return ANNUAL_DISCOUNT;
    return 0;
  };

  const getBillingMonths = (): number => {
    if (billingPeriod === "semestral") return 6;
    if (billingPeriod === "anual") return 12;
    return 1;
  };

  // Monthly display price in USD (with discount if applicable)
  const getMonthlyDisplayUSD = (plan: typeof plans[0]): number | null => {
    if (!plan.priceUSD) return null;
    const discount = getActiveDiscount();
    if (discount > 0) {
      return Math.round(plan.priceUSD * (1 - discount) * 100) / 100;
    }
    return plan.priceUSD;
  };

  // Get total price in COP to charge via Wompi
  const getTotalPriceCOP = (plan: typeof plans[0]): number => {
    const monthlyCOP = getPlanMonthlyCOP(plan);
    const discount = getActiveDiscount();
    const months = getBillingMonths();
    if (discount > 0) {
      const discountedMonthlyCOP = Math.round(monthlyCOP * (1 - discount));
      return discountedMonthlyCOP * months;
    }
    return monthlyCOP;
  };

  // Period total in USD for display
  const getPeriodTotalUSD = (plan: typeof plans[0]): number | null => {
    if (!plan.priceUSD) return null;
    const discount = getActiveDiscount();
    const months = getBillingMonths();
    const discounted = Math.round(plan.priceUSD * (1 - discount) * 100) / 100;
    return Math.round(discounted * months * 100) / 100;
  };

  const getOriginalPeriodUSD = (plan: typeof plans[0]): number | null => {
    if (!plan.priceUSD) return null;
    const months = getBillingMonths();
    return Math.round(plan.priceUSD * months * 100) / 100;
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.wompi.co/widget.js';
    script.async = true;
    document.body.appendChild(script);

    const loadUserData = async () => {
      try {
        const [profileRes, transactions] = await Promise.all([
          api.profile.get(),
          api.transactions.list(),
        ]);
        // Backend returns { user, company, roleConversia }
        if (profileRes) {
          const merged = {
            ...profileRes.user,
            company_name: profileRes.company?.name || null,
            nit: profileRes.company?.nit || null,
          };
          setUserProfile(merged);
        }
        if (transactions) setUserTransactions(transactions);
      } catch (err) {
        console.error('Error loading user data:', err);
      }
    };

    if (isAuthenticated()) {
      const user = getUser();
      setUserId(user?.id || user?.idUser || null);
      loadUserData();
    } else {
      setUserId(null);
      setUserProfile(null);
      setUserTransactions([]);
    }

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSelectPlan = async (plan: typeof plans[0]) => {
    if (!userId) {
      toast({
        title: t("pricing.loginFirst"),
        description: t("pricing.loginFirstDesc"),
      });
      navigate(`/auth?mode=register&plan=${plan.name.toLowerCase()}`);
      return;
    }

    // Block re-purchase of Plan Test
    if ((plan as any).isTrial && hasPurchasedPlanTest) {
      toast({
        title: "Plan Test ya adquirido",
        description: "El Plan Test solo se puede comprar una vez. Elige otro plan para continuar.",
        variant: "destructive",
      });
      return;
    }

    // Go directly to Wompi payment
    handleWompiPayment(plan);
  };

  const handleWompiPayment = async (plan: typeof plans[0]) => {
    setPaymentMethodModal(false);
    setLoadingPlan(plan.name);

    try {
      const totalPriceCOP = getTotalPriceCOP(plan);
      const priceInCents = totalPriceCOP * 100;
      const planSuffix = billingPeriod === "anual" ? " - Anual" : billingPeriod === "semestral" ? " - Semestral" : " - Mensual";
      const reference = `plan-${plan.name.toLowerCase()}-${billingPeriod}-${Date.now()}`;
      const currencyCode = 'COP';

      const data = await api.payments.wompiSignature({ reference, amountInCents: priceInCents, currency: currencyCode });

      await api.transactions.success({
        email: userProfile?.email || "",
        reference,
        plan_name: plan.name + planSuffix,
        amount: totalPriceCOP,
        currency: currencyCode,
        status: "PENDING",
        payment_gateway: "wompi",
      });

      const customerData: Record<string, string> = {};
      if (userProfile) {
        customerData.email = userProfile.email;
        customerData.fullName = userProfile.name || '';
        if (userProfile.phone) {
          let cleanPhone = String(userProfile.phone).replace(/\D/g, '');
          if (cleanPhone.startsWith('57') && cleanPhone.length > 10) {
            cleanPhone = cleanPhone.substring(2);
          }
          customerData.phoneNumber = cleanPhone;
          customerData.phoneNumberPrefix = '57';
        }
      }

      const checkout = new (window as any).WidgetCheckout({
        currency: currencyCode,
        amountInCents: priceInCents,
        reference,
        publicKey: data.publicKey,
        signature: { integrity: data.signature },
        redirectUrl: `${window.location.origin}/dashboard`,
        ...(Object.keys(customerData).length > 0 ? { customerData } : {}),
      });

      checkout.open(async (result: any) => {
        const transaction = result.transaction;
        await api.transactions.success({
          reference,
          status: transaction.status,
          wompi_transaction_id: transaction.id,
          payment_method: transaction.paymentMethod?.type,
        });

        if (transaction.status === 'APPROVED') {
          toast({ title: "¡Pago exitoso!", description: `Tu plan ${plan.name} ha sido activado.` });

          try {
            const sigData = await api.payments.wompiSignature({ reference: 'temp', amountInCents: 100, currency: 'COP' });
            const tokenCheckout = new (window as any).WidgetCheckout({
              publicKey: sigData.publicKey,
              widgetOperation: 'tokenize',
            });
            tokenCheckout.open(async (tokenResult: any) => {
              if (tokenResult.token && tokenResult.token.id) {
                await api.payments.tokenizeCard({
                  card_token: tokenResult.token.id,
                  plan_name: plan.name + planSuffix,
                  amount: totalPriceCOP,
                  currency: 'COP',
                  billing_period: billingPeriod,
                });
                toast({ title: "Cobro automático activado", description: "Tu tarjeta fue guardada para renovación automática." });
              }
              navigate("/dashboard");
            });
          } catch (tokenErr) {
            console.error('Tokenization error:', tokenErr);
            navigate("/dashboard");
          }
        } else if (transaction.status === 'DECLINED') {
          toast({ title: "Pago rechazado", description: "Por favor intenta con otro método de pago.", variant: "destructive" });
        } else if (transaction.status === 'PENDING') {
          toast({ title: "Pago pendiente", description: "Tu pago está siendo procesado." });
        }
      });

    } catch (error) {
      console.error('Error processing payment:', error);
      toast({ title: "Error", description: "No se pudo procesar el pago. Intenta de nuevo.", variant: "destructive" });
    } finally {
      setLoadingPlan(null);
    }
  };

  const handlePayPalPayment = async (plan: typeof plans[0]) => {
    setPaymentMethodModal(false);
    setLoadingPlan(plan.name);

    try {
      const planSuffix = billingPeriod === "anual" ? " - Anual" : billingPeriod === "semestral" ? " - Semestral" : " - Mensual";
      
      // Calculate USD amount with discount
      const discount = getActiveDiscount();
      const months = getBillingMonths();
      // If plan has a USD price use it; otherwise convert COP to USD
      const monthlyUSD = plan.priceUSD ?? (plan.fixedPriceCOP! / trm);
      const discountedMonthly = Math.round(monthlyUSD * (1 - discount) * 100) / 100;
      const totalUSD = Math.round(discountedMonthly * months * 100) / 100;

      const data = await api.payments.paypalCreateSubscription({
        plan_name: plan.name,
        billing_period: billingPeriod,
        amount_usd: discountedMonthly,
        email: userProfile?.email || "",
        return_url: `${window.location.origin}/dashboard?paypal=success`,
        cancel_url: `${window.location.origin}/dashboard?paypal=cancelled`,
      });

      if (!data?.approval_url) throw new Error('No se recibió URL de aprobación');

      // Open PayPal in a new tab (works inside iframes)
      window.open(data.approval_url, '_blank');

    } catch (error) {
      console.error('PayPal payment error:', error);
      toast({ title: "Error", description: "No se pudo procesar el pago con PayPal. Intenta de nuevo.", variant: "destructive" });
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section id="planes" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/20 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {t("pricing.title")} <span className="gradient-text">{t("pricing.titleHighlight")}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("pricing.subtitle")}
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            {t("pricing.conversationNote")}
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            {t("pricing.moreUsers")} <span className="text-primary font-medium">$15 USD/mes</span> {t("pricing.perUser")}
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
            <span className="glass-card px-4 py-2 text-primary">✓ {t("pricing.notifyPay")}</span>
            <span className="glass-card px-4 py-2 text-primary">✓ {t("pricing.freeDataAccess")}</span>
            <span className="glass-card px-4 py-2 text-primary">✓ {t("pricing.freeDataLogging")}</span>
          </div>

          {/* WhatsApp Official Partner Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex justify-center"
          >
            <div className="relative group">
              {/* Outer glow ring */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#25D366] via-[#128C7E] to-[#25D366] opacity-30 blur-lg group-hover:opacity-50 transition-opacity duration-500 animate-gradient" />
              
              <div className="relative flex flex-col sm:flex-row items-center gap-3 sm:gap-4 px-5 sm:px-8 py-4 sm:py-5 rounded-2xl border border-[#25D366]/30 bg-card/80 backdrop-blur-xl">
                {/* Shield badge icon */}
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center shadow-lg shadow-[#25D366]/30">
                    <ShieldCheck className="w-7 h-7 sm:w-9 sm:h-9 text-primary-foreground" />
                  </div>
                  {/* Small WhatsApp icon overlay */}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#25D366] border-2 border-card flex items-center justify-center">
                    <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary-foreground" />
                  </div>
                </div>

                {/* Text content */}
                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-0.5">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#25D366]">{t("hero.certified")}</span>
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground">{t("hero.officialPartner")}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{t("hero.certifiedDesc")}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Billing Toggle */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-8">
            <button
              onClick={() => setBillingPeriod("mensual")}
              className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 ${
                billingPeriod === "mensual"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("pricing.monthly")}
            </button>
            <button
              onClick={() => setBillingPeriod("semestral")}
              className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 relative ${
                billingPeriod === "semestral"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("pricing.semiannual")}
              <span className="absolute -top-2 -right-2 bg-accent text-primary-foreground text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-semibold">
                -10%
              </span>
            </button>
            <button
              onClick={() => setBillingPeriod("anual")}
              className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 relative ${
                billingPeriod === "anual"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("pricing.annual")}
              <span className="absolute -top-2 -right-2 bg-accent text-primary-foreground text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-semibold">
                -15%
              </span>
            </button>
          </div>
        </motion.div>

        {/* First row: Trial + Starter side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-6">
          {plans.slice(0, 2).map((plan, index) => {
            const isTrial = !!(plan as any).isTrial;
            const isTrialBlocked = isTrial && hasPurchasedPlanTest;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
                className="relative group"
              >
                {/* Animated glow border on hover */}
                <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-primary/0 via-accent/0 to-primary/0 group-hover:from-primary/40 group-hover:via-accent/40 group-hover:to-primary/40 transition-all duration-700 blur-sm opacity-0 group-hover:opacity-100" />
                
                <div className={`relative glass-card p-6 h-full flex flex-col transition-all duration-500 ${
                  isTrial ? "border-accent/30 group-hover:border-accent/60" : "group-hover:border-primary/40"
                } group-hover:shadow-[0_20px_60px_-15px_hsl(152_69%_41%/0.2)]`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${
                      isTrial ? "bg-gradient-to-br from-accent/80 to-accent group-hover:shadow-lg group-hover:shadow-accent/40" : "bg-secondary group-hover:bg-primary/20 group-hover:shadow-lg group-hover:shadow-primary/30"
                    }`}>
                      <plan.icon className={`w-5 h-5 transition-colors duration-300 ${isTrial ? "text-primary-foreground" : "text-primary"}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{plan.name}</h3>
                      <p className="text-muted-foreground text-xs">{plan.conversations} {t("pricing.conversations")}</p>
                    </div>
                    {isTrial ? (
                      <span className={`ml-auto text-xs font-semibold px-3 py-1 rounded-full ${isTrialBlocked ? 'bg-muted text-muted-foreground' : 'bg-accent/20 text-accent'}`}>
                        {isTrialBlocked ? '✓ Ya adquirido' : t("pricing.freeTrial")}
                      </span>
                    ) : (
                      <span className="ml-auto text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-1">
                        <Gift className="w-3 h-3" />
                        7 días gratis
                      </span>
                    )}
                  </div>

                  <div className="mb-5">
                    {(() => {
                      const isTr = !!(plan as any).isTrial;
                      const discount = getActiveDiscount();
                      const monthlyUSD = getMonthlyDisplayUSD(plan);
                      const periodTotalUSD = getPeriodTotalUSD(plan);
                      const originalPeriodUSD = getOriginalPeriodUSD(plan);
                      const discountPct = Math.round(discount * 100);
                      const periodLabel = billingPeriod === "anual" ? t("common.perYear") : billingPeriod === "semestral" ? t("common.perSemester") : t("common.perMonth");

                      if (isTr) {
                        return (
                          <div>
                            <span className="text-2xl font-bold">${formatPlanMonthly(plan)}</span>
                            <span className="text-muted-foreground text-sm"> {t("common.perMonth")}</span>
                          </div>
                        );
                      }

                      if (billingPeriod !== "mensual" && plan.priceUSD) {
                        return (
                          <>
                            <div className="mb-2">
                              <span className="text-muted-foreground text-sm line-through mr-2">
                                ${formatFromUSD(plan.priceUSD)}
                              </span>
                              <span className="text-2xl font-bold">${formatFromUSD(monthlyUSD!)}</span>
                              <span className="text-muted-foreground text-sm"> {t("common.perMonth")}</span>
                            </div>
                            <div className="bg-primary/10 border border-primary/20 rounded-lg p-2">
                              <p className="text-xs text-muted-foreground">{t("pricing.payToday")}</p>
                              <div className="flex items-baseline gap-2 flex-wrap">
                                <span className="text-muted-foreground text-sm line-through">
                                  ${formatFromUSD(originalPeriodUSD!)}
                                </span>
                                <span className="text-lg font-bold text-primary">
                                  ${formatFromUSD(periodTotalUSD!)}
                                </span>
                                <span className="text-xs text-muted-foreground">{periodLabel}</span>
                              </div>
                              <p className="text-xs text-accent mt-1">
                                {t("pricing.youSave")} ${formatFromUSD(Math.round((originalPeriodUSD! - periodTotalUSD!) * 100) / 100)} ({discountPct}%)
                              </p>
                            </div>
                          </>
                        );
                      }

                      return (
                        <div>
                          <span className="text-2xl font-bold">${formatPlanMonthly(plan)}</span>
                          <span className="text-muted-foreground text-sm"> {t("common.perMonth")}</span>
                        </div>
                      );
                    })()}
                  </div>

                  <ul className="space-y-2.5 mb-6 flex-grow">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm transition-transform duration-300 group-hover:translate-x-1" style={{ transitionDelay: `${i * 50}ms` }}>
                        <Check className="w-4 h-4 text-primary mt-0.5 shrink-0 transition-transform duration-300 group-hover:scale-110" />
                        <span className="text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">{t(feature)}</span>
                      </li>
                    ))}
                    <li className="pt-1">
                      <AppLogosRow />
                    </li>
                  </ul>

                  {isTrialBlocked && (
                    <p className="text-xs text-destructive text-center mb-2">Este plan solo se puede comprar una vez.</p>
                  )}
                  <Button
                    variant={isTrial ? "hero" : "heroOutline"}
                    className="w-full"
                    onClick={() => handleSelectPlan(plan)}
                    disabled={loadingPlan !== null || isTrialBlocked}
                  >
                    {loadingPlan === plan.name ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("pricing.processing")}
                      </>
                    ) : (
                      isTrial ? t("pricing.startFreeTrial") : t("pricing.selectPlan")
                    )}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Main plans row: Mini, Básico, Plus, Enterprise */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.slice(2).map((plan, index) => {
            const monthlyUSD = getMonthlyDisplayUSD(plan);
            const periodTotalUSD = getPeriodTotalUSD(plan);
            const originalPeriodUSD = getOriginalPeriodUSD(plan);
            const discount = getActiveDiscount();
            const discountPct = Math.round(discount * 100);
            const periodLabel = billingPeriod === "anual" ? t("common.perYear") : billingPeriod === "semestral" ? t("common.perSemester") : t("common.perMonth");

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (index + 2) * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.3, ease: "easeOut" } }}
                className={`relative group ${plan.popular ? "lg:-mt-4 lg:mb-4" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                    <motion.div 
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-semibold px-5 py-1.5 rounded-full shadow-lg shadow-primary/30 whitespace-nowrap"
                    >
                       ⭐ {t("pricing.popular")}
                    </motion.div>
                  </div>
                )}

                {/* Animated glow border on hover */}
                <div className={`absolute -inset-[1px] rounded-2xl transition-all duration-700 blur-sm ${
                  plan.popular 
                    ? "bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 group-hover:from-primary/60 group-hover:via-accent/60 group-hover:to-primary/60 opacity-100" 
                    : "bg-gradient-to-r from-primary/0 via-accent/0 to-primary/0 group-hover:from-primary/40 group-hover:via-accent/40 group-hover:to-primary/40 opacity-0 group-hover:opacity-100"
                }`} />

                <div
                  className={`relative glass-card p-6 h-full flex flex-col transition-all duration-500 ${
                    plan.popular
                      ? "border-primary/50 ring-1 ring-primary/20 group-hover:shadow-[0_25px_70px_-15px_hsl(152_69%_41%/0.25)]"
                      : "group-hover:border-primary/40 group-hover:shadow-[0_20px_60px_-15px_hsl(152_69%_41%/0.2)]"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${
                    plan.popular
                      ? "bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30 group-hover:shadow-xl group-hover:shadow-primary/50"
                      : "bg-secondary group-hover:bg-primary/20 group-hover:shadow-lg group-hover:shadow-primary/30"
                  }`}>
                    <plan.icon className={`w-6 h-6 transition-colors duration-300 ${plan.popular ? "text-primary-foreground" : "text-primary"}`} />
                  </div>

                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`text-xl font-bold ${plan.popular ? "gradient-text" : ""}`}>
                      {plan.nameKey ? t(plan.nameKey) : plan.name}
                    </h3>
                    <span className="text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Gift className="w-3 h-3" />
                      7 días gratis
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-5">
                    {plan.conversations} {t("pricing.conversations")}
                  </p>

                  <div className="mb-6 min-h-[80px]">
                    {billingPeriod !== "mensual" && plan.priceUSD ? (
                      <>
                        <div className="mb-2">
                          <span className="text-muted-foreground text-sm line-through mr-2">
                            ${formatFromUSD(plan.priceUSD)}
                          </span>
                          <span className="text-2xl font-bold">${formatFromUSD(monthlyUSD!)}</span>
                          <span className="text-muted-foreground text-sm"> {t("common.perMonth")}</span>
                        </div>
                        <div className="bg-primary/10 border border-primary/20 rounded-lg p-2.5">
                          <p className="text-xs text-muted-foreground">{t("pricing.payToday")}</p>
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-muted-foreground text-sm line-through">
                              ${formatFromUSD(originalPeriodUSD!)}
                            </span>
                            <span className="text-lg font-bold text-primary">
                              ${formatFromUSD(periodTotalUSD!)}
                            </span>
                            <span className="text-xs text-muted-foreground">{periodLabel}</span>
                          </div>
                          <p className="text-xs text-accent mt-1">
                            {t("pricing.youSave")} ${formatFromUSD(Math.round((originalPeriodUSD! - periodTotalUSD!) * 100) / 100)} ({discountPct}%)
                          </p>
                        </div>
                      </>
                    ) : (
                      <div>
                        <span className="text-3xl font-bold">${formatPlanMonthly(plan)}</span>
                        <span className="text-muted-foreground text-sm"> {t("common.perMonth")}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-border/30 pt-5 mb-6 flex-grow">
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm transition-transform duration-300 group-hover:translate-x-1" style={{ transitionDelay: `${i * 40}ms` }}>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300 group-hover:scale-110 ${
                            plan.popular ? "bg-primary/20 group-hover:bg-primary/30" : "bg-secondary group-hover:bg-primary/15"
                          }`}>
                            <Check className="w-3 h-3 text-primary" />
                          </div>
                          <span className="text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">{t(feature)}</span>
                        </li>
                      ))}
                      <li className="pt-1">
                        <AppLogosRow />
                      </li>
                    </ul>
                  </div>

                  <Button
                    variant={plan.popular ? "hero" : "heroOutline"}
                    size="lg"
                    className="w-full"
                    onClick={() => handleSelectPlan(plan)}
                    disabled={loadingPlan !== null}
                  >
                    {loadingPlan === plan.name ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("pricing.processing")}
                      </>
                    ) : (
                      t("pricing.selectPlan")
                    )}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        <p className="text-center text-xs text-muted-foreground/70 mt-4">
          *Los costos de envío de mensajes masivos son cobrados directamente por WhatsApp (Meta) según sus tarifas oficiales por conversación.
        </p>

        {/* Custom Plan Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12"
        >
          <div className="glass-card p-8 border-accent/30">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                <Settings2 className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{t("pricing.customPlan")}</h3>
                <p className="text-muted-foreground">{t("pricing.customSubtitle")} — {t("pricing.fromUSD")} $211 USD</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Slider Section */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-muted-foreground">{t("pricing.messagesPerMonth")}</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={customMessagesInput}
                        onChange={(e) => {
                          const rawValue = e.target.value.replace(/\D/g, '');
                          setCustomMessagesInput(rawValue);
                          const numValue = parseInt(rawValue) || 0;
                          if (numValue >= 7500) {
                            setCustomMessages(numValue);
                          }
                        }}
                        onBlur={() => {
                          const numValue = parseInt(customMessagesInput) || 7500;
                          const finalValue = Math.max(7500, numValue);
                          setCustomMessages(finalValue);
                          setCustomMessagesInput(finalValue.toString());
                        }}
                        className="w-32 px-3 py-1 text-lg font-bold text-primary bg-secondary border border-primary/30 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                  <Slider
                    value={[Math.min(customMessages, 100000)]}
                    onValueChange={(value) => {
                      setCustomMessages(value[0]);
                      setCustomMessagesInput(value[0].toString());
                    }}
                    min={7500}
                    max={100000}
                    step={500}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>7.500</span>
                    <span>30.000</span>
                    <span>50.000</span>
                    <span>100.000+</span>
                  </div>
                </div>

                {/* Pricing Tiers Info (USD per additional message) */}
                <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
                  <p className="text-sm font-medium text-foreground mb-3">{t("pricing.pricePerMessage")}</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 text-xs">
                    <div className={`p-2 rounded ${customMessages <= 10000 ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>
                      <p className="font-semibold">7.500 - 10.000</p>
                      <p>$0.028/msg</p>
                    </div>
                    <div className={`p-2 rounded ${customMessages > 10000 && customMessages <= 15000 ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>
                      <p className="font-semibold">10.001 - 15.000</p>
                      <p>$0.027/msg</p>
                    </div>
                    <div className={`p-2 rounded ${customMessages > 15000 && customMessages <= 30000 ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>
                      <p className="font-semibold">15.001 - 30.000</p>
                      <p>$0.025/msg</p>
                    </div>
                    <div className={`p-2 rounded ${customMessages > 30000 && customMessages <= 40000 ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>
                      <p className="font-semibold">30.001 - 40.000</p>
                      <p>$0.024/msg</p>
                    </div>
                    <div className={`p-2 rounded ${customMessages > 40000 ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>
                      <p className="font-semibold">+40.000</p>
                      <p>$0.023/msg</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Display */}
              <div className="flex flex-col justify-between">
                <div>
                  {(() => {
                    const customPriceUSD = getCustomPlanPriceUSD(customMessages);
                    const additionalUsersCostUSD = additionalUsers * ADDITIONAL_USER_COST_USD;
                    const totalMonthlyUSD = customPriceUSD + additionalUsersCostUSD;

                    return (
                      <div className="mb-4">
                        {billingPeriod !== "mensual" ? (
                          <>
                            <div className="mb-2">
                              <span className="text-muted-foreground text-sm line-through mr-2">
                                ${formatFromUSD(totalMonthlyUSD)}
                              </span>
                              <span className="text-3xl font-bold">
                                ${formatFromUSD(Math.round(totalMonthlyUSD * (1 - getActiveDiscount()) * 100) / 100)}
                              </span>
                              <span className="text-muted-foreground text-sm"> {t("common.perMonth")}</span>
                            </div>
                            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                              <p className="text-xs text-muted-foreground">{t("pricing.payToday")}</p>
                              <div className="flex items-baseline gap-2 flex-wrap">
                                <span className="text-muted-foreground text-sm line-through">
                                  ${formatFromUSD(totalMonthlyUSD * getBillingMonths())}
                                </span>
                                <span className="text-2xl font-bold text-primary">
                                  ${formatFromUSD(Math.round(totalMonthlyUSD * (1 - getActiveDiscount()) * getBillingMonths() * 100) / 100)}
                                </span>
                                <span className="text-xs text-muted-foreground">{billingPeriod === "anual" ? t("common.perYear") : t("common.perSemester")}</span>
                              </div>
                              <p className="text-xs text-accent mt-1">
                                {t("pricing.youSave")} ${formatFromUSD(Math.round(totalMonthlyUSD * getBillingMonths() * getActiveDiscount() * 100) / 100)} ({Math.round(getActiveDiscount() * 100)}%)
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <span className="text-4xl font-bold">${formatFromUSD(totalMonthlyUSD)}</span>
                            <span className="text-muted-foreground text-sm"> {t("common.perMonth")}</span>
                            {additionalUsers > 0 && (
                              <p className="text-xs text-muted-foreground mt-1">
                                (Plan: ${formatFromUSD(customPriceUSD)} + Usuarios: ${formatFromUSD(additionalUsersCostUSD)})
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })()}

                  {/* Users Section */}
                  <div className="bg-secondary/50 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{t("pricing.includedUsers")}</span>
                      <span className="text-lg font-bold text-primary">{getIncludedUsers(customMessages)}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-sm text-muted-foreground">{t("pricing.additionalUsers")}</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setAdditionalUsers(Math.max(0, additionalUsers - 1))}
                          className="w-8 h-8 rounded-lg bg-secondary border border-primary/30 text-primary font-bold hover:bg-primary/20 transition-colors"
                        >
                          -
                        </button>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={additionalUsers}
                          onChange={(e) => {
                            const value = parseInt(e.target.value.replace(/\D/g, '')) || 0;
                            setAdditionalUsers(Math.max(0, value));
                          }}
                          className="w-16 px-2 py-1 text-center font-bold bg-secondary border border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <button
                          type="button"
                          onClick={() => setAdditionalUsers(additionalUsers + 1)}
                          className="w-8 h-8 rounded-lg bg-secondary border border-primary/30 text-primary font-bold hover:bg-primary/20 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    {additionalUsers > 0 && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        +${(additionalUsers * ADDITIONAL_USER_COST_USD).toLocaleString()} USD/mes ({additionalUsers} × $15 USD)
                      </div>
                    )}
                  </div>

                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-muted-foreground">{customMessages.toLocaleString("es-CO")} {t("pricing.conversations")}</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-muted-foreground">{getIncludedUsers(customMessages) + additionalUsers} {t("pricing.totalUsers")}</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-muted-foreground">{t("pricing.allEnterprise")}</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-muted-foreground">{t("pricing.dedicatedManager")}</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-muted-foreground">{t("pricing.slaGuaranteed")}</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-muted-foreground">Mensajes masivos vía Meta API oficial*</span>
                    </li>
                  </ul>
                  <div className="mb-6">
                    <AppLogosRow />
                  </div>
                </div>

                <Button
                  variant="hero"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    const customPriceUSD = getCustomPlanPriceUSD(customMessages);
                    const additionalUsersCostUSD = additionalUsers * ADDITIONAL_USER_COST_USD;
                    const totalMonthlyUSD = customPriceUSD + additionalUsersCostUSD;
                    const totalMonthlyCOP = usdToCop(totalMonthlyUSD);

                    const customPlan = {
                      name: t("pricing.customPlan"),
                      icon: Settings2,
                      conversations: customMessages.toString(),
                      users: getIncludedUsers(customMessages) + additionalUsers,
                      priceUSD: totalMonthlyUSD,
                      fixedPriceCOP: null as number | null,
                      features: [],
                      popular: false,
                    };
                    handleSelectPlan(customPlan);
                  }}
                  disabled={loadingPlan !== null}
                >
                  {loadingPlan === t("pricing.customPlan") ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("pricing.processing")}
                    </>
                  ) : (
                    t("pricing.selectCustomPlan")
                  )}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Payment method selector removed - Wompi only */}
    </section>
  );
};

export default PricingSection;
