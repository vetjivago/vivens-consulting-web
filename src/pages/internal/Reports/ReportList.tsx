import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, Search, FileText, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

type Report = {
    id: string;
    title: string;
    type: string;
    status: string;
    created_at: string;
    projects: {
        title: string;
        clients: {
            name: string;
        };
    };
};

export const ReportList = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const { toast } = useToast();

    const fetchReports = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("reports")
            .select(`
        *,
        projects (
          title,
          clients (
            name
          )
        )
      `)
            .order("created_at", { ascending: false });

        if (error) {
            toast({
                variant: "destructive",
                title: "Erro ao carregar relatórios",
                description: error.message,
            });
        } else {
            setReports(data || []);
        }
        setLoading(false);
    };

    const handleDeleteReport = async (id: string, title: string) => {
        if (!confirm(`Tem certeza que deseja excluir o relatório "${title}"?`)) return;

        const { error } = await supabase.from("reports").delete().eq("id", id);
        if (error) {
            toast({
                variant: "destructive",
                title: "Erro ao excluir",
                description: error.message,
            });
        } else {
            toast({ title: "Relatório excluído com sucesso!" });
            setReports(prev => prev.filter(r => r.id !== id));
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed': return <Badge className="bg-green-500">Concluído</Badge>;
            case 'pending_review': return <Badge className="bg-yellow-500">Revisão</Badge>;
            default: return <Badge variant="secondary">Rascunho</Badge>;
        }
    };

    const filteredReports = reports.filter((report) =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.projects?.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
                <Link to="/internal/reports/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Novo Relatório
                    </Button>
                </Link>
            </div>

            <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-500" />
                <Input
                    placeholder="Buscar relatórios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Título</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Projeto</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center h-24">
                                    Carregando...
                                </TableCell>
                            </TableRow>
                        ) : filteredReports.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center h-24 text-gray-500">
                                    Nenhum relatório encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredReports.map((report) => (
                                <TableRow key={report.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-gray-400" />
                                            {report.title}
                                        </div>
                                    </TableCell>
                                    <TableCell className="capitalize">{report.type}</TableCell>
                                    <TableCell>{report.projects?.title}</TableCell>
                                    <TableCell>{report.projects?.clients?.name}</TableCell>
                                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                                    <TableCell>{new Date(report.created_at).toLocaleDateString('pt-BR')}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link to={`/internal/reports/${report.id}`}>
                                                <Button variant="ghost" size="sm">Editar</Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleDeleteReport(report.id, report.title)}
                                                title="Excluir Relatório"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
