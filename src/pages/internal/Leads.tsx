import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Filter, Phone, Mail, User, Briefcase, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Lead {
  id: string;
  nome: string;
  empresa: string;
  cargo?: string;
  email?: string;
  telefone?: string;
  whatsapp?: string;
  cidade?: string;
  estado?: string;
  origem: string;
  detalhe_origem?: string;
  area_interesse?: string;
  servico_provavel?: string;
  descricao_demanda?: string;
  urgencia?: 'baixa' | 'média' | 'alta' | 'crítica';
  orcamento_informado?: string;
  prazo_informado?: string;
  responsavel: string;
  status: 'novo' | 'contatado' | 'qualificado' | 'convertido' | 'arquivado';
  temperatura: 'frio' | 'morno' | 'quente';
  proxima_acao: string;
  data_proxima_acao: string;
  data_cadastro: string;
}

const statusColors = {
  novo: 'bg-blue-100 text-blue-800',
  contatado: 'bg-yellow-100 text-yellow-800',
  qualificado: 'bg-green-100 text-green-800',
  convertido: 'bg-purple-100 text-purple-800',
  arquivado: 'bg-gray-100 text-gray-800',
};

const temperaturaIcons = {
  frio: '🔵 Frio',
  morno: '🟡 Morno',
  quente: '🔴 Quente',
};

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Lead>>({
    status: 'novo',
    temperatura: 'frio',
    origem: 'site',
    urgencia: 'baixa',
    data_cadastro: new Date().toISOString()
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('leads').select('*').order('data_cadastro', { ascending: false });
      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('leads').insert([{
        ...formData,
        id: crypto.randomUUID(),
        data_cadastro: new Date().toISOString()
      }]);
      
      if (error) throw error;
      
      setIsDialogOpen(false);
      setFormData({
        status: 'novo',
        temperatura: 'frio',
        origem: 'site',
        urgencia: 'baixa',
        data_cadastro: new Date().toISOString()
      });
      fetchLeads();
    } catch (error) {
      console.error('Erro ao criar lead:', error);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.nome.toLowerCase().includes(search.toLowerCase()) || 
                          lead.empresa.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Leads</h2>
        <div className="flex items-center space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> Novo Lead</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Lead</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-lg border-b pb-2">Identificação</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nome *</label>
                      <Input required value={formData.nome || ''} onChange={e => setFormData({...formData, nome: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Empresa</label>
                      <Input value={formData.empresa || ''} onChange={e => setFormData({...formData, empresa: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Telefone/WhatsApp</label>
                      <Input value={formData.telefone || ''} onChange={e => setFormData({...formData, telefone: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-lg border-b pb-2">Origem e Interesse</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Origem</label>
                      <Select value={formData.origem} onValueChange={(v) => setFormData({...formData, origem: v})}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="site">Site</SelectItem>
                          <SelectItem value="indicacao">Indicação</SelectItem>
                          <SelectItem value="evento">Evento</SelectItem>
                          <SelectItem value="rede_social">Rede Social</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Urgência</label>
                      <Select value={formData.urgencia} onValueChange={(v: any) => setFormData({...formData, urgencia: v})}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="baixa">Baixa</SelectItem>
                          <SelectItem value="média">Média</SelectItem>
                          <SelectItem value="alta">Alta</SelectItem>
                          <SelectItem value="crítica">Crítica</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <label className="text-sm font-medium">Descrição da Demanda</label>
                      <Input value={formData.descricao_demanda || ''} onChange={e => setFormData({...formData, descricao_demanda: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-lg border-b pb-2">Gestão</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Responsável</label>
                      <Input value={formData.responsavel || ''} onChange={e => setFormData({...formData, responsavel: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <Select value={formData.status} onValueChange={(v: any) => setFormData({...formData, status: v})}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="novo">Novo</SelectItem>
                          <SelectItem value="contatado">Contatado</SelectItem>
                          <SelectItem value="qualificado">Qualificado</SelectItem>
                          <SelectItem value="convertido">Convertido</SelectItem>
                          <SelectItem value="arquivado">Arquivado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Temperatura</label>
                      <Select value={formData.temperatura} onValueChange={(v: any) => setFormData({...formData, temperatura: v})}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="frio">Frio</SelectItem>
                          <SelectItem value="morno">Morno</SelectItem>
                          <SelectItem value="quente">Quente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Próxima Ação *</label>
                      <Input required value={formData.proxima_acao || ''} onChange={e => setFormData({...formData, proxima_acao: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Data Próxima Ação *</label>
                      <Input required type="date" value={formData.data_proxima_acao || ''} onChange={e => setFormData({...formData, data_proxima_acao: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                  <Button type="submit">Salvar Lead</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex gap-2 items-center">
          <Search className="w-5 h-5 text-gray-400" />
          <Input 
            placeholder="Buscar por nome ou empresa..." 
            className="w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {['todos', 'novo', 'contatado', 'qualificado', 'convertido', 'arquivado'].map((status) => (
            <Button 
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              onClick={() => setStatusFilter(status)}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">Carregando leads...</div>
      ) : filteredLeads.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg border border-dashed">
          <User className="w-12 h-12 text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium text-lg">Nenhum lead cadastrado.</p>
          <p className="text-gray-400 mb-4">Cadastre o primeiro lead para iniciar sua prospecção.</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Novo Lead
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Temperatura</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Próxima Ação</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <React.Fragment key={lead.id}>
                  <TableRow className="cursor-pointer hover:bg-gray-50" onClick={() => toggleRow(lead.id)}>
                    <TableCell>
                      {expandedRow === lead.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </TableCell>
                    <TableCell className="font-medium">{lead.nome}</TableCell>
                    <TableCell>{lead.empresa}</TableCell>
                    <TableCell className="capitalize">{lead.origem.replace('_', ' ')}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[lead.status]} variant="secondary">
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{temperaturaIcons[lead.temperatura]}</TableCell>
                    <TableCell>{lead.responsavel}</TableCell>
                    <TableCell>{lead.proxima_acao}</TableCell>
                    <TableCell>{format(new Date(lead.data_cadastro), 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
                  </TableRow>
                  {expandedRow === lead.id && (
                    <TableRow className="bg-gray-50">
                      <TableCell colSpan={9}>
                        <div className="p-4 grid grid-cols-3 gap-6 text-sm">
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center"><User className="w-4 h-4 mr-2"/> Contato</h4>
                            <p><span className="text-gray-500">Email:</span> {lead.email || '-'}</p>
                            <p><span className="text-gray-500">Telefone:</span> {lead.telefone || '-'}</p>
                            <p><span className="text-gray-500">Cargo:</span> {lead.cargo || '-'}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center"><Briefcase className="w-4 h-4 mr-2"/> Demanda</h4>
                            <p><span className="text-gray-500">Descrição:</span> {lead.descricao_demanda || '-'}</p>
                            <p><span className="text-gray-500">Urgência:</span> <span className="capitalize">{lead.urgencia}</span></p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center"><Calendar className="w-4 h-4 mr-2"/> Acompanhamento</h4>
                            <p><span className="text-gray-500">Próxima Ação:</span> {lead.proxima_acao}</p>
                            <p><span className="text-gray-500">Data Limite:</span> {format(new Date(lead.data_proxima_acao), 'dd/MM/yyyy')}</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
