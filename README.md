# AI Customer Feedback Intelligence Platform (Project LOOP)

Project LOOP is an AI-powered full-stack SaaS application designed to capture, consolidate, analyze, and synthesize customer feedback from multiple channels using advanced natural language processing, semantic search, and intelligence workflows.

---

## 👥 Team Structure

### 1. Abhiudaya Pratap Singh (@Abhi2005-abhi)
**Role:** Backend & AI Lead
* Prisma schema
* PostgreSQL
* Database migrations and seed data
* NextAuth/Auth.js authentication
* API Routes / Route Handlers
* Server-side validation
* Claude AI integration
* AI-powered feedback classification
* Theme clustering and trend analysis
* Ask LOOP backend / grounded Q&A
* Voice-of-Customer report generation backend
* Multi-tenant workspace data isolation
* Server-side RBAC enforcement
* Backend deployment configuration

### 2. Priyam Rai (@Priyam2773)
**Role:** Frontend Lead
* UI/UX Design
* Next.js frontend
* Dashboard
* Authentication pages
* Login and signup UI
* Feedback pages
* Feedback inbox
* Search and filter UI
* Recharts visualizations
* Theme and trends UI
* Ask LOOP frontend
* Reports frontend
* Responsive design
* Loading, empty and error states
* Accessibility and UI polish

### 3. Aman Kumar Yadav (@yadavaman05)
**Role:** Full-Stack / Integration Lead
* CSV Upload
* CSV validation and import flow
* Feedback ingestion integration
* RBAC integration
* Role-based UI integration
* Theme pages integration
* Reports integration
* Frontend/backend integration
* Testing
* Bug fixing
* Integration testing
* Code quality checks
* Documentation
* README maintenance
* Final QA
* Production integration support
* Final deployment coordination

---

## 🚀 Git Branch Strategy

* `main` → Stable production-ready code (direct pushes are disabled)
* `develop` → Primary team integration branch
* `feature/backend-ai` → Abhiudaya Pratap Singh
* `feature/frontend` → Priyam Rai
* `feature/integration` → Aman Kumar Yadav

---

## 📁 Repository Structure

The current directories and files in the repository are structured as follows:

```text
AI-Customer-Feedback-Intelligence-Platform/
├── client/              # Frontend scaffolding (empty subdirectories)
├── backend/             # Backend scaffolding (empty subdirectories)
├── ai_service/          # AI Service scaffolding (empty subdirectories)
├── docs/                # Project documentation
│   └── COLLABORATION_GUIDE.md # Team collaboration and Git workflow guide
├── .env.example         # Environment variables template
├── .gitignore           # Root-level git ignore patterns
└── README.md            # Project overview and team specifications
```

---

## 🔄 Git Development Workflow

* **`main`** → Production-ready, stable code
* **`develop`** → Team integration and testing branch
* **`feature/backend-ai`** → Abhiudaya's backend and AI development
* **`feature/frontend`** → Priyam's frontend development
* **`feature/integration`** → Aman's integration, CSV, RBAC integration, reports integration, testing, and documentation

### Workflow Steps:
```text
Feature Branch ──> Push ──> Pull Request ──> Code Review ──> develop ──> Integration Testing ──> Final QA ──> Pull Request ──> main
```
*Direct commits to `main` or `develop` are prohibited.*

---

## 🔄 Team Collaboration Instructions

Before starting work:
```bash
git checkout develop
git pull origin develop
```

### Abhiudaya:
```bash
git checkout feature/backend-ai
git merge develop
```

### Priyam:
```bash
git checkout feature/frontend
git merge develop
```

### Aman:
```bash
git checkout feature/integration
git merge develop
```

### After completing work:
```bash
git add .
git commit -m "feat: describe the completed work"
git push origin <your-branch-name>
```

Then create a Pull Request:
* **Feature branch** → `develop`

After the project is fully tested and stable:
* **`develop`** → `main`

---

## 🛠️ Approved Technology Stack

* **Framework & Frontend**: Next.js 14 (App Router)
* **Language**: TypeScript
* **Styling**: Tailwind CSS
* **Database**: PostgreSQL (Neon or Supabase)
* **ORM**: Prisma ORM
* **Authentication**: NextAuth/Auth.js
* **AI Ingestion & Generation**: Anthropic Claude API
* **Vector Search**: pgvector
* **Visualizations**: Recharts
* **Validation**: Zod
* **Hosting & Deployment**: Vercel

---

## 🔒 Security Requirements

* **Never commit `.env` files.**
* **Never expose Claude API keys in frontend code.**
* **Never expose database credentials.**
* **Use `.env.example` with placeholders.**
* **Enforce RBAC server-side** (never rely solely on hiding frontend elements).
* **Enforce workspace-level multi-tenant data isolation** (every query must be scoped to the authenticated workspace).

---

## 📊 Current Project Status

* **Scaffolding and Configuration**: **Completed** (Next.js directories structure, `.gitignore`, `.env.example` configured)
* **Development Workflows & Documentation**: **Completed** (Collaboration Guide, Git Workflow Guide)
* **Database Models & Seeds Setup**: **Planned / In Progress**
* **Authentication & NextAuth Integration**: **Planned**
* **Inbox & Feedback Feed Pages**: **Planned**
* **AI Ingestion Classification**: **Planned**
* **Ask LOOP grounded Q&A**: **Planned**
* **Voice-of-Customer Reports**: **Planned**

---

## 🏗️ Backend System Documentation (Added during Backend Sprint)

This repository executes a rigorous backend layer designed for multi-tenant data isolation, intelligent analytics scaling, and secure API boundaries.

### Architecture Highlights
- **Workspace Isolation**: Enforced intrinsically across Prisma logic patterns. Every controller parses `workspaceId` before queries execute.
- **Role-Based Access Control (RBAC)**: Standardized `requireWorkspaceAccess` intercepts handle 401/403/404 scenarios securely.
- **AI Classification**: `claude.ts` performs JSON-schema bounded text processing. Failures are captured, isolating ingestion pipelines gracefully.
- **Semantic Ask Loop**: Integrated Vector Distance retrieval natively powered by pgvector boundaries fetching Nearest-Neighbor relationships seamlessly into Claude context.
- **Voice-of-Customer Reporting**: Chronological batch aggregates computed deterministically on the Postgres layer and passed to Claude for robust summarization.

### Local Setup & Prerequisites
Ensure `.env` includes `DATABASE_URL`, `NEXTAUTH_SECRET`, `ANTHROPIC_API_KEY` and `OPENAI_API_KEY` matching `.env.example`.
```bash
cd backend
npx prisma generate
npx prisma db push
npx prisma db seed
```
*(The seed command deterministicly loads realistic demo payloads into PostgreSQL without duplication)*

### Deployment Architecture Requirements
- Requires active `POSTGRES_URL` bindings.
- Target remote SQL database **MUST** have the `pgvector` extension installed (`CREATE EXTENSION vector;`).
- Refer to your hosting provider (e.g. Supabase, Neon) for vector module availability.
