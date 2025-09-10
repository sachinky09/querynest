import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { embed, generateAnswer } from "@/lib/gemini";
import cosineSimilarity from "compute-cosine-similarity";

const DB_NAME = "rag_db";
const COLLECTION_NAME = "pdf_chunks";
const TOP_K = 3;

export async function POST(req) {
  try {
    const { question } = await req.json();
    if (!question) {
      return NextResponse.json({ error: "No question provided" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const col = db.collection(COLLECTION_NAME);
    const store = await col.find({}).toArray();

    const qEmb = await embed(question);
    const scored = store.map((doc) => ({
      ...doc,
      score: cosineSimilarity(qEmb, doc.embedding),
    }));

    scored.sort((a, b) => b.score - a.score);
    const topChunks = scored.slice(0, TOP_K);
    const context = topChunks.map((c) => c.text).join("\n\n");

    const answer = await generateAnswer(context, question);
    return NextResponse.json({ answer });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
