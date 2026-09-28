import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    Users,
    FolderOpen,
    FileText,
    LogOut,
    Menu,
    X,
    Target,
    UserPlus,
    TrendingUp,
    BarChart3,
    CheckSquare,
    Calendar,
    FileSignature,
    DollarSign,
    Truck,
    Handshake,
    FolderArchive,
    ScrollText,
    BookOpen,
    Bell,
    Contact,
    ChevronDown,
    ChevronRight,
} from "lucide-react";

type NavItem = {
    href: string;
    label: string;
    icon: any;
    children?: NavItem[];
};

export const InternalLayout = () => {
    const { signOut, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState<string[]>(["CRM"]);

    const handleSignOut = async () => {
        await signOut();
        navigate("/login");
    };

    const toggleGroup = (label: string) => {
        setExpandedGroups((prev) =>
            prev.includes(label)
                ? prev.filter((g) => g !== label)
                : [...prev, label]
        );
    };

    const navItems: NavItem[] = [
        { href: "/internal", label: "Início", icon: LayoutDashboard },
        {
            href: "/internal/crm",
            label: "CRM",
            icon: Target,
            children: [
                { href: "/internal/leads", label: "Leads", icon: UserPlus },
                { href: "/internal/opportunities", label: "Oportunidades", icon: TrendingUp },
                { href: "/internal/pipeline", label: "Pipeline", icon: BarChart3 },
            ],
        },
        { href: "/internal/clients", label: "Clientes", icon: Users },
        { href: "/internal/contacts", label: "Contatos", icon: Contact },
        { href: "/internal/projects", label: "Projetos", icon: FolderOpen },
        { href: "/internal/tasks", label: "Tarefas", icon: CheckSquare },
        { href: "/internal/meetings", label: "Agenda", icon: Calendar },
        { href: "/internal/proposals", label: "Propostas", icon: FileSignature },
        { href: "/internal/financial", label: "Financeiro", icon: DollarSign },
        { href: "/internal/suppliers", label: "Fornecedores", icon: Truck },
        { href: "/internal/partners", label: "Parceiros", icon: Handshake },
        { href: "/internal/documents", label: "Documentos", icon: FolderArchive },
        { href: "/internal/contracts", label: "Contratos", icon: ScrollText },
        { href: "/internal/knowledge", label: "Conhecimento", icon: BookOpen },
        { href: "/internal/reports", label: "Relatórios", icon: FileText },
        { href: "/internal/notifications", label: "Notificações", icon: Bell },
    ];

    const isActive = (href: string) =>
        location.pathname === href ||
        (href !== "/internal" && location.pathname.startsWith(href));

    const renderNavItem = (item: NavItem) => {
        const Icon = item.icon;

        if (item.children) {
            const isExpanded = expandedGroups.includes(item.label);
            const hasActiveChild = item.children.some((child) =>
                isActive(child.href)
            );

            return (
                <div key={item.label}>
                    <Button
                        variant={hasActiveChild ? "secondary" : "ghost"}
                        className={`w-full justify-between gap-2 ${
                            hasActiveChild
                                ? "bg-emerald-50 text-emerald-700 font-medium"
                                : "text-gray-600"
                        }`}
                        onClick={() => toggleGroup(item.label)}
                    >
                        <span className="flex items-center gap-3">
                            <Icon className="w-4 h-4" />
                            {item.label}
                        </span>
                        {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                        ) : (
                            <ChevronRight className="w-4 h-4" />
                        )}
                    </Button>
                    {isExpanded && (
                        <div className="ml-4 mt-1 space-y-1">
                            {item.children.map((child) => {
                                const ChildIcon = child.icon;
                                const active = isActive(child.href);
                                return (
                                    <Link key={child.href} to={child.href}>
                                        <Button
                                            variant={active ? "secondary" : "ghost"}
                                            size="sm"
                                            className={`w-full justify-start gap-3 ${
                                                active
                                                    ? "bg-emerald-50 text-emerald-700 font-medium"
                                                    : "text-gray-500"
                                            }`}
                                        >
                                            <ChildIcon className="w-4 h-4" />
                                            {child.label}
                                        </Button>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            );
        }

        const active = isActive(item.href);
        return (
            <Link key={item.href} to={item.href}>
                <Button
                    variant={active ? "secondary" : "ghost"}
                    className={`w-full justify-start gap-3 ${
                        active
                            ? "bg-emerald-50 text-emerald-700 font-medium"
                            : "text-gray-600"
                    }`}
                >
                    <Icon className="w-4 h-4" />
                    {item.label}
                </Button>
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r shadow-sm fixed h-full z-10">
                <div className="p-4 border-b flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        V
                    </div>
                    <div>
                        <span className="font-bold text-lg text-gray-900">
                            Vivens
                        </span>
                        <span className="text-gray-400 font-normal text-sm ml-0.5">
                            Gestão
                        </span>
                    </div>
                </div>

                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {navItems.map(renderNavItem)}
                </nav>

                <div className="p-3 border-t bg-gray-50">
                    <div className="mb-3 px-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {user?.email}
                        </p>
                        <p className="text-xs text-gray-500">Administrador</p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100"
                        onClick={handleSignOut}
                    >
                        <LogOut className="w-4 h-4" />
                        Sair
                    </Button>
                </div>
            </aside>

            {/* Mobile Overlay */}
            <div
                className={`md:hidden fixed inset-0 z-50 bg-gray-800/50 transition-opacity ${
                    isSidebarOpen
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setIsSidebarOpen(false)}
            />

            {/* Mobile Sidebar */}
            <aside
                className={`md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-200 ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="p-4 border-b flex justify-between items-center">
                    <span className="font-bold text-lg">Vivens Gestão</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>
                <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-120px)]">
                    {navItems.map((item) => {
                        if (item.children) {
                            return (
                                <div key={item.label}>
                                    {item.children.map((child) => (
                                        <Link
                                            key={child.href}
                                            to={child.href}
                                            onClick={() =>
                                                setIsSidebarOpen(false)
                                            }
                                        >
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start gap-3"
                                            >
                                                <child.icon className="w-4 h-4" />
                                                {child.label}
                                            </Button>
                                        </Link>
                                    ))}
                                </div>
                            );
                        }
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-3"
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </Button>
                            </Link>
                        );
                    })}
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-red-600"
                        onClick={handleSignOut}
                    >
                        <LogOut className="w-5 h-5" />
                        Sair
                    </Button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 min-h-screen flex flex-col">
                {/* Mobile Header */}
                <header className="md:hidden bg-white border-b p-4 flex items-center justify-between sticky top-0 z-10">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </Button>
                    <span className="font-bold">Vivens Gestão</span>
                    <div className="w-10" />
                </header>

                <div className="flex-1 p-6 overflow-x-hidden">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
