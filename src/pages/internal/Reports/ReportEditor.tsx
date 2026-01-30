import { useState, useEffect, useRef } from "react";
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
import { Save, ArrowLeft, Loader2, Upload, X, Plus, Trash2, GripVertical, Image as ImageIcon, ArrowUp, ArrowDown, Scissors, Eye, EyeOff, ChevronUp, ChevronDown, Star, Table, Camera, FileText, Heading1, File } from "lucide-react";

export const ReportEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [showPdf, setShowPdf] = useState(true);

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
    // Track collapsed state locally (key = block.id, value = boolean)
    const [collapsedBlocks, setCollapsedBlocks] = useState<Record<string, boolean>>({});

    // Available projects
    const [projects, setProjects] = useState<any[]>([]);

    // Refs for auto-save (to access latest state in interval)
    const reportMetaRef = useRef(reportMeta);
    const blocksRef = useRef(blocks);

    const activeReportData: StructuredReportData = {
        title: reportMeta.title || "Sem Título",
        type: reportMeta.type,
        client: reportMeta.client_name || "Cliente",
        project: reportMeta.project_title || "Projeto",
        date: new Date().toLocaleDateString('pt-BR'),
        blocks: blocks
    };

    // Update refs whenever state changes
    useEffect(() => { reportMetaRef.current = reportMeta; }, [reportMeta]);
    useEffect(() => { blocksRef.current = blocks; }, [blocks]);

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
            newBlock.data = { title: "Nova Observação", description: "", severity: "medium", images: [] };
        }
        if (type === 'section_header') {
            newBlock.data = { title: "Título da Seção" };
        }
        if (type === 'text_section') {
            newBlock.data = { title: "Nova Seção", text: "" };
        }

        setBlocks([...blocks, newBlock]);
    };

    // Helpers for UI
    const getBlockLabel = (type: ReportBlock['type']) => {
        switch (type) {
            case 'executive_summary': return "Resumo Executivo";
            case 'compliance_table': return "Tabela de Conformidade";
            case 'observation': return "Observação Detalhada";
            case 'text_section': return "Seção de Texto";
            case 'section_header': return "Cabeçalho de Seção";
            case 'images_grid': return "Grid de Imagens";
            case 'page_break': return "Quebra de Página";
            case 'pdf_attachment': return "Anexo PDF";
            default: return "Bloco Desconhecido";
        }
    };

    const getBlockIcon = (type: ReportBlock['type']) => {
        switch (type) {
            case 'executive_summary': return <Star className="h-4 w-4" />;
            case 'compliance_table': return <Table className="h-4 w-4" />;
            case 'observation': return <Camera className="h-4 w-4" />;
            case 'text_section': return <FileText className="h-4 w-4" />;
            case 'section_header': return <Heading1 className="h-4 w-4" />;
            case 'page_break': return <Scissors className="h-4 w-4" />;
            case 'pdf_attachment': return <File className="h-4 w-4" />;
            default: return <GripVertical className="h-4 w-4" />;
        }
    };

    const getBlockSummary = (block: ReportBlock) => {
        switch (block.type) {
            case 'observation': return block.data.title || "Sem título";
            case 'compliance_table': return `${block.data.items?.length || 0} itens`;
            case 'text_section': return block.data.title || "Sem título";
            case 'section_header': return block.data.title || "---";
            default: return "";
        }
    };

    const updateBlock = (id: string, data: any) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, data: { ...b.data, ...data } } : b));
    };

    const removeBlock = (id: string) => {
        setBlocks(blocks.filter(b => b.id !== id));
    };

    const moveBlock = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === blocks.length - 1) return;

        const newBlocks = [...blocks];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        [newBlocks[index], newBlocks[swapIndex]] = [newBlocks[swapIndex], newBlocks[index]];
        setBlocks(newBlocks);
    };

    const moveImage = (blockId: string, imageIndex: number, direction: 'up' | 'down') => {
        const block = blocks.find(b => b.id === blockId);
        if (!block || !block.data.images) return;

        const images = [...block.data.images];
        if (direction === 'up' && imageIndex === 0) return;
        if (direction === 'down' && imageIndex === images.length - 1) return;

        const swapIndex = direction === 'up' ? imageIndex - 1 : imageIndex + 1;
        [images[imageIndex], images[swapIndex]] = [images[swapIndex], images[imageIndex]];

        updateBlock(blockId, { images });
    };

    const toggleCollapse = (blockId: string) => {
        setCollapsedBlocks(prev => ({
            ...prev,
            [blockId]: !prev[blockId]
        }));
    };
    // Image handling will be separate
    const [images, setImages] = useState<string[]>([]); // URLs

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

    const saveReport = async (silent = false) => {
        const currentMeta = reportMetaRef.current;
        const currentBlocks = blocksRef.current;

        if (!currentMeta.title || !currentMeta.project_id) {
            if (!silent) {
                toast({
                    variant: "destructive",
                    title: "Campos obrigatórios",
                    description: "Preencha o título e selecione um projeto.",
                });
            }
            return;
        }

        if (!silent) setLoading(true);
        try {
            const reportData = {
                title: currentMeta.title,
                type: currentMeta.type,
                project_id: currentMeta.project_id,
                content: currentBlocks, // Saving blocks as JSONB
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

            if (!silent) {
                toast({
                    title: "Sucesso!",
                    description: "Relatório salvo com sucesso.",
                });
                navigate("/internal/reports");
            } else {
                console.log("Auto-save successful at", new Date().toLocaleTimeString());
                toast({
                    title: "Rascunho salvo",
                    description: "Alterações salvas automaticamente.",
                    duration: 2000,
                });
            }
        } catch (error: any) {
            console.error("Save error:", error);
            if (!silent) {
                toast({
                    variant: "destructive",
                    title: "Erro ao salvar",
                    description: error.message,
                });
            }
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const handleSave = () => saveReport(false);

    // Auto-save Interval (3 minutes)
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (id) {
                if (reportMetaRef.current.title && reportMetaRef.current.project_id) {
                    saveReport(true);
                }
            }
        }, 3 * 60 * 1000); // 3 minutes

        return () => clearInterval(intervalId);
    }, [id]);

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (id && projects.length > 0) {
            fetchReport(id);
        }
    }, [id, projects]);



    const [activeBlockIdForUpload, setActiveBlockIdForUpload] = useState<string | null>(null);

    const handleBlockImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const blockId = activeBlockIdForUpload;
        if (!blockId || !e.target.files || e.target.files.length === 0) return;

        setLoading(true);
        const files = Array.from(e.target.files);
        const newImagesToAdd: { url: string; caption: string }[] = [];
        let legacyImageUpdate = "";

        try {
            const uploadPromises = files.map(async (file) => {
                const fileExt = file.name.split(".").pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `reports/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from("project-images")
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from("project-images")
                    .getPublicUrl(filePath);

                return publicUrl;
            });

            const uploadedUrls = await Promise.all(uploadPromises);

            uploadedUrls.forEach(url => {
                newImagesToAdd.push({ url, caption: "" });
                legacyImageUpdate = url;
            });

            // Handle multi-image upload
            const currentBlock = blocks.find(b => b.id === blockId);
            if (currentBlock) {
                if (currentBlock.type === 'observation') {
                    const currentImages = currentBlock.data.images || [];
                    const newImages = [...currentImages, ...newImagesToAdd];
                    updateBlock(blockId, { images: newImages });
                } else {
                    // Fallback for other blocks (overwrites with last image)
                    updateBlock(blockId, { image: legacyImageUpdate });
                }
            }

            toast({ title: `${files.length} imagem(ns) anexada(s)!` });

        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erro no upload",
                description: error.message,
            });
        } finally {
            setLoading(false);
            setActiveBlockIdForUpload(null);
            e.target.value = '';
        }
    };

    // Helper to trigger the hidden file input
    const triggerImageUpload = (blockId: string) => {
        setActiveBlockIdForUpload(blockId);
        const fileInput = document.getElementById('hidden-report-file-input') as HTMLInputElement;
        if (fileInput) fileInput.click();
    };

    const removeBlockImage = (blockId: string) => {
        updateBlock(blockId, { image: undefined });
    };

    return (
        <div className="h-screen w-full flex flex-col bg-background overflow-hidden">
            {/* Hidden Input for Block Images */}
            <input
                type="file"
                id="hidden-report-file-input"
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleBlockImageUpload}
            />
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
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setShowPdf(!showPdf)} title={showPdf ? "Ocultar PDF" : "Mostrar PDF"}>
                        {showPdf ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </Button>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Salvar Relatório
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex flex-row overflow-hidden">
                {/* Editor Panel - Left */}
                <div className={`transition-all duration-300 ${showPdf ? 'w-1/2 min-w-[50%]' : 'w-full'} border-r bg-muted/10 flex flex-row overflow-hidden`}>

                    {/* Navigation Rail */}
                    <div className="w-14 border-r bg-card flex flex-col items-center py-4 gap-2 overflow-y-auto shrink-0 z-10">
                        <div className="mb-2">
                            <Button variant="ghost" size="icon" onClick={() => document.getElementById('metadata-card')?.scrollIntoView({ behavior: 'smooth' })} title="Topo">
                                <ArrowUp className="h-4 w-4" />
                            </Button>
                        </div>
                        {blocks.map((block) => (
                            <Button
                                key={`nav-${block.id}`}
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                title={getBlockLabel(block.type)}
                                onClick={() => document.getElementById(block.id)?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                {getBlockIcon(block.type)}
                            </Button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">

                        {/* Metadata Card */}
                        <Card id="metadata-card">
                            <CardHeader>
                                <CardTitle>Informações Gerais</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Título do Relatório</Label>
                                        <Input
                                            className="text-base"
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
                                    <Button size="sm" variant="outline" onClick={() => addBlock('section_header')}><Plus className="mr-2 h-3 w-3" /> Cabeçalho</Button>
                                    <Button size="sm" variant="outline" onClick={() => addBlock('executive_summary')}><Plus className="mr-2 h-3 w-3" /> Resumo</Button>
                                    <Button size="sm" variant="outline" onClick={() => addBlock('text_section')}><Plus className="mr-2 h-3 w-3" /> Texto</Button>
                                    <Button size="sm" variant="outline" onClick={() => addBlock('compliance_table')}><Plus className="mr-2 h-3 w-3" /> Tabela</Button>
                                    <Button size="sm" variant="outline" onClick={() => addBlock('observation')}><Plus className="mr-2 h-3 w-3" /> Observação</Button>
                                    <Button size="sm" variant="outline" onClick={() => addBlock('pdf_attachment')}><Plus className="mr-2 h-3 w-3" /> Anexo PDF</Button>
                                    <Button size="sm" variant="outline" onClick={() => addBlock('page_break')}><Scissors className="mr-2 h-3 w-3" /> Quebra</Button>
                                </div>
                            </div>
                        </div>

                        {blocks.map((block, index) => (
                            <Card key={block.id} className="relative group border-l-4 border-l-primary/20">
                                <CardHeader className="flex flex-row items-center justify-between py-2 bg-muted/10 cursor-pointer" onClick={() => toggleCollapse(block.id)}>
                                    <div className="flex items-center gap-2">
                                        <div className="bg-primary/10 p-1.5 rounded text-primary">
                                            {getBlockIcon(block.type)}
                                        </div>
                                        <div className="flex flex-col">
                                            <CardTitle className="text-sm font-medium">
                                                {getBlockLabel(block.type)}
                                            </CardTitle>
                                            <span className="text-xs text-muted-foreground">
                                                {getBlockSummary(block)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => { e.stopPropagation(); moveBlock(index, 'up'); }}
                                            disabled={index === 0}
                                        >
                                            <ArrowUp className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => { e.stopPropagation(); moveBlock(index, 'down'); }}
                                            disabled={index === blocks.length - 1}
                                        >
                                            <ArrowDown className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-muted-foreground"
                                        >
                                            {collapsedBlocks[block.id] ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>

                                {!collapsedBlocks[block.id] && (
                                    <>
                                        {/* Section Header Block UI */}
                                        {block.type === 'section_header' && (
                                            <CardContent className="pt-6 space-y-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <GripVertical className="text-muted-foreground h-4 w-4" />
                                                    <span className="font-semibold text-sm uppercase text-muted-foreground">Cabeçalho de Seção</span>
                                                </div>
                                                <Input
                                                    className="text-base"
                                                    placeholder="Título do Cabeçalho"
                                                    value={block.data.title}
                                                    onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                                                />
                                            </CardContent>
                                        )}

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
                                                            className="text-base"
                                                            type="number"
                                                            value={block.data.imagesAnalyzed}
                                                            onChange={(e) => updateBlock(block.id, { imagesAnalyzed: parseInt(e.target.value) || 0 })}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>Pontos Críticos</Label>
                                                        <Input
                                                            className="text-base"
                                                            type="number"
                                                            value={block.data.criticalImages}
                                                            onChange={(e) => updateBlock(block.id, { criticalImages: parseInt(e.target.value) || 0 })}
                                                        />
                                                    </div>
                                                    <div className="col-span-2">
                                                        <Label>Situação Geral</Label>
                                                        <Input
                                                            className="text-base"
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
                                                    className="text-base"
                                                    placeholder="Título da Seção (ex: Introdução, Metodologia)"
                                                    value={block.data.title}
                                                    onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                                                />
                                                <Textarea
                                                    placeholder="Conteúdo detalhado da seção..."
                                                    className="min-h-[100px] text-base"
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
                                                    className="text-base"
                                                    placeholder="Título da Observação (ex: Não conformidade item 4)"
                                                    value={block.data.title}
                                                    onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                                                />
                                                <Textarea
                                                    placeholder="Descrição detalhada do problema..."
                                                    className="min-h-[100px] text-base"
                                                    value={block.data.description}
                                                    onChange={(e) => updateBlock(block.id, { description: e.target.value })}
                                                />

                                                <div className="space-y-4">
                                                    <Label>Evidências Fotográficas</Label>
                                                    {/* Legacy Image Migration / Display */}
                                                    {block.data.image && !block.data.images?.length && (
                                                        <div className="relative w-full rounded-md border p-2 bg-muted/20">
                                                            <div className="mb-2 text-xs text-amber-600 font-bold">Imagem (Legado) - Adicione uma nova para converter em lista</div>
                                                            <img src={block.data.image} className="max-h-[200px] w-auto object-contain" />
                                                        </div>
                                                    )}

                                                    <div className="grid grid-cols-1 gap-4">
                                                        {block.data.images?.map((img: any, imgIdx: number) => (
                                                            <div key={imgIdx} className="flex gap-4 p-3 border rounded-md bg-zinc-50 items-start">
                                                                <div className="w-[120px] h-[120px] bg-white border rounded flex items-center justify-center shrink-0">
                                                                    <img
                                                                        src={img.url}
                                                                        alt={`Evidência ${imgIdx + 1}`}
                                                                        className="max-h-full max-w-full object-contain"
                                                                    />
                                                                </div>
                                                                <div className="flex-1 space-y-2">
                                                                    <Label>Legenda da Imagem</Label>
                                                                    <Input
                                                                        className="text-base"
                                                                        placeholder="Descreva esta imagem..."
                                                                        value={img.caption}
                                                                        onChange={(e) => {
                                                                            const newImages = [...block.data.images];
                                                                            newImages[imgIdx].caption = e.target.value;
                                                                            updateBlock(block.id, { images: newImages });
                                                                        }}
                                                                    />
                                                                    <Button
                                                                        variant="destructive"
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            const newImages = block.data.images.filter((_: any, i: number) => i !== imgIdx);
                                                                            updateBlock(block.id, { images: newImages });
                                                                        }}
                                                                    >
                                                                        <Trash2 className="h-4 w-4 mr-2" /> Remover
                                                                    </Button>
                                                                    <div className="flex gap-1">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            disabled={imgIdx === 0}
                                                                            onClick={() => moveImage(block.id, imgIdx, 'up')}
                                                                        >
                                                                            <ArrowUp className="w-4 h-4" />
                                                                        </Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            disabled={imgIdx === block.data.images.length - 1}
                                                                            onClick={() => moveImage(block.id, imgIdx, 'down')}
                                                                        >
                                                                            <ArrowDown className="w-4 h-4" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="flex items-center gap-4">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-full"
                                                            onClick={() => triggerImageUpload(block.id)}
                                                        >
                                                            <ImageIcon className="mr-2 h-4 w-4" />
                                                            Adicionar Imagem
                                                        </Button>
                                                    </div>
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
                                                    className="text-base"
                                                    placeholder="Título da Tabela"
                                                    value={block.data.title}
                                                    onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                                                />
                                                <div className="border rounded-md overflow-hidden">
                                                    <div className="grid grid-cols-12 gap-2 bg-muted p-2 text-xs font-semibold text-center">
                                                        <div className="col-span-1">Item</div>
                                                        <div className="col-span-6">Descrição</div>
                                                        <div className="col-span-2">Classificação</div>
                                                        <div className="col-span-2">Status</div>
                                                        <div className="col-span-1"></div>
                                                    </div>

                                                    <div className="max-h-[300px] overflow-y-auto">
                                                        {block.data.items?.map((item: any, idx: number) => (
                                                            <div key={idx} className="grid grid-cols-12 gap-2 p-2 border-b items-center text-sm">
                                                                <div className="col-span-1">
                                                                    <Input
                                                                        className="h-8 p-1 text-sm"
                                                                        value={item.itemNumber}
                                                                        onChange={(e) => {
                                                                            const newItems = [...block.data.items];
                                                                            newItems[idx].itemNumber = e.target.value;
                                                                            updateBlock(block.id, { items: newItems });
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="col-span-6">
                                                                    <Textarea
                                                                        className="h-10 min-h-[40px] p-2 text-sm"
                                                                        value={item.description}
                                                                        onChange={(e) => {
                                                                            const newItems = [...block.data.items];
                                                                            newItems[idx].description = e.target.value;
                                                                            updateBlock(block.id, { items: newItems });
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="col-span-2">
                                                                    <Select
                                                                        value={item.classification}
                                                                        onValueChange={(val) => {
                                                                            const newItems = [...block.data.items];
                                                                            newItems[idx].classification = val as any;
                                                                            updateBlock(block.id, { items: newItems });
                                                                        }}
                                                                    >
                                                                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="Obrigatório">Obrigatório</SelectItem>
                                                                            <SelectItem value="Recomendado">Recomendado</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                                <div className="col-span-2">
                                                                    <Select
                                                                        value={item.status}
                                                                        onValueChange={(val) => {
                                                                            const newItems = [...block.data.items];
                                                                            newItems[idx].status = val as any;
                                                                            updateBlock(block.id, { items: newItems });
                                                                        }}
                                                                    >
                                                                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="Atende">Atende</SelectItem>
                                                                            <SelectItem value="Não Atende">Não Atende</SelectItem>
                                                                            <SelectItem value="Atende em Partes">Parcial</SelectItem>
                                                                            <SelectItem value="Crítico">Crítico</SelectItem>
                                                                            <SelectItem value="Não se aplica">N/A</SelectItem>
                                                                            <SelectItem value="Não Verificado">Não Verificado</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                                <div className="col-span-1 flex justify-center">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                                        onClick={() => {
                                                                            const newItems = block.data.items.filter((_: any, i: number) => i !== idx);
                                                                            updateBlock(block.id, { items: newItems });
                                                                        }}
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full border-dashed"
                                                    onClick={() => {
                                                        const newItems = [...(block.data.items || []), {
                                                            itemNumber: (block.data.items?.length + 1).toString(),
                                                            description: "",
                                                            classification: "Obrigatório",
                                                            status: "Não se aplica"
                                                        }];
                                                        updateBlock(block.id, { items: newItems });
                                                    }}
                                                >
                                                    <Plus className="mr-2 h-4 w-4" /> Adicionar Item na Tabela
                                                </Button>
                                            </CardContent>
                                        )}

                                        {/* Page Break Block UI */}
                                        {block.type === 'page_break' && (
                                            <CardContent className="pt-6">
                                                <div className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-zinc-300 rounded bg-zinc-50">
                                                    <Scissors className="h-4 w-4 text-muted-foreground" />
                                                    <span className="font-semibold text-sm text-muted-foreground">Quebra de Página no PDF</span>
                                                </div>
                                            </CardContent>
                                        )}

                                        {/* PDF Attachment UI */}
                                        {block.type === 'pdf_attachment' && (
                                            <CardContent className="pt-6">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <File className="text-muted-foreground h-4 w-4" />
                                                    <span className="font-semibold text-sm uppercase text-muted-foreground">Anexo PDF</span>
                                                </div>

                                                <div className="space-y-4">
                                                    <Input
                                                        className="text-base"
                                                        placeholder="Título do Anexo"
                                                        value={block.data.title}
                                                        onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                                                    />

                                                    {!block.data.fileUrl ? (
                                                        <div className="flex items-center justify-center p-6 border-2 border-dashed rounded-md bg-muted/5">
                                                            <div className="text-center space-y-2">
                                                                <File className="h-8 w-8 text-muted-foreground mx-auto" />
                                                                <div className="text-sm text-muted-foreground">
                                                                    Clique para adicionar um PDF
                                                                </div>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        // We can reuse the image upload hidden input if we change accept type dynamically,
                                                                        // or create a new one. Let's create a dedicated one for PDF.
                                                                        const pdfInput = document.getElementById(`pdf-input-${block.id}`);
                                                                        if (pdfInput) pdfInput.click();
                                                                    }}
                                                                >
                                                                    Selecionar Arquivo
                                                                </Button>
                                                                <input
                                                                    type="file"
                                                                    id={`pdf-input-${block.id}`}
                                                                    className="hidden"
                                                                    accept="application/pdf"
                                                                    onChange={async (e) => {
                                                                        const file = e.target.files?.[0];
                                                                        if (!file) return;

                                                                        setLoading(true);
                                                                        try {
                                                                            const fileExt = file.name.split(".").pop();
                                                                            const fileName = `${Math.random()}.${fileExt}`;
                                                                            const filePath = `reports/attachments/${fileName}`;

                                                                            const { error } = await supabase.storage.from('project-files').upload(filePath, file);
                                                                            if (error) throw error;

                                                                            const { data: { publicUrl } } = supabase.storage.from('project-files').getPublicUrl(filePath);

                                                                            updateBlock(block.id, { fileUrl: publicUrl, fileName: file.name });
                                                                            toast({ title: "PDF anexado com sucesso!" });
                                                                        } catch (err: any) {
                                                                            toast({ variant: "destructive", title: "Erro no upload", description: err.message });
                                                                        } finally {
                                                                            setLoading(false);
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-between p-3 border rounded bg-zinc-50">
                                                            <div className="flex items-center gap-2 overflow-hidden">
                                                                <File className="h-5 w-5 text-red-500 flex-shrink-0" />
                                                                <div className="truncate text-sm font-medium">
                                                                    {block.data.fileName || "Arquivo PDF"}
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <a href={block.data.fileUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline mr-2">
                                                                    Visualizar
                                                                </a>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => updateBlock(block.id, { fileUrl: "", fileName: "" })}>
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        )}
                                    </>
                                )}
                            </Card>
                        ))}
                    </div>
                </div>

                {/* PDF Preview Sidebar */}
                <div className={`transition-all duration-300 ${showPdf ? 'w-1/2 min-w-[50%]' : 'w-0 opacity-0 overflow-hidden'} bg-zinc-900 border-l flex flex-col`}>
                    {showPdf && activeReportData && (
                        <PDFViewer className="w-full h-full border-none">
                            <PDFTemplate data={activeReportData} />
                        </PDFViewer>
                    )}
                </div>
            </div>
        </div>
    );
};
