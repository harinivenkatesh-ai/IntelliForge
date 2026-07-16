import { supabase } from '../lib/supabase';

export interface CaseForm {
    id: string;
    case_id: string;
    form_data: Record<string, any>;
    pdf_url: string | null;
    confirmed_by_voice: boolean;
    created_at: string;
}

/**
 * Application Page: create or update the draft form for a case.
 * Upserts on case_id so re-visiting the Application Page doesn't
 * create duplicate form rows for the same case.
 */
export const saveFormData = async (
    caseId: string,
    formData: Record<string, any>
): Promise<CaseForm> => {
    const { data: existing } = await supabase
        .from('case_forms')
        .select('id')
        .eq('case_id', caseId)
        .maybeSingle();

    if (existing) {
        const { data, error } = await supabase
            .from('case_forms')
            .update({ form_data: formData })
            .eq('id', existing.id)
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data as CaseForm;
    }

    const { data, error } = await supabase
        .from('case_forms')
        .insert([{ case_id: caseId, form_data: formData }])
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data as CaseForm;
};

/**
 * Fetch the draft/confirmed form for a case (Review Page reads this).
 */
export const getCaseForm = async (caseId: string): Promise<CaseForm | null> => {
    const { data, error } = await supabase
        .from('case_forms')
        .select('*')
        .eq('case_id', caseId)
        .maybeSingle();

    if (error) throw new Error(error.message);
    return data as CaseForm | null;
};

/**
 * Review Page: user confirms the voice-filled form is correct.
 */
export const confirmForm = async (formId: string): Promise<void> => {
    const { error } = await supabase
        .from('case_forms')
        .update({ confirmed_by_voice: true })
        .eq('id', formId);

    if (error) throw new Error(error.message);
};

/**
 * Application Page (final step): upload the generated PDF to the
 * private 'filled-forms' bucket and store its path on the form row.
 * Path is namespaced by user/case so RLS-backed signed URLs stay scoped correctly.
 */
export const uploadFilledFormPdf = async (
    formId: string,
    caseId: string,
    userId: string,
    pdfBlob: Blob
): Promise<string> => {
    const path = `${userId}/${caseId}/${formId}.pdf`;

    const { error: uploadError } = await supabase.storage
        .from('filled-forms')
        .upload(path, pdfBlob, { contentType: 'application/pdf', upsert: true });

    if (uploadError) throw new Error(uploadError.message);

    const { data: signed, error: signedError } = await supabase.storage
        .from('filled-forms')
        .createSignedUrl(path, 60 * 60 * 24 * 7); // 7-day signed URL; bucket is private

    if (signedError) throw new Error(signedError.message);

    const { error: updateError } = await supabase
        .from('case_forms')
        .update({ pdf_url: signed.signedUrl })
        .eq('id', formId);

    if (updateError) throw new Error(updateError.message);

    return signed.signedUrl;
};