import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import React from "react";

const linkBase =
  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50";

const Navbar: React.FC = () => {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border"
      aria-label="Principal"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo / Marca */}
        <a href="/" className="font-bold text-xl text-primary" title="Inicio - SoyAgentia">
          SoyAgentia
        </a>

        <NavigationMenu>
          <NavigationMenuList>
            {/* Inicio */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <a href="/" className={linkBase} title="Inicio">
                  Inicio
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Servicios (scroll interno) */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <a href="#casos-de-uso" className={linkBase} title="Servicios">
                  Servicios
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Nosotros (scroll interno) */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <a href="#nosotros" className={linkBase} title="Nosotros">
                  Nosotros
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Ciudades (nuevo) */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-sm">Ciudades</NavigationMenuTrigger>
              <NavigationMenuContent className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 w-[320px] md:w-[520px]">
                  {/* Top ciudades */}
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
                      Ver todas las ciudades
                    </a>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Botón WhatsApp accesible */}
        <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
          <a
            href="https://wa.me/573009006005?text=Hola,%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20los%20agentes%20de%20IA%20para%20mi%20empresa"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contactar por WhatsApp"
            title="Contactar por WhatsApp"
          >
            Contactar
          </a>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
