import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Opportunity {
  id: string;
  etapa: string;
  valor_estimado: number;
  probabilidade: number;
}

const pipelineStages = [
  { id: 'lead_identificado', label: 'Lead', color: '#94a3b8' },
  { id: 'contato_realizado', label: 'Contato', color: '#60a5fa' },
  { id: 'diagnostico', label: 'Diagnóstico', color: '#22d3ee' },
  { id: 'escopo_definicao', label: 'Escopo', color: '#2dd4bf' },
  { id: 'orcamento_interno', label: 'Orçamento', color: '#818cf8' },
  { id: 'proposta_elaboracao', label: 'Elaboração Prop.', color: '#a78bfa' },
  { id: 'proposta_enviada', label: 'Proposta Enviada', color: '#fbbf24' },
  { id: 'negociacao', label: 'Negociação', color: '#fb923c' },
  { id: 'aprovacao_verbal', label: 'Aprovação', color: '#a3e635' },
  { id: 'contrato', label: 'Contrato', color: '#34d399' },
  { id: 'ganho', label: 'Ganho', color: '#22c55e' },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);
};

export default function Pipeline() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('opportunities').select('id, etapa, valor_estimado, probabilidade');
      if (error) throw error;
      setOpportunities(data || []);
    } catch (error) {
      console.error('Erro ao buscar pipeline:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPipeline = opportunities
    .filter(o => o.etapa !== 'perdido' && o.etapa !== 'suspenso' && o.etapa !== 'ganho')
    .reduce((sum, o) => sum + (o.valor_estimado || 0), 0);

  const weightedPipeline = opportunities
    .filter(o => o.etapa !== 'perdido' && o.etapa !== 'suspenso' && o.etapa !== 'ganho')
    .reduce((sum, o) => sum + ((o.valor_estimado || 0) * ((o.probabilidade || 0) / 100)), 0);

  const wonTotal = opportunities
    .filter(o => o.etapa === 'ganho')
    .reduce((sum, o) => sum + (o.valor_estimado || 0), 0);

  const chartData = pipelineStages.map(stage => {
    const oppsInStage = opportunities.filter(o => o.etapa === stage.id);
    const value = oppsInStage.reduce((sum, o) => sum + (o.valor_estimado || 0), 0);
    return {
      name: stage.label,
      valor: value,
      quantidade: oppsInStage.length,
      fill: stage.color
    };
  });

  if (loading) return <div className="p-8">Carregando pipeline...</div>;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Visão Geral do Pipeline</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Total (Aberto)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPipeline)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Ponderado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(weightedPipeline)}</div>
            <p className="text-xs text-muted-foreground mt-1">Valor × Probabilidade</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ganho</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(wonTotal)}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Funil de Vendas (Valor por Etapa)</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
              <XAxis type="number" tickFormatter={(value) => `R$ ${value / 1000}k`} />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                labelStyle={{ color: 'black' }}
              />
              <Bar dataKey="valor" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
