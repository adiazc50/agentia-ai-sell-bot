import { FileText } from "lucide-react";
import { format } from "date-fns";

interface Transaction {
  id: number;
  reference: string;
  plan_name: string;
  amount: number;
  currency: string;
  created_at: string;
  transaction_id: string | null;
  payment_method: string | null;
  transaction_date: string | null;
  id_company: number;
}

interface InvoicesTabProps {
  transactions: Transaction[];
  t: (key: string) => string;
  dateLocale: any;
  formatPrice: (amount: number, currency?: string) => string;
}

const InvoicesTab = ({ transactions, t, dateLocale, formatPrice }: InvoicesTabProps) => {
  // All logged transactions are implicitly approved (no status field in MySQL)
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-semibold">{t("dash.invoicesTitle")}</h2>
      </div>

      {transactions.length === 0 ? (
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
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Ref
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-4 text-sm">
                    {format(new Date(tx.created_at), "dd MMM yyyy, h:mm a", { locale: dateLocale })}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium">{tx.plan_name}</td>
                  <td className="py-3 px-4 text-sm">
                    {formatPrice(tx.amount, tx.currency)}
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">
                    {tx.reference}
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
