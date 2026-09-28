import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, List, LayoutGrid, AlertCircle, Clock } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Opportunity {
  id: string;
  codigo: string;
  titulo: string;
  cliente: string;
  responsavel: string;
  etapa: string;
  valor_estimado: number;
  probabilidade: number;
  proxima_acao: string;
  data_proxima_acao: string;
  data_ultima_acao: string;
  data_criacao: string;
}

const pipelineStages = [
  { id: 'lead_identificado', label: 'Lead Identificado', color: 'bg-slate-100 border-slate-300 text-slate-800' },
  { id: 'contato_realizado', label: 'Contato Realizado', color: 'bg-blue-100 border-blue-300 text-blue-800' },
  { id: 'diagnostico', label: 'Diagnóstico', color: 'bg-cyan-100 border-cyan-300 text-cyan-800' },
  { id: 'escopo_definicao', label: 'Escopo em Definição', color: 'bg-teal-100 border-teal-300 text-teal-800' },
  { id: 'orcamento_interno', label: 'Orçamento Interno', color: 'bg-indigo-100 border-indigo-300 text-indigo-800' },
  { id: 'proposta_elaboracao', label: 'Proposta em Elaboração', color: 'bg-violet-100 border-violet-300 text-violet-800' },
  { id: 'proposta_enviada', label: 'Proposta Enviada', color: 'bg-amber-100 border-amber-300 text-amber-800' },
  { id: 'negociacao', label: 'Negociação', color: 'bg-orange-100 border-orange-300 text-orange-800' },
  { id: 'aprovacao_verbal', label: 'Aprovação Verbal', color: 'bg-lime-100 border-lime-300 text-lime-800' },
  { id: 'contrato', label: 'Contrato', color: 'bg-emerald-100 border-emerald-300 text-emerald-800' },
  { id: 'ganho', label: 'Ganho', color: 'bg-green-100 border-green-300 text-green-800' },
  { id: 'perdido', label: 'Perdido', color: 'bg-red-100 border-red-300 text-red-800' },
  { id: 'suspenso', label: 'Suspenso', color: 'bg-gray-100 border-gray-300 text-gray-800' },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Opportunity>>({
    etapa: 'lead_identificado',
    valor_estimado: 0,
    probabilidade: 10,
    data_criacao: new Date().toISOString(),
    data_ultima_acao: new Date().toISOString()
  });

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('opportunities').select('*').order('data_criacao', { ascending: false });
      if (error) throw error;
      setOpportunities(data || []);
    } catch (error) {
      console.error('Erro ao buscar oportunidades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('opportunities').insert([{
        ...formData,
        id: crypto.randomUUID(),
        codigo: `OPP-${Math.floor(1000 + Math.random() * 9000)}`,
        data_criacao: new Date().toISOString()
      }]);
      
      if (error) throw error;
      
      setIsDialogOpen(false);
      setFormData({ etapa: 'lead_identificado', valor_estimado: 0, probabilidade: 10 });
      fetchOpportunities();
    } catch (error) {
      console.error('Erro ao criar oportunidade:', error);
    }
  };

  const handleMoveStage = async (id: string, newStage: string) => {
    try {
      const { error } = await supabase.from('opportunities').update({ etapa: newStage }).eq('id', id);
      if (error) throw error;
      fetchOpportunities();
    } catch (error) {
      console.error('Erro ao mover oportunidade:', error);
    }
  };

  const filteredOpps = opportunities.filter(opp => 
    opp.titulo.toLowerCase().includes(search.toLowerCase()) || 
    opp.cliente.toLowerCase().includes(search.toLowerCase()) ||
    opp.codigo.toLowerCase().includes(search.toLowerCase())
  );

  // Alerts calculations
  const noActionCount = opportunities.filter(o => !o.proxima_acao).length;
  const staleContactCount = opportunities.filter(o => differenceInDays(new Date(), new Date(o.data_ultima_acao)) > 7).length;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Oportunidades</h2>
        <div className="flex items-center space-x-4">
          <div className="flex rounded-md shadow-sm">
            <Button 
              variant={viewMode === 'list' ? 'default' : 'outline'} 
              className="rounded-r-none"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4 mr-2" /> Lista
            </Button>
            <Button 
              variant={viewMode === 'kanban' ? 'default' : 'outline'} 
              className="rounded-l-none"
              onClick={() => setViewMode('kanban')}
            >
              <LayoutGrid className="w-4 h-4 mr-2" /> Pipeline
            </Button>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> Nova Oportunidade</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cadastro Rápido de Oportunidade</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium">Título *</label>
                    <Input required value={formData.titulo || ''} onChange={e => setFormData({...formData, titulo: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cliente *</label>
                    <Input required value={formData.cliente || ''} onChange={e => setFormData({...formData, cliente: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Responsável *</label>
                    <Input required value={formData.responsavel || ''} onChange={e => setFormData({...formData, responsavel: e.target.value})} />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium">Próxima Ação *</label>
                    <Input required value={formData.proxima_acao || ''} onChange={e => setFormData({...formData, proxima_acao: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Data Próxima Ação *</label>
                    <Input required type="date" value={formData.data_proxima_acao || ''} onChange={e => setFormData({...formData, data_proxima_acao: e.target.value})} />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                  <Button type="submit">Salvar</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-red-50 border border-red-100 p-4 rounded-lg flex items-start space-x-3">
          <AlertCircle className="text-red-500 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-800">Sem Próxima Ação</h4>
            <p className="text-2xl font-bold text-red-600">{noActionCount}</p>
          </div>
        </div>
        <div className="bg-orange-50 border border-orange-100 p-4 rounded-lg flex items-start space-x-3">
          <Clock className="text-orange-500 mt-0.5" />
          <div>
            <h4 className="font-semibold text-orange-800">Paradas há +7 dias</h4>
            <p className="text-2xl font-bold text-orange-600">{staleContactCount}</p>
          </div>
        </div>
      </div>

      {viewMode === 'list' && (
        <div className="space-y-4">
          <div className="flex bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex gap-2 items-center w-full max-w-md">
              <Search className="w-5 h-5 text-gray-400" />
              <Input 
                placeholder="Buscar por código, título ou cliente..." 
                className="w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Etapa</TableHead>
                  <TableHead>Valor Estimado</TableHead>
                  <TableHead>Prob.</TableHead>
                  <TableHead>Próxima Ação</TableHead>
                  <TableHead>Data Prevista</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOpps.map(opp => {
                  const stageObj = pipelineStages.find(s => s.id === opp.etapa);
                  return (
                    <TableRow key={opp.id} className="cursor-pointer hover:bg-gray-50">
                      <TableCell className="font-medium">{opp.codigo}</TableCell>
                      <TableCell>{opp.titulo}</TableCell>
                      <TableCell>{opp.cliente}</TableCell>
                      <TableCell>
                        <Badge className={`${stageObj?.color} font-normal`}>{stageObj?.label || opp.etapa}</Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(opp.valor_estimado || 0)}</TableCell>
                      <TableCell>{opp.probabilidade}%</TableCell>
                      <TableCell>{opp.proxima_acao}</TableCell>
                      <TableCell>{opp.data_proxima_acao ? format(new Date(opp.data_proxima_acao), 'dd/MM/yyyy') : '-'}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {viewMode === 'kanban' && (
        <div className="flex space-x-4 overflow-x-auto pb-4 h-[calc(100vh-300px)] items-start">
          {pipelineStages.map(stage => {
            const stageOpps = filteredOpps.filter(o => o.etapa === stage.id);
            return (
              <div key={stage.id} className="min-w-[300px] bg-gray-50 rounded-lg p-3 border h-full flex flex-col">
                <div className={`p-2 rounded font-semibold text-sm mb-3 flex justify-between items-center ${stage.color}`}>
                  <span>{stage.label}</span>
                  <Badge variant="outline" className="bg-white/50">{stageOpps.length}</Badge>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {stageOpps.map(opp => (
                    <div key={opp.id} className="bg-white p-3 rounded shadow-sm border text-sm space-y-2">
                      <div className="font-semibold text-gray-800">{opp.titulo}</div>
                      <div className="text-gray-600">{opp.cliente}</div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-emerald-600">{formatCurrency(opp.valor_estimado || 0)}</span>
                        <select 
                          className="text-xs border rounded p-1 bg-gray-50"
                          value={opp.etapa}
                          onChange={(e) => handleMoveStage(opp.id, e.target.value)}
                        >
                          <option disabled>Mover para...</option>
                          {pipelineStages.map(s => (
                            <option key={s.id} value={s.id}>{s.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                  {stageOpps.length === 0 && (
                    <div className="text-center text-gray-400 text-sm py-4 italic border-2 border-dashed border-gray-200 rounded">
                      Vazio
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
