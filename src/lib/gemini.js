import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_TEXT_MODEL = "gemini-2.0-flash";
const GEMINI_EMBED_MODEL = "gemini-embedding-001";

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function embed(text) {
  const response = await ai.models.embedContent({
    model: GEMINI_EMBED_MODEL,
    contents: Array.isArray(text) ? text : [text],
  });

  return Array.isArray(text)
    ? response.embeddings.map((e) => e.values)
    : response.embeddings[0].values;
}

export async function generateAnswer(context, question) {
  const prompt = `Context:\n${context}\n\nQuestion: ${question}\nAnswer:`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_TEXT_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }
  );

  const data = await res.json();
  if (data.error) {
    throw new Error(JSON.stringify(data.error));
  }

  return data.candidates?.[0]?.content?.parts?.[0]?.text || "No answer";
}
