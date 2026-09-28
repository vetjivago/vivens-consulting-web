import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { 
  AlertCircle, 
  Calendar, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  FileText, 
  FolderOpen, 
  TrendingUp, 
  User, 
  AlertTriangle,
  ArrowRight
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Mocked aggregations that would come from various tables
      const { data: opportunities } = await supabase.from('opportunities').select('*');
      const { data: projects } = await supabase.from('projects').select('*');
      const { data: tasks } = await supabase.from('tasks').select('*');
      
      // Compute stats
      const oppsCount = opportunities?.length || 0;
      const pipelineValue = (opportunities || []).reduce((acc, curr) => acc + (curr.value || 0), 0);
      
      const activeProjects = (projects || []).filter(p => p.status !== 'completed');
      const overdueProjects = activeProjects.filter(p => new Date(p.end_date) < new Date()).length;
      
      const overdueTasks = (tasks || []).filter(t => t.status !== 'completed' && new Date(t.due_date) < new Date()).length;

      setData({
        oppsCount,
        pipelineValue,
        activeProjectsCount: activeProjects.length,
        overdueProjects,
        overdueTasks,
        receitaMes: 45000,
        pipelineTotal: pipelineValue,
        pipelinePonderado: pipelineValue * 0.6, // Mock
        pipelineData: [
          { name: 'Prospecção', value: 10000 },
          { name: 'Qualificação', value: 20000 },
          { name: 'Proposta', value: 50000 },
          { name: 'Negociação', value: 30000 },
        ],
        alerts: [
          { type: 'danger', icon: AlertCircle, text: `${overdueTasks} tarefas vencidas`, link: '/internal/tasks' },
          { type: 'warning', icon: Clock, text: '3 oportunidades sem follow-up há mais de 7 dias', link: '/internal/opportunities' },
          { type: 'warning', icon: FileText, text: '2 propostas enviadas aguardando retorno', link: '/internal/proposals' },
          { type: 'info', icon: FolderOpen, text: '1 projeto aguardando cliente', link: '/internal/projects' },
        ],
        agenda: [
          { time: '10:00', title: 'Reunião Kickoff Cliente A', type: 'Reunião' },
          { time: '14:30', title: 'Follow-up Proposta XYZ', type: 'Follow-up' },
          { time: '17:00', title: 'Entrega Relatório Final', type: 'Prazo' },
        ],
        projetosRecentes: activeProjects.slice(0, 5),
        recentActivity: [
          { time: new Date().toISOString(), user: 'Jivago Rolo', action: 'Atualizou status da oportunidade', entity: 'CT Vacinas' },
          { time: new Date(Date.now() - 3600000).toISOString(), user: 'Luisa Braga', action: 'Criou nova proposta', entity: 'UFMG' },
        ]
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 flex justify-center items-center h-full"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>;
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      {/* Row 1: Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Oportunidades Abertas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.oppsCount}</div>
            <p className="text-xs text-muted-foreground">
              R$ {data.pipelineValue?.toLocaleString('pt-BR')} no pipeline
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.activeProjectsCount}</div>
            {data.overdueProjects > 0 ? (
              <p className="text-xs text-red-500 font-medium">{data.overdueProjects} atrasado(s)</p>
            ) : (
              <p className="text-xs text-muted-foreground">No prazo</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas Vencidas</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${data.overdueTasks > 0 ? 'text-red-600' : ''}`}>
              {data.overdueTasks}
            </div>
            <p className="text-xs text-muted-foreground">Ação necessária</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita do Mês</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {data.receitaMes?.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground">+12% em relação ao mês anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Alerts Section */}
      <Card className="border-warning/50 bg-warning/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
            ⚠️ Atenção Necessária
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.alerts?.map((alert: any, idx: number) => (
              <Link key={idx} to={alert.link} className="flex items-start gap-3 p-3 rounded-md hover:bg-muted/50 transition-colors">
                <alert.icon className={`h-5 w-5 mt-0.5 ${
                  alert.type === 'danger' ? 'text-red-500' : 
                  alert.type === 'warning' ? 'text-amber-500' : 'text-blue-500'
                }`} />
                <span className="text-sm font-medium leading-none mt-1">{alert.text}</span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Row 3 */}
      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Pipeline Resumo</CardTitle>
            <CardDescription>
              Total: R$ {data.pipelineTotal?.toLocaleString('pt-BR')} | 
              Ponderado: R$ {data.pipelinePonderado?.toLocaleString('pt-BR')}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.pipelineData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {data.pipelineData?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Agenda Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.agenda?.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center">
                  <div className="w-16 text-sm font-medium text-muted-foreground">{item.time}</div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{item.title}</p>
                  </div>
                  <Badge variant="outline">{item.type}</Badge>
                </div>
              ))}
              {(!data.agenda || data.agenda.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhum compromisso para hoje</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 4 */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Projetos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.projetosRecentes?.map((project: any) => (
                <div key={project.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md">
                  <div>
                    <p className="font-medium">{project.title}</p>
                    <p className="text-sm text-muted-foreground">Cliente A</p>
                  </div>
                  <Badge>{project.status || 'Ativo'}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
              {data.recentActivity?.map((activity: any, idx: number) => (
                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-200 bg-white shadow">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-bold text-slate-900">{activity.user}</div>
                      <time className="text-xs font-medium text-amber-500">
                        {format(new Date(activity.time), 'HH:mm')}
                      </time>
                    </div>
                    <div className="text-slate-500 text-sm">{activity.action}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 5: Financial Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Valor Contratado (Mês)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 120.500</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">A Receber</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 45.200</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Margem Média</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
