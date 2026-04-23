import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, Play, Handshake } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { isAuthenticated, logout as apiLogout, getUser } from "@/lib/api";
import { LogIn, UserPlus, LogOut, User } from "lucide-react";

const linkBase =
  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50";

/* ── Platform brand logos (inline SVG) ── */
const WhatsAppLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="#25D366">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const InstagramLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="url(#ig-gradient)">
    <defs>
      <radialGradient id="ig-gradient" cx="30%" cy="107%" r="150%">
        <stop offset="0%" stopColor="#fdf497" />
        <stop offset="5%" stopColor="#fdf497" />
        <stop offset="45%" stopColor="#fd5949" />
        <stop offset="60%" stopColor="#d6249f" />
        <stop offset="90%" stopColor="#285AEB" />
      </radialGradient>
    </defs>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const MessengerLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="#0084FF">
    <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.3 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8.2l3.131 3.259L19.752 8.2l-6.561 6.763z"/>
  </svg>
);

const TikTokLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.75a8.18 8.18 0 004.77 1.52V6.84a4.84 4.84 0 01-1-.15z"/>
  </svg>
);

const WordPressLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="#21759B">
    <path d="M12.158 12.786l-2.698 7.84a8.943 8.943 0 005.09-.133.746.746 0 01-.06-.115l-2.332-7.592zM3.009 12a8.995 8.995 0 004.795 7.958l-4.06-11.13A8.934 8.934 0 003.009 12zm8.991-8.991a8.95 8.95 0 00-5.637 1.993c.097.003.19.01.283.01.918 0 2.34-.112 2.34-.112.473-.028.529.668.056.724 0 0-.476.056-.895.084l3.195 9.502 1.92-5.758-1.367-3.744a14.28 14.28 0 01-.817-.084c-.473-.028-.418-.752.056-.724 0 0 1.45.112 2.312.112.919 0 2.34-.112 2.34-.112.474-.028.53.668.057.724 0 0-.476.056-.896.084l3.17 9.428.927-3.446c.472-1.263.705-2.27.705-3.088 0-1.181-.43-1.998-.798-2.634-.49-.798-1.007-1.473-1.007-2.27 0-.891.675-1.72 1.628-1.72.043 0 .084.006.124.008A8.963 8.963 0 0012 3.009zm9.603 3.2a8.94 8.94 0 01.388 2.63c0 2.565-.98 4.326-1.903 6.218l-.003.006-2.587-7.482c.49-.894.653-1.61.653-2.248 0-.23-.016-.445-.046-.645a8.942 8.942 0 013.498 1.521zM12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/>
  </svg>
);

const platformLinks: { label: string; href: string; icon: React.FC<{ className?: string }> }[] = [
  { label: "WhatsApp", href: "/plataformas/whatsapp", icon: WhatsAppLogo },
  { label: "Instagram", href: "/plataformas/instagram", icon: InstagramLogo },
  { label: "Messenger", href: "/plataformas/messenger", icon: MessengerLogo },
  { label: "TikTok", href: "/plataformas/tiktok", icon: TikTokLogo },
  { label: "WordPress", href: "/plataformas/wordpress", icon: WordPressLogo },
];

const cityLinks: [string, string][] = [
  ["Bogotá", "/ciudades/bogota/"],
  ["Medellín", "/ciudades/medellin/"],
  ["Cali", "/ciudades/cali/"],
  ["Barranquilla", "/ciudades/barranquilla/"],
  ["Cartagena", "/ciudades/cartagena/"],
  ["Bucaramanga", "/ciudades/bucaramanga/"],
  ["Cúcuta", "/ciudades/cucuta/"],
  ["Pereira", "/ciudades/pereira/"],
  ["Santa Marta", "/ciudades/santa-marta/"],
  ["Valledupar", "/ciudades/valledupar/"],
  ["Ibagué", "/ciudades/ibague/"],
  ["Ciudad de Panamá", "/ciudades/ciudad-de-panama/"],
];

const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const [loggedIn, setLoggedIn] = useState<boolean>(isAuthenticated());
  const [mobileOpen, setMobileOpen] = useState(false);
  const [platformsOpen, setPlatformsOpen] = useState(false);
  const [citiesOpen, setCitiesOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onStorage = () => setLoggedIn(isAuthenticated());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Close mobile menu on route change or outside click
  useEffect(() => {
    if (!mobileOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [mobileOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const closeMobile = () => {
    setMobileOpen(false);
    setPlatformsOpen(false);
    setCitiesOpen(false);
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border"
      aria-label="Principal"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="shrink-0" title="Inicio - SoyAgentia">
          <img src="/logo-soyagentia.png" alt="SoyAgentia" className="h-8" />
        </a>

        {/* ─── Desktop Navigation ─── */}
        <div className="hidden lg:block">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <a href="/" className={linkBase} title={t("nav.home")}>
                    {t("nav.home")}
                  </a>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm">{t("nav.platforms")}</NavigationMenuTrigger>
                <NavigationMenuContent className="p-4">
                  <div className="grid gap-1 w-[260px]">
                    {platformLinks.map(({ label, href, icon: Icon }) => (
                      <NavigationMenuLink key={href} asChild>
                        <a
                          href={href}
                          className="flex items-center gap-3 rounded-md px-3 py-3 text-sm hover:bg-accent/10 transition-colors"
                          title={`${t("nav.platformAI")} ${label}`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{label}</span>
                        </a>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <a href="#planes" className={linkBase} title={t("nav.viewPlans")}>
                    {t("nav.plans")}
                  </a>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <a href="/casos-de-uso" className={linkBase} title={t("nav.useCases")}>
                    {t("nav.useCases")}
                  </a>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <a href="/nosotros" className={linkBase} title={t("nav.about")}>
                    {t("nav.about")}
                  </a>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <a href="/recursos" className={linkBase} title="Recursos">
                    <Play className="w-3.5 h-3.5 mr-1" />
                    Recursos
                  </a>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <a href="/partners" className={`${linkBase} text-primary font-medium hover:text-primary/80`} title="¿Quieres ser Partner?">
                    <Handshake className="w-4 h-4 mr-1" />
                    ¿Quieres ser Partner?
                  </a>
                </NavigationMenuLink>
              </NavigationMenuItem>

            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Desktop auth + lang */}
        <div className="hidden lg:flex items-center gap-2">
          <LanguageSwitcher />
          {loggedIn ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <a href="/dashboard" title={t("nav.myAccount")}>
                  <User className="w-4 h-4 mr-1" />
                  {t("nav.myAccount")}
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => apiLogout()}
              >
                <LogOut className="w-4 h-4 mr-1" />
                {t("nav.logout")}
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <a href="/auth?mode=login">
                  <LogIn className="w-4 h-4 mr-1" />
                  {t("nav.login")}
                </a>
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-primary to-accent text-primary-foreground" asChild>
                <a href="/auth?mode=register">
                  <UserPlus className="w-4 h-4 mr-1" />
                  {t("nav.register")}
                </a>
              </Button>
            </>
          )}
        </div>

        {/* ─── Mobile: lang + hamburger ─── */}
        <div className="flex lg:hidden items-center gap-2">
          <LanguageSwitcher />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-accent/10 transition-colors"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ─── Mobile Drawer ─── */}
      <div
        className={`fixed inset-0 top-16 z-[100] lg:hidden transition-opacity duration-300 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40" onClick={closeMobile} />

        {/* Drawer panel */}
        <div
          ref={drawerRef}
          className={`absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-background border-l border-border shadow-2xl overflow-y-auto transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
        >
            <div className="p-5 space-y-1">
              {/* Inicio */}
              <a
                href="/"
                onClick={closeMobile}
                className="block px-4 py-3 rounded-lg text-sm font-medium hover:bg-accent/10 transition-colors"
              >
                {t("nav.home")}
              </a>

              {/* Plataformas (collapsible) */}
              <div>
                <button
                  onClick={() => setPlatformsOpen(!platformsOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium hover:bg-accent/10 transition-colors"
                >
                  {t("nav.platforms")}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${platformsOpen ? "rotate-180" : ""}`} />
                </button>
                {platformsOpen && (
                  <div className="ml-4 pl-4 border-l-2 border-accent/20 space-y-1 mt-1">
                    {platformLinks.map(({ label, href, icon: Icon }) => (
                      <a
                        key={href}
                        href={href}
                        onClick={closeMobile}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-accent/10 transition-colors"
                      >
                        <Icon className="w-4 h-4" />
                        <span>{label}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Planes */}
              <a
                href="#planes"
                onClick={closeMobile}
                className="block px-4 py-3 rounded-lg text-sm font-medium hover:bg-accent/10 transition-colors"
              >
                {t("nav.plans")}
              </a>

              {/* Casos de uso */}
              <a
                href="/casos-de-uso"
                onClick={closeMobile}
                className="block px-4 py-3 rounded-lg text-sm font-medium hover:bg-accent/10 transition-colors"
              >
                {t("nav.useCases")}
              </a>

              {/* Nosotros */}
              <a
                href="/nosotros"
                onClick={closeMobile}
                className="block px-4 py-3 rounded-lg text-sm font-medium hover:bg-accent/10 transition-colors"
              >
                {t("nav.about")}
              </a>

              {/* Recursos */}
              <a
                href="/recursos"
                onClick={closeMobile}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium hover:bg-accent/10 transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                Recursos
              </a>

              {/* Partner */}
              <a
                href="/partners"
                onClick={closeMobile}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <Handshake className="w-4 h-4" />
                ¿Quieres ser Partner?
              </a>

              {/* Divider */}
              <div className="my-4 border-t border-border" />

              {/* Auth buttons */}
              {loggedIn ? (
                <div className="space-y-2 px-4">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/dashboard" onClick={closeMobile}>
                      <User className="w-4 h-4 mr-2" />
                      {t("nav.myAccount")}
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:text-destructive"
                    onClick={() => { apiLogout(); closeMobile(); }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {t("nav.logout")}
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 px-4">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/auth?mode=login" onClick={closeMobile}>
                      <LogIn className="w-4 h-4 mr-2" />
                      {t("nav.login")}
                    </a>
                  </Button>
                  <Button className="w-full justify-start bg-gradient-to-r from-primary to-accent text-primary-foreground" asChild>
                    <a href="/auth?mode=register" onClick={closeMobile}>
                      <UserPlus className="w-4 h-4 mr-2" />
                      {t("nav.register")}
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
    </nav>
  );
};

export default Navbar;
