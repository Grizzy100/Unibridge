<div align="center">

### 🎓

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
┌────────────────────────────────────────────────────────────────┐
│                        Next.js Client                           │
│              (App Router · React · Tailwind CSS)                │
└────────────────────┬───────────────────────────────────────────┘
                     │  REST
        ┌────────────┼─────────────┬──────────────┬──────────────┐
        │            │             │              │              │
  ┌─────▼──────┐ ┌───▼───────┐ ┌──▼──────────┐ ┌▼───────────┐ ┌▼───────────┐
  │  user-     │ │attendance-│ │  outpass-   │ │assignment- │ │   mail-    │
  │  service   │ │  service  │ │   service   │ │  service   │ │  service   │
  │            │ │           │ │             │ │            │ │            │
  │ Students   │ │ QR gen    │ │ Approval    │ │ Deadlines  │ │ Categorized│
  │ Faculty    │ │ 30s cycle │ │ workflow    │ │ Submissions│ │ academic   │
  │ Parents    │ │ Eligibility│ │ S→P→W chain│ │ Notifs     │ │ mailing    │
  │ Wardens    │ │ validation │ │ Cross-svc  │ │            │ │            │
  └─────┬──────┘ └───┬───────┘ └──┬──────────┘ └┬───────────┘ └┬───────────┘
        │            │             │              │              │
        └────────────┴──────┬──────┴──────────────┴──────────────┘
                            │
                 ┌──────────▼──────────────┐
                 │       RabbitMQ           │
                 │  Async event messaging   │
                 │                          │
                 │  outpass.approved ──────► attendance blocked    │
                 │  attendance.low ────────► parent notification   │
                 │  assignment.created ────► student alert         │
                 └──────────────────────────┘
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

**Solution:** The attendance service calls the outpass service at mark-time to validate eligibility. State changes propagate asynchronously via RabbitMQ events — keeping services independently deployable while maintaining system-wide consistency.

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

This starts RabbitMQ, all backend microservices, and the development environment.

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
| ⚡ **Redis Caching** | Session caching, QR token store, attendance summary cache |
| 🌐 **API Gateway** | Centralised auth, routing, rate limiting |
| 🔗 **GraphQL Federation** | Unified schema across services for the frontend |
| ☁️ **AWS Deployment** | Production-grade cloud infrastructure |
| 🛑 **Circuit Breakers** | Prevent cascading failures during service outages |
| 📊 **Observability** | Centralised logging + distributed tracing |
| 🐳 **Kubernetes** | Container orchestration for production scale |

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

🎓 Built as a deep exploration of distributed systems and microservice architecture.

⭐ If this helped you think differently about campus infrastructure, consider starring the repo!

</div>
