import { supabase } from '../lib/supabase';

export type DocumentStatus = 'have_it' | 'get_online' | 'visit_office' | 'unknown';

export interface CaseDocument {
    id: string;
    case_id: string;
    document_name: string;
    status: DocumentStatus;
    notes: string | null;
    created_at: string;
}

/**
 * Call this once, right after createCase(), using scheme.required_documents.
 * Seeds one row per required document at status 'unknown' so the
 * Document Check screen has something to render and update.
 */
export const initializeCaseDocuments = async (
    caseId: string,
    requiredDocuments: string[]
): Promise<CaseDocument[]> => {
    const rows = requiredDocuments.map((name) => ({
        case_id: caseId,
        document_name: name,
        status: 'unknown' as DocumentStatus,
    }));

    const { data, error } = await supabase.from('case_documents').insert(rows).select();

    if (error) throw new Error(error.message);
    return (data ?? []) as CaseDocument[];
};

/**
 * Fetch all documents for a case — this is what the Document Check screen renders.
 */
export const getCaseDocuments = async (caseId: string): Promise<CaseDocument[]> => {
    const { data, error } = await supabase
        .from('case_documents')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []) as CaseDocument[];
};

/**
 * User taps "I have it" / "Get online" / "Visit office" per document.
 */
export const updateDocumentStatus = async (
    docId: string,
    status: DocumentStatus,
    notes?: string
): Promise<void> => {
    const { error } = await supabase
        .from('case_documents')
        .update({ status, ...(notes ? { notes } : {}) })
        .eq('id', docId);

    if (error) throw new Error(error.message);
};

/**
 * True once every document for the case is marked 'have_it'.
 * Use this to decide whether to advance the case to 'form_filled'
 * and unlock the Review/Application screens.
 */
export const areAllDocumentsReady = (documents: CaseDocument[]): boolean =>
    documents.length > 0 && documents.every((d) => d.status === 'have_it');