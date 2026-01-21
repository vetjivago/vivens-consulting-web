import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Keep generic textarea for simple edits
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PDFViewer } from "@react-pdf/renderer";
import { PDFTemplate } from "@/components/reports/PDFTemplate";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportBlock, StructuredReportData, ComplianceItem } from "@/types/report";
import { Save, ArrowLeft, Loader2, Upload, X, Plus, Trash2, GripVertical, Image as ImageIcon } from "lucide-react";

export const ReportEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    // Basic metadata
    const [reportMeta, setReportMeta] = useState({
        title: "",
        type: "Técnico",
        project_id: "",
        client_name: "", // Fetched from project
        project_title: "", // Fetched from project
    });

    // The structured content
    const [blocks, setBlocks] = useState<ReportBlock[]>([]);

    // Available projects
    const [projects, setProjects] = useState<any[]>([]);

    // Add a new block helper
    const addBlock = (type: ReportBlock['type']) => {
        const newBlock: ReportBlock = {
            id: crypto.randomUUID(),
            type,
            data: {}
        };

        // Default data templates
        if (type === 'executive_summary') {
            newBlock.data = { imagesAnalyzed: 0, criticalImages: 0, evaluationDate: new Date().toLocaleDateString('pt-BR'), generalStatus: 'Crítico' };
        }
        if (type === 'compliance_table') {
            newBlock.data = { title: "Nova Tabela de Conformidade", items: [] };
        }
        if (type === 'observation') {
            newBlock.data = { title: "Nova Observação", description: "", severity: "medium" };
        }

        setBlocks([...blocks, newBlock]);
    };

    const updateBlock = (id: string, data: any) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, data: { ...b.data, ...data } } : b));
    };

    const removeBlock = (id: string) => {
        setBlocks(blocks.filter(b => b.id !== id));
    };
    // Image handling will be separate
    const [images, setImages] = useState<string[]>([]); // URLs

    // Derived state for preview
    const [previewData, setPreviewData] = useState({
        title: "Título do Relatório",
        type: "Vistoria",
        client: "Nome do Cliente",
        project: "Nome do Projeto",
        date: new Date().toLocaleDateString('pt-BR'),
        content: "O conteúdo do relatório aparecerá aqui...",
        images: [] as string[]
    });

    const fetchProjects = async () => {
        try {
            const { data, error } = await supabase.from('projects').select('id, title, client:clients(name)');
            if (error) throw error;
            setProjects(data || []);
        } catch (error: any) {
            console.error('Error fetching projects:', error);
        }
    };

    const fetchReport = async (reportId: string) => {
        try {
            setLoading(true);
            const { data, error } = await supabase.from('reports').select('*').eq('id', reportId).single();
            if (error) throw error;

            // Map old structure to new structure if needed, or load blocks directly
            setReportMeta({
                title: data.title,
                type: data.type,
                project_id: data.project_id || "",
                client_name: "", // Will be updated when project is selected
                project_title: ""
            });

            // Handle legacy content (string) vs new content (blocks)
            if (typeof data.content === 'string') {
                // Convert legacy string to a text block
                setBlocks([{ id: 'legacy-1', type: 'text_section', data: { text: data.content } }]);
            } else {
                setBlocks(data.content || []);
            }

            // Trigger project selection to fill client/project names
            if (data.project_id) {
                const proj = projects.find(p => p.id === data.project_id);
                if (proj) {
                    setReportMeta(prev => ({ ...prev, client_name: proj.client.name, project_title: proj.title }));
                }
            }

        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erro ao carregar relatório",
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!reportMeta.title || !reportMeta.project_id) {
            toast({
                variant: "destructive",
                title: "Campos obrigatórios",
                description: "Preencha o título e selecione um projeto.",
            });
            return;
        }

        setLoading(true);
        try {
            const reportData = {
                title: reportMeta.title,
                type: reportMeta.type,
                project_id: reportMeta.project_id,
                content: blocks, // Saving blocks as JSONB
                status: 'draft',
                updated_at: new Date().toISOString(),
            };

            let error;
            if (id) {
                const { error: updateError } = await supabase.from('reports').update(reportData).eq('id', id);
                error = updateError;
            } else {
                const { error: insertError } = await supabase.from('reports').insert([reportData]);
                error = insertError;
            }

            if (error) throw error;

            toast({
                title: "Sucesso!",
                description: "Relatório salvo com sucesso.",
            });
            navigate("/internal/reports");
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erro ao salvar",
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (id && projects.length > 0) {
            fetchReport(id);
        }
    }, [id, projects]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setLoading(true);
        const file = e.target.files[0];
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from("project-images")
            .upload(filePath, file);

        if (uploadError) {
            toast({
                variant: "destructive",
                title: "Erro no upload",
                description: uploadError.message,
            });
        } else {
            const { data: { publicUrl } } = supabase.storage
                .from("project-images")
                .getPublicUrl(filePath);

            setImages([...images, publicUrl]);
            toast({ title: "Imagem enviada!" });
        }
        setLoading(false);
    };

    const removeImage = (indexToRemove: number) => {
        setImages(images.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className="h-screen flex flex-col bg-background">
            {/* Header */}
            <div className="border-b px-6 py-4 flex items-center justify-between bg-card">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/internal/reports")}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold">{id ? "Editar Relatório" : "Novo Relatório"}</h1>
                        <p className="text-sm text-muted-foreground">Editor de Relatórios Estruturado</p>
                    </div>
                </div>
                <Button onClick={handleSave} disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Salvar Relatório
                </Button>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Editor Panel - Left */}
                <div className="w-1/2 border-r bg-muted/10 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">

                        {/* Metadata Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informações Gerais</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Título do Relatório</Label>
                                        <Input
                                            value={reportMeta.title}
                                            onChange={(e) => setReportMeta({ ...reportMeta, title: e.target.value })}
                                            placeholder="Ex: Vistoria Técnica Inicial"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Tipo</Label>
                                        <Select
                                            value={reportMeta.type}
                                            onValueChange={(value) => setReportMeta({ ...reportMeta, type: value })}
                                        >
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Técnico">Relatório Técnico</SelectItem>
                                                <SelectItem value="Vistoria">Relatório de Vistoria</SelectItem>
                                                <SelectItem value="Consultoria">Relatório de Consultoria</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Projeto / Cliente</Label>
                                    <Select
                                        value={reportMeta.project_id}
                                        onValueChange={(value) => {
                                            const proj = projects.find(p => p.id === value);
                                            setReportMeta({
                                                ...reportMeta,
                                                project_id: value,
                                                client_name: proj?.client?.name || "",
                                                project_title: proj?.title || ""
                                            });
                                        }}
                                    >
                                        <SelectTrigger><SelectValue placeholder="Selecione um projeto" /></SelectTrigger>
                                        <SelectContent>
                                            {projects.map((p) => (
                                                <SelectItem key={p.id} value={p.id}>
                                                    {p.title} - {p.client?.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Blocks Editor Area */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Conteúdo do Relatório</h3>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" onClick={() => addBlock('executive_summary')}><Plus className="mr-2 h-3 w-3" /> Resumo</Button>
                                    <Button size="sm" variant="outline" onClick={() => addBlock('text_section')}><Plus className="mr-2 h-3 w-3" /> Texto</Button>
                                    <Button size="sm" variant="outline" onClick={() => addBlock('compliance_table')}><Plus className="mr-2 h-3 w-3" /> Tabela</Button>
                                    <Button size="sm" variant="outline" onClick={() => addBlock('observation')}><Plus className="mr-2 h-3 w-3" /> Observação</Button>
                                </div>
                            </div>

                            {blocks.map((block, index) => (
                                <Card key={block.id} className="relative group">
                                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="destructive" size="icon" className="h-6 w-6" onClick={() => removeBlock(block.id)}>
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>

                                    {/* Executive Summary Block UI */}
                                    {block.type === 'executive_summary' && (
                                        <CardContent className="pt-6 space-y-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <GripVertical className="text-muted-foreground h-4 w-4" />
                                                <span className="font-semibold text-sm uppercase text-muted-foreground">Resumo Executivo</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label>Imagens Analisadas</Label>
                                                    <Input
                                                        type="number"
                                                        value={block.data.imagesAnalyzed}
                                                        onChange={(e) => updateBlock(block.id, { imagesAnalyzed: parseInt(e.target.value) || 0 })}
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Pontos Críticos</Label>
                                                    <Input
                                                        type="number"
                                                        value={block.data.criticalImages}
                                                        onChange={(e) => updateBlock(block.id, { criticalImages: parseInt(e.target.value) || 0 })}
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <Label>Situação Geral</Label>
                                                    <Input
                                                        value={block.data.generalStatus}
                                                        onChange={(e) => updateBlock(block.id, { generalStatus: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    )}

                                    {/* Text Section Block UI */}
                                    {block.type === 'text_section' && (
                                        <CardContent className="pt-6 space-y-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <GripVertical className="text-muted-foreground h-4 w-4" />
                                                <span className="font-semibold text-sm uppercase text-muted-foreground">Seção de Texto</span>
                                            </div>
                                            <Input
                                                placeholder="Título da Seção (ex: Introdução, Metodologia)"
                                                value={block.data.title}
                                                onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                                            />
                                            <Textarea
                                                placeholder="Conteúdo detalhado da seção..."
                                                className="min-h-[100px]"
                                                value={block.data.text}
                                                onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                                            />
                                        </CardContent>
                                    )}

                                    {/* Observation Block UI */}
                                    {block.type === 'observation' && (
                                        <CardContent className="pt-6 space-y-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <GripVertical className="text-muted-foreground h-4 w-4" />
                                                <span className="font-semibold text-sm uppercase text-muted-foreground">Observação Detalhada</span>
                                            </div>
                                            <Input
                                                placeholder="Título da Observação (ex: Não conformidade item 4)"
                                                value={block.data.title}
                                                onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                                            />
                                            <Textarea
                                                placeholder="Descrição detalhada do problema..."
                                                className="min-h-[100px]"
                                                value={block.data.description}
                                                onChange={(e) => updateBlock(block.id, { description: e.target.value })}
                                            />
                                            {/* Image Upload for Observation (Placeholder for logic) */}
                                            <div className="flex items-center gap-4">
                                                <Button variant="outline" size="sm" className="w-full">
                                                    <ImageIcon className="mr-2 h-4 w-4" />
                                                    {block.data.image ? "Alterar Imagem" : "Adicionar Imagem"}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    )}

                                    {/* Compliance Table Block UI */}
                                    {block.type === 'compliance_table' && (
                                        <CardContent className="pt-6 space-y-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <GripVertical className="text-muted-foreground h-4 w-4" />
                                                <span className="font-semibold text-sm uppercase text-muted-foreground">Tabela de Conformidade</span>
                                            </div>
                                            <Input
                                                placeholder="Título da Tabela"
                                                value={block.data.title}
                                                onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                                            />
                                            <div className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded">
                                                Edição de itens da tabela em breve...
                                                (Adicione itens manualmente no banco por enquanto ou use observações)
                                            </div>
                                        </CardContent>
                                    )}
                                </Card>
                            ))}
                        </PDFViewer>
                    </div>
                </div>
            </div>
            );
};
