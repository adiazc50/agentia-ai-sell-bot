import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { MessageCircle, Instagram, Send, Music, Globe } from "lucide-react";
import React, { useState, useEffect } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { isAuthenticated, logout as apiLogout, getUser } from "@/lib/api";
import { LogIn, UserPlus, LogOut, User } from "lucide-react";

const linkBase =
  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50";

const platformLinks: { label: string; href: string; icon: React.ElementType; color: string }[] = [
  { label: "WhatsApp", href: "/plataformas/whatsapp", icon: MessageCircle, color: "#25D366" },
  { label: "Instagram", href: "/plataformas/instagram", icon: Instagram, color: "#E1306C" },
  { label: "Messenger", href: "/plataformas/messenger", icon: Send, color: "#0084FF" },
  { label: "TikTok", href: "/plataformas/tiktok", icon: Music, color: "#FF0050" },
  { label: "WordPress", href: "/plataformas/wordpress", icon: Globe, color: "#21759B" },
];

const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const [loggedIn, setLoggedIn] = useState<boolean>(isAuthenticated());

  useEffect(() => {
    const onStorage = () => setLoggedIn(isAuthenticated());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border"
      aria-label="Principal"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo / Marca */}
        <a href="/" className="font-bold text-xl gradient-text" title="Inicio - SoyAgentia">
          SoyAgentia
        </a>

        <NavigationMenu>
          <NavigationMenuList>
            {/* Inicio */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <a href="/" className={linkBase} title={t("nav.home")}>
                  {t("nav.home")}
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Plataformas */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-sm">{t("nav.platforms")}</NavigationMenuTrigger>
              <NavigationMenuContent className="p-4">
                <div className="grid gap-1 w-[260px]">
                  {platformLinks.map(({ label, href, icon: Icon, color }) => (
                    <NavigationMenuLink key={href} asChild>
                      <a
                        href={href}
                        className="flex items-center gap-3 rounded-md px-3 py-3 text-sm hover:bg-accent/10 transition-colors"
                        title={`${t("nav.platformAI")} ${label}`}
                      >
                        <Icon className="w-5 h-5" style={{ color }} />
                        <span className="font-medium">{label}</span>
                      </a>
                    </NavigationMenuLink>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Planes */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <a href="#planes" className={linkBase} title={t("nav.viewPlans")}>
                  {t("nav.plans")}
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Casos de uso */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <a href="/casos-de-uso" className={linkBase} title={t("nav.useCases")}>
                  {t("nav.useCases")}
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Nosotros */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <a href="/nosotros" className={linkBase} title={t("nav.about")}>
                  {t("nav.about")}
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Ciudades */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-sm">{t("nav.cities")}</NavigationMenuTrigger>
              <NavigationMenuContent className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 w-[320px] md:w-[520px]">
                  {[
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
                  ].map(([label, href]) => (
                    <NavigationMenuLink key={href} asChild>
                      <a
                        href={href}
                        className="rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                        title={`Agentes de IA en ${label}`}
                      >
                        {label}
                      </a>
                    </NavigationMenuLink>
                  ))}
                </div>
                <div className="mt-3">
                  <NavigationMenuLink asChild>
                    <a
                      href="/ciudades/"
                      className="inline-block rounded-md px-3 py-2 text-sm font-medium bg-muted hover:bg-accent hover:text-accent-foreground"
                      title="Ver todas las ciudades"
                    >
                      {t("nav.viewAllCities")}
                    </a>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
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
      </div>
    </nav>
  );
};

export default Navbar;
