
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { BlockType } from "@/types/report";

interface BlockInserterProps {
    onAddBlock: (type: BlockType) => void;
}

export const BlockInserter = ({ onAddBlock }: BlockInserterProps) => {
    return (
        <div className="group relative h-4 hover:h-8 flex items-center justify-center transition-all duration-200 my-2">
            <div className="absolute inset-x-0 h-px bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 rounded-full bg-white border shadow-sm opacity-0 group-hover:opacity-100 transition-all z-10 p-0 hover:bg-primary hover:text-white"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2" align="center">
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground px-2 py-1.5 uppercase">Inserir Bloco</p>
                        <Button variant="ghost" className="w-full justify-start text-sm h-8 px-2" onClick={() => onAddBlock('text_section')}>
                            Texto
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-sm h-8 px-2" onClick={() => onAddBlock('section_header')}>
                            Cabeçalho
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-sm h-8 px-2" onClick={() => onAddBlock('executive_summary')}>
                            Resumo Executivo
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-sm h-8 px-2" onClick={() => onAddBlock('compliance_table')}>
                            Tabela de Conformidade
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-sm h-8 px-2" onClick={() => onAddBlock('observation')}>
                            Observação (Foto)
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-sm h-8 px-2" onClick={() => onAddBlock('pdf_attachment')}>
                            Anexo PDF
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-sm h-8 px-2 text-muted-foreground" onClick={() => onAddBlock('page_break')}>
                            Quebra de Página
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};
