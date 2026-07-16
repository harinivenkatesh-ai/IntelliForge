-- ============================================================
-- SARKARI VAANI — REAL GOVERNMENT SCHEME SEED DATA
-- 30 schemes: 10 Education, 10 Farmer/Agriculture, 10 Women & Child Welfare
-- Run this AFTER schema.sql (in Supabase SQL Editor)
--
-- Sourced from: scholarships.gov.in (NSP), pmkisan.gov.in, pmfby.gov.in,
-- Ministry of Women & Child Development, and other official portals.
-- Amounts/eligibility are as publicly stated at time of writing — always
-- verify current figures on the official portal before your final demo,
-- since scheme parameters can change with each budget cycle.
--
-- NOTE: if you ran the old sample INSERT from schema.sql already,
-- clear it first: delete from schemes;
-- ============================================================

insert into schemes (name, description, category, benefit_text, eligibility_criteria, required_documents, state, source_url)
values

-- ============================================================
-- EDUCATION (10)
-- ============================================================
(
  'Pre-Matric Scholarship for SC Students',
  'Central scholarship for SC students in Classes 1–10 to reduce dropout and support school-level education.',
  'education',
  'Monthly stipend + fee reimbursement (varies by class and hostel status)',
  '{"caste":"SC","education_level":"pre_matric","income_max":250000}',
  '["Aadhaar Card","Caste Certificate","Income Certificate","Bonafide Student Certificate"]',
  null,
  'https://scholarships.gov.in'
),
(
  'Pre-Matric Scholarship for ST Students',
  'Central scholarship administered by the Ministry of Tribal Affairs for ST students in Classes 1–10.',
  'education',
  'Monthly stipend + fee reimbursement (varies by class and hostel status)',
  '{"caste":"ST","education_level":"pre_matric","income_max":250000}',
  '["Aadhaar Card","Caste Certificate","Income Certificate","Bonafide Student Certificate"]',
  null,
  'https://scholarships.gov.in'
),
(
  'Pre-Matric Scholarship for Minority Students',
  'Support for Muslim, Christian, Sikh, Buddhist, Jain and Parsi students in Classes 1–10, administered by Ministry of Minority Affairs.',
  'education',
  'Annual scholarship amount (varies by class)',
  '{"religion_minority":true,"education_level":"pre_matric","income_max":100000}',
  '["Aadhaar Card","Minority Community Certificate","Income Certificate","Bonafide Student Certificate"]',
  null,
  'https://scholarships.gov.in'
),
(
  'Post-Matric Scholarship (SC/ST/OBC/Minority)',
  'Maintenance allowance and course-fee reimbursement for SC/ST/OBC/Minority students from Class 11 onwards, including UG/PG/professional courses.',
  'education',
  'Maintenance allowance (day scholar/hostel) + course & tuition fees',
  '{"category_reserved":true,"education_level":"post_matric","income_max":250000}',
  '["Aadhaar Card","Caste/Community Certificate","Income Certificate","Previous Mark Sheet","Bank Passbook"]',
  null,
  'https://scholarships.gov.in'
),
(
  'National Means-cum-Merit Scholarship (NMMSS)',
  'Merit-and-need based scholarship for Class 9–12 students from economically weaker sections studying in government schools, awarded via a Class 8 selection exam.',
  'education',
  '₹12,000/year (₹1,000/month)',
  '{"education_level":"class_9_to_12","income_max":350000,"school_type":"government"}',
  '["Aadhaar Card","Income Certificate","Class 8 Marksheet","Bank Passbook"]',
  null,
  'https://scholarships.gov.in'
),
(
  'Central Sector Scheme of Scholarships (CSSS)',
  'Merit scholarship for top-performing Class 12 students pursuing undergraduate studies.',
  'education',
  '₹10,000–₹20,000/year',
  '{"education_level":"undergraduate","class_12_percentile_min":80}',
  '["Aadhaar Card","Class 12 Marksheet","Income Certificate","College Admission Proof"]',
  null,
  'https://scholarships.gov.in'
),
(
  'National Overseas Scholarship',
  'Financial assistance for SC, De-notified/Nomadic Tribes and landless agricultural labourer students to pursue higher studies abroad.',
  'education',
  'Full tuition, living allowance & travel support for approved overseas courses',
  '{"caste":"SC_or_DNT","education_level":"postgraduate_abroad"}',
  '["Aadhaar Card","Caste Certificate","Admission Letter (Foreign University)","Income Certificate","Passport"]',
  null,
  'https://scholarships.gov.in'
),
(
  'Ishan Uday Scholarship',
  'Support for students from North-Eastern states pursuing general degree/professional courses at institutions across India.',
  'education',
  'Up to ₹5,000/month for eligible students',
  '{"region":"north_east","education_level":"undergraduate","income_max":800000}',
  '["Aadhaar Card","Domicile Certificate (NE State)","Income Certificate","College Admission Proof"]',
  null,
  'https://scholarships.gov.in'
),
(
  'CBSE Merit Scholarship for Single Girl Child',
  'Merit scholarship for the single girl child of a family who has passed Class 10 with high marks and is continuing into Class 11–12.',
  'education',
  '₹500/month for 2 years (Class 11 & 12)',
  '{"gender":"female","single_child":true,"education_level":"class_11_12"}',
  '["Aadhaar Card","Class 10 Marksheet","Single Girl Child Declaration","School Bonafide Certificate"]',
  null,
  'https://scholarships.gov.in'
),
(
  'INSPIRE-SHE Scholarship',
  'DST scholarship for meritorious students pursuing natural and basic sciences at the undergraduate/postgraduate level.',
  'education',
  '₹80,000/year + ₹20,000 annual mentorship grant',
  '{"education_level":"science_ug_pg","top_board_percentile":1}',
  '["Aadhaar Card","Class 12 Marksheet (Top 1%) or JEE/NEET Rank Card","Admission Proof (Science Course)"]',
  null,
  'https://online-inspire.gov.in'
),

-- ============================================================
-- FARMER / AGRICULTURE (10)
-- ============================================================
(
  'PM-KISAN Samman Nidhi',
  'Direct income support for landholding farmer families, paid in three installments a year.',
  'farmer',
  '₹6,000/year (3 installments of ₹2,000)',
  '{"occupation":"farmer","landholding":true}',
  '["Aadhaar Card","Land Records","Bank Passbook"]',
  null,
  'https://pmkisan.gov.in'
),
(
  'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
  'Crop insurance protecting farmers against yield loss from natural calamities, pests and disease, from pre-sowing to post-harvest.',
  'farmer',
  'Low premium (1.5%–5% of sum insured); claim payout on assessed crop loss',
  '{"occupation":"farmer","has_notified_crop":true}',
  '["Aadhaar Card","Land Records / Tenancy Proof","Bank Passbook","Sowing Declaration"]',
  null,
  'https://pmfby.gov.in'
),
(
  'Kisan Credit Card (KCC)',
  'Short-term credit for crop production and allied activities at concessional interest rates.',
  'farmer',
  'Loans up to ₹3 lakh at ~4% effective interest (with prompt repayment)',
  '{"occupation":"farmer_or_tenant_or_sharecropper"}',
  '["Aadhaar Card","Land Records / Tenancy Proof","Bank Account"]',
  null,
  'https://pmkisan.gov.in/Documents/KCC.pdf'
),
(
  'PM Kisan Maandhan Yojana (PM-KMY)',
  'Voluntary contributory pension scheme for small and marginal farmers, providing a monthly pension after age 60.',
  'farmer',
  '₹3,000/month pension after age 60',
  '{"occupation":"small_marginal_farmer","age_min":18,"age_max":40}',
  '["Aadhaar Card","Land Records","Bank Passbook","Age Proof"]',
  null,
  'https://maandhan.in'
),
(
  'PM-KUSUM (Solar Pump & Feeder Solarisation)',
  'Subsidy for installing solar-powered irrigation pumps and solarising agricultural feeders to cut diesel/electricity costs.',
  'farmer',
  'Up to 60% subsidy on solar pump installation',
  '{"occupation":"farmer","has_irrigation_land":true}',
  '["Aadhaar Card","Land Records","Electricity Connection Proof (if applicable)"]',
  null,
  'https://pmkusum.mnre.gov.in'
),
(
  'Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)',
  'Irrigation scheme covering micro-irrigation (drip/sprinkler), water source creation, and watershed development.',
  'farmer',
  'Up to 60% subsidy on drip/sprinkler micro-irrigation systems',
  '{"occupation":"farmer"}',
  '["Aadhaar Card","Land Records","Bank Passbook"]',
  null,
  'https://pmksy.gov.in'
),
(
  'Soil Health Card Scheme',
  'Free soil testing every 2 years, giving farmers a scientific analysis of 12 soil parameters to guide crop choice and fertiliser use.',
  'farmer',
  'Free soil testing + personalised fertiliser recommendation',
  '{"occupation":"farmer"}',
  '["Aadhaar Card","Land Records"]',
  null,
  'https://soilhealth.dac.gov.in'
),
(
  'e-NAM (National Agriculture Market)',
  'Unified online trading platform connecting farmers to a pan-India network of buyers for transparent, competitive crop pricing.',
  'farmer',
  'Better price discovery; removes local middlemen',
  '{"occupation":"farmer"}',
  '["Aadhaar Card","Land Records","Bank Passbook"]',
  null,
  'https://enam.gov.in'
),
(
  'Rashtriya Krishi Vikas Yojana (RKVY)',
  'State-implemented scheme funding agricultural infrastructure, crop diversification and value-chain projects.',
  'farmer',
  'Varies by state-approved project (infrastructure/input support)',
  '{"occupation":"farmer_or_farmer_group"}',
  '["Aadhaar Card","Land Records","Project/Group Registration (if applicable)"]',
  null,
  'https://rkvy.nic.in'
),
(
  'PM Formalisation of Micro Food Processing Enterprises (PMFME)',
  'Credit-linked subsidy to help small, informal food processing units (including farmer-run units) formalise and scale.',
  'farmer',
  '35% credit-linked capital subsidy (up to ₹10 lakh per unit)',
  '{"occupation":"farmer_or_micro_food_processor"}',
  '["Aadhaar Card","Business/Unit Details","Bank Passbook","Udyam Registration (if available)"]',
  null,
  'https://pmfme.mofpi.gov.in'
),

-- ============================================================
-- WOMEN & CHILD WELFARE (10)
-- ============================================================
(
  'Beti Bachao Beti Padhao (BBBP)',
  'National mission to address declining child sex ratio and promote survival, protection and education of the girl child.',
  'women',
  'Awareness support, school enrollment assistance, linkage to Sukanya Samriddhi',
  '{"gender":"female","age_max":18}',
  '["Aadhaar Card","Birth Certificate"]',
  null,
  'https://wcd.nic.in/bbbp-schemes'
),
(
  'Sukanya Samriddhi Yojana (SSY)',
  'Government-backed savings account for a girl child''s education and marriage, offering high tax-free interest.',
  'women',
  '8.2% p.a. tax-free interest; matures at age 21',
  '{"gender":"female","age_max":10}',
  '["Girl Child Birth Certificate","Aadhaar Card (Parent/Guardian)","Address Proof"]',
  null,
  'https://www.india.gov.in/sukanya-samriddhi-yojana'
),
(
  'Pradhan Mantri Matru Vandana Yojana (PMMVY)',
  'Cash incentive for pregnant and lactating mothers to support nutrition and encourage institutional delivery.',
  'women',
  '₹5,000–₹6,000 cash benefit',
  '{"gender":"female","pregnant_or_lactating":true}',
  '["Aadhaar Card","MCP Card (Mother-Child Protection Card)","Bank Passbook"]',
  null,
  'https://pmmvy.wcd.gov.in'
),
(
  'Pradhan Mantri Ujjwala Yojana',
  'Free LPG gas connection for women from below-poverty-line households, reducing reliance on unsafe cooking fuels.',
  'women',
  'Free LPG connection + first refill support',
  '{"gender":"female","income_category":"BPL"}',
  '["Aadhaar Card","BPL Ration Card","Bank Passbook"]',
  null,
  'https://pmuy.gov.in'
),
(
  'One Stop Centre Scheme',
  'Single-window support for women affected by violence, offering police assistance, legal aid, medical help and shelter.',
  'women',
  'Free legal, medical, police and psychological support under one roof',
  '{"gender":"female"}',
  '["Any Valid ID Proof (Aadhaar preferred, not mandatory)"]',
  null,
  'https://wcd.nic.in/one-stop-centre-scheme-0'
),
(
  'POSHAN Abhiyaan (National Nutrition Mission)',
  'Convergence mission to reduce malnutrition among children, pregnant women and lactating mothers through Anganwadi services.',
  'women',
  'Nutrition support, health check-ups, growth monitoring via Anganwadi centres',
  '{"gender":"female_or_child","pregnant_or_lactating_or_child":true}',
  '["Aadhaar Card","Anganwadi Registration"]',
  null,
  'https://poshanabhiyaan.gov.in'
),
(
  'Balika Samriddhi Yojana',
  'Financial assistance for girl children from below-poverty-line families, from birth through school years.',
  'women',
  '₹500 at birth + annual scholarship ₹300–₹1,000 (up to Class 10)',
  '{"gender":"female","income_category":"BPL","age_max":18}',
  '["Girl Child Birth Certificate","BPL Certificate","School Enrollment Proof"]',
  null,
  'https://wcd.nic.in'
),
(
  'PM Kanya Sumangala Yojana',
  'State scheme (Uttar Pradesh) providing staged financial assistance for a girl child from birth through graduation.',
  'women',
  'Staged payouts totaling up to ₹25,000 across 6 life stages',
  '{"gender":"female","state":"Uttar Pradesh"}',
  '["Girl Child Birth Certificate","Aadhaar Card","Income Certificate","Bank Passbook"]',
  'Uttar Pradesh',
  'https://mksy.up.gov.in'
),
(
  'STEP (Support to Training and Employment Programme for Women)',
  'Skill development and employability training for women to support economic independence.',
  'women',
  'Free skill training + placement linkage in select sectors',
  '{"gender":"female","age_min":16}',
  '["Aadhaar Card","Educational Qualification Proof (if any)"]',
  null,
  'https://wcd.nic.in/schemes/step'
),
(
  'Mahila E-Haat',
  'Online marketing platform helping women entrepreneurs and self-help groups showcase and sell products directly.',
  'women',
  'Free online storefront; no middleman commission',
  '{"gender":"female","is_entrepreneur_or_shg":true}',
  '["Aadhaar Card","Business/Product Details","Bank Passbook"]',
  null,
  'https://mahilaehaat-rmk.gov.in'
);
