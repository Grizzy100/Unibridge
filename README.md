<div align="center">

### 🎓 Unibridge

**A distributed campus infrastructure platform that unifies academic workflows scattered across disconnected institutional systems.**

<br/>

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)](https://www.rabbitmq.com)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com)
[![Google Gemini](https://img.shields.io/badge/Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![ChromaDB](https://img.shields.io/badge/ChromaDB-FF6B35?style=for-the-badge&logo=databricks&logoColor=white)](https://www.trychroma.com)

</div>

---

## 🎯 The Problem

My university ran on five separate systems that never talked to each other.

| System | Purpose | Problem |
|---|---|---|
| LMS | Assignments & deadlines | Poor visibility, weak notifications |
| Outlook | Communication | No academic structure or threading |
| CAMU | Student profiles | Isolated, no integration |
| Manual sheets | Attendance | Proxy-prone, no enforcement |
| Email chains | Outpass approvals | No workflow, no policy enforcement |

The friction wasn't the tools — it was the **gaps between them**. Unibridge was built to close those gaps.

---

## 🏗️ System Architecture
```
┌────────────────────────────────────────────────────────────────────────┐
│                            Next.js Client                               │
│                  (App Router · React · Tailwind CSS)                    │
└──────────────────────────────┬─────────────────────────────────────────┘
                               │  REST
        ┌──────────┬───────────┼───────────┬───────────┬──────────────┐
        │          │           │           │           │              │
  ┌─────▼────┐ ┌───▼──────┐ ┌─▼────────┐ ┌▼─────────┐ ┌▼─────────┐ ┌▼──────────┐
  │  user-   │ │attend-   │ │ outpass- │ │  task-   │ │  mail-   │ │  chat-    │
  │ service  │ │ance-svc  │ │ service  │ │ service  │ │ service  │ │ service   │
  │          │ │          │ │          │ │          │ │          │ │           │
  │Students  │ │QR gen    │ │Approval  │ │Deadlines │ │Categor-  │ │RAG + LLM  │
  │Faculty   │ │30s cycle │ │workflow  │ │Submiss-  │ │ized      │ │Hybrid     │
  │Parents   │ │Eligib-   │ │S→P→W     │ │ions      │ │academic  │ │retrieval  │
  │Wardens   │ │ility     │ │chain     │ │Notifs    │ │mailing   │ │Intent-    │
  └─────┬────┘ └───┬──────┘ └─┬────────┘ └┬─────────┘ └┬─────────┘ │aware      │
        │          │           │           │            │            └┬──────────┘
        └──────────┴─────┬─────┴───────────┴────────────┘            │
                         │                                            │
            ┌────────────▼──────────────┐           ┌────────────────▼──────────┐
            │         RabbitMQ          │           │         ChromaDB           │
            │   Async event messaging   │           │        Vector store        │
            │                           │           │     Semantic retrieval     │
            │  outpass.approved ───────►│           │   Knowledge + DB sync      │
            │    attendance blocked     │           └───────────────────────────┘
            │  attendance.low ─────────►│
            │    parent notification    │
            │  assignment.created ─────►│
            │    student alert          │
            └───────────────────────────┘
```

**Database-per-service isolation** — each service owns its own PostgreSQL schema on NeonDB. Services communicate via **synchronous REST** for direct queries and **RabbitMQ events** for side effects that cross domain boundaries.

---

## ⭐ Core Features

### 📷 Anti-Proxy QR Attendance

Static QR codes are trivially shareable. Unibridge generates a **new QR code every 30 seconds**, making proxy attendance functionally impossible without physical presence.
```
Teacher starts session
        │
        ▼
QR Code generated (valid 30s)
        │
        ├─► Student scans ──► Eligibility check
        │                           │
        │              ┌────────────┴──────────────┐
        │              │                           │
        │        Outpass ACTIVE?              Attendance valid?
        │              │                           │
        │         ✗ BLOCKED                   ✓ MARKED
        │
        └─► QR expires → New QR generated → Repeat
```

Attendance eligibility is validated **cross-service**: the attendance service queries outpass state before allowing a mark — enforcing institutional policy at the system level, not through manual checks.

---

### 📉 Academic Risk Detection & Escalation

Attendance is monitored continuously. The system **proactively escalates** as thresholds are crossed:

| Threshold | Action | Channel |
|---|---|---|
| < 75% | Student alert | In-app notification |
| < 60% | Parent notification | Automated email |
```
Attendance recorded
        │
        ▼
Risk engine evaluates percentage
        │
        ├── < 75% ──► [EVENT: attendance.warning]
        │                    │
        │                    └──► Notification service ──► Student alert
        │
        └── < 60% ──► [EVENT: attendance.critical]
                             │
                             └──► Notification service ──► Parent email (RabbitMQ)
```

This transforms attendance from a passive record into a **proactive academic risk management system**.

---

### 🚪 Multi-Level Outpass Approval Workflow

Outpass requests follow a real-world institutional hierarchy enforced at the system level:
```
Student submits request
        │
        ▼
  [PENDING_PARENT]
        │
        ▼ Parent approves
  [PENDING_WARDEN]
        │
        ▼ Warden approves
    [APPROVED] ──► [EVENT: outpass.approved]
                          │
                          └──► Attendance service ──► Student blocked from marking
```

Each approval stage is a domain event. An approved outpass **automatically propagates** to the attendance service via RabbitMQ — the student cannot mark attendance while on an active outpass, without any manual intervention.

---

### 📚 Assignment Lifecycle Management

Teachers create assignments with deadlines. Students receive timely notifications and submit work through the platform.

Designed to solve poor deadline visibility — a personal frustration with traditional LMS platforms. Academic responsibilities are surfaced clearly, never buried in cluttered interfaces.

---

### ✉️ Structured Academic Mailing

Instead of an inbox that mixes academic and non-academic messages, Unibridge introduces **categorized academic mailing** — structured threading between students, faculty, and administration.

Designing the mail model required rethinking traditional email ownership:

> Who owns a mail thread? Who has visibility? How are participants modeled?

Multiple iterations were needed before arriving at a model that correctly separates **ownership, participation, threading, and visibility** — revealing how deceptively simple communication systems hide deep architectural complexity.

---

### 🤖 RAG Chat Service

A university-aware conversational assistant powered by **Gemini + ChromaDB**, with hybrid retrieval routing and role-aware identity context. Every query goes through intent classification before any data is fetched — ensuring the right retrieval strategy is used for the right question.

#### Executive Summary

- Full end-to-end chat pipeline is live: intent classification → retrieval routing → context assembly → response generation, all in a single `POST /chat` request.
- Retrieval is **hybrid by design**: ChromaDB for semantic search over knowledge and synced DB content; Neon/Postgres and service REST APIs for structured live data — routed per classified intent.
- Gemini handles both **intent classification** (structured JSON output) and **final answer generation**, with validated fallback defaults if classification fails.
- Session memory uses a **recent-turns + rolling summary** model, giving the assistant conversational continuity within a session.
- **Role-aware access**: authenticated users get identity-loaded context; anonymous users get limited but functional responses.
- **Startup data ingestion** automatically populates ChromaDB from local knowledge files and periodic DB sync — zero manual seeding required after deploy.
- The service is **Dockerized**, health-check instrumented, rate-limited, and integrated into the shared platform network.

#### API Surface

| Endpoint | Access | Purpose |
|---|---|---|
| `POST /chat` | Public / JWT optional | Main conversational endpoint |
| `POST /chat/sync` | Admin only | Manual DB-to-Chroma re-sync trigger |
| `GET /health` | Public | Chroma connectivity check; degrades gracefully |

#### Chat Pipeline
```
Request
   │
   ├─ Session load / init
   ├─ Identity load (if authenticated)
   ├─ Intent classification via Gemini → structured JSON
   ├─ Intent validation + fallback defaults
   ├─ Retrieval routing by classified strategy
   ├─ Context prompt construction
   ├─ Response generation via Gemini
   └─ Session memory update (turns + summary)
```

#### Retrieval Strategies

| Strategy | When Used |
|---|---|
| `identity-only` | Query is purely about the requesting user |
| `skip` | No retrieval needed (meta / chit-chat) |
| `chroma-only` | Semantic search over knowledge / synced collections |
| `neon-only` | Direct structured DB query |
| `rest-api` | Live data from a platform service (e.g. outpass status) |
| `hybrid` | Combines Chroma semantic + structured source |
| Hard fallback | Classified strategy has no registered handler |

All retrieval calls are wrapped with **timeout protection**. A handler coverage map is validated at startup — misconfigured intent routing surfaces at boot, not at runtime.

#### RAG Data Ingestion & Sync

- On startup: ingests local `.md` / `.txt` knowledge files into Chroma using paragraph chunking; upserts are idempotent.
- On startup + periodic interval: syncs platform DB tables into Chroma collections.
- Mapper layer deliberately **excludes sensitive/private fields** from vector embeddings.

#### Session & Memory

- In-memory session store with TTL-based expiry and cleanup.
- Memory model: recent turn buffer + rolling compressed summary.
- Meta signals returned in every response: intent, retrieval strategy used, chunk count, fallback triggered, trim applied.

#### Prompting & Safety

- Prompt includes: system rules, session memory, classified intent, structured data context, semantic chunks, and explicit answering constraints.
- **No-guess enforcement**: low-context situations return an honest "I don't have enough information" rather than hallucinated answers.
- Context budget trimming is in place to avoid exceeding model limits.

#### Known Limitations

- **Session store is in-memory only.** Restarting the service resets all active sessions. Multi-instance deployments have no session affinity. Redis persistence is planned.
- **Context budget trimming is partial.** Each prompt section is trimmed individually but there is no single holistic enforcer across all sections simultaneously.
- **No persistent chat history.** Conversation turns live only for the TTL of the session — no user-visible history or cross-session recall.
- **Sync is eventually consistent.** The DB-to-Chroma sync runs on a polling interval; freshly created platform data may not be reflected in semantic search immediately.
- **Single Gemini model for both tasks.** Intent classification and answer generation both consume Gemini quota. Splitting to a lighter classification model is a future optimization.
- **No automated test coverage yet.** The pipeline has been manually validated but lacks integration tests across retrieval strategies and intent types.

#### Next Steps

**P0 — Correctness & Hardening**
- Holistic token budget enforcement across the full assembled prompt
- Idempotency and deduplication guarantees on the DB sync path
- Structured error responses from the chat endpoint
- Logging standardization: intent, strategy, latency, and fallback signals per request

**P1 — Capability & Reliability**
- Redis-backed session store for persistence and multi-instance support
- Persistent chat history per user (DB-backed, surfaced in client)
- Streaming response support via SSE for improved perceived latency
- Split intent classification onto a lighter/faster model

**P2 — Scale & Observability**
- Distributed tracing across the full retrieval pipeline
- Event-driven Chroma invalidation via RabbitMQ instead of polling
- Conversation analytics: intent distribution, fallback rate, retrieval hit rate
- Admin dashboard for sync status, session counts, and rate limit metrics

#### Validation / Test Checklist

| Area | Test Case |
|---|---|
| Intent classification | Known intents return correct strategy; malformed Gemini output falls back cleanly |
| Retrieval routing | Each of the 7 strategies is exercised and returns expected context shape |
| Unauthenticated flow | Anonymous request completes with reduced but valid context |
| Authenticated flow | JWT user gets identity-loaded response referencing their own data |
| Fallback enforcement | Low-context query returns refusal, not a hallucinated answer |
| Rate limiting | N+1 request within window returns 429 |
| Health check | `GET /health` returns degraded when Chroma is unreachable |
| Sync idempotency | Running `/chat/sync` twice does not duplicate Chroma documents |
| Session TTL | Session expires and is cleaned up after TTL window |
| Context trimming | Long conversation history does not cause prompt to exceed model token limit |

---

## 🛠️ Tech Stack

### Backend (all services)

| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM) |
| Framework | Express |
| Language | TypeScript |
| ORM | Prisma ORM |
| Database | PostgreSQL (NeonDB) |
| Messaging | RabbitMQ |
| Media Storage | Cloudinary |

### Chat Service (additional)

| Layer | Technology |
|---|---|
| LLM | Google Gemini |
| Vector Store | ChromaDB |
| Retrieval | Hybrid (semantic + structured + REST) |

### Frontend

| Technology | Role |
|---|---|
| Next.js | App Router framework |
| React | UI layer |
| Tailwind CSS | Styling |

### Infrastructure

| Tool | Purpose |
|---|---|
| Docker | Containerised services |
| NeonDB | Serverless PostgreSQL (per service) |
| RabbitMQ | Async inter-service event bus |

---

## ⚙️ Environment

The services now use a shared Redis connection string for rate limiting and BullMQ jobs.

Example values live in [/.env.example](.env.example).

Minimum Redis-related setting:

```bash
REDIS_URL=redis://localhost:6379
```

---

## ⚠️ Engineering Challenges Solved

### 🔄 Breaking ORM Upgrade Mid-Development

**Prisma v7** was released during active development, introducing breaking changes across every service simultaneously.

Required coordinated refactoring across:
- `schema.prisma` syntax changes
- Prisma configuration files
- `tsconfig.json` compatibility updates
- Client regeneration per service
- Dependency compatibility resolution

Since all five services depended on Prisma, the migration had to be sequenced carefully to avoid cascading failures.

> **Lesson:** Dependencies evolve — production systems must evolve with them. Treating a breaking upgrade as a maintenance exercise rather than a crisis is an engineering mindset, not just a skill.

---

### 🔗 Cross-Service Authorization

Ensuring attendance respected outpass state required services to **trust and validate each other's domain** without becoming tightly coupled.

The attendance service calls the outpass service at mark-time to validate eligibility. State changes propagate asynchronously via RabbitMQ events — keeping services independently deployable while maintaining system-wide consistency.

---

### 📨 Distributed Messaging with RabbitMQ

Moving from synchronous request-response to event-driven communication required a fundamentally different mental model.

Challenges encountered:
- Reasoning about **event ordering** across services
- Debugging **asynchronous failures** with no direct call stack
- Handling **duplicate events** and consumer idempotency
- Designing event schemas for **eventual consistency**

This was the first real exposure to distributed system behavior — and it changed how I approach backend design permanently.

---

### 📬 Mail System Modeling

The mail service was unexpectedly the most architecturally demanding feature.

A mail thread involves: an **owner**, multiple **participants**, **visibility rules**, **threading**, and **read state** — per participant. Each of these dimensions intersects in non-obvious ways.

Multiple data model iterations were needed before arriving at a structure that handled all combinations correctly. It revealed that apparently simple domains often hide the deepest design problems.

---

### 🧠 Hybrid RAG Architecture

Building the chat service surfaced a fundamental tension in RAG system design: **when to retrieve semantically vs. structurally vs. live from APIs**. A single retrieval approach breaks down quickly — semantic search can't reliably answer "what is my current attendance percentage", and structured DB queries can't answer open-domain knowledge questions.

The solution was an **intent-first routing layer**: Gemini classifies each query into an intent with an associated retrieval strategy before any data is fetched. This kept retrieval logic clean, testable, and extensible without coupling the LLM layer to any specific data source.

> **Lesson:** In systems that mix unstructured knowledge and live structured data, retrieval routing is the most important architectural decision — not the choice of embedding model or vector store.

---

### 🌐 Infrastructure-Level Debugging

NeonDB connectivity failed intermittently when accessing through a VPN — a reminder that backend systems are not isolated from environment-level network conditions.

> **Lesson:** Infrastructure debugging requires awareness beyond application code. Environment, network topology, and DNS resolution are all part of the system.

---

## 🚀 Running the Project

### Prerequisites

- Docker & Docker Compose
- Node.js LTS

### 1. Clone the repository
```bash
git clone <repository-url>
cd Unibridge
```

### 2. Start all services
```bash
docker-compose up --build
```

This starts RabbitMQ, ChromaDB, all backend microservices, and the development environment.

### 3. Start the frontend
```bash
cd client
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🔮 Roadmap

| Area | Planned Improvement |
|---|---|
| ⚡ **Redis Caching** | Session caching, QR token store, attendance summary cache, chat session persistence |
| 🌐 **API Gateway** | Centralised auth, routing, rate limiting |
| 🔗 **GraphQL Federation** | Unified schema across services for the frontend |
| ☁️ **AWS Deployment** | Production-grade cloud infrastructure |
| 🛑 **Circuit Breakers** | Prevent cascading failures during service outages |
| 📊 **Observability** | Centralised logging + distributed tracing (incl. RAG pipeline traces) |
| 🐳 **Kubernetes** | Container orchestration for production scale |
| 💬 **Chat Streaming** | SSE-based streaming responses for improved perceived latency |
| 🔔 **Event-Driven Sync** | RabbitMQ-triggered Chroma invalidation instead of polling |

---

## 🧠 Engineering Takeaway

> Building Unibridge was my entry point into distributed systems thinking.
>
> I stopped thinking in terms of **routes and controllers**, and started designing around **responsibilities, constraints, and domain boundaries**.
>
> The hardest part wasn't writing the code. It was deciding **where each piece of behaviour truly belongs** — and living with the consequences when that boundary was wrong.
>
> Strong systems are not defined by how many features they have,  
> but by **how well they handle real-world constraints.**

---

<div align="center">

🎓 Built as a deep exploration of distributed systems, microservice architecture, and applied RAG design.

⭐ If this helped you think differently about campus infrastructure, consider starring the repo!

</div>
