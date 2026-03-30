# Chat-Service Plan Execution Review

Date: 2026-03-29

## Decision Log
- Redis is deferred for now.
- Session storage remains in-memory (`Map`) for the current iteration.
- Rationale: move fast on retrieval correctness and observability first.
- Risk accepted: session loss on restart and weak multi-instance consistency.

## What Was Implemented
- Gap 2 (partial): Added explicit REST handlers for key teacher/warden intents in retrieval layer.
- Gap 3 (improved): Added startup intent coverage validator wired to a compile-time `IntentType` coverage map.
- Gap 4 (partial): API now returns `meta` block from chat pipeline.
- Gap 4 (improved): `meta.wasTrimmed` now uses actual prompt-builder output.
- Gap 5 (partial): Added context-budget utility and integrated trimming in context prompt builder.

## Review Findings (Ordered by Severity)

### 1) Coverage validator can give false confidence (Resolved)
- File: `src/validators/coverage.validator.ts`
- File: `src/services/retrieval.service.ts`
- Previous issue: Coverage checked a manually maintained string set.
- Resolution: Replaced with compile-time `Record<IntentType, true>` coverage map and validator now checks that map.

### 2) Context budget enforcement is incomplete (High)
- File: `src/services/prompts/context.prompt.ts`
- Issue: Budget currently trims only structured data + semantic chunks. Conversation memory and recent turns are still unbounded and can exceed model limits.
- Impact: Large conversations may still overflow prompt/token limits.
- Fix direction: budget should account for all prompt sections (memory summary, recent turns, structured data, semantic chunks) with deterministic prioritization.

### 3) `wasTrimmed` meta is always false (Medium)
- File: `src/services/rag.service.ts`
- Previous issue: `meta.wasTrimmed` was hardcoded.
- Resolution: Prompt builder now returns `{ prompt, wasTrimmed }`, and RAG service propagates this to response meta.

### 4) Unused import (Resolved)
- File: `src/validators/coverage.validator.ts`
- Resolution: Removed unused import.

## No-Redis Path (Accepted for this Iteration)
- Keep in-memory sessions and proceed.
- Add explicit note in docs and release notes:
  - sessions reset on restart,
  - no cross-instance session continuity.
- Redis implementation remains planned for the next hardening pass.

## Recommended Next Implementation Steps
1. Complete context budgeting across the full prompt payload.
2. Continue without Redis for now, then add Redis in hardening phase.
