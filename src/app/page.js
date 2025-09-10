"use client";

import { useState } from "react";
import { Loader2, Upload, Send } from "lucide-react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return alert("Upload a PDF first");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    setLoading(false);

    if (data.error) alert(data.error);
    else alert(`✅ Uploaded and processed ${data.chunks} chunks`);
  }

  async function handleAsk(e) {
    e.preventDefault();
    if (!question) return;

    setLoading(true);
    const res = await fetch("/api/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.error) setAnswer("Error: " + data.error);
    else setAnswer(data.answer);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-950 text-gray-200 p-6">
      <div className="w-full max-w-2xl bg-gray-900/80 backdrop-blur-lg border border-gray-800 rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-extrabold text-center text-white mb-10 tracking-tight">
          📄 PDF Q&A
        </h1>

        {/* Upload Form */}
        <form
          onSubmit={handleUpload}
          className="mb-8 flex items-center justify-between border-2 border-dashed border-gray-700 rounded-xl p-4 hover:border-blue-500 transition"
        >
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="flex-1 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600/20 file:text-blue-400 hover:file:bg-blue-600/30 cursor-pointer"
          />
          <button
            type="submit"
            disabled={loading}
            className="ml-3 flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Upload className="w-4 h-4" />}
            {loading ? "Processing..." : "Upload"}
          </button>
        </form>

        {/* Ask Form */}
        <form onSubmit={handleAsk} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Ask a question about the PDF..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="border border-gray-700 bg-gray-800/70 rounded-lg p-3 text-gray-100 placeholder-gray-500 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex justify-center items-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md transition disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Send className="w-4 h-4" />}
            {loading ? "Thinking..." : "Ask"}
          </button>
        </form>

        {/* Answer Display */}
        {answer && (
          <div className="mt-8 p-6 bg-gray-800/70 border border-gray-700 rounded-xl shadow-inner">
            <h2 className="font-semibold text-green-400 mb-2">🤖 Answer:</h2>
            <p className="text-gray-100 leading-relaxed">{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}
