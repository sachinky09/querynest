# QueryNest

🚀 **QueryNest** is a Next.js application that allows users to upload a PDF and interact with it using natural language questions. The system processes the PDF, extracts text, chunks it, embeds it into a vector database (MongoDB), and answers queries using AI via Gemini 2.0 Flash.

---

## 🏗️ Features

* 📂 Upload PDFs directly from the UI
* 🔍 Ask natural language questions about the PDF
* 🤖 AI-powered answers using Gemini 2.0 Flash

---

## 📦 Libraries & Tools Used

* **Next.js** - Frontend framework
* **React** - UI components
* **Tailwind CSS** - Styling
* **Lucide-react** - Icons (Upload, Send, Loader2)
* **pdf2json** - PDF text extraction
* **mongodb** - Database to store PDF chunks and embeddings
* **Gemini 2.0 Flash API** - AI-powered question answering
* **Node.js / Express** - Server handling API routes (via Next.js API)
* **FormData API** - For uploading files from the client

Optional libraries for enhancements:

* **framer-motion** - Animations
* **shadcn/ui** - Components (if using for extended UI)

---

## 🗂️ Project Structure

```
querynest/
│
├─ public/
│  ├─ querynext.png         # Custom favicon
│  
│
├─ src/
│  ├─ app/
│  │  ├─ layout.js          # App layout and metadata
│  │  ├─ page.js            # Main page UI
│  │  └─ api/
│  │     ├─ upload/route.js # PDF upload handling
│  │     └─ query/route.js  # Question-answer API
│  │
│  └─  lib/
│     ├─ pdf.js             # PDF processing (pdf2json)
│     ├─ gemini.js          # Embedding + Gemini API calls
│     └─ mongodb.js         # MongoDB client setup
│        
├─ package.json
├─ tailwind.config.js
└─ README.md
```

---

## ⚙️ Workflow

1. **Upload PDF**: Users select a PDF file via the upload form.
2. **Text Extraction**: `pdf2json` extracts the full text from the PDF buffer.
3. **Chunking**: Text is divided into manageable chunks (500 chars default).
4. **Embedding**: Each chunk is embedded using Gemini 2.0 Flash API.
5. **Storage**: Chunks and embeddings are stored in MongoDB.
6. **Question**: User submits a question via the input box.
7. **Search + AI Answer**: Closest matching chunks are retrieved, and Gemini 2.0 Flash generates an answer.
8. **Display**: Answer is shown in the chat-style UI.

---

## 🚨 Common Errors & Solutions

### 1. ENOENT: No such file or directory

**Problem:** Upload code tried to read a hardcoded PDF path like `./test/data/05-versions-space.pdf`.

**Solution:**

* Switch PDF processing to use the uploaded file buffer.
* `pdf2json` parses directly from `Buffer`.
* Example:

```js
const buffer = Buffer.from(await file.arrayBuffer());
const text = await loadPdf(buffer);
```

### 2. pdf-parse fails or looks for test files

**Problem:** pdf-parse internally bundles pdfjs-dist which may try to open test data.

**Solution:**

* Replace `pdf-parse` with `pdf2json` to avoid ENOENT.
* Parse PDF buffer directly in Node.

### 3. MongoDB overwriting old chunks

**Problem:** Using `deleteMany({})` deletes previously uploaded PDFs.

**Solution:**

* Use `fileId` or unique identifier per PDF.
* Store chunks per file to support multiple PDFs.

### 4. UI Not Updating / Old Answer Replacing New One

**Problem:** Only single answer was displayed.

**Solution:**

* Implement a chat-history array to stack Q\&A pairs.
* Each submission appends to the conversation.


```

---

## 💻 Development Setup

1. Clone the repo

```bash
git clone https://github.com/sachinky09/querynest.git
cd querynest
```

2. Install dependencies

```bash
npm install
```

3. Start the dev server

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

---

## ⚡ Notes

* Ensure MongoDB is running and `MONGODB_URI` and `GEMINI_API_KEY` (get it from [Google AI Studio](https://aistudio.google.com/)) is set in `.env`.
* Gemini 2.0 Flash API key should be stored securely in environment variables.
* Tailwind classes control all the dark mode UI and animations.

---


