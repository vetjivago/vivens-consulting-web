import { useEffect, useState } from "react";
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
import { PDFViewer } from "@react-pdf/renderer";
import { PDFTemplate } from "@/components/reports/PDFTemplate";
import { useToast } from "@/hooks/use-toast";
import { Save, ArrowLeft, Loader2, Upload, X, ImageIcon } from "lucide-react";

export const ReportEditor = () => {
    const { id } = useParams(); // If id exists, it's edit mode (not fully implemented yet)
    const navigate = useNavigate();
    const { toast } = useToast();

    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState<any[]>([]);

    // Report State
    const [title, setTitle] = useState("Novo Relatório");
    const [type, setType] = useState("vistoria");
    const [projectId, setProjectId] = useState("");
    const [content, setContent] = useState("");
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

    useEffect(() => {
        const fetchProjects = async () => {
            const { data } = await supabase.from("projects").select("id, title, clients(name)");
            setProjects(data || []);
        };
        fetchProjects();
    }, []);

    // Update preview when data changes
    useEffect(() => {
        const selectedProject = projects.find(p => p.id === projectId);
        setPreviewData({
            title: title || "Sem Título",
            type: type,
            client: selectedProject?.clients?.name || "Cliente não selecionado",
            project: selectedProject?.title || "Projeto não selecionado",
            date: new Date().toLocaleDateString('pt-BR'),
            content: content || "Sem conteúdo...",
            images: images
        });
    }, [title, type, projectId, content, projects, images]);

    const handleSave = async (status: 'draft' | 'completed') => {
        setLoading(true);

        // Upload logic/Save to DB would go here
        // For now, let's just create the record

        const { error } = await supabase.from("reports").insert([{
            title,
            type,
            project_id: projectId,
            content: { text: content }, // Store simple text for now
            images: images,
            status: status
        }]);

        if (error) {
            toast({ variant: "destructive", title: "Erro ao salvar", description: error.message });
        } else {
            toast({ title: "Sucesso", description: "Relatório salvo!" });
            navigate("/internal/reports");
        }
        setLoading(false);
        setLoading(false);
    };

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
        <div className="h-[calc(100vh-100px)] flex flex-col">
            <div className="flex justify-between items-center mb-4 border-b pb-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/internal/reports")}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-2xl font-bold">Editor de Relatório</h1>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => handleSave('draft')} disabled={loading}>
                        Salvar Rascunho
                    </Button>
                    <Button onClick={() => handleSave('completed')} disabled={loading}>
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Finalizar
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Left: Form */}
                <div className="w-1/2 overflow-y-auto pr-2 space-y-6">
                    <div className="space-y-4 p-4 border rounded-lg bg-white">
                        <h3 className="font-semibold text-lg">Informações Gerais</h3>

                        <div className="space-y-2">
                            <Label>Projeto</Label>
                            <Select value={projectId} onValueChange={setProjectId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o projeto" />
                                </SelectTrigger>
                                <SelectContent>
                                    {projects.map(p => (
                                        <SelectItem key={p.id} value={p.id}>{p.title} - {p.clients?.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Título</Label>
                                <Input value={title} onChange={e => setTitle(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Tipo</Label>
                                <Select value={type} onValueChange={setType}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="vistoria">Vistoria</SelectItem>
                                        <SelectItem value="tecnico">Técnico</SelectItem>
                                        <SelectItem value="final">Final</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 p-4 border rounded-lg bg-white">
                        <h3 className="font-semibold text-lg">Conteúdo</h3>
                        <div className="space-y-2">
                            <Label>Descrição Detalhada</Label>
                            <Textarea
                                className="min-h-[200px]"
                                placeholder="Descreva as atividades, observações e conclusões..."
                                value={content}
                                onChange={e => setContent(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-4 p-4 border rounded-lg bg-white">
                        <h3 className="font-semibold text-lg">Imagens</h3>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            {images.map((img, index) => (
                                <div key={index} className="relative group border rounded-lg overflow-hidden h-32">
                                    <img src={img} alt={`Img ${index}`} className="w-full h-full object-cover" />
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => removeImage(index)}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-4">
                            <Label htmlFor="image-upload" className="cursor-pointer">
                                <div className="flex items-center gap-2 text-gemini-600 border border-gemini-200 bg-gemini-50 hover:bg-gemini-100 px-4 py-2 rounded-md transition-colors">
                                    <Upload className="w-4 h-4" />
                                    Adicionar Imagem
                                </div>
                                <Input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                    disabled={loading}
                                />
                            </Label>
                            {loading && <span className="text-sm text-gray-500">Enviando...</span>}
                        </div>
                    </div>
                </div>

                {/* Right: PDF Preview */}
                <div className="w-1/2 bg-gray-100 rounded-lg overflow-hidden border">
                    <PDFViewer width="100%" height="100%" className="border-none">
                        <PDFTemplate data={previewData} />
                    </PDFViewer>
                </div>
            </div>
        </div>
    );
};
