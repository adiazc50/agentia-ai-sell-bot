import { useEffect, useState, useMemo, useRef } from "react";
import logoSoyAgentia from "@/assets/logo-soyagentia.jpeg";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Bot, CreditCard, LogOut, User, Building2, Calendar,
  CheckCircle, XCircle, Edit, HelpCircle, Plus, MessageSquare, Info, RefreshCw,
  Home, Tag, Ticket
} from "lucide-react";
import { api, isAuthenticated, getUser, logout as apiLogout } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { format, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { es, enUS, ptBR } from "date-fns/locale";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useLanguage } from "@/contexts/LanguageContext";
import DashboardShowcase from "@/components/DashboardShowcase";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import CountrySelect from "@/components/CountrySelect";
import InvoicesTab from "@/components/InvoicesTab";
import MyCouponsTab from "@/components/MyCouponsTab";

/** Valida dígito de verificación de NIT colombiano (algoritmo DIAN) */
function validateNitDv(nit: string): { valid: boolean; error?: string } {
  const clean = nit.replace(/[.\s]/g, '');
  if (!clean) return { valid: false, error: 'El NIT es obligatorio' };

  // Debe tener formato XXXXXXXX-X
  if (!clean.includes('-')) return { valid: false, error: 'El NIT debe incluir el dígito de verificación (ej: 901976734-4)' };

  const parts = clean.split('-');
  if (parts.length !== 2 || !parts[1]) return { valid: false, error: 'Formato inválido. Usa: número-DV' };

  const base = parts[0];
  const dvProvided = parseInt(parts[1]);
  if (isNaN(dvProvided) || !/^\d+$/.test(base)) return { valid: false, error: 'El NIT solo debe contener números' };

  const primes = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71];
  let sum = 0;
  const digits = base.split('').reverse();
  for (let i = 0; i < digits.length; i++) {
    sum += parseInt(digits[i]) * primes[i];
  }
  const remainder = sum % 11;
  const dvCalc = remainder >= 2 ? 11 - remainder : remainder;

  if (dvCalc !== dvProvided) return { valid: false, error: `Dígito de verificación incorrecto. Debería ser ${dvCalc}` };
  return { valid: true };
}

interface ProfileUser {
  id: number;
  name: string;
  address: string | null;
  phone: number | null;
  email: string;
  idRole: number;
  idCompany: number;
  status: number;
  documentType: string | null;
  documentNumber: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ProfileCompany {
  id: number;
  name: string;
  nit: string | null;
  entryDate: string | null;
  status: number;
  accountType: string | null;
  currentPlan: string | null;
  counterMessages: number | null;
  city: string | null;
  country: string | null;
  address: string | null;
}

interface Profile {
  user: ProfileUser;
  company: ProfileCompany;
  roleConversia: string;
}

interface Transaction {
  id: number;
  reference: string;
  plan_name: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  transaction_id: string | null;
  payment_method: string | null;
  transaction_date: string | null;
  id_company: number;
  type?: string;
  id_coupon?: number | null;
  discount_amount?: number | null;
  coupon_code?: string | null;
}

interface SupportTicket {
  id: number;
  id_user: number;
  id_company: number;
  subject: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
}

interface TicketMessage {
  id: number;
  ticket_id: number;
  user_id: number;
  message: string;
  is_from_support: boolean;
  created_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const dateLocale = language === 'en' ? enUS : language === 'pt' ? ptBR : es;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [newTicketModal, setNewTicketModal] = useState(false);
  const [configAgentModal, setConfigAgentModal] = useState(false);
  const [viewTicketModal, setViewTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [ticketMessages, setTicketMessages] = useState<TicketMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [renewModal, setRenewModal] = useState(false);
  const [dbPlans, setDbPlans] = useState<any[]>([]);
  const [wantUpgrade, setWantUpgrade] = useState(false);
  const [upgradeWhen, setUpgradeWhen] = useState<'now' | 'next'>('now');
  const [paymentMethod, setPaymentMethod] = useState<'wompi' | 'paypal'>('wompi');
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    address: "",
    documentType: "",
    documentNumber: "",
    nit: "",
    city: "",
    country: "",
  });
  const [invoiceErrors, setInvoiceErrors] = useState<string[]>([]);
  const [pendingPaymentAfterEdit, setPendingPaymentAfterEdit] = useState(false);
  const getFieldError = (field: string): string | null => {
    const isEmpresa = profile?.company?.accountType === 'empresa';
    switch (field) {
      case 'name':
        if (!editForm.name.trim()) return 'El nombre es obligatorio';
        if (editForm.name.trim().split(/\s+/).length < 2) return 'Debe tener nombre y apellido';
        return null;
      case 'phone':
        if (!editForm.phone || editForm.phone === '0') return 'El teléfono es obligatorio';
        if (editForm.phone.replace(/\D/g, '').length < 7) return 'Debe tener al menos 7 dígitos';
        return null;
      case 'address':
        if (!editForm.address.trim()) return 'La dirección es obligatoria';
        return null;
      case 'city':
        if (!editForm.city.trim()) return 'La ciudad es obligatoria';
        return null;
      case 'country':
        if (!editForm.country.trim()) return 'El país es obligatorio';
        return null;
      case 'nit':
        if (!isEmpresa) return null;
        if (!editForm.nit.trim()) return 'El NIT/identificación fiscal es obligatorio';
        // Solo validar dígito de verificación DIAN si es Colombia
        const isColombia = !editForm.country || editForm.country.toLowerCase() === 'colombia';
        if (isColombia) return validateNitDv(editForm.nit).error || null;
        return null; // Otros países: solo que no esté vacío
      case 'documentType':
        if (isEmpresa) return null;
        if (!editForm.documentType) return 'El tipo de documento es obligatorio';
        return null;
      case 'documentNumber':
        if (isEmpresa) return null;
        if (!editForm.documentNumber.trim()) return 'El número de documento es obligatorio';
        return null;
      default: return null;
    }
  };

  const isEditFormValid = (): boolean => {
    const fields = ['name', 'phone', 'address', 'city', 'country'];
    if (profile?.company?.accountType === 'empresa') fields.push('nit');
    else { fields.push('documentType'); fields.push('documentNumber'); }
    return fields.every(f => !getFieldError(f));
  };
  const [newTicket, setNewTicket] = useState({
    subject: "",
    description: "",
    priority: "medium"
  });
  const [selectedPlan, setSelectedPlan] = useState({ plan: "mensual", package: "starter" } as { plan: "mensual" | "semestral" | "anual"; package: string });
  const [renewLoading, setRenewLoading] = useState(false);
  const [confirmPaymentModal, setConfirmPaymentModal] = useState(false);
  const [pendingPaymentAmount, setPendingPaymentAmount] = useState(0);
  const [pendingPlanName, setPendingPlanName] = useState("");
  const [pendingTransactionType, setPendingTransactionType] = useState<'renewal' | 'upgrade'>('renewal');
  const [tokenizeModal, setTokenizeModal] = useState(false);
  const [tokenizingCard, setTokenizingCard] = useState(false);
  const [activeSubscription, setActiveSubscription] = useState<any>(null);
  const [paymentMethodModal, setPaymentMethodModal] = useState(false);
  const [pendingPaymentUSD, setPendingPaymentUSD] = useState(0);
  const [triggerWompiPayment, setTriggerWompiPayment] = useState(false);
  const [triggerPayPalPayment, setTriggerPayPalPayment] = useState(false);

  // Coupon state for the Renew/Change plan modal
  const [couponInput, setCouponInput] = useState("");
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    finalAmount: number;
    originalAmount: number;
  } | null>(null);

  const { currency, formatPrice, convertToSelectedCurrency, exchangeRate } = useCurrency();
  
  // State for month filter
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<{ month: number; year: number } | null>(null);
  const [monthDetailModal, setMonthDetailModal] = useState(false);
  
  // State for payments tab filters
  const [paymentFilterMonth, setPaymentFilterMonth] = useState<string>("all");
  const [paymentFilterPlan, setPaymentFilterPlan] = useState<string>("all");
  const [paymentFilterStatus, setPaymentFilterStatus] = useState<string>("all");

  // Check if user already purchased Plan Test (one-time only)
  const hasPurchasedPlanTest = useMemo(() => {
    return transactions.some(
      (tx) => tx.plan_name.toLowerCase() === 'plan test' && tx.status === 'APPROVED'
    );
  }, [transactions]);

  // Load Wompi and PayPal scripts
  useEffect(() => {
    const wompiScript = document.createElement('script');
    wompiScript.src = 'https://checkout.wompi.co/widget.js';
    wompiScript.async = true;
    document.body.appendChild(wompiScript);

    const paypalScript = document.createElement('script');
    paypalScript.src = `https://www.paypal.com/sdk/js?client-id=AeXaVZuG9yv06r4A76rml4liC333s1MK27iT-dP4r6K3mKnhlDDXNiwege5U7LXjPQfDHt15wN2y_eOM&vault=true&intent=subscription`;
    paypalScript.async = true;
    document.body.appendChild(paypalScript);

    return () => {
      if (document.body.contains(wompiScript)) document.body.removeChild(wompiScript);
      if (document.body.contains(paypalScript)) document.body.removeChild(paypalScript);
    };
  }, []);

  // Trigger Wompi payment after state has been updated
  useEffect(() => {
    if (triggerWompiPayment && pendingPaymentAmount > 0) {
      setTriggerWompiPayment(false);
      handleConfirmRenewSubscription();
    }
  }, [triggerWompiPayment, pendingPaymentAmount]);

  // Reset any applied coupon when the amount-shaping inputs change, so the
  // user doesn't see a stale discount mapped to a different amount.
  // Also reset when switching to PayPal (coupons are Wompi-only for now).
  useEffect(() => {
    setAppliedCoupon(null);
    setCouponInput("");
  }, [renewModal, selectedPlan.package, selectedPlan.plan, wantUpgrade, upgradeWhen, paymentMethod]);

  // Trigger PayPal payment after state has been updated
  useEffect(() => {
    if (triggerPayPalPayment && pendingPaymentUSD > 0) {
      setTriggerPayPalPayment(false);
      handlePayPalPayment();
    }
  }, [triggerPayPalPayment, pendingPaymentUSD]);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated()) {
        navigate("/auth");
        return;
      }

      try {
        // Fetch profile (includes user, company, roleConversia)
        const profileResponse = await api.profile.get();
        const profileData = profileResponse;

        if (!profileData) {
          toast({
            title: "Perfil incompleto",
            description: "Por favor completa tu registro.",
            variant: "destructive",
          });
          navigate("/auth?mode=register");
          return;
        }

        // Check role-based redirects
        const userRole = profileData.roleConversia;
        if (userRole === 'admin') {
          navigate("/admin");
          return;
        }
        if (userRole === 'support') {
          navigate("/support");
          return;
        }
        if (userRole === 'vendedor') {
          navigate("/seller");
          return;
        }

        setProfile(profileData as Profile);
        setEditForm({
          name: profileData.user?.name || "",
          phone: profileData.user?.phone ? String(profileData.user.phone) : "",
          address: profileData.user?.address || profileData.company?.address || "",
          documentType: profileData.user?.documentType || "",
          documentNumber: profileData.user?.documentNumber || "",
          nit: profileData.company?.nit || "",
          city: profileData.company?.city || "",
          country: profileData.company?.country || "",
        });

        // Fetch transactions
        const txData = await api.transactions.list();
        setTransactions((txData as Transaction[]) || []);

        // Fetch tickets
        const ticketData = await api.tickets.list();
        setTickets((ticketData as SupportTicket[]) || []);

        // Fetch plans from DB
        const plansData = await api.plans.list();
        const plans = Array.isArray(plansData) ? plansData : [];
        setDbPlans(plans);

        // Preselect current plan if exists
        const currentPlanId = profileData.company?.currentPlan;
        if (currentPlanId) {
          const currentPlan = plans.find((p: any) => p.id === currentPlanId);
          if (currentPlan) {
            setSelectedPlan(prev => ({ ...prev, package: currentPlan.slug }));
          }
        }

        // Fetch active subscription
        const subList = await api.subscriptions.list();
        const activeSub = Array.isArray(subList)
          ? subList.find((s: any) => s.status === 'active' || s.status === 'retrying') || null
          : null;
        setActiveSubscription(activeSub);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        navigate("/auth");
        return;
      }

      // Check for pending Wompi payment after redirect
      const pendingPayment = localStorage.getItem('pendingWompiPayment');
      if (pendingPayment) {
        try {
          const pending = JSON.parse(pendingPayment);
          localStorage.removeItem('pendingWompiPayment');

          // Verify transaction with Wompi by reference
          const wompiRes = await fetch(
            `https://production.wompi.co/v1/transactions?reference=${pending.reference}`,
            { headers: { Authorization: 'Bearer pub_prod_DQNOOAhNajTWFPuNX4hEoLuL1WAKeTS5' } }
          );
          const wompiData = await wompiRes.json();
          const wompiTx = wompiData?.data?.[0];

          if (wompiTx && wompiTx.status === 'APPROVED') {
            await api.transactions.success({
              email: pending.email,
              plan_name: pending.plan_name,
              ai_responses_included: pending.ai_responses_included,
              id_plan: pending.id_plan,
              amount: pending.amount,
              currency: pending.currency,
              reference: pending.reference,
              transaction_id: wompiTx.id,
              payment_method: wompiTx.payment_method?.type || 'CARD',
              transaction_date: new Date().toISOString(),
            });

            toast({
              title: "¡Pago exitoso!",
              description: `Tu plan ${pending.plan_name} ha sido activado.`,
            });

            // Refresh transactions
            const freshTx = await api.transactions.list();
            setTransactions((freshTx as Transaction[]) || []);
          } else if (wompiTx && wompiTx.status === 'PENDING') {
            toast({
              title: "Pago pendiente",
              description: "Tu pago está siendo procesado. Se actualizará automáticamente.",
            });
          }
        } catch (pendingErr) {
          console.error('Error checking pending payment:', pendingErr);
        }
      }

      // Check for pending PayPal payment after redirect
      const paypalParam = searchParams.get('paypal');
      const pendingPayPal = localStorage.getItem('pendingPayPalPayment');
      if (paypalParam === 'success' && pendingPayPal) {
        try {
          const pending = JSON.parse(pendingPayPal);
          localStorage.removeItem('pendingPayPalPayment');

          // Activate subscription
          const activateResult = await api.payments.paypalActivateSubscription({
            subscription_id: pending.subscription_id,
            plan_name: pending.plan_name,
            amount: pending.amount_usd,
            id_plan: pending.id_plan,
            ai_responses_included: pending.ai_responses_included,
            type: pending.type,
            email: pending.email,
          });

          if (activateResult.success) {
            toast({
              title: "¡Pago exitoso!",
              description: `Tu plan ${pending.plan_name} ha sido activado con PayPal.`,
            });

            // Refresh transactions and profile
            const freshTx = await api.transactions.list();
            setTransactions((freshTx as Transaction[]) || []);
            const freshProfile = await api.profile.get();
            setProfile(freshProfile as Profile);
          }
        } catch (paypalErr) {
          console.error('Error activating PayPal subscription:', paypalErr);
        }
      } else if (paypalParam === 'cancel') {
        localStorage.removeItem('pendingPayPalPayment');
        toast({
          title: "Pago cancelado",
          description: "Has cancelado el pago con PayPal.",
          variant: "destructive",
        });
      }

      setLoading(false);
    };

    checkAuth();
  }, [navigate, toast]);

  // Auto-sync transactions so invoices appear automatically without manual refresh
  useEffect(() => {
    if (!profile?.user?.id) return;

    let isActive = true;

    const refreshTransactions = async () => {
      try {
        const data = await api.transactions.list();
        if (isActive) {
          setTransactions((data as Transaction[]) || []);
        }
      } catch (error) {
        console.error("Error auto-refreshing transactions:", error);
      }
    };

    const intervalId = window.setInterval(refreshTransactions, 20000);

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
    };
  }, [profile?.user?.id]);

  // Handle PayPal return
  useEffect(() => {
    const paypalStatus = searchParams.get('paypal');
    const subscriptionId = searchParams.get('subscription_id');

    if (paypalStatus === 'success' && subscriptionId && profile) {
      const activatePayPal = async () => {
        try {
          const user = getUser();
          if (!user) return;

          const data = await api.payments.paypalActivateSubscription({
            subscription_id: subscriptionId,
            user_id: user.id,
          });

          if (data?.status === 'APPROVED') {
            toast({ title: "¡Pago exitoso!", description: "Tu suscripción PayPal ha sido activada." });
            const txData = await api.transactions.list();
            setTransactions((txData as Transaction[]) || []);

            const subList = await api.subscriptions.list();
            const activeSub = Array.isArray(subList)
              ? subList.find((s: any) => s.status === 'active' || s.status === 'retrying') || null
              : null;
            setActiveSubscription(activeSub);
          }
        } catch (err) {
          console.error('PayPal activation error:', err);
          toast({ title: "Error", description: "No se pudo activar la suscripción PayPal.", variant: "destructive" });
        }
        navigate('/dashboard', { replace: true });
      };
      activatePayPal();
    } else if (paypalStatus === 'cancelled') {
      toast({ title: "Pago cancelado", description: "Has cancelado el pago de PayPal." });
      navigate('/dashboard', { replace: true });
    }
  }, [searchParams, profile]);

  // Get available years from transactions
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    const currentYear = new Date().getFullYear();
    years.add(currentYear);
    years.add(currentYear - 1);
    
    transactions.forEach(tx => {
      const year = new Date(tx.created_at).getFullYear();
      years.add(year);
    });
    
    return Array.from(years).sort((a, b) => b - a);
  }, [transactions]);

  // Find the first transaction date to determine when tracking starts
  const firstTransactionDate = useMemo(() => {
    if (transactions.length === 0) return null;
    const sorted = [...transactions].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    return new Date(sorted[0].created_at);
  }, [transactions]);

  // Subscription status: months paid, paid-through date, last coupon usage, etc.
  const subscriptionStatus = useMemo(() => {
    const entryDateStr = profile?.company?.entryDate;
    if (!entryDateStr) return null;
    const entryDate = new Date(entryDateStr);

    // Match the admin's logic: count APPROVED non-upgrade transactions
    const approvedTxs = transactions.filter(tx => tx.status === "APPROVED" && tx.type !== "upgrade");
    const totalPayments = approvedTxs.length;
    if (totalPayments === 0) return { entryDate, totalPayments: 0, paidThrough: null as Date | null, daysLeft: 0, status: "inactive" as "paid" | "expiring" | "overdue" | "inactive", lastCouponTx: null as any };

    // Each approved payment extends coverage by 1 month from entryDate
    const paidThrough = new Date(entryDate);
    paidThrough.setMonth(paidThrough.getMonth() + totalPayments);

    const now = new Date();
    const daysLeft = Math.ceil((paidThrough.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    let status: "paid" | "expiring" | "overdue" | "inactive";
    if (daysLeft < 0) status = "overdue";
    else if (daysLeft <= 7) status = "expiring";
    else status = "paid";

    // Most recent transaction that used a coupon
    const lastCouponTx = [...approvedTxs]
      .filter((tx: any) => tx.id_coupon)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0] || null;

    return { entryDate, totalPayments, paidThrough, daysLeft, status, lastCouponTx };
  }, [profile, transactions]);

  // Monthly payment record for selected year (12 months)
  const monthlyPayments = useMemo(() => {
    if (!firstTransactionDate) return [];

    const months = [];
    const paidThrough = subscriptionStatus?.paidThrough || null;

    for (let i = 0; i < 12; i++) {
      const monthDate = new Date(selectedYear, 11 - i, 1);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);

      // Show months from the first transaction up to the paid-through month
      // (so prepaid future months are visible too)
      const lastVisibleEnd = paidThrough && paidThrough > new Date() ? paidThrough : new Date();
      if (monthStart < startOfMonth(firstTransactionDate) || monthStart > startOfMonth(lastVisibleEnd)) continue;

      const monthTransactions = transactions.filter(tx => {
        const txDate = new Date(tx.created_at);
        return isWithinInterval(txDate, { start: monthStart, end: monthEnd });
      });

      const hasPayment = monthTransactions.some(tx => tx.status === "APPROVED");
      // Covered = within paid-through window even if no transaction landed in this month
      const isCovered = !!paidThrough && monthStart <= paidThrough;

      months.push({
        date: monthDate,
        month: monthDate.getMonth(),
        year: monthDate.getFullYear(),
        hasPayment,
        isCovered,
        transactionCount: monthTransactions.length,
        approvedCount: monthTransactions.filter(tx => tx.status === "APPROVED").length
      });
    }

    return months.reverse();
  }, [transactions, selectedYear, firstTransactionDate]);

  // Get transactions for selected month
  const selectedMonthTransactions = useMemo(() => {
    if (!selectedMonth) return [];
    
    const monthStart = startOfMonth(new Date(selectedMonth.year, selectedMonth.month, 1));
    const monthEnd = endOfMonth(new Date(selectedMonth.year, selectedMonth.month, 1));
    
    return transactions.filter(tx => {
      const txDate = new Date(tx.created_at);
      return isWithinInterval(txDate, { start: monthStart, end: monthEnd });
    });
  }, [transactions, selectedMonth]);

  // Get unique plans from transactions for filter
  const availablePlans = useMemo(() => {
    const plans = new Set<string>();
    transactions.forEach(tx => {
      if (tx.plan_name) plans.add(tx.plan_name);
    });
    return Array.from(plans);
  }, [transactions]);

  // Get available months for filter
  const availableMonths = useMemo(() => {
    const months = new Map<string, { month: number; year: number; label: string }>();
    transactions.forEach(tx => {
      const date = new Date(tx.created_at);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!months.has(key)) {
        months.set(key, {
          month: date.getMonth(),
          year: date.getFullYear(),
          label: format(date, "MMMM yyyy", { locale: es })
        });
      }
    });
    return Array.from(months.values()).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
  }, [transactions]);

  // Filtered transactions for payments tab
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      // Filter by month
      if (paymentFilterMonth !== "all") {
        const [year, month] = paymentFilterMonth.split("-").map(Number);
        const txDate = new Date(tx.created_at);
        if (txDate.getFullYear() !== year || txDate.getMonth() !== month) {
          return false;
        }
      }
      
      // Filter by plan
      if (paymentFilterPlan !== "all" && tx.plan_name !== paymentFilterPlan) {
        return false;
      }
      
      // Filter by status
      if (paymentFilterStatus !== "all" && tx.status !== paymentFilterStatus) {
        return false;
      }
      
      return true;
    });
  }, [transactions, paymentFilterMonth, paymentFilterPlan, paymentFilterStatus]);

  const handleMonthClick = (month: number, year: number) => {
    setSelectedMonth({ month, year });
    setMonthDetailModal(true);
  };

  const handleLogout = () => {
    apiLogout();
  };

  const handleUpdateProfile = async () => {
    if (!profile) return;

    try {
      await api.profile.update({
        name: editForm.name || null,
        phone: editForm.phone ? Number(editForm.phone) : null,
        address: editForm.address || null,
        documentType: editForm.documentType || null,
        documentNumber: editForm.documentNumber || null,
        nit: editForm.nit || null,
        city: editForm.city || null,
        country: editForm.country || null,
      });
      toast({
        title: "Éxito",
        description: "Perfil actualizado correctamente"
      });
      setProfile(prev => prev ? {
        ...prev,
        user: {
          ...prev.user,
          name: editForm.name || prev.user.name,
          phone: editForm.phone ? Number(editForm.phone) : prev.user.phone,
          address: editForm.address || prev.user.address,
          documentType: editForm.documentType || prev.user.documentType,
          documentNumber: editForm.documentNumber || prev.user.documentNumber,
        },
        company: {
          ...prev.company,
          nit: editForm.nit || prev.company?.nit,
          city: editForm.city || prev.company?.city,
          country: editForm.country || prev.company?.country,
        }
      } : null);
      setInvoiceErrors([]);
      setEditProfileModal(false);

      // Si venía de validación de pago, continuar automáticamente
      if (pendingPaymentAfterEdit) {
        setPendingPaymentAfterEdit(false);
        toast({
          title: "Datos guardados",
          description: "Procesando tu pago...",
        });
        // Pequeño delay para que el perfil se actualice en el state
        setTimeout(() => initiateRenewSubscription(), 500);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil",
        variant: "destructive"
      });
    }
  };

  const handleCreateTicket = async () => {
    if (!profile || !newTicket.subject || !newTicket.description) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    try {
      await api.tickets.create({
        subject: newTicket.subject,
        description: newTicket.description,
        priority: newTicket.priority
      });

      toast({
        title: "Éxito",
        description: "Ticket de soporte creado correctamente"
      });

      // Refresh tickets
      const ticketData = await api.tickets.list();
      setTickets((ticketData as SupportTicket[]) || []);
      setNewTicket({ subject: "", description: "", priority: "medium" });
      setNewTicketModal(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el ticket",
        variant: "destructive"
      });
    }
  };

  const handleOpenTicket = async (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setViewTicketModal(true);
    setLoadingMessages(true);
    setNewMessage("");

    try {
      const messages = await api.tickets.messages(Number(ticket.id));
      setTicketMessages((messages as TicketMessage[]) || []);
    } catch (error) {
      console.error('Error loading ticket messages:', error);
      setTicketMessages([]);
    }
    setLoadingMessages(false);
  };

  const handleSendMessage = async () => {
    if (!selectedTicket || !newMessage.trim()) return;

    try {
      await api.tickets.sendMessage({
        ticket_id: selectedTicket.id,
        message: newMessage.trim(),
        is_from_support: false
      });

      setNewMessage("");
      // Refresh messages
      const messages = await api.tickets.messages(Number(selectedTicket.id));
      setTicketMessages((messages as TicketMessage[]) || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje",
        variant: "destructive"
      });
    }
  };

  const planMessagesMap: Record<string, number> = {
    'plan test': 250, starter: 250, mini: 500, basico: 1200, plus: 3500, enterprise: 7500,
  };

  const [showPayPalButtons, setShowPayPalButtons] = useState(false);
  const paypalContainerRef = useRef<HTMLDivElement>(null);

  const handlePayPalPayment = async () => {
    if (!profile) return;
    setRenewLoading(true);

    try {
      const selectedDbPlan = dbPlans.find(p => p.slug === selectedPlan.package);
      if (!selectedDbPlan) return;

      const user = getUser();
      const paypal = (window as any).paypal;
      if (!paypal) {
        toast({ title: "Error", description: "PayPal SDK no se ha cargado. Intenta de nuevo.", variant: "destructive" });
        setRenewLoading(false);
        return;
      }

      // First create the subscription plan in our backend
      const result = await api.payments.paypalCreateSubscription({
        plan_name: pendingPlanName,
        billing_period: selectedPlan.plan,
        amount_usd: pendingPaymentUSD,
        user_id: user?.id || profile.user.id,
        id_plan: selectedDbPlan.id,
        ai_responses_included: selectedDbPlan.messages,
        type: pendingTransactionType,
        return_url: `${window.location.origin}/dashboard`,
        cancel_url: `${window.location.origin}/dashboard`,
      });

      if (!result?.paypal_plan_id) {
        toast({ title: "Error", description: "No se pudo crear el plan en PayPal", variant: "destructive" });
        setRenewLoading(false);
        return;
      }

      // Show PayPal buttons container
      setShowPayPalButtons(true);
      setRenewLoading(false);

      // Wait for DOM to render the container
      setTimeout(() => {
        if (!paypalContainerRef.current) return;
        paypalContainerRef.current.innerHTML = '';

        paypal.Buttons({
          style: { shape: 'rect', color: 'gold', layout: 'vertical', label: 'subscribe' },
          createSubscription: (_data: any, actions: any) => {
            return actions.subscription.create({
              plan_id: result.paypal_plan_id,
            });
          },
          onApprove: async (data: any) => {
            console.log('PayPal approved:', data);
            setShowPayPalButtons(false);

            try {
              await api.payments.paypalActivateSubscription({
                subscription_id: data.subscriptionID,
                plan_name: pendingPlanName,
                amount: pendingPaymentUSD,
                id_plan: selectedDbPlan.id,
                ai_responses_included: selectedDbPlan.messages,
                type: pendingTransactionType,
                email: profile.user.email,
              });

              toast({
                title: "¡Pago exitoso!",
                description: `Tu plan ${pendingPlanName} ha sido activado con PayPal.`,
              });

              const freshTx = await api.transactions.list();
              setTransactions((freshTx as Transaction[]) || []);
              const freshProfile = await api.profile.get();
              setProfile(freshProfile as Profile);
              setRenewModal(false);
              setWantUpgrade(false);
            } catch (err) {
              console.error('PayPal activation error:', err);
              toast({ title: "Error", description: "El pago fue aprobado pero hubo un error al activar. Contacta soporte.", variant: "destructive" });
            }
          },
          onCancel: () => {
            setShowPayPalButtons(false);
            toast({ title: "Cancelado", description: "Has cancelado el pago con PayPal." });
          },
          onError: (err: any) => {
            console.error('PayPal button error:', err);
            setShowPayPalButtons(false);
            toast({ title: "Error", description: "Error en el pago con PayPal", variant: "destructive" });
          },
        }).render(paypalContainerRef.current);
      }, 100);

    } catch (error) {
      console.error('PayPal error:', error);
      toast({ title: "Error", description: "Error al procesar el pago con PayPal", variant: "destructive" });
      setRenewLoading(false);
    }
  };

  // Computes the current total COP amount that would be charged, based on the
  // current plan selection state. Mirrors the logic used inside the modal IIFE
  // and in initiateRenewSubscription so the coupon validator works with the
  // same number Wompi will charge.
  const computeCurrentCOPAmount = (): number => {
    const selectedDbPlan = dbPlans.find(p => p.slug === selectedPlan.package);
    if (!selectedDbPlan) return 0;

    const selectedPlanPrice = Number(selectedDbPlan.priceUSD);
    const currentPlanId = profile?.company?.currentPlan || null;
    const currentDbPlan = currentPlanId ? dbPlans.find(p => p.id === currentPlanId) : null;
    const currentPlanPrice = currentDbPlan ? Number(currentDbPlan.priceUSD) : 0;
    const isUpgradeNow = wantUpgrade && currentDbPlan && selectedPlanPrice > currentPlanPrice && upgradeWhen === 'now';

    const trm = exchangeRate?.rate ?? 4200;
    const isFixedCOP = !!selectedDbPlan.fixedPriceCOP;

    let chargeUSD = selectedPlanPrice;
    if (isUpgradeNow) chargeUSD = selectedPlanPrice - currentPlanPrice;

    const discountMap: Record<string, number> = { mensual: 0, semestral: 0.10, anual: 0.15 };
    const monthsMap: Record<string, number> = { mensual: 1, semestral: 6, anual: 12 };
    const discount = isUpgradeNow ? 0 : (discountMap[selectedPlan.plan] || 0);
    const months = isUpgradeNow ? 1 : (monthsMap[selectedPlan.plan] || 1);

    const monthlyPriceCOP = isFixedCOP ? selectedDbPlan.fixedPriceCOP : Math.round(chargeUSD * trm);
    const discountedMonthly = discount > 0 ? Math.round(monthlyPriceCOP * (1 - discount)) : monthlyPriceCOP;
    return discountedMonthly * months;
  };

  const handleApplyCouponRenew = async () => {
    if (!couponInput.trim()) return;
    const copAmount = computeCurrentCOPAmount();
    if (!copAmount || copAmount <= 0) {
      toast({ title: "Selecciona un plan primero", variant: "destructive" });
      return;
    }
    setValidatingCoupon(true);
    try {
      const res: any = await api.coupons.validate(
        couponInput.trim().toUpperCase(),
        copAmount,
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
    } catch (err: any) {
      const msg = err?.message || "No se pudo aplicar el cupón";
      toast({ title: "Cupón inválido", description: msg, variant: "destructive" });
      setAppliedCoupon(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const removeAppliedCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
  };

  const initiateRenewSubscription = async () => {
    // Validar datos de facturación antes de cobrar
    try {
      const validation = await api.payments.validateInvoiceData();
      if (validation && !validation.valid) {
        setInvoiceErrors(validation.errors || []);
        setPendingPaymentAfterEdit(true);
        setEditProfileModal(true);
        toast({
          title: "Datos de facturación incompletos",
          description: "Completa los datos y guarda para continuar con el pago.",
          variant: "destructive",
        });
        return;
      }
    } catch (err) {
      console.error('Invoice validation error:', err);
    }

    const selectedDbPlan = dbPlans.find(p => p.slug === selectedPlan.package);
    if (!selectedDbPlan) return;

    const selectedPlanPrice = Number(selectedDbPlan.priceUSD);
    const selectedPlanName = selectedDbPlan.name;

    // Detect current plan for upgrade detection
    const currentPlanId = profile?.company?.currentPlan || null;
    const currentDbPlan = currentPlanId ? dbPlans.find(p => p.id === currentPlanId) : null;
    const currentPlanPrice = currentDbPlan ? Number(currentDbPlan.priceUSD) : 0;
    const isUpgradeNow = wantUpgrade && currentDbPlan && selectedPlanPrice > currentPlanPrice && upgradeWhen === 'now';

    const trm = exchangeRate?.rate ?? 4200;
    const isFixedCOP = !!selectedDbPlan.fixedPriceCOP;

    let chargeUSD = selectedPlanPrice;
    if (isUpgradeNow) {
      chargeUSD = selectedPlanPrice - currentPlanPrice;
    }

    const discountMap: Record<string, number> = { mensual: 0, semestral: 0.10, anual: 0.15 };
    const monthsMap: Record<string, number> = { mensual: 1, semestral: 6, anual: 12 };
    const discount = isUpgradeNow ? 0 : (discountMap[selectedPlan.plan] || 0);
    const months = isUpgradeNow ? 1 : (monthsMap[selectedPlan.plan] || 1);

    const monthlyPriceCOP = isFixedCOP ? selectedDbPlan.fixedPriceCOP : Math.round(chargeUSD * trm);
    const discountedMonthly = discount > 0 ? Math.round(monthlyPriceCOP * (1 - discount)) : monthlyPriceCOP;
    const amount = discountedMonthly * months;

    const suffixMap: Record<string, string> = { mensual: " - Mensual", semestral: " - Semestral", anual: " - Anual" };

    setPendingPaymentAmount(amount);
    setPendingPlanName(isUpgradeNow ? `Upgrade a ${selectedPlanName}` : selectedPlanName + (suffixMap[selectedPlan.plan] || " - Mensual"));
    setPendingPaymentUSD(Math.round(chargeUSD * (1 - discount) * months * 100) / 100);
    setPendingTransactionType(isUpgradeNow ? 'upgrade' : 'renewal');

    // Trigger payment based on selected method
    if (paymentMethod === 'paypal') {
      setTriggerPayPalPayment(true);
    } else {
      setTriggerWompiPayment(true);
    }
  };

  const handleConfirmRenewSubscription = async () => {
    if (!profile) return;

    const user = getUser();
    if (!user) return;

    setConfirmPaymentModal(false);
    setRenewLoading(true);

    try {
      const reference = `renewal-${selectedPlan.package}-${selectedPlan.plan}-${Date.now()}`;
      // If a coupon is applied, charge the discounted final amount
      const effectiveAmount = appliedCoupon ? appliedCoupon.finalAmount : pendingPaymentAmount;
      const currencyCode = 'COP';
      const selectedDbPlanForFlow = dbPlans.find(p => p.slug === selectedPlan.package);

      // 100% coupon path: skip Wompi, activate plan via redeem-free endpoint
      if (appliedCoupon && effectiveAmount === 0) {
        try {
          await api.payments.redeemFreeCoupon({
            couponCode: appliedCoupon.code,
            planName: pendingPlanName,
            idPlan: selectedDbPlanForFlow?.id || null,
            aiResponsesIncluded: selectedDbPlanForFlow?.messages || 250,
            type: pendingTransactionType,
            currency: currencyCode,
            planPriceAmount: pendingPaymentAmount,
            reference,
          });
          toast({
            title: "¡Plan activado!",
            description: `Tu plan ${pendingPlanName} se activó gratis con el cupón ${appliedCoupon.code}.`,
          });
          const txData = await api.transactions.list();
          setTransactions((txData as Transaction[]) || []);
          const freshProfile = await api.profile.get();
          setProfile(freshProfile as Profile);
          setRenewModal(false);
          setWantUpgrade(false);
          setRenewLoading(false);
          return;
        } catch (err: any) {
          toast({
            title: "No se pudo activar el cupón",
            description: err?.message || "Intenta de nuevo o usa otro método.",
            variant: "destructive",
          });
          setRenewLoading(false);
          return;
        }
      }

      const priceInCents = Math.round(effectiveAmount * 100);

      // Get Wompi signature
      const signatureData = await api.payments.wompiSignature({
        reference,
        amountInCents: priceInCents,
        currency: currencyCode
      });

      // Create pending transaction in DB (backend validates + applies coupon)
      const selectedDbPlan = dbPlans.find(p => p.slug === selectedPlan.package);
      const aiResponses = selectedDbPlan?.messages || 250;
      const idPlan = selectedDbPlan?.id || null;
      try {
        await api.transactions.createPending({
          reference,
          plan_name: pendingPlanName,
          ai_responses_included: aiResponses,
          amount: pendingPaymentAmount, // send the ORIGINAL amount; backend computes discount
          currency: currencyCode,
          type: pendingTransactionType,
          id_plan: idPlan,
          coupon_code: appliedCoupon?.code,
        });
      } catch (txError: any) {
        if (appliedCoupon) {
          const msg = txError?.message || "El cupón ya no es válido. Intenta de nuevo sin cupón.";
          toast({ title: "No se pudo aplicar el cupón", description: msg, variant: "destructive" });
          setRenewLoading(false);
          return;
        }
        throw txError;
      }

      // Save pending payment info in localStorage (for redirect recovery)
      localStorage.setItem('pendingWompiPayment', JSON.stringify({
        reference,
        plan_name: pendingPlanName,
        ai_responses_included: aiResponses,
        id_plan: idPlan,
        amount: effectiveAmount,
        currency: currencyCode,
        email: profile.user.email,
      }));

      const checkout = new (window as any).WidgetCheckout({
        currency: currencyCode,
        amountInCents: priceInCents,
        reference: reference,
        publicKey: signatureData.publicKey,
        signature: { integrity: signatureData.signature },
        redirectUrl: `${window.location.origin}/dashboard`,
        customerData: {
          email: profile.user.email,
          fullName: profile.company?.name || profile.user.name,
        },
      });

      checkout.open(async (result: any) => {
        const transaction = result.transaction;
        console.log('Transaction result:', transaction);

        // Clear pending payment
        localStorage.removeItem('pendingWompiPayment');

        // Update transaction status in DB
        await api.transactions.update({
          reference: reference,
          status: transaction.status,
          wompi_transaction_id: transaction.id,
          payment_method: transaction.paymentMethod?.type || 'CARD',
        });

        if (transaction.status === 'APPROVED') {
          // If upgrade for next cycle, save nextPlan
          if (pendingTransactionType === 'renewal' && wantUpgrade && upgradeWhen === 'next') {
            const upgradePlan = dbPlans.find(p => p.slug === selectedPlan.package);
            if (upgradePlan) {
              await api.company.setNextPlan(upgradePlan.id);
            }
          }

          toast({
            title: "¡Pago exitoso!",
            description: pendingTransactionType === 'upgrade'
              ? `Tu plan ha sido actualizado a ${pendingPlanName.replace('Upgrade a ', '')}.`
              : wantUpgrade && upgradeWhen === 'next'
                ? `Pago registrado. Tu plan cambiará en el próximo corte.`
                : `Tu plan ${pendingPlanName} ha sido renovado.`,
          });

          // Refresh transactions and profile
          const txData = await api.transactions.list();
          setTransactions((txData as Transaction[]) || []);
          const freshProfile = await api.profile.get();
          setProfile(freshProfile as Profile);
          setRenewModal(false);
          setWantUpgrade(false);

          // Ask user to save card for automatic billing
          setTokenizeModal(true);
        } else if (transaction.status === 'DECLINED') {
          toast({
            title: "Pago rechazado",
            description: "Por favor intenta con otro método de pago.",
            variant: "destructive",
          });
        } else if (transaction.status === 'PENDING') {
          toast({
            title: "Pago pendiente",
            description: "Tu pago está siendo procesado.",
          });
        }
      });

    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Error",
        description: "No se pudo procesar el pago. Intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setRenewLoading(false);
    }
  };

  const handlePayPalRenewal = async () => {
    setPaymentMethodModal(false);
    setRenewLoading(true);

    try {
      const user = getUser();
      if (!user) return;

      const monthlyPricesUSD: Record<string, number> = {
        starter: 15, mini: 29, basico: 59, plus: 99, enterprise: 199
      };
      const fixedCOPPrices: Record<string, number> = {
        'plan test': 1500
      };
      const fixedUSDPrices: Record<string, number> = {
        'plan test': 0.39
      };
      const planDisplayNames: Record<string, string> = {
        'plan test': 'Plan Test',
        starter: 'Starter',
        mini: 'Mini',
        basico: 'Básico',
        plus: 'Plus',
        enterprise: 'Enterprise',
      };
      const discountMap = { mensual: 0, semestral: 0.10, anual: 0.15 };
      const discount = discountMap[selectedPlan.plan];

      let monthlyUSD: number;
      if (fixedUSDPrices[selectedPlan.package]) {
        monthlyUSD = fixedUSDPrices[selectedPlan.package];
      } else if (fixedCOPPrices[selectedPlan.package]) {
        const trm = exchangeRate?.rate ?? 4200;
        monthlyUSD = Math.ceil((fixedCOPPrices[selectedPlan.package] / trm) * 100) / 100;
      } else {
        monthlyUSD = monthlyPricesUSD[selectedPlan.package] || 29;
      }
      const discountedMonthly = Math.round(monthlyUSD * (1 - discount) * 100) / 100;

      const basePlanName = planDisplayNames[selectedPlan.package] || selectedPlan.package;

      const data = await api.payments.paypalCreateSubscription({
        plan_name: basePlanName,
        billing_period: selectedPlan.plan,
        amount_usd: discountedMonthly,
        user_id: user.id,
        return_url: `${window.location.origin}/dashboard?paypal=success`,
        cancel_url: `${window.location.origin}/dashboard?paypal=cancelled`,
      });

      if (!data?.approval_url) throw new Error('No se recibió URL de aprobación');

      window.open(data.approval_url, '_blank');
    } catch (error) {
      console.error('PayPal renewal error:', error);
      toast({ title: "Error", description: "No se pudo procesar el pago con PayPal.", variant: "destructive" });
    } finally {
      setRenewLoading(false);
    }
  };

  const handleWompiRenewal = () => {
    setPaymentMethodModal(false);
    handleConfirmRenewSubscription();
  };

  const handleTokenizeCard = async () => {
    if (!profile) return;

    const user = getUser();
    if (!user) return;

    setTokenizingCard(true);

    try {
      // Get Wompi public key
      const signatureData = await api.payments.wompiSignature({
        reference: 'temp', amountInCents: 100, currency: 'COP'
      });

      // Open Wompi widget in tokenization mode
      const tokenizeForm = document.createElement('form');
      tokenizeForm.style.display = 'none';
      const script = document.createElement('script');
      script.src = 'https://checkout.wompi.co/widget.js';
      script.setAttribute('data-render', 'button');
      script.setAttribute('data-widget-operation', 'tokenize');
      script.setAttribute('data-public-key', signatureData.publicKey);
      tokenizeForm.appendChild(script);
      document.body.appendChild(tokenizeForm);

      // Use the WidgetCheckout in tokenize mode
      const checkout = new (window as any).WidgetCheckout({
        publicKey: signatureData.publicKey,
        widgetOperation: 'tokenize',
      });

      checkout.open(async (result: any) => {
        console.log('Tokenization result:', result);

        if (result.token && result.token.id) {
          // Send token to backend to create payment source and subscription
          const billingPeriod = pendingPlanName.toLowerCase().includes('anual') ? 'anual' : pendingPlanName.toLowerCase().includes('semestral') ? 'semestral' : 'mensual';

          try {
            const tokenizeData = await api.payments.tokenizeCard({
              card_token: result.token.id,
              plan_name: pendingPlanName,
              amount: pendingPaymentAmount,
              currency: 'COP',
              billing_period: billingPeriod,
            });

            setActiveSubscription(tokenizeData.subscription);
            toast({
              title: "¡Tarjeta guardada!",
              description: "Tu plan se comprará automáticamente cada mes.",
            });
          } catch (tokenizeError) {
            console.error('Tokenization error:', tokenizeError);
            toast({
              title: "Error",
              description: "No se pudo guardar la tarjeta para cobro automático.",
              variant: "destructive",
            });
          }
        }

        setTokenizeModal(false);
        setTokenizingCard(false);
        // Clean up
        if (document.body.contains(tokenizeForm)) {
          document.body.removeChild(tokenizeForm);
        }
      });
    } catch (error) {
      console.error('Tokenization error:', error);
      toast({
        title: "Error",
        description: "No se pudo configurar el cobro automático.",
        variant: "destructive",
      });
      setTokenizingCard(false);
      setTokenizeModal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src={logoSoyAgentia} alt="SoyAgentia" className="h-10 object-contain rounded-xl" />
            </Link>
            <nav className="flex items-center gap-1">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  {t('nav.home')}
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/#planes" onClick={(e) => {
                  e.preventDefault();
                  navigate('/');
                  setTimeout(() => {
                    document.getElementById('planes')?.scrollIntoView({ behavior: 'instant' as ScrollBehavior });
                  }, 100);
                }} className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  {t('nav.pricing')}
                </Link>
              </Button>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              {t('dash.signOut')}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {t('dash.hello')}, {profile?.user?.name}
            </h1>
            <p className="text-muted-foreground">
              {t('dash.welcome')}
            </p>
          </div>

          {/* Configure AI Agent Button - shows when there's a payment */}
          {transactions.some(tx => tx.status === 'APPROVED' || tx.status === 'PENDING') && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Button
                variant="default"
                size="lg"
                className="w-full text-lg font-bold py-6"
                onClick={() => setConfigAgentModal(true)}
              >
                <Bot className="w-6 h-6 mr-2" />
                🚀 ¡Configura tu Agente de IA AQUÍ! 🚀
              </Button>
            </motion.div>
          )}

          {/* Config Agent Modal */}
          <Dialog open={configAgentModal} onOpenChange={setConfigAgentModal}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-center text-xl">🤖 Configura tu Agente de IA</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-center py-4">
                <p className="text-muted-foreground">
                  Una vez verificado tu pago, por favor valida tu correo electrónico y establece una contraseña en nuestra plataforma.
                </p>
                <p className="text-muted-foreground">
                  Si ya lo hiciste, ingresa directamente:
                </p>
                <Button
                  variant="default"
                  size="lg"
                  className="w-full"
                  onClick={async () => {
                    try {
                      const result = await api.sso.generateCode();
                      if (result?.code) {
                        window.open(`https://www.ia.soyagentia.com/authentication/auto-login?code=${result.code}&source=conversia`, '_blank');
                      }
                    } catch (err) {
                      console.error('SSO error:', err);
                      window.open('https://www.ia.soyagentia.com/authentication/login', '_blank');
                    }
                  }}
                >
                  🚀 Ingresar a la Plataforma
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 max-w-3xl">
              <TabsTrigger value="overview">{t('dash.overview')}</TabsTrigger>
              <TabsTrigger value="payments">{t('dash.payments')}</TabsTrigger>
              <TabsTrigger value="invoices">{t('dash.invoices')}</TabsTrigger>
              <TabsTrigger value="profile">{t('dash.profile')}</TabsTrigger>
              <TabsTrigger value="coupons">Cupones</TabsTrigger>
              <TabsTrigger value="support">{t('dash.support')}</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Profile Card */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      {profile?.company ? (
                        <Building2 className="w-8 h-8 text-primary-foreground" />
                      ) : (
                        <User className="w-8 h-8 text-primary-foreground" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">
                        {profile?.user?.name}
                      </h2>
                      {profile?.company?.name && (
                        <p className="text-muted-foreground">{profile.company.name}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Dialog open={renewModal} onOpenChange={setRenewModal}>
                      <DialogTrigger asChild>
                        <Button variant="default">
                          <CreditCard className="w-4 h-4 mr-2" />
                          {profile?.company?.currentPlan ? 'Renovar Suscripción' : t('dash.buyPlan')}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{profile?.company?.currentPlan ? 'Renovar / Cambiar Plan' : t('dash.buyPlan')}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          {(() => {
                            const allPlans = dbPlans.map(p => ({
                              id: p.id,
                              key: p.slug,
                              name: p.name,
                              messages: p.messages,
                              priceUSD: Number(p.priceUSD),
                              fixedPriceCOP: p.fixedPriceCOP,
                              isTrial: p.isTrial === 1,
                              trialDays: p.trialDays,
                            }));

                            const currentPlanId = profile?.company?.currentPlan || null;
                            const currentPlanObj = currentPlanId ? allPlans.find(p => p.id === currentPlanId) : null;
                            const currentPlanPrice = currentPlanObj?.priceUSD || 0;
                            const currentPlanMessages = profile?.company?.counterMessages || currentPlanObj?.messages || 0;
                            const isFirstPurchase = !currentPlanObj;

                            const selectedPlanObj = allPlans.find(p => p.key === selectedPlan.package);
                            const selectedPlanPrice = selectedPlanObj?.priceUSD || 0;
                            const selectedPlanMessages = selectedPlanObj?.messages || 0;

                            const isDifferentPlan = currentPlanObj && selectedPlanObj && selectedPlanObj.id !== currentPlanObj.id;
                            const isHigherPlan = isDifferentPlan && selectedPlanPrice > currentPlanPrice;
                            const isLowerPlan = isDifferentPlan && selectedPlanPrice < currentPlanPrice;

                            // Upgrade NOW = pay difference, upgrade NEXT = pay full (renewal with new plan)
                            const isUpgradeNow = wantUpgrade && isHigherPlan && upgradeWhen === 'now';
                            const isUpgradeNext = wantUpgrade && isHigherPlan && upgradeWhen === 'next';

                            const discountMap2: Record<string, number> = { mensual: 0, semestral: 0.10, anual: 0.15 };
                            const monthsMap2: Record<string, number> = { mensual: 1, semestral: 6, anual: 12 };
                            const discount = isUpgradeNow ? 0 : (discountMap2[selectedPlan.plan] || 0);
                            const months = isUpgradeNow ? 1 : (monthsMap2[selectedPlan.plan] || 1);

                            let chargeUSD = selectedPlanPrice;
                            if (isUpgradeNow) {
                              chargeUSD = selectedPlanPrice - currentPlanPrice;
                            }
                            const discountedMonthly = discount > 0 ? Math.round(chargeUSD * (1 - discount) * 100) / 100 : chargeUSD;
                            const totalPrice = Math.round(discountedMonthly * months * 100) / 100;
                            const periodLabel = selectedPlan.plan === "anual" ? t('dash.for12Months') : selectedPlan.plan === "semestral" ? t('dash.for6Months') : t('dash.for1Month');

                            return (
                              <>
                                {/* Current plan info */}
                                {currentPlanObj && (
                                  <div className="bg-secondary/50 border border-border rounded-lg p-4">
                                    <div className="text-sm text-muted-foreground mb-1">Tu plan actual</div>
                                    <div className="flex justify-between items-center">
                                      <span className="font-bold text-lg">{currentPlanObj.name}</span>
                                      <span className="text-sm">{currentPlanMessages.toLocaleString('es-CO')} mensajes · ${currentPlanPrice} USD/mes</span>
                                    </div>
                                  </div>
                                )}

                                {/* Upgrade checkbox - only if has current plan */}
                                {currentPlanObj && (
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={wantUpgrade}
                                      onChange={(e) => {
                                        setWantUpgrade(e.target.checked);
                                        if (!e.target.checked) {
                                          // Reset to current plan
                                          setSelectedPlan(prev => ({ ...prev, package: currentPlanObj.key }));
                                        }
                                      }}
                                      className="accent-primary w-4 h-4"
                                    />
                                    <span className="font-medium text-sm">Mejorar plan</span>
                                  </label>
                                )}

                                {/* Plan selector - show when upgrading or first purchase */}
                                {(isFirstPurchase || wantUpgrade) && (
                                  <div>
                                    <Label>{isFirstPurchase ? t('dash.package') : 'Selecciona el nuevo plan'}</Label>
                                    <Select
                                      value={selectedPlan.package}
                                      onValueChange={(val) => setSelectedPlan(prev => ({ ...prev, package: val }))}
                                    >
                                      <SelectTrigger className="mt-1">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {isFirstPurchase && (
                                          <SelectItem value="plan-test" disabled={hasPurchasedPlanTest}>
                                            Plan Test (250 resp/7 días){hasPurchasedPlanTest ? ' ✓ Ya adquirido' : ''}
                                          </SelectItem>
                                        )}
                                        {allPlans.filter(p => !p.isTrial).map(p => (
                                          <SelectItem key={p.key} value={p.key} disabled={wantUpgrade && p.priceUSD <= currentPlanPrice}>
                                            {p.name} ({p.messages.toLocaleString('es-CO')} resp/mes) - ${p.priceUSD} USD
                                            {wantUpgrade && p.priceUSD > currentPlanPrice ? ' ↑' : ''}
                                            {currentPlanObj && p.id === currentPlanObj.id ? ' (actual)' : ''}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                )}

                                {/* When to apply - only when upgrading to higher plan */}
                                {wantUpgrade && isHigherPlan && (
                                  <div>
                                    <Label>¿Cuándo quieres que aplique?</Label>
                                    <div className="flex gap-3 mt-2">
                                      <label className={`flex items-center gap-2 border rounded-lg px-4 py-3 cursor-pointer flex-1 ${upgradeWhen === 'now' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                                        <input type="radio" name="upgradeWhen" value="now" checked={upgradeWhen === 'now'} onChange={() => setUpgradeWhen('now')} className="accent-primary" />
                                        <div>
                                          <span className="font-medium text-sm block">Ahora</span>
                                          <span className="text-xs text-muted-foreground">Pagas ${(selectedPlanPrice - currentPlanPrice).toFixed(2)} USD (diferencia)</span>
                                        </div>
                                      </label>
                                      <label className={`flex items-center gap-2 border rounded-lg px-4 py-3 cursor-pointer flex-1 ${upgradeWhen === 'next' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                                        <input type="radio" name="upgradeWhen" value="next" checked={upgradeWhen === 'next'} onChange={() => setUpgradeWhen('next')} className="accent-primary" />
                                        <div>
                                          <span className="font-medium text-sm block">Próximo corte</span>
                                          <span className="text-xs text-muted-foreground">Pagas ${selectedPlanPrice} USD (completo)</span>
                                        </div>
                                      </label>
                                    </div>
                                  </div>
                                )}

                                {/* Downgrade notice */}
                                {wantUpgrade && isLowerPlan && (
                                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-sm">
                                    <span className="font-medium text-yellow-600">No puedes bajar de plan desde aquí</span>
                                    <p className="text-muted-foreground mt-1">
                                      Para bajar de plan, selecciona un plan superior o renueva tu plan actual.
                                    </p>
                                  </div>
                                )}

                                {/* Period selector - only for renewals (not upgrade now) */}
                                {!isUpgradeNow && (
                                  <div>
                                    <Label>{t('dash.planType')}</Label>
                                    <Select
                                      value={selectedPlan.plan}
                                      onValueChange={(val: "mensual" | "semestral" | "anual") => setSelectedPlan(prev => ({ ...prev, plan: val }))}
                                    >
                                      <SelectTrigger className="mt-1">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="mensual">{t('dash.monthly')}</SelectItem>
                                        <SelectItem value="semestral">{t('dash.semiannual')}</SelectItem>
                                        <SelectItem value="anual">{t('dash.annual')}</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                )}

                                {/* Price summary */}
                                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 space-y-2">
                                  {isUpgradeNow ? (
                                    <>
                                      <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">{selectedPlanObj?.name}</span>
                                        <span>${selectedPlanPrice} USD</span>
                                      </div>
                                      <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">- {currentPlanObj?.name} (plan actual)</span>
                                        <span>-${currentPlanPrice} USD</span>
                                      </div>
                                      <div className="border-t border-border pt-2 mt-2">
                                        <div className="flex justify-between items-center">
                                          <span className="font-medium">{t('dash.totalToPay')}</span>
                                          <span className="text-xl font-bold text-primary">${totalPrice} USD</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground text-right">Diferencia de upgrade · Aplica inmediatamente</p>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">{t('dash.monthlyPrice')}</span>
                                        <span className={discount > 0 ? "line-through text-muted-foreground" : "font-bold"}>
                                          ${Math.round(selectedPlanPrice)} USD
                                        </span>
                                      </div>
                                      {discount > 0 && (
                                        <div className="flex justify-between items-center text-accent">
                                          <span>{t('dash.youSave')}</span>
                                          <span className="font-semibold">{Math.round(discount * 100)}%</span>
                                        </div>
                                      )}
                                      <div className="border-t border-border pt-2 mt-2">
                                        <div className="flex justify-between items-center">
                                          <span className="font-medium">{t('dash.totalToPay')}</span>
                                          <span className="text-xl font-bold text-primary">${totalPrice} USD</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground text-right">{periodLabel}</p>
                                      </div>
                                    </>
                                  )}
                                </div>

                                {hasPurchasedPlanTest && selectedPlan.package === 'plan-test' && (
                                  <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive">
                                    Ya has adquirido el Plan Test anteriormente. Este plan solo se puede comprar una vez.
                                  </div>
                                )}

                                {/* Coupon section (only applies to Wompi / COP) */}
                                {paymentMethod === 'wompi' ? (
                                  <div className="border border-border rounded-lg p-3 space-y-2">
                                    <Label className="flex items-center gap-2 text-sm">
                                      <Tag className="w-4 h-4 text-primary" />
                                      ¿Tienes un código de cupón?
                                    </Label>
                                    {appliedCoupon ? (
                                      <>
                                        <div className="flex items-center justify-between bg-primary/10 border border-primary/30 rounded-md px-3 py-2">
                                          <div>
                                            <div className="font-mono text-sm font-semibold">{appliedCoupon.code}</div>
                                            <div className="text-xs text-muted-foreground">
                                              Descuento: -${appliedCoupon.discountAmount.toLocaleString("es-CO")} COP
                                            </div>
                                          </div>
                                          <Button size="sm" variant="ghost" onClick={removeAppliedCoupon} className="text-destructive hover:text-destructive">
                                            Quitar
                                          </Button>
                                        </div>
                                        <div className="flex justify-between items-center pt-1 text-sm">
                                          <span className="font-medium">Total a pagar en COP:</span>
                                          <span className="text-lg font-bold text-primary">
                                            ${appliedCoupon.finalAmount.toLocaleString("es-CO")} COP
                                          </span>
                                        </div>
                                      </>
                                    ) : (
                                      <div className="flex gap-2">
                                        <Input
                                          placeholder="Ingresa tu código"
                                          value={couponInput}
                                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleApplyCouponRenew(); } }}
                                          className="uppercase"
                                          disabled={validatingCoupon}
                                        />
                                        <Button
                                          onClick={handleApplyCouponRenew}
                                          disabled={!couponInput.trim() || validatingCoupon}
                                          variant="outline"
                                        >
                                          {validatingCoupon ? "..." : "Aplicar"}
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                ) : null}

                                {/* Payment method selector */}
                                <div>
                                  <Label>Método de pago</Label>
                                  <div className="flex gap-3 mt-2">
                                    <label className={`flex items-center gap-2 border rounded-lg px-4 py-3 cursor-pointer flex-1 ${paymentMethod === 'wompi' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                                      <input type="radio" name="paymentMethod" value="wompi" checked={paymentMethod === 'wompi'} onChange={() => { setPaymentMethod('wompi'); setShowPayPalButtons(false); }} className="accent-primary" />
                                      <span className="font-medium text-sm">Wompi</span>
                                      <span className="text-xs text-muted-foreground">(COP)</span>
                                    </label>
                                    <label className={`flex items-center gap-2 border rounded-lg px-4 py-3 cursor-pointer flex-1 ${paymentMethod === 'paypal' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                                      <input type="radio" name="paymentMethod" value="paypal" checked={paymentMethod === 'paypal'} onChange={() => setPaymentMethod('paypal')} className="accent-primary" />
                                      <span className="font-medium text-sm">PayPal</span>
                                      <span className="text-xs text-muted-foreground">(USD)</span>
                                    </label>
                                  </div>
                                </div>

                                {/* PayPal buttons container */}
                                {showPayPalButtons && (
                                  <div ref={paypalContainerRef} className="w-full min-h-[150px]" />
                                )}

                                {!showPayPalButtons && (
                                <Button
                                  onClick={initiateRenewSubscription}
                                  className="w-full"
                                  variant="default"
                                  disabled={renewLoading || (wantUpgrade && isLowerPlan) || (hasPurchasedPlanTest && selectedPlan.package === 'plan-test')}
                                >
                                  {renewLoading ? (
                                    <>
                                      <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                                      {t('dash.processing')}
                                    </>
                                  ) : (
                                    <>
                                      <CreditCard className="w-4 h-4 mr-2" />
                                      {isUpgradeNow
                                        ? `Subir a ${selectedPlanObj?.name} ahora`
                                        : isUpgradeNext
                                          ? `Renovar con ${selectedPlanObj?.name}`
                                          : wantUpgrade && !isDifferentPlan
                                            ? 'Selecciona un plan superior'
                                            : isFirstPurchase
                                              ? t('dash.buy')
                                              : 'Renovar plan'}
                                    </>
                                  )}
                                </Button>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>

              {/* Platform Showcase for new users */}
              {transactions.length === 0 && (
                <div className="glass-card p-6 overflow-hidden">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">
                      {t('dash.agentWaiting')}
                    </h3>
                    <p className="text-muted-foreground max-w-lg mx-auto">
                      {t('dash.agentWaitingDesc')}
                    </p>
                  </div>
                  <DashboardShowcase />
                  <div className="text-center mt-6">
                    <Button variant="default" size="lg" onClick={() => setRenewModal(true)}>
                      <CreditCard className="w-5 h-5 mr-2" />
                      {t('dash.buyPlanNow')}
                    </Button>
                  </div>
                </div>
              )}

              {/* Subscription Status Card */}
              {activeSubscription && (
                <div className="glass-card p-6">
                  <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
                    <CreditCard className="w-5 h-5" />
                    {t('dash.autoSubscription')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-secondary/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">{t('dash.status')}</p>
                      <p className={`font-bold ${
                        activeSubscription.status === 'active' ? 'text-green-500' :
                        activeSubscription.status === 'retrying' ? 'text-yellow-500' :
                        'text-red-500'
                      }`}>
                        {activeSubscription.status === 'active' ? t('dash.active') :
                         activeSubscription.status === 'retrying' ? t('dash.retrying') :
                         t('dash.cancelled')}
                      </p>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">{t('dash.plan')}</p>
                      <p className="font-bold">{activeSubscription.plan_name}</p>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">{t('dash.nextBilling')}</p>
                      <p className="font-bold">
                        {format(new Date(activeSubscription.next_billing_date), "dd MMM yyyy", { locale: dateLocale })}
                      </p>
                    </div>
                  </div>
                  {activeSubscription.suspended_at && (
                    <div className="mt-4 bg-destructive/10 border border-destructive/20 rounded-lg p-4 space-y-3">
                      <p className="text-destructive font-medium">
                        {t('dash.suspendedMsg')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t('dash.updateCardMsg')}
                      </p>
                      <Button 
                        variant="default" 
                        onClick={() => {
                          setPendingPlanName(activeSubscription.plan_name);
                          setPendingPaymentAmount(activeSubscription.amount);
                          handleTokenizeCard();
                        }}
                        disabled={tokenizingCard}
                        className="w-full"
                      >
                        {tokenizingCard ? (
                          <>
                            <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                            {t('dash.updating')}
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            {t('dash.updateCardReactivate')}
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                  {!activeSubscription.suspended_at && activeSubscription.status === 'retrying' && (
                    <div className="mt-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 space-y-3">
                      <p className="text-yellow-600 font-medium">
                        {t('dash.retryingMsg')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t('dash.cardIssueMsg')}
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setPendingPlanName(activeSubscription.plan_name);
                          setPendingPaymentAmount(activeSubscription.amount);
                          handleTokenizeCard();
                        }}
                        disabled={tokenizingCard}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        {t('dash.changeCard')}
                      </Button>
                    </div>
                  )}
                  {activeSubscription.retry_count > 0 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {t('dash.chargeAttempts')} {activeSubscription.retry_count}/{activeSubscription.max_retries}
                    </p>
                  )}
                </div>
              )}

              {/* Subscription Status Widget */}
              {subscriptionStatus && subscriptionStatus.totalPayments > 0 && subscriptionStatus.paidThrough && (
                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-primary" />
                    <h3 className="text-xl font-semibold">Estado de tu suscripción</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-secondary/40 border border-border rounded-lg p-4">
                      <div className="text-sm text-muted-foreground mb-1">Plan pago hasta</div>
                      <div className="text-lg font-bold text-primary">
                        {format(subscriptionStatus.paidThrough, "dd MMM yyyy", { locale: dateLocale })}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {subscriptionStatus.status === "paid" && `${subscriptionStatus.daysLeft} días restantes`}
                        {subscriptionStatus.status === "expiring" && `Vence en ${subscriptionStatus.daysLeft} días`}
                        {subscriptionStatus.status === "overdue" && `Vencido hace ${Math.abs(subscriptionStatus.daysLeft)} días`}
                      </div>
                    </div>

                    <div className="bg-secondary/40 border border-border rounded-lg p-4">
                      <div className="text-sm text-muted-foreground mb-1">Meses pagados</div>
                      <div className="text-lg font-bold">{subscriptionStatus.totalPayments}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Desde {format(subscriptionStatus.entryDate, "dd MMM yyyy", { locale: dateLocale })}
                      </div>
                    </div>

                    <div className="bg-secondary/40 border border-border rounded-lg p-4">
                      <div className="text-sm text-muted-foreground mb-1">Estado</div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          subscriptionStatus.status === "paid" ? "bg-green-500/20 text-green-400" :
                          subscriptionStatus.status === "expiring" ? "bg-yellow-500/20 text-yellow-400" :
                          subscriptionStatus.status === "overdue" ? "bg-red-500/20 text-red-400" :
                          "bg-gray-500/20 text-gray-400"
                        }`}>
                          {subscriptionStatus.status === "paid" && "Al día"}
                          {subscriptionStatus.status === "expiring" && "Por vencer"}
                          {subscriptionStatus.status === "overdue" && "En mora"}
                          {subscriptionStatus.status === "inactive" && "Sin pagos"}
                        </span>
                      </div>
                      {subscriptionStatus.lastCouponTx && (
                        <div className="text-xs text-muted-foreground mt-2">
                          Último pago con cupón <span className="font-mono">{subscriptionStatus.lastCouponTx.coupon_code || `#${subscriptionStatus.lastCouponTx.id_coupon}`}</span>
                          {subscriptionStatus.lastCouponTx.discount_amount && (
                            <> (-${Number(subscriptionStatus.lastCouponTx.discount_amount).toLocaleString("es-CO")} {subscriptionStatus.lastCouponTx.currency})</>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Monthly Payment Record */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {t('dash.monthlyPaymentRecord')}
                  </h3>
                  <Select 
                    value={selectedYear.toString()} 
                    onValueChange={(val) => setSelectedYear(parseInt(val))}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableYears.map(year => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {monthlyPayments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p>{t('dash.noPaymentsYet')}</p>
                    <p className="text-sm mt-1">{t('dash.historyAfterPurchase')}</p>
                  </div>
                ) : (
                  <>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('dash.clickMonthDetail')}
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {monthlyPayments.map((month, idx) => {
                    const isOk = month.hasPayment || month.isCovered;
                    const isPrepaid = month.isCovered && !month.hasPayment;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleMonthClick(month.month, month.year)}
                        className={`p-3 rounded-lg text-center transition-all hover:scale-105 cursor-pointer ${
                          isOk
                            ? "bg-green-500/20 border border-green-500/30 hover:bg-green-500/30"
                            : "bg-red-500/20 border border-red-500/30 hover:bg-red-500/30"
                        }`}
                      >
                        <div className="text-sm font-medium capitalize">
                          {format(month.date, "MMM", { locale: dateLocale })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(month.date, "yyyy")}
                        </div>
                        <div className="mt-1 flex items-center justify-center gap-1">
                          {isOk ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400" />
                          )}
                        </div>
                        {isPrepaid ? (
                          <div className="text-xs text-green-400 mt-1">Cubierto</div>
                        ) : month.transactionCount > 0 ? (
                          <div className="text-xs text-muted-foreground mt-1">
                            {month.approvedCount}/{month.transactionCount}
                          </div>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
                  </>
                )}
              </div>

              {/* Month Detail Modal */}
              <Dialog open={monthDetailModal} onOpenChange={setMonthDetailModal}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      {t('dash.transactionsOf')} {selectedMonth && format(new Date(selectedMonth.year, selectedMonth.month, 1), "MMMM yyyy", { locale: dateLocale })}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="pt-4">
                    {selectedMonthTransactions.length === 0 ? (
                      <div className="text-center py-8">
                        <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                        <p className="text-muted-foreground">
                          {t('dash.noTransactionsMonth')}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex gap-4 text-sm">
                          <div className="bg-green-500/20 border border-green-500/30 px-3 py-2 rounded-lg">
                            <span className="text-green-400 font-medium">
                              {selectedMonthTransactions.filter(tx => tx.status === "APPROVED").length}
                            </span>
                            <span className="text-muted-foreground ml-1">{t('dash.approved')}</span>
                          </div>
                          <div className="bg-yellow-500/20 border border-yellow-500/30 px-3 py-2 rounded-lg">
                            <span className="text-yellow-400 font-medium">
                              {selectedMonthTransactions.filter(tx => tx.status === "PENDING").length}
                            </span>
                            <span className="text-muted-foreground ml-1">{t('dash.pending')}</span>
                          </div>
                          <div className="bg-red-500/20 border border-red-500/30 px-3 py-2 rounded-lg">
                            <span className="text-red-400 font-medium">
                              {selectedMonthTransactions.filter(tx => tx.status !== "APPROVED" && tx.status !== "PENDING").length}
                            </span>
                            <span className="text-muted-foreground ml-1">{t('dash.declined')}</span>
                          </div>
                        </div>
                        
                        <div className="overflow-x-auto max-h-80">
                          <table className="w-full">
                            <thead className="sticky top-0 bg-card">
                              <tr className="border-b border-border">
                                <th className="text-left py-3 px-4 text-muted-foreground font-medium">{t('dash.date')}</th>
                                <th className="text-left py-3 px-4 text-muted-foreground font-medium">{t('dash.plan')}</th>
                                <th className="text-left py-3 px-4 text-muted-foreground font-medium">{t('dash.amount')}</th>
                                <th className="text-left py-3 px-4 text-muted-foreground font-medium">{t('dash.status')}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedMonthTransactions.map((tx) => (
                                <tr key={tx.id} className="border-b border-border/50">
                                  <td className="py-3 px-4">
                                    {format(new Date(tx.created_at), "dd MMM yyyy, h:mm a", { locale: dateLocale })}
                                  </td>
                                  <td className="py-3 px-4 capitalize">{tx.plan_name}</td>
                                  <td className="py-3 px-4">
                                    ${Number(tx.amount).toLocaleString("es-CO")} {tx.currency}
                                  </td>
                                  <td className="py-3 px-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      tx.status === "APPROVED" 
                                        ? "bg-green-500/20 text-green-400"
                                        : tx.status === "PENDING"
                                          ? "bg-yellow-500/20 text-yellow-400"
                                          : "bg-red-500/20 text-red-400"
                                    }`}>
                                      {tx.status === "APPROVED" ? t('dash.approved') : tx.status === "PENDING" ? t('dash.pending') : t('dash.declined')}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        
                        <div className="border-t border-border pt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">{t('dash.totalApproved')}</span>
                            <span className="text-xl font-bold text-green-400">
                              ${selectedMonthTransactions
                                .filter(tx => tx.status === "APPROVED")
                                .reduce((sum, tx) => sum + Number(tx.amount), 0)
                                .toLocaleString("es-CO")} COP
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments">
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold mb-4">{t('dash.transactionHistory')}</h3>
                
                {/* Filters */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <div className="min-w-[180px]">
                    <Label className="text-xs text-muted-foreground mb-1 block">{t('dash.month')}</Label>
                    <Select value={paymentFilterMonth} onValueChange={setPaymentFilterMonth}>
                      <SelectTrigger className="bg-card">
                        <SelectValue placeholder="Todos los meses" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border z-50">
                        <SelectItem value="all">{t('dash.allMonths')}</SelectItem>
                        {availableMonths.map(m => (
                          <SelectItem key={`${m.year}-${m.month}`} value={`${m.year}-${m.month}`}>
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="min-w-[150px]">
                    <Label className="text-xs text-muted-foreground mb-1 block">{t('dash.plan')}</Label>
                    <Select value={paymentFilterPlan} onValueChange={setPaymentFilterPlan}>
                      <SelectTrigger className="bg-card">
                        <SelectValue placeholder="Todos los planes" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border z-50">
                        <SelectItem value="all">{t('dash.allPlans')}</SelectItem>
                        {availablePlans.map(plan => (
                          <SelectItem key={plan} value={plan}>
                            {plan}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="min-w-[140px]">
                    <Label className="text-xs text-muted-foreground mb-1 block">{t('dash.status')}</Label>
                    <Select value={paymentFilterStatus} onValueChange={setPaymentFilterStatus}>
                      <SelectTrigger className="bg-card">
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border z-50">
                        <SelectItem value="all">{t('dash.all')}</SelectItem>
                        <SelectItem value="APPROVED">{t('dash.approved')}</SelectItem>
                        <SelectItem value="PENDING">{t('dash.pending')}</SelectItem>
                        <SelectItem value="DECLINED">{t('dash.declined')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {(paymentFilterMonth !== "all" || paymentFilterPlan !== "all" || paymentFilterStatus !== "all") && (
                    <div className="flex items-end">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setPaymentFilterMonth("all");
                          setPaymentFilterPlan("all");
                          setPaymentFilterStatus("all");
                        }}
                      >
                        {t('dash.clearFilters')}
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* Results count */}
                <p className="text-sm text-muted-foreground mb-4">
                  {t('dash.showing')} {filteredTransactions.length} {t('dash.of')} {transactions.length} {t('dash.transactions')}
                </p>
                
                {transactions.length === 0 ? (
                  <p className="text-muted-foreground">{t('dash.noTransactions')}</p>
                ) : filteredTransactions.length === 0 ? (
                  <p className="text-muted-foreground">{t('dash.noMatchFilters')}</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-muted-foreground font-medium">{t('dash.date')}</th>
                          <th className="text-left py-3 px-4 text-muted-foreground font-medium">{t('dash.plan')}</th>
                          <th className="text-left py-3 px-4 text-muted-foreground font-medium">{t('dash.amount')}</th>
                          <th className="text-left py-3 px-4 text-muted-foreground font-medium">{t('dash.status')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTransactions.map((tx) => (
                          <tr key={tx.id} className="border-b border-border/50">
                            <td className="py-3 px-4">
                              {format(new Date(tx.created_at), "dd MMM yyyy, h:mm a", { locale: dateLocale })}
                            </td>
                            <td className="py-3 px-4 capitalize">{tx.plan_name}</td>
                            <td className="py-3 px-4">
                              ${Number(tx.amount).toLocaleString("es-CO")} {tx.currency}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                tx.status === "APPROVED" 
                                  ? "bg-green-500/20 text-green-400"
                                  : tx.status === "PENDING"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : "bg-red-500/20 text-red-400"
                              }`}>
                                {tx.status === "APPROVED" ? t('dash.approved') : tx.status === "PENDING" ? t('dash.pending') : t('dash.declined')}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                
                {/* Total summary */}
                {filteredTransactions.length > 0 && (
                  <div className="border-t border-border mt-4 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">{t('dash.totalApprovedFiltered')}</span>
                      <span className="text-xl font-bold text-green-400">
                        ${filteredTransactions
                          .filter(tx => tx.status === "APPROVED")
                          .reduce((sum, tx) => sum + Number(tx.amount), 0)
                          .toLocaleString("es-CO")} COP
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <div className="glass-card p-6">
                {/* Account type badge */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/50">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                    profile?.company?.accountType === 'empresa'
                      ? 'bg-gradient-to-br from-primary/20 to-accent/20'
                      : 'bg-gradient-to-br from-blue-500/20 to-purple-500/20'
                  }`}>
                    {profile?.company?.accountType === 'empresa'
                      ? <Building2 className="w-7 h-7 text-primary" />
                      : <User className="w-7 h-7 text-blue-500" />
                    }
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold">{profile?.company?.name || profile?.user?.name}</h2>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      profile?.company?.accountType === 'empresa'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-blue-500/10 text-blue-500'
                    }`}>
                      {profile?.company?.accountType === 'empresa' ? 'Empresa' : 'Persona'}
                    </span>
                  </div>
                  <Dialog open={editProfileModal} onOpenChange={setEditProfileModal}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Edit className="w-4 h-4 mr-2" />
                        {t('dash.edit')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>{t('dash.editProfile')}</DialogTitle>
                      </DialogHeader>
                      {(() => {
                        const fields = ['name', 'phone', 'address', 'city', 'country'];
                        if (profile?.company?.accountType === 'empresa') fields.push('nit');
                        else { fields.push('documentType'); fields.push('documentNumber'); }
                        const currentErrors = fields.map(f => getFieldError(f)).filter(Boolean) as string[];
                        if (currentErrors.length === 0) return null;
                        return (
                          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3">
                            <p className="text-sm font-medium text-destructive mb-1">Completa los siguientes datos para facturación:</p>
                            <ul className="text-xs text-destructive/80 space-y-1">
                              {currentErrors.map((err, i) => <li key={i}>• {err}</li>)}
                            </ul>
                          </div>
                        );
                      })()}
                      <div className="space-y-4 pt-2">
                        <div>
                          <Label>{t('dash.name')} (nombre y apellido)</Label>
                          <Input
                            value={editForm.name}
                            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Nombre Apellido"
                            className={`mt-1 ${getFieldError('name') ? 'border-destructive' : editForm.name.trim() ? 'border-green-500' : ''}`}
                          />
                          {getFieldError('name') && <p className="text-xs text-destructive mt-1">{getFieldError('name')}</p>}
                        </div>
                        <div>
                          <Label>{t('dash.phone')}</Label>
                          <Input
                            value={editForm.phone}
                            onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                            className={`mt-1 ${getFieldError('phone') ? 'border-destructive' : editForm.phone ? 'border-green-500' : ''}`}
                          />
                          {getFieldError('phone') && <p className="text-xs text-destructive mt-1">{getFieldError('phone')}</p>}
                        </div>
                        <div>
                          <Label>{t('dash.address')}</Label>
                          <Input
                            value={editForm.address}
                            onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                            className={`mt-1 ${getFieldError('address') ? 'border-destructive' : editForm.address.trim() ? 'border-green-500' : ''}`}
                          />
                          {getFieldError('address') && <p className="text-xs text-destructive mt-1">{getFieldError('address')}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label>Ciudad</Label>
                            <Input
                              value={editForm.city}
                              onChange={(e) => setEditForm(prev => ({ ...prev, city: e.target.value }))}
                              placeholder="Ej: Medellín"
                              className={`mt-1 ${getFieldError('city') ? 'border-destructive' : editForm.city.trim() ? 'border-green-500' : ''}`}
                            />
                            {getFieldError('city') && <p className="text-xs text-destructive mt-1">{getFieldError('city')}</p>}
                          </div>
                          <div>
                            <Label>País</Label>
                            <div className={`mt-1 ${getFieldError('country') ? '[&>button]:border-destructive' : editForm.country ? '[&>button]:border-green-500' : ''}`}>
                              <CountrySelect
                                value={editForm.country}
                                onValueChange={(val) => {
                                  const wasCol = !editForm.country || editForm.country.toLowerCase() === 'colombia';
                                  const isCol = val.toLowerCase() === 'colombia';
                                  // Resetear tipo de documento si cambió entre Colombia y otro país
                                  const resetDoc = wasCol !== isCol ? { documentType: '' } : {};
                                  setEditForm(prev => ({ ...prev, country: val, ...resetDoc }));
                                }}
                              />
                            </div>
                            {getFieldError('country') && <p className="text-xs text-destructive mt-1">{getFieldError('country')}</p>}
                          </div>
                        </div>
                        {profile?.company?.accountType === 'persona' ? (
                          <>
                            <div>
                              <Label>{t('dash.docType')}</Label>
                              {(() => {
                                const isCol = !editForm.country || editForm.country.toLowerCase() === 'colombia';
                                return (
                                  <select
                                    value={editForm.documentType}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, documentType: e.target.value }))}
                                    className={`mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm ${getFieldError('documentType') ? 'border-destructive' : editForm.documentType ? 'border-green-500' : 'border-input'}`}
                                  >
                                    <option value="">{t('dash.selectType')}</option>
                                    {isCol ? (
                                      <>
                                        <option value="CC">Cédula de Ciudadanía</option>
                                        <option value="CE">Cédula de Extranjería</option>
                                        <option value="TI">Tarjeta de Identidad</option>
                                        <option value="PP">Pasaporte</option>
                                      </>
                                    ) : (
                                      <>
                                        <option value="PP">Pasaporte</option>
                                        <option value="DNI">DNI / Documento Nacional</option>
                                        <option value="CE">Documento de Extranjería</option>
                                      </>
                                    )}
                                  </select>
                                );
                              })()}
                              {getFieldError('documentType') && <p className="text-xs text-destructive mt-1">{getFieldError('documentType')}</p>}
                            </div>
                            <div>
                              <Label>{t('dash.docNumber')}</Label>
                              <Input
                                value={editForm.documentNumber}
                                onChange={(e) => setEditForm(prev => ({ ...prev, documentNumber: e.target.value }))}
                                placeholder={t('dash.enterDocNumber')}
                                className={`mt-1 ${getFieldError('documentNumber') ? 'border-destructive' : editForm.documentNumber.trim() ? 'border-green-500' : ''}`}
                              />
                              {getFieldError('documentNumber') && <p className="text-xs text-destructive mt-1">{getFieldError('documentNumber')}</p>}
                            </div>
                          </>
                        ) : (
                          <div>
                            {(() => {
                              const isCol = !editForm.country || editForm.country.toLowerCase() === 'colombia';
                              return (<>
                                <Label>{isCol ? `${t('dash.nit')} (con dígito de verificación)` : 'Identificación fiscal'}</Label>
                                <Input
                                  value={editForm.nit}
                                  onChange={(e) => setEditForm(prev => ({ ...prev, nit: e.target.value }))}
                                  placeholder={isCol ? 'Ej: 901976734-4' : 'Número de identificación fiscal'}
                                  className={`mt-1 ${getFieldError('nit') ? 'border-destructive' : editForm.nit.trim() && !getFieldError('nit') ? 'border-green-500' : ''}`}
                                />
                                {getFieldError('nit') && <p className="text-xs text-destructive mt-1">{getFieldError('nit')}</p>}
                                {isCol && editForm.nit && validateNitDv(editForm.nit).valid && (
                                  <p className="text-xs text-green-500 mt-1">NIT válido</p>
                                )}
                                {!isCol && editForm.nit.trim() && !getFieldError('nit') && (
                                  <p className="text-xs text-green-500 mt-1">Identificación fiscal registrada</p>
                                )}
                              </>);
                            })()}
                          </div>
                        )}
                        <Button onClick={handleUpdateProfile} className="w-full" disabled={!isEditFormValid()}>
                          {pendingPaymentAfterEdit ? 'Guardar y continuar con el pago' : t('dash.saveChanges')}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <h3 className="text-lg font-semibold mb-4">{t('dash.myInfo')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <span className="text-muted-foreground text-sm">{t('dash.email')}</span>
                      <p className="font-medium">{profile?.user?.email || "-"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-sm">{t('dash.name')}</span>
                      <p className="font-medium">{profile?.user?.name || "-"}</p>
                    </div>
                    {profile?.company?.accountType === 'persona' && profile?.user?.documentType && profile?.user?.documentNumber && (
                    <div>
                      <span className="text-muted-foreground text-sm">{t('dash.document')}</span>
                      <p className="font-medium">{profile.user.documentType} {profile.user.documentNumber}</p>
                    </div>
                    )}
                    <div>
                      <span className="text-muted-foreground text-sm">{t('dash.phone')}</span>
                      <p className="font-medium">{profile?.user?.phone || "-"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-sm">{t('dash.address')}</span>
                      <p className="font-medium">{profile?.user?.address || "-"}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <span className="text-muted-foreground text-sm">{t('dash.company')}</span>
                      <p className="font-medium">{profile?.company?.name || "-"}</p>
                    </div>
                    {profile?.company?.accountType === 'empresa' && (
                    <div>
                      <span className="text-muted-foreground text-sm">{t('dash.nit')}</span>
                      <p className="font-medium">{profile?.company?.nit || "-"}</p>
                    </div>
                    )}
                    <div>
                      <span className="text-muted-foreground text-sm">{t('dash.memberSince') || 'Miembro desde'}</span>
                      <p className="font-medium">{profile?.company?.entryDate ? format(new Date(profile.company.entryDate), "dd MMM yyyy", { locale: dateLocale }) : "-"}</p>
                    </div>
                    {(profile?.company?.city || profile?.company?.country) && (
                    <div>
                      <span className="text-muted-foreground text-sm">Ubicación</span>
                      <p className="font-medium">{[profile?.company?.city, profile?.company?.country].filter(Boolean).join(', ') || "-"}</p>
                    </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Coupons Tab */}
            <TabsContent value="coupons">
              <MyCouponsTab />
            </TabsContent>

            {/* Invoices Tab */}
            <TabsContent value="invoices">
              <InvoicesTab
                transactions={transactions}
                t={t}
                dateLocale={dateLocale}
                formatPrice={formatPrice}
              />
            </TabsContent>


            <TabsContent value="support">
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <HelpCircle className="w-5 h-5" />
                    {t('dash.myTickets')}
                  </h3>
                  <Dialog open={newTicketModal} onOpenChange={setNewTicketModal}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        {t('dash.newTicket')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t('dash.createTicket')}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div>
                          <Label>{t('dash.subject')}</Label>
                          <Input 
                            value={newTicket.subject}
                            onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                            placeholder={t('dash.subjectPlaceholder')}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>{t('dash.priority')}</Label>
                          <Select 
                            value={newTicket.priority}
                            onValueChange={(val) => setNewTicket(prev => ({ ...prev, priority: val }))}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">{t('dash.low')}</SelectItem>
                              <SelectItem value="medium">{t('dash.medium')}</SelectItem>
                              <SelectItem value="high">{t('dash.high')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>{t('dash.description')}</Label>
                          <Textarea 
                            value={newTicket.description}
                            onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                            placeholder={t('dash.descPlaceholder')}
                            className="mt-1 min-h-[120px]"
                          />
                        </div>
                        <Button onClick={handleCreateTicket} className="w-full">
                          {t('dash.sendTicket')}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {tickets.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">{t('dash.noTickets')}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('dash.createNewHelp')}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tickets.map((ticket) => (
                      <div 
                        key={ticket.id} 
                        className="border border-border rounded-lg p-4 cursor-pointer hover:border-primary/50 transition-colors"
                        onClick={() => handleOpenTicket(ticket)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">{ticket.subject}</h4>
                          <div className="flex gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              ticket.priority === "high" 
                                ? "bg-red-500/20 text-red-400"
                                : ticket.priority === "medium"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-blue-500/20 text-blue-400"
                            }`}>
                              {ticket.priority === "high" ? t('dash.high') : ticket.priority === "medium" ? t('dash.medium') : t('dash.low')}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              ticket.status === "open" 
                                ? "bg-green-500/20 text-green-400"
                                : ticket.status === "in_progress"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-gray-500/20 text-gray-400"
                            }`}>
                              {ticket.status === "open" ? t('dash.open') : ticket.status === "in_progress" ? t('dash.inProgress') : t('dash.closed')}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{ticket.description}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">
                            {t('dash.created')} {new Date(ticket.created_at).toLocaleDateString(language === 'en' ? 'en-US' : language === 'pt' ? 'pt-BR' : 'es-CO')}
                          </p>
                          <span className="text-xs text-primary">{t('dash.clickToView')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Ticket Conversation Modal */}
                <Dialog open={viewTicketModal} onOpenChange={setViewTicketModal}>
                  <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
                    <DialogHeader>
                      <DialogTitle className="flex items-center justify-between">
                        <span>{selectedTicket?.subject}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedTicket?.status === "open" 
                            ? "bg-green-500/20 text-green-400"
                            : selectedTicket?.status === "in_progress"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-gray-500/20 text-gray-400"
                        }`}>
                          {selectedTicket?.status === "open" ? t('dash.open') : selectedTicket?.status === "in_progress" ? t('dash.inProgress') : t('dash.closed')}
                        </span>
                      </DialogTitle>
                    </DialogHeader>
                    
                    {/* Original description */}
                    <div className="bg-secondary/50 rounded-lg p-3 mb-4">
                      <p className="text-xs text-muted-foreground mb-1">{t('dash.originalDesc')}</p>
                      <p className="text-sm">{selectedTicket?.description}</p>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto space-y-3 min-h-[200px] max-h-[300px] border border-border rounded-lg p-3">
                      {loadingMessages ? (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-muted-foreground">{t('dash.loadingMessages')}</span>
                        </div>
                      ) : ticketMessages.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-muted-foreground text-sm">{t('dash.noMessagesYet')}</span>
                        </div>
                      ) : (
                        ticketMessages.map((msg) => (
                          <div 
                            key={msg.id} 
                            className={`flex ${msg.is_from_support ? "justify-start" : "justify-end"}`}
                          >
                            <div className={`max-w-[80%] rounded-lg p-3 ${
                              msg.is_from_support 
                                ? "bg-primary/20 border border-primary/30" 
                                : "bg-secondary border border-border"
                            }`}>
                              <p className="text-xs text-muted-foreground mb-1">
                                {msg.is_from_support ? t('dash.supportLabel') : t('dash.you')} • {new Date(msg.created_at).toLocaleString(language === 'en' ? 'en-US' : language === 'pt' ? 'pt-BR' : 'es-CO')}
                              </p>
                              <p className="text-sm">{msg.message}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* New message input */}
                    {selectedTicket?.status !== "closed" ? (
                      <div className="flex gap-2 mt-4">
                        <Textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder={t('dash.writeMessage')}
                          className="flex-1 min-h-[60px] max-h-[100px]"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                        />
                        <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                          {t('dash.send')}
                        </Button>
                      </div>
                    ) : (
                      <div className="bg-muted/50 rounded-lg p-3 mt-4 text-center">
                        <p className="text-sm text-muted-foreground">{t('dash.ticketClosed')}</p>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
      {/* Payment method selector removed - Wompi only */}

      {/* Payment Confirmation Modal */}
      <Dialog open={confirmPaymentModal} onOpenChange={setConfirmPaymentModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              {t('dash.confirmPayment')}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">{t('dash.planLabel')}</span>
                <span className="font-bold text-primary">{pendingPlanName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">{t('dash.amountCOP')}</span>
                <span className="font-medium">${pendingPaymentAmount.toLocaleString("es-CO")} COP</span>
              </div>
              
              {currency === 'USD' && exchangeRate && (
                <>
                  <div className="border-t border-border pt-3 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">TRM:</span>
                      <span>${exchangeRate.rate.toLocaleString("es-CO")} COP/USD</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">{t('dash.commission')}</span>
                      <span>{t('dash.included')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">{t('dash.equivalentUSD')}</span>
                      <span className="font-bold text-lg text-primary">
                        ${convertToSelectedCurrency(pendingPaymentAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-muted-foreground bg-primary/5 p-2 rounded">
                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{t('dash.copNote')}</span>
                  </div>
                </>
              )}
            </div>
            
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setConfirmPaymentModal(false)}>
                {t('dash.cancel')}
              </Button>
              <Button variant="default" onClick={handleConfirmRenewSubscription} disabled={renewLoading}>
                {renewLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                    {t('dash.processing')}
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    {t('dash.confirmPayment')}
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tokenize Card Modal */}
      <Dialog open={tokenizeModal} onOpenChange={setTokenizeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              {t('dash.autoCharge')}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-muted-foreground">
              {t('dash.saveCardQuestion')} <span className="font-bold text-primary">{pendingPlanName}</span> {t('dash.renewsAutoMonthly')}
            </p>
            <div className="bg-secondary/50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{t('dash.cardSecure')}</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{t('dash.chargeAutoDate')}</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{t('dash.cancelAnytime')}</span>
              </div>
            </div>
            
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setTokenizeModal(false)}>
                {t('dash.noThanks')}
              </Button>
              <Button variant="default" onClick={handleTokenizeCard} disabled={tokenizingCard}>
                {tokenizingCard ? (
                  <>
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                    {t('dash.saving')}
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    {t('dash.autoCharge')}
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;