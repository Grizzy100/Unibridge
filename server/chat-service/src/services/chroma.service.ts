import { ChromaClient, type Collection } from "chromadb";
import { GoogleGeminiEmbeddingFunction } from "@chroma-core/google-gemini";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is required");
}

const modelName = process.env.GEMINI_EMBEDDING_MODEL ?? "gemini-embedding-001";
const chromaHost = process.env.CHROMA_HOST ?? "http://localhost:8000";

const embedder = new GoogleGeminiEmbeddingFunction({
  apiKey,
  modelName,
});

const chromaClient = new ChromaClient({
  path: chromaHost,
});

export async function getCollection(name: string): Promise<Collection> {
  return chromaClient.getOrCreateCollection({
    name,
    embeddingFunction: embedder,
  });
}

export async function heartbeat(): Promise<void> {
  await chromaClient.heartbeat();
}
