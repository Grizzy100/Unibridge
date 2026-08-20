// server/chat-service/src/controllers/chat.controller.ts
import type { Request, Response } from "express";
import { chat } from "../services/rag.service.js";

export async function handleChat(req: Request, res: Response): Promise<Response> {
    const message = req.body?.message;

    if (!message || typeof message !== "string" || !message.trim()) {
        return res.status(400).json({ error: "A non-empty 'message' string is required." });
    }

    const user = (req as any).user as { id: string; role: string } | undefined;
    const sessionId = user?.id ?? (req.body?.sessionId as string | undefined) ?? "anonymous";
    const role = user?.role ?? "DEFAULT";

    // Extract JWT from Authorization header to pass to retrieval service for REST API calls
    const authHeader = req.headers.authorization;
    const jwt = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

    try {
        const result = await chat(message.trim(), sessionId, role, user?.id ?? "anonymous", jwt);
        return res.json(result);
    } catch (err) {
        console.error("[chat] Unexpected error:", err);
        return res.status(500).json({ error: "Something went wrong. Please try again." });
    }
}


//entry point. Organises the input, retrieves yhe JWT etc
