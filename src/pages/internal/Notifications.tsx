import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckSquare, FolderOpen, TrendingUp, FileText, ScrollText, 
  DollarSign, File, AtSign, ShieldCheck, Check, Trash2
} from "lucide-react";
import { format, isToday, isThisWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ICONS: Record<string, React.ElementType> = {
  tarefa: CheckSquare,
  projeto: FolderOpen,
  oportunidade: TrendingUp,
  proposta: FileText,
  contrato: ScrollText,
  financeiro: DollarSign,
  documento: File,
  mencao: AtSign,
  aprovacao: ShieldCheck
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // Mocked
      const { data } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
      setNotifications(data || [
        { id: '1', type: 'tarefa', title: 'Tarefa Vencida', message: 'Revisar escopo do projeto', created_at: new Date().toISOString(), read: false },
        { id: '2', type: 'mencao', title: 'Você foi mencionado', message: 'Jivago Rolo mencionou você em CT Vacinas', created_at: new Date(Date.now() - 86400000).toISOString(), read: false },
        { id: '3', type: 'projeto', title: 'Projeto Concluído', message: 'Implementação CRM finalizada', created_at: new Date(Date.now() - 500000000).toISOString(), read: true },
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const filtered = filter ? notifications.filter(n => n.type === filter) : notifications;

  const today = filtered.filter(n => isToday(new Date(n.created_at)));
  const thisWeek = filtered.filter(n => isThisWeek(new Date(n.created_at)) && !isToday(new Date(n.created_at)));
  const older = filtered.filter(n => !isThisWeek(new Date(n.created_at)));

  const NotificationGroup = ({ title, items }: { title: string, items: any[] }) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-8">
        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">{title}</h3>
        <div className="space-y-3">
          {items.map(n => {
            const Icon = ICONS[n.type] || File;
            return (
              <Card key={n.id} className={`transition-colors ${!n.read ? 'bg-primary/5 border-primary/20' : ''}`}>
                <CardContent className="p-4 flex gap-4">
                  <div className={`mt-1 h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${!n.read ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className={`text-base ${!n.read ? 'font-semibold' : 'font-medium'}`}>{n.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                        {format(new Date(n.created_at), "dd/MM 'às' HH:mm")}
                      </span>
                    </div>
                  </div>
                  {!n.read && (
                    <Button variant="ghost" size="icon" onClick={() => markAsRead(n.id)} title="Marcar como lido">
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Notificações</h1>
        <Button variant="outline" onClick={markAllAsRead} disabled={!notifications.some(n => !n.read)}>
          <Check className="mr-2 h-4 w-4" /> Marcar todas como lidas
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <Button variant={filter === null ? "default" : "outline"} size="sm" onClick={() => setFilter(null)}>Todas</Button>
        {Object.keys(ICONS).map(type => (
          <Button key={type} variant={filter === type ? "default" : "outline"} size="sm" onClick={() => setFilter(type)} className="capitalize">
            {type}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>
      ) : filtered.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-muted/10">
          <CheckSquare className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium">Nenhuma notificação</h3>
          <p className="text-muted-foreground">Você está em dia com tudo.</p>
        </div>
      ) : (
        <div>
          <NotificationGroup title="Hoje" items={today} />
          <NotificationGroup title="Esta Semana" items={thisWeek} />
          <NotificationGroup title="Anteriores" items={older} />
        </div>
      )}
    </div>
  );
}
