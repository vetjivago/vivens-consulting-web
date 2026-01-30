
import { useRef, useState } from "react";
import { ArrowUp, ArrowDown, Trash2, GripVertical, ChevronDown, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ReportBlockWrapperProps {
    id: string;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
    onDelete?: () => void;
    children: React.ReactNode;
    className?: string;
    isCollapsed?: boolean;
    onToggleCollapse?: () => void;
    blockType?: string;
}

export const ReportBlockWrapper = ({
    id,
    onMoveUp,
    onMoveDown,
    onDelete,
    children,
    className,
    isCollapsed,
    onToggleCollapse,
    blockType
}: ReportBlockWrapperProps) => {
    return (
        <div className={cn("group relative flex items-start -ml-12 pl-12 pr-4 transition-all duration-200 hover:bg-zinc-50/50 rounded-lg", className)}>
            {/* Hover Handles - Left Gutter */}
            <div className="absolute left-0 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1">
                <div className="flex flex-col items-center gap-1 p-1 rounded-md bg-white border shadow-sm text-muted-foreground">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onMoveUp}>
                        <ArrowUp className="h-3 w-3" />
                    </Button>
                    <div className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground/50">
                        <GripVertical className="h-4 w-4" />
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onMoveDown}>
                        <ArrowDown className="h-3 w-3" />
                    </Button>
                </div>

                <div className="flex flex-col gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 bg-white border shadow-sm hover:text-destructive hover:border-destructive/30"
                        onClick={onDelete}
                    >
                        <Trash2 className="h-3 w-3" />
                    </Button>
                    {onToggleCollapse && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 bg-white border shadow-sm"
                            onClick={onToggleCollapse}
                        >
                            {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        </Button>
                    )}
                </div>
            </div>

            {/* Block Content */}
            <div className="flex-1 min-w-0 w-full">
                {children}
            </div>
        </div>
    );
};
