import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Bot, LogOut, Users, CreditCard, Search, Plus, User, Building2,
  CheckCircle, XCircle, Clock, DollarSign, TrendingUp, Eye, RefreshCw
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format, startOfMonth, endOfMonth, subMonths, isWithinInterval } from "date-fns";
import { es } from "date-fns/locale";

interface Profile {
  id: string;
  user_id: string;
  account_type: "persona" | "empresa";
  email: string;
  phone: string | null;
  city: string | null;
  first_name: string | null;
  last_name: string | null;
  company_name: string | null;
  nit: string | null;
  seller_id: string | null;
  assigned_plan: string | null;
  created_at: string;
}

interface Transaction {
  id: string;
  user_id: string;
  reference: string;
  plan_name: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
}

interface Commission {
  id: string;
  transaction_id: string;
  user_id: string;
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

// Prices in USD/month (annual = monthly * 0.85 * 12)
const PLANS = [
  { id: "mini", name: "Mini", mensajes: 500, precioUSD: 29.9 },
  { id: "basico", name: "Básico", mensajes: 1100, precioUSD: 59.9 },
  { id: "plus", name: "Plus", mensajes: 3500, precioUSD: 99.9 },
  { id: "enterprise", name: "Enterprise", mensajes: 7500, precioUSD: 210 },
];

const Seller = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [searchUser, setSearchUser] = useState("");
  const [newUserModal, setNewUserModal] = useState(false);
  const [historyModal, setHistoryModal] = useState<{ open: boolean; profile: Profile | null }>({ open: false, profile: null });
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    account_type: "persona" as "persona" | "empresa",
    first_name: "",
    last_name: "",
    company_name: "",
    nit: "",
    phone: "",
    city: "",
    assigned_plan: "basico"
  });
  const [creatingUser, setCreatingUser] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [filterYear, setFilterYear] = useState<string>(new Date().getFullYear().toString());
  const [filterMonth, setFilterMonth] = useState<string>("all");

  useEffect(() => {
    const checkSeller = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setCurrentUserId(session.user.id);

      // Check if user has vendedor role
      const { data: role } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "vendedor")
        .maybeSingle();

      if (!role) {
        // Check if admin
        const { data: adminRole } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .eq("role", "admin")
          .maybeSingle();

        if (adminRole) {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
        return;
      }

      // Sync commissions on page load
      await syncCommissions();
      setLoading(false);

      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === "SIGNED_OUT") {
          navigate("/");
        }
      });

      return () => subscription.unsubscribe();
    };

    checkSeller();
  }, [navigate]);

  const loadData = async (sellerId: string) => {
    const [profilesRes, transactionsRes, commissionsRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("seller_id", sellerId).order("created_at", { ascending: false }),
      supabase.from("transactions").select("*").order("created_at", { ascending: false }),
      supabase.from("seller_commissions").select("*").eq("seller_id", sellerId).order("created_at", { ascending: false })
    ]);

    setProfiles((profilesRes.data as Profile[]) || []);
    setTransactions((transactionsRes.data as Transaction[]) || []);
    setCommissions((commissionsRes.data as Commission[]) || []);
  };

  const syncCommissions = async () => {
    setSyncing(true);
    try {
      const { error } = await supabase.functions.invoke('calculate-commissions');
      
      if (error) {
        toast({
          title: "Error",
          description: "No se pudieron sincronizar las comisiones.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sincronizado",
          description: "Las comisiones han sido calculadas.",
        });
        await loadData(currentUserId);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Error de conexión al sincronizar.",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut({ scope: 'local' });
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("sb-") && key.endsWith("-auth-token")) {
        localStorage.removeItem(key);
      }
    });
    navigate("/", { replace: true });
  };

  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.password) {
      toast({
        title: "Error",
        description: "Email y contraseña son requeridos.",
        variant: "destructive",
      });
      return;
    }

    if (newUser.account_type === "persona" && (!newUser.first_name || !newUser.last_name)) {
      toast({
        title: "Error",
        description: "Nombre y apellido son requeridos para persona.",
        variant: "destructive",
      });
      return;
    }

    if (newUser.account_type === "empresa" && (!newUser.company_name || !newUser.nit)) {
      toast({
        title: "Error",
        description: "Nombre de empresa y NIT son requeridos.",
        variant: "destructive",
      });
      return;
    }

    setCreatingUser(true);

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("No se pudo crear el usuario");

      // Create profile with seller_id assigned
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          user_id: authData.user.id,
          email: newUser.email,
          account_type: newUser.account_type,
          first_name: newUser.account_type === "persona" ? newUser.first_name : null,
          last_name: newUser.account_type === "persona" ? newUser.last_name : null,
          company_name: newUser.account_type === "empresa" ? newUser.company_name : null,
          nit: newUser.account_type === "empresa" ? newUser.nit : null,
          phone: newUser.phone || null,
          city: newUser.city || null,
          seller_id: currentUserId,
          assigned_plan: newUser.assigned_plan
        });

      if (profileError) throw profileError;

      // Create user role
      await supabase.from("user_roles").insert({
        user_id: authData.user.id,
        role: "user"
      });

      toast({
        title: "Usuario creado",
        description: `Usuario ${newUser.email} creado exitosamente.`,
      });

      setNewUserModal(false);
      setNewUser({
        email: "",
        password: "",
        account_type: "persona",
        first_name: "",
        last_name: "",
        company_name: "",
        nit: "",
        phone: "",
        city: "",
        assigned_plan: "basico"
      });

      await loadData(currentUserId);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el usuario.",
        variant: "destructive",
      });
    } finally {
      setCreatingUser(false);
    }
  };

  const filteredProfiles = useMemo(() => {
    return profiles.filter(profile => {
      const name = profile.account_type === "empresa" 
        ? profile.company_name 
        : `${profile.first_name} ${profile.last_name}`;
      return name?.toLowerCase().includes(searchUser.toLowerCase()) ||
        profile.email.toLowerCase().includes(searchUser.toLowerCase());
    });
  }, [profiles, searchUser]);

  const getUserTransactions = (userId: string) => {
    return transactions
      .filter(t => t.user_id === userId && t.status === "APPROVED")
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  const getMonthlyPayments = (userId: string) => {
    const userTx = getUserTransactions(userId);
    const months: { month: string; paid: boolean; amount: number }[] = [];
    
    for (let i = 0; i < 12; i++) {
      const monthDate = subMonths(new Date(), i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      
      const payment = userTx.find(tx => 
        isWithinInterval(new Date(tx.created_at), { start: monthStart, end: monthEnd })
      );
      
      months.push({
        month: format(monthDate, "MMM yyyy", { locale: es }),
        paid: !!payment,
        amount: payment?.amount || 0
      });
    }
    
    return months;
  };

  const totalCommissionsPending = useMemo(() => {
    return commissions
      .filter(c => c.status === "pending")
      .reduce((sum, c) => sum + c.commission_amount, 0);
  }, [commissions]);

  const totalCommissionsPaid = useMemo(() => {
    return commissions
      .filter(c => c.status === "paid")
      .reduce((sum, c) => sum + c.commission_amount, 0);
  }, [commissions]);

  const filteredCommissions = useMemo(() => {
    return commissions.filter(c => {
      const commissionDate = new Date(c.created_at);
      const matchesYear = commissionDate.getFullYear().toString() === filterYear;
      const matchesMonth = filterMonth === "all" || (commissionDate.getMonth() + 1).toString() === filterMonth;
      return matchesYear && matchesMonth;
    });
  }, [commissions, filterYear, filterMonth]);

  const availableYears = useMemo(() => {
    const years = new Set(commissions.map(c => new Date(c.created_at).getFullYear()));
    years.add(new Date().getFullYear());
    return Array.from(years).sort((a, b) => b - a);
  }, [commissions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Bot className="w-8 h-8 text-primary animate-pulse" />
          <span className="text-foreground">Cargando panel de vendedor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-foreground">Panel de Vendedor</span>
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="glass-card p-6">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-muted-foreground text-sm">Mis Clientes</p>
                  <p className="text-2xl font-bold text-foreground">{profiles.length}</p>
                </div>
              </div>
            </div>
            <div className="glass-card p-6">
              <div className="flex items-center gap-3">
                <CreditCard className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-muted-foreground text-sm">Transacciones</p>
                  <p className="text-2xl font-bold text-foreground">{transactions.filter(t => t.status === "APPROVED").length}</p>
                </div>
              </div>
            </div>
            <div className="glass-card p-6">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-muted-foreground text-sm">Comisiones Pendientes</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(totalCommissionsPending)}</p>
                </div>
              </div>
            </div>
            <div className="glass-card p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-muted-foreground text-sm">Comisiones Pagadas</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(totalCommissionsPaid)}</p>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="clients" className="space-y-6">
            <TabsList className="bg-secondary">
              <TabsTrigger value="clients" className="data-[state=active]:bg-primary">
                <Users className="w-4 h-4 mr-2" />
                Mis Clientes
              </TabsTrigger>
              <TabsTrigger value="commissions" className="data-[state=active]:bg-primary">
                <DollarSign className="w-4 h-4 mr-2" />
                Mis Comisiones
              </TabsTrigger>
            </TabsList>

            {/* Clients Tab */}
            <TabsContent value="clients">
              <div className="glass-card p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="Buscar cliente..."
                      value={searchUser}
                      onChange={(e) => setSearchUser(e.target.value)}
                      className="pl-10 bg-secondary border-border"
                    />
                  </div>
                  <Button onClick={() => setNewUserModal(true)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Nuevo Cliente
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Nombre</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Tipo</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Email</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Plan Asignado</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Ciudad</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Registro</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProfiles.map((profile) => (
                        <tr key={profile.id} className="border-b border-border/50 hover:bg-secondary/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {profile.account_type === "empresa" ? (
                                <Building2 className="w-4 h-4 text-primary" />
                              ) : (
                                <User className="w-4 h-4 text-primary" />
                              )}
                              <span className="text-foreground">
                                {profile.account_type === "empresa" 
                                  ? profile.company_name 
                                  : `${profile.first_name} ${profile.last_name}`}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 capitalize text-foreground">{profile.account_type}</td>
                          <td className="py-3 px-4 text-foreground">{profile.email}</td>
                          <td className="py-3 px-4">
                            <span className="bg-primary/20 text-primary px-2 py-1 rounded text-sm capitalize">
                              {profile.assigned_plan || "Sin asignar"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-foreground">{profile.city || "-"}</td>
                          <td className="py-3 px-4 text-foreground">
                            {format(new Date(profile.created_at), "dd/MM/yyyy", { locale: es })}
                          </td>
                          <td className="py-3 px-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setHistoryModal({ open: true, profile })}
                              className="gap-1"
                            >
                              <Eye className="w-4 h-4" />
                              Ver Pagos
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredProfiles.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No tienes clientes asignados aún</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Commissions Tab */}
            <TabsContent value="commissions">
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    Historial de Comisiones
                  </h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={syncCommissions}
                    disabled={syncing}
                    className="gap-2"
                  >
                    <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                    {syncing ? 'Sincronizando...' : 'Sincronizar'}
                  </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-4">
                  <div>
                    <Label className="text-muted-foreground text-sm mb-1 block">Año</Label>
                    <Select value={filterYear} onValueChange={setFilterYear}>
                      <SelectTrigger className="w-32 bg-secondary border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableYears.map(year => (
                          <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm mb-1 block">Mes</Label>
                    <Select value={filterMonth} onValueChange={setFilterMonth}>
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
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Fecha</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Plan</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Tipo</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Mes Comisión</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Venta</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">%</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Comisión</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCommissions.map((commission) => (
                        <tr key={commission.id} className="border-b border-border/50 hover:bg-secondary/50">
                          <td className="py-3 px-4 text-foreground">
                            {format(new Date(commission.created_at), "dd/MM/yyyy", { locale: es })}
                          </td>
                          <td className="py-3 px-4 text-foreground capitalize">{commission.plan_name}</td>
                          <td className="py-3 px-4 text-foreground capitalize">{commission.plan_type}</td>
                          <td className="py-3 px-4 text-foreground">Mes {commission.commission_month}</td>
                          <td className="py-3 px-4 text-foreground">{formatCurrency(commission.transaction_amount)}</td>
                          <td className="py-3 px-4 text-foreground">{commission.commission_percentage}%</td>
                          <td className="py-3 px-4 text-foreground font-semibold">{formatCurrency(commission.commission_amount)}</td>
                          <td className="py-3 px-4">
                            {commission.status === "paid" ? (
                              <span className="flex items-center gap-1 text-green-400">
                                <CheckCircle className="w-4 h-4" />
                                Pagada
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-yellow-400">
                                <Clock className="w-4 h-4" />
                                Pendiente
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredCommissions.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>{commissions.length === 0 ? "Aún no tienes comisiones registradas" : "No hay comisiones para el período seleccionado"}</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      {/* New User Modal */}
      <Dialog open={newUserModal} onOpenChange={setNewUserModal}>
        <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Crear Nuevo Cliente
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label className="text-foreground">Tipo de Cuenta</Label>
                <Select
                  value={newUser.account_type}
                  onValueChange={(value: "persona" | "empresa") => setNewUser({ ...newUser, account_type: value })}
                >
                  <SelectTrigger className="bg-secondary border-border mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="persona">Persona</SelectItem>
                    <SelectItem value="empresa">Empresa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newUser.account_type === "persona" ? (
                <>
                  <div>
                    <Label className="text-foreground">Nombre *</Label>
                    <Input
                      value={newUser.first_name}
                      onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                      className="bg-secondary border-border mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-foreground">Apellido *</Label>
                    <Input
                      value={newUser.last_name}
                      onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
                      className="bg-secondary border-border mt-1"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label className="text-foreground">Nombre de Empresa *</Label>
                    <Input
                      value={newUser.company_name}
                      onChange={(e) => setNewUser({ ...newUser, company_name: e.target.value })}
                      className="bg-secondary border-border mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-foreground">NIT *</Label>
                    <Input
                      value={newUser.nit}
                      onChange={(e) => setNewUser({ ...newUser, nit: e.target.value })}
                      className="bg-secondary border-border mt-1"
                    />
                  </div>
                </>
              )}

              <div className="col-span-2">
                <Label className="text-foreground">Email *</Label>
                <Input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="bg-secondary border-border mt-1"
                />
              </div>

              <div className="col-span-2">
                <Label className="text-foreground">Contraseña *</Label>
                <Input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="bg-secondary border-border mt-1"
                />
              </div>

              <div>
                <Label className="text-foreground">Teléfono</Label>
                <Input
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  className="bg-secondary border-border mt-1"
                />
              </div>

              <div>
                <Label className="text-foreground">Ciudad</Label>
                <Input
                  value={newUser.city}
                  onChange={(e) => setNewUser({ ...newUser, city: e.target.value })}
                  className="bg-secondary border-border mt-1"
                />
              </div>

              <div className="col-span-2">
                <Label className="text-foreground">Plan Asignado *</Label>
                <Select
                  value={newUser.assigned_plan}
                  onValueChange={(value) => setNewUser({ ...newUser, assigned_plan: value })}
                >
                  <SelectTrigger className="bg-secondary border-border mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PLANS.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name} - {plan.mensajes} mensajes - ${plan.precioUSD} USD/mes
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setNewUserModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateUser} disabled={creatingUser}>
                {creatingUser ? "Creando..." : "Crear Cliente"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment History Modal */}
      <Dialog open={historyModal.open} onOpenChange={(open) => setHistoryModal({ open, profile: historyModal.profile })}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Historial de Pagos - {historyModal.profile?.account_type === "empresa" 
                ? historyModal.profile?.company_name 
                : `${historyModal.profile?.first_name} ${historyModal.profile?.last_name}`}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="grid grid-cols-3 gap-2">
              {historyModal.profile && getMonthlyPayments(historyModal.profile.user_id).map((month, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg text-center ${
                    month.paid 
                      ? "bg-green-500/20 border border-green-500/50" 
                      : "bg-red-500/20 border border-red-500/50"
                  }`}
                >
                  <p className="text-sm text-foreground">{month.month}</p>
                  {month.paid ? (
                    <CheckCircle className="w-5 h-5 text-green-400 mx-auto mt-1" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 mx-auto mt-1" />
                  )}
                  {month.paid && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatCurrency(month.amount)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Seller;
