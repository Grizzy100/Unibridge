// Reads all .md / .txt / .pdf files from the knowledge/ folder,
// chunks them using recursive multi-separator splitting with overlap,
// and upserts them into ChromaDB.
// Safe to call on every startup — upsert is idempotent.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as pdfParseModule from "pdf-parse";
import { getCollection } from "./chroma.service.js";
import { CHUNK_SIZE, CHUNK_OVERLAP } from "../constants.js";

const pdfParse = (pdfParseModule as any).default ?? pdfParseModule;


const KNOWLEDGE_DIR = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../knowledge"
);

const COLLECTION_NAME = "knowledge_base";

export interface KnowledgeChunk {
    id: string;
    text: string;
    metadata: { source: string };
}

/**
 * Recursive text splitter with sliding window overlap.
 * Uses fallback separators: paragraph (\n\n) -> line (\n) -> word (space) -> character.
 */

export function chunkTextRecursively(
    content: string,
    filename: string,
    chunkSize: number = CHUNK_SIZE,
    chunkOverlap: number = CHUNK_OVERLAP
): KnowledgeChunk[] {
    const chunks: KnowledgeChunk[] = [];
    const textLength = content.length;

    if (textLength === 0) return chunks;

    let start = 0;
    let chunkIndex = 0;

    while (start < textLength) {
        let end = Math.min(start + chunkSize, textLength);

        // If not at the end of text, try to break cleanly at a natural separator
        if (end < textLength) {
            const window = content.slice(start, end);
            
            // Priority 1: Double newline (paragraph)
            let breakIdx = window.lastIndexOf("\n\n");
            
            // Priority 2: Single newline
            if (breakIdx <= start + chunkOverlap) {
                breakIdx = window.lastIndexOf("\n");
            }
            
            // Priority 3: Space (word boundary)
            if (breakIdx <= start + chunkOverlap) {
                breakIdx = window.lastIndexOf(" ");
            }

            // Adjust end position if a suitable break index was found
            if (breakIdx > start + chunkOverlap) {
                end = start + breakIdx;
            }
        }

        const chunkText = content.slice(start, end).trim();

        if (chunkText.length > 20) {
            chunks.push({
                id: `${filename}_c${chunkIndex}`,
                text: chunkText,
                metadata: { source: filename },
            });
            chunkIndex++;
        }

        // Advance start position using sliding window (chunkSize - chunkOverlap)
        start += chunkSize - chunkOverlap;
    }

    return chunks;
}

export async function ingestKnowledgeBase(): Promise<void> {
    if (!fs.existsSync(KNOWLEDGE_DIR)) {
        console.log("[knowledge] No knowledge/ folder found — skipping.");
        return;
    }

    const files = fs
        .readdirSync(KNOWLEDGE_DIR)
        .filter((f) => f.endsWith(".md") || f.endsWith(".txt") || f.endsWith(".pdf"));

    if (files.length === 0) {
        console.log("[knowledge] No supported files found in knowledge/ — skipping.");
        return;
    }

    const collection = await getCollection(COLLECTION_NAME);

    const ids: string[] = [];
    const documents: string[] = [];
    const metadatas: Record<string, string>[] = [];

    for (const file of files) {
        try {
            const filePath = path.join(KNOWLEDGE_DIR, file);
            let content = "";

            if (file.endsWith(".pdf")) {
                const buffer = fs.readFileSync(filePath);
                const pdfData = await pdfParse(buffer);
                content = pdfData.text;
            } else {
                content = fs.readFileSync(filePath, "utf-8");
            }

            const chunks = chunkTextRecursively(content, file);

            for (const chunk of chunks) {
                ids.push(chunk.id);
                documents.push(chunk.text);
                metadatas.push(chunk.metadata);
            }

            console.log(`[knowledge] "${file}": ${chunks.length} chunk(s) generated.`);
        } catch (err: any) {
            console.error(`[knowledge] Failed to process "${file}": ${err?.message}`);
        }
    }

    if (ids.length === 0) {
        console.log("[knowledge] No valid content chunks extracted — skipping upsert.");
        return;
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

