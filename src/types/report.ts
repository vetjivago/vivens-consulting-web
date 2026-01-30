
// Basic Block Types
export type BlockType = 'executive_summary' | 'compliance_table' | 'observation' | 'text_section' | 'images_grid' | 'section_header' | 'page_break' | 'pdf_attachment';

export interface ReportBlock {
    id: string;
    type: BlockType;
    // Specific data for each block type will be stored here
    data: any;
}

// 1. Executive Summary Data
export interface ExecutiveSummaryData {
    imagesAnalyzed: number;
    criticalImages: number;
    evaluationDate: string;
    generalStatus: string;
}

// 2. Compliance Table Data
export type ComplianceStatus = 'Atende' | 'Não Atende' | 'Atende em Partes' | 'Crítico' | 'Não se aplica' | 'Não Verificado';

export interface ComplianceItem {
    id: string;
    itemNumber: string;
    description: string;
    classification: 'Obrigatório' | 'Recomendado' | ''; // Allow empty for headers
    status: ComplianceStatus;
    isHeader?: boolean; // New field for section headers
}

export interface ComplianceTableData {
    title: string; // e.g. "Ambientes Físicos da Instalação Animal"
    items: ComplianceItem[];
}

// 3. Observation Data (Text + Image)
export interface ObservationData {
    title?: string; // Optional title for the observation
    description: string;
    image?: string; // URL of the uploaded image (Legacy)
    imageCaption?: string; // (Legacy)
    images?: { url: string; caption: string }[]; // New multi-image support
    severity?: 'critical' | 'high' | 'medium' | 'low' | 'none';
}

// 4. Report Struct (Full)
export interface StructuredReportData {
    title: string;
    type: string;
    client: string;
    project: string;
    date: string;
    partnerLogo?: string; // URL for the secondary logo

    // The Main Content is now a list of blocks
    blocks: ReportBlock[];
}

// 5. Section Header Data
export interface SectionHeaderData {
    title: string;
}

// 6. PDF Attachment Data
export interface PdfAttachmentData {
    title: string;
    fileUrl: string;
    fileName: string;
}
