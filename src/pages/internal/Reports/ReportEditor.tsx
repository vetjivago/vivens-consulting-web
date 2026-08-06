import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PDFViewer, pdf } from "@react-pdf/renderer";
import { PDFDocument } from 'pdf-lib';
import { PDFTemplate } from "@/components/reports/PDFTemplate";
import { useToast } from "@/components/ui/use-toast";
import { ReportBlock, StructuredReportData } from "@/types/report";
import { Save, ArrowLeft, Loader2, Eye, EyeOff, Star, Table, Camera, FileText, Heading1, File, GripVertical, Plus, Scissors, ArrowUp, ArrowDown, Trash2, X, Image as ImageIcon, Download, AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";

// New Components
import { ReportBlockWrapper } from "./components/ReportBlockWrapper";
import { BlockInserter } from "./components/BlockInserter";
import { RN57_TEMPLATE_ITEMS } from "@/constants/reportTemplates";

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
        client_name: "",
        project_title: "",
    });

    const [blocks, setBlocks] = useState<ReportBlock[]>([]);
    const [collapsedBlocks, setCollapsedBlocks] = useState<Record<string, boolean>>({});
    const [projects, setProjects] = useState<any[]>([]);

    const [dataLoaded, setDataLoaded] = useState(false);

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

    useEffect(() => { reportMetaRef.current = reportMeta; }, [reportMeta]);
    useEffect(() => { blocksRef.current = blocks; }, [blocks]);
    // Add Block at specific index
    const addBlock = (type: ReportBlock['type'] | 'rn57_template', index?: number) => {
        const actualType = type === 'rn57_template' ? 'compliance_table' : type;

        const newBlock: ReportBlock = {
            id: crypto.randomUUID(),
            type: actualType,
            data: {}
        };

        // Default Data
        if (type === 'executive_summary') newBlock.data = { imagesAnalyzed: 0, criticalImages: 0, evaluationDate: new Date().toLocaleDateString('pt-BR'), generalStatus: 'Crítico' };
        if (type === 'compliance_table') newBlock.data = { title: "Nova Tabela de Conformidade", items: [] };
        if (type === 'rn57_template') {
            newBlock.data = {
                title: "TABELA AUXILIAR - CRITÉRIO MÍNIMOS PARA CRIAÇÃO, MANUTENÇÃO E EXPERIMENTAÇÃO DE ROEDORES E LAGOMORFOS (RN 57)",
                items: RN57_TEMPLATE_ITEMS.map(i => ({ ...i, id: crypto.randomUUID() }))
            };
        }
        if (type === 'observation') newBlock.data = { description: "", severity: "medium", images: [], align: 'justify' };
        // ... rest of the code ...
        if (type === 'section_header') newBlock.data = { title: "Título da Seção" };
        if (type === 'text_section') newBlock.data = { title: "Nova Seção", text: "", align: 'justify' };
        if (type === 'pdf_attachment') newBlock.data = { title: "Anexo PDF", fileUrl: "", fileName: "" };

        if (index !== undefined) {
            const newBlocks = [...blocks];
            newBlocks.splice(index, 0, newBlock);
            setBlocks(newBlocks);
        } else {
            setBlocks([...blocks, newBlock]);
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
        setCollapsedBlocks(prev => ({ ...prev, [blockId]: !prev[blockId] }));
    };

    // Data Fetching
    useEffect(() => {
        const fetchProjects = async () => {
            const { data } = await supabase.from('projects').select('id, title, client:clients(name)');
            setProjects(data || []);
        };
        fetchProjects();
    }, []);

    useEffect(() => {
        if (id && projects.length > 0) {
            const fetchReport = async () => {
                setLoading(true);
                const { data } = await supabase.from('reports').select('*').eq('id', id).single();
                if (data) {
                    setReportMeta({ title: data.title, type: data.type, project_id: data.project_id || "", client_name: "", project_title: "" });
                    setBlocks(typeof data.content === 'string' ? [{ id: 'legacy', type: 'text_section', data: { text: data.content } }] : data.content || []);
                    const proj = projects.find(p => p.id === data.project_id);
                    if (proj) {
                        const clientName = proj.client?.name || proj.clients?.name || "";
                        setReportMeta(prev => ({ ...prev, client_name: clientName, project_title: proj.title || "" }));
                    }
                    setDataLoaded(true); // Mark as loaded
                }
                setLoading(false);
            };
            fetchReport();
        } else if (!id) {
            // Logic for a new report (no ID) -> Pre-populate with default RN57 Template blocks if empty
            if (blocks.length === 0) {
                setBlocks([
                    {
                        id: crypto.randomUUID(),
                        type: 'executive_summary',
                        data: {
                            imagesAnalyzed: 0,
                            criticalImages: 0,
                            evaluationDate: new Date().toLocaleDateString('pt-BR'),
                            generalStatus: 'Em Análise'
                        }
                    },
                    {
                        id: crypto.randomUUID(),
                        type: 'compliance_table',
                        data: {
                            title: "TABELA AUXILIAR - CRITÉRIO MÍNIMOS PARA CRIAÇÃO, MANUTENÇÃO E EXPERIMENTAÇÃO DE ROEDORES E LAGOMORFOS (RN 57)",
                            items: RN57_TEMPLATE_ITEMS.map(i => ({ ...i, id: crypto.randomUUID() }))
                        }
                    }
                ]);
            }
            setDataLoaded(true);
        }
    }, [id, projects]);

    // Save Logic
    const saveReport = async (silent = false) => {
        if (loading) return; // Prevent double save
        // Critical: Do not save if we are editing an existing report but data hasn't loaded yet.
        if (id && !dataLoaded) {
            if (!silent) console.warn("Attempted to save before data load.");
            return;
        }

        const currentMeta = reportMetaRef.current;
        if (!currentMeta.title || !currentMeta.project_id) {
            if (!silent) toast({ variant: "destructive", title: "Erro", description: "Preencha título e projeto." });
            return;
        }
        if (!silent) setLoading(true);
        const reportData = {
            title: currentMeta.title,
            type: currentMeta.type,
            project_id: currentMeta.project_id,
            content: blocksRef.current,
            updated_at: new Date().toISOString(),
        };

        const { error } = id
            ? await supabase.from('reports').update(reportData).eq('id', id)
            : await supabase.from('reports').insert([reportData]);

        if (!silent) {
            setLoading(false);
            if (!error) toast({ title: "Salvo com sucesso!" });
            else toast({ variant: "destructive", title: "Erro ao salvar", description: error.message });
        }
    };

    // Download with PDF Merge
    const downloadReport = async () => {
        try {
            setLoading(true);
            toast({ title: "Gerando PDF..." });

            // 1. Check if there are attachments
            const hasAttachments = blocksRef.current.some(b => b.type === 'pdf_attachment' && b.data.fileUrl);

            // 2. Generate Base PDF Blob
            // Filter out PDF attachments from the base document to avoid placeholder pages in the final merge
            const reportDataForBase = {
                ...activeReportData,
                blocks: activeReportData.blocks.filter(b => b.type !== 'pdf_attachment')
            };

            const blob = await pdf(<PDFTemplate data={hasAttachments ? reportDataForBase : activeReportData} />).toBlob();
            const basePdfBytes = await blob.arrayBuffer();

            // 3. If no attachments, download directly
            if (!hasAttachments) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${reportMeta.title || 'relatorio'}.pdf`;
                link.click();
                setLoading(false);
                return;
            }

            // 4. Merge Logic
            const mergedPdf = await PDFDocument.create();
            const basePdfDoc = await PDFDocument.load(basePdfBytes);
            const copiedPages = await mergedPdf.copyPages(basePdfDoc, basePdfDoc.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));

            // 5. Append Attachments
            for (const block of blocksRef.current) {
                if (block.type === 'pdf_attachment' && block.data.fileUrl) {
                    try {
                        const attachmentBytes = await fetch(block.data.fileUrl).then(res => res.arrayBuffer());
                        const attachmentDoc = await PDFDocument.load(attachmentBytes);
                        const attachmentPages = await mergedPdf.copyPages(attachmentDoc, attachmentDoc.getPageIndices());
                        attachmentPages.forEach((page) => mergedPdf.addPage(page));
                    } catch (err) {
                        console.error("Erro ao mesclar anexo:", err);
                        toast({ title: "Aviso", description: `Falha ao anexar: ${block.data.fileName}` });
                    }
                }
            }

            // 6. Save & Download
            const mergedPdfBytes = await mergedPdf.save();
            const mergedBlob = new Blob([mergedPdfBytes as any], { type: 'application/pdf' });
            const url = URL.createObjectURL(mergedBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${reportMeta.title || 'relatorio'}_completo.pdf`;
            link.click();

        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Erro ao gerar PDF", description: "Falha na exportação." });
        } finally {
            setLoading(false);
        }
    };

    // Auto-save
    useEffect(() => {
        const interval = setInterval(() => {
            // Only auto-save if we have an ID (editing), a title, and DATA IS LOADED.
            if (id && reportMetaRef.current.title && dataLoaded) {
                saveReport(true);
            }
        }, 3 * 60 * 1000);
        return () => clearInterval(interval);
    }, [id, dataLoaded]);

    // Image Upload Logic
    const [activeBlockIdForUpload, setActiveBlockIdForUpload] = useState<string | null>(null);
    const handleBlockImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!activeBlockIdForUpload || !e.target.files?.length) return;
        setLoading(true);
        const files = Array.from(e.target.files);
        const newImages: { url: string, caption: string }[] = [];

        for (const file of files) {
            const fileName = `${Math.random()}.${file.name.split('.').pop()}`;
            const { error } = await supabase.storage.from('project-images').upload(`reports/${fileName}`, file);
            if (!error) {
                const { data } = supabase.storage.from('project-images').getPublicUrl(`reports/${fileName}`);
                newImages.push({ url: data.publicUrl, caption: "" });
            }
        }

        const block = blocks.find(b => b.id === activeBlockIdForUpload);
        if (block) {
            if (block.type === 'observation') {
                updateBlock(block.id, { images: [...(block.data.images || []), ...newImages] });
            } else {
                updateBlock(block.id, { image: newImages[0]?.url });
            }
        }
        setLoading(false);
        setActiveBlockIdForUpload(null);
        e.target.value = '';
    };

    const getBlockLabel = (type: ReportBlock['type']) => {
        if (type === 'executive_summary') return "Resumo Executivo";
        if (type === 'compliance_table') return "Tabela de Conformidade";
        if (type === 'observation') return "Observação";
        if (type === 'section_header') return "Cabeçalho";
        if (type === 'text_section') return "Texto";
        if (type === 'pdf_attachment') return "PDF";
        if (type === 'page_break') return "Quebra de Página";
        return "Bloco";
    };

    const getBlockIcon = (type: ReportBlock['type']) => {
        if (type === 'executive_summary') return <Star className="h-4 w-4" />;
        if (type === 'compliance_table') return <Table className="h-4 w-4" />;
        if (type === 'observation') return <Camera className="h-4 w-4" />;
        if (type === 'section_header') return <Heading1 className="h-4 w-4" />;
        if (type === 'pdf_attachment') return <File className="h-4 w-4" />;
        if (type === 'page_break') return <Scissors className="h-4 w-4" />;
        return <FileText className="h-4 w-4" />;
    };

    return (
        <div className="h-screen w-full flex flex-col bg-zinc-100 overflow-hidden text-zinc-900">
            {/* Hidden Input */}
            <input type="file" id="hidden-report-file-input" className="hidden" multiple accept="image/*" onChange={handleBlockImageUpload} />

            {/* Top Bar */}
            <div className="h-14 border-b bg-white px-4 flex items-center justify-between shrink-0 z-20 shadow-sm">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/internal/reports")}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <span className="font-medium text-sm text-zinc-500">Editando Relatório</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={downloadReport} disabled={loading} className="border-blue-200 text-blue-700 hover:bg-blue-50">
                        <Download className="mr-2 h-4 w-4" /> Baixar PDF
                    </Button>
                    <div className="h-4 w-px bg-zinc-200 mx-2"></div>
                    <Button variant="ghost" size="sm" onClick={() => setShowPdf(!showPdf)}>
                        {showPdf ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                        {showPdf ? "Ocultar Preview" : "Ver Preview"}
                    </Button>
                    <Button size="sm" onClick={() => saveReport(false)} disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Salvar
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Canvas Area */}
                <div className={`flex-1 flex overflow-hidden transition-all duration-300 relative`}>

                    {/* Mini-Map Sidebar */}
                    <div className="w-16 border-r bg-zinc-50 flex flex-col items-center py-4 gap-2 overflow-y-auto shrink-0 z-10">
                        {blocks.map((block) => (
                            <Button
                                key={`nav-${block.id}`}
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200"
                                title={getBlockLabel(block.type)}
                                onClick={() => document.getElementById(block.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                            >
                                {getBlockIcon(block.type)}
                            </Button>
                        ))}
                    </div>

                    {/* Scrollable Document Area */}
                    <div className="flex-1 overflow-y-auto bg-zinc-100/50 p-8 scroll-smooth" id="document-scroll-area">
                        <div className="max-w-4xl mx-auto bg-white min-h-[1123px] shadow-sm rounded-sm p-16 animate-in fade-in duration-500">

                            {/* Document Title / Header */}
                            <div className="group mb-12 space-y-4 border-b pb-8">
                                <TextAreaAutosize
                                    className="w-full text-4xl font-bold border-none focus:ring-0 p-0 resize-none placeholder:text-zinc-300"
                                    placeholder="Título do Relatório"
                                    value={reportMeta.title}
                                    onChange={(e) => setReportMeta({ ...reportMeta, title: e.target.value })}
                                />
                                <div className="grid grid-cols-2 gap-8 text-sm text-zinc-500">
                                    <div className="space-y-1">
                                        <Label className="text-xs uppercase tracking-wider font-semibold text-zinc-400">Tipo</Label>
                                        <Select value={reportMeta.type} onValueChange={(v) => setReportMeta({ ...reportMeta, type: v })}>
                                            <SelectTrigger className="border-none shadow-none p-0 h-auto font-medium text-zinc-900"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Técnico">Relatório Técnico</SelectItem>
                                                <SelectItem value="Vistoria">Relatório de Vistoria</SelectItem>
                                                <SelectItem value="Consultoria">Relatório de Consultoria</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs uppercase tracking-wider font-semibold text-zinc-400">Projeto</Label>
                                        <Select value={reportMeta.project_id} onValueChange={(v) => {
                                            const p = projects.find(proj => proj.id === v);
                                            setReportMeta({ ...reportMeta, project_id: v, client_name: p?.client?.name || "", project_title: p?.title || "" });
                                        }}>
                                            <SelectTrigger className="border-none shadow-none p-0 h-auto font-medium text-zinc-900"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                            <SelectContent>
                                                {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* Blocks List */}
                            <div className="space-y-2">
                                {/* Initial Inserter */}
                                <BlockInserter onAddBlock={(type) => addBlock(type, 0)} />

                                {blocks.map((block, index) => (
                                    <div key={block.id} id={block.id}>
                                        <ReportBlockWrapper
                                            id={block.id}
                                            blockType={block.type}
                                            isCollapsed={collapsedBlocks[block.id]}
                                            onToggleCollapse={() => toggleCollapse(block.id)}
                                            onMoveUp={() => moveBlock(index, 'up')}
                                            onMoveDown={() => moveBlock(index, 'down')}
                                            onDelete={() => removeBlock(block.id)}
                                        >
                                            <div className={`transition-all duration-300 ${collapsedBlocks[block.id] ? 'opacity-50 h-10 overflow-hidden' : ''}`}>

                                                {/* Text Section */}
                                                {block.type === 'text_section' && (
                                                    <div className="prose max-w-none group/text">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <Input
                                                                className="text-lg font-semibold border-none shadow-none px-0 focus-visible:ring-0 placeholder:text-zinc-300 flex-1"
                                                                placeholder="Título da Seção (Opcional)"
                                                                value={block.data.title}
                                                                onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                                                            />
                                                            <div className="flex bg-zinc-100 rounded-md p-0.5 opacity-0 group-hover/text:opacity-100 transition-opacity">
                                                                {[
                                                                    { id: 'left', icon: AlignLeft },
                                                                    { id: 'center', icon: AlignCenter },
                                                                    { id: 'right', icon: AlignRight },
                                                                    { id: 'justify', icon: AlignJustify }
                                                                ].map((align) => (
                                                                    <Button
                                                                        key={align.id}
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className={`h-6 w-6 rounded-sm ${block.data.align === align.id ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                                                                        onClick={() => updateBlock(block.id, { align: align.id })}
                                                                    >
                                                                        <align.icon className="h-3 w-3" />
                                                                    </Button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <Textarea
                                                            className="w-full min-h-[100px] border-none shadow-none px-0 resize-none focus-visible:ring-0 text-base leading-relaxed"
                                                            placeholder="Escreva seu texto..."
                                                            value={block.data.text}
                                                            onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                                                        />
                                                    </div>
                                                )}

                                                {/* Section Header */}
                                                {block.type === 'section_header' && (
                                                    <div className="my-8 pt-8 border-t">
                                                        <Input
                                                            className="text-2xl font-bold uppercase tracking-tight text-vivens-green border-none shadow-none px-0 focus-visible:ring-0 text-center placeholder:text-zinc-300"
                                                            placeholder="NOVA SEÇÃO"
                                                            value={block.data.title}
                                                            onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                                                        />
                                                    </div>
                                                )}

                                                {/* Executive Summary */}
                                                {block.type === 'executive_summary' && (
                                                    <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                                                        <h3 className="text-green-800 font-bold mb-4 uppercase text-sm tracking-wide">Resumo Executivo</h3>
                                                        <div className="grid grid-cols-3 gap-6">
                                                            <div>
                                                                <Label className="text-xs text-green-700 uppercase">Imagens Analisadas</Label>
                                                                <Input type="number" className="bg-white border-green-200" value={block.data.imagesAnalyzed} onChange={(e) => updateBlock(block.id, { imagesAnalyzed: +e.target.value })} />
                                                            </div>
                                                            <div>
                                                                <Label className="text-xs text-green-700 uppercase">Pontos Críticos</Label>
                                                                <Input type="number" className="bg-white border-green-200" value={block.data.criticalImages} onChange={(e) => updateBlock(block.id, { criticalImages: +e.target.value })} />
                                                            </div>
                                                            <div>
                                                                <Label className="text-xs text-green-700 uppercase">Situação</Label>
                                                                <Input className="bg-white border-green-200 font-semibold" value={block.data.generalStatus} onChange={(e) => updateBlock(block.id, { generalStatus: e.target.value })} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Observation Block */}
                                                {block.type === 'observation' && (
                                                    <div className="bg-zinc-50 p-6 rounded-lg border group/obs">
                                                        <div className="flex justify-between items-start mb-4">
                                                            <Input
                                                                className="font-bold text-lg bg-transparent border-none shadow-none px-0 focus-visible:ring-0 flex-1"
                                                                placeholder="Título da Observação"
                                                                value={block.data.title}
                                                                onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                                                            />
                                                            <div className="flex bg-white border rounded-md p-0.5 opacity-0 group-hover/obs:opacity-100 transition-opacity">
                                                                {[
                                                                    { id: 'left', icon: AlignLeft },
                                                                    { id: 'center', icon: AlignCenter },
                                                                    { id: 'right', icon: AlignRight },
                                                                    { id: 'justify', icon: AlignJustify }
                                                                ].map((align) => (
                                                                    <Button
                                                                        key={align.id}
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className={`h-6 w-6 rounded-sm ${block.data.align === align.id ? 'bg-zinc-100 text-zinc-900 border' : 'text-zinc-400 hover:text-zinc-600'}`}
                                                                        onClick={() => updateBlock(block.id, { align: align.id })}
                                                                    >
                                                                        <align.icon className="h-3 w-3" />
                                                                    </Button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <Textarea
                                                            className="mb-6 bg-white border-zinc-200 resize-none min-h-[80px]"
                                                            placeholder="Descrição da observação..."
                                                            value={block.data.description}
                                                            onChange={(e) => updateBlock(block.id, { description: e.target.value })}
                                                        />

                                                        <div className="grid grid-cols-2 gap-4">
                                                            {block.data.images?.map((img: any, idx: number) => (
                                                                <div key={idx} className="relative group rounded-md overflow-hidden border bg-white">
                                                                    <img src={img.url} className="w-full h-48 object-contain bg-zinc-100" />
                                                                    <Input
                                                                        className="border-none rounded-none border-t bg-white focus-visible:ring-0 text-xs"
                                                                        placeholder="Legenda da imagem..."
                                                                        value={img.caption}
                                                                        onChange={(e) => {
                                                                            const imgs = [...block.data.images];
                                                                            imgs[idx].caption = e.target.value;
                                                                            updateBlock(block.id, { images: imgs });
                                                                        }}
                                                                    />
                                                                    <Button size="icon" variant="destructive" className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => {
                                                                        const imgs = block.data.images.filter((_: any, i: number) => i !== idx);
                                                                        updateBlock(block.id, { images: imgs });
                                                                    }}>
                                                                        <Trash2 className="h-3 w-3" />
                                                                    </Button>
                                                                </div>
                                                            ))}

                                                            <div
                                                                className="h-48 border-2 border-dashed border-zinc-200 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-50 hover:border-zinc-300 transition-all text-zinc-400 hover:text-zinc-600"
                                                                onClick={() => {
                                                                    setActiveBlockIdForUpload(block.id);
                                                                    document.getElementById('hidden-report-file-input')?.click();
                                                                }}
                                                            >
                                                                <Camera className="h-8 w-8 mb-2" />
                                                                <span className="text-sm font-medium">Adicionar Foto</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* PDF Attachment Block */}
                                                {block.type === 'pdf_attachment' && (
                                                    <div className="p-6 rounded-lg border-2 border-dashed border-blue-100 bg-blue-50/30">
                                                        <div className="flex items-center gap-2 mb-4 text-blue-600">
                                                            <File className="h-5 w-5" />
                                                            <span className="font-semibold uppercase text-xs tracking-wider">Anexo PDF</span>
                                                        </div>
                                                        <Input
                                                            className="bg-transparent border-none shadow-none px-0 text-lg font-medium focus-visible:ring-0 mb-4"
                                                            placeholder="Título do Documento"
                                                            value={block.data.title}
                                                            onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                                                        />

                                                        {!block.data.fileUrl ? (
                                                            <div className="text-center py-8">
                                                                <Button variant="outline" className="bg-white" onClick={() => document.getElementById(`pdf-input-${block.id}`)?.click()}>
                                                                    Selecionar PDF
                                                                </Button>
                                                                <input type="file" id={`pdf-input-${block.id}`} className="hidden" accept="application/pdf" onChange={async (e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (!file) return;
                                                                    setLoading(true);
                                                                    // Fix for storage bucket
                                                                    const { data, error } = await supabase.storage.from('project-files').upload(`reports/attachments/${crypto.randomUUID()}.pdf`, file);
                                                                    if (!error) {
                                                                        const { data: pub } = supabase.storage.from('project-files').getPublicUrl(data.path);
                                                                        updateBlock(block.id, { fileUrl: pub.publicUrl, fileName: file.name });
                                                                        toast({ title: "PDF Salvo" });
                                                                    } else {
                                                                        // Fallback to project-images if files fails? No, keep consistensy.
                                                                        toast({ variant: "destructive", title: "Erro", description: error.message });
                                                                    }
                                                                    setLoading(false);
                                                                }} />
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center justify-between bg-white p-3 rounded border">
                                                                <span className="text-sm truncate flex-1">{block.data.fileName}</span>
                                                                <Button variant="ghost" size="icon" onClick={() => updateBlock(block.id, { fileUrl: "", fileName: "" })}>
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Page Break */}
                                                {block.type === 'page_break' && (
                                                    <div className="relative py-4 group">
                                                        <div className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-zinc-200"></div>
                                                        <div className="relative flex justify-center">
                                                            <span className="bg-white px-2 text-xs text-zinc-400 uppercase tracking-widest font-medium flex items-center gap-2">
                                                                <Scissors className="h-3 w-3" /> Quebra de Página
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Compliance Table Block UI - Simplified */}
                                                {block.type === 'compliance_table' && (
                                                    <div className="space-y-4">
                                                        <Input
                                                            className="text-lg font-semibold border-none shadow-none px-0 focus-visible:ring-0"
                                                            placeholder="Título da Tabela"
                                                            value={block.data.title}
                                                            onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                                                        />
                                                        <div className="border rounded-lg overflow-hidden grid">
                                                            {block.data.items?.map((item: any, idx: number) => (
                                                                <div key={idx} className={`grid grid-cols-12 gap-2 p-3 border-b last:border-0 items-start ${item.isHeader ? 'bg-indigo-50 border-indigo-100' : 'bg-white hover:bg-zinc-50/50'}`}>

                                                                    {/* Render Header Row SImply */}
                                                                    {item.isHeader ? (
                                                                        <div className="col-span-12">
                                                                            <Input
                                                                                className="font-bold text-indigo-900 border-none bg-transparent shadow-none px-0 focus-visible:ring-0 uppercase tracking-wide text-xs"
                                                                                value={item.description}
                                                                                onChange={(e) => {
                                                                                    const newItems = [...block.data.items];
                                                                                    newItems[idx].description = e.target.value;
                                                                                    updateBlock(block.id, { items: newItems });
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    ) : (
                                                                        <>
                                                                            <div className="col-span-1 pt-1">
                                                                                <Input
                                                                                    className="h-8 p-1 text-sm font-mono border-none shadow-none focus-visible:ring-0 text-center"
                                                                                    value={item.itemNumber}
                                                                                    onChange={(e) => {
                                                                                        const newItems = [...block.data.items];
                                                                                        newItems[idx].itemNumber = e.target.value;
                                                                                        updateBlock(block.id, { items: newItems });
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                            <div className="col-span-11 space-y-2">
                                                                                <Textarea className="min-h-[20px] h-auto resize-none border-none shadow-none p-0 text-sm focus-visible:ring-0"
                                                                                    value={item.description}
                                                                                    onChange={(e) => {
                                                                                        const newItems = [...block.data.items];
                                                                                        newItems[idx].description = e.target.value;
                                                                                        updateBlock(block.id, { items: newItems });
                                                                                    }}
                                                                                />
                                                                                <div className="flex gap-2 items-center flex-wrap">
                                                                                    <Select
                                                                                        value={item.classification}
                                                                                        onValueChange={(val) => {
                                                                                            const newItems = [...block.data.items];
                                                                                            newItems[idx].classification = val as any;
                                                                                            updateBlock(block.id, { items: newItems });
                                                                                        }}
                                                                                    >
                                                                                        <SelectTrigger className="h-6 w-[110px] text-[10px] border-zinc-200 bg-zinc-50"><SelectValue /></SelectTrigger>
                                                                                        <SelectContent>
                                                                                            <SelectItem value="Obrigatório">Obrigatório</SelectItem>
                                                                                            <SelectItem value="Recomendado">Recomendado</SelectItem>
                                                                                        </SelectContent>
                                                                                    </Select>
                                                                                    <div className="h-4 w-px bg-zinc-200 mx-1"></div>
                                                                                    {['Atende', 'Não Atende', 'Parcial', 'N/A', 'Não Verificado', 'Crítico', 'Alta Prioridade'].map(status => (
                                                                                        <button
                                                                                            key={status}
                                                                                            onClick={() => {
                                                                                                const newItems = [...block.data.items];
                                                                                                // Map shorthand to full status
                                                                                                const map: any = { 'Parcial': 'Atende em Partes', 'N/A': 'Não se aplica' };
                                                                                                newItems[idx].status = map[status] || status;
                                                                                                updateBlock(block.id, { items: newItems });
                                                                                            }}
                                                                                            className={`text-[10px] px-2 py-1 rounded-full border ${item.status === (status === 'Parcial' ? 'Atende em Partes' : status === 'N/A' ? 'Não se aplica' : status) ? 'bg-zinc-800 text-white border-zinc-800' : 'bg-white text-zinc-500 hover:border-zinc-400'}`}
                                                                                        >
                                                                                            {status}
                                                                                        </button>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            ))}
                                                            <Button variant="ghost" className="w-full rounded-none h-10 text-zinc-500" onClick={() => {
                                                                const newItems = [...(block.data.items || []), { itemNumber: (block.data.items?.length + 1).toString(), description: "Nova descrição...", classification: "Obrigatório", status: "Não se aplica" }];
                                                                updateBlock(block.id, { items: newItems });
                                                            }}>
                                                                <Plus className="h-4 w-4 mr-2" /> Adicionar Item
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}


                                            </div>
                                        </ReportBlockWrapper>

                                        {/* Inserter After Block */}
                                        <BlockInserter onAddBlock={(type) => addBlock(type, index + 1)} />
                                    </div>
                                ))}

                                {blocks.length === 0 && (
                                    <div className="text-center py-20 text-zinc-400">
                                        <div className="mb-4">Seu relatório está vazio</div>
                                        <p className="text-sm">Use o botão "+" acima para começar a adicionar conteúdo.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* PDF Preview Sidebar */}
                <div className={`transition-all duration-300 ${showPdf ? 'w-[45%] min-w-[400px]' : 'w-0 opacity-0 overflow-hidden'} bg-zinc-900 border-l flex flex-col`}>
                    {showPdf && activeReportData && (
                        <div className="flex-1 relative">
                            <div className="absolute top-2 right-4 z-10 bg-black/75 text-white text-[10px] px-2 py-1 rounded pointer-events-none">
                                Preview (Sem Anexos)
                            </div>
                            <PDFViewer className="w-full h-full border-none" showToolbar={false}>
                                <PDFTemplate data={activeReportData} />
                            </PDFViewer>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

// Helper for Auto-Size Text Area (Simple implementation inline or import)
const TextAreaAutosize = (props: any) => <Textarea {...props} />; 
