"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, Upload, Send } from "lucide-react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]); // chat history
  const [uploading, setUploading] = useState(false);
  const [asking, setAsking] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return alert("Upload a PDF first");

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    setUploading(false);

    if (data.error) alert(data.error);
    else alert(`✅ Uploaded and processed ${data.chunks} chunks`);
  }

  async function handleAsk(e) {
    e.preventDefault();
    if (!question) return;

    setAsking(true);
    const res = await fetch("/api/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const data = await res.json();
    setAsking(false);

    if (data.error) {
      setMessages([
        ...messages,
        { type: "user", text: question },
        { type: "bot", text: "Error: " + data.error },
      ]);
    } else {
      setMessages([
        ...messages,
        { type: "user", text: question },
        { type: "bot", text: data.answer },
      ]);
    }
    setQuestion("");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-950 p-4 sm:p-6 text-gray-200">
      <div className="w-full max-w-4xl bg-gray-900/95 backdrop-blur-xl border border-gray-800 rounded-3xl shadow-2xl p-6 sm:p-10 flex flex-col">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-2">
            🪶 QueryNest
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Upload a PDF, ask questions, and get instant AI-powered answers.
            <span className="text-green-400 font-medium"> Simple. Fast. Smart.</span>
          </p>
        </div>

        {/* Upload Form */}
        <form
          onSubmit={handleUpload}
          className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-2 border-dashed border-gray-700 rounded-xl p-4 hover:border-blue-500 transition"
        >
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="flex-1 text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm sm:file:text-base file:font-semibold file:bg-blue-600/20 file:text-blue-400 hover:file:bg-blue-600/30 cursor-pointer"
          />
          <button
            type="submit"
            disabled={uploading}
            className="w-full sm:w-auto flex justify-center items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg transition-transform transform hover:scale-105 disabled:opacity-50"
          >
            {uploading ? <Loader2 className="animate-spin w-4 h-4" /> : <Upload className="w-4 h-4" />}
            {uploading ? "Processing..." : "Upload"}
          </button>
        </form>

        {/* Chat Box */}
        <div className="flex-1 flex flex-col border border-gray-700 rounded-2xl bg-gray-800/70 p-4 sm:p-6 overflow-y-auto max-h-[60vh] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          {messages.length === 0 && (
            <p className="text-gray-500 text-sm text-center mt-10">
              Your conversation with the PDF will appear here...
            </p>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-4 flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[70%] p-3 rounded-xl shadow-md break-words ${
                  msg.type === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-100"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Ask Form */}
        <form onSubmit={handleAsk} className="mt-4 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Ask a question about your PDF..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="flex-1 border border-gray-700 bg-gray-800/70 rounded-lg p-3 sm:p-4 text-gray-100 placeholder-gray-500 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition w-full"
          />
          <button
            type="submit"
            disabled={asking}
            className="flex justify-center items-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-lg transition-transform transform hover:scale-105 disabled:opacity-50 w-full sm:w-auto"
          >
            {asking ? <Loader2 className="animate-spin w-4 h-4" /> : <Send className="w-4 h-4" />}
            {asking ? "Thinking..." : "Ask"}
          </button>
        </form>
      </div>
    </div>
  );
}