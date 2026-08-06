import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { BlockType } from "@/types/report";

interface BlockInserterProps {
    onAddBlock: (type: BlockType | 'rn57_template') => void;
}

export const BlockInserter = ({ onAddBlock }: BlockInserterProps) => {
    return (
        <div className="relative h-8 flex items-center justify-center transition-all duration-200 my-3">
            {/* Always Visible Line */}
            <div className="absolute inset-x-0 h-px bg-primary/30" />

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 rounded-full bg-white border border-primary/40 text-primary shadow-md opacity-100 z-10 p-0 hover:bg-primary hover:text-white hover:scale-110 transition-all cursor-pointer"
                        title="Adicionar Bloco"
                    >
                        <Plus className="h-4 w-4 stroke-[2.5]" />
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
                            Tabela de Conformidade (Vazia)
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-sm h-8 px-2 text-blue-600 font-medium" onClick={() => onAddBlock('rn57_template')}>
                            Tabela RN 57 (Completa)
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
