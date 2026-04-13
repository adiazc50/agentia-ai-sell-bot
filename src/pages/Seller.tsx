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
  Bot, LogOut, Users, CreditCard, Search, Plus, User,
  CheckCircle, XCircle, Clock, DollarSign, TrendingUp, Eye, RefreshCw
} from "lucide-react";
import { api, isAuthenticated, getUser, logout as apiLogout } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { format, startOfMonth, endOfMonth, subMonths, isWithinInterval } from "date-fns";
import { es } from "date-fns/locale";

interface Profile {
  id: number;
  name: string;
  email: string;
  phone: number | null;
  id_company: number | null;
  company_name: string | null;
  created_at: string;
}

interface Transaction {
  id: string;
  id_company: number;
  email: string;
  reference: string;
  plan_name: string;
  amount: number;
  currency: string;
  transaction_id: string | null;
  payment_method: string | null;
  transaction_date: string | null;
  created_at: string;
}

interface Commission {
  id: string;
  id_seller: number;
  id_user: number;
  id_transaction: number;
  plan_name: string;
  plan_type: string;
  transaction_amount: number;
  commission_month: number;
  commission_percentage: number;
  commission_amount: number;
  status: string;
  created_at: string;
  paid_at: string | null;
  notes: string | null;
}

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
    name: "",
    phone: ""
  });
  const [creatingUser, setCreatingUser] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [filterYear, setFilterYear] = useState<string>(new Date().getFullYear().toString());
  const [filterMonth, setFilterMonth] = useState<string>("all");

  useEffect(() => {
    const checkSeller = async () => {
      if (!isAuthenticated()) {
        navigate("/auth");
        return;
      }

      const user = getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      setCurrentUserId(user.id || "");

      // Sync commissions on page load
      try {
        await syncCommissions();
      } catch {
        // If sync fails (e.g. 403), redirect
        navigate("/dashboard");
        return;
      }
      setLoading(false);
    };

    checkSeller();
  }, [navigate]);

  const loadData = async () => {
    const [profileData, transactionsData, commissionsData] = await Promise.all([
      api.profile.get(),
      api.transactions.list(),
      api.commissions.list()
    ]);

    // The profile endpoint may return the seller's clients list or a single profile.
    // Adapt based on what the backend returns.
    setProfiles(Array.isArray(profileData) ? profileData : (profileData?.clients || []));
    setTransactions(Array.isArray(transactionsData) ? transactionsData : (transactionsData?.data || []));
    setCommissions(Array.isArray(commissionsData) ? commissionsData : (commissionsData?.data || []));
  };

  const syncCommissions = async () => {
    setSyncing(true);
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
        description: "No se pudieron sincronizar las comisiones.",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleLogout = () => {
    apiLogout();
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

    if (!newUser.name) {
      toast({
        title: "Error",
        description: "El nombre es requerido.",
        variant: "destructive",
      });
      return;
    }

    setCreatingUser(true);

    try {
      // Register the user via the API (creates auth user + profile)
      const authData = await api.auth.register({
        email: newUser.email,
        password: newUser.password,
        name: newUser.name,
        phone: newUser.phone || null,
        sellerId: currentUserId
      });

      // Assign user role
      if (authData?.user?.id) {
        await api.roles.assign(authData.user.id, 1); // 1 = user role
      }

      toast({
        title: "Usuario creado",
        description: `Usuario ${newUser.email} creado exitosamente.`,
      });

      setNewUserModal(false);
      setNewUser({
        email: "",
        password: "",
        name: "",
        phone: ""
      });

      await loadData();
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
      return profile.name?.toLowerCase().includes(searchUser.toLowerCase()) ||
        profile.email.toLowerCase().includes(searchUser.toLowerCase());
    });
  }, [profiles, searchUser]);

  const getUserTransactions = (userId: string) => {
    // All logged transactions are implicitly approved (no status field in MySQL)
    return transactions
      .filter(t => String(t.id_company) === String(userId) || t.email === profiles.find(p => String(p.id) === String(userId))?.email)
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
                  <p className="text-2xl font-bold text-foreground">{transactions.length}</p>
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
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Email</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Plan Asignado</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Registro</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProfiles.map((profile) => (
                        <tr key={profile.id} className="border-b border-border/50 hover:bg-secondary/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-primary" />
                              <span className="text-foreground">
                                {profile.name || "Usuario"}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-foreground">{profile.email}</td>
                          <td className="py-3 px-4">
                            <span className="bg-primary/20 text-primary px-2 py-1 rounded text-sm capitalize">
                              N/A
                            </span>
                          </td>
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
                <Label className="text-foreground">Nombre *</Label>
                <Input
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="bg-secondary border-border mt-1"
                />
              </div>

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

              <div className="col-span-2">
                <Label className="text-foreground">Teléfono</Label>
                <Input
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  className="bg-secondary border-border mt-1"
                />
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
              Historial de Pagos - {historyModal.profile?.name || "Usuario"}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <div className="grid grid-cols-3 gap-2">
              {historyModal.profile && getMonthlyPayments(String(historyModal.profile.id)).map((month, idx) => (
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
