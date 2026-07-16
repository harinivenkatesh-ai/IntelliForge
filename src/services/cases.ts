import { supabase } from '../lib/supabase';

export type CaseStatus = 'discovered' | 'docs_pending' | 'form_filled' | 'submitted' | 'resolved';

export interface CaseRow {
    id: string;
    user_id: string;
    scheme_id: string;
    status: CaseStatus;
    match_score: number | null;
    created_at: string;
    updated_at: string;
}

// Case + joined scheme, for Review/Application/My Applications screens
export interface CaseWithScheme extends CaseRow {
    schemes: {
        id: string;
        name: string;
        description: string;
        category: string;
        benefit_text: string;
        eligibility_criteria: Record<string, any>;
        required_documents: string[];
        state: string | null;
        source_url: string;
    };
}

/**
 * Create a new case when user picks a scheme (after Matching screen)
 */
export const createCase = async (
    userId: string,
    schemeId: string,
    matchScore: number
): Promise<CaseRow> => {
    const { data, error } = await supabase
        .from('cases')
        .insert([{ user_id: userId, scheme_id: schemeId, match_score: matchScore, status: 'discovered' }])
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data as CaseRow;
};

/**
 * Fetch a single case with its scheme details (Scheme Details / Document Check / Review / Application screens)
 */
export const getCase = async (caseId: string): Promise<CaseWithScheme> => {
    const { data, error } = await supabase
        .from('cases')
        .select('*, schemes(*)')
        .eq('id', caseId)
        .single();

    if (error) throw new Error(error.message);
    return data as CaseWithScheme;
};

/**
 * All cases for the logged-in user, with scheme info (My Applications screen)
 */
export const getUserCases = async (userId: string): Promise<CaseWithScheme[]> => {
    const { data, error } = await supabase
        .from('cases')
        .select('*, schemes(*)')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []) as CaseWithScheme[];
};

/**
 * Update case status as the user progresses through the flow.
 * updated_at is bumped manually since there's no DB trigger for it in schema.sql.
 */
export const updateCaseStatus = async (caseId: string, status: CaseStatus): Promise<void> => {
    const { error } = await supabase
        .from('cases')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', caseId);

    if (error) throw new Error(error.message);
};