// App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load pages
const PlatformPage = lazy(() => import("@/pages/PlatformPage"));
const Nosotros = lazy(() => import("@/pages/Nosotros"));
const Auth = lazy(() => import("@/pages/Auth"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Admin = lazy(() => import("@/pages/Admin"));
const Support = lazy(() => import("@/pages/Support"));
const Seller = lazy(() => import("@/pages/Seller"));
const Renewal = lazy(() => import("@/pages/Renewal"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const Partners = lazy(() => import("@/pages/Partners"));
const TermsAndConditions = lazy(() => import("@/pages/TermsAndConditions"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const CityHub = lazy(() => import("@/pages/CityHub"));
const CountryLanding = lazy(() => import("@/pages/CountryLanding"));
const CityLanding = lazy(() => import("@/pages/CityLanding"));
const USALanding = lazy(() => import("@/pages/USALanding"));
const USAStateLanding = lazy(() => import("@/pages/USAStateLanding"));
const USACityLanding = lazy(() => import("@/pages/USACityLanding"));

const queryClient = new QueryClient();

const Loader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-pulse text-muted-foreground">Cargando...</div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
    <CurrencyProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* Auth & account */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/support" element={<Support />} />
          <Route path="/seller" element={<Seller />} />
          <Route path="/renewal" element={<Renewal />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/terminos" element={<TermsAndConditions />} />
          <Route path="/privacidad" element={<PrivacyPolicy />} />
          {/* Content pages */}
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/plataformas/:platform" element={<PlatformPage />} />
          <Route path="/ciudades/" element={<CityHub />} />
          <Route path="/ciudades/:slug/" element={<Index />} />
          {/* USA routes */}
          <Route path="/usa" element={<USALanding />} />
          <Route path="/usa/:stateSlug" element={<USAStateLanding />} />
          <Route path="/usa/:stateSlug/:citySlug" element={<USACityLanding />} />
          {/* Country/City routes (must be last) */}
          <Route path="/:countrySlug" element={<CountryLanding />} />
          <Route path="/:countrySlug/:citySlug" element={<CityLanding />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </TooltipProvider>
    </CurrencyProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
