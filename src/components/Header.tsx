import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Sobre", path: "/sobre" },
    { name: "Serviços", path: "/servicos" },

    { name: "Setores", path: "/setores" },
    { name: "Conteúdos", path: "/conteudos" },
    { name: "Equipe", path: "/equipe" },
    { name: "Contato", path: "/contato" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-primary">VIVENS</div>
            <div className="hidden md:block text-xs text-muted-foreground max-w-[180px] leading-tight">
              Vida valorizada,<br />ciência avançada
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(link.path)
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground hover:bg-muted"
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-4">
            <Button variant="cta" size="lg" asChild>
              <Link to="/contato">Solicitar Orçamento</Link>
            </Button>
          </div>

          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden py-4 space-y-2 border-t">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive(link.path)
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground hover:bg-muted"
                  }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="px-4 pt-2">
              <Button variant="cta" size="lg" className="w-full" asChild>
                <Link to="/contato" onClick={() => setIsMenuOpen(false)}>
                  Solicitar Orçamento
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
