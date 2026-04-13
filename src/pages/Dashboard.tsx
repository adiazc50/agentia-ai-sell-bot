import { useEffect, useState, useMemo } from "react";
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
  Home, Tag
} from "lucide-react";
import { api, isAuthenticated, getUser, logout as apiLogout } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { format, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { es, enUS, ptBR } from "date-fns/locale";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useLanguage } from "@/contexts/LanguageContext";
import DashboardShowcase from "@/components/DashboardShowcase";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import InvoicesTab from "@/components/InvoicesTab";


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
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    address: "",
    documentType: "",
    documentNumber: "",
    nit: "",
  });
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
  const [tokenizeModal, setTokenizeModal] = useState(false);
  const [tokenizingCard, setTokenizingCard] = useState(false);
  const [activeSubscription, setActiveSubscription] = useState<any>(null);
  const [paymentMethodModal, setPaymentMethodModal] = useState(false);
  const [pendingPaymentUSD, setPendingPaymentUSD] = useState(0);
  const [triggerWompiPayment, setTriggerWompiPayment] = useState(false);
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

  // Load Wompi script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.wompi.co/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Trigger Wompi payment after state has been updated
  useEffect(() => {
    if (triggerWompiPayment && pendingPaymentAmount > 0) {
      setTriggerWompiPayment(false);
      handleConfirmRenewSubscription();
    }
  }, [triggerWompiPayment, pendingPaymentAmount]);

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
          address: profileData.user?.address || "",
          documentType: profileData.user?.documentType || "",
          documentNumber: profileData.user?.documentNumber || "",
          nit: profileData.company?.nit || "",
        });

        // Fetch transactions
        const txData = await api.transactions.list();
        setTransactions((txData as Transaction[]) || []);

        // Fetch tickets
        const ticketData = await api.tickets.list();
        setTickets((ticketData as SupportTicket[]) || []);

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

  // Monthly payment record for selected year (12 months)
  const monthlyPayments = useMemo(() => {
    if (!firstTransactionDate) return [];
    
    const months = [];
    
    for (let i = 0; i < 12; i++) {
      const monthDate = new Date(selectedYear, 11 - i, 1);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      
      // Only show months from the first transaction onward and not in the future
      if (monthStart < startOfMonth(firstTransactionDate) || monthStart > startOfMonth(new Date())) continue;
      
      const monthTransactions = transactions.filter(tx => {
        const txDate = new Date(tx.created_at);
        return isWithinInterval(txDate, { start: monthStart, end: monthEnd });
      });
      
      const hasPayment = monthTransactions.some(tx => tx.status === "APPROVED");
      
      months.push({
        date: monthDate,
        month: monthDate.getMonth(),
        year: monthDate.getFullYear(),
        hasPayment,
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
        }
      } : null);
      setEditProfileModal(false);
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

  const initiateRenewSubscription = () => {
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

    const trm = exchangeRate?.rate ?? 4200;
    const isFixedCOP = !!fixedCOPPrices[selectedPlan.package];
    const monthlyPriceCOP = isFixedCOP ? fixedCOPPrices[selectedPlan.package] : Math.round((monthlyPricesUSD[selectedPlan.package] || 29) * trm);
    
    const discountMap = { mensual: 0, semestral: 0.10, anual: 0.15 };
    const monthsMap = { mensual: 1, semestral: 6, anual: 12 };
    const discount = discountMap[selectedPlan.plan];
    const months = monthsMap[selectedPlan.plan];
    const discountedMonthly = discount > 0 ? Math.round(monthlyPriceCOP * (1 - discount)) : monthlyPriceCOP;
    const amount = discountedMonthly * months;
    
    const suffixMap = { mensual: " - Mensual", semestral: " - Semestral", anual: " - Anual" };
    const planDisplayName = planDisplayNames[selectedPlan.package] || selectedPlan.package;
    
    setPendingPaymentAmount(amount);
    setPendingPlanName(planDisplayName + suffixMap[selectedPlan.plan]);

    // Calculate USD amount for display
    if (!isFixedCOP && monthlyPricesUSD[selectedPlan.package]) {
      const monthlyUSD = monthlyPricesUSD[selectedPlan.package];
      const discountedUSD = Math.round(monthlyUSD * (1 - discount) * 100) / 100;
      setPendingPaymentUSD(discountedUSD * months);
    } else if (fixedUSDPrices[selectedPlan.package]) {
      const discountedUSD = Math.round(fixedUSDPrices[selectedPlan.package] * (1 - discount) * 100) / 100;
      setPendingPaymentUSD(discountedUSD * months);
    } else if (isFixedCOP) {
      const copAmount = amount;
      const usdAmount = convertToSelectedCurrency(copAmount);
      setPendingPaymentUSD(Math.round(usdAmount * 100) / 100);
    } else {
      setPendingPaymentUSD(0);
    }
    // Trigger Wompi payment after state updates
    setTriggerWompiPayment(true);
  };

  const handleConfirmRenewSubscription = async () => {
    if (!profile) return;

    const user = getUser();
    if (!user) return;

    setConfirmPaymentModal(false);
    setRenewLoading(true);

    try {
      const reference = `renewal-${selectedPlan.package}-${selectedPlan.plan}-${Date.now()}`;
      const priceInCents = pendingPaymentAmount * 100;
      const currencyCode = 'COP';

      // Get Wompi signature
      const signatureData = await api.payments.wompiSignature({
        reference,
        amountInCents: priceInCents,
        currency: currencyCode
      });

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

        // Create transaction only after Wompi responds
        if (transaction.status === 'APPROVED') {
          await api.transactions.success({
            email: profile.user.email,
            plan_name: pendingPlanName,
            ai_responses_included: 0,
            amount: pendingPaymentAmount,
            currency: currencyCode,
            reference: reference,
            transaction_id: transaction.id,
            payment_method: transaction.paymentMethod?.type || 'CARD',
            transaction_date: new Date().toISOString(),
          });
        }

        if (transaction.status === 'APPROVED') {
          toast({
            title: "¡Pago exitoso!",
            description: `Tu plan ${pendingPlanName} ha sido renovado.`,
          });

          // Refresh transactions
          const txData = await api.transactions.list();
          setTransactions((txData as Transaction[]) || []);
          setRenewModal(false);
          
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
                className="w-full text-lg font-bold py-6 animate-pulse hover:animate-none"
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
                  onClick={() => window.open('https://www.ia.soyagentia.com/authentication/login', '_blank')}
                >
                  🚀 Ingresar a la Plataforma
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 max-w-2xl">
              <TabsTrigger value="overview">{t('dash.overview')}</TabsTrigger>
              <TabsTrigger value="payments">{t('dash.payments')}</TabsTrigger>
              <TabsTrigger value="invoices">{t('dash.invoices')}</TabsTrigger>
              <TabsTrigger value="profile">{t('dash.profile')}</TabsTrigger>
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
                          {t('dash.buyPlan')}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{t('dash.buyPlan')}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div>
                            <Label>{t('dash.package')}</Label>
                            <Select 
                              value={selectedPlan.package} 
                              onValueChange={(val) => setSelectedPlan(prev => ({ ...prev, package: val }))}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="plan test" disabled={hasPurchasedPlanTest}>
                                  Plan Test (250 resp/7 días){hasPurchasedPlanTest ? ' ✓ Ya adquirido' : ''}
                                </SelectItem>
                                <SelectItem value="starter">Starter (250 resp/mes)</SelectItem>
                                <SelectItem value="mini">Mini (500 resp/mes)</SelectItem>
                                <SelectItem value="basico">Básico (1,100 resp/mes)</SelectItem>
                                <SelectItem value="plus">Plus (3,500 resp/mes)</SelectItem>
                                <SelectItem value="enterprise">Enterprise (7,500 resp/mes)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
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
                          
                          {/* Price Display */}
                          {(() => {
                            const monthlyPricesUSD2: Record<string, number> = {
                              'plan test': 0, starter: 15, mini: 29, basico: 59, plus: 99, enterprise: 199
                            };
                            
                            const discountMap2 = { mensual: 0, semestral: 0.10, anual: 0.15 };
                            const monthsMap2 = { mensual: 1, semestral: 6, anual: 12 };
                            const discount = discountMap2[selectedPlan.plan];
                            const months = monthsMap2[selectedPlan.plan];
                            const monthlyUSD = monthlyPricesUSD2[selectedPlan.package] ?? 29;
                            const discountedMonthly = discount > 0 ? Math.round(monthlyUSD * (1 - discount) * 100) / 100 : monthlyUSD;
                            const totalPrice = Math.round(discountedMonthly * months * 100) / 100;
                            const savings = discount > 0 ? Math.round((monthlyUSD * months - totalPrice) * 100) / 100 : 0;
                            const periodLabel = selectedPlan.plan === "anual" ? t('dash.for12Months') : selectedPlan.plan === "semestral" ? t('dash.for6Months') : t('dash.for1Month');
                            const discountPct = Math.round(discount * 100);
                            const isPlanTest = selectedPlan.package === 'plan test';
                            
                            return (
                              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 space-y-2">
                                {isPlanTest ? (
                                  <>
                                    <div className="flex justify-between items-center">
                                      <span className="text-muted-foreground">Plan</span>
                                      <span className="font-bold">$0 USD</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-muted-foreground">Cobro de verificación</span>
                                      <span className="font-bold">$0.39 USD</span>
                                    </div>
                                    <div className="border-t border-border pt-2 mt-2">
                                      <div className="flex justify-between items-center">
                                        <span className="font-medium">{t('dash.totalToPay')}</span>
                                        <span className="text-xl font-bold text-primary">$0.39 USD</span>
                                      </div>
                                      <p className="text-xs text-muted-foreground text-right">
                                        Prueba de 7 días
                                      </p>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="flex justify-between items-center">
                                      <span className="text-muted-foreground">{t('dash.monthlyPrice')}</span>
                                      <span className={discount > 0 ? "line-through text-muted-foreground" : "font-bold"}>
                                        ${Math.round(monthlyUSD)} USD
                                      </span>
                                    </div>
                                    {discount > 0 && (
                                      <>
                                        <div className="flex justify-between items-center">
                                          <span className="text-muted-foreground">{t('dash.withDiscount')}</span>
                                          <span className="font-bold text-primary">
                                            ${Math.round(discountedMonthly)} USD/mes
                                          </span>
                                        </div>
                                        <div className="flex justify-between items-center text-accent">
                                          <span>{t('dash.youSave')}</span>
                                          <span className="font-semibold">${Math.round(savings)} USD ({discountPct}%)</span>
                                        </div>
                                      </>
                                    )}
                                    <div className="border-t border-border pt-2 mt-2">
                                      <div className="flex justify-between items-center">
                                        <span className="font-medium">{t('dash.totalToPay')}</span>
                                        <span className="text-xl font-bold text-primary">
                                          ${Math.round(totalPrice)} USD
                                        </span>
                                      </div>
                                      <p className="text-xs text-muted-foreground text-right">
                                        {periodLabel}
                                      </p>
                                    </div>
                                  </>
                                )}
                              </div>
                            );
                          })()}
                          
                          {hasPurchasedPlanTest && selectedPlan.package === 'plan test' && (
                            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive">
                              Ya has adquirido el Plan Test anteriormente. Este plan solo se puede comprar una vez.
                            </div>
                          )}
                          
                          <Button onClick={initiateRenewSubscription} className="w-full" variant="default" disabled={renewLoading || (hasPurchasedPlanTest && selectedPlan.package === 'plan test')}>
                            {renewLoading ? (
                              <>
                                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                                {t('dash.processing')}
                              </>
                            ) : (
                              <>
                                <CreditCard className="w-4 h-4 mr-2" />
                                {t('dash.buy')}
                              </>
                            )}
                          </Button>
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
                  {monthlyPayments.map((month, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => handleMonthClick(month.month, month.year)}
                      className={`p-3 rounded-lg text-center transition-all hover:scale-105 cursor-pointer ${
                        month.hasPayment 
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
                        {month.hasPayment ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      {month.transactionCount > 0 && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {month.approvedCount}/{month.transactionCount}
                        </div>
                      )}
                    </button>
                  ))}
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
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">{t('dash.myInfo')}</h3>
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
                      <div className="space-y-4 pt-4">
                        <div>
                          <Label>{t('dash.name')}</Label>
                          <Input
                            value={editForm.name}
                            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>{t('dash.phone')}</Label>
                          <Input
                            value={editForm.phone}
                            onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>{t('dash.address')}</Label>
                          <Input
                            value={editForm.address}
                            onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                            className="mt-1"
                          />
                        </div>
                        {profile?.company?.accountType === 'persona' ? (
                          <>
                            <div>
                              <Label>{t('dash.docType')}</Label>
                              <select
                                value={editForm.documentType}
                                onChange={(e) => setEditForm(prev => ({ ...prev, documentType: e.target.value }))}
                                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                              >
                                <option value="">{t('dash.selectType')}</option>
                                <option value="CC">Cédula de Ciudadanía</option>
                                <option value="CE">Cédula de Extranjería</option>
                                <option value="Pasaporte">Pasaporte</option>
                              </select>
                            </div>
                            <div>
                              <Label>{t('dash.docNumber')}</Label>
                              <Input
                                value={editForm.documentNumber}
                                onChange={(e) => setEditForm(prev => ({ ...prev, documentNumber: e.target.value }))}
                                placeholder={t('dash.enterDocNumber')}
                                className="mt-1"
                              />
                            </div>
                          </>
                        ) : (
                          <div>
                            <Label>{t('dash.nit')}</Label>
                            <Input
                              value={editForm.nit}
                              onChange={(e) => setEditForm(prev => ({ ...prev, nit: e.target.value }))}
                              className="mt-1"
                            />
                          </div>
                        )}
                        <Button onClick={handleUpdateProfile} className="w-full">
                          {t('dash.saveChanges')}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

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
                  </div>
                </div>
              </div>
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