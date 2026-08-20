import { ChromaClient, type Collection } from "chromadb";
import { GoogleGeminiEmbeddingFunction } from "@chroma-core/google-gemini";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is required");
}

const modelName = process.env.GEMINI_EMBEDDING_MODEL ?? "gemini-embedding-001";
const chromaHost = process.env.CHROMA_HOST ?? "http://localhost:8000";


//The translator -> ChromaDB only understands number, so we use Google's 
// embedding model to convert text to numbers.
const embedder = new GoogleGeminiEmbeddingFunction({
  apiKey,
  modelName,
});


////The DB client
const chromaClient = new ChromaClient({
  path: chromaHost,
});


//Similar to MongoDB, ChromDB has collections
//Here embedding happens before the search
export async function getCollection(name: string): Promise<Collection> {
  return chromaClient.getOrCreateCollection({
    name,
    embeddingFunction: embedder,
  });
}

export async function heartbeat(): Promise<void> {
  await chromaClient.heartbeat();
}
