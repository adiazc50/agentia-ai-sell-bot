import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Handshake, ArrowRight, Eye, EyeOff, Loader2, CheckCircle2, User, Building2, Phone, MapPin, Mail, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";

type AccountType = "persona" | "empresa";

const PARTNER_AMOUNT_COP = 5000000;
const PARTNER_PLAN_NAME = "Partner Ready";

const calcularDigitoVerificacion = (nit: string): number => {
  const pesos = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71];
  const digits = nit.replace(/[^0-9]/g, '').split('').reverse().map(Number);
  const suma = digits.reduce((acc, digit, i) => acc + digit * pesos[i], 0);
  const residuo = suma % 11;
  if (residuo === 0) return 0;
  if (residuo === 1) return 1;
  return 11 - residuo;
};

const PartnerRegistrationForm = () => {
  const { toast } = useToast();
  const formRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const { formatPrice, currency } = useCurrency();

  const [step, setStep] = useState<"form" | "payment" | "success">("form");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  const [accountType, setAccountType] = useState<AccountType>("empresa");

  const [personaData, setPersonaData] = useState({
    firstName: "", secondName: "", lastName: "", secondLastName: "",
    documentType: "CC", documentNumber: "",
    email: "", phone: "", address: "", city: "", password: "",
  });

  const [empresaData, setEmpresaData] = useState({
    companyName: "", nit: "", contactName: "",
    email: "", phone: "", address: "", city: "", password: "",
  });

  // Load Wompi script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.wompi.co/widget.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  const getNitDigito = () => {
    if (!empresaData.nit) return "";
    return calcularDigitoVerificacion(empresaData.nit);
  };

  const isFormValid = () => {
    if (!acceptedTerms || !acceptedPrivacy) return false;
    if (accountType === "persona") {
      return !!(personaData.firstName && personaData.lastName && personaData.documentType &&
        personaData.documentNumber && personaData.email && personaData.phone && personaData.password &&
        personaData.address && personaData.city);
    }
    return !!(empresaData.companyName && empresaData.nit && empresaData.contactName &&
      empresaData.email && empresaData.phone && empresaData.password &&
      empresaData.address && empresaData.city);
  };

  const handleShowConfirmation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast({ title: t('partner.formIncomplete'), description: t('partner.fillAllFields'), variant: "destructive" });
      return;
    }
    setShowConfirmModal(true);
  };

  const handleRegisterAndPay = async () => {
    setShowConfirmModal(false);
    setIsLoading(true);

    try {
      const email = accountType === "persona" ? personaData.email : empresaData.email;
      const password = accountType === "persona" ? personaData.password : empresaData.password;

      // 1. Register user (backend handles profile creation + webhook)
      const now = new Date().toISOString();
      const registerData = accountType === "persona"
        ? {
            accountType: "persona",
            firstName: personaData.firstName,
            secondName: personaData.secondName || null,
            lastName: personaData.lastName,
            secondLastName: personaData.secondLastName || null,
            documentType: personaData.documentType,
            documentNumber: personaData.documentNumber,
            email: personaData.email,
            phone: personaData.phone || null,
            address: personaData.address || null,
            city: personaData.city || null,
            password,
            assignedPlan: PARTNER_PLAN_NAME,
            termsAcceptedAt: now,
            privacyAcceptedAt: now,
          }
        : {
            accountType: "empresa",
            companyName: empresaData.companyName,
            nit: empresaData.nit || null,
            nitVerificationDigit: empresaData.nit ? calcularDigitoVerificacion(empresaData.nit) : null,
            contactName: empresaData.contactName || null,
            email: empresaData.email,
            phone: empresaData.phone || null,
            address: empresaData.address || null,
            city: empresaData.city || null,
            password,
            assignedPlan: PARTNER_PLAN_NAME,
            termsAcceptedAt: now,
            privacyAcceptedAt: now,
          };

      let registerResult: any;
      try {
        registerResult = await api.auth.register(registerData);
      } catch (err: any) {
        if (err?.message?.includes("already registered") || err?.statusCode === 409) {
          toast({ title: t('partner.userExists'), description: t('partner.userExistsMsg'), variant: "destructive" });
        } else {
          toast({ title: "Error", description: err?.message || "Error al crear el usuario.", variant: "destructive" });
        }
        return;
      }

      const userId = registerResult?.user?.id || registerResult?.userId;
      if (!userId) {
        toast({ title: "Error", description: "No se pudo crear el usuario.", variant: "destructive" });
        return;
      }

      // 2. Assign vendedor role (roleId 5)
      try {
        await api.roles.assign(userId, 5);
      } catch (e) {
        console.error("Role assignment error:", e);
      }

      // 3. Initiate Wompi payment
      const reference = `partner-ready-${String(userId).slice(0, 8)}-${Date.now()}`;
      const amountInCents = PARTNER_AMOUNT_COP * 100;

      let signatureData: any;
      try {
        signatureData = await api.payments.wompiSignature({ reference, amountInCents, currency: "COP" });
      } catch (e) {
        console.error("Signature error:", e);
        toast({ title: "Error", description: "Error al preparar el pago.", variant: "destructive" });
        return;
      }

      // Create transaction record
      try {
        await api.transactions.success({
          userId,
          reference,
          planName: PARTNER_PLAN_NAME,
          amount: PARTNER_AMOUNT_COP,
          currency: "COP",
          status: "PENDING",
          paymentGateway: "wompi",
        });
      } catch (e) {
        console.error("Transaction creation error:", e);
      }

      const customerName = accountType === "persona"
        ? `${personaData.firstName} ${personaData.lastName}`
        : empresaData.companyName;
      const customerEmail = accountType === "persona" ? personaData.email : empresaData.email;
      const customerPhone = accountType === "persona" ? personaData.phone : empresaData.phone;
      const cleanPhone = customerPhone?.replace(/[^0-9]/g, '');
      const phoneWithPrefix = cleanPhone?.startsWith('57') ? cleanPhone : `57${cleanPhone}`;
      const customerDoc = accountType === "persona" ? personaData.documentNumber : empresaData.nit;
      const customerDocType = accountType === "persona" ? personaData.documentType : "NIT";

      const checkout = new (window as any).WidgetCheckout({
        currency: "COP",
        amountInCents,
        reference,
        publicKey: signatureData.publicKey,
        signature: { integrity: signatureData.signature },
        redirectUrl: `${window.location.origin}/partners?payment=success`,
        customerData: {
          email: customerEmail,
          fullName: customerName,
          phoneNumber: phoneWithPrefix,
          phoneNumberPrefix: "+57",
          legalId: customerDoc,
          legalIdType: customerDocType,
        },
      });

      checkout.open(async (result: any) => {
        const transaction = result.transaction;
        if (transaction) {
          // Update transaction status via API
          try {
            await api.transactions.success({
              reference,
              status: transaction.status,
              wompiTransactionId: transaction.id,
              paymentMethod: transaction.paymentMethodType || null,
            });
          } catch (e) {
            console.error("Payment update error:", e);
          }

          if (transaction.status === "APPROVED") {
            setStep("success");
            toast({ title: t('partner.paymentSuccess'), description: t('partner.paymentSuccessMsg') });
          } else {
            toast({ title: t('partner.paymentFailed'), description: t('partner.paymentFailedMsg'), variant: "destructive" });
          }
        }
      });

    } catch (error) {
      console.error("Registration error:", error);
      toast({ title: "Error", description: "Ocurrió un error inesperado.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (step === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16 px-4"
      >
        <div className="p-4 rounded-2xl bg-primary/10 w-fit mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-4">{t('partner.successTitle')}</h2>
        <p className="text-muted-foreground text-lg max-w-lg mx-auto mb-3">{t('partner.successMsg')}</p>
        <p className="text-muted-foreground max-w-lg mx-auto mb-8">
          {t('partner.successReview')}
          <strong className="text-foreground"> {t('partner.successRefund')}</strong>
        </p>
        <p className="text-sm text-muted-foreground">{t('partner.successEmail')}</p>
      </motion.div>
    );
  }

  return (
    <div ref={formRef}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-10">
          <div className="p-4 rounded-2xl bg-primary/10 w-fit mx-auto mb-4">
            <Handshake className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{t('partner.formTitle')}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t('partner.formSubtitle')} <strong className="text-foreground">{formatPrice(5000000)}</strong> (≈ $5.000.000 COP).
            {' '}{t('partner.formRefundNote')}
          </p>
        </div>

        <Card className="border-2 border-primary/20 max-w-2xl mx-auto">
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleShowConfirmation} className="space-y-6">
              {/* Account type */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">{t('partner.accountType')}</Label>
                <RadioGroup
                  value={accountType}
                  onValueChange={(v) => setAccountType(v as AccountType)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="empresa" id="partner-empresa" />
                    <Label htmlFor="partner-empresa" className="flex items-center gap-1.5 cursor-pointer">
                      <Building2 className="w-4 h-4" /> {t('partner.company')}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="persona" id="partner-persona" />
                    <Label htmlFor="partner-persona" className="flex items-center gap-1.5 cursor-pointer">
                      <User className="w-4 h-4" /> {t('partner.person')}
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {accountType === "empresa" ? (
                <>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nombre de la empresa *</Label>
                      <Input value={empresaData.companyName} onChange={e => setEmpresaData(p => ({ ...p, companyName: e.target.value }))} required />
                    </div>
                    <div className="space-y-2">
                      <Label>NIT *</Label>
                      <div className="flex gap-2 items-end">
                        <Input value={empresaData.nit} onChange={e => setEmpresaData(p => ({ ...p, nit: e.target.value.replace(/[^0-9]/g, '') }))} required className="flex-1" />
                        {empresaData.nit && (
                          <span className="text-sm text-muted-foreground whitespace-nowrap pb-2">DV: {getNitDigito()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nombre de contacto *</Label>
                      <Input value={empresaData.contactName} onChange={e => setEmpresaData(p => ({ ...p, contactName: e.target.value }))} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Correo electrónico *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input type="email" className="pl-10" value={empresaData.email} onChange={e => setEmpresaData(p => ({ ...p, email: e.target.value }))} required />
                      </div>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Teléfono *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input className="pl-10" value={empresaData.phone} onChange={e => setEmpresaData(p => ({ ...p, phone: e.target.value }))} required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Ciudad *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input className="pl-10" value={empresaData.city} onChange={e => setEmpresaData(p => ({ ...p, city: e.target.value }))} required />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Dirección *</Label>
                    <Input value={empresaData.address} onChange={e => setEmpresaData(p => ({ ...p, address: e.target.value }))} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Contraseña *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        className="pl-10 pr-10"
                        value={empresaData.password}
                        onChange={e => setEmpresaData(p => ({ ...p, password: e.target.value }))}
                        required
                        minLength={6}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Primer nombre *</Label>
                      <Input value={personaData.firstName} onChange={e => setPersonaData(p => ({ ...p, firstName: e.target.value }))} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Segundo nombre</Label>
                      <Input value={personaData.secondName} onChange={e => setPersonaData(p => ({ ...p, secondName: e.target.value }))} />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Primer apellido *</Label>
                      <Input value={personaData.lastName} onChange={e => setPersonaData(p => ({ ...p, lastName: e.target.value }))} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Segundo apellido</Label>
                      <Input value={personaData.secondLastName} onChange={e => setPersonaData(p => ({ ...p, secondLastName: e.target.value }))} />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tipo de documento *</Label>
                      <Select value={personaData.documentType} onValueChange={v => setPersonaData(p => ({ ...p, documentType: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                          <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                          <SelectItem value="PP">Pasaporte</SelectItem>
                          <SelectItem value="TI">Tarjeta de Identidad</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Número de documento *</Label>
                      <Input value={personaData.documentNumber} onChange={e => setPersonaData(p => ({ ...p, documentNumber: e.target.value }))} required />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Correo electrónico *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input type="email" className="pl-10" value={personaData.email} onChange={e => setPersonaData(p => ({ ...p, email: e.target.value }))} required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Teléfono *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input className="pl-10" value={personaData.phone} onChange={e => setPersonaData(p => ({ ...p, phone: e.target.value }))} required />
                      </div>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Ciudad *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input className="pl-10" value={personaData.city} onChange={e => setPersonaData(p => ({ ...p, city: e.target.value }))} required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Dirección *</Label>
                      <Input value={personaData.address} onChange={e => setPersonaData(p => ({ ...p, address: e.target.value }))} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Contraseña *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        className="pl-10 pr-10"
                        value={personaData.password}
                        onChange={e => setPersonaData(p => ({ ...p, password: e.target.value }))}
                        required
                        minLength={6}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Terms & Privacy */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start space-x-2">
                  <Checkbox id="partner-terms" checked={acceptedTerms} onCheckedChange={(c) => setAcceptedTerms(!!c)} />
                  <label htmlFor="partner-terms" className="text-sm text-muted-foreground leading-tight cursor-pointer">
                    Acepto los <Link to="/terminos" className="text-primary hover:underline" target="_blank">Términos y Condiciones</Link> y las condiciones del Programa de Partners
                  </label>
                </div>
                <div className="flex items-start space-x-2">
                  <Checkbox id="partner-privacy" checked={acceptedPrivacy} onCheckedChange={(c) => setAcceptedPrivacy(!!c)} />
                  <label htmlFor="partner-privacy" className="text-sm text-muted-foreground leading-tight cursor-pointer">
                    Acepto la <Link to="/privacidad" className="text-primary hover:underline" target="_blank">Política de Privacidad</Link> (Ley 1581 de 2012)
                  </label>
                </div>
              </div>

              {/* Amount summary */}
              <Card className="bg-muted/50 border-border/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                  <p className="text-sm font-semibold text-foreground">{t('partner.paymentTitle')}</p>
                    <p className="text-xs text-muted-foreground">{t('partner.paymentRefundable')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{formatPrice(5000000)}</p>
                    <p className="text-xs text-muted-foreground">≈ $5.000.000 COP</p>
                  </div>
                </CardContent>
              </Card>

              <Button
                type="submit"
                variant="hero"
                size="xl"
                className="w-full"
                disabled={isLoading || !isFormValid()}
              >
                {isLoading ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> {t('partner.processing')}</>
                ) : (
                  <><Handshake className="w-5 h-5 mr-2" /> {t('partner.registerAndPay')} {formatPrice(5000000)}</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Confirmation modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('partner.confirmData')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            {accountType === "empresa" ? (
              <>
                <div className="flex justify-between"><span className="text-muted-foreground">Empresa:</span><span className="font-medium">{empresaData.companyName}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">NIT:</span><span className="font-medium">{empresaData.nit}-{getNitDigito()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Contacto:</span><span className="font-medium">{empresaData.contactName}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Email:</span><span className="font-medium">{empresaData.email}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Teléfono:</span><span className="font-medium">{empresaData.phone}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Ciudad:</span><span className="font-medium">{empresaData.city}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Dirección:</span><span className="font-medium">{empresaData.address}</span></div>
              </>
            ) : (
              <>
                <div className="flex justify-between"><span className="text-muted-foreground">Nombre:</span><span className="font-medium">{personaData.firstName} {personaData.secondName} {personaData.lastName} {personaData.secondLastName}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Documento:</span><span className="font-medium">{personaData.documentType} {personaData.documentNumber}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Email:</span><span className="font-medium">{personaData.email}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Teléfono:</span><span className="font-medium">{personaData.phone}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Ciudad:</span><span className="font-medium">{personaData.city}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Dirección:</span><span className="font-medium">{personaData.address}</span></div>
              </>
            )}
            <div className="pt-2 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Monto a pagar:</span>
                <span className="text-lg font-bold text-primary">{formatPrice(5000000)} <span className="text-xs font-normal text-muted-foreground">(≈ $5.000.000 COP)</span></span>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowConfirmModal(false)}>{t('partner.correctData')}</Button>
            <Button variant="hero" onClick={handleRegisterAndPay} disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {t('partner.confirmAndPay')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { PartnerRegistrationForm };
export default PartnerRegistrationForm;
