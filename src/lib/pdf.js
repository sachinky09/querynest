import PDFParser from "pdf2json";

const CHUNK_SIZE = 500;

export async function loadPdf(fileBuffer) {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (err) => reject(err.parserError));
    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      let text = "";
      pdfData.Pages.forEach((page) => {
        page.Texts.forEach((t) => {
          // Each `t.R[0].T` is URI-encoded text
          text += decodeURIComponent(t.R[0].T) + " ";
        });
      });
      resolve(text);
    });

    pdfParser.parseBuffer(fileBuffer);
  });
}

export function chunkText(text, size = CHUNK_SIZE) {
  const chunks = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
}
