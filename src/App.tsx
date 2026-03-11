import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Sobre from "./pages/Sobre";
import Servicos from "./pages/Servicos";
import Consultoria from "./pages/servicos/Consultoria";
import Toxicologia from "./pages/servicos/Toxicologia";
import Educacao from "./pages/servicos/Educacao";
import BemEstar from "./pages/servicos/BemEstar";
import Veterinaria from "./pages/servicos/Veterinaria";
import SistemasGestao from "./pages/servicos/SistemasGestao";
import Infraestrutura from "./pages/Infraestrutura";
import Setores from "./pages/Setores";
import Equipe from "./pages/Equipe";
import Contato from "./pages/Contato";
import Conteudos from "./pages/Conteudos";
import Politicas from "./pages/Politicas";
import NotFound from "./pages/NotFound";
import Parcerias from "./pages/Parcerias";
import TestPage from "./pages/TestPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { InternalLayout } from "./pages/internal/InternalLayout";
import { Dashboard } from "./pages/internal/Dashboard";
import { Clients } from "./pages/internal/Clients";
import { Projects } from "./pages/internal/Projects";
import { ReportList } from "./pages/internal/Reports/ReportList";
import { ReportEditor } from "./pages/internal/Reports/ReportEditor";

// AVA (VLE) Routes
import { AvaLayout } from "./pages/ava/AvaLayout";
import { AvaLogin } from "./pages/ava/AvaLogin";
import { AvaDashboard } from "./pages/ava/AvaDashboard";
import { AvaCoursePlayer } from "./pages/ava/AvaCoursePlayer";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isFullscreenRoute = location.pathname.startsWith('/internal/reports/new') || (location.pathname.startsWith('/internal/reports/') && location.pathname.split('/').length === 4);

  return (
    <>
      {!isFullscreenRoute && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/servicos/consultoria" element={<Consultoria />} />
        <Route path="/servicos/toxicologia" element={<Toxicologia />} />
        <Route path="/servicos/educacao" element={<Educacao />} />
        <Route path="/servicos/bem-estar" element={<BemEstar />} />
        <Route path="/servicos/veterinaria" element={<Veterinaria />} />
        <Route path="/servicos/sistemas-gestao" element={<SistemasGestao />} />
        {/* <Route path="/infraestrutura" element={<Infraestrutura />} /> */}
        <Route path="/setores" element={<Setores />} />
        <Route path="/equipe" element={<Equipe />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/conteudos" element={<Conteudos />} />
        <Route path="/parcerias" element={<Parcerias />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/login" element={<Login />} />
        {/* Protected Internal Routes */}
        <Route
          path="/internal"
          element={
            <ProtectedRoute>
              <InternalLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="projects" element={<Projects />} />
          <Route path="reports" element={<ReportList />} />
        </Route>

        {/* Fullscreen Editor Routes (Internal but outside Layout) */}
        <Route path="/internal/reports/new" element={
          <ProtectedRoute>
            <ReportEditor />
          </ProtectedRoute>
        } />
        <Route path="/internal/reports/:id" element={
          <ProtectedRoute>
            <ReportEditor />
          </ProtectedRoute>
        } />

        <Route path="/politicas" element={<Politicas />} />
        
        {/* AVA (VLE) Routes */}
        <Route path="/ava/login" element={<AvaLogin />} />
        <Route path="/ava" element={<AvaLayout />}>
          <Route path="dashboard" element={<AvaDashboard />} />
          <Route path="curso/:id" element={<AvaCoursePlayer />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isFullscreenRoute && <Footer />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
