import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Bot, Search, CreditCard, AlertCircle, CheckCircle, ArrowLeft, Loader2, RefreshCw, Zap, Star, Crown, Rocket, Check, Info, Gift } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/contexts/CurrencyContext";

interface PlanInfo {
  planName: string;
  amount: number;
  lastPaymentDate: string;
  status: string;
  userEmail: string;
  userName: string;
}

// Prices in USD (Plan Test is fixed COP)
const plans = [
  {
    name: "Plan Test",
    icon: Zap,
    conversations: "250",
    priceUSD: null as number | null,
    fixedPriceCOP: 1500,
    isTrial: true,
  },
  {
    name: "Starter",
    icon: Zap,
    conversations: "250",
    priceUSD: 15,
    fixedPriceCOP: null as number | null,
  },
  {
    name: "Mini",
    icon: Zap,
    conversations: "500",
    priceUSD: 29,
    fixedPriceCOP: null as number | null,
  },
  {
    name: "Básico",
    nameKey: "plan.basic",
    icon: Star,
    conversations: "1.200",
    priceUSD: 59,
    fixedPriceCOP: null as number | null,
  },
  {
    name: "Plus",
    icon: Crown,
    conversations: "3.500",
    priceUSD: 99,
    fixedPriceCOP: null as number | null,
    popular: true,
  },
  {
    name: "Enterprise",
    icon: Rocket,
    conversations: "7.500",
    priceUSD: 199,
    fixedPriceCOP: null as number | null,
  },
];

const SEMIANNUAL_DISCOUNT = 0.10;
const ANNUAL_DISCOUNT = 0.15;

const Renewal = () => {
  const [document, setDocument] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [planInfo, setPlanInfo] = useState<PlanInfo | null>(null);
  const [showAllPlans, setShowAllPlans] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const [confirmPaymentModal, setConfirmPaymentModal] = useState(false);
  const [pendingPayment, setPendingPayment] = useState<{ planName: string; amount: number } | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<"mensual" | "semestral" | "anual">("mensual");
  const [hasPurchasedPlanTest, setHasPurchasedPlanTest] = useState(false);

  // Coupon state (applied in the confirm-payment modal)
  const [couponInput, setCouponInput] = useState("");
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    finalAmount: number;
    originalAmount: number;
  } | null>(null);
  const { toast } = useToast();
  const { currency, formatPrice, convertToSelectedCurrency, exchangeRate } = useCurrency();

  // Raw TRM for USD → COP conversion (no commission)
  const trm = exchangeRate?.rate ?? 4200;
  const getPlanPriceCOP = (plan: typeof plans[0]): number => {
    if (plan.fixedPriceCOP) return plan.fixedPriceCOP;
    return Math.round(plan.priceUSD! * trm);
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

  const getTotalPriceCOP = (plan: typeof plans[0]): number => {
    const monthlyCOP = getPlanPriceCOP(plan);
    const discount = getActiveDiscount();
    const months = getBillingMonths();
    if (discount > 0) {
      return Math.round(monthlyCOP * (1 - discount)) * months;
    }
    return monthlyCOP;
  };

  // Load Wompi script
  useEffect(() => {
    const script = window.document.createElement("script");
    script.src = "https://checkout.wompi.co/widget.js";
    script.async = true;
    window.document.body.appendChild(script);

    return () => {
      if (window.document.body.contains(script)) {
        window.document.body.removeChild(script);
      }
    };
  }, []);

  const handleSearch = async () => {
    if (!document.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa tu número de documento",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setSearched(false);
    setPlanInfo(null);
    setShowAllPlans(false);
    setSelectedPlan(null);

    try {
      const data = await api.payments.searchByDocument({ document: document.trim() });

      setSearched(true);

      if (data.found && data.planInfo) {
        setPlanInfo({
          planName: data.planInfo.planName,
          amount: data.planInfo.amount,
          lastPaymentDate: new Date(data.planInfo.lastPaymentDate).toLocaleDateString("es-CO"),
          status: data.planInfo.status,
          userEmail: data.planInfo.userEmail,
          userName: data.planInfo.userName,
        });
        setHasPurchasedPlanTest(!!data.hasPurchasedPlanTest);
      }
    } catch (error: any) {
      console.error("Error searching:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al buscar tu información",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const initiatePayment = (planName: string, amount: number) => {
    setPendingPayment({ planName, amount });
    setCouponInput("");
    setAppliedCoupon(null);
    setConfirmPaymentModal(true);
  };

  const handleApplyCoupon = async () => {
    if (!couponInput.trim() || !pendingPayment) return;
    setValidatingCoupon(true);
    try {
      const res: any = await api.coupons.validatePublic(
        document.trim(),
        couponInput.trim().toUpperCase(),
        pendingPayment.amount,
        "COP",
      );
      setAppliedCoupon({
        code: res.code,
        discountAmount: Number(res.discountAmount),
        finalAmount: Number(res.finalAmount),
        originalAmount: Number(res.originalAmount),
      });
      toast({
        title: "Cupón aplicado",
        description: `Descuento de $${Number(res.discountAmount).toLocaleString("es-CO")} COP`,
      });
    } catch (error: any) {
      const message = error?.message || "No se pudo aplicar el cupón";
      toast({ title: "Cupón inválido", description: message, variant: "destructive" });
      setAppliedCoupon(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
  };

  const handleConfirmPayment = async () => {
    if (!planInfo || !pendingPayment) return;

    setConfirmPaymentModal(false);
    setPaymentLoading(true);

    try {
      const { planName, amount } = pendingPayment;

      // If a coupon is applied, charge the final (discounted) amount
      const effectiveAmount = appliedCoupon ? appliedCoupon.finalAmount : amount;
      const reference = `renewal-${planName.toLowerCase()}-${Date.now()}`;
      const currencyCode = "COP";

      // 100% coupon path: skip Wompi, activate via public redeem-free endpoint
      if (appliedCoupon && effectiveAmount === 0) {
        try {
          await api.payments.redeemFreeCouponPublic({
            document: document.trim(),
            couponCode: appliedCoupon.code,
            planName,
            idPlan: null,
            aiResponsesIncluded: 0,
            type: "renewal",
            currency: currencyCode,
            planPriceAmount: amount,
            reference,
          });
          toast({
            title: "¡Plan activado!",
            description: `Tu plan ${planName} se activó gratis con el cupón ${appliedCoupon.code}.`,
          });
          setSearched(false);
          setPlanInfo(null);
          setDocument("");
          setShowAllPlans(false);
          setSelectedPlan(null);
          setPaymentLoading(false);
          setPendingPayment(null);
          return;
        } catch (err: any) {
          toast({
            title: "No se pudo activar el cupón",
            description: err?.message || "Intenta de nuevo o usa otro método.",
            variant: "destructive",
          });
          setPaymentLoading(false);
          setPendingPayment(null);
          return;
        }
      }

      const priceInCents = Math.round(effectiveAmount * 100);

      console.log("Requesting signature for renewal:", { reference, amountInCents: priceInCents, currency: currencyCode });

      const signatureData = await api.payments.wompiSignature({
        reference,
        amountInCents: priceInCents,
        currency: currencyCode,
      });

      console.log("Signature received:", signatureData);

      // Creates pending TransactionLog with coupon (if applied); the webhook
      // will later consume it once Wompi approves.
      try {
        await api.payments.renewalPayment({
          document: document.trim(),
          reference,
          planName,
          amount,
          currency: currencyCode,
          couponCode: appliedCoupon?.code,
        });
      } catch (txError: any) {
        console.error("Error creating transaction:", txError);
        // If the failure came from an invalid coupon at the last second, abort
        // the checkout rather than charging a wrong amount.
        if (appliedCoupon) {
          const msg = txError?.message || "El cupón ya no es válido. Intenta de nuevo sin cupón.";
          toast({ title: "No se pudo aplicar el cupón", description: msg, variant: "destructive" });
          setPaymentLoading(false);
          setPendingPayment(null);
          return;
        }
      }

      const checkout = new (window as any).WidgetCheckout({
        currency: currencyCode,
        amountInCents: priceInCents,
        reference: reference,
        publicKey: signatureData.publicKey,
        signature: { integrity: signatureData.signature },
        redirectUrl: `${window.location.origin}/`,
        customerData: {
          email: planInfo.userEmail,
          fullName: planInfo.userName,
        },
      });

      checkout.open(async (result: any) => {
        const transaction = result.transaction;
        console.log("Transaction result:", transaction);

        await api.payments.renewalPayment({
          document: document.trim(),
          reference: reference,
          status: transaction.status,
          wompiTransactionId: transaction.id,
          paymentMethod: transaction.paymentMethod?.type,
        });

        if (transaction.status === "APPROVED") {
          toast({
            title: "¡Pago exitoso!",
            description: `Tu plan ${planName} ha sido activado.`,
          });
          setSearched(false);
          setPlanInfo(null);
          setDocument("");
          setShowAllPlans(false);
          setSelectedPlan(null);
        } else if (transaction.status === "DECLINED") {
          toast({
            title: "Pago rechazado",
            description: "Por favor intenta con otro método de pago.",
            variant: "destructive",
          });
        } else if (transaction.status === "PENDING") {
          toast({
            title: "Pago pendiente",
            description: "Tu pago está siendo procesado.",
          });
        }
      });
    } catch (error) {
      console.error("Error processing payment:", error);
      toast({
        title: "Error",
        description: "No se pudo procesar el pago. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setPaymentLoading(false);
      setPendingPayment(null);
    }
  };

  const handleRenewal = () => {
    if (planInfo) {
      initiatePayment(planInfo.planName, planInfo.amount);
    }
  };

  const handleSelectNewPlan = (plan: typeof plans[0]) => {
    setSelectedPlan(plan);
  };

  const handlePayNewPlan = () => {
    if (selectedPlan) {
      const suffix = billingPeriod === "anual" ? " - Anual" : billingPeriod === "semestral" ? " - Semestral" : " - Mensual";
      initiatePayment(selectedPlan.name + suffix, getTotalPriceCOP(selectedPlan));
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full relative z-10 ${showAllPlans ? "max-w-4xl" : "max-w-md"}`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 group">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
              <Bot className="w-7 h-7 text-primary-foreground" />
            </div>
          </div>
          <span className="text-2xl font-bold gradient-text">Agent IA</span>
        </Link>

        <Card className="glass border-border/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {showAllPlans ? "Seleccionar Nuevo Plan" : "Renovar Mensualidad"}
            </CardTitle>
            <CardDescription>
              {showAllPlans
                ? `${planInfo?.userName} - Elige el plan que mejor se adapte a tus necesidades`
                : "Ingresa tu número de documento para consultar tu plan"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!showAllPlans ? (
              <>
                {/* Search Form */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="document">Número de Documento o NIT</Label>
                    <div className="relative">
                      <Input
                        id="document"
                        type="text"
                        placeholder="Ej: 1234567890"
                        value={document}
                        onChange={(e) => setDocument(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="pr-10"
                      />
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>

                  <Button
                    onClick={handleSearch}
                    disabled={loading}
                    className="w-full"
                    variant="hero"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Buscando...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Search className="w-4 h-4" />
                        Consultar Plan
                      </span>
                    )}
                  </Button>
                </div>

                {/* Results */}
                {searched && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-4 border-t border-border/50"
                  >
                    {planInfo ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-medium">Plan encontrado</span>
                        </div>

                        <div className="bg-primary/5 rounded-lg p-4 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Cliente:</span>
                            <span className="font-medium">{planInfo.userName}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Plan actual:</span>
                            <span className="font-medium text-primary">{planInfo.planName}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Monto:</span>
                            <span className="font-bold text-lg">
                              {formatPrice(planInfo.amount)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Último pago:</span>
                            <span>{planInfo.lastPaymentDate}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          <Button
                            onClick={handleRenewal}
                            className="w-full"
                            variant="hero"
                            disabled={paymentLoading}
                          >
                            {paymentLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Procesando...
                              </>
                            ) : (
                              <>
                                <CreditCard className="w-4 h-4 mr-2" />
                                Renovar Plan {planInfo.planName}
                              </>
                            )}
                          </Button>

                          <Button
                            onClick={() => setShowAllPlans(true)}
                            variant="outline"
                            className="w-full"
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Cambiar de Plan
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                          <AlertCircle className="w-5 h-5" />
                          <span>Sin cuentas pendientes</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          No tienes cuentas pendientes por renovar con este documento.
                        </p>
                        <Button variant="outline" asChild className="mt-4">
                          <Link to="/auth?mode=register">Crear nueva cuenta</Link>
                        </Button>
                      </div>
                    )}
                  </motion.div>
                )}
              </>
            ) : (
              <>
                {/* Billing Period Toggle */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <button
                    onClick={() => setBillingPeriod("mensual")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      billingPeriod === "mensual"
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Mensual
                  </button>
                  <button
                    onClick={() => setBillingPeriod("semestral")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${
                      billingPeriod === "semestral"
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Semestral
                    <span className="absolute -top-2 -right-2 bg-accent text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full font-semibold">-10%</span>
                  </button>
                  <button
                    onClick={() => setBillingPeriod("anual")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${
                      billingPeriod === "anual"
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Anual
                    <span className="absolute -top-2 -right-2 bg-accent text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full font-semibold">-15%</span>
                  </button>
                </div>

                {/* All Plans View */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {plans.map((plan) => {
                    const isCurrentPlan = plan.name === planInfo?.planName;
                    const isSelected = selectedPlan?.name === plan.name;
                    const PlanIcon = plan.icon;
                    const isPlanTest = !!(plan as any).isTrial;
                    const isTestBlocked = isPlanTest && hasPurchasedPlanTest;

                    return (
                      <motion.div
                        key={plan.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`relative ${isTestBlocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'} transition-all duration-300 ${
                          isSelected ? "scale-105" : "hover:scale-102"
                        }`}
                        onClick={() => !isTestBlocked && handleSelectNewPlan(plan)}
                      >
                        {plan.popular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                            <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                              Popular
                            </div>
                          </div>
                        )}

                        {isCurrentPlan && (
                          <div className="absolute -top-3 right-2 z-10">
                            <div className="bg-secondary text-foreground text-xs font-semibold px-3 py-1 rounded-full border border-border">
                              Plan Actual
                            </div>
                          </div>
                        )}

                        {isTestBlocked && (
                          <div className="absolute -top-3 right-2 z-10">
                            <div className="bg-destructive/10 text-destructive text-xs font-semibold px-3 py-1 rounded-full border border-destructive/30">
                              ✓ Ya adquirido
                            </div>
                          </div>
                        )}

                        <div
                          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            isTestBlocked
                              ? "border-muted bg-muted/20"
                              : isSelected
                                ? "border-primary bg-primary/10"
                                : isCurrentPlan
                                  ? "border-accent/50 bg-accent/5"
                                  : "border-border bg-secondary/50 hover:border-primary/50"
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              isSelected ? "bg-primary" : "bg-secondary"
                            }`}>
                              <PlanIcon className={`w-5 h-5 ${isSelected ? "text-primary-foreground" : "text-primary"}`} />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold">{plan.name}</h3>
                              <p className="text-xs text-muted-foreground">{plan.conversations} conv/mes</p>
                            </div>
                            {!isPlanTest && (
                              <span className="text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Gift className="w-2.5 h-2.5" />
                                7 días gratis
                              </span>
                            )}
                          </div>

                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold">{formatPrice(getTotalPriceCOP(plan))}</span>
                            <span className="text-xs text-muted-foreground">/{billingPeriod === "anual" ? "año" : billingPeriod === "semestral" ? "semestre" : "mes"}</span>
                          </div>

                          {isTestBlocked && (
                            <p className="text-xs text-destructive mt-2">Solo se puede comprar una vez.</p>
                          )}

                          {isSelected && !isTestBlocked && (
                            <div className="mt-3 flex items-center gap-1 text-primary text-sm">
                              <Check className="w-4 h-4" />
                              Seleccionado
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Selected Plan Actions */}
                {selectedPlan && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-4 border-t border-border/50"
                  >
                    <div className="bg-primary/5 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Plan seleccionado:</span>
                        <span className="font-bold text-primary">{selectedPlan.name}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-muted-foreground">Total a pagar:</span>
                        <span className="font-bold text-xl">{formatPrice(getTotalPriceCOP(selectedPlan))}</span>
                      </div>
                    </div>

                    <Button
                      onClick={handlePayNewPlan}
                      className="w-full"
                      variant="hero"
                      disabled={paymentLoading}
                    >
                      {paymentLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Pagar Plan {selectedPlan.name}
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}

                {/* Back to Current Plan */}
                <Button
                  onClick={() => {
                    setShowAllPlans(false);
                    setSelectedPlan(null);
                  }}
                  variant="ghost"
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver al plan actual
                </Button>
              </>
            )}

            {/* Back link */}
            <div className="text-center pt-4">
              <Link
                to="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al inicio
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Payment Confirmation Modal */}
      <Dialog open={confirmPaymentModal} onOpenChange={setConfirmPaymentModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Confirmar Pago
            </DialogTitle>
          </DialogHeader>

          {pendingPayment && (
            <div className="space-y-4">
              <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Plan:</span>
                  <span className="font-bold text-primary">{pendingPayment.planName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Monto en COP:</span>
                  <span className={appliedCoupon ? "line-through text-muted-foreground" : "font-medium"}>
                    ${pendingPayment.amount.toLocaleString("es-CO")} COP
                  </span>
                </div>

                {appliedCoupon && (
                  <>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Descuento ({appliedCoupon.code}):</span>
                      <span className="text-primary font-medium">
                        -${appliedCoupon.discountAmount.toLocaleString("es-CO")} COP
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t border-border pt-2">
                      <span className="font-semibold">Total a pagar:</span>
                      <span className="font-bold text-lg text-primary">
                        ${appliedCoupon.finalAmount.toLocaleString("es-CO")} COP
                      </span>
                    </div>
                  </>
                )}

                {currency === 'USD' && exchangeRate && (
                  <>
                    <div className="border-t border-border pt-3 space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">TRM actual:</span>
                        <span>${exchangeRate.rate.toLocaleString("es-CO")} COP/USD</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Comisión (4%):</span>
                        <span>Incluida</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Equivalente en USD:</span>
                        <span className="font-bold text-lg text-primary">
                          ${convertToSelectedCurrency(pendingPayment.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-muted-foreground bg-primary/5 p-2 rounded">
                      <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>El cobro se realizará en COP. El monto en USD es solo referencial.</span>
                    </div>
                  </>
                )}
              </div>

              {/* Coupon input */}
              <div className="border border-border rounded-lg p-3 space-y-2">
                <Label className="flex items-center gap-2 text-sm">
                  <Gift className="w-4 h-4 text-primary" />
                  ¿Tienes un código de cupón?
                </Label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-primary/10 border border-primary/30 rounded-md px-3 py-2">
                    <div>
                      <div className="font-mono text-sm font-semibold">{appliedCoupon.code}</div>
                      <div className="text-xs text-muted-foreground">
                        Aplicado: -${appliedCoupon.discountAmount.toLocaleString("es-CO")} COP
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" onClick={removeCoupon} className="text-destructive hover:text-destructive">
                      Quitar
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ingresa tu código"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleApplyCoupon(); } }}
                      className="uppercase"
                      disabled={validatingCoupon}
                    />
                    <Button
                      onClick={handleApplyCoupon}
                      disabled={!couponInput.trim() || validatingCoupon}
                      variant="outline"
                    >
                      {validatingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : "Aplicar"}
                    </Button>
                  </div>
                )}
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setConfirmPaymentModal(false)}>
                  Cancelar
                </Button>
                <Button variant="hero" onClick={handleConfirmPayment} disabled={paymentLoading}>
                  {paymentLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Confirmar Pago
                    </>
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Renewal;
