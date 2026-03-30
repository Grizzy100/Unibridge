import "dotenv/config";
import express from "express";
import cors from "cors";
import { chatRouter } from "./routes/chat.routes.js";
import { heartbeat } from "./services/chroma.service.js";
import { syncToChroma } from "./services/sync.service.js";
import { ingestKnowledgeBase } from "./services/knowledge.service.js";
import { cleanupStaleSessions } from "./services/session.service.js";
import { validateIntentCoverage } from "./validators/coverage.validator.js";
import { INTENT_HANDLER_COVERAGE } from "./services/retrieval.service.js";

const app = express();
const PORT = Number(process.env.PORT ?? 3006);
const SYNC_INTERVAL_MS = Number(process.env.SYNC_INTERVAL_MS ?? 600_000); // 10 min

app.use(cors());
app.use(express.json());
app.use("/chat", chatRouter);

// Health check — verifies ChromaDB is reachable
app.get("/health", async (_req, res) => {
  try {
    await heartbeat();
    res.json({ status: "ok", service: "chat-service" });
  } catch {
    res.status(503).json({ status: "degraded", reason: "ChromaDB unreachable" });
  }
});

async function bootstrap(): Promise<void> {
  // Gap 3: Validate Intent Coverage before taking traffic
  validateIntentCoverage(INTENT_HANDLER_COVERAGE);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[chat-service] Running on port ${PORT} (0.0.0.0)`);
  });

  // Ingest static knowledge files into ChromaDB on startup
  try {
    await ingestKnowledgeBase();
  } catch (err) {
    console.error("[chat-service] Knowledge ingestion failed:", err);
  }

  // Sync database rows into ChromaDB on startup
  try {
    await syncToChroma();
  } catch (err) {
    console.error("[chat-service] Initial DB sync failed:", err);
  }

  // Periodic DB sync every SYNC_INTERVAL_MS
  setInterval(async () => {
    try {
      await syncToChroma();
    } catch (err) {
      console.error("[chat-service] Periodic sync failed:", err);
    }
  }, SYNC_INTERVAL_MS);

  // Clean up expired sessions every 10 minutes
  setInterval(cleanupStaleSessions, 10 * 60 * 1000);
}

void bootstrap();
