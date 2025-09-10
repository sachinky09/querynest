import { NextResponse } from "next/server";
import { loadPdf, chunkText } from "@/lib/pdf";
import { embed } from "@/lib/gemini";
import clientPromise from "@/lib/mongodb";

const DB_NAME = "rag_db";
const COLLECTION_NAME = "pdf_chunks";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    
    const buffer = Buffer.from(await file.arrayBuffer());
    const text = await loadPdf(buffer);
    const chunks = chunkText(text);

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const col = db.collection(COLLECTION_NAME);

    await col.deleteMany({}); // clear old
    const docs = [];
    for (let i = 0; i < chunks.length; i++) {
      const emb = await embed(chunks[i]);
      docs.push({ chunk_id: i, text: chunks[i], embedding: emb });
    }
    await col.insertMany(docs);

    return NextResponse.json({ success: true, chunks: chunks.length });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
