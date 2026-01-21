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
    Settings
} from "lucide-react";

export const InternalLayout = () => {
    const { signOut, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleSignOut = async () => {
        await signOut();
        navigate("/login");
    };

    const navItems = [
        { href: "/internal", label: "Dashboard", icon: LayoutDashboard },
        { href: "/internal/clients", label: "Clientes", icon: Users },
        { href: "/internal/projects", label: "Projetos", icon: FolderOpen },
        { href: "/internal/reports", label: "Relatórios", icon: FileText },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r shadow-sm fixed h-full z-10">
                <div className="p-6 border-b flex items-center gap-2">
                    <div className="w-8 h-8 bg-gemini-600 rounded-lg flex items-center justify-center text-white font-bold">V</div>
                    <span className="font-bold text-xl text-gemini-900">Vivens<span className="text-gray-400 font-normal">Lab</span></span>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.href || (item.href !== "/internal" && location.pathname.startsWith(item.href));

                        return (
                            <Link key={item.href} to={item.href}>
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={`w-full justify-start gap-3 ${isActive ? "bg-gemini-50 text-gemini-700 font-medium" : "text-gray-600"}`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {item.label}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t bg-gray-50">
                    <div className="mb-4 px-2">
                        <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                        <p className="text-xs text-gray-500">Sócio</p>
                    </div>
                    <Button variant="outline" className="w-full gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100" onClick={handleSignOut}>
                        <LogOut className="w-4 h-4" />
                        Sair
                    </Button>
                </div>
            </aside>

            {/* Mobile Header & Sidebar */}
            <div className={`md:hidden fixed inset-0 z-50 bg-gray-800/50 transition-opacity ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={() => setIsSidebarOpen(false)} />

            <aside className={`md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-200 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="p-4 border-b flex justify-between items-center">
                    <span className="font-bold text-lg">Menu</span>
                    <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>
                <nav className="p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link key={item.href} to={item.href} onClick={() => setIsSidebarOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start gap-3">
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </Button>
                        </Link>
                    ))}
                    <Button variant="ghost" className="w-full justify-start gap-3 text-red-600" onClick={handleSignOut}>
                        <LogOut className="w-5 h-5" />
                        Sair
                    </Button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 min-h-screen flex flex-col">
                {/* Mobile Header */}
                <header className="md:hidden bg-white border-b p-4 flex items-center justify-between sticky top-0 z-10">
                    <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
                        <Menu className="w-6 h-6" />
                    </Button>
                    <span className="font-bold">VivensLab</span>
                    <div className="w-10" />
                </header>

                <div className="flex-1 p-6 overflow-x-hidden">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
