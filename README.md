# Saarkar Vaani

**Saarkar Vaani** is a voice-first AI assistant that helps citizens discover, understand, and apply for Indian government welfare schemes using multilingual conversations and intelligent eligibility matching.

Built by **Team IntelliForge**.

---

## Problem Statement

Millions of eligible citizens miss out on government welfare schemes due to:

- Language barriers
- Low digital literacy
- Complex application processes
- Lack of awareness
- Scattered government information

Saarkar Vaani aims to simplify this journey through an intuitive voice-based experience.

---

## Features

- Voice-first user experience
- Personalized government scheme recommendations
- Dynamic eligibility matching
- Government scheme database powered by Supabase
- Guided document verification
- Application tracking
- Responsive web interface
- Multilingual architecture (planned)

---

## Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- Framer Motion

### Backend
- Supabase
- PostgreSQL
- Row Level Security (RLS)

### AI & Voice (In Progress)
- Gnani AI
- Large Language Model (LLM)
- Mem0 (planned)

---

## Architecture

```text
Citizen
    │
    ▼
Voice Input
    │
    ▼
Speech Recognition
    │
    ▼
Profile Extraction
    │
    ▼
Eligibility Matching
    │
    ▼
Government Scheme Database
    │
    ▼
Document Guidance
    │
    ▼
Application Tracking
```

---

## Database

Current tables include:

- schemes
- profiles
- cases
- case_documents
- case_forms

Supabase is used as the backend with Row Level Security enabled.

---

## Current Progress

### Completed

- Responsive UI
- Supabase integration
- Dynamic scheme loading
- Dynamic scheme details
- Database schema
- Government scheme dataset
- TypeScript service layer

### In Progress

- Dynamic document checklist
- Application workflow
- Case management
- Dashboard

### Planned

- Gnani AI integration
- Multilingual voice support
- AI-powered eligibility extraction
- Persistent memory
- Production deployment

---

## Getting Started

Clone the repository

```bash
git clone https://github.com/harinivenkatesh-ai/IntelliForge.git
```

Install dependencies

```bash
npm install
```

Configure environment variables

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Run the application

```bash
npm run dev
```

---

## Team IntelliForge

- Harini
- Joshvi
- Bavada
- Nandhini

---

## Vision

To make government welfare schemes more accessible through conversational AI, multilingual voice interaction, and intelligent digital assistance.

---

## License

Developed for educational and hackathon purposes.
