import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, FileText, Trash2, Loader2, Download, Receipt } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

type ClientInvoice = {
    id: string;
    number: string;
    issue_date: string;
    value: number;
    status: string;
    file_url: string;
    file_type: string;
    notes: string;
};

interface ClientInvoicesProps {
    clientId: string;
    clientName: string;
}

export const ClientInvoices = ({ clientId, clientName }: ClientInvoicesProps) => {
    const [invoices, setInvoices] = useState<ClientInvoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const { toast } = useToast();

    // Form State
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        number: "",
        issue_date: "",
        value: "",
        status: "Pendente",
        notes: ""
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const fetchInvoices = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("invoices")
            .select("*")
            .eq("client_id", clientId)
            .order("issue_date", { ascending: false });

        if (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Erro ao carregar notas" });
        } else {
            setInvoices(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (isOpen) {
            fetchInvoices();
        }
    }, [isOpen, clientId]);

    const parseXML = async (file: File) => {
        try {
            const text = await file.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(text, "text/xml");

            // Extract basic NF-e data
            // Note: Different NF-e versions might have slightly different structures, 
            // this targets standard NFe structure under <infNFe>

            const ide = xmlDoc.getElementsByTagName("ide")[0];
            const total = xmlDoc.getElementsByTagName("ICMSTot")[0];

            if (ide) {
                const nNF = ide.getElementsByTagName("nNF")[0]?.textContent;
                const dhEmi = ide.getElementsByTagName("dhEmi")[0]?.textContent; // ISO 8601 format usually

                if (nNF) setFormData(prev => ({ ...prev, number: nNF }));
                if (dhEmi) setFormData(prev => ({ ...prev, issue_date: dhEmi.split('T')[0] }));
            }

            if (total) {
                const vNF = total.getElementsByTagName("vNF")[0]?.textContent;
                if (vNF) setFormData(prev => ({ ...prev, value: vNF }));
            }

            toast({
                title: "XML Processado",
                description: "Dados da nota fiscal preenchidos automaticamente.",
            });

        } catch (e) {
            console.error("XML Parse Error", e);
            toast({
                variant: 'destructive',
                title: "Erro ao ler XML",
                description: "Não foi possível extrair dados automaticamente."
            });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);

            // Auto-parse XML
            if (file.type === "text/xml" || file.name.endsWith(".xml")) {
                parseXML(file);
            }
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        try {
            let fileUrl = "";
            let fileType = "other";

            if (selectedFile) {
                const fileExt = selectedFile.name.split('.').pop();
                const fileName = `${clientId}/${Date.now()}.${fileExt}`;
                fileType = fileExt || "other";

                const { error: uploadError } = await supabase.storage
                    .from("client-documents")
                    .upload(fileName, selectedFile);

                if (uploadError) throw uploadError;

                const { data: publicUrlData } = supabase.storage
                    .from("client-documents")
                    .getPublicUrl(fileName);

                fileUrl = publicUrlData.publicUrl;
            }

            const payload = {
                client_id: clientId,
                number: formData.number,
                issue_date: formData.issue_date || null,
                value: parseFloat(formData.value) || 0,
                status: formData.status,
                notes: formData.notes,
                file_url: fileUrl,
                file_type: fileType
            };

            const { error: insertError } = await supabase.from("invoices").insert([payload]);

            if (insertError) throw insertError;

            toast({ title: "Nota Fiscal salva!" });
            setFormData({ number: "", issue_date: "", value: "", status: "Pendente", notes: "" });
            setSelectedFile(null);
            fetchInvoices();

        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erro ao salvar",
                description: error.message
            });
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta nota?")) return;

        const { error } = await supabase.from("invoices").delete().eq("id", id);
        if (error) {
            toast({ variant: "destructive", title: "Erro ao excluir" });
        } else {
            fetchInvoices();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Receipt className="h-4 w-4 mr-2" />
                    Notas Fiscais
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Notas Fiscais - {clientName}</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    {/* Form Section */}
                    <div className="md:col-span-1 border-r pr-6 space-y-4">
                        <h3 className="font-semibold text-sm">Adicionar Nota</h3>
                        <form onSubmit={handleSave} className="space-y-3">
                            <div className="space-y-1">
                                <Label>Arquivo (XML/PDF)</Label>
                                <Input type="file" onChange={handleFileChange} accept=".xml,.pdf,.png,.jpg,.jpeg" />
                                <p className="text-xs text-muted-foreground">XML preenche dados auto.</p>
                            </div>

                            <div className="space-y-1">
                                <Label>Número da Nota</Label>
                                <Input value={formData.number} onChange={e => setFormData({ ...formData, number: e.target.value })} required placeholder="Ex: 1234" />
                            </div>

                            <div className="space-y-1">
                                <Label>Data Emissão</Label>
                                <Input type="date" value={formData.issue_date} onChange={e => setFormData({ ...formData, issue_date: e.target.value })} />
                            </div>

                            <div className="space-y-1">
                                <Label>Valor Total (R$)</Label>
                                <Input type="number" step="0.01" value={formData.value} onChange={e => setFormData({ ...formData, value: e.target.value })} />
                            </div>

                            <div className="space-y-1">
                                <Label>Status</Label>
                                <select
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="Pendente">Pendente</option>
                                    <option value="Pago">Pago</option>
                                    <option value="Cancelado">Cancelado</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <Label>Observações</Label>
                                <Input value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
                            </div>

                            <Button type="submit" className="w-full" disabled={uploading}>
                                {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                                Salvar Nota
                            </Button>
                        </form>
                    </div>

                    {/* List Section */}
                    <div className="md:col-span-2">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Número</TableHead>
                                    <TableHead>Data</TableHead>
                                    <TableHead>Valor</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Arquivo</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading && <TableRow><TableCell colSpan={6} className="text-center">Carregando...</TableCell></TableRow>}
                                {!loading && invoices.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">Nenhuma nota cadastrada.</TableCell></TableRow>}

                                {invoices.map(inv => (
                                    <TableRow key={inv.id}>
                                        <TableCell className="font-medium">{inv.number}</TableCell>
                                        <TableCell>{inv.issue_date ? new Date(inv.issue_date).toLocaleDateString('pt-BR') : '-'}</TableCell>
                                        <TableCell>R$ {Number(inv.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                                        <TableCell>
                                            <Badge variant={inv.status === 'Pago' ? 'default' : inv.status === 'Cancelado' ? 'destructive' : 'secondary'}>
                                                {inv.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {inv.file_url ? (
                                                <a href={inv.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline">
                                                    <FileText className="h-4 w-4 mr-1" />
                                                    {inv.file_type}
                                                </a>
                                            ) : '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(inv.id)}>
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
