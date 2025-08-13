export interface Document {
    id: number;
    title: string;
    link: string;
    file: {
        url: string;
    };
}

export interface AntiCorruptionPageData {
    title_1: string;
    title_2: string;
    title_3: string;
    title_4: string;
    title_5: string;
    documents: Document[];
    documents_2: Document[];
    documents_3: Document[];
    documents_4: Document[];
    documents_5: Document[];
}

export interface AntiCorruptionResponse {
    data: AntiCorruptionPageData;
}

export interface PageContentProps {
    pageData: AntiCorruptionPageData;
}
