// Reads all .md / .txt files from the knowledge/ folder,
// chunks them by paragraph, and upserts them into ChromaDB.
// Safe to call on every startup — upsert is idempotent.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getCollection } from "./chroma.service.js";

const KNOWLEDGE_DIR = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../knowledge"
);

const COLLECTION_NAME = "knowledge_base";

// Split markdown into paragraphs (double newline = paragraph boundary).
// Filters out headings and very short fragments that embed poorly.
function chunkIntoParagraphs(content: string, filename: string) {
    return content
        .split(/\n\n+/)
        .map((p) => p.trim())
        .filter((p) => p.length > 20) // preserve almost everything
        .map((text, index) => ({
            id: `${filename}_p${index}`,
            text,
            metadata: { source: filename },
        }));
}

export async function ingestKnowledgeBase(): Promise<void> {
    if (!fs.existsSync(KNOWLEDGE_DIR)) {
        console.log("[knowledge] No knowledge/ folder found — skipping.");
        return;
    }

    const files = fs
        .readdirSync(KNOWLEDGE_DIR)
        .filter((f) => f.endsWith(".md") || f.endsWith(".txt"));

    if (files.length === 0) {
        console.log("[knowledge] No files found in knowledge/ — skipping.");
        return;
    }

    const collection = await getCollection(COLLECTION_NAME);

    const ids: string[] = [];
    const documents: string[] = [];
    const metadatas: Record<string, string>[] = [];

    for (const file of files) {
        const content = fs.readFileSync(path.join(KNOWLEDGE_DIR, file), "utf-8");
        const chunks = chunkIntoParagraphs(content, file);

        for (const chunk of chunks) {
            ids.push(chunk.id);
            documents.push(chunk.text);
            metadatas.push(chunk.metadata);
        }

        console.log(`[knowledge] "${file}": ${chunks.length} chunk(s)`);
    }

    // Upsert in batches of 50 to avoid API rate limits
    const BATCH_SIZE = 50;
    for (let i = 0; i < ids.length; i += BATCH_SIZE) {
        await collection.upsert({
            ids: ids.slice(i, i + BATCH_SIZE),
            documents: documents.slice(i, i + BATCH_SIZE),
            metadatas: metadatas.slice(i, i + BATCH_SIZE),
        });
    }

    console.log(`[knowledge] Done — ${ids.length} chunks in "${COLLECTION_NAME}".`);
}
