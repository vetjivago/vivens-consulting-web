import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";

import logoImage from "@/assets/logo.jpg";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="mb-4 bg-white p-2 rounded max-w-[150px]">
              <img src={logoImage} alt="VIVENS" className="w-full h-auto object-contain" />
            </div>
            <p className="text-sm opacity-90">
              Vida valorizada, ciência avançada
            </p>
            <p className="text-sm opacity-80 mt-4">
              Consultoria especializada em bem-estar animal e estudos toxicológicos.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Navegação</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/sobre" className="opacity-90 hover:opacity-100 transition-opacity">Sobre</Link></li>
              <li><Link to="/servicos" className="opacity-90 hover:opacity-100 transition-opacity">Serviços</Link></li>
              {/* <li><Link to="/infraestrutura" className="opacity-90 hover:opacity-100 transition-opacity">Infraestrutura</Link></li> */}
              <li><Link to="/equipe" className="opacity-90 hover:opacity-100 transition-opacity">Equipe</Link></li>
              <li><Link to="/contato" className="opacity-90 hover:opacity-100 transition-opacity">Contato</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Serviços</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/servicos/consultoria" className="opacity-90 hover:opacity-100 transition-opacity">Consultoria Científica</Link></li>
              <li><Link to="/servicos/toxicologia" className="opacity-90 hover:opacity-100 transition-opacity">Toxicologia</Link></li>
              <li><Link to="/servicos/educacao" className="opacity-90 hover:opacity-100 transition-opacity">Educação</Link></li>
              <li><Link to="/servicos/bem-estar" className="opacity-90 hover:opacity-100 transition-opacity">Bem-estar Animal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail size={16} className="mt-1 flex-shrink-0 opacity-80" />
                <a href="mailto:vivensconsultoria@gmail.com" className="opacity-90 hover:opacity-100 transition-opacity">
                  vivensconsultoria@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-1 flex-shrink-0 opacity-80" />
                <span className="opacity-90">Brasília, DF - Atuação Nacional</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p className="opacity-80">
            © {new Date().getFullYear()} Vivens Consultoria Científica Ltda. Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
            <Link to="/politicas" className="opacity-80 hover:opacity-100 transition-opacity">
              Políticas de Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
