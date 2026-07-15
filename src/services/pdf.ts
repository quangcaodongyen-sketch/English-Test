import * as pdfjsLib from "pdfjs-dist";
import localforage from "localforage";

// Initialize pdf.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const STORE_KEY_PREFIX = "pdf_textbook_grade_";

/**
 * Extracts text from a given PDF file object.
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = "";
  const maxPages = pdf.numPages;

  for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(" ");
    fullText += pageText + "\\n";
  }

  return fullText;
}

/**
 * Saves extracted textbook text to IndexedDB for a specific grade.
 */
export async function saveTextbookForGrade(grade: number, text: string, fileName: string): Promise<void> {
  const data = {
    fileName,
    text,
    updatedAt: new Date().toISOString()
  };
  await localforage.setItem(STORE_KEY_PREFIX + grade, data);
}

/**
 * Retrieves the saved textbook text for a specific grade.
 */
export async function getTextbookForGrade(grade: number): Promise<{fileName: string, text: string, updatedAt: string} | null> {
  return await localforage.getItem(STORE_KEY_PREFIX + grade);
}

/**
 * Deletes the saved textbook for a specific grade.
 */
export async function deleteTextbookForGrade(grade: number): Promise<void> {
  await localforage.removeItem(STORE_KEY_PREFIX + grade);
}
