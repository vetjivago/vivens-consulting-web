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

// Internal System
import { InternalLayout } from "./pages/internal/InternalLayout";
import Dashboard from "./pages/internal/Dashboard";
import { Clients } from "./pages/internal/Clients";
import { Projects } from "./pages/internal/Projects";
import { ReportList } from "./pages/internal/Reports/ReportList";
import { ReportEditor } from "./pages/internal/Reports/ReportEditor";
import Leads from "./pages/internal/Leads";
import Opportunities from "./pages/internal/Opportunities";
import Pipeline from "./pages/internal/Pipeline";
import Contacts from "./pages/internal/Contacts";
import Tasks from "./pages/internal/Tasks";
import Meetings from "./pages/internal/Meetings";
import Proposals from "./pages/internal/Proposals";
import Financial from "./pages/internal/Financial";
import Suppliers from "./pages/internal/Suppliers";
import Partners from "./pages/internal/Partners";
import Documents from "./pages/internal/Documents";
import Contracts from "./pages/internal/Contracts";
import Knowledge from "./pages/internal/Knowledge";
import Notifications from "./pages/internal/Notifications";
import ProjectDetail from "./pages/internal/ProjectDetail";
import ClientDetail from "./pages/internal/ClientDetail";

// AVA (VLE) Routes
import { AvaLayout } from "./pages/ava/AvaLayout";
import { AvaLogin } from "./pages/ava/AvaLogin";
import { AvaDashboard } from "./pages/ava/AvaDashboard";
import { AvaCoursePlayer } from "./pages/ava/AvaCoursePlayer";
import { AvaSettings } from "./pages/ava/AvaSettings";

const queryClient = new QueryClient();

const AppContent = () => {
    const location = useLocation();
    const isFullscreenRoute = location.pathname.startsWith('/internal/reports/new') || (location.pathname.startsWith('/internal/reports/') && location.pathname.split('/').length === 4);
    const isInternalRoute = location.pathname.startsWith('/internal');
    const isAvaRoute = location.pathname.startsWith('/ava');

    return (
        <>
            {!isFullscreenRoute && !isInternalRoute && !isAvaRoute && <Header />}
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/sobre" element={<Sobre />} />
                <Route path="/servicos" element={<Servicos />} />
                <Route path="/servicos/consultoria" element={<Consultoria />} />
                <Route path="/servicos/toxicologia" element={<Toxicologia />} />
                <Route path="/servicos/educacao" element={<Educacao />} />
                <Route path="/servicos/bem-estar" element={<BemEstar />} />
                <Route path="/servicos/veterinaria" element={<Veterinaria />} />
                <Route path="/servicos/sistemas-gestao" element={<SistemasGestao />} />
                <Route path="/setores" element={<Setores />} />
                <Route path="/equipe" element={<Equipe />} />
                <Route path="/contato" element={<Contato />} />
                <Route path="/conteudos" element={<Conteudos />} />
                <Route path="/parcerias" element={<Parcerias />} />
                <Route path="/test" element={<TestPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/politicas" element={<Politicas />} />

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
                    {/* CRM */}
                    <Route path="leads" element={<Leads />} />
                    <Route path="opportunities" element={<Opportunities />} />
                    <Route path="pipeline" element={<Pipeline />} />
                    {/* Clients */}
                    <Route path="clients" element={<Clients />} />
                    <Route path="clients/:id" element={<ClientDetail />} />
                    <Route path="contacts" element={<Contacts />} />
                    {/* Projects */}
                    <Route path="projects" element={<Projects />} />
                    <Route path="projects/:id" element={<ProjectDetail />} />
                    {/* Tasks & Agenda */}
                    <Route path="tasks" element={<Tasks />} />
                    <Route path="meetings" element={<Meetings />} />
                    {/* Commercial */}
                    <Route path="proposals" element={<Proposals />} />
                    <Route path="partners" element={<Partners />} />
                    <Route path="contracts" element={<Contracts />} />
                    {/* Financial */}
                    <Route path="financial" element={<Financial />} />
                    <Route path="suppliers" element={<Suppliers />} />
                    {/* Documents */}
                    <Route path="documents" element={<Documents />} />
                    {/* Knowledge & Reports */}
                    <Route path="knowledge" element={<Knowledge />} />
                    <Route path="reports" element={<ReportList />} />
                    {/* Notifications */}
                    <Route path="notifications" element={<Notifications />} />
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

                {/* AVA (VLE) Routes */}
                <Route path="/ava/login" element={<AvaLogin />} />
                <Route path="/ava" element={<AvaLayout />}>
                    <Route path="dashboard" element={<AvaDashboard />} />
                    <Route path="curso/:id" element={<AvaCoursePlayer />} />
                    <Route path="configuracoes" element={<AvaSettings />} />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
            {!isFullscreenRoute && !isInternalRoute && !isAvaRoute && <Footer />}
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
