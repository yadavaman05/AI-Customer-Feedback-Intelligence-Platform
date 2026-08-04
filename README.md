# AI Customer Feedback Intelligence Platform (Project LOOP)

Project LOOP is an AI-powered full-stack SaaS application designed to capture, consolidate, analyze, and synthesize customer feedback from multiple channels using advanced natural language processing, semantic search, and intelligence workflows.

---

## 👥 Team Structure

### Member 1 — Abhiudaya Pratap Singh (@Abhi2005-abhi)
**Role:** Backend & AI Lead
**Responsibilities:**
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

### Member 2 — Priyam Rai (@Priyam2773)
**Role:** Frontend Lead
**Responsibilities:**
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

### Member 3 — Aman Kumar Yadav (@yadavaman05)
**Role:** Full-Stack / Integration Lead
**Responsibilities:**
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
* `develop` → Team integration branch (all completed features are integrated here)
* `feature/backend-ai` → Abhiudaya's feature branch
* `feature/frontend` → Priyam's feature branch
* `feature/integration` → Aman's feature branch

---

## 🔄 Team Git Workflow

1. Pull the latest `develop` branch before starting.
2. Switch and work only on your assigned feature branch.
3. Commit changes with meaningful, structured commit messages.
4. Push your feature branch to the remote repository.
5. Create a Pull Request (PR) on GitHub.
6. The target branch for the PR **must be `develop`**.
7. Other team members review and test the changes.
8. Merge the PR into `develop`.
9. Perform integration testing on the combined code.
10. After the complete project is stable, create a final PR from `develop` to `main`.

### Setup & Sync Commands

```bash
# Get the latest integration updates
git checkout develop
git pull origin develop
```

#### For Abhiudaya (`feature/backend-ai`):
```bash
git checkout feature/backend-ai
git merge develop
```

#### For Priyam (`feature/frontend`):
```bash
git checkout feature/frontend
git merge develop
```

#### For Aman (`feature/integration`):
```bash
git checkout feature/integration
git merge develop
```

### Committing & Pushing Work
```bash
git add .
git commit -m "feat: describe your change"
git push origin <your-branch-name>
```

---

## 🛠️ Approved Technology Stack

* **Frontend & Framework**: Next.js 14 (App Router)
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

## 🔒 Security

* **No Secrets in Git**: Never commit `.env` files or hardcode API keys.
* **Backend Security**: Never expose Claude API keys or DB credentials in frontend client code.
* **Environment variables**: Use `.env.example` with placeholder values for setup.
* **Server-side RBAC**: Enforce Role-Based Access Control on the server (never rely solely on hiding frontend elements).
* **Multi-Tenant Data Isolation**: Every database query must be scoped by the authenticated `workspaceId`.

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
