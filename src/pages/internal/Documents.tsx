import React, { useState } from 'react';
import { Plus, Search, Filter, LayoutGrid, List, File, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function Documents() {
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'table' | 'grid'>('table');

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Documentos</h1>
        <Button><Plus className="w-4 h-4 mr-2" /> Novo Documento</Button>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 flex-1 max-w-lg">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por título, tag ou versão..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Button variant="outline"><Filter className="w-4 h-4 mr-2" /> Filtros</Button>
        </div>
        <div className="flex border rounded-md overflow-hidden">
          <Button variant={view === 'table' ? 'secondary' : 'ghost'} className="rounded-none px-3" onClick={() => setView('table')}>
            <List className="w-4 h-4" />
          </Button>
          <Button variant={view === 'grid' ? 'secondary' : 'ghost'} className="rounded-none px-3" onClick={() => setView('grid')}>
            <LayoutGrid className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {view === 'table' ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título / Arquivo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Cliente/Projeto</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Tags</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Nenhum documento encontrado.</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="flex items-center justify-center py-12 border rounded-md text-muted-foreground col-span-full">
            Nenhum documento encontrado.
          </div>
        </div>
      )}
    </div>
  );
}
