# AI Customer Feedback Intelligence Platform (Project LOOP)

Project LOOP is an AI-powered full-stack SaaS application designed to capture, consolidate, analyze, and synthesize customer feedback from multiple channels using advanced natural language processing, semantic search, and intelligence workflows.

---

## 👥 Meet the Team

* **Aman Kumar Yadav (@yadavaman05)** - Repository
*  & Tech Lead (AI Services & Integrations)
* **Abhiudaya Pratap Singh (@Abhi2005-abhi)** - Full-Stack Developer (Backend Services & DB Architecture)
* **Priyam Rai (@Priyam2773)** - Frontend Developer (Client Web Application & UI/UX)

---

## 📁 Repository Structure

The project uses a monorepo structure to keep backend services, frontend applications, and AI pipelines unified and easy to manage:

* **/client** - Next.js or Vite React web app containing dashboard, feedback forms, and analytics.
* **/backend** - Backend business logic, API endpoints (Node.js/Express or Python/FastAPI), auth, and database integration.
* **/ai_service** - Python services for LLM processing, sentiment analysis, semantic embedding search, and agentic workflows.
* **/docs** - API specs, database designs, architecture diagrams, and guidelines.

---

## 🚀 Git Development Workflow

This repository uses a structured Git Flow Lite workflow:

* **`main`** - Contains production-ready, stable, and tested code. Direct commits to `main` are restricted.
* **`develop`** - The primary integration branch where features are merged for testing before release.
* **`feature/*`** - Dedicated branches for individual modules:
  * `feature/frontend` (Priyam Rai)
  * `feature/backend` (Abhiudaya Pratap Singh)
  * `feature/ai` (Aman Kumar Yadav)

All changes are integrated via Pull Requests (PRs) submitted to the `develop` branch, reviewed by peers, and verified.
