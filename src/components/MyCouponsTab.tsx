import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Ticket, Copy, Eye, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Coupon {
  id: number;
  code: string;
  discount_type: "fixed" | "percent";
  discount_value: number;
  discount_currency: "COP" | "USD";
  expires_at: string | null;
  max_uses: number | null;
  used_count: number;
  status: "active" | "inactive" | "expired" | "exhausted";
  created_at: string;
}

interface CouponUsage {
  id: number;
  id_coupon: number;
  original_amount: number;
  discount_amount: number;
  final_amount: number;
  currency: "COP" | "USD";
  used_at: string;
  user_name?: string;
  user_email?: string;
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

const formatAmount = (amount: number, currency: "COP" | "USD") => {
  const n = Number(amount).toLocaleString("es-CO", { maximumFractionDigits: 2 });
  return currency === "USD" ? `US$ ${n}` : `$ ${n}`;
};

const formatDiscount = (c: Coupon) => {
  if (c.discount_type === "percent") return `${Number(c.discount_value)}%`;
  return formatAmount(c.discount_value, c.discount_currency);
};

const MyCouponsTab = () => {
  const { toast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [usagesByCoupon, setUsagesByCoupon] = useState<Record<number, CouponUsage[]>>({});
  const [loadingUsageId, setLoadingUsageId] = useState<number | null>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.coupons.mine();
      setCoupons((data as Coupon[]) || []);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "No se pudieron cargar tus cupones",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggle = async (c: Coupon) => {
    if (expandedId === c.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(c.id);
    if (!usagesByCoupon[c.id]) {
      setLoadingUsageId(c.id);
      try {
        const data = await api.coupons.mineUsages(c.id);
        setUsagesByCoupon((m) => ({ ...m, [c.id]: (data as CouponUsage[]) || [] }));
      } catch (err: any) {
        toast({
          title: "Error",
          description: err?.message || "No se pudieron cargar los usos",
          variant: "destructive",
        });
      } finally {
        setLoadingUsageId(null);
      }
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Código copiado", description: code });
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <Ticket className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-semibold">Mis cupones</h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Cargando...
        </div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Ticket className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No tienes cupones asignados.</p>
          <p className="text-sm mt-2">Cuando un administrador te asigne uno, aparecerá aquí.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {coupons.map((c) => {
            const isOpen = expandedId === c.id;
            const usages = usagesByCoupon[c.id] || [];
            return (
              <div key={c.id} className="border border-border rounded-lg overflow-hidden">
                <div className="p-4 flex flex-wrap items-center gap-4">
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => copyCode(c.code)}
                      className="inline-flex items-center gap-2 font-mono text-sm bg-secondary px-3 py-2 rounded hover:bg-secondary/80"
                      title="Copiar código"
                    >
                      {c.code}
                      <Copy className="w-3 h-3 opacity-50" />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-muted-foreground">Descuento</div>
                    <div className="font-semibold">{formatDiscount(c)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Expira</div>
                    <div className="text-sm">
                      {c.expires_at
                        ? format(new Date(c.expires_at), "dd MMM yyyy", { locale: es })
                        : <span className="text-muted-foreground">—</span>}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Usos</div>
                    <div className="text-sm">
                      {c.used_count}
                      {c.max_uses != null ? ` / ${c.max_uses}` : ""}
                    </div>
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor[c.status]}`}>
                      {statusLabel[c.status]}
                    </span>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => toggle(c)}>
                    {isOpen ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-1" /> Ocultar
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-1" /> Ver usos
                      </>
                    )}
                  </Button>
                </div>

                {isOpen && (
                  <div className="border-t border-border p-4 bg-secondary/20">
                    {loadingUsageId === c.id ? (
                      <div className="flex items-center justify-center py-6 text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin mr-2" /> Cargando...
                      </div>
                    ) : usages.length === 0 ? (
                      <p className="text-center text-sm text-muted-foreground py-4">
                        Aún nadie ha usado este cupón.
                      </p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left py-2 px-3 font-medium text-muted-foreground">Cliente</th>
                              <th className="text-left py-2 px-3 font-medium text-muted-foreground">Original</th>
                              <th className="text-left py-2 px-3 font-medium text-muted-foreground">Descuento</th>
                              <th className="text-left py-2 px-3 font-medium text-muted-foreground">Pagado</th>
                              <th className="text-left py-2 px-3 font-medium text-muted-foreground">Fecha</th>
                            </tr>
                          </thead>
                          <tbody>
                            {usages.map((u) => (
                              <tr key={u.id} className="border-b border-border/50">
                                <td className="py-2 px-3">
                                  <div className="font-medium">{u.user_name}</div>
                                  <div className="text-xs text-muted-foreground">{u.user_email}</div>
                                </td>
                                <td className="py-2 px-3">{formatAmount(u.original_amount, u.currency)}</td>
                                <td className="py-2 px-3 text-primary">-{formatAmount(u.discount_amount, u.currency)}</td>
                                <td className="py-2 px-3 font-medium">{formatAmount(u.final_amount, u.currency)}</td>
                                <td className="py-2 px-3 text-muted-foreground">
                                  {format(new Date(u.used_at), "dd MMM yyyy HH:mm", { locale: es })}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyCouponsTab;
