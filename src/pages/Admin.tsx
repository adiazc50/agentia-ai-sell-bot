import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Bot, LogOut, Users, CreditCard, Shield, Search, Building2, User, CalendarClock, CheckCircle, AlertTriangle, XCircle, Eye, Calendar, Edit2, X, Save, Plus, HelpCircle, MessageSquare, DollarSign, TrendingUp, RefreshCw, BarChart3, Play, Loader2, Wallet } from "lucide-react";
import FinancialDashboard from "@/components/FinancialDashboard";
import PaymentMethodSelector from "@/components/PaymentMethodSelector";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Label } from "@/components/ui/label";
import { api, isAuthenticated, getUser, logout as apiLogout } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { differenceInDays, startOfMonth, endOfMonth, format, isBefore, addDays, addMonths, parseISO, subMonths, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { es } from "date-fns/locale";

interface Profile {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  address: string | null;
  company_name: string | null;
  company_status: string | null;
  role_conversia: string | null;
  id_company: number | null;
  id_role: number | null;
  status: string | null;
  created_at: string;
  entry_date: string | null;
  last_plan_name: string | null;
  last_amount: number | null;
  last_currency: string | null;
  last_payment_date: string | null;
}

interface UserRole {
  id_user: number;
  role: "admin" | "moderator" | "user" | "support" | "vendedor";
}

interface Transaction {
  id: string;
  email: string;
  id_company: number | null;
  reference: string;
  plan_name: string;
  ai_responses_included: number | null;
  amount: number;
  currency: string;
  transaction_id: string | null;
  payment_method: string | null;
  transaction_date: string | null;
  status?: string;
  created_at: string;
}

interface SupportTicket {
  id: string;
  id_user: number;
  subject: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
}

interface TicketMessage {
  id: string;
  id_ticket: number;
  id_user: number;
  message: string;
  is_from_support: boolean;
  created_at: string;
}

interface SellerCommission {
  id: string;
  id_seller: number;
  id_transaction: number;
  id_user: number;
  plan_name: string;
  plan_type: string;
  transaction_amount: number;
  commission_month: number;
  commission_percentage: number;
  commission_amount: number;
  status: string;
  created_at: string;
  paid_at: string | null;
}

// Commission rates
const COMMISSION_RATES = {
  mensual: 10,
  anual: 5,
};

// Plans with prices in USD
const COMMISSION_PLANS = [
  { id: "starter", name: "Starter", precioUSD: 15 },
  { id: "mini", name: "Mini", precioUSD: 29 },
  { id: "basico", name: "Básico", precioUSD: 59 },
  { id: "plus", name: "Plus", precioUSD: 99 },
  { id: "enterprise", name: "Enterprise", precioUSD: 199 },
];
// Approximate TRM for commission calculations (admin context, no live TRM needed)
const APPROX_TRM = 4200;
const getPlanAmountCOP = (plan: typeof COMMISSION_PLANS[0], type: string): number => {
  const monthlyCOP = Math.round(plan.precioUSD * APPROX_TRM);
  if (type === "anual") return Math.round(monthlyCOP * 0.85) * 12;
  return monthlyCOP;
};

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [commissions, setCommissions] = useState<SellerCommission[]>([]);
  const [searchUser, setSearchUser] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [searchTransaction, setSearchTransaction] = useState("");
  const [searchTicket, setSearchTicket] = useState("");
  const [filterUser, setFilterUser] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterTicketStatus, setFilterTicketStatus] = useState<string>("all");
  const [historyModal, setHistoryModal] = useState<{ open: boolean; profile: Profile | null }>({ open: false, profile: null });
  const [editingStartDate, setEditingStartDate] = useState<number | null>(null);
  const [tempStartDate, setTempStartDate] = useState<string>("");
  const [newPaymentModal, setNewPaymentModal] = useState(false);
  const [newPayment, setNewPayment] = useState({
    email: "",
    plan_name: "mensual",
    package_name: "basico",
    amount: 150000,
    payment_method: "manual",
    status: "APPROVED",
  });
  const [creatingPayment, setCreatingPayment] = useState(false);
  const [syncingCommissions, setSyncingCommissions] = useState(false);
  const [commissionFilterYear, setCommissionFilterYear] = useState<string>(new Date().getFullYear().toString());
  const [commissionFilterMonth, setCommissionFilterMonth] = useState<string>("all");
  const [commissionFilterStatus, setCommissionFilterStatus] = useState<string>("all");
  const [cancellingCommission, setCancellingCommission] = useState<string | null>(null);
  const [subscriptionFilterYear, setSubscriptionFilterYear] = useState<string>(new Date().getFullYear().toString());
  const [subscriptionFilterMonth, setSubscriptionFilterMonth] = useState<string>("all");
  const [paySellerModal, setPaySellerModal] = useState<{ open: boolean; sellerId: number | null; sellerName: string; pendingAmount: number; pendingCommissions: SellerCommission[] }>({
    open: false,
    sellerId: null,
    sellerName: "",
    pendingAmount: 0,
    pendingCommissions: [],
  });
  const [payingSeller, setPayingSeller] = useState(false);
  const [newCommissionModal, setNewCommissionModal] = useState(false);
  const [newCommission, setNewCommission] = useState({
    id_seller: "",
    plan_name: "",
    plan_type: "mensual",
    transaction_amount: 0,
    commission_percentage: 10,
    commission_amount: 0,
    notes: "",
  });
  const [creatingCommission, setCreatingCommission] = useState(false);
  // Admin payment for user state
  const [adminPaymentModal, setAdminPaymentModal] = useState(false);
  const [adminPaymentPlan, setAdminPaymentPlan] = useState({ package: "basico", period: "mensual" as "mensual" | "semestral" | "anual" });
  const [adminPaymentLoading, setAdminPaymentLoading] = useState(false);
  const { exchangeRate } = useCurrency();

  const adminPaymentPricesUSD: Record<string, number> = { starter: 15, mini: 29, basico: 59, plus: 99, enterprise: 199 };
  const adminFixedCOP: Record<string, number> = { 'plan test': 1500 };

  const getAdminPaymentAmounts = () => {
    const pkg = adminPaymentPlan.package;
    const period = adminPaymentPlan.period;
    const discountMap = { mensual: 0, semestral: 0.10, anual: 0.15 };
    const monthsMap = { mensual: 1, semestral: 6, anual: 12 };
    const discount = discountMap[period];
    const months = monthsMap[period];

    if (adminFixedCOP[pkg]) {
      const cop = adminFixedCOP[pkg] * months;
      return { cop, usd: 0, isFixedCOP: true };
    }

    const trm = exchangeRate?.rate ?? 4200;
    const monthlyUSD = adminPaymentPricesUSD[pkg] || 59;
    const discountedUSD = Math.round(monthlyUSD * (1 - discount) * 100) / 100;
    const totalUSD = Math.round(discountedUSD * months * 100) / 100;
    const monthlyCOP = Math.round(monthlyUSD * trm);
    const discountedCOP = discount > 0 ? Math.round(monthlyCOP * (1 - discount)) : monthlyCOP;
    const totalCOP = discountedCOP * months;

    return { cop: totalCOP, usd: totalUSD, isFixedCOP: false };
  };

  const handleAdminInitiatePayment = () => {
    // Go directly to Wompi payment
    handleAdminWompiPayment();
  };

  const handleAdminWompiPayment = async () => {
    const targetProfile = userDetailModal.profile;
    if (!targetProfile) return;

    setAdminPaymentModal(false);
    setAdminPaymentLoading(true);

    try {
      const { cop } = getAdminPaymentAmounts();
      const suffixMap = { mensual: " - Mensual", semestral: " - Semestral", anual: " - Anual" };
      const planDisplayName = adminPaymentPlan.package.charAt(0).toUpperCase() + adminPaymentPlan.package.slice(1);
      const planName = planDisplayName + suffixMap[adminPaymentPlan.period];
      const reference = `admin-${adminPaymentPlan.package}-${adminPaymentPlan.period}-${Date.now()}`;
      const priceInCents = cop * 100;

      const signatureData = await api.payments.wompiSignature({ reference, amountInCents: priceInCents, currency: 'COP' });

      await api.admin.createTransaction({
        email: targetProfile.email,
        reference,
        plan_name: planName,
        amount: cop,
        currency: 'COP',
        status: 'PENDING',
      });

      const checkout = new (window as any).WidgetCheckout({
        currency: 'COP',
        amountInCents: priceInCents,
        reference,
        publicKey: signatureData.publicKey,
        signature: { integrity: signatureData.signature },
        redirectUrl: `${window.location.origin}/admin`,
        customerData: {
          email: targetProfile.email,
          fullName: targetProfile.name || targetProfile.company_name || targetProfile.email,
        },
      });

      checkout.open(async (result: any) => {
        const transaction = result.transaction;
        await api.admin.updateTransaction(reference, { status: transaction.status, wompi_transaction_id: transaction.id, payment_method: transaction.paymentMethod?.type });

        if (transaction.status === 'APPROVED') {
          toast({ title: "¡Pago exitoso!", description: `Plan ${planName} procesado correctamente.` });
        } else if (transaction.status === 'DECLINED') {
          toast({ title: "Pago rechazado", description: "El pago fue rechazado.", variant: "destructive" });
        }
        await loadData();
      });
    } catch (error) {
      console.error('Admin Wompi payment error:', error);
      toast({ title: "Error", description: "No se pudo procesar el pago con Wompi.", variant: "destructive" });
    } finally {
      setAdminPaymentLoading(false);
    }
  };

  const handleAdminPayPalPayment = async () => {
    const targetProfile = userDetailModal.profile;
    if (!targetProfile) return;

    setAdminPaymentModal(false);
    setAdminPaymentLoading(true);

    try {
      const discountMap = { mensual: 0, semestral: 0.10, anual: 0.15 };
      const discount = discountMap[adminPaymentPlan.period];
      const monthlyUSD = adminPaymentPricesUSD[adminPaymentPlan.package] || 59.9;
      const discountedMonthly = Math.round(monthlyUSD * (1 - discount) * 100) / 100;
      const basePlanName = adminPaymentPlan.package.charAt(0).toUpperCase() + adminPaymentPlan.package.slice(1);

      const data = await api.payments.paypalCreateSubscription({
        plan_name: basePlanName,
        billing_period: adminPaymentPlan.period,
        amount_usd: discountedMonthly,
        email: targetProfile.email,
        return_url: `${window.location.origin}/admin?paypal=success`,
        cancel_url: `${window.location.origin}/admin?paypal=cancelled`,
      });

      if (!data?.approval_url) throw new Error('No se recibió URL de aprobación');

      window.open(data.approval_url, '_blank');
      toast({ title: "PayPal abierto", description: "Se abrió PayPal en una nueva pestaña para completar el pago." });
    } catch (error) {
      console.error('Admin PayPal payment error:', error);
      toast({ title: "Error", description: "No se pudo procesar el pago con PayPal.", variant: "destructive" });
    } finally {
      setAdminPaymentLoading(false);
    }
  };

  const [runningCronJob, setRunningCronJob] = useState(false);

  const handleRunRecurringPayments = async () => {
    setRunningCronJob(true);
    try {
      const data = await api.payments.processRecurringPayments();

      toast({
        title: "Débitos procesados",
        description: `Se procesaron ${data?.processed || 0} suscripciones. ${data?.results?.filter((r: any) => r.status === 'approved').length || 0} aprobadas, ${data?.results?.filter((r: any) => r.status === 'failed').length || 0} fallidas.`,
      });

      // Refresh data
      const txData = await api.admin.transactions();
      if (txData) setTransactions(txData);
    } catch (err: any) {
      console.error('Error running recurring payments:', err);
      toast({
        title: "Error",
        description: err.message || "No se pudieron procesar los débitos automáticos",
        variant: "destructive",
      });
    } finally {
      setRunningCronJob(false);
    }
  };
  
  // Ticket messaging state
  const [viewTicketModal, setViewTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [ticketMessages, setTicketMessages] = useState<TicketMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  
  // User profile edit modal state
  const [userDetailModal, setUserDetailModal] = useState<{ open: boolean; profile: Profile | null }>({ open: false, profile: null });
  const [editingUserForm, setEditingUserForm] = useState({
    name: "",
    phone: "",
    city: "",
    address: "",
    email: "",
  });
  const [savingUser, setSavingUser] = useState(false);

  // Load Wompi script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.wompi.co/widget.js';
    script.async = true;
    document.body.appendChild(script);
    return () => { if (document.body.contains(script)) document.body.removeChild(script); };
  }, []);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!isAuthenticated()) {
        navigate("/auth");
        return;
      }

      const user = getUser();
      if (!user || user.roleConversia !== "admin") {
        toast({
          title: "Acceso denegado",
          description: "No tienes permisos de administrador.",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }

      await loadData();
      setLoading(false);
    };

    checkAdmin();
  }, [navigate, toast]);

  const loadData = async () => {
    try {
      const [profilesData, rolesData, txData, ticketData, commissionsData] = await Promise.all([
        api.admin.profiles(),
        api.admin.roles(),
        api.admin.transactions(),
        api.admin.tickets(),
        api.admin.commissions(),
      ]);

      setProfiles((profilesData as Profile[]) || []);
      setUserRoles((rolesData as UserRole[]) || []);
      setTransactions((txData as Transaction[]) || []);
      setTickets((ticketData as SupportTicket[]) || []);
      setCommissions((commissionsData as SellerCommission[]) || []);
    } catch (err) {
      console.error("Error loading admin data:", err);
    }
  };

  const syncCommissions = async () => {
    setSyncingCommissions(true);
    try {
      await api.payments.calculateCommissions();
      toast({
        title: "Sincronizado",
        description: "Las comisiones han sido calculadas.",
      });
      await loadData();
    } catch (err) {
      toast({
        title: "Error",
        description: "Error de conexión al sincronizar.",
        variant: "destructive",
      });
    } finally {
      setSyncingCommissions(false);
    }
  };

  const handleLogout = () => {
    apiLogout();
  };

  const getUserRole = (userId: number): string => {
    const profile = profiles.find(p => p.id === userId);
    return profile?.role_conversia || "user";
  };

  const roleNameToId: Record<string, number> = { admin: 1, moderator: 2, user: 3, support: 4, vendedor: 5 };

  const handleRoleChange = async (userId: number, newRole: "admin" | "moderator" | "user" | "support" | "vendedor") => {
    try {
      await api.admin.updateRole({ idUser: userId, idRoleConversia: roleNameToId[newRole] });

      toast({
        title: "Rol actualizado",
        description: `El usuario ahora es ${newRole}.`,
      });

      await loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el rol.",
        variant: "destructive",
      });
    }
  };

  const handleSellerChange = async (userId: string, sellerId: string | null) => {
    try {
      await api.admin.updateProfileSeller(userId, { id_seller: sellerId });

      toast({
        title: "Vendedor actualizado",
        description: sellerId ? "Vendedor asignado correctamente." : "Vendedor removido.",
      });

      await loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el vendedor asignado.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStartDate = async (profileId: number, startDate: string) => {
    const dateValue = startDate ? new Date(startDate + "T00:00:00").toISOString() : null;

    try {
      await api.admin.updateStartDate(String(profileId), { entryDate: dateValue });

      toast({
        title: "Fecha actualizada",
        description: "La fecha de implementación ha sido actualizada.",
      });

      setEditingStartDate(null);
      await loadData();
    } catch (error) {
      console.error("Error updating date:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la fecha de implementación.",
        variant: "destructive",
      });
    }
  };

  const handleCreatePayment = async () => {
    if (!newPayment.email) {
      toast({
        title: "Error",
        description: "Debes seleccionar un cliente.",
        variant: "destructive",
      });
      return;
    }

    setCreatingPayment(true);

    const reference = `MANUAL-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

    try {
      const selectedProfile = profiles.find(p => p.email === newPayment.email);
      await api.admin.createTransaction({
        email: selectedProfile?.email || "",
        id_company: selectedProfile?.id_company || null,
        plan_name: `${newPayment.plan_name} - ${newPayment.package_name}`,
        amount: newPayment.amount,
        payment_method: newPayment.payment_method,
        status: newPayment.status,
        reference,
        currency: "COP",
      });

      toast({
        title: "Pago creado",
        description: "El pago se ha registrado correctamente.",
      });
    } catch (error: any) {
      console.error("Error creating payment:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el pago: " + (error.message || "Error desconocido"),
        variant: "destructive",
      });
      setCreatingPayment(false);
      return;
    }

    setCreatingPayment(false);

    setNewPaymentModal(false);
    setNewPayment({
      email: "",
      plan_name: "mensual",
      package_name: "basico",
      amount: 150000,
      payment_method: "manual",
      status: "APPROVED",
    });
    await loadData();
  };

  const handleOpenUserDetail = (profile: Profile) => {
    setEditingUserForm({
      name: profile.name || "",
      phone: profile.phone || "",
      city: profile.city || "",
      address: profile.address || "",
      email: profile.email || "",
    });
    setUserDetailModal({ open: true, profile });
  };

  const handleSaveUserProfile = async () => {
    if (!userDetailModal.profile) return;
    
    setSavingUser(true);
    
    try {
      await api.admin.updateProfile(String(userDetailModal.profile.id), {
        name: editingUserForm.name || null,
        phone: editingUserForm.phone || null,
        city: editingUserForm.city || null,
        address: editingUserForm.address || null,
      });

      toast({
        title: "Perfil actualizado",
        description: "Los datos del usuario han sido guardados correctamente.",
      });

      setUserDetailModal({ open: false, profile: null });
      await loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil del usuario",
        variant: "destructive",
      });
    } finally {
      setSavingUser(false);
    }
  };

  const getProfileName = (profileId: number | string): string => {
    const id = Number(profileId);
    const profile = profiles.find(p => p.id === id);
    if (!profile) return "Usuario desconocido";
    return profile.name || profile.company_name || "Usuario";
  };

  const getProfileEmail = (profileId: number | string): string => {
    const id = Number(profileId);
    const profile = profiles.find(p => p.id === id);
    return profile?.email || "";
  };

  const getProfileByEmail = (email: string): Profile | undefined => {
    return profiles.find(p => p.email === email);
  };

  const getUserTransactions = (profileId: number | string) => {
    const id = Number(profileId);
    const profile = profiles.find(p => p.id === id);
    if (!profile) return [];
    return transactions
      .filter(tx => tx.email === profile.email || tx.id_company === profile.id_company)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  const filteredProfiles = profiles.filter(p => {
    const name = (p.name || p.company_name || "").toLowerCase();
    const matchesSearch = name.includes(searchUser.toLowerCase()) ||
           p.email.toLowerCase().includes(searchUser.toLowerCase());
    const matchesRole = filterRole === "all" || (p.role_conversia || "user") === filterRole;
    return matchesSearch && matchesRole;
  });

  const filteredTransactions = transactions.filter(tx => {
    const txProfile = getProfileByEmail(tx.email);
    const txProfileName = txProfile ? (txProfile.name || txProfile.company_name || "") : "";
    const matchesSearch =
      (tx.reference || "").toLowerCase().includes(searchTransaction.toLowerCase()) ||
      (tx.plan_name || "").toLowerCase().includes(searchTransaction.toLowerCase()) ||
      txProfileName.toLowerCase().includes(searchTransaction.toLowerCase()) ||
      (tx.email || "").toLowerCase().includes(searchTransaction.toLowerCase());

    const matchesUserFilter = filterUser === "all" || (txProfile && String(txProfile.id) === filterUser);
    const matchesStatusFilter = filterStatus === "all" || tx.status === filterStatus;

    return matchesSearch && matchesUserFilter && matchesStatusFilter;
  });

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchTicket.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTicket.toLowerCase());

    const matchesStatusFilter = filterTicketStatus === "all" || ticket.status === filterTicketStatus;

    return matchesSearch && matchesStatusFilter;
  });

  const handleUpdateTicketStatus = async (ticketId: string, newStatus: string) => {
    try {
      await api.admin.updateTicketStatus(ticketId, { status: newStatus });
      toast({
        title: "Éxito",
        description: "Estado del ticket actualizado"
      });
      await loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del ticket",
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
      const messages = await api.admin.ticketMessages(ticket.id);
      setTicketMessages((messages as TicketMessage[]) || []);
    } catch (error) {
      setTicketMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendAdminMessage = async () => {
    if (!selectedTicket || !newMessage.trim() || selectedTicket.status === "closed") return;

    const user = getUser();
    if (!user) return;

    try {
      await api.admin.sendTicketMessage({
        id_ticket: selectedTicket.id,
        id_user: user.id,
        message: newMessage.trim(),
        is_from_support: true
      });

      setNewMessage("");
      // Refresh messages
      const messages = await api.admin.ticketMessages(selectedTicket.id);
      setTicketMessages((messages as TicketMessage[]) || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje",
        variant: "destructive"
      });
    }
  };

  // Subscription status calculation
  const subscriptionData = useMemo(() => {
    const now = new Date();

    return profiles.map(profile => {
      const lastPaymentDate = profile.last_payment_date ? new Date(profile.last_payment_date) : null;

      // Build a lastPayment-like object from profile fields
      const lastPayment = profile.last_plan_name ? {
        plan_name: profile.last_plan_name,
        amount: profile.last_amount || 0,
        currency: profile.last_currency || 'COP',
        created_at: profile.last_payment_date || '',
      } : null;

      // Implementation date is fixed — date of monthly billing cycle, never changes
      const implementationDate = profile.entry_date
        ? parseISO(profile.entry_date)
        : null;

      // Count approved payments for this user
      const totalPayments = transactions.filter(tx => tx.email === profile.email).length;

      // Subscription end = entryDate + N months (N = total payments)
      // E.g. implemented 14 mar + 2 payments = expires 14 may
      const subscriptionEndDate = implementationDate && totalPayments > 0
        ? addMonths(implementationDate, totalPayments)
        : null;

      // Calculate status
      let daysOverdue = 0;
      let status: "paid" | "expiring" | "pending" | "overdue" | "inactive" = "inactive";

      if (!implementationDate) {
        status = lastPaymentDate ? "pending" : "inactive";
      } else if (!subscriptionEndDate) {
        status = "inactive";
      } else if (isBefore(now, subscriptionEndDate)) {
        const daysLeft = differenceInDays(subscriptionEndDate, now);
        status = daysLeft <= 7 ? "expiring" : "paid";
      } else {
        daysOverdue = differenceInDays(now, subscriptionEndDate);
        status = "overdue";
      }

      return {
        profile,
        lastPayment,
        lastPaymentDate,
        implementationDate,
        subscriptionEndDate,
        daysOverdue,
        status,
        totalPayments,
      };
    });
  }, [profiles, transactions]);

  const paidCount = subscriptionData.filter(s => s.status === "paid").length;
  const overdueCount = subscriptionData.filter(s => s.status === "overdue").length;
  const pendingCount = subscriptionData.filter(s => s.status === "pending").length;

  const filteredCommissions = useMemo(() => {
    return commissions.filter(c => {
      const commissionDate = new Date(c.created_at);
      const matchesYear = commissionDate.getFullYear().toString() === commissionFilterYear;
      const matchesMonth = commissionFilterMonth === "all" || (commissionDate.getMonth() + 1).toString() === commissionFilterMonth;
      const matchesStatus = commissionFilterStatus === "all" || c.status === commissionFilterStatus;
      return matchesYear && matchesMonth && matchesStatus;
    });
  }, [commissions, commissionFilterYear, commissionFilterMonth, commissionFilterStatus]);

  const commissionSummary = useMemo(() => {
    const pending = filteredCommissions
      .filter(c => c.status === "pending")
      .reduce((sum, c) => sum + c.commission_amount, 0);
    const paid = filteredCommissions
      .filter(c => c.status === "paid")
      .reduce((sum, c) => sum + c.commission_amount, 0);
    const cancelled = filteredCommissions
      .filter(c => c.status === "cancelled")
      .reduce((sum, c) => sum + c.commission_amount, 0);

    // Total Activo = pagadas + pendientes (pendientes puede ser negativo para descontar)
    return { pending, paid, cancelled, total: paid + pending };
  }, [filteredCommissions]);

  const handleCancelCommission = async (commission: SellerCommission) => {
    setCancellingCommission(commission.id);
    try {
      const originalAmount = Math.abs(commission.commission_amount);
      const formattedAmount = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      }).format(originalAmount);

      await api.admin.cancelCommission(commission.id, {
        commission,
        originalAmount,
        formattedAmount,
      });

      if (commission.status === "paid") {
        const negativeAmount = -originalAmount;
        toast({
          title: "Comisión revertida",
          description: `Se creó un saldo pendiente de ${new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
          }).format(negativeAmount)} para descontar en el próximo pago.`,
        });
      } else {
        toast({
          title: "Comisión cancelada",
          description: "La comisión fue cancelada (saldo 0).",
        });
      }

      await loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cancelar la comisión.",
        variant: "destructive",
      });
    } finally {
      setCancellingCommission(null);
    }
  };

  const handlePaySeller = async () => {
    if (!paySellerModal.sellerId || paySellerModal.pendingCommissions.length === 0) return;
    
    setPayingSeller(true);
    try {
      const commissionIds = paySellerModal.pendingCommissions.map(c => c.id);

      await api.admin.payCommissions({ ids: commissionIds });

      toast({
        title: "Pago registrado",
        description: `Se pagaron ${commissionIds.length} comisiones por ${new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(paySellerModal.pendingAmount)}`,
      });

      setPaySellerModal({ open: false, sellerId: null, sellerName: "", pendingAmount: 0, pendingCommissions: [] });
      await loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo registrar el pago.",
        variant: "destructive",
      });
    } finally {
      setPayingSeller(false);
    }
  };

  const handleCreateCommission = async () => {
    if (!newCommission.id_seller || newCommission.commission_amount === 0) {
      toast({
        title: "Error",
        description: "Debes seleccionar un vendedor y especificar un monto de comisión.",
        variant: "destructive",
      });
      return;
    }

    setCreatingCommission(true);
    try {
      await api.admin.createCommission({
        id_seller: newCommission.id_seller,
        id_transaction: crypto.randomUUID(),
        id_user: newCommission.id_seller,
        plan_name: newCommission.plan_name || "Manual",
        plan_type: newCommission.plan_type,
        transaction_amount: newCommission.transaction_amount,
        commission_month: 1,
        commission_percentage: newCommission.commission_percentage,
        commission_amount: newCommission.commission_amount,
        status: "pending",
        notes: newCommission.notes || "Comisión creada manualmente",
      });

      toast({
        title: "Comisión creada",
        description: `Se creó una comisión de ${new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(newCommission.commission_amount)}`,
      });

      setNewCommissionModal(false);
      setNewCommission({
        id_seller: "",
        plan_name: "",
        plan_type: "mensual",
        transaction_amount: 0,
        commission_percentage: 10,
        commission_amount: 0,
        notes: "",
      });
      await loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la comisión.",
        variant: "destructive",
      });
    } finally {
      setCreatingCommission(false);
    }
  };

  const availableCommissionYears = useMemo(() => {
    const years = new Set(commissions.map(c => new Date(c.created_at).getFullYear()));
    years.add(new Date().getFullYear());
    return Array.from(years).sort((a, b) => b - a);
  }, [commissions]);

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
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Bot className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold gradient-text">Agent IA</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
              Admin
            </span>
          </div>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar sesión
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="glass-card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Usuarios</p>
                  <p className="text-xl font-bold">{profiles.length}</p>
                </div>
              </div>
            </div>
            <div className="glass-card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Al Día</p>
                  <p className="text-xl font-bold text-green-400">{paidCount}</p>
                </div>
              </div>
            </div>
            <div className="glass-card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <CalendarClock className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Por Vencer</p>
                  <p className="text-xl font-bold text-yellow-400">{pendingCount}</p>
                </div>
              </div>
            </div>
            <div className="glass-card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">En Mora</p>
                  <p className="text-xl font-bold text-red-400">{overdueCount}</p>
                </div>
              </div>
            </div>
            <div className="glass-card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Admins</p>
                  <p className="text-xl font-bold">{profiles.filter(p => p.role_conversia === "admin").length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="subscriptions" className="space-y-6">
            <TabsList className="bg-secondary flex-wrap">
              <TabsTrigger value="subscriptions" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <CalendarClock className="w-4 h-4 mr-2" />
                Suscripciones
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Users className="w-4 h-4 mr-2" />
                Usuarios
              </TabsTrigger>
              <TabsTrigger value="transactions" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <CreditCard className="w-4 h-4 mr-2" />
                Transacciones
              </TabsTrigger>
              <TabsTrigger value="tickets" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <HelpCircle className="w-4 h-4 mr-2" />
                Soporte ({tickets.filter(t => t.status === "open").length})
              </TabsTrigger>
              <TabsTrigger value="sellers" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <DollarSign className="w-4 h-4 mr-2" />
                Vendedores
              </TabsTrigger>
              <TabsTrigger value="financial" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <BarChart3 className="w-4 h-4 mr-2" />
                Resumen Financiero
              </TabsTrigger>
            </TabsList>

            {/* Subscriptions Tab */}
            <TabsContent value="subscriptions">
              <div className="glass-card p-6">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nombre o email..."
                      value={searchUser}
                      onChange={(e) => setSearchUser(e.target.value)}
                      className="pl-10 bg-secondary border-border"
                    />
                  </div>
                  <Select value={filterUser} onValueChange={setFilterUser}>
                    <SelectTrigger className="w-40 bg-secondary border-border">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="paid">Al día</SelectItem>
                      <SelectItem value="expiring">Por vencer</SelectItem>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="overdue">En mora</SelectItem>
                      <SelectItem value="inactive">Sin pagos</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={subscriptionFilterYear} onValueChange={setSubscriptionFilterYear}>
                    <SelectTrigger className="w-28 bg-secondary border-border">
                      <SelectValue placeholder="Año" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(5)].map((_, i) => {
                        const year = new Date().getFullYear() - i;
                        return <SelectItem key={year} value={year.toString()}>{year}</SelectItem>;
                      })}
                    </SelectContent>
                  </Select>
                  <Select value={subscriptionFilterMonth} onValueChange={setSubscriptionFilterMonth}>
                    <SelectTrigger className="w-36 bg-secondary border-border">
                      <SelectValue placeholder="Mes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los meses</SelectItem>
                      <SelectItem value="1">Enero</SelectItem>
                      <SelectItem value="2">Febrero</SelectItem>
                      <SelectItem value="3">Marzo</SelectItem>
                      <SelectItem value="4">Abril</SelectItem>
                      <SelectItem value="5">Mayo</SelectItem>
                      <SelectItem value="6">Junio</SelectItem>
                      <SelectItem value="7">Julio</SelectItem>
                      <SelectItem value="8">Agosto</SelectItem>
                      <SelectItem value="9">Septiembre</SelectItem>
                      <SelectItem value="10">Octubre</SelectItem>
                      <SelectItem value="11">Noviembre</SelectItem>
                      <SelectItem value="12">Diciembre</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleRunRecurringPayments}
                    disabled={runningCronJob}
                    variant="outline"
                    className="border-primary/50 text-primary hover:bg-primary/10"
                  >
                    {runningCronJob ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4 mr-2" />
                    )}
                    {runningCronJob ? "Procesando..." : "Ejecutar Débitos"}
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Usuario</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Plan</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Último Pago</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Implementación</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Vencimiento</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Estado</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Mora</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscriptionData
                        .filter(s => {
                          // Exclude admins from subscriptions
                          if (s.profile.role_conversia === "admin") return false;

                          const matchesSearch =
                            (s.profile.name || s.profile.company_name || "").toLowerCase().includes(searchUser.toLowerCase()) ||
                            s.profile.email.toLowerCase().includes(searchUser.toLowerCase());

                          // Filter by subscription status (paid, pending, overdue, inactive)
                          const matchesStatus = filterUser === "all" || s.status === filterUser;

                          // Filter by payment period (month/year)
                          let matchesPaymentPeriod = true;

                          // Only apply payment period filter if a specific month is selected
                          if (subscriptionFilterMonth !== "all") {
                            const filterMonth = parseInt(subscriptionFilterMonth);
                            const filterYear = parseInt(subscriptionFilterYear);

                            // Get all approved transactions for this user
                            const userApprovedTx = transactions.filter(
                              tx => (tx.email === s.profile.email || tx.id_company === s.profile.id_company) && tx.status === "APPROVED"
                            );
                            
                            // Check if user has ANY payment in the selected month/year
                            matchesPaymentPeriod = userApprovedTx.some(tx => {
                              const txDate = new Date(tx.created_at);
                              return txDate.getMonth() + 1 === filterMonth && txDate.getFullYear() === filterYear;
                            });
                          }
                          // If "Todos los meses" is selected, show all users regardless of payments
                          
                          return matchesSearch && matchesStatus && matchesPaymentPeriod;
                        })
                        .sort((a, b) => {
                          // Sort alphabetically by name
                          const nameA = (a.profile.name || a.profile.email || '').toLowerCase();
                          const nameB = (b.profile.name || b.profile.email || '').toLowerCase();
                          return nameA.localeCompare(nameB, 'es');
                        })
                        .map((sub) => (
                          <tr key={sub.profile.id} className="border-b border-border/50 hover:bg-secondary/50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  sub.status === "paid" ? "bg-green-500/20" :
                                  sub.status === "expiring" ? "bg-yellow-500/20" :
                                  sub.status === "overdue" ? "bg-red-500/20" :
                                  sub.status === "pending" ? "bg-yellow-500/20" :
                                  "bg-muted"
                                }`}>
                                  {sub.profile.company_name ? (
                                    <Building2 className={`w-5 h-5 ${
                                      sub.status === "paid" ? "text-green-400" :
                                      sub.status === "expiring" ? "text-yellow-400" :
                                      sub.status === "overdue" ? "text-red-400" :
                                      sub.status === "pending" ? "text-yellow-400" :
                                      "text-muted-foreground"
                                    }`} />
                                  ) : (
                                    <User className={`w-5 h-5 ${
                                      sub.status === "paid" ? "text-green-400" :
                                      sub.status === "expiring" ? "text-yellow-400" :
                                      sub.status === "overdue" ? "text-red-400" :
                                      sub.status === "pending" ? "text-yellow-400" :
                                      "text-muted-foreground"
                                    }`} />
                                  )}
                                </div>
                                <div>
                                  <span className="font-medium block">
                                    {sub.profile.name || sub.profile.company_name || sub.profile.email}
                                  </span>
                                  <span className="text-xs text-muted-foreground">{sub.profile.email}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 capitalize">
                              {sub.lastPayment?.plan_name || <span className="text-muted-foreground">-</span>}
                            </td>
                            {/* Último Pago - No editable */}
                            <td className="py-3 px-4">
                              {sub.lastPaymentDate 
                                ? format(sub.lastPaymentDate, "dd MMM yyyy", { locale: es })
                                : <span className="text-muted-foreground">-</span>
                              }
                            </td>
                            {/* Fecha Implementación - Editable */}
                            <td className="py-3 px-4">
                              {editingStartDate === sub.profile.id ? (
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="date"
                                    value={tempStartDate}
                                    onChange={(e) => setTempStartDate(e.target.value)}
                                    className="w-36 h-8 text-sm"
                                  />
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7"
                                    onClick={() => handleUpdateStartDate(sub.profile.id, tempStartDate)}
                                  >
                                    <Save className="w-4 h-4 text-green-400" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7"
                                    onClick={() => setEditingStartDate(null)}
                                  >
                                    <X className="w-4 h-4 text-red-400" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  {sub.profile.entry_date ? (
                                    <span className="text-primary font-medium">
                                      {format(parseISO(sub.profile.entry_date), "dd MMM yyyy", { locale: es })}
                                    </span>
                                  ) : (
                                    <span className="text-muted-foreground italic text-sm">Sin asignar</span>
                                  )}
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7"
                                    onClick={() => {
                                      setEditingStartDate(sub.profile.id);
                                      setTempStartDate(
                                        sub.profile.entry_date 
                                          ? sub.profile.entry_date.split('T')[0]
                                          : format(new Date(), "yyyy-MM-dd")
                                      );
                                    }}
                                  >
                                    <Edit2 className="w-3 h-3 text-muted-foreground" />
                                  </Button>
                                </div>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {sub.subscriptionEndDate
                                ? format(sub.subscriptionEndDate, "dd MMM yyyy", { locale: es })
                                : <span className="text-muted-foreground">-</span>
                              }
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                                sub.status === "paid"
                                  ? "bg-green-500/20 text-green-400"
                                  : sub.status === "expiring"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : sub.status === "pending"
                                      ? "bg-blue-500/20 text-blue-400"
                                      : sub.status === "overdue"
                                        ? "bg-red-500/20 text-red-400"
                                        : "bg-muted text-muted-foreground"
                              }`}>
                                {sub.status === "paid" && <CheckCircle className="w-3 h-3" />}
                                {sub.status === "expiring" && <CalendarClock className="w-3 h-3" />}
                                {sub.status === "pending" && <CalendarClock className="w-3 h-3" />}
                                {sub.status === "overdue" && <AlertTriangle className="w-3 h-3" />}
                                {sub.status === "inactive" && <XCircle className="w-3 h-3" />}
                                {sub.status === "paid" ? "Al día" :
                                 sub.status === "expiring" ? "Por vencer" :
                                 sub.status === "pending" ? "Pendiente" :
                                 sub.status === "overdue" ? "En mora" : "Sin pagos"}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {sub.status === "overdue" ? (
                                <span className="text-red-400 font-bold">
                                  {sub.daysOverdue} días
                                </span>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setHistoryModal({ open: true, profile: sub.profile })}
                                title="Ver historial"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users">
              <div className="glass-card p-6">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nombre o email..."
                      value={searchUser}
                      onChange={(e) => setSearchUser(e.target.value)}
                      className="pl-10 bg-secondary border-border"
                    />
                  </div>
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-44 bg-secondary border-border">
                      <SelectValue placeholder="Filtrar por rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los roles</SelectItem>
                      <SelectItem value="user">Usuarios</SelectItem>
                      <SelectItem value="admin">Admins</SelectItem>
                      <SelectItem value="vendedor">Vendedores</SelectItem>
                      <SelectItem value="support">Soporte</SelectItem>
                      <SelectItem value="moderator">Moderadores</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Usuario</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Empresa</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Email</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Ciudad</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Vendedor</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Registro</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Rol</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProfiles.map((profile) => {
                        return (
                          <tr key={profile.id} className="border-b border-border/50 hover:bg-secondary/50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                  {profile.company_name ? (
                                    <Building2 className="w-5 h-5 text-primary-foreground" />
                                  ) : (
                                    <User className="w-5 h-5 text-primary-foreground" />
                                  )}
                                </div>
                                <span>
                                  {profile.name || profile.company_name || profile.email}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4">{profile.company_name || "-"}</td>
                            <td className="py-3 px-4">{profile.email}</td>
                            <td className="py-3 px-4">{profile.city || "-"}</td>
                            <td className="py-3 px-4 text-muted-foreground">-</td>
                            <td className="py-3 px-4">
                              {new Date(profile.created_at).toLocaleDateString("es-CO")}
                            </td>
                            <td className="py-3 px-4">
                              <Select
                                value={profile.role_conversia || "user"}
                                onValueChange={(value) => handleRoleChange(profile.id, value as "admin" | "moderator" | "user" | "support" | "vendedor")}
                              >
                                <SelectTrigger className="w-32 bg-secondary border-border">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="user">Usuario</SelectItem>
                                  <SelectItem value="vendedor">Vendedor</SelectItem>
                                  <SelectItem value="support">Soporte</SelectItem>
                                  <SelectItem value="moderator">Moderador</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="py-3 px-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenUserDetail(profile)}
                                className="gap-1"
                              >
                                <Eye className="w-4 h-4" />
                                Ver / Editar
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Transactions Tab */}
            <TabsContent value="transactions">
              <div className="glass-card p-6">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por referencia, plan o usuario..."
                      value={searchTransaction}
                      onChange={(e) => setSearchTransaction(e.target.value)}
                      className="pl-10 bg-secondary border-border"
                    />
                  </div>
                  <Select value={filterUser} onValueChange={setFilterUser}>
                    <SelectTrigger className="w-64 bg-secondary border-border">
                      <SelectValue placeholder="Filtrar por usuario" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los usuarios</SelectItem>
                      {profiles.map((profile) => (
                        <SelectItem key={profile.id} value={String(profile.id)}>
                          {profile.name || profile.company_name || profile.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40 bg-secondary border-border">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="APPROVED">Aprobado</SelectItem>
                      <SelectItem value="PENDING">Pendiente</SelectItem>
                      <SelectItem value="DECLINED">Rechazado</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={() => setNewPaymentModal(true)} className="ml-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Pago
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Fecha</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Usuario</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Referencia</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Plan</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Monto</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-muted-foreground">
                            No hay transacciones registradas
                          </td>
                        </tr>
                      ) : (
                        filteredTransactions.map((tx) => (
                          <tr key={tx.id} className="border-b border-border/50 hover:bg-secondary/50">
                            <td className="py-3 px-4">
                              {new Date(tx.created_at).toLocaleDateString("es-CO", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </td>
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-medium">{getProfileByEmail(tx.email)?.name || getProfileByEmail(tx.email)?.company_name || tx.email}</p>
                                <p className="text-sm text-muted-foreground">{tx.email}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-mono text-sm">{tx.reference}</td>
                            <td className="py-3 px-4 capitalize">{tx.plan_name}</td>
                            <td className="py-3 px-4">
                              ${Number(tx.amount).toLocaleString("es-CO")} {tx.currency}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                tx.status === "APPROVED" 
                                  ? "bg-green-500/20 text-green-400"
                                  : tx.status === "PENDING"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : "bg-red-500/20 text-red-400"
                              }`}>
                                {tx.status === "APPROVED" ? "Aprobado" : tx.status === "PENDING" ? "Pendiente" : "Rechazado"}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Support Tickets Tab */}
            <TabsContent value="tickets">
              <div className="glass-card p-6">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por asunto o usuario..."
                      value={searchTicket}
                      onChange={(e) => setSearchTicket(e.target.value)}
                      className="pl-10 bg-secondary border-border"
                    />
                  </div>
                  <Select value={filterTicketStatus} onValueChange={setFilterTicketStatus}>
                    <SelectTrigger className="w-40 bg-secondary border-border">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="open">Abierto</SelectItem>
                      <SelectItem value="in_progress">En Proceso</SelectItem>
                      <SelectItem value="closed">Cerrado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {filteredTickets.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No hay tickets de soporte</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredTickets.map((ticket) => (
                      <div 
                        key={ticket.id} 
                        className="border border-border rounded-lg p-4 cursor-pointer hover:border-primary/50 transition-colors"
                        onClick={() => handleOpenTicket(ticket)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium">{ticket.subject}</h4>
                            <p className="text-sm text-muted-foreground">
                              {getProfileName(ticket.id_user)} - {getProfileEmail(ticket.id_user)}
                            </p>
                          </div>
                          <div className="flex gap-2 items-center" onClick={(e) => e.stopPropagation()}>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              ticket.priority === "high" 
                                ? "bg-red-500/20 text-red-400"
                                : ticket.priority === "medium"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-blue-500/20 text-blue-400"
                            }`}>
                              {ticket.priority === "high" ? "Alta" : ticket.priority === "medium" ? "Media" : "Baja"}
                            </span>
                            <Select 
                              value={ticket.status} 
                              onValueChange={(val) => handleUpdateTicketStatus(ticket.id, val)}
                            >
                              <SelectTrigger className="w-32 h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="open">Abierto</SelectItem>
                                <SelectItem value="in_progress">En Proceso</SelectItem>
                                <SelectItem value="closed">Cerrado</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{ticket.description}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">
                            Creado: {new Date(ticket.created_at).toLocaleDateString("es-CO")}
                          </p>
                          <span className="text-xs text-primary">Click para ver conversación →</span>
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
                        <div className="flex gap-2 items-center" onClick={(e) => e.stopPropagation()}>
                          <Select 
                            value={selectedTicket?.status || "open"} 
                            onValueChange={(val) => {
                              if (selectedTicket) {
                                handleUpdateTicketStatus(selectedTicket.id, val);
                                setSelectedTicket({ ...selectedTicket, status: val });
                              }
                            }}
                          >
                            <SelectTrigger className="w-32 h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="open">Abierto</SelectItem>
                              <SelectItem value="in_progress">En Proceso</SelectItem>
                              <SelectItem value="closed">Cerrado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </DialogTitle>
                    </DialogHeader>
                    
                    {/* User info */}
                    <div className="text-sm text-muted-foreground mb-2">
                      Usuario: {selectedTicket ? getProfileName(selectedTicket.id_user) : ""} ({selectedTicket ? getProfileEmail(selectedTicket.id_user) : ""})
                    </div>
                    
                    {/* Original description */}
                    <div className="bg-secondary/50 rounded-lg p-3 mb-4">
                      <p className="text-xs text-muted-foreground mb-1">Descripción original:</p>
                      <p className="text-sm">{selectedTicket?.description}</p>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto space-y-3 min-h-[200px] max-h-[300px] border border-border rounded-lg p-3">
                      {loadingMessages ? (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-muted-foreground">Cargando mensajes...</span>
                        </div>
                      ) : ticketMessages.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-muted-foreground text-sm">No hay mensajes aún. Escribe el primero.</span>
                        </div>
                      ) : (
                        ticketMessages.map((msg) => (
                          <div 
                            key={msg.id} 
                            className={`flex ${msg.is_from_support ? "justify-end" : "justify-start"}`}
                          >
                            <div className={`max-w-[80%] rounded-lg p-3 ${
                              msg.is_from_support 
                                ? "bg-primary/20 border border-primary/30" 
                                : "bg-secondary border border-border"
                            }`}>
                              <p className="text-xs text-muted-foreground mb-1">
                                {msg.is_from_support ? "Soporte" : "Usuario"} • {new Date(msg.created_at).toLocaleString("es-CO")}
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
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Escribe una respuesta..."
                          className="flex-1"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSendAdminMessage();
                            }
                          }}
                        />
                        <Button onClick={handleSendAdminMessage} disabled={!newMessage.trim()}>
                          Enviar
                        </Button>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center mt-4 p-3 bg-muted rounded-md">
                        Este ticket está cerrado. No se pueden agregar más mensajes.
                      </p>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </TabsContent>

            {/* Sellers Tab */}
            <TabsContent value="sellers">
              <div className="space-y-6">
                {/* Sellers Summary */}
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Resumen de Vendedores
                    </h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={syncCommissions}
                      disabled={syncingCommissions}
                      className="gap-2"
                    >
                      <RefreshCw className={`w-4 h-4 ${syncingCommissions ? 'animate-spin' : ''}`} />
                      {syncingCommissions ? 'Sincronizando...' : 'Sincronizar Comisiones'}
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-secondary/50 rounded-lg p-4">
                      <p className="text-muted-foreground text-sm">Total Vendedores</p>
                      <p className="text-2xl font-bold text-foreground">
                        {profiles.filter(p => p.role_conversia === "vendedor").length}
                      </p>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-4">
                      <p className="text-muted-foreground text-sm">Comisiones Pendientes</p>
                      <p className="text-2xl font-bold text-yellow-400">
                        {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 })
                          .format(commissions.filter(c => c.status === "pending").reduce((sum, c) => sum + c.commission_amount, 0))}
                      </p>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-4">
                      <p className="text-muted-foreground text-sm">Comisiones Pagadas</p>
                      <p className="text-2xl font-bold text-green-400">
                        {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 })
                          .format(commissions.filter(c => c.status === "paid").reduce((sum, c) => sum + c.commission_amount, 0))}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sellers List */}
                <div className="glass-card p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Vendedores y Clientes Asignados
                  </h3>
                  <div className="space-y-4">
                    {profiles.filter(p => p.role_conversia === "vendedor").map((seller) => {
                      const assignedClients: Profile[] = [];
                      const sellerCommissions = commissions.filter(c => c.id_seller === seller.id);
                      const pendingAmount = sellerCommissions.filter(c => c.status === "pending").reduce((sum, c) => sum + c.commission_amount, 0);
                      const paidAmount = sellerCommissions.filter(c => c.status === "paid").reduce((sum, c) => sum + c.commission_amount, 0);
                      
                      return (
                        <div key={seller.id} className="border border-border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                <User className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium text-foreground">
                                  {seller.name || seller.company_name || seller.email}
                                </p>
                                <p className="text-sm text-muted-foreground">{seller.email}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Clientes asignados</p>
                              <p className="text-xl font-bold text-primary">{assignedClients.length}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div className="bg-yellow-500/10 rounded p-2">
                              <p className="text-xs text-yellow-400">Comisiones Pendientes</p>
                              <p className={`font-semibold ${pendingAmount < 0 ? "text-red-400" : "text-yellow-400"}`}>
                                {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(pendingAmount)}
                              </p>
                            </div>
                            <div className="bg-green-500/10 rounded p-2">
                              <p className="text-xs text-green-400">Comisiones Pagadas</p>
                              <p className="font-semibold text-green-400">
                                {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(paidAmount)}
                              </p>
                            </div>
                          </div>

                          {/* Botón de pagar - solo si hay saldo positivo */}
                          {pendingAmount > 0 && (
                            <div className="mb-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const pendingComms = sellerCommissions.filter(c => c.status === "pending" && c.commission_amount > 0);
                                  const sellerName = seller.name || seller.company_name || seller.email;
                                  setPaySellerModal({
                                    open: true,
                                    sellerId: seller.id,
                                    sellerName,
                                    pendingAmount,
                                    pendingCommissions: pendingComms,
                                  });
                                }}
                                className="w-full text-green-400 border-green-400 hover:bg-green-400/20 gap-2"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Pagar Comisiones ({new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(pendingAmount)})
                              </Button>
                            </div>
                          )}

                          {assignedClients.length > 0 && (
                            <div className="border-t border-border pt-3">
                              <p className="text-sm text-muted-foreground mb-2">Clientes:</p>
                              <div className="flex flex-wrap gap-2">
                                {assignedClients.slice(0, 5).map((client) => (
                                  <span key={client.id} className="bg-secondary px-2 py-1 rounded text-xs text-foreground">
                                    {client.name || client.company_name || client.email}
                                  </span>
                                ))}
                                {assignedClients.length > 5 && (
                                  <span className="bg-secondary px-2 py-1 rounded text-xs text-muted-foreground">
                                    +{assignedClients.length - 5} más
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {profiles.filter(p => p.role_conversia === "vendedor").length === 0 && (
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No hay vendedores registrados</p>
                        <p className="text-sm text-muted-foreground">Asigna el rol "Vendedor" a un usuario en la pestaña Usuarios</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Commissions Table */}
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-primary" />
                      Historial de Comisiones
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setNewCommissionModal(true)}
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Nueva Comisión
                    </Button>
                  </div>

                  {/* Filters */}
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div>
                      <Label className="text-muted-foreground text-sm mb-1 block">Año</Label>
                      <Select value={commissionFilterYear} onValueChange={setCommissionFilterYear}>
                        <SelectTrigger className="w-32 bg-secondary border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {availableCommissionYears.map(year => (
                            <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-sm mb-1 block">Mes</Label>
                      <Select value={commissionFilterMonth} onValueChange={setCommissionFilterMonth}>
                        <SelectTrigger className="w-40 bg-secondary border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="1">Enero</SelectItem>
                          <SelectItem value="2">Febrero</SelectItem>
                          <SelectItem value="3">Marzo</SelectItem>
                          <SelectItem value="4">Abril</SelectItem>
                          <SelectItem value="5">Mayo</SelectItem>
                          <SelectItem value="6">Junio</SelectItem>
                          <SelectItem value="7">Julio</SelectItem>
                          <SelectItem value="8">Agosto</SelectItem>
                          <SelectItem value="9">Septiembre</SelectItem>
                          <SelectItem value="10">Octubre</SelectItem>
                          <SelectItem value="11">Noviembre</SelectItem>
                          <SelectItem value="12">Diciembre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-sm mb-1 block">Estado</Label>
                      <Select value={commissionFilterStatus} onValueChange={setCommissionFilterStatus}>
                        <SelectTrigger className="w-40 bg-secondary border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="pending">Pendientes</SelectItem>
                          <SelectItem value="paid">Pagadas</SelectItem>
                          <SelectItem value="cancelled">Canceladas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                      <p className="text-xs text-yellow-400 mb-1">Pendientes</p>
                      <p className="text-lg font-bold text-yellow-400">
                        {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(commissionSummary.pending)}
                      </p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                      <p className="text-xs text-green-400 mb-1">Pagadas</p>
                      <p className="text-lg font-bold text-green-400">
                        {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(commissionSummary.paid)}
                      </p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                      <p className="text-xs text-red-400 mb-1">Canceladas</p>
                      <p className="text-lg font-bold text-red-400">
                        {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(commissionSummary.cancelled)}
                      </p>
                    </div>
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                      <p className="text-xs text-primary mb-1">Total Activo</p>
                      <p className="text-lg font-bold text-primary">
                        {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(commissionSummary.total)}
                      </p>
                    </div>
                  </div>

                  {filteredCommissions.length === 0 ? (
                    <div className="text-center py-8">
                      <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">{commissions.length === 0 ? "No hay comisiones registradas" : "No hay comisiones para el período seleccionado"}</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 text-muted-foreground font-medium">Fecha</th>
                            <th className="text-left py-3 px-4 text-muted-foreground font-medium">Vendedor</th>
                            <th className="text-left py-3 px-4 text-muted-foreground font-medium">Plan</th>
                            <th className="text-left py-3 px-4 text-muted-foreground font-medium">Tipo</th>
                            <th className="text-left py-3 px-4 text-muted-foreground font-medium">Mes</th>
                            <th className="text-left py-3 px-4 text-muted-foreground font-medium">Venta</th>
                            <th className="text-left py-3 px-4 text-muted-foreground font-medium">%</th>
                            <th className="text-left py-3 px-4 text-muted-foreground font-medium">Comisión</th>
                            <th className="text-left py-3 px-4 text-muted-foreground font-medium">Nota</th>
                            <th className="text-left py-3 px-4 text-muted-foreground font-medium">Estado</th>
                            <th className="text-left py-3 px-4 text-muted-foreground font-medium">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCommissions.map((commission) => {
                            const sellerProfile = profiles.find(p => p.id === commission.id_seller);
                            const sellerName = sellerProfile
                              ? (sellerProfile.name || sellerProfile.company_name || sellerProfile.email)
                              : "Desconocido";
                            
                            return (
                              <tr key={commission.id} className={`border-b border-border/50 hover:bg-secondary/50 ${commission.status === "cancelled" ? "opacity-60" : ""}`}>
                                <td className="py-3 px-4 text-foreground">
                                  {format(new Date(commission.created_at), "dd/MM/yyyy", { locale: es })}
                                </td>
                                <td className="py-3 px-4 text-foreground">{sellerName}</td>
                                <td className="py-3 px-4 text-foreground capitalize">{commission.plan_name}</td>
                                <td className="py-3 px-4 text-foreground capitalize">{commission.plan_type}</td>
                                <td className="py-3 px-4 text-foreground">Mes {commission.commission_month}</td>
                                <td className="py-3 px-4 text-foreground">
                                  {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(commission.transaction_amount)}
                                </td>
                                <td className="py-3 px-4 text-foreground">{commission.commission_percentage}%</td>
                                <td className={`py-3 px-4 font-semibold ${commission.commission_amount < 0 ? "text-red-400" : "text-foreground"}`}>
                                  {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(commission.commission_amount)}
                                </td>
                                <td className="py-3 px-4 text-muted-foreground text-xs max-w-[200px]">
                                  {(commission as any).notes || "-"}
                                </td>
                                <td className="py-3 px-4">
                                  {commission.status === "paid" ? (
                                    <span className="flex items-center gap-1 text-green-400">
                                      <CheckCircle className="w-4 h-4" />
                                      Pagada
                                    </span>
                                  ) : commission.status === "cancelled" ? (
                                    <span className="flex items-center gap-1 text-red-400">
                                      <XCircle className="w-4 h-4" />
                                      Cancelada
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-1 text-yellow-400">
                                      <CalendarClock className="w-4 h-4" />
                                      Pendiente
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  {commission.status === "pending" && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleCancelCommission(commission)}
                                      disabled={cancellingCommission === commission.id}
                                      className="text-red-400 border-red-400 hover:bg-red-400/20"
                                    >
                                      <XCircle className="w-4 h-4" />
                                    </Button>
                                  )}
                                  {commission.status === "paid" && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleCancelCommission(commission)}
                                      disabled={cancellingCommission === commission.id}
                                      className="text-red-400 border-red-400 hover:bg-red-400/20"
                                    >
                                      <XCircle className="w-4 h-4" />
                                    </Button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Financial Dashboard Tab */}
            <TabsContent value="financial">
              <FinancialDashboard profiles={profiles} transactions={transactions} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      {/* History Modal */}
      <Dialog open={historyModal.open} onOpenChange={(open) => setHistoryModal({ open, profile: open ? historyModal.profile : null })}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                {historyModal.profile?.company_name ? (
                  <Building2 className="w-5 h-5 text-primary" />
                ) : (
                  <User className="w-5 h-5 text-primary" />
                )}
              </div>
              <div>
                <span className="block">
                  {historyModal.profile?.name || historyModal.profile?.company_name || historyModal.profile?.email}
                </span>
                <span className="text-sm text-muted-foreground font-normal">{historyModal.profile?.email}</span>
              </div>
            </DialogTitle>
          </DialogHeader>

          {historyModal.profile && (
            <div className="space-y-6 mt-4">
              {/* User Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-secondary/50 rounded-lg">
                <div>
                  <span className="text-xs text-muted-foreground">Teléfono</span>
                  <p className="font-medium">{historyModal.profile.phone || "-"}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Empresa</span>
                  <p className="font-medium">{historyModal.profile.company_name || "-"}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Fecha Registro</span>
                  <p className="font-medium">{format(new Date(historyModal.profile.created_at), "dd MMM yyyy", { locale: es })}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Dirección</span>
                  <p className="font-medium">{historyModal.profile.address || "-"}</p>
                </div>
              </div>

              {/* Monthly Payment Record */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Registro Mensual de Pagos
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 12 }, (_, i) => {
                    const monthDate = subMonths(new Date(), 11 - i);
                    const monthStart = startOfMonth(monthDate);
                    const monthEnd = endOfMonth(monthDate);
                    
                    const hasPayment = getUserTransactions(historyModal.profile.id)
                      .filter(tx => tx.status === "APPROVED")
                      .some(tx => {
                        const txDate = new Date(tx.created_at);
                        return isWithinInterval(txDate, { start: monthStart, end: monthEnd });
                      });
                    
                    return (
                      <div
                        key={i}
                        className={`p-2 rounded-lg text-center text-xs border ${
                          hasPayment 
                            ? "border-green-500/30 bg-green-500/10" 
                            : "border-red-500/30 bg-red-500/10"
                        }`}
                      >
                        <p className="font-medium capitalize">
                          {format(monthDate, "MMM", { locale: es })}
                        </p>
                        <p className="text-muted-foreground">
                          {format(monthDate, "yyyy")}
                        </p>
                        <div className="mt-1">
                          {hasPayment ? (
                            <CheckCircle className="w-4 h-4 text-green-400 mx-auto" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400 mx-auto" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Transaction History */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Historial de Pagos
                </h3>
                <div className="space-y-2">
                  {getUserTransactions(historyModal.profile.id).length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No hay transacciones registradas</p>
                  ) : (
                    getUserTransactions(historyModal.profile.id).map((tx) => (
                      <div
                        key={tx.id}
                        className={`p-3 rounded-lg border flex items-center justify-between ${
                          tx.status === "APPROVED" 
                            ? "border-green-500/30 bg-green-500/5" 
                            : tx.status === "PENDING"
                              ? "border-yellow-500/30 bg-yellow-500/5"
                              : "border-red-500/30 bg-red-500/5"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            tx.status === "APPROVED" ? "bg-green-500/20" :
                            tx.status === "PENDING" ? "bg-yellow-500/20" : "bg-red-500/20"
                          }`}>
                            {tx.status === "APPROVED" ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : tx.status === "PENDING" ? (
                              <CalendarClock className="w-4 h-4 text-yellow-400" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium capitalize">{tx.plan_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(tx.created_at), "dd MMM yyyy, HH:mm", { locale: es })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${Number(tx.amount).toLocaleString("es-CO")} {tx.currency}</p>
                          <span className={`text-xs ${
                            tx.status === "APPROVED" ? "text-green-400" :
                            tx.status === "PENDING" ? "text-yellow-400" : "text-red-400"
                          }`}>
                            {tx.status === "APPROVED" ? "Aprobado" : tx.status === "PENDING" ? "Pendiente" : "Rechazado"}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 bg-primary/10 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Pagos Aprobados</span>
                  <span className="font-bold text-lg">
                    {getUserTransactions(historyModal.profile.id).filter(tx => tx.status === "APPROVED").length}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-muted-foreground">Total Ingresado</span>
                  <span className="font-bold text-lg text-primary">
                    ${getUserTransactions(historyModal.profile.id)
                      .filter(tx => tx.status === "APPROVED")
                      .reduce((sum, tx) => sum + Number(tx.amount), 0)
                      .toLocaleString("es-CO")} COP
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Payment Modal */}
      <Dialog open={newPaymentModal} onOpenChange={setNewPaymentModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Crear Pago Manual
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Cliente *</Label>
              <Select 
                value={newPayment.email}
                onValueChange={(value) => setNewPayment(prev => ({ ...prev, email: value }))}
              >
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="Seleccionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  {profiles.map((profile) => (
                    <SelectItem key={profile.id} value={profile.email}>
                      <div className="flex items-center gap-2">
                        {profile.company_name ? (
                          <Building2 className="w-4 h-4" />
                        ) : (
                          <User className="w-4 h-4" />
                        )}
                        {profile.name || profile.company_name || profile.email}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Plan</Label>
                <Select 
                  value={newPayment.plan_name} 
                  onValueChange={(value) => setNewPayment(prev => ({ ...prev, plan_name: value }))}
                >
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mensual">Mensual</SelectItem>
                    <SelectItem value="trimestral">Trimestral</SelectItem>
                    <SelectItem value="semestral">Semestral</SelectItem>
                    <SelectItem value="anual">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Paquete</Label>
                <Select 
                  value={newPayment.package_name} 
                  onValueChange={(value) => setNewPayment(prev => ({ ...prev, package_name: value }))}
                >
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basico">Básico</SelectItem>
                    <SelectItem value="profesional">Profesional</SelectItem>
                    <SelectItem value="empresarial">Empresarial</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Monto (COP)</Label>
              <Input
                type="number"
                value={newPayment.amount}
                onChange={(e) => setNewPayment(prev => ({ ...prev, amount: parseInt(e.target.value) || 0 }))}
                className="bg-secondary border-border"
              />
            </div>

            <div className="space-y-2">
              <Label>Método de Pago</Label>
              <Select 
                value={newPayment.payment_method} 
                onValueChange={(value) => setNewPayment(prev => ({ ...prev, payment_method: value }))}
              >
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual / Efectivo</SelectItem>
                  <SelectItem value="transferencia">Transferencia</SelectItem>
                  <SelectItem value="nequi">Nequi</SelectItem>
                  <SelectItem value="daviplata">Daviplata</SelectItem>
                  <SelectItem value="tarjeta">Tarjeta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Estado</Label>
              <Select 
                value={newPayment.status} 
                onValueChange={(value) => setNewPayment(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="APPROVED">Aprobado</SelectItem>
                  <SelectItem value="PENDING">Pendiente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setNewPaymentModal(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleCreatePayment}
                disabled={creatingPayment}
                className="flex-1"
              >
                {creatingPayment ? "Creando..." : "Crear Pago"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Pay Seller Confirmation Modal */}
      <Dialog open={paySellerModal.open} onOpenChange={(open) => !open && setPaySellerModal({ open: false, sellerId: null, sellerName: "", pendingAmount: 0, pendingCommissions: [] })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              Confirmar Pago de Comisiones
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-secondary/50 rounded-lg p-4 text-center">
              <p className="text-muted-foreground text-sm mb-1">Vendedor</p>
              <p className="font-semibold text-foreground text-lg">{paySellerModal.sellerName}</p>
            </div>
            
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
              <p className="text-green-400 text-sm mb-1">Monto a Pagar</p>
              <p className={`font-bold text-2xl ${paySellerModal.pendingAmount < 0 ? "text-red-400" : "text-green-400"}`}>
                {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(paySellerModal.pendingAmount)}
              </p>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              {paySellerModal.pendingAmount < 0 ? (
                <p>Este es un saldo negativo (devolución). Al confirmar, se marcará como pagado/compensado.</p>
              ) : (
                <p>Se marcarán {paySellerModal.pendingCommissions.length} comisión(es) como pagadas.</p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setPaySellerModal({ open: false, sellerId: null, sellerName: "", pendingAmount: 0, pendingCommissions: [] })}
                className="flex-1"
                disabled={payingSeller}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handlePaySeller}
                disabled={payingSeller}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {payingSeller ? "Procesando..." : "Confirmar Pago"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Commission Modal */}
      <Dialog open={newCommissionModal} onOpenChange={setNewCommissionModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Nueva Comisión
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Vendedor</Label>
              <Select 
                value={newCommission.id_seller} 
                onValueChange={(value) => setNewCommission(prev => ({ ...prev, id_seller: value }))}
              >
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="Selecciona un vendedor" />
                </SelectTrigger>
                <SelectContent>
                  {profiles.filter(p => p.role_conversia === "vendedor").map((seller) => (
                    <SelectItem key={seller.id} value={String(seller.id)}>
                      {seller.name || seller.company_name || seller.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Plan</Label>
                <Select 
                  value={newCommission.plan_name} 
                  onValueChange={(value) => {
                    const plan = COMMISSION_PLANS.find(p => p.id === value);
                    if (plan) {
                      const amount = getPlanAmountCOP(plan, newCommission.plan_type);
                      const percentage = COMMISSION_RATES[newCommission.plan_type as keyof typeof COMMISSION_RATES];
                      const commissionAmount = Math.round(amount * percentage / 100);
                      setNewCommission(prev => ({ 
                        ...prev, 
                        plan_name: value,
                        transaction_amount: amount,
                        commission_percentage: percentage,
                        commission_amount: commissionAmount,
                      }));
                    }
                  }}
                >
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Selecciona un plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMMISSION_PLANS.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select 
                  value={newCommission.plan_type} 
                  onValueChange={(value) => {
                    const plan = COMMISSION_PLANS.find(p => p.id === newCommission.plan_name);
                    const percentage = COMMISSION_RATES[value as keyof typeof COMMISSION_RATES];
                    if (plan) {
                      const amount = getPlanAmountCOP(plan, value);
                      const commissionAmount = Math.round(amount * percentage / 100);
                      setNewCommission(prev => ({ 
                        ...prev, 
                        plan_type: value,
                        transaction_amount: amount,
                        commission_percentage: percentage,
                        commission_amount: commissionAmount,
                      }));
                    } else {
                      const commissionAmount = Math.round(newCommission.transaction_amount * percentage / 100);
                      setNewCommission(prev => ({ 
                        ...prev, 
                        plan_type: value,
                        commission_percentage: percentage,
                        commission_amount: commissionAmount,
                      }));
                    }
                  }}
                >
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mensual">Mensual (10%)</SelectItem>
                    <SelectItem value="anual">Anual (5%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Monto Venta (COP)</Label>
                <div className="bg-secondary/50 border border-border rounded-md px-3 py-2 text-foreground">
                  {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(newCommission.transaction_amount)}
                </div>
              </div>
              <div className="space-y-2">
                <Label>% Comisión</Label>
                <div className="bg-secondary/50 border border-border rounded-md px-3 py-2 text-foreground">
                  {newCommission.commission_percentage}%
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Monto Comisión (COP)</Label>
              <div className={`bg-secondary/50 border border-border rounded-md px-3 py-2 font-semibold ${newCommission.commission_amount < 0 ? "text-red-400" : "text-green-400"}`}>
                {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(newCommission.commission_amount)}
              </div>
              <p className="text-xs text-muted-foreground">
                Calculado automáticamente según plan y tipo.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Nota (opcional)</Label>
              <Input
                value={newCommission.notes}
                onChange={(e) => setNewCommission(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Descripción de la comisión"
                className="bg-secondary border-border"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setNewCommissionModal(false)}
                className="flex-1"
                disabled={creatingCommission}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleCreateCommission}
                disabled={creatingCommission}
                className="flex-1"
              >
                {creatingCommission ? "Creando..." : "Crear Comisión"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* User Detail/Edit Modal */}
      <Dialog open={userDetailModal.open} onOpenChange={(open) => setUserDetailModal({ open, profile: open ? userDetailModal.profile : null })}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {userDetailModal.profile?.company_name ? (
                <Building2 className="w-5 h-5 text-primary" />
              ) : (
                <User className="w-5 h-5 text-primary" />
              )}
              Información del Usuario
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            {/* Role & Company Badge */}
            <div className="flex items-center gap-2">
              <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium capitalize">
                {userDetailModal.profile?.role_conversia || "user"}
              </span>
              {userDetailModal.profile?.company_name && (
                <span className="bg-secondary text-muted-foreground px-3 py-1 rounded-full text-sm">
                  {userDetailModal.profile.company_name}
                </span>
              )}
              <span className="text-muted-foreground text-sm">
                Registrado: {userDetailModal.profile && new Date(userDetailModal.profile.created_at).toLocaleDateString("es-CO")}
              </span>
            </div>

            {/* Email (read-only) */}
            <div>
              <Label className="text-muted-foreground">Email (no editable)</Label>
              <Input
                value={editingUserForm.email}
                disabled
                className="mt-1 bg-muted"
              />
            </div>

            {/* Name field */}
            <div>
              <Label>Nombre</Label>
              <Input
                value={editingUserForm.name}
                onChange={(e) => setEditingUserForm(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 bg-secondary border-border"
                placeholder="Nombre completo"
              />
            </div>

            {/* Common fields */}
            <div className="border-t border-border pt-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-4">Información de Contacto</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Teléfono</Label>
                  <Input
                    value={editingUserForm.phone}
                    onChange={(e) => setEditingUserForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="mt-1 bg-secondary border-border"
                    placeholder="Número de teléfono"
                  />
                </div>
                <div>
                  <Label>Ciudad</Label>
                  <Input
                    value={editingUserForm.city}
                    onChange={(e) => setEditingUserForm(prev => ({ ...prev, city: e.target.value }))}
                    className="mt-1 bg-secondary border-border"
                    placeholder="Ciudad"
                  />
                </div>
              </div>
              <div className="mt-4">
                <Label>Dirección</Label>
                <Input
                  value={editingUserForm.address}
                  onChange={(e) => setEditingUserForm(prev => ({ ...prev, address: e.target.value }))}
                  className="mt-1 bg-secondary border-border"
                  placeholder="Dirección completa"
                />
              </div>
            </div>

            {/* Generate Payment Section */}
            <div className="pt-4 border-t border-border space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Wallet className="w-4 h-4 text-primary" />
                Generar Pago para este Usuario
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>Plan</Label>
                  <Select
                    value={adminPaymentPlan.package}
                    onValueChange={(val) => setAdminPaymentPlan(prev => ({ ...prev, package: val }))}
                  >
                    <SelectTrigger className="mt-1 bg-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plan test">Plan Test ($1,500 COP)</SelectItem>
                      <SelectItem value="starter">Starter ($50,000 COP)</SelectItem>
                      <SelectItem value="mini">Mini ($29.9 USD)</SelectItem>
                      <SelectItem value="basico">Básico ($59.9 USD)</SelectItem>
                      <SelectItem value="plus">Plus ($99.9 USD)</SelectItem>
                      <SelectItem value="enterprise">Enterprise ($210 USD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Periodo</Label>
                  <Select
                    value={adminPaymentPlan.period}
                    onValueChange={(val) => setAdminPaymentPlan(prev => ({ ...prev, period: val as "mensual" | "semestral" | "anual" }))}
                  >
                    <SelectTrigger className="mt-1 bg-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mensual">Mensual</SelectItem>
                      <SelectItem value="semestral">Semestral (-10%)</SelectItem>
                      <SelectItem value="anual">Anual (-15%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {(() => {
                  const { cop, usd, isFixedCOP } = getAdminPaymentAmounts();
                  if (isFixedCOP) return `Total: $${cop.toLocaleString('es-CO')} COP`;
                  return `Total: $${cop.toLocaleString('es-CO')} COP / $${usd.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD`;
                })()}
              </div>
              <Button
                onClick={handleAdminInitiatePayment}
                disabled={adminPaymentLoading}
                className="w-full"
                variant="default"
              >
                {adminPaymentLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Generar Pago
                  </>
                )}
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setUserDetailModal({ open: false, profile: null })}
                className="flex-1"
                disabled={savingUser}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveUserProfile}
                disabled={savingUser}
                className="flex-1"
              >
                {savingUser ? (
                  <>
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment method selector removed - Wompi only */}
    </div>
  );
};

export default Admin;