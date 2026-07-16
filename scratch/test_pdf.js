import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function checkFile(fileName) {
  try {
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const pdfPath = path.join(__dirname, '../Tai lieu 3', fileName);
    if (!fs.existsSync(pdfPath)) {
      console.log(`${fileName}: File does not exist`);
      return;
    }
    const buffer = fs.readFileSync(pdfPath);
    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer), useSystemFonts: true }).promise;
    
    let totalLength = 0;
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const text = textContent.items.map(item => item.str).join(' ').trim();
      totalLength += text.length;
    }
    console.log(`${fileName}: ${pdf.numPages} pages, total text chars: ${totalLength}`);
  } catch (err) {
    console.error(`Error checking ${fileName}:`, err.message);
  }
}

async function main() {
  const files = [
    "SGK Tieng Anh 6 Tap 1- Global Success.pdf",
    "SGK Tieng Anh 6 Tap 2 - Global Success.pdf",
    "1 - SGK Tiếng anh 7 - Global Success - MinhPhamBlog.pdf",
    "Tiếng anh 8 Global Success - Sách học sinh - minhphamblog.pdf",
    "Sách học sinh Tiếng anh 9 - Global success.pdf"
  ];
  for (const file of files) {
    await checkFile(file);
  }
}

main();
