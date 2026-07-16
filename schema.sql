-- ============================================================
-- SARKARI VAANI — SUPABASE DATABASE SCHEMA
-- Version 2.0
-- ============================================================

-- ============================================================
-- 1. SCHEMES
-- ============================================================

create table schemes (
    id uuid primary key default gen_random_uuid(),

    name text not null,
    description text,

    category text,

    benefit_text text,

    eligibility_criteria jsonb default '{}',

    required_documents jsonb default '[]',

    state text,

    source_url text,

    portal_url text,

    helpline text,

    application_deadline date,

    created_at timestamptz default now(),

    updated_at timestamptz default now()
);

-- ============================================================
-- 2. PROFILES
-- ============================================================

create table profiles (

    id uuid primary key references auth.users(id) on delete cascade,

    full_name text,

    phone text,

    preferred_language text default 'hi',

    detected_state text,

    occupation text,

    created_at timestamptz default now()
);

-- ============================================================
-- 3. CASES
-- ============================================================

create table cases (

    id uuid primary key default gen_random_uuid(),

    user_id uuid
        references profiles(id)
        on delete cascade
        not null,

    scheme_id uuid
        references schemes(id)
        not null,

    status text default 'discovered'
        check (
            status in (
                'discovered',
                'docs_pending',
                'form_filled',
                'submitted',
                'under_review',
                'approved',
                'rejected'
            )
        ),

    match_score decimal(5,2),

    match_reason text,

    created_at timestamptz default now(),

    updated_at timestamptz default now()
);

-- ============================================================
-- 4. CASE DOCUMENTS
-- ============================================================

create table case_documents (

    id uuid primary key default gen_random_uuid(),

    case_id uuid
        references cases(id)
        on delete cascade
        not null,

    document_name text not null,

    status text default 'unknown'
        check (
            status in (
                'have_it',
                'get_online',
                'visit_office',
                'unknown'
            )
        ),

    notes text,

    created_at timestamptz default now()
);

-- ============================================================
-- 5. CASE FORMS
-- ============================================================

create table case_forms (

    id uuid primary key default gen_random_uuid(),

    case_id uuid
        references cases(id)
        on delete cascade
        not null,

    form_data jsonb default '{}',

    pdf_url text,

    confirmed_by_voice boolean default false,

    created_at timestamptz default now()
);
-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table schemes enable row level security;
alter table profiles enable row level security;
alter table cases enable row level security;
alter table case_documents enable row level security;
alter table case_forms enable row level security;

-- ============================================================
-- SCHEMES (Public Read)
-- ============================================================

create policy "Schemes are publicly readable"
on schemes
for select
using (true);

-- ============================================================
-- PROFILES
-- ============================================================

create policy "Users can view own profile"
on profiles
for select
using (
    auth.uid() = id
);

create policy "Users can insert own profile"
on profiles
for insert
with check (
    auth.uid() = id
);

create policy "Users can update own profile"
on profiles
for update
using (
    auth.uid() = id
)
with check (
    auth.uid() = id
);

create policy "Users can delete own profile"
on profiles
for delete
using (
    auth.uid() = id
);

-- ============================================================
-- CASES
-- ============================================================

create policy "Users can view own cases"
on cases
for select
using (
    auth.uid() = user_id
);

create policy "Users can insert own cases"
on cases
for insert
with check (
    auth.uid() = user_id
);

create policy "Users can update own cases"
on cases
for update
using (
    auth.uid() = user_id
)
with check (
    auth.uid() = user_id
);

create policy "Users can delete own cases"
on cases
for delete
using (
    auth.uid() = user_id
);

-- ============================================================
-- CASE DOCUMENTS
-- ============================================================

create policy "Users can view own case documents"
on case_documents
for select
using (
    exists (
        select 1
        from cases
        where cases.id = case_documents.case_id
          and cases.user_id = auth.uid()
    )
);

create policy "Users can insert own case documents"
on case_documents
for insert
with check (
    exists (
        select 1
        from cases
        where cases.id = case_documents.case_id
          and cases.user_id = auth.uid()
    )
);

create policy "Users can update own case documents"
on case_documents
for update
using (
    exists (
        select 1
        from cases
        where cases.id = case_documents.case_id
          and cases.user_id = auth.uid()
    )
)
with check (
    exists (
        select 1
        from cases
        where cases.id = case_documents.case_id
          and cases.user_id = auth.uid()
    )
);

create policy "Users can delete own case documents"
on case_documents
for delete
using (
    exists (
        select 1
        from cases
        where cases.id = case_documents.case_id
          and cases.user_id = auth.uid()
    )
);

-- ============================================================
-- CASE FORMS
-- ============================================================

create policy "Users can view own case forms"
on case_forms
for select
using (
    exists (
        select 1
        from cases
        where cases.id = case_forms.case_id
          and cases.user_id = auth.uid()
    )
);

create policy "Users can insert own case forms"
on case_forms
for insert
with check (
    exists (
        select 1
        from cases
        where cases.id = case_forms.case_id
          and cases.user_id = auth.uid()
    )
);

create policy "Users can update own case forms"
on case_forms
for update
using (
    exists (
        select 1
        from cases
        where cases.id = case_forms.case_id
          and cases.user_id = auth.uid()
    )
)
with check (
    exists (
        select 1
        from cases
        where cases.id = case_forms.case_id
          and cases.user_id = auth.uid()
    )
);

create policy "Users can delete own case forms"
on case_forms
for delete
using (
    exists (
        select 1
        from cases
        where cases.id = case_forms.case_id
          and cases.user_id = auth.uid()
    )
);
-- ============================================================
-- PERFORMANCE INDEXES
-- ============================================================

-- Foreign Key Indexes
create index if not exists idx_cases_user_id
on cases(user_id);

create index if not exists idx_cases_scheme_id
on cases(scheme_id);

create index if not exists idx_case_documents_case_id
on case_documents(case_id);

create index if not exists idx_case_forms_case_id
on case_forms(case_id);

-- Search / Filtering Indexes
create index if not exists idx_schemes_category
on schemes(category);

create index if not exists idx_schemes_state
on schemes(state);

create index if not exists idx_profiles_phone
on profiles(phone);

-- JSONB GIN Index
create index if not exists idx_schemes_eligibility_gin
on schemes
using gin (eligibility_criteria);

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================

create or replace function update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

-- ============================================================
-- TRIGGERS
-- ============================================================

drop trigger if exists update_schemes_updated_at
on schemes;

create trigger update_schemes_updated_at
before update
on schemes
for each row
execute function update_updated_at_column();

drop trigger if exists update_cases_updated_at
on cases;

create trigger update_cases_updated_at
before update
on cases
for each row
execute function update_updated_at_column();

-- ============================================================
-- COMMENTS
-- ============================================================

comment on table schemes is
'Master database of all supported government schemes';

comment on table profiles is
'Additional information for authenticated users';

comment on table cases is
'Each scheme application journey for a user';

comment on table case_documents is
'Tracks required document readiness';

comment on table case_forms is
'Stores AI-filled application forms and generated PDFs';

-- ============================================================
-- SEED DATA
-- ============================================================

-- DO NOT insert sample data here.
-- Run real_schemes_seed.sql after this schema.

-- ============================================================
-- END OF SCHEMA
-- ============================================================