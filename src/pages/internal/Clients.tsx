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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Search, Loader2 } from "lucide-react"; // Added Loader2
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { ClientInvoices } from "@/components/clients/ClientInvoices";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Use Tabs for better organization if needed, or Grid

type Client = {
    id: string;
    name: string;
    fantasy_name: string;
    contact_person: string;
    email: string;
    phone: string;
    document: string; // CNPJ/CPF
    state_registration: string;
    address: string; // Keep for backward compatibility or simple view
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zip_code: string;
};

export const Clients = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [loadingCNPJ, setLoadingCNPJ] = useState(false);
    const [loadingCEP, setLoadingCEP] = useState(false);
    const { toast } = useToast();

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        fantasy_name: "",
        contact_person: "",
        email: "",
        phone: "",
        document: "", // CNPJ/CPF
        state_registration: "",
        zip_code: "",
        street: "",
        number: "",
        neighborhood: "",
        city: "",
        state: "",
    });

    const fetchClients = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("clients")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("fetchClients error:", error);
            toast({
                variant: "destructive",
                title: "Erro ao carregar clientes",
                description: error.message,
            });
        } else {
            console.log("fetchClients data:", data);
            setClients(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleSearchCNPJ = async () => {
        const cnpj = formData.document.replace(/\D/g, '');
        if (cnpj.length !== 14) {
            toast({ variant: "destructive", title: "CNPJ inválido", description: "Digite os 14 números do CNPJ." });
            return;
        }

        setLoadingCNPJ(true);
        try {
            const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
            if (!response.ok) throw new Error("CNPJ não encontrado");
            const data = await response.json();

            setFormData(prev => ({
                ...prev,
                name: data.razao_social,
                fantasy_name: data.nome_fantasia || data.razao_social,
                email: data.email || prev.email,
                phone: data.ddd_telefone_1 || prev.phone,
                street: data.logradouro,
                number: data.numero,
                neighborhood: data.bairro,
                city: data.municipio,
                state: data.uf,
                zip_code: data.cep
            }));
            toast({ title: "CNPJ Encontrado!", description: "Dados preenchidos automaticamente." });
        } catch (error) {
            toast({ variant: "destructive", title: "Erro na busca", description: "Não foi possível buscar este CNPJ." });
        } finally {
            setLoadingCNPJ(false);
        }
    };

    const handleSearchCEP = async () => {
        const cep = formData.zip_code.replace(/\D/g, '');
        if (cep.length !== 8) return;

        setLoadingCEP(true);
        try {
            const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`);
            if (!response.ok) throw new Error("CEP não encontrado");
            const data = await response.json();

            setFormData(prev => ({
                ...prev,
                street: data.street,
                neighborhood: data.neighborhood,
                city: data.city,
                state: data.state
            }));
        } catch (error) {
            // Validating silently or showing toast if explicit action
        } finally {
            setLoadingCEP(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Construct basic address string for compatibility
        const fullAddress = `${formData.street}, ${formData.number} - ${formData.neighborhood}, ${formData.city}/${formData.state}`;

        const payload = {
            ...formData,
            address: fullAddress
        };

        const { error } = await supabase.from("clients").insert([payload]);

        if (error) {
            toast({
                variant: "destructive",
                title: "Erro ao criar cliente",
                description: error.message,
            });
        } else {
            toast({
                title: "Sucesso",
                description: "Cliente cadastrado com sucesso.",
            });
            setIsDialogOpen(false);
            setFormData({
                name: "", fantasy_name: "", contact_person: "", email: "", phone: "",
                document: "", state_registration: "", zip_code: "",
                street: "", number: "", neighborhood: "", city: "", state: ""
            });
            fetchClients();
        }
    };

    const filteredClients = Array.isArray(clients) ? clients.filter((client) =>
        (client.name && client.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (client.fantasy_name && client.fantasy_name.toLowerCase().includes(searchTerm.toLowerCase()))
    ) : [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Novo Cliente
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle>Cadastro de Cliente / Fornecedor</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-6 py-4">

                            {/* Group 1: Fiscal Data */}
                            <div className="space-y-4 border p-4 rounded-md">
                                <h3 className="font-semibold text-sm text-blue-600">Dados da Empresa</h3>
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-12 md:col-span-4 space-y-2">
                                        <Label htmlFor="document">CNPJ / CPF</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="document"
                                                value={formData.document}
                                                onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                                                placeholder="Apenas números"
                                            />
                                            <Button type="button" variant="outline" size="icon" onClick={handleSearchCNPJ} disabled={loadingCNPJ}>
                                                {loadingCNPJ ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="col-span-12 md:col-span-4 space-y-2">
                                        <Label>Inscrição Estadual</Label>
                                        <Input
                                            value={formData.state_registration}
                                            onChange={(e) => setFormData({ ...formData, state_registration: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-4 space-y-2">
                                        <Label>Contato Principal</Label>
                                        <Input
                                            value={formData.contact_person}
                                            onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-6 space-y-2">
                                        <Label htmlFor="name">Razão Social *</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-6 space-y-2">
                                        <Label>Nome Fantasia</Label>
                                        <Input
                                            value={formData.fantasy_name}
                                            onChange={(e) => setFormData({ ...formData, fantasy_name: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-6 space-y-2">
                                        <Label htmlFor="email">Email Financeiro/NFe</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-6 space-y-2">
                                        <Label htmlFor="phone">Telefone / WhatsApp</Label>
                                        <Input
                                            id="phone"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Group 2: Address */}
                            <div className="space-y-4 border p-4 rounded-md">
                                <h3 className="font-semibold text-sm text-blue-600">Endereço Fiscal</h3>
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-12 md:col-span-3 space-y-2">
                                        <Label>CEP</Label>
                                        <Input
                                            value={formData.zip_code}
                                            onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                                            onBlur={handleSearchCEP}
                                            placeholder="00000-000"
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-7 space-y-2">
                                        <Label>Logradouro</Label>
                                        <Input
                                            value={formData.street}
                                            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-2 space-y-2">
                                        <Label>Número</Label>
                                        <Input
                                            value={formData.number}
                                            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-5 space-y-2">
                                        <Label>Bairro</Label>
                                        <Input
                                            value={formData.neighborhood}
                                            onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-5 space-y-2">
                                        <Label>Cidade</Label>
                                        <Input
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-2 space-y-2">
                                        <Label>UF</Label>
                                        <Input
                                            value={formData.state}
                                            maxLength={2}
                                            onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-12 text-lg">Salvar Cadastro</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-500" />
                <Input
                    placeholder="Buscar clientes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Empresa</TableHead>
                            <TableHead>Contato</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>CNPJ/CPF</TableHead>
                            <TableHead className="w-[150px]">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24">
                                    Carregando...
                                </TableCell>
                            </TableRow>
                        ) : filteredClients.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-gray-500">
                                    Nenhum cliente encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredClients.map((client) => (
                                <TableRow key={client.id}>
                                    <TableCell className="font-medium">
                                        <div>{client.name}</div>
                                        {client.fantasy_name && <div className="text-xs text-muted-foreground">{client.fantasy_name}</div>}
                                    </TableCell>
                                    <TableCell>{client.contact_person}</TableCell>
                                    <TableCell>{client.email}</TableCell>
                                    <TableCell>{client.document || '-'}</TableCell>
                                    <TableCell>
                                        <ClientInvoices clientId={client.id} clientName={client.name} />
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
