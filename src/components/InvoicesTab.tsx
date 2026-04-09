import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Download, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Transaction {
  id: string;
  reference: string;
  plan_name: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  siigo_invoice_id: string | null;
}

interface InvoicesTabProps {
  transactions: Transaction[];
  t: (key: string) => string;
  dateLocale: any;
  formatPrice: (amount: number, currency?: string) => string;
}

const InvoicesTab = ({ transactions, t, dateLocale, formatPrice }: InvoicesTabProps) => {
  const { toast } = useToast();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const invoiceTransactions = transactions.filter(
    (tx) => tx.status === "APPROVED" && tx.siigo_invoice_id
  );

  const handleDownloadPdf = async (tx: Transaction) => {
    if (!tx.siigo_invoice_id) return;
    setDownloadingId(tx.id);

    try {
      const { data, error } = await supabase.functions.invoke("siigo-get-invoice-pdf", {
        body: { invoice_id: tx.siigo_invoice_id },
      });

      if (error) throw error;

      // Siigo returns { base64 } or { url } depending on the response
      if (data?.base64) {
        const byteCharacters = atob(data.base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `factura-${tx.reference}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (data?.url) {
        window.open(data.url, "_blank");
      } else {
        throw new Error("No PDF data received");
      }
    } catch (err) {
      console.error("Invoice download error:", err);
      toast({
        title: "Error",
        description: t("dash.invoiceDownloadError"),
        variant: "destructive",
      });
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-semibold">{t("dash.invoicesTitle")}</h2>
      </div>

      {invoiceTransactions.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>{t("dash.noInvoices")}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  {t("dash.invoiceDate")}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  {t("dash.invoicePlan")}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  {t("dash.invoiceAmount")}
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                  {t("dash.downloadInvoice")}
                </th>
              </tr>
            </thead>
            <tbody>
              {invoiceTransactions.map((tx) => (
                <tr key={tx.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-4 text-sm">
                    {format(new Date(tx.created_at), "dd MMM yyyy, h:mm a", { locale: dateLocale })}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium">{tx.plan_name}</td>
                  <td className="py-3 px-4 text-sm">
                    {formatPrice(tx.amount, tx.currency)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadPdf(tx)}
                      disabled={downloadingId === tx.id}
                      className="gap-2"
                    >
                      {downloadingId === tx.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {t("dash.downloadingInvoice")}
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          {t("dash.downloadInvoice")}
                        </>
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InvoicesTab;
