"use server";

import { pgDb } from "lib/db/pg/db.pg";
import { knowledgeBase, document, embedding } from "lib/db/pg/schema.pg";
import { eq, sum } from "drizzle-orm";
import { generateUUID } from "lib/utils";
import { searchKnowledge as searchKnowledgeService } from "lib/knowledge/search-service";

/* ------------------------------------------------------------
 * CREATE KNOWLEDGE BASE
 * ------------------------------------------------------------ */
export async function createKnowledgeBase(data: {
  name: string;
  description?: string;
  chunkingConfig: { minSize: number; maxSize: number; overlap: number };
}) {
  const id = generateUUID();

  const [newKB] = await pgDb
    .insert(knowledgeBase)
    .values({
      id,
      userId: "04b9e7e2-9513-4a7d-8f71-4ec73a0d7d5f",
      name: data.name,
      description: data.description || null,
      chunkingConfig: data.chunkingConfig,
      embeddingModel: "local-hash-embedding",
      embeddingDimension: 256,
      tokenCount: 0,
    })
    .returning();

  return newKB;
}

/* ------------------------------------------------------------
 * GET KNOWLEDGE BASES
 * ------------------------------------------------------------ */
export async function getKnowledgeBases() {
  const knowledgeBases = await pgDb.select().from(knowledgeBase);

  const kbWithCounts = await Promise.all(
    knowledgeBases.map(async (kb) => {
      const docs = await pgDb
        .select()
        .from(document)
        .where(eq(document.knowledgeBaseId, kb.id));

      const chunks = await pgDb
        .select({ tokenCount: embedding.tokenCount })
        .from(embedding)
        .where(eq(embedding.knowledgeBaseId, kb.id));

      const totalTokens = chunks.reduce(
        (sum, c) => sum + (c.tokenCount || 0),
        0
      );

      return {
        ...kb,
        documentCount: docs.length,
        chunkCount: chunks.length,
        tokenCount: totalTokens,
      };
    })
  );

  return kbWithCounts;
}

/* ------------------------------------------------------------
 * GET SINGLE KB
 * ------------------------------------------------------------ */
export async function getKnowledgeBase(id: string) {
  const [kb] = await pgDb
    .select()
    .from(knowledgeBase)
    .where(eq(knowledgeBase.id, id));

  if (!kb) throw new Error("Knowledge base not found");
  return kb;
}

/* ------------------------------------------------------------
 * UPDATE KB
 * ------------------------------------------------------------ */
export async function updateKnowledgeBase(
  id: string,
  data: { name: string; description?: string }
) {
  const [updated] = await pgDb
    .update(knowledgeBase)
    .set({
      name: data.name,
      description: data.description || null,
      updatedAt: new Date(),
    })
    .where(eq(knowledgeBase.id, id))
    .returning();

  return updated;
}

/* ------------------------------------------------------------
 * DELETE KB
 * ------------------------------------------------------------ */
export async function deleteKnowledgeBase(id: string) {
  await pgDb.delete(knowledgeBase).where(eq(knowledgeBase.id, id));

  return { success: true };
}

/* ------------------------------------------------------------
 * UPDATE KB CONFIG
 * ------------------------------------------------------------ */
export async function updateKnowledgeBaseConfig(
  id: string,
  chunkingConfig: { minSize: number; maxSize: number; overlap: number }
) {
  const [updated] = await pgDb
    .update(knowledgeBase)
    .set({ chunkingConfig })
    .where(eq(knowledgeBase.id, id))
    .returning();

  return updated;
}

/* ------------------------------------------------------------
 * DOCUMENT QUERIES
 * ------------------------------------------------------------ */
export async function getDocuments(kbId: string) {
  return await pgDb
    .select()
    .from(document)
    .where(eq(document.knowledgeBaseId, kbId));
}

export async function getDocument(id: string) {
  const [doc] = await pgDb.select().from(document).where(eq(document.id, id));

  if (!doc) throw new Error("Document not found");
  return doc;
}

export async function deleteDocument(id: string) {
  const [doc] = await pgDb
    .select({ knowledgeBaseId: document.knowledgeBaseId })
    .from(document)
    .where(eq(document.id, id));

  if (!doc) throw new Error("Document not found");

  await pgDb.delete(document).where(eq(document.id, id));

  const [result] = await pgDb
    .select({ totalTokens: sum(document.tokenCount) })
    .from(document)
    .where(eq(document.knowledgeBaseId, doc.knowledgeBaseId));

  await pgDb
    .update(knowledgeBase)
    .set({ tokenCount: Number(result?.totalTokens || 0) })
    .where(eq(knowledgeBase.id, doc.knowledgeBaseId));

  return { success: true };
}

/* ------------------------------------------------------------
 * CHUNKS
 * ------------------------------------------------------------ */
export async function getChunks(documentId: string) {
  return await pgDb
    .select()
    .from(embedding)
    .where(eq(embedding.documentId, documentId))
    .orderBy(embedding.chunkIndex);
}

export async function updateChunk(id: string, content: string) {
  const [updated] = await pgDb
    .update(embedding)
    .set({
      content,
      contentLength: content.length,
      updatedAt: new Date(),
    })
    .where(eq(embedding.id, id))
    .returning();

  return updated;
}

export async function deleteChunk(id: string) {
  await pgDb.delete(embedding).where(eq(embedding.id, id));
  return { success: true };
}

export async function toggleChunkEnabled(id: string, enabled: boolean) {
  const [updated] = await pgDb
    .update(embedding)
    .set({ enabled, updatedAt: new Date() })
    .where(eq(embedding.id, id))
    .returning();

  return updated;
}

/* ------------------------------------------------------------
 * CREATE CHUNK
 * ------------------------------------------------------------ */
export async function createChunk(
  documentId: string,
  content: string,
  chunkIndex?: number
) {
  const [doc] = await pgDb
    .select()
    .from(document)
    .where(eq(document.id, documentId));

  if (!doc) throw new Error("Document not found");

  const [kb] = await pgDb
    .select()
    .from(knowledgeBase)
    .where(eq(knowledgeBase.id, doc.knowledgeBaseId));

  const { generateEmbeddings } = await import(
    "lib/knowledge/embedding-service"
  );

  const embeddingVectors = await generateEmbeddings([content], {
    dimensions: kb.embeddingDimension ?? 256,
  });

  let nextIndex = chunkIndex;
  if (nextIndex === undefined) {
    const existing = await pgDb
      .select()
      .from(embedding)
      .where(eq(embedding.documentId, documentId));
    nextIndex = existing.length;
  }

  const crypto = require("crypto");
  const chunkHash = crypto.createHash("md5").update(content).digest("hex");

  const id = generateUUID();

  const [newChunk] = await pgDb
    .insert(embedding)
    .values({
      id,
      documentId,
      knowledgeBaseId: doc.knowledgeBaseId,
      content,
      contentLength: content.length,
      tokenCount: Math.ceil(content.length / 4),
      chunkIndex: nextIndex,
      chunkHash,
      startOffset: 0,
      endOffset: content.length,
      embedding: embeddingVectors[0],
      embeddingModel: kb.embeddingModel,
      enabled: true,
    })
    .returning();

  return newChunk;
}

/* ------------------------------------------------------------
 * SEARCH KNOWLEDGE
 * ------------------------------------------------------------ */
export async function searchKnowledge(
  knowledgeBaseId: string,
  query: string,
  options?: { limit?: number; threshold?: number }
) {
  return await searchKnowledgeService(knowledgeBaseId, query, {
    limit: options?.limit || 5,
    enabledOnly: true,
  });
}
