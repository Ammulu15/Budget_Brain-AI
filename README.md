# BudgetBrain AI

An AI-powered personal finance management platform that automatically tracks income, expenses, budgets, and savings goals — starting as a web app, with an Android companion app planned for automated expense capture via SMS/notification parsing.

> **Status: Early development.** This README describes the project's target architecture and will be updated to reflect exactly what has been built as each phase is completed.

## What it does (planned)

- Secure user authentication (JWT-based signup/login)
- Track income, expenses, budgets, and savings goals through a web dashboard
- Automated expense capture from payment SMS/notifications (Android app, with user permission) — no manual entry required
- AI-powered financial assistant that analyzes spending patterns, suggests budgets, and forecasts future expenses
- Visual dashboards showing spending trends, budget vs. actual, and goal progress

## Tech Stack

**Backend**
- Python
- FastAPI — REST API framework
- PostgreSQL — relational database
- SQLAlchemy — ORM
- JWT (python-jose) — authentication
- Passlib (bcrypt) — password hashing

**Frontend (Web)**
- To be added

**Mobile (Android)**
- Kotlin — planned, for on-device SMS/notification reading and syncing with the backend API

**AI**
- LLM integration (provider TBD) for spending analysis and budgeting recommendations

**Tooling**
- Git / GitHub
- Docker (planned, for deployment)

## Project Structure

```
budgetbrain-ai/
├── backend/
│   └── app/
│       ├── main.py
│       ├── core/          # config, security (JWT, hashing)
│       ├── db/            # database connection
│       ├── models/        # SQLAlchemy table definitions
│       ├── schemas/       # request/response data shapes
│       └── api/routes/    # API endpoints by feature
├── frontend/               # web dashboard (planned)
├── mobile/                 # Android app (planned)
└── README.md
```

## Setup

Setup instructions will be added as each part of the backend becomes runnable.

## Roadmap

- [x] Project scaffolding
- [ ] PostgreSQL connection + user model
- [ ] JWT authentication (signup/login)
- [ ] Transaction, budget, and goal models + CRUD APIs
- [ ] Dashboard summary endpoints
- [ ] AI financial assistant integration
- [ ] Web frontend
- [ ] Android app (SMS-based expense ingestion)
- [ ] Dockerize and deploy

## Author

Built as a portfolio project to demonstrate backend engineering skills: API design, authentication, database modeling, and AI integration.
