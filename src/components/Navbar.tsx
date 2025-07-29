import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="font-bold text-xl text-primary">
          SoyAgentia
        </div>
        
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Productos</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-64 p-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => scrollToSection('casos-de-uso')}
                  >
                    Ver Casos de Uso
                  </Button>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <Button 
          onClick={() => window.open('https://wa.me/573108536630?text=Hola,%20quiero%20más%20información%20sobre%20los%20agentes%20de%20IA%20para%20mi%20empresa', '_blank')}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          Contactar
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;