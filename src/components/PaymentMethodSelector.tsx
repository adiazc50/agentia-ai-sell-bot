import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import wompiLogo from "@/assets/wompi-logo.png";

interface PaymentMethodSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelectWompi: () => void;
  onSelectPayPal: () => void;
  planName: string;
  amountDisplay: string;
  loading?: boolean;
}

const PaymentMethodSelector = ({
  open,
  onClose,
  onSelectWompi,
  onSelectPayPal,
  planName,
  amountDisplay,
  loading = false,
}: PaymentMethodSelectorProps) => {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Selecciona tu método de pago
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          <div className="text-center text-sm text-muted-foreground mb-4">
            <span className="font-semibold text-foreground">{planName}</span>
            <br />
            <span>{amountDisplay}</span>
          </div>

          {/* Wompi - COP */}
          <Button
            variant="outline"
            className="w-full h-auto py-4 px-5 flex items-center gap-4 justify-start hover:border-primary/50 hover:bg-primary/5 transition-all"
            onClick={onSelectWompi}
            disabled={loading}
          >
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-[#B0F2AE] flex items-center justify-center">
              <img src={wompiLogo} alt="Wompi" className="w-10 h-10 object-contain" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-foreground">Wompi</p>
              <p className="text-xs text-muted-foreground">
                Tarjeta de crédito/débito, PSE, Nequi (COP)
              </p>
            </div>
          </Button>

          {/* PayPal - USD */}
          <Button
            variant="outline"
            className="w-full h-auto py-4 px-5 flex items-center gap-4 justify-start hover:border-[#0070BA]/50 hover:bg-[#0070BA]/5 transition-all"
            onClick={onSelectPayPal}
            disabled={loading}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0070BA] to-[#003087] flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-semibold text-foreground">PayPal</p>
              <p className="text-xs text-muted-foreground">
                PayPal, tarjeta internacional (USD)
              </p>
            </div>
          </Button>

          {loading && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm pt-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Procesando...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentMethodSelector;
