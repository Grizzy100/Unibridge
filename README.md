# Unibridge

Unibridge is a distributed campus infrastructure platform built as my first serious exploration into microservice architecture.

My university relied on multiple disconnected systems — LMS for assignments, Outlook for communication, CAMU for student profiles, separate tools for attendance tracking, and manual workflows for outpass approvals. While each system worked independently, using them together created constant friction. Important academic information was scattered, communication lacked structure, attendance enforcement required manual intervention, and navigating between platforms became part of the daily overhead for students and faculty.

I built Unibridge to unify these workflows into a single platform while learning how real-world distributed systems are designed, structured, and maintained.

More importantly, this project marked a shift in my engineering mindset — from focusing on building features to thinking deeply about **service boundaries, system behavior, and domain-driven design.**

---

## Tech Stack

### Backend
- Node.js  
- Express  
- TypeScript  
- Prisma ORM  

### Database
- PostgreSQL (NeonDB)

### Messaging
- RabbitMQ for event-driven communication between services

### Frontend
- Next.js  
- React  
- Tailwind CSS  

### DevOps & Infrastructure
- Docker for containerized services  
- Cloudinary for media storage  

The system follows a **database-per-service architecture**, allowing each service to manage its own persistence layer while communicating through asynchronous messaging when required. This approach reduces coupling and creates a foundation for future scalability.

---

## Features

### Unified Academic Ecosystem
Unibridge consolidates critical academic workflows — assignments, attendance, approvals, notifications, and communication — into a cohesive platform. The objective was not just convenience, but reducing operational fragmentation that often exists within institutional software environments.

---

### Intelligent Attendance System
Attendance is enforced through dynamically generated QR codes that refresh every **30 seconds**, significantly reducing the possibility of proxy attendance.

The system goes beyond simple presence tracking by validating student eligibility before marking attendance.

For example:

- Students with an **approved outpass are automatically blocked** from marking attendance.
- Authorization is validated across services, ensuring institutional policies are enforced at the system level rather than relying on manual checks.

---

### Academic Risk Detection & Escalation
Unibridge actively monitors attendance patterns and introduces automated escalation policies:

- Students receive alerts when attendance drops below **75%**, helping them take corrective action early.
- When attendance falls below **60%**, the system automatically sends notification emails to parents.

This transforms attendance from a passive reporting mechanism into a proactive academic risk management system.

---

### Multi-Level Outpass Approval Workflow
Outpass requests follow a structured real-world hierarchy:

**Student → Parent → Warden**

Each approval stage directly impacts attendance eligibility, ensuring that permissions propagate correctly across services.

Designing this workflow required careful consideration of cross-service authorization and state synchronization.

---

### Assignment Lifecycle Management
Teachers can create assignments, define deadlines, and manage submissions while students receive timely notifications.

This feature was inspired by the poor deadline visibility I personally experienced with traditional LMS platforms.

The goal was clarity — ensuring academic responsibilities are never hidden behind weak interfaces.

---

### Structured Academic Mailing System
Instead of relying on conventional inbox models that mix academic and non-academic messages, Unibridge introduces categorized mailing.

This improves communication clarity while reducing cognitive overload for students and faculty.

Designing this required rethinking traditional email relationships and modeling participants carefully within the system.

---

## Problems Faced

Building Unibridge introduced several real-world engineering challenges that extended far beyond writing APIs.

---

### Breaking ORM Upgrade During Development

One of the most disruptive challenges occurred when **Prisma v7 was released mid-development.**

The upgrade introduced breaking changes that required immediate refactoring across multiple layers of the backend.

This included:

- Updating the `schema.prisma`
- Modifying Prisma configuration
- Adjusting the `tsconfig.json`
- Regenerating the client
- Resolving compatibility issues across services

Since multiple microservices depended on Prisma, the migration demanded careful coordination to avoid cascading failures.

This experience reinforced an important engineering lesson:

> Dependencies evolve — production systems must evolve with them.

Rather than treating it as a setback, it became a hands-on lesson in maintaining backend infrastructure under shifting technical constraints.

---

### Cross-Service Authorization Complexity
Ensuring that attendance respected outpass approvals required services to trust and validate each other's state without becoming tightly coupled.

Designing this interaction pushed me to think beyond isolated APIs and toward system-wide consistency.

---

### Distributed Messaging Challenges
Implementing RabbitMQ fundamentally changed how I approached backend development.

Instead of relying purely on synchronous request-response cycles, I had to reason about:

- event flow  
- asynchronous debugging  
- service coordination  
- eventual consistency  

This was my first real exposure to distributed system behavior.

---

### Mail System Modeling
Designing the mail service was unexpectedly complex.

Understanding the distinction between **mail ownership, participants, threading, and visibility** required multiple iterations before arriving at a scalable structure.

It highlighted how deceptively simple systems often hide deep architectural considerations.

---

### Infrastructure-Level Debugging
While working with NeonDB, I encountered connectivity failures when using a VPN — a small but meaningful reminder that backend systems are heavily influenced by environment-level conditions.

This strengthened my awareness of infrastructure dependencies beyond application code.

---

## The Process & What I Learned

Unibridge was my first deep dive into distributed architecture, and it fundamentally reshaped how I think about engineering.

I transitioned from thinking in terms of routes and controllers to designing systems around responsibilities and constraints.

Key lessons included:

- Designing clear service boundaries  
- Structuring production-style backends  
- Thinking in workflows rather than endpoints  
- Managing asynchronous communication  
- Enforcing domain rules across services  
- Coordinating independent services without tight coupling  

Most importantly, I learned that:

> Strong systems are not defined by how many features they have, but by how well they handle real-world constraints.

---

## Improvements

Unibridge is still evolving, with several enhancements planned to push it closer toward production-grade infrastructure:

- Redis for caching  
- API Gateway for centralized routing  
- GraphQL federation  
- AWS deployment  
- Rate limiting  
- Observability and centralized logging  
- Circuit breakers  
- Kubernetes for orchestration  

The long-term goal is to mature this platform into something that mirrors real-world distributed environments.

---

## Running the Project

```bash
git clone <repository-url>
docker-compose up --build
