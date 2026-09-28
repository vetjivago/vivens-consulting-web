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
import { Plus, Search, Calendar as CalendarIcon, List, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export default function Meetings() {
  const [view, setView] = useState<'calendar' | 'list'>('list');
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMeetingTitle, setNewMeetingTitle] = useState('');
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('meetings').select('*');
      if (error) throw error;
      setMeetings(data || []);
    } catch (error) {
      toast({ title: 'Erro', description: 'Erro ao carregar reuniões', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('meetings').insert([{ title: newMeetingTitle }]);
      if (error) throw error;
      toast({ title: 'Sucesso', description: 'Reunião criada com sucesso.' });
      setNewMeetingTitle('');
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      toast({ title: 'Erro', description: 'Erro ao criar reunião.', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Reuniões</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => setView('calendar')} className={view === 'calendar' ? 'bg-muted' : ''}>
            <CalendarIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setView('list')} className={view === 'list' ? 'bg-muted' : ''}>
            <List className="h-4 w-4" />
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4"/> Nova Reunião</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Reunião</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateMeeting} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Título</label>
                  <Input value={newMeetingTitle} onChange={e => setNewMeetingTitle(e.target.value)} required />
                </div>
                <Button type="submit">Salvar</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar reuniões..." className="pl-8" />
        </div>
      </div>

      {view === 'list' ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Cliente/Projeto</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Horário</TableHead>
                  <TableHead>Responsável</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ) : meetings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Nenhuma reunião encontrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  meetings.map(m => (
                    <TableRow key={m.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{m.title}</TableCell>
                      <TableCell>{m.client || m.project}</TableCell>
                      <TableCell>{m.date}</TableCell>
                      <TableCell>{m.time}</TableCell>
                      <TableCell>{m.responsible}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="h-[600px] flex items-center justify-center text-muted-foreground">
            Visualização de Calendário (Em Desenvolvimento)
          </CardContent>
        </Card>
      )}
    </div>
  );
}
