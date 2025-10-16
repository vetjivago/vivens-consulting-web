import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Sobre from "./pages/Sobre";
import Servicos from "./pages/Servicos";
import Consultoria from "./pages/servicos/Consultoria";
import Toxicologia from "./pages/servicos/Toxicologia";
import Educacao from "./pages/servicos/Educacao";
import BemEstar from "./pages/servicos/BemEstar";
import Veterinaria from "./pages/servicos/Veterinaria";
import Infraestrutura from "./pages/Infraestrutura";
import Setores from "./pages/Setores";
import Equipe from "./pages/Equipe";
import Contato from "./pages/Contato";
import Conteudos from "./pages/Conteudos";
import Politicas from "./pages/Politicas";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Footer from "./components/Footer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/servicos" element={<Servicos />} />
          <Route path="/servicos/consultoria" element={<Consultoria />} />
          <Route path="/servicos/toxicologia" element={<Toxicologia />} />
          <Route path="/servicos/educacao" element={<Educacao />} />
          <Route path="/servicos/bem-estar" element={<BemEstar />} />
          <Route path="/servicos/veterinaria" element={<Veterinaria />} />
          <Route path="/infraestrutura" element={<Infraestrutura />} />
          <Route path="/setores" element={<Setores />} />
          <Route path="/equipe" element={<Equipe />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/conteudos" element={<Conteudos />} />
          <Route path="/politicas" element={<Politicas />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
