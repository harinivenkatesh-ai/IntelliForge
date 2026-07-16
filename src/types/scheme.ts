export interface Scheme {
    id: string;
    name: string;
    description: string;
    category: string;
    benefit_text: string;
    eligibility_criteria: any;
    required_documents: any;
    state: string | null;
    source_url: string;
    portal_url: string | null;
    helpline: string | null;
    application_deadline: string | null;
}