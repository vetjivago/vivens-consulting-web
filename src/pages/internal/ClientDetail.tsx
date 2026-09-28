import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Mail, Phone, MapPin, Briefcase, FileText, FolderOpen, ScrollText, DollarSign, Clock } from "lucide-react";

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchClient();
  }, [id]);

  const fetchClient = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('clients').select('*');
      const found = (data || []).find(c => c.id === id);
      setClient(found || null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>;
  }

  if (!client) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Cliente não encontrado</h2>
        <Button onClick={() => navigate('/internal/clients')}>Voltar para Clientes</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
            <Badge variant="outline">{client.segment || 'Sem segmento'}</Badge>
            <Badge className={client.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}>
              {client.status === 'active' ? 'Ativo' : 'Inativo'}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
            {client.email && <span className="flex items-center gap-1"><Mail className="h-4 w-4" /> {client.email}</span>}
            {client.phone && <span className="flex items-center gap-1"><Phone className="h-4 w-4" /> {client.phone}</span>}
          </div>
        </div>
        <Button>Editar Cliente</Button>
      </div>

      <Tabs defaultValue="resumo" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto flex-nowrap">
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
          <TabsTrigger value="contatos">Contatos</TabsTrigger>
          <TabsTrigger value="oportunidades">Oportunidades</TabsTrigger>
          <TabsTrigger value="projetos">Projetos</TabsTrigger>
          <TabsTrigger value="propostas">Propostas</TabsTrigger>
          <TabsTrigger value="contratos">Contratos</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>
        
        <TabsContent value="resumo" className="space-y-6 pt-4">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Valor Acumulado</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold">R$ 150.000</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Projetos Ativos</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold">2</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Projetos Concluídos</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold">5</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Oportunidades Abertas</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold">1</div></CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Dados Cadastrais</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-muted-foreground block mb-1">CNPJ/CPF</span><span className="font-medium">{client.document || '-'}</span></div>
                  <div><span className="text-muted-foreground block mb-1">Responsável</span><span className="font-medium">Jivago Rolo</span></div>
                  <div><span className="text-muted-foreground block mb-1">Origem</span><span className="font-medium">Indicação</span></div>
                  <div><span className="text-muted-foreground block mb-1">Data Cadastro</span><span className="font-medium">10/01/2023</span></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Endereço</CardTitle></CardHeader>
              <CardContent className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-sm">Rua Fictícia, 123 - Conjunto 45<br/>Bairro Novo<br/>São Paulo - SP<br/>01000-000</span>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contatos" className="pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Contatos</CardTitle>
              <Button size="sm">Novo Contato</Button>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">Lista de contatos da empresa...</p>
              {/* Em uma implementação real, usaria um componente Table */}
              <div className="border rounded-md p-4 text-center text-muted-foreground">Em desenvolvimento</div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Outras abas ficariam aqui com estruturas similares ou tabelas específicas */}
        {['oportunidades', 'projetos', 'propostas', 'contratos', 'documentos', 'financeiro', 'timeline'].map(tab => (
          <TabsContent key={tab} value={tab} className="pt-4">
            <Card>
              <CardHeader><CardTitle className="capitalize">{tab}</CardTitle></CardHeader>
              <CardContent>
                <div className="border rounded-md p-12 text-center text-muted-foreground">
                  Integração da aba {tab} em desenvolvimento
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
