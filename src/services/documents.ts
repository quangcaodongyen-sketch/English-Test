import * as pdfjsLib from "pdfjs-dist";
import localforage from "localforage";
import { TEXTBOOK_CONTENT } from "./textbookContent";

// Initialize pdf.js worker locally using modern ES URL syntax to prevent CDN network/CORS errors
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

// Storage keys
const DOCS_STORE_KEY = "smarttest_documents";
const TEXTBOOK_STORE_KEY = "smarttest_textbooks";

// Supported file types
export const ACCEPTED_FILE_TYPES = ".pdf,.doc,.docx,.xls,.xlsx,.txt";
export const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain"
];

export type DocCategory = "sample_exam" | "matrix" | "spec" | "textbook" | "other";

export interface UploadedDocument {
  id: string;
  fileName: string;
  fileType: string;
  category: DocCategory;
  grade: number;
  extractedText: string;
  fileSize: number;
  uploadedAt: string;
}

/**
 * Extracts text from a PDF file using pdf.js.
 */
async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(" ");
    fullText += pageText + "\n";
  }
  return fullText;
}

/**
 * Extracts text from Word (.doc/.docx) and Excel (.xls/.xlsx) files.
 * Uses a best-effort approach: reads as text/binary and extracts readable strings.
 * For .docx and .xlsx (which are ZIP-based XML), we extract XML text content.
 */
async function extractTextFromOffice(file: File): Promise<string> {
  // For .docx/.xlsx (OpenXML ZIP format), try to extract XML content
  if (file.name.endsWith(".docx") || file.name.endsWith(".xlsx")) {
    try {
      const JSZip = (await import("jszip")).default;
      const arrayBuffer = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(arrayBuffer);

      if (file.name.endsWith(".docx")) {
        // Extract from word/document.xml
        const docXml = await zip.file("word/document.xml")?.async("string");
        if (docXml) {
          // Strip XML tags, keep text
          return docXml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
        }
      }

      if (file.name.endsWith(".xlsx")) {
        // Extract from xl/sharedStrings.xml for cell text
        const sharedStrings = await zip.file("xl/sharedStrings.xml")?.async("string");
        if (sharedStrings) {
          return sharedStrings.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
        }
      }
    } catch (e) {
      console.warn("Failed to parse OpenXML, falling back to text extraction:", e);
    }
  }

  // Fallback for .doc/.xls or failed OpenXML: read as text
  try {
    const text = await file.text();
    // Filter out binary garbage, keep readable characters
    const readable = text.replace(/[^\x20-\x7E\xA0-\xFF\u0100-\uFFFF\n\r\t]/g, " ");
    return readable.replace(/\s+/g, " ").trim();
  } catch {
    return "[Không thể trích xuất nội dung từ file này]";
  }
}

/**
 * Extracts text from any supported file type.
 */
export async function extractTextFromFile(file: File): Promise<string> {
  if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
    return extractTextFromPDF(file);
  }
  if (file.type === "text/plain" || file.name.endsWith(".txt")) {
    return await file.text();
  }
  return extractTextFromOffice(file);
}

/**
 * Processes and stores multiple uploaded files at once.
 */
export async function processAndStoreFiles(
  files: FileList | File[],
  category: DocCategory,
  grade: number
): Promise<UploadedDocument[]> {
  const results: UploadedDocument[] = [];
  const fileArray = Array.from(files);

  for (const file of fileArray) {
    const extractedText = await extractTextFromFile(file);
    const doc: UploadedDocument = {
      id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      fileName: file.name,
      fileType: file.name.split(".").pop()?.toLowerCase() || "unknown",
      category,
      grade,
      extractedText,
      fileSize: file.size,
      uploadedAt: new Date().toISOString()
    };
    results.push(doc);
  }

  // Merge with existing docs
  const existing = await getAllDocuments();
  const merged = [...existing, ...results];
  await localforage.setItem(DOCS_STORE_KEY, merged);
  return results;
}

/**
 * Gets all stored documents.
 */
export async function getAllDocuments(): Promise<UploadedDocument[]> {
  return (await localforage.getItem<UploadedDocument[]>(DOCS_STORE_KEY)) || [];
}

/**
 * Gets documents filtered by category and/or grade.
 */
export async function getDocuments(category?: DocCategory, grade?: number): Promise<UploadedDocument[]> {
  const docs = await getAllDocuments();
  return docs.filter(d => {
    if (category && d.category !== category) return false;
    if (grade !== undefined && d.grade !== grade) return false;
    return true;
  });
}

/**
 * Deletes a single document by ID.
 */
export async function deleteDocument(id: string): Promise<void> {
  const docs = await getAllDocuments();
  const filtered = docs.filter(d => d.id !== id);
  await localforage.setItem(DOCS_STORE_KEY, filtered);
}

/**
 * Deletes all documents matching a category and grade.
 */
export async function deleteDocumentsByFilter(category: DocCategory, grade: number): Promise<void> {
  const docs = await getAllDocuments();
  const filtered = docs.filter(d => !(d.category === category && d.grade === grade));
  await localforage.setItem(DOCS_STORE_KEY, filtered);
}

/**
 * Builds a combined knowledge context string from textbook + other docs for a grade.
 * This is fed into AI prompts for accurate question generation.
 */
export async function buildKnowledgeContext(grade: number, units?: number[], skipUploadedDocs = false): Promise<string> {
  const sections: string[] = [];

  // Add built-in textbook content for selected units if available
  if (units && units.length > 0) {
    const textbookSections: string[] = [];
    for (const unit of units) {
      const content = TEXTBOOK_CONTENT[grade]?.[unit];
      if (content) {
        let uContent = `--- Unit ${unit}: ${TEXTBOOK_CONTENT[grade]?.[unit]?.readingPassage ? "Available" : "No details"}`;
        if (content.dialogue) {
          uContent += `\n[Getting Started Dialogue - Audio Transcript]\n${content.dialogue}`;
        }
        if (content.readingPassage) {
          uContent += `\n[Skills 1 Reading Passage]\n${content.readingPassage}`;
        }
        textbookSections.push(uContent);
      }
    }
    if (textbookSections.length > 0) {
      sections.push(`[SÁCH GIÁO KHOA LỚP ${grade} - KIẾN THỨC CHUẨN CHƯƠNG TRÌNH GLOBAL SUCCESS]\n${textbookSections.join("\n\n")}`);
    }
  }

  if (skipUploadedDocs) {
    return sections.join("\n\n");
  }

  const docs = await getDocuments(undefined, grade);
  if (docs.length === 0) {
    return sections.join("\n\n");
  }

  const textbooks = docs.filter(d => d.category === "textbook");
  if (textbooks.length > 0) {
    let combinedText = "";
    // If we have selected units, search for unit-specific text in the uploaded documents
    if (units && units.length > 0) {
      textbooks.forEach(doc => {
        units.forEach(unit => {
          const regex = new RegExp(`(?:unit|bài|lesson)\\s*${unit}\\b[\\s\\S]{1,3000}`, "gi");
          const matches = doc.extractedText.match(regex);
          if (matches) {
            combinedText += `\n[Tài liệu tham khảo ${doc.fileName} - Phần học liên quan đến Unit ${unit}]:\n` + matches.join("\n...\n");
          }
        });
      });
    }

    // Fallback if no unit-specific content matched
    if (!combinedText.trim()) {
      combinedText = textbooks.map(d => d.extractedText).join("\n").slice(0, 10000);
    }
    sections.push(`[TÀI LIỆU SGK THAM KHẢO LỚP ${grade}]\n${combinedText.slice(0, 15000)}`);
  }

  const samples = docs.filter(d => d.category === "sample_exam");
  if (samples.length > 0) {
    const combinedText = samples.map(d => `--- Đề mẫu: ${d.fileName} ---\n${d.extractedText}`).join("\n");
    sections.push(`[ĐỀ MẪU THAM KHẢO]\n${combinedText.slice(0, 6000)}`);
  }

  const matrices = docs.filter(d => d.category === "matrix");
  if (matrices.length > 0) {
    const combinedText = matrices.map(d => `--- Ma trận: ${d.fileName} ---\n${d.extractedText}`).join("\n");
    sections.push(`[MA TRẬN ĐẶC TẢ]\n${combinedText.slice(0, 4000)}`);
  }

  const specs = docs.filter(d => d.category === "spec");
  if (specs.length > 0) {
    const combinedText = specs.map(d => `--- Đặc tả: ${d.fileName} ---\n${d.extractedText}`).join("\n");
    sections.push(`[BẢN ĐẶC TẢ]\n${combinedText.slice(0, 4000)}`);
  }

  return sections.join("\n\n");
}
