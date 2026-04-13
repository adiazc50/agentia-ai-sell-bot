import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';

type Currency = 'COP' | 'USD';

interface ExchangeRate {
  rate: number;
  rateWithCommission: number;
  lastUpdated: string;
  /** true when we had to use an approximate fallback rate */
  isFallback?: boolean;
  /** timestamp of the last attempt to fetch the rate */
  fetchedAt?: string;
}

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  exchangeRate: ExchangeRate | null;
  loadingRate: boolean;
  convertToSelectedCurrency: (amountCOP: number) => number;
  formatPrice: (amountCOP: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem('preferred-currency');
    return (saved === 'USD' || saved === 'COP') ? saved : 'USD';
  });
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(() => {
    try {
      const raw = localStorage.getItem('cached-exchange-rate');
      if (!raw) return null;

      const parsed = JSON.parse(raw) as Partial<ExchangeRate>;
      if (typeof parsed.rate !== 'number') return null;
      if (typeof parsed.rateWithCommission !== 'number') return null;
      if (typeof parsed.lastUpdated !== 'string') return null;

      return {
        rate: parsed.rate,
        rateWithCommission: parsed.rateWithCommission,
        lastUpdated: parsed.lastUpdated,
        isFallback: Boolean(parsed.isFallback),
        fetchedAt: typeof parsed.fetchedAt === 'string' ? parsed.fetchedAt : parsed.lastUpdated,
      };
    } catch {
      return null;
    }
  });
  const [loadingRate, setLoadingRate] = useState(false);

  // Save currency preference
  useEffect(() => {
    localStorage.setItem('preferred-currency', currency);
  }, [currency]);

  // Persist latest known exchange rate (so we don't show a wrong fallback on every reload)
  useEffect(() => {
    if (!exchangeRate) return;
    localStorage.setItem('cached-exchange-rate', JSON.stringify(exchangeRate));
  }, [exchangeRate]);

  // Check if rate is stale (refresh at least once per day in Colombia time)
  const isRateStale = (lastUpdated?: string | null): boolean => {
    if (!lastUpdated) return true;

    const lastUpdate = new Date(lastUpdated);
    const now = new Date();

    const fmt = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Bogota',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    return fmt.format(lastUpdate) !== fmt.format(now);
  };

  // Keep TRM refreshed daily (even if user is browsing in COP) and re-check hourly
  useEffect(() => {
    const ensureFreshRate = () => {
      if (loadingRate) return;

      const fallbackExpired =
        Boolean(exchangeRate?.isFallback) &&
        (Date.now() - new Date(exchangeRate?.fetchedAt ?? exchangeRate?.lastUpdated ?? 0).getTime() >
          10 * 60 * 1000); // retry after 10 minutes if we previously fell back

      if (!exchangeRate || isRateStale(exchangeRate.lastUpdated) || fallbackExpired) {
        fetchExchangeRate();
      }
    };

    ensureFreshRate();

    const interval = window.setInterval(ensureFreshRate, 60 * 60 * 1000); // 1 hour
    return () => window.clearInterval(interval);
  }, [currency, exchangeRate?.lastUpdated, exchangeRate?.isFallback, exchangeRate?.fetchedAt, loadingRate]);

  const fetchExchangeRate = async () => {
    setLoadingRate(true);
    try {
      const data = await api.trm.latest();

      if (!data?.rate || !data?.rateWithCommission) {
        throw new Error('Respuesta TRM inválida');
      }

      const nowIso = new Date().toISOString();

      setExchangeRate({
        rate: data.rate,
        rateWithCommission: data.rateWithCommission,
        lastUpdated: data.lastUpdated || nowIso,
        isFallback: false,
        fetchedAt: nowIso,
      });
    } catch (error) {
      console.error('Error fetching TRM:', error);

      // Fallback rate in case of error (approximate). Marked as fallback so we can retry later.
      const nowIso = new Date().toISOString();
      setExchangeRate({
        rate: 4200,
        rateWithCommission: 4200 * 1.04,
        lastUpdated: nowIso,
        isFallback: true,
        fetchedAt: nowIso,
      });
    } finally {
      setLoadingRate(false);
    }
  };

  const convertToSelectedCurrency = (amountCOP: number): number => {
    if (currency === 'COP') return amountCOP;

    // Use raw TRM (no commission) for conversion
    const effectiveRate = exchangeRate?.rate ?? 4200;

    // Convert COP to USD using the raw TRM
    return Math.ceil((amountCOP / effectiveRate) * 100) / 100;
  };

  const formatPrice = (amountCOP: number): string => {
    if (currency === 'COP') {
      return `$${amountCOP.toLocaleString('es-CO')} COP`;
    }
    
    const usdAmount = convertToSelectedCurrency(amountCOP);
    return `$${usdAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
  };

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      exchangeRate,
      loadingRate,
      convertToSelectedCurrency,
      formatPrice,
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
