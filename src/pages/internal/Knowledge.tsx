import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Book, FileText, Tag } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const CATEGORIES = [
  "processos", "procedimentos", "modelos", "templates", 
  "respostas padrão", "políticas", "metodologia", 
  "fornecedores recomendados", "lições aprendidas", "boas práticas"
];

export default function Knowledge() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      // Mocked data since knowledge_base table might not exist in seeds yet
      const { data } = await supabase.from('knowledge_base').select('*').order('created_at', { ascending: false });
      setArticles(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(a => {
    const matchesSearch = (a.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (a.content || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? a.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <div className="w-64 border-r bg-muted/20 p-4 overflow-y-auto hidden md:block">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Book className="h-5 w-5" />
          Categorias
        </h2>
        <div className="space-y-1">
          <Button 
            variant={selectedCategory === null ? "secondary" : "ghost"} 
            className="w-full justify-start text-sm"
            onClick={() => setSelectedCategory(null)}
          >
            Todas as categorias
          </Button>
          {CATEGORIES.map(cat => (
            <Button 
              key={cat}
              variant={selectedCategory === cat ? "secondary" : "ghost"} 
              className="w-full justify-start text-sm capitalize"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Base de Conhecimento</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> Novo Artigo</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>Novo Artigo</DialogTitle>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Título *</label>
                  <Input placeholder="Título do artigo" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Categoria *</label>
                  <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="">Selecione...</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat} className="capitalize">{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2 flex-1 flex flex-col">
                  <label className="text-sm font-medium">Conteúdo *</label>
                  <textarea 
                    className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1"
                    placeholder="Escreva em markdown..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags (separadas por vírgula)</label>
                  <Input placeholder="ex: vendas, prospecção, template" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                <Button onClick={() => setIsDialogOpen(false)}>Salvar Artigo</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            className="pl-9" 
            placeholder="Pesquisar em todos os artigos..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
             <div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center p-12 border rounded-lg bg-muted/10">
              <Book className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium">Nenhum artigo encontrado</h3>
              <p className="text-muted-foreground mb-4">Ajuste seus filtros ou crie um novo artigo.</p>
              <Button onClick={() => setIsDialogOpen(true)}>Criar Primeiro Artigo</Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map(article => (
                <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge variant="secondary" className="capitalize mb-2">{article.category}</Badge>
                    </div>
                    <CardTitle className="text-lg">{article.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {article.content || 'Sem conteúdo.'}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Tag className="h-3 w-3" />
                      <span>{article.tags?.join(', ') || 'Sem tags'}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
