import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Calendar as CalendarIcon, List } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Meetings() {
  const [view, setView] = useState<'calendar' | 'list'>('list');
  const [meetings, setMeetings] = useState([
    { id: 1, title: 'Apresentação de Proposta', client: 'UFMG', date: '2026-10-01', time: '14:00', responsible: 'Jivago Rolo' },
    { id: 2, title: 'Revisão Semanal', project: 'CT Vacinas', date: '2026-10-02', time: '09:00', responsible: 'Bruno Braga' },
  ]);

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
          <Button><Plus className="mr-2 h-4 w-4"/> Nova Reunião</Button>
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
                {meetings.map(m => (
                  <TableRow key={m.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{m.title}</TableCell>
                    <TableCell>{m.client || m.project}</TableCell>
                    <TableCell>{m.date}</TableCell>
                    <TableCell>{m.time}</TableCell>
                    <TableCell>{m.responsible}</TableCell>
                  </TableRow>
                ))}
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
