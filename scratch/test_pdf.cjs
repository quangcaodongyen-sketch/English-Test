const fs = require('fs');
const path = require('path');

async function test() {
  try {
    console.log("Loading pdfjs-dist...");
    const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
    console.log("pdfjsLib loaded successfully!");
    
    const pdfPath = path.join(__dirname, '../Tai lieu 3/SGK Tieng Anh 6 Tap 1- Global Success.pdf');
    if (!fs.existsSync(pdfPath)) {
      console.log("File not found at:", pdfPath);
      return;
    }
    
    console.log("Reading file...");
    const data = new Uint8Array(fs.readFileSync(pdfPath));
    console.log("Loading document...");
    const loadingTask = pdfjsLib.getDocument({ data });
    const pdf = await loadingTask.promise;
    console.log("Num pages:", pdf.numPages);
    
    console.log("Getting page 1...");
    const page = await pdf.getPage(1);
    const textContent = await page.getTextContent();
    const text = textContent.items.map(item => item.str).join(' ');
    console.log("Page 1 Text Sample:", text.substring(0, 200));
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
