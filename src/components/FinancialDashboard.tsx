import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DollarSign, Users, CheckCircle, XCircle, TrendingUp, Search, BarChart3, CalendarIcon, X } from "lucide-react";
import { format, parseISO, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface Profile {
  id: string;
  user_id: string;
  account_type: "persona" | "empresa";
  email: string;
  first_name: string | null;
  last_name: string | null;
  company_name: string | null;
  assigned_plan: string | null;
  subscription_start_date: string | null;
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

interface FinancialDashboardProps {
  profiles: Profile[];
  transactions: Transaction[];
}

const statusColors: Record<string, string> = {
  APPROVED: "bg-green-500/20 text-green-400 border-green-500/30",
  PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  DECLINED: "bg-red-500/20 text-red-400 border-red-500/30",
  VOIDED: "bg-red-500/20 text-red-400 border-red-500/30",
  ERROR: "bg-red-500/20 text-red-400 border-red-500/30",
};

const statusLabels: Record<string, string> = {
  APPROVED: "Aprobado",
  PENDING: "Pendiente",
  DECLINED: "Rechazado",
  VOIDED: "Anulado",
  ERROR: "Error",
};

const FinancialDashboard = ({ profiles, transactions }: FinancialDashboardProps) => {
  const currentYear = new Date().getFullYear();
  const [filterYear, setFilterYear] = useState<string>("all");
  const [filterMonth, setFilterMonth] = useState<string>("all");
  const [filterPlan, setFilterPlan] = useState<string>("all");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);

  const getName = (profile: Profile | undefined) => {
    if (!profile) return "Usuario";
    return profile.account_type === "empresa"
      ? profile.company_name || "Empresa"
      : `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || "Usuario";
  };

  const safeAmount = (val: unknown): number => {
    if (typeof val === "number") return val;
    if (typeof val === "string") return parseFloat(val) || 0;
    return 0;
  };

  const safeDate = (val: unknown): Date => {
    if (!val) return new Date(0);
    const d = new Date(val as string);
    return isNaN(d.getTime()) ? new Date(0) : d;
  };

  const getProfileByUserId = (userId: string) => profiles.find((p) => p.user_id === userId);

  // All unique plan names from transactions
  const planNames = useMemo(() => {
    const names = new Set(transactions.map((t) => t.plan_name));
    return Array.from(names).sort();
  }, [transactions]);

  // Available years
  const years = useMemo(() => {
    const yrs = new Set(transactions.map((t) => safeDate(t.created_at).getFullYear()));
    yrs.add(currentYear);
    return Array.from(yrs).sort((a, b) => b - a);
  }, [transactions]);

  // Filtered transactions
  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      const txDate = safeDate(tx.created_at);
      if (filterYear !== "all" && txDate.getFullYear() !== parseInt(filterYear)) return false;
      if (filterMonth !== "all" && txDate.getMonth() !== parseInt(filterMonth)) return false;
      if (dateFrom && isBefore(txDate, startOfDay(dateFrom))) return false;
      if (dateTo && isAfter(txDate, endOfDay(dateTo))) return false;
      if (filterPlan !== "all" && tx.plan_name !== filterPlan) return false;
      if (filterPaymentStatus !== "all" && tx.status !== filterPaymentStatus) return false;
      if (searchQuery) {
        const profile = getProfileByUserId(tx.user_id);
        const name = profile ? getName(profile) : "";
        const email = profile?.email || "";
        const q = searchQuery.toLowerCase();
        if (!name.toLowerCase().includes(q) && !email.toLowerCase().includes(q) && !tx.reference.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [transactions, filterYear, filterMonth, filterPlan, filterPaymentStatus, searchQuery, profiles, dateFrom, dateTo]);

  // KPIs
  const kpis = useMemo(() => {
    const approved = filtered.filter((t) => t.status === "APPROVED");
    const pending = filtered.filter((t) => t.status === "PENDING");
    const declined = filtered.filter((t) => t.status === "DECLINED" || t.status === "VOIDED" || t.status === "ERROR");

    const totalApproved = approved.reduce((s, t) => s + safeAmount(t.amount), 0);
    const totalPending = pending.reduce((s, t) => s + safeAmount(t.amount), 0);
    const totalDeclined = declined.reduce((s, t) => s + safeAmount(t.amount), 0);

    // Unique users who paid
    const paidUsers = new Set(approved.map((t) => t.user_id));
    // All users who have any transaction in period
    const allTxUsers = new Set(filtered.map((t) => t.user_id));
    // Users with NO approved tx
    const unpaidUsers = new Set([...allTxUsers].filter((u) => !paidUsers.has(u)));

    // Active plans (users with approved transactions)
    const activePlans: Record<string, { count: number; total: number }> = {};
    approved.forEach((tx) => {
      if (!activePlans[tx.plan_name]) activePlans[tx.plan_name] = { count: 0, total: 0 };
      activePlans[tx.plan_name].count++;
      activePlans[tx.plan_name].total += safeAmount(tx.amount);
    });

    return {
      totalApproved,
      totalPending,
      totalDeclined,
      approvedCount: approved.length,
      pendingCount: pending.length,
      declinedCount: declined.length,
      paidUsersCount: paidUsers.size,
      unpaidUsersCount: unpaidUsers.size,
      activePlans,
    };
  }, [filtered]);

  const formatCOP = (amount: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(amount);

  // Per-user summary
  const userSummaries = useMemo(() => {
    const map: Record<string, { profile: Profile; approved: number; pending: number; declined: number; lastPlan: string; lastDate: string; txCount: number }> = {};
    filtered.forEach((tx) => {
      const profile = getProfileByUserId(tx.user_id);
      if (!profile) return;
      if (!map[tx.user_id]) {
        map[tx.user_id] = { profile, approved: 0, pending: 0, declined: 0, lastPlan: "", lastDate: "", txCount: 0 };
      }
      const entry = map[tx.user_id];
      entry.txCount++;
      if (tx.status === "APPROVED") entry.approved += safeAmount(tx.amount);
      else if (tx.status === "PENDING") entry.pending += safeAmount(tx.amount);
      else entry.declined += safeAmount(tx.amount);
      if (!entry.lastDate || tx.created_at > entry.lastDate) {
        entry.lastDate = tx.created_at;
        entry.lastPlan = tx.plan_name;
      }
    });
    return Object.values(map).sort((a, b) => b.approved - a.approved);
  }, [filtered, profiles]);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ingresos Aprobados</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatCOP(kpis.totalApproved)}</div>
            <p className="text-xs text-muted-foreground">{kpis.approvedCount} transacciones</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pendientes</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatCOP(kpis.totalPending)}</div>
            <p className="text-xs text-muted-foreground">{kpis.pendingCount} transacciones</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Clientes que Pagaron</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{kpis.paidUsersCount}</div>
            <p className="text-xs text-muted-foreground">usuarios con pago aprobado</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sin Pago Aprobado</CardTitle>
            <XCircle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{kpis.unpaidUsersCount}</div>
            <p className="text-xs text-muted-foreground">usuarios sin aprobación</p>
          </CardContent>
        </Card>
      </div>

      {/* Plans Breakdown */}
      {Object.keys(kpis.activePlans).length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Desglose por Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(kpis.activePlans)
                .sort(([, a], [, b]) => b.total - a.total)
                .map(([plan, data]) => (
                  <div key={plan} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border">
                    <div>
                      <p className="font-medium text-sm text-foreground">{plan}</p>
                      <p className="text-xs text-muted-foreground">{data.count} compra{data.count !== 1 ? "s" : ""}</p>
                    </div>
                    <span className="font-bold text-sm text-primary">{formatCOP(data.total)}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, email o referencia..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Date From */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-[160px] justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFrom ? format(dateFrom, "dd MMM yyyy", { locale: es }) : "Desde"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus className={cn("p-3 pointer-events-auto")} locale={es} />
              </PopoverContent>
            </Popover>

            {/* Date To */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-[160px] justify-start text-left font-normal", !dateTo && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateTo ? format(dateTo, "dd MMM yyyy", { locale: es }) : "Hasta"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus className={cn("p-3 pointer-events-auto")} locale={es} />
              </PopoverContent>
            </Popover>

            {(dateFrom || dateTo) && (
              <Button variant="ghost" size="icon" onClick={() => { setDateFrom(undefined); setDateTo(undefined); }} title="Limpiar fechas">
                <X className="h-4 w-4" />
              </Button>
            )}

            <Select value={filterYear} onValueChange={setFilterYear}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Año" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {years.map((y) => (
                  <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterMonth} onValueChange={setFilterMonth}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Mes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los meses</SelectItem>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    {format(new Date(2024, i, 1), "MMMM", { locale: es })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterPlan} onValueChange={setFilterPlan}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los planes</SelectItem>
                {planNames.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterPaymentStatus} onValueChange={setFilterPaymentStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="APPROVED">Aprobado</SelectItem>
                <SelectItem value="PENDING">Pendiente</SelectItem>
                <SelectItem value="DECLINED">Rechazado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Per-user summary table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            Resumen por Cliente ({userSummaries.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Último Plan</TableHead>
                  <TableHead className="text-right">Aprobado</TableHead>
                  <TableHead className="text-right">Pendiente</TableHead>
                  <TableHead className="text-right">Rechazado</TableHead>
                  <TableHead className="text-center">Txs</TableHead>
                  <TableHead>Último Pago</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userSummaries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No hay datos para los filtros seleccionados
                    </TableCell>
                  </TableRow>
                ) : (
                  userSummaries.map((u) => (
                    <TableRow key={u.profile.user_id}>
                      <TableCell className="font-medium">{getName(u.profile)}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{u.profile.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">{u.lastPlan}</Badge>
                      </TableCell>
                      <TableCell className="text-right text-green-400 font-medium">{u.approved > 0 ? formatCOP(u.approved) : "-"}</TableCell>
                      <TableCell className="text-right text-yellow-400 font-medium">{u.pending > 0 ? formatCOP(u.pending) : "-"}</TableCell>
                      <TableCell className="text-right text-red-400 font-medium">{u.declined > 0 ? formatCOP(u.declined) : "-"}</TableCell>
                      <TableCell className="text-center">{u.txCount}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {u.lastDate ? (() => { try { return format(parseISO(u.lastDate), "dd MMM yyyy", { locale: es }); } catch { return u.lastDate.slice(0, 10); } })() : "-"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Totals footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-green-500/10 border-green-500/20">
          <CardContent className="pt-4 pb-4 text-center">
            <p className="text-xs text-green-400 mb-1">Total Aprobado</p>
            <p className="text-xl font-bold text-green-400">{formatCOP(kpis.totalApproved)}</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-500/10 border-yellow-500/20">
          <CardContent className="pt-4 pb-4 text-center">
            <p className="text-xs text-yellow-400 mb-1">Total Pendiente</p>
            <p className="text-xl font-bold text-yellow-400">{formatCOP(kpis.totalPending)}</p>
          </CardContent>
        </Card>
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="pt-4 pb-4 text-center">
            <p className="text-xs text-red-400 mb-1">Total Rechazado</p>
            <p className="text-xl font-bold text-red-400">{formatCOP(kpis.totalDeclined)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialDashboard;
