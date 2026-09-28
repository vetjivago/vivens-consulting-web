import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  FileText, Plus, Search, Filter, History, ChevronRight, CheckCircle2, XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/components/ui/use-toast';

interface Proposal {
  id: string;
  numero: string;
  cliente: string;
  oportunidade: string;
  versao: number;
  valor: number;
  status: 'rascunho' | 'revisao_interna' | 'aguardando_aprovacao' | 'aprovada_internamente' | 'enviada' | 'em_negociacao' | 'aceita' | 'recusada' | 'expirada' | 'cancelada';
  data: string;
  validade: string;
  responsavel: string;
}

const statusColors: any = {
  rascunho: 'bg-gray-100 text-gray-800',
  revisao_interna: 'bg-blue-100 text-blue-800',
  aguardando_aprovacao: 'bg-amber-100 text-amber-800',
  aprovada_internamente: 'bg-green-100 text-green-800',
  enviada: 'bg-violet-100 text-violet-800',
  em_negociacao: 'bg-orange-100 text-orange-800',
  aceita: 'bg-emerald-100 text-emerald-800',
  recusada: 'bg-red-100 text-red-800',
  expirada: 'bg-slate-100 text-slate-800',
  cancelada: 'bg-gray-100 text-gray-800',
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export default function Proposals() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const { toast } = useToast();

  // New Proposal Form State
  const [newProposal, setNewProposal] = useState({
    numero: '', cliente: '', oportunidade: '', responsavel: '', 
    escopo: '', entregaveis: '', prazo: '', valor: 0, 
    impostos: 0, custos: 0, condicoes_pagamento: '', validade: ''
  });

  const margem = newProposal.valor - newProposal.impostos - newProposal.custos;

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('proposals').select('*');
      if (error) throw error;
      setProposals(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar propostas",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProposal = async () => {
    try {
      const { data, error } = await supabase.from('proposals').insert([{
        numero: newProposal.numero,
        cliente: newProposal.cliente,
        oportunidade: newProposal.oportunidade,
        responsavel: newProposal.responsavel,
        valor: newProposal.valor,
        validade: newProposal.validade ? new Date(newProposal.validade).toISOString() : null,
        data: new Date().toISOString(),
        status: 'rascunho',
        versao: 1
      }]).select();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Proposta criada com sucesso",
      });
      setIsNewDialogOpen(false);
      fetchProposals();
      
      setNewProposal({
        numero: '', cliente: '', oportunidade: '', responsavel: '', 
        escopo: '', entregaveis: '', prazo: '', valor: 0, 
        impostos: 0, custos: 0, condicoes_pagamento: '', validade: ''
      });
    } catch (error: any) {
      toast({
        title: "Erro ao criar proposta",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredProposals = proposals.filter(p => 
    p.numero?.toLowerCase().includes(search.toLowerCase()) || 
    p.cliente?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Propostas</h1>
        <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> Nova Proposta</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nova Proposta</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Número *</label>
                <Input value={newProposal.numero} onChange={e => setNewProposal({...newProposal, numero: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Cliente *</label>
                <Input value={newProposal.cliente} onChange={e => setNewProposal({...newProposal, cliente: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Oportunidade</label>
                <Input value={newProposal.oportunidade} onChange={e => setNewProposal({...newProposal, oportunidade: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Responsável *</label>
                <Input value={newProposal.responsavel} onChange={e => setNewProposal({...newProposal, responsavel: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Valor (BRL) *</label>
                <Input type="number" value={newProposal.valor} onChange={e => setNewProposal({...newProposal, valor: Number(e.target.value)})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Impostos</label>
                <Input type="number" value={newProposal.impostos} onChange={e => setNewProposal({...newProposal, impostos: Number(e.target.value)})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Custos</label>
                <Input type="number" value={newProposal.custos} onChange={e => setNewProposal({...newProposal, custos: Number(e.target.value)})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Margem Estimada</label>
                <Input type="text" value={formatCurrency(margem)} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Validade</label>
                <Input type="date" value={newProposal.validade} onChange={e => setNewProposal({...newProposal, validade: e.target.value})} />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsNewDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSaveProposal}>Salvar Proposta</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por número ou cliente..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline"><Filter className="w-4 h-4 mr-2" /> Filtros</Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Oportunidade</TableHead>
              <TableHead>Versão</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Validade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Carregando...</TableCell>
              </TableRow>
            ) : filteredProposals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  Nenhuma proposta encontrada.
                </TableCell>
              </TableRow>
            ) : (
              filteredProposals.map((proposal) => (
                <TableRow key={proposal.id}>
                  <TableCell className="font-medium">{proposal.numero}</TableCell>
                  <TableCell>{proposal.cliente}</TableCell>
                  <TableCell>{proposal.oportunidade}</TableCell>
                  <TableCell>v{proposal.versao}</TableCell>
                  <TableCell>{formatCurrency(proposal.valor || 0)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={proposal.status && statusColors[proposal.status] ? statusColors[proposal.status] : ''}>
                      {proposal.status ? proposal.status.replace('_', ' ').toUpperCase() : ''}
                    </Badge>
                  </TableCell>
                  <TableCell>{proposal.data ? format(new Date(proposal.data), 'dd/MM/yyyy') : ''}</TableCell>
                  <TableCell>{proposal.validade ? format(new Date(proposal.validade), 'dd/MM/yyyy') : ''}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
