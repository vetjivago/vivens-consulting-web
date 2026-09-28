import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Filter, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export default function Tasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('tasks').select('*');
      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error(error);
      toast({ title: 'Erro', description: 'Não foi possível carregar as tarefas.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('tasks').insert([{ title: newTaskTitle, status: 'pendente', priority: 'normal' }]);
      if (error) throw error;
      toast({ title: 'Sucesso', description: 'Tarefa criada com sucesso.' });
      setNewTaskTitle('');
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      toast({ title: 'Erro', description: 'Erro ao criar tarefa.', variant: 'destructive' });
    }
  };

  const updateTaskStatus = async (id: number, newStatus: string) => {
    try {
      const { error } = await supabase.from('tasks').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      toast({ title: 'Sucesso', description: 'Status da tarefa atualizado.' });
      fetchData();
    } catch (error) {
      toast({ title: 'Erro', description: 'Erro ao atualizar status.', variant: 'destructive' });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'baixa': return 'bg-gray-500';
      case 'normal': return 'bg-blue-500';
      case 'alta': return 'bg-amber-500';
      case 'urgente': return 'bg-orange-500';
      case 'crítica': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'concluido': return <Badge className="bg-green-500">Concluído</Badge>;
      case 'em_andamento': return <Badge className="bg-blue-500">Em Andamento</Badge>;
      case 'pendente': return <Badge variant="outline">Pendente</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tarefas</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4"/> Nova Tarefa</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Tarefa</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Título</label>
                <Input value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} required />
              </div>
              <Button type="submit">Salvar</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="minhas">
        <TabsList className="mb-4">
          <TabsTrigger value="minhas">Minhas Tarefas</TabsTrigger>
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="vencidas">Vencidas</TabsTrigger>
          <TabsTrigger value="hoje">Hoje</TabsTrigger>
          <TabsTrigger value="semana">Esta Semana</TabsTrigger>
          <TabsTrigger value="bloqueadas">Bloqueadas</TabsTrigger>
        </TabsList>

        <TabsContent value="minhas" className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar tarefas..." className="pl-8" />
            </div>
            <Button variant="outline"><Filter className="mr-2 h-4 w-4"/> Filtros</Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Projeto</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Prazo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ) : tasks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Nenhuma tarefa encontrada.
                      </TableCell>
                    </TableRow>
                  ) : (
                    tasks.map(task => (
                      <TableRow key={task.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-medium">{task.title}</TableCell>
                        <TableCell>{task.project}</TableCell>
                        <TableCell>{task.responsible}</TableCell>
                        <TableCell>
                          <Badge className={`${getPriorityColor(task.priority)} text-white border-none`}>
                            {(task.priority || 'normal').toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <select 
                            className="text-sm bg-transparent border rounded p-1"
                            value={task.status || 'pendente'} 
                            onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <option value="pendente">Pendente</option>
                            <option value="em_andamento">Em Andamento</option>
                            <option value="concluido">Concluído</option>
                          </select>
                        </TableCell>
                        <TableCell>{task.dueDate}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
