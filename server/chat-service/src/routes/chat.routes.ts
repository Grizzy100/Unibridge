// server/chat-service/src/routes/chat.routes.ts
import { Router } from "express";
import { handleChat } from "../controllers/chat.controller.js";
import { syncToChroma } from "../services/sync.service.js";
import { optionalAuth, requireAdmin } from "../middleware/auth.middleware.js";
import { chatRateLimit } from "../middleware/rateLimit.middleware.js";

export const chatRouter = Router();

// POST /chat — main chatbot endpoint
// optionalAuth: authenticated users get identity-aware RAG, anonymous get public knowledge only
// chatRateLimit: 20 messages/minute per user to prevent API quota abuse
chatRouter.post("/", optionalAuth, chatRateLimit, handleChat);

// POST /chat/sync — manually trigger a DB → ChromaDB sync (admin only)
chatRouter.post("/sync", requireAdmin, async (_req, res) => {
    try {
        await syncToChroma();
        return res.json({ ok: true, message: "Sync complete." });
    } catch (err) {
        console.error("[chat/sync] Sync failed:", err);
        return res.status(500).json({ ok: false, error: "Sync failed." });
    }
});
