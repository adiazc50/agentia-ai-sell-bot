import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Bot, ArrowLeft, Eye, EyeOff, Mail, Lock, User, Building2, Phone, MapPin, CheckCircle2 } from "lucide-react";
import CountrySelect from "@/components/CountrySelect";
import logoSoyAgentia from "@/assets/logo-soyagentia.jpeg";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

type AccountType = "persona" | "empresa";

const calcularDigitoVerificacion = (nit: string): number => {
  const pesos = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71];
  const digits = nit.replace(/[^0-9]/g, '').split('').reverse().map(Number);
  const suma = digits.reduce((acc, digit, i) => acc + digit * pesos[i], 0);
  const residuo = suma % 11;
  if (residuo === 0) return 0;
  if (residuo === 1) return 1;
  return 11 - residuo;
};

interface PersonaFormData {
  firstName: string;
  secondName: string;
  lastName: string;
  secondLastName: string;
  documentType: string;
  documentNumber: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  city: string;
  password: string;
}

interface EmpresaFormData {
  companyName: string;
  nit: string;
  contactName: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  city: string;
  password: string;
}

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingEvent, setPendingEvent] = useState<React.FormEvent | null>(null);
  const [needsProfile, setNeedsProfile] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const [accountType, setAccountType] = useState<AccountType>("persona");
  
  const [personaData, setPersonaData] = useState<PersonaFormData>({
    firstName: "",
    secondName: "",
    lastName: "",
    secondLastName: "",
    documentType: "CC",
    documentNumber: "",
    email: "",
    phone: "",
    country: "",
    address: "",
    city: "",
    password: "",
  });

  const [empresaData, setEmpresaData] = useState<EmpresaFormData>({
    companyName: "",
    nit: "",
    contactName: "",
    email: "",
    phone: "",
    country: "",
    address: "",
    city: "",
    password: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const selectedPlan = searchParams.get("plan");

  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "register") {
      setIsLogin(false);
    }
  }, [searchParams]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setCurrentUserId(session.user.id);
          setTimeout(() => {
            checkProfileAndRedirect(session.user.id, session.user.email || "");
          }, 0);
        } else {
          setCurrentUserId(null);
          setNeedsProfile(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUserId(session.user.id);
        checkProfileAndRedirect(session.user.id, session.user.email || "");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkProfileAndRedirect = async (userId: string, email: string) => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (!profile) {
      // User is authenticated but has no profile - show profile completion form
      setNeedsProfile(true);
      setIsLogin(false);
      // Pre-fill email
      setPersonaData(prev => ({ ...prev, email }));
      setEmpresaData(prev => ({ ...prev, email }));
      return;
    }

    // Check if user is admin
    const { data: role } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (role) {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: redirectUrl,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setForgotSent(true);
        toast({
          title: "Correo enviado",
          description:
            "Si existe una cuenta con ese correo, recibirás un enlace para restablecer tu contraseña.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) {
        const msg = error.message?.toLowerCase?.() ?? "";
        if (msg.includes("email") && msg.includes("confirm")) {
          toast({
            title: "Verifica tu correo",
            description: "Tu cuenta aún no está verificada.",
            variant: "destructive",
          });
        } else if (error.message === "Invalid login credentials") {
          toast({
            title: "Error de autenticación",
            description: "Correo o contraseña incorrectos.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "¡Bienvenido!",
          description: "Has iniciado sesión correctamente.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowConfirmation = (e: React.FormEvent) => {
    e.preventDefault();
    setPendingEvent(e);
    setShowConfirmModal(true);
  };

  const handleRegister = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setShowConfirmModal(false);
    setIsLoading(true);

    try {
      const email = accountType === "persona" ? personaData.email : empresaData.email;
      const password = accountType === "persona" ? personaData.password : empresaData.password;

      // Check if this is the first user (for admin assignment)
      const { data: isFirst } = await supabase.rpc("is_first_user");

      let userId = currentUserId;

      // If user is already authenticated (needsProfile = true), skip signup
      if (!needsProfile) {
        const redirectUrl = `${window.location.origin}/`;
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
          },
        });

        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: "Usuario existente",
              description: "Este correo ya está registrado. Intenta iniciar sesión.",
              variant: "destructive",
            });
            setIsLogin(true);
          } else {
            toast({
              title: "Error",
              description: error.message,
              variant: "destructive",
            });
          }
          return;
        }

        userId = data.user?.id || null;
      }

      if (!userId) {
        toast({
          title: "Error",
          description: "No se pudo obtener el usuario.",
          variant: "destructive",
        });
        return;
      }

      // Create profile
      const now = new Date().toISOString();
      const profileData = accountType === "persona" 
        ? {
            user_id: userId,
            account_type: "persona" as const,
            email: personaData.email || email,
            phone: personaData.phone || null,
            document_type: personaData.documentType || null,
            document_number: personaData.documentNumber || null,
            country: personaData.country || null,
            address: personaData.address || null,
            city: personaData.city || null,
            first_name: personaData.firstName,
            last_name: personaData.lastName,
            second_name: personaData.secondName || null,
            second_last_name: personaData.secondLastName || null,
            terms_accepted_at: now,
            privacy_accepted_at: now,
          }
        : {
            user_id: userId,
            account_type: "empresa" as const,
            email: empresaData.email || email,
            phone: empresaData.phone || null,
            country: empresaData.country || null,
            address: empresaData.address || null,
            city: empresaData.city || null,
            company_name: empresaData.companyName,
            nit: empresaData.nit || null,
            contact_name: empresaData.contactName || null,
            terms_accepted_at: now,
            privacy_accepted_at: now,
          };

      const { error: profileError } = await supabase.from("profiles").insert(profileData);

      if (profileError) {
        console.error("Profile creation error:", profileError);
        toast({
          title: "Error",
          description: "Error al crear el perfil. Contacta a soporte.",
          variant: "destructive",
        });
        return;
      }

      // Send registration webhook POST
      try {
        const webhookPayload = accountType === "persona"
          ? {
              event: "user_registered",
              account_type: "persona",
              user_id: userId,
              first_name: personaData.firstName,
              second_name: personaData.secondName || null,
              last_name: personaData.lastName,
              second_last_name: personaData.secondLastName || null,
              document_type: personaData.documentType,
              document_number: personaData.documentNumber,
              email: personaData.email || email,
              phone: personaData.phone || null,
              country: personaData.country || null,
              address: personaData.address || null,
              city: personaData.city || null,
              registered_at: new Date().toISOString(),
            }
          : {
              event: "user_registered",
              account_type: "empresa",
              user_id: userId,
              company_name: empresaData.companyName,
              nit: empresaData.nit || null,
              nit_verification_digit: empresaData.nit ? calcularDigitoVerificacion(empresaData.nit) : null,
              contact_name: empresaData.contactName || null,
              email: empresaData.email || email,
              phone: empresaData.phone || null,
              country: empresaData.country || null,
              address: empresaData.address || null,
              city: empresaData.city || null,
              registered_at: new Date().toISOString(),
            };

        const { data: webhookResponse, error: webhookError2 } = await supabase.functions.invoke('register-webhook', {
          body: webhookPayload,
        });

        console.log("Registration webhook response:", webhookResponse);

        console.log("Registration webhook sent:", webhookPayload);
      } catch (webhookError) {
        // No bloquear el registro si el webhook falla
        console.error("Registration webhook error:", webhookError);
      }

      // If first user, assign admin role
      if (isFirst) {
        const { error: roleError } = await supabase.from("user_roles").insert({
          user_id: userId,
          role: "admin",
        });

        if (roleError) {
          console.error("Role assignment error:", roleError);
        } else {
          toast({
            title: "¡Eres administrador!",
            description: "Como primer usuario, tienes acceso de administrador.",
          });
        }
      } else {
        // Assign default user role
        await supabase.from("user_roles").insert({
          user_id: userId,
          role: "user",
        });
      }

      toast({
        title: needsProfile ? "¡Perfil completado!" : "¡Cuenta creada!",
        description: needsProfile ? "Tu perfil ha sido completado." : "Tu cuenta ha sido creada exitosamente.",
      });

      // Redirect after profile creation
      setNeedsProfile(false);
      if (isFirst) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password form
  if (isForgotPassword) {
    return (
      <div className="min-h-screen flex">
        <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 py-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full mx-auto"
          >
            <button
              onClick={() => {
                setIsForgotPassword(false);
                setForgotSent(false);
                setForgotEmail("");
              }}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio de sesión
            </button>

            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Bot className="w-6 h-6 text-primary-foreground" />
              </div>
            <span className="text-xl font-bold gradient-text">Agent IA</span>
            </div>

            <h1 className="text-3xl font-bold mb-2">Recuperar contraseña</h1>
            <p className="text-muted-foreground mb-8">
              {forgotSent
                ? "Revisa tu bandeja de entrada y sigue el enlace que te enviamos."
                : "Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña."}
            </p>

            {!forgotSent ? (
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="forgotEmail">Correo electrónico</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="forgotEmail"
                      type="email"
                      placeholder="tu@email.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="pl-10 h-12 bg-secondary border-border"
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Enviando..." : "Enviar enlace"}
                </Button>
              </form>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <p className="text-muted-foreground mb-6">
                  Si no recibes el correo en unos minutos, revisa tu carpeta de spam.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setForgotSent(false);
                    setForgotEmail("");
                  }}
                >
                  Volver al inicio de sesión
                </Button>
              </div>
            )}
          </motion.div>
        </div>

        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-secondary via-background to-secondary relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.2)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.2)_1px,transparent_1px)] bg-[size:60px_60px]" />
          <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }}>
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-8 mx-auto glow-primary animate-float">
                <Lock className="w-12 h-12 text-primary-foreground" />
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Recupera tu <span className="gradient-text">acceso</span>
              </h2>
              <p className="text-muted-foreground max-w-md">
                Te ayudaremos a restablecer tu contraseña de forma segura.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 py-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full mx-auto"
        >
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("auth.backHome")}
            </Link>
            <LanguageSwitcher />
          </div>

          <div className="flex justify-center mb-8">
            <img src={logoSoyAgentia} alt="SoyAgentia" className="h-12 object-contain" />
          </div>

          <h1 className="text-3xl font-bold mb-2">
            {isLogin
              ? t("auth.welcomeBack")
              : needsProfile
                ? t("auth.completeProfile")
                : t("auth.createAccount")}
          </h1>
          <p className="text-muted-foreground mb-8">
            {isLogin
              ? t("auth.loginSubtitle")
              : needsProfile
                ? t("auth.profileSubtitle")
                : selectedPlan
                  ? `${t("auth.signupPlanPrefix")} ${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}`
                  : t("auth.signupSubtitle")}
          </p>

          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">{t("auth.emailLabel")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="pl-10 h-12 bg-secondary border-border"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t("auth.passwordLabel")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="pl-10 pr-10 h-12 bg-secondary border-border"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-sm text-primary hover:underline"
                >
                  {t("auth.forgotPassword")}
                </button>
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? t("auth.processing") : t("auth.loginCta")}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleShowConfirmation} className="space-y-6">
              {/* Account Type Selector */}
              <div className="space-y-3">
                <Label>Tipo de cuenta</Label>
                <RadioGroup
                  value={accountType}
                  onValueChange={(v) => setAccountType(v as AccountType)}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className={`flex items-center space-x-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${accountType === "persona" ? "border-primary bg-primary/10" : "border-border bg-secondary"}`}>
                    <RadioGroupItem value="persona" id="persona" />
                    <Label htmlFor="persona" className="flex items-center gap-2 cursor-pointer">
                      <User className="w-5 h-5" />
                      Persona
                    </Label>
                  </div>
                  <div className={`flex items-center space-x-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${accountType === "empresa" ? "border-primary bg-primary/10" : "border-border bg-secondary"}`}>
                    <RadioGroupItem value="empresa" id="empresa" />
                    <Label htmlFor="empresa" className="flex items-center gap-2 cursor-pointer">
                      <Building2 className="w-5 h-5" />
                      Empresa
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {accountType === "persona" ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Primer Nombre *</Label>
                      <Input
                        id="firstName"
                        placeholder="Juan"
                        value={personaData.firstName}
                        onChange={(e) => setPersonaData({ ...personaData, firstName: e.target.value })}
                        className="h-12 bg-secondary border-border"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secondName">Segundo Nombre</Label>
                      <Input
                        id="secondName"
                        placeholder="Carlos"
                        value={personaData.secondName}
                        onChange={(e) => setPersonaData({ ...personaData, secondName: e.target.value })}
                        className="h-12 bg-secondary border-border"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Primer Apellido *</Label>
                      <Input
                        id="lastName"
                        placeholder="Pérez"
                        value={personaData.lastName}
                        onChange={(e) => setPersonaData({ ...personaData, lastName: e.target.value })}
                        className="h-12 bg-secondary border-border"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secondLastName">Segundo Apellido</Label>
                      <Input
                        id="secondLastName"
                        placeholder="García"
                        value={personaData.secondLastName}
                        onChange={(e) => setPersonaData({ ...personaData, secondLastName: e.target.value })}
                        className="h-12 bg-secondary border-border"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="documentType">Tipo Doc *</Label>
                      <select
                        id="documentType"
                        value={personaData.documentType}
                        onChange={(e) => setPersonaData({ ...personaData, documentType: e.target.value })}
                        className="h-12 w-full rounded-md border border-border bg-secondary px-3 text-sm"
                        required
                      >
                        <option value="CC">CC</option>
                        <option value="CE">CE</option>
                        <option value="NIT">NIT</option>
                        <option value="PAS">Pasaporte</option>
                      </select>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="documentNumber">Número de documento *</Label>
                      <Input
                        id="documentNumber"
                        placeholder="1234567890"
                        value={personaData.documentNumber}
                        onChange={(e) => setPersonaData({ ...personaData, documentNumber: e.target.value })}
                        className="h-12 bg-secondary border-border"
                        required
                      />
                    </div>
                  </div>

                  {!needsProfile && (
                    <div className="space-y-2">
                      <Label htmlFor="personaEmail">Correo electrónico *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="personaEmail"
                          type="email"
                          placeholder="tu@email.com"
                          value={personaData.email}
                          onChange={(e) => setPersonaData({ ...personaData, email: e.target.value })}
                          className="pl-10 h-12 bg-secondary border-border"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="personaPhone">Teléfono</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="personaPhone"
                        type="tel"
                        placeholder="+57 300 123 4567"
                        value={personaData.phone}
                        onChange={(e) => setPersonaData({ ...personaData, phone: e.target.value })}
                        className="pl-10 h-12 bg-secondary border-border"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="personaCountry">País *</Label>
                    <CountrySelect
                      value={personaData.country}
                      onValueChange={(val) => setPersonaData({ ...personaData, country: val })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="personaCity">Ciudad</Label>
                      <Input
                        id="personaCity"
                        placeholder="Bogotá"
                        value={personaData.city}
                        onChange={(e) => setPersonaData({ ...personaData, city: e.target.value })}
                        className="h-12 bg-secondary border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="personaAddress">Dirección</Label>
                      <Input
                        id="personaAddress"
                        placeholder="Calle 123"
                        value={personaData.address}
                        onChange={(e) => setPersonaData({ ...personaData, address: e.target.value })}
                        className="h-12 bg-secondary border-border"
                      />
                    </div>
                  </div>

                  {!needsProfile && (
                    <div className="space-y-2">
                      <Label htmlFor="personaPassword">Contraseña *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="personaPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={personaData.password}
                          onChange={(e) => setPersonaData({ ...personaData, password: e.target.value })}
                          className="pl-10 pr-10 h-12 bg-secondary border-border"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Razón social *</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="companyName"
                        placeholder="Mi Empresa S.A.S."
                        value={empresaData.companyName}
                        onChange={(e) => setEmpresaData({ ...empresaData, companyName: e.target.value })}
                        className="pl-10 h-12 bg-secondary border-border"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nit">NIT (sin dígito de verificación) *</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="nit"
                        placeholder="900123456"
                        value={empresaData.nit}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          setEmpresaData({ ...empresaData, nit: val });
                        }}
                        className="h-12 bg-secondary border-border flex-1"
                        required
                      />
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-muted-foreground text-lg font-bold">—</span>
                        <span className={`text-2xl font-bold min-w-[2ch] text-center ${empresaData.nit.length >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                          {empresaData.nit.length >= 3 ? calcularDigitoVerificacion(empresaData.nit) : '?'}
                        </span>
                      </div>
                    </div>
                    {empresaData.nit.length >= 3 && (
                      <p className="text-xs text-muted-foreground">
                        Dígito de verificación: <span className="font-bold text-primary">{calcularDigitoVerificacion(empresaData.nit)}</span> — Verifica que coincida con tu RUT.
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Nombre de contacto *</Label>
                      <Input
                        id="contactName"
                        placeholder="Juan Pérez"
                        value={empresaData.contactName}
                        onChange={(e) => setEmpresaData({ ...empresaData, contactName: e.target.value })}
                        className="h-12 bg-secondary border-border"
                        required
                      />
                    </div>
                  </div>

                  {!needsProfile && (
                    <div className="space-y-2">
                      <Label htmlFor="empresaEmail">Correo electrónico *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="empresaEmail"
                          type="email"
                          placeholder="contacto@empresa.com"
                          value={empresaData.email}
                          onChange={(e) => setEmpresaData({ ...empresaData, email: e.target.value })}
                          className="pl-10 h-12 bg-secondary border-border"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="empresaPhone">Teléfono *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="empresaPhone"
                        type="tel"
                        placeholder="+57 601 234 5678"
                        value={empresaData.phone}
                        onChange={(e) => setEmpresaData({ ...empresaData, phone: e.target.value })}
                        className="pl-10 h-12 bg-secondary border-border"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="empresaCountry">País *</Label>
                    <CountrySelect
                      value={empresaData.country}
                      onValueChange={(val) => setEmpresaData({ ...empresaData, country: val })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="empresaCity">Ciudad *</Label>
                      <Input
                        id="empresaCity"
                        placeholder="Bogotá"
                        value={empresaData.city}
                        onChange={(e) => setEmpresaData({ ...empresaData, city: e.target.value })}
                        className="h-12 bg-secondary border-border"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="empresaAddress">Dirección *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="empresaAddress"
                          placeholder="Calle 123 #45-67"
                          value={empresaData.address}
                          onChange={(e) => setEmpresaData({ ...empresaData, address: e.target.value })}
                          className="pl-10 h-12 bg-secondary border-border"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {!needsProfile && (
                    <div className="space-y-2">
                      <Label htmlFor="empresaPassword">Contraseña *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="empresaPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={empresaData.password}
                          onChange={(e) => setEmpresaData({ ...empresaData, password: e.target.value })}
                          className="pl-10 pr-10 h-12 bg-secondary border-border"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Terms & Conditions checkbox */}
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                  className="mt-0.5"
                  required
                />
                <label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                  He leído y acepto los{" "}
                  <a href="/terminos" target="_blank" className="text-primary hover:underline font-medium">
                    Términos y Condiciones
                  </a>{" "}
                  y la{" "}
                  <a href="/privacidad" target="_blank" className="text-primary hover:underline font-medium">
                    Política de Privacidad y Tratamiento de Datos Personales
                  </a>
                  . Autorizo el tratamiento de mis datos personales conforme a la Ley 1581 de 2012.
                </label>
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading || !acceptedTerms}>
                {isLoading 
                  ? (needsProfile ? "Completando perfil..." : "Creando cuenta...") 
                  : (needsProfile ? "Completar Perfil" : "Crear Cuenta")}
              </Button>
            </form>
          )}

          {!needsProfile && (
            <p className="text-center text-muted-foreground mt-8">
              {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-medium hover:underline"
              >
                {isLogin ? "Regístrate" : "Inicia sesión"}
              </button>
            </p>
          )}
        </motion.div>
      </div>

      {/* Right Panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-secondary via-background to-secondary relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.2)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.2)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }}>
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-8 mx-auto glow-primary animate-float">
              <Bot className="w-12 h-12 text-primary-foreground" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              {isLogin ? "Bienvenido" : accountType === "empresa" ? "Impulsa tu empresa" : "Comienza hoy"}
            </h2>
            <p className="text-muted-foreground max-w-md">
              {isLogin
                ? "Accede a tu panel de control y gestiona tus conversaciones automatizadas."
                : accountType === "empresa"
                  ? "Automatiza la atención al cliente de tu empresa con inteligencia artificial."
                  : "Regístrate y comienza a automatizar tu atención al cliente con IA."}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <CheckCircle2 className="w-6 h-6 text-primary" />
              Confirma tus datos
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="rounded-xl border border-border bg-secondary/50 p-4 space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Tipo de cuenta
              </h3>
              <p className="font-medium">{accountType === "persona" ? "👤 Persona" : "🏢 Empresa"}</p>
            </div>

            {accountType === "persona" ? (
              <div className="rounded-xl border border-border bg-secondary/50 p-4 space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Datos personales
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Primer Nombre:</span>
                    <p className="font-medium">{personaData.firstName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Segundo Nombre:</span>
                    <p className="font-medium">{personaData.secondName || "—"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Primer Apellido:</span>
                    <p className="font-medium">{personaData.lastName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Segundo Apellido:</span>
                    <p className="font-medium">{personaData.secondLastName || "—"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Documento:</span>
                    <p className="font-medium">{personaData.documentType} {personaData.documentNumber}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Correo:</span>
                    <p className="font-medium">{personaData.email}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Teléfono:</span>
                    <p className="font-medium">{personaData.phone || "—"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">País:</span>
                    <p className="font-medium">{personaData.country || "—"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Ciudad:</span>
                    <p className="font-medium">{personaData.city || "—"}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Dirección:</span>
                    <p className="font-medium">{personaData.address || "—"}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-secondary/50 p-4 space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Datos de empresa
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Razón Social:</span>
                    <p className="font-medium">{empresaData.companyName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">NIT:</span>
                    <p className="font-medium">{empresaData.nit} — {calcularDigitoVerificacion(empresaData.nit)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Contacto:</span>
                    <p className="font-medium">{empresaData.contactName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Correo:</span>
                    <p className="font-medium">{empresaData.email}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Teléfono:</span>
                    <p className="font-medium">{empresaData.phone}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">País:</span>
                    <p className="font-medium">{empresaData.country}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Ciudad:</span>
                    <p className="font-medium">{empresaData.city}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Dirección:</span>
                    <p className="font-medium">{empresaData.address}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Legal acceptance checkboxes */}
          <div className="space-y-3 border-t border-border pt-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id="accept-terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                className="mt-0.5"
              />
              <label htmlFor="accept-terms" className="text-sm text-muted-foreground leading-tight cursor-pointer">
                Acepto los{" "}
                <Link to="/terminos" target="_blank" className="text-primary underline hover:text-primary/80">
                  Términos y Condiciones
                </Link>{" "}
                del servicio de AGENT IA SAS.
              </label>
            </div>
            <div className="flex items-start gap-3">
              <Checkbox
                id="accept-privacy"
                checked={acceptedPrivacy}
                onCheckedChange={(checked) => setAcceptedPrivacy(checked === true)}
                className="mt-0.5"
              />
              <label htmlFor="accept-privacy" className="text-sm text-muted-foreground leading-tight cursor-pointer">
                Autorizo el{" "}
                <Link to="/privacidad" target="_blank" className="text-primary underline hover:text-primary/80">
                  tratamiento de mis datos personales
                </Link>{" "}
                conforme a la Ley 1581 de 2012.
              </label>
            </div>
          </div>

          <DialogFooter className="flex gap-3 sm:gap-3">
            <Button variant="outline" onClick={() => { setShowConfirmModal(false); setAcceptedTerms(false); setAcceptedPrivacy(false); }} className="flex-1">
              Corregir datos
            </Button>
            <Button variant="hero" onClick={() => handleRegister()} disabled={isLoading || !acceptedTerms || !acceptedPrivacy} className="flex-1">
              {isLoading ? "Registrando..." : "Confirmar y Registrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Auth;