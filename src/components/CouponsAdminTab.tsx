import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Copy,
  Ticket,
  Loader2,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Profile {
  id: number;
  name: string;
  email: string;
  company_name: string | null;
}

interface Coupon {
  id: number;
  id_user_owner: number;
  id_user_creator: number;
  code: string;
  discount_type: "fixed" | "percent";
  discount_value: number;
  discount_currency: "COP" | "USD";
  expires_at: string | null;
  max_uses: number | null;
  used_count: number;
  status: "active" | "inactive" | "expired" | "exhausted";
  created_at: string;
  owner_name?: string;
  owner_email?: string;
  creator_name?: string;
}

interface CouponUsage {
  id: number;
  id_coupon: number;
  id_user: number;
  original_amount: number;
  discount_amount: number;
  final_amount: number;
  currency: "COP" | "USD";
  trm_rate_used: number | null;
  used_at: string;
  user_name?: string;
  user_email?: string;
}

interface CouponsAdminTabProps {
  profiles: Profile[];
}

const statusLabel: Record<Coupon["status"], string> = {
  active: "Activo",
  inactive: "Inactivo",
  expired: "Expirado",
  exhausted: "Agotado",
};

const statusColor: Record<Coupon["status"], string> = {
  active: "bg-green-500/20 text-green-400",
  inactive: "bg-gray-500/20 text-gray-400",
  expired: "bg-yellow-500/20 text-yellow-400",
  exhausted: "bg-red-500/20 text-red-400",
};

const CouponsAdminTab = ({ profiles }: CouponsAdminTabProps) => {
  const { toast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Create/Edit modal state
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    idUserOwner: "" as string | number,
    codeMode: "auto" as "auto" | "manual",
    code: "",
    discountType: "fixed" as "fixed" | "percent",
    discountValue: "" as string | number,
    discountCurrency: "COP" as "COP" | "USD",
    expiresAt: "",
    maxUses: "" as string | number,
    status: "active" as "active" | "inactive",
  });

  // Usages modal state
  const [usagesOpen, setUsagesOpen] = useState(false);
  const [usagesCoupon, setUsagesCoupon] = useState<Coupon | null>(null);
  const [usages, setUsages] = useState<CouponUsage[]>([]);
  const [loadingUsages, setLoadingUsages] = useState(false);

  // Owner combobox state
  const [ownerPickerOpen, setOwnerPickerOpen] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.coupons.list();
      setCoupons((data as Coupon[]) || []);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "No se pudieron cargar los cupones",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return coupons.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (!term) return true;
      return (
        c.code.toLowerCase().includes(term) ||
        (c.owner_name || "").toLowerCase().includes(term) ||
        (c.owner_email || "").toLowerCase().includes(term)
      );
    });
  }, [coupons, search, statusFilter]);

  const openCreate = () => {
    setEditing(null);
    setForm({
      idUserOwner: "",
      codeMode: "auto",
      code: "",
      discountType: "fixed",
      discountValue: "",
      discountCurrency: "COP",
      expiresAt: "",
      maxUses: "",
      status: "active",
    });
    setFormOpen(true);
  };

  const openEdit = (c: Coupon) => {
    setEditing(c);
    setForm({
      idUserOwner: c.id_user_owner,
      codeMode: "auto",
      code: c.code,
      discountType: c.discount_type || "fixed",
      discountValue: c.discount_value,
      discountCurrency: c.discount_currency,
      expiresAt: c.expires_at ? c.expires_at.substring(0, 10) : "",
      maxUses: c.max_uses ?? "",
      // Solo "active"/"inactive" son manuales; expired/exhausted se recalculan solos
      status: c.status === "inactive" ? "inactive" : "active",
    });
    setFormOpen(true);
  };

  const submit = async () => {
    if (!editing && !form.idUserOwner) {
      toast({ title: "Falta el dueño", description: "Selecciona un usuario dueño del cupón.", variant: "destructive" });
      return;
    }
    const discountValue = Number(form.discountValue);
    if (!discountValue || discountValue <= 0) {
      toast({ title: "Valor inválido", description: "El valor del descuento debe ser mayor a 0.", variant: "destructive" });
      return;
    }
    if (form.discountType === "percent" && discountValue > 100) {
      toast({ title: "Porcentaje inválido", description: "El porcentaje no puede ser mayor a 100.", variant: "destructive" });
      return;
    }

    let manualCode: string | undefined;
    if (!editing && form.codeMode === "manual") {
      manualCode = form.code.trim().toUpperCase();
      const validShape = /^[A-Z0-9](?:[A-Z0-9-]{2,18}[A-Z0-9])?$/.test(manualCode);
      const noDoubleDash = !/--/.test(manualCode);
      if (!validShape || !noDoubleDash) {
        toast({
          title: "Código inválido",
          description: "4-20 caracteres, solo A-Z, 0-9 y guiones (no al inicio/fin ni dobles).",
          variant: "destructive",
        });
        return;
      }
    }
    const hasExpiry = !!form.expiresAt;
    const hasMaxUses = !!form.maxUses && Number(form.maxUses) > 0;
    if (!hasExpiry && !hasMaxUses) {
      toast({
        title: "Falta un límite",
        description: "Debe tener fecha de expiración o cantidad máxima (o ambos).",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        await api.coupons.update(editing.id, {
          discountType: form.discountType,
          discountValue,
          discountCurrency: form.discountType === "percent" ? "COP" : form.discountCurrency,
          expiresAt: hasExpiry ? form.expiresAt : null,
          maxUses: hasMaxUses ? Number(form.maxUses) : null,
          status: form.status,
        });
        toast({ title: "Cupón actualizado" });
      } else {
        await api.coupons.create({
          idUserOwner: Number(form.idUserOwner),
          ...(manualCode ? { code: manualCode } : {}),
          discountType: form.discountType,
          discountValue,
          discountCurrency: form.discountType === "percent" ? "COP" : form.discountCurrency,
          expiresAt: hasExpiry ? form.expiresAt : null,
          maxUses: hasMaxUses ? Number(form.maxUses) : null,
        });
        toast({ title: "Cupón creado" });
      }
      setFormOpen(false);
      await load();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "No se pudo guardar el cupón",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (c: Coupon) => {
    if (!confirm(`¿Eliminar el cupón ${c.code}? Esta acción no se puede deshacer.`)) return;
    try {
      await api.coupons.remove(c.id);
      toast({ title: "Cupón eliminado" });
      await load();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "No se pudo eliminar el cupón",
        variant: "destructive",
      });
    }
  };

  const openUsages = async (c: Coupon) => {
    setUsagesCoupon(c);
    setUsagesOpen(true);
    setLoadingUsages(true);
    try {
      const data = await api.coupons.getById(c.id);
      setUsages(((data as any)?.usages as CouponUsage[]) || []);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "No se pudieron cargar los usos",
        variant: "destructive",
      });
    } finally {
      setLoadingUsages(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Código copiado", description: code });
  };

  const formatAmount = (amount: number, currency: "COP" | "USD") => {
    const n = Number(amount).toLocaleString("es-CO", { maximumFractionDigits: 2 });
    return currency === "USD" ? `US$ ${n}` : `$ ${n}`;
  };

  const formatDiscount = (c: Coupon) => {
    if (c.discount_type === "percent") return `${Number(c.discount_value)}%`;
    return formatAmount(c.discount_value, c.discount_currency);
  };

  return (
    <div className="glass-card p-6">
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar por código, dueño o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-secondary border-border"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 bg-secondary border-border">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Activos</SelectItem>
            <SelectItem value="inactive">Inactivos</SelectItem>
            <SelectItem value="expired">Expirados</SelectItem>
            <SelectItem value="exhausted">Agotados</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={openCreate} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo cupón
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Cargando...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Ticket className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No hay cupones.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Código</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Dueño</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Descuento</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Expira</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Usos</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Estado</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-border/50 hover:bg-secondary/30">
                  <td className="py-3 px-4">
                    <button
                      onClick={() => copyCode(c.code)}
                      className="inline-flex items-center gap-2 font-mono text-sm bg-secondary px-2 py-1 rounded hover:bg-secondary/80"
                      title="Copiar código"
                    >
                      {c.code}
                      <Copy className="w-3 h-3 opacity-50" />
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium">{c.owner_name || `Usuario #${c.id_user_owner}`}</div>
                    <div className="text-xs text-muted-foreground">{c.owner_email}</div>
                  </td>
                  <td className="py-3 px-4 font-medium">{formatDiscount(c)}</td>
                  <td className="py-3 px-4 text-sm">
                    {c.expires_at
                      ? format(new Date(c.expires_at), "dd MMM yyyy", { locale: es })
                      : <span className="text-muted-foreground">—</span>}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {c.used_count}
                    {c.max_uses != null ? ` / ${c.max_uses}` : ""}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor[c.status]}`}>
                      {statusLabel[c.status]}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => openUsages(c)} title="Ver usos">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => openEdit(c)} title="Editar">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => remove(c)} title="Eliminar" className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar cupón" : "Crear cupón"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {!editing && (
              <div>
                <Label>Dueño del cupón</Label>
                <Popover open={ownerPickerOpen} onOpenChange={setOwnerPickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      aria-expanded={ownerPickerOpen}
                      className="w-full justify-between font-normal"
                    >
                      {form.idUserOwner
                        ? (() => {
                            const p = profiles.find((pr) => pr.id === Number(form.idUserOwner));
                            return p ? `${p.name} — ${p.email}` : "Selecciona un usuario";
                          })()
                        : "Selecciona un usuario"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command
                      filter={(value, search) => {
                        if (!search) return 1;
                        return value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
                      }}
                    >
                      <CommandInput placeholder="Buscar por nombre o email..." />
                      <CommandList>
                        <CommandEmpty>No hay usuarios.</CommandEmpty>
                        <CommandGroup>
                          {profiles.map((p) => {
                            const label = `${p.name || ""} ${p.email || ""} ${p.company_name || ""}`.trim();
                            return (
                              <CommandItem
                                key={p.id}
                                value={`${label} ${p.id}`}
                                onSelect={() => {
                                  setForm((f) => ({ ...f, idUserOwner: p.id }));
                                  setOwnerPickerOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    Number(form.idUserOwner) === p.id ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                <div className="flex flex-col min-w-0">
                                  <span className="text-sm truncate">{p.name}</span>
                                  <span className="text-xs opacity-70 truncate">{p.email}</span>
                                </div>
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {!editing && (
              <div>
                <Label>Código del cupón</Label>
                <Select
                  value={form.codeMode}
                  onValueChange={(v: "auto" | "manual") => setForm((f) => ({ ...f, codeMode: v, code: v === "auto" ? "" : f.code }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Autogenerar</SelectItem>
                    <SelectItem value="manual">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
                {form.codeMode === "manual" && (
                  <div className="mt-2">
                    <Input
                      placeholder="Ej: AGENTIA-IA-GRATIS"
                      value={form.code}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, code: e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, "") }))
                      }
                      maxLength={20}
                      className="uppercase font-mono"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      4-20 caracteres. Letras (A-Z), números (0-9) y guiones. No al inicio/fin ni dobles.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div>
              <Label>Tipo de descuento</Label>
              <Select
                value={form.discountType}
                onValueChange={(v: "fixed" | "percent") => setForm((f) => ({ ...f, discountType: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Valor fijo</SelectItem>
                  <SelectItem value="percent">Porcentaje</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {form.discountType === "percent" ? (
              <div>
                <Label>Porcentaje de descuento</Label>
                <div className="relative">
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    value={form.discountValue}
                    onChange={(e) => setForm((f) => ({ ...f, discountValue: e.target.value }))}
                    placeholder="10"
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Se aplica sobre el monto del plan al pagar.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <Label>Valor del descuento</Label>
                  <Input
                    type="number"
                    min={1}
                    value={form.discountValue}
                    onChange={(e) => setForm((f) => ({ ...f, discountValue: e.target.value }))}
                    placeholder="50000"
                  />
                </div>
                <div>
                  <Label>Moneda</Label>
                  <Select
                    value={form.discountCurrency}
                    onValueChange={(v: "COP" | "USD") => setForm((f) => ({ ...f, discountCurrency: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COP">COP</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="p-3 rounded-md bg-secondary/50 text-xs text-muted-foreground">
              Debe tener al menos fecha de expiración o cantidad máxima de usos. Lo primero que ocurra invalida el cupón.
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Expira el</Label>
                <Input
                  type="date"
                  value={form.expiresAt}
                  onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
                />
              </div>
              <div>
                <Label>Cantidad máxima de usos</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.maxUses}
                  onChange={(e) => setForm((f) => ({ ...f, maxUses: e.target.value }))}
                  placeholder="Ej: 50"
                />
              </div>
            </div>

            {editing && (
              <div>
                <Label>Estado</Label>
                <Select
                  value={form.status}
                  onValueChange={(v: "active" | "inactive") => setForm((f) => ({ ...f, status: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  "Expirado" y "Agotado" se calculan solos según la fecha y los usos.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setFormOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={submit} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Usages dialog */}
      <Dialog open={usagesOpen} onOpenChange={setUsagesOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ticket className="w-5 h-5" />
              Usos del cupón <code className="font-mono bg-secondary px-2 py-1 rounded text-sm ml-1">{usagesCoupon?.code}</code>
            </DialogTitle>
          </DialogHeader>

          {loadingUsages ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Cargando...
            </div>
          ) : usages.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Este cupón aún no ha sido usado.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 text-sm font-medium text-muted-foreground">Cliente</th>
                    <th className="text-left py-2 px-3 text-sm font-medium text-muted-foreground">Original</th>
                    <th className="text-left py-2 px-3 text-sm font-medium text-muted-foreground">Descuento</th>
                    <th className="text-left py-2 px-3 text-sm font-medium text-muted-foreground">Pagado</th>
                    <th className="text-left py-2 px-3 text-sm font-medium text-muted-foreground">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {usages.map((u) => (
                    <tr key={u.id} className="border-b border-border/50">
                      <td className="py-2 px-3">
                        <div className="font-medium">{u.user_name}</div>
                        <div className="text-xs text-muted-foreground">{u.user_email}</div>
                      </td>
                      <td className="py-2 px-3 text-sm">{formatAmount(u.original_amount, u.currency)}</td>
                      <td className="py-2 px-3 text-sm text-primary">-{formatAmount(u.discount_amount, u.currency)}</td>
                      <td className="py-2 px-3 text-sm font-medium">{formatAmount(u.final_amount, u.currency)}</td>
                      <td className="py-2 px-3 text-sm text-muted-foreground">
                        {format(new Date(u.used_at), "dd MMM yyyy HH:mm", { locale: es })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CouponsAdminTab;
