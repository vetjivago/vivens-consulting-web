import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  TrendingUp, TrendingDown, DollarSign, CreditCard, Wallet, Plus, Filter, Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

// Chart components can be mocked for now if Recharts is missing, but assuming Recharts is installed
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export default function Financial() {
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);
  const [valorContratado, setValorContratado] = useState(0);
  const [valorRecebido, setValorRecebido] = useState(0);
  const [contasReceber, setContasReceber] = useState(0);
  const [contasPagar, setContasPagar] = useState(0);
  const [recebimentos, setRecebimentos] = useState<any[]>([]);

  const { toast } = useToast();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: revs, error: revError } = await supabase.from('revenues').select('*');
      const { data: exps, error: expError } = await supabase.from('expenses').select('*');
      const { data: projs, error: projsError } = await supabase.from('projects').select('*');
      
      if (revError) throw revError;
      if (expError) throw expError;
      if (projsError) throw projsError;

      const revenues = revs || [];
      const expenses = exps || [];
      const projects = projs || [];

      // Calculate totals
      const contratado = projects.reduce((acc, p) => acc + (p.value || 0), 0);
      setValorContratado(contratado);
      
      const recebido = revenues.filter(r => r.status === 'pago').reduce((acc, r) => acc + (r.value || 0), 0);
      setValorRecebido(recebido);
      
      const aReceber = revenues.filter(r => r.status !== 'pago').reduce((acc, r) => acc + (r.value || 0), 0);
      setContasReceber(aReceber);
      
      const aPagar = expenses.filter(e => e.status !== 'pago').reduce((acc, e) => acc + (e.value || 0), 0);
      setContasPagar(aPagar);
      
      setRecebimentos(revenues);
      
      // Calculate pie data
      const expensesByCategory = expenses.reduce((acc, exp) => {
        const cat = exp.category || 'Outros';
        acc[cat] = (acc[cat] || 0) + (exp.value || 0);
        return acc;
      }, {} as Record<string, number>);
      
      setPieData(Object.entries(expensesByCategory).map(([name, value]) => ({ name, value })));
      
      // Group revenues and expenses by month
      const monthlyMap: Record<string, { receita: number, custos: number }> = {};
      
      revenues.forEach(r => {
        if (!r.date) return;
        const month = format(new Date(r.date), 'MMM');
        if (!monthlyMap[month]) monthlyMap[month] = { receita: 0, custos: 0 };
        monthlyMap[month].receita += (r.value || 0);
      });
      
      expenses.forEach(e => {
        if (!e.date) return;
        const month = format(new Date(e.date), 'MMM');
        if (!monthlyMap[month]) monthlyMap[month] = { receita: 0, custos: 0 };
        monthlyMap[month].custos += (e.value || 0);
      });
      
      setMonthlyData(Object.entries(monthlyMap).map(([name, data]) => ({ name, ...data })));

    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Falha ao carregar dados financeiros.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Financeiro</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Contratado Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(valorContratado)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Recebido</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(valorRecebido)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contas a Receber</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(contasReceber)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contas a Pagar</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(contasPagar)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Receita vs Custos</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="receita" fill="#10b981" />
                <Bar dataKey="custos" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Custos</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Recebimentos</h2>
          <Button size="sm"><Plus className="w-4 h-4 mr-2" /> Novo Recebimento</Button>
        </div>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">Carregando...</TableCell>
                </TableRow>
              ) : recebimentos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">Nenhum dado cadastrado.</TableCell>
                </TableRow>
              ) : (
                recebimentos.map(r => (
                  <TableRow key={r.id}>
                    <TableCell>{r.description || '-'}</TableCell>
                    <TableCell>{formatCurrency(r.value || 0)}</TableCell>
                    <TableCell>{r.date ? format(new Date(r.date), 'dd/MM/yyyy') : '-'}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{r.status || 'Pendente'}</Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
