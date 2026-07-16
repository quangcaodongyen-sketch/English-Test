import { Exam, Question } from "./types";
import JSZip from "jszip";
import { saveAs } from "file-saver";

// Standard Fisher-Yates shuffle
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Safely shuffles questions and options within an exam, updating correct options
export function shuffleExam(exam: Exam, versionCode: string): Exam {
  const shuffledParts = exam.parts.map(part => {
    const shuffledQuestions = part.questions.map(q => {
      const correctIndex = q.correctAnswer.charCodeAt(0) - 65;
      const correctOptionText = q.options[correctIndex] || "";
      const shuffledOptions = shuffleArray(q.options);
      let newCorrectIndex = shuffledOptions.indexOf(correctOptionText);
      if (newCorrectIndex === -1) newCorrectIndex = 0;
      const newCorrectLetter = String.fromCharCode(65 + newCorrectIndex);
      return { ...q, options: shuffledOptions, correctAnswer: newCorrectLetter };
    });
    return { ...part, questions: shuffleArray(shuffledQuestions) };
  });

  return {
    ...exam,
    id: `${exam.id}-shuffled-${Date.now()}`,
    title: `${exam.title} - ${versionCode}`,
    versionCode,
    parts: shuffledParts,
    createdAt: new Date().toISOString(),
  };
}

// --- Official Ministry of Education DOCX HTML Templates ---

const BGDDT_DOC_START = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <!--[if gte mso 9]><xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml><![endif]-->
  <style>
    @page {
      size: A4;
      margin: 2cm 2cm 2cm 2.5cm;
    }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 13pt;
      line-height: 1.5;
      color: #000;
    }
    .header-table {
      width: 100%;
      border: none;
      border-collapse: collapse;
      margin-bottom: 10pt;
    }
    .header-table td {
      vertical-align: top;
      border: none;
      padding: 0 5pt;
    }
    .col-left {
      width: 40%;
      text-align: center;
    }
    .col-right {
      width: 60%;
      text-align: center;
    }
    .org-name {
      font-size: 12pt;
      text-transform: uppercase;
    }
    .school-name {
      font-size: 12pt;
      font-weight: bold;
      text-transform: uppercase;
    }
    .underline-short {
      display: block;
      width: 60%;
      margin: 2pt auto 0 auto;
      border-bottom: 1.5pt solid #000;
    }
    .exam-title {
      font-size: 13pt;
      font-weight: bold;
      text-transform: uppercase;
    }
    .exam-meta {
      font-size: 12pt;
    }
    .official-label {
      font-size: 12pt;
      font-weight: bold;
      font-style: italic;
      margin-top: 4pt;
    }
    .student-info {
      margin-top: 12pt;
      margin-bottom: 8pt;
      font-size: 13pt;
    }
    .student-info-table {
      width: 100%;
      border: none;
      border-collapse: collapse;
    }
    .student-info-table td {
      border: none;
      padding: 4pt 2pt;
      font-size: 13pt;
    }
    .part-title {
      font-weight: bold;
      font-size: 13pt;
      text-transform: uppercase;
      margin-top: 14pt;
      margin-bottom: 4pt;
    }
    .instruction {
      font-style: italic;
      font-size: 13pt;
      margin-bottom: 8pt;
    }
    .question {
      margin-bottom: 6pt;
      page-break-inside: avoid;
    }
    .question-text {
      font-size: 13pt;
    }
    .question-number {
      font-weight: bold;
    }
    .options-table {
      width: 100%;
      border: none;
      border-collapse: collapse;
      margin-top: 2pt;
      margin-bottom: 6pt;
    }
    .options-table td {
      padding: 1pt 8pt;
      font-size: 13pt;
      border: none;
      vertical-align: top;
    }
    .writing-area {
      margin-top: 10pt;
      width: 100%;
    }
    .writing-line {
      border-bottom: 1px dotted #666;
      height: 28pt;
      width: 100%;
    }
    .answer-table {
      width: 100%;
      border-collapse: collapse;
      margin: 10pt 0;
    }
    .answer-table th, .answer-table td {
      border: 1pt solid #000;
      padding: 4pt 6pt;
      text-align: center;
      font-size: 12pt;
    }
    .answer-table th {
      background-color: #f0f0f0;
      font-weight: bold;
    }
    .correct-answer {
      font-weight: bold;
      color: #c00;
    }
    .matrix-table {
      width: 100%;
      border-collapse: collapse;
      margin: 10pt 0;
    }
    .matrix-table th, .matrix-table td {
      border: 1pt solid #000;
      padding: 4pt 6pt;
      text-align: center;
      font-size: 11pt;
    }
    .matrix-table th {
      background-color: #e8e8e8;
      font-weight: bold;
    }
    .footer-note {
      margin-top: 20pt;
      text-align: right;
      font-style: italic;
      font-size: 11pt;
    }
  </style>
</head>
<body>
`;

const BGDDT_DOC_END = `</body></html>`;

function getOfficialHeader(exam: Exam) {
  const termText = exam.term || "";
  const versionLabel = exam.versionCode ? `<div style="font-size:12pt; font-weight:bold; margin-top:6pt;">Mã đề: ${exam.versionCode}</div>` : "";

  return `
  <table class="header-table">
    <tr>
      <td class="col-left">
        <div class="org-name">${exam.orgName || "SỞ GIÁO DỤC VÀ ĐÀO TẠO ................."}</div>
        <div class="school-name">${exam.schoolName || "TRƯỜNG THCS ........................................"}</div>
        <span class="underline-short"></span>
      </td>
      <td class="col-right">
        <div class="exam-title">${exam.title}</div>
        <span class="underline-short"></span>
        <div class="exam-meta">
          Môn: ${exam.subject || "TIẾNG ANH"} – Lớp: ${exam.grade}<br/>
          Năm học: ${exam.academicYear || "2024-2025"}<br/>
          Thời gian làm bài: ${exam.duration} phút (không kể thời gian giao đề)
        </div>
        <div class="official-label">(Đề thi gồm có ... trang)</div>
        ${versionLabel}
      </td>
    </tr>
  </table>`;
}

function getStudentInfoBlock() {
  return `
  <table class="student-info-table">
    <tr>
      <td style="width:70%; font-size:12pt; font-family:'Times New Roman';">Họ và tên học sinh: .................................................................</td>
      <td style="width:15%; font-size:12pt; font-family:'Times New Roman';">Lớp: ............</td>
      <td style="width:15%; font-size:12pt; font-family:'Times New Roman';">SBD: ............</td>
    </tr>
  </table>
  <table style="width:100%; border:1pt solid #000; border-collapse:collapse; margin-top:8pt; margin-bottom:12pt; font-family:'Times New Roman';">
    <tr>
      <td colspan="2" style="width:40%; border:1pt solid #000; text-align:center; font-weight:bold; padding:4pt; font-size:11pt;">ĐIỂM</td>
      <td rowspan="2" style="width:60%; border:1pt solid #000; text-align:center; font-weight:bold; padding:4pt; font-size:11pt; vertical-align:middle;">LỜI PHÊ CỦA GIÁO VIÊN</td>
    </tr>
    <tr>
      <td style="width:20%; border:1pt solid #000; text-align:center; font-style:italic; padding:3pt; font-size:9pt;">Bằng số</td>
      <td style="width:20%; border:1pt solid #000; text-align:center; font-style:italic; padding:3pt; font-size:9pt;">Bằng chữ</td>
    </tr>
    <tr>
      <td style="height:35pt; border:1pt solid #000; text-align:center;"></td>
      <td style="height:35pt; border:1pt solid #000; text-align:center;"></td>
      <td style="height:35pt; border:1pt solid #000; text-align:center;"></td>
    </tr>
  </table>`;
}

function getExamBody(exam: Exam) {
  return exam.parts.map(part => {
    const questionsHtml = part.questions.map(q => {
      if (q.options.length === 0) {
        // Writing question
        const lines = Array.from({ length: 8 }, () => `<div class="writing-line"></div>`).join("");
        return `
          <div class="question">
            <div class="question-text">${q.questionText}</div>
            <div class="writing-area">${lines}</div>
          </div>`;
      }
      // MCQ question
      const optRows: string[] = [];
      const maxOptLength = Math.max(...q.options.map(opt => opt.length));
      
      if (maxOptLength > 25) {
        // Vertical layout: 1 option per row
        q.options.forEach(opt => {
          optRows.push(`<tr><td style="width: 100%; padding: 2pt 0;">${opt}</td></tr>`);
        });
      } else {
        // Horizontal layout: all options in one row
        const widthPercent = 100 / q.options.length;
        const cells = q.options.map(opt => `<td style="width: ${widthPercent}%; padding: 2pt 0;">${opt}</td>`).join("");
        optRows.push(`<tr>${cells}</tr>`);
      }
      
      return `
        <div class="question">
          <span class="question-number">Câu ${q.id}.</span> <span class="question-text">${q.questionText}</span>
          <table class="options-table">${optRows.join("")}</table>
        </div>`;
    }).join("");

    return `
      <div class="part-title">${part.title}</div>
      <div class="instruction">${part.instruction}</div>
      ${questionsHtml}`;
  }).join("");
}

function getAnswerSheet(exam: Exam) {
  const mcqs = exam.parts.flatMap(p => p.questions).filter(q => q.options.length > 0);
  const headerRow = `<tr><th>Câu</th><th>Đáp án</th><th>Câu</th><th>Đáp án</th><th>Câu</th><th>Đáp án</th></tr>`;
  // Split into 3 columns
  const colSize = Math.ceil(mcqs.length / 3);
  const col1 = mcqs.slice(0, colSize);
  const col2 = mcqs.slice(colSize, colSize * 2);
  const col3 = mcqs.slice(colSize * 2);
  const maxRows = Math.max(col1.length, col2.length, col3.length);

  let rows = "";
  for (let i = 0; i < maxRows; i++) {
    const c1 = col1[i] ? `<td>${col1[i].id}</td><td class="correct-answer">${col1[i].correctAnswer}</td>` : `<td></td><td></td>`;
    const c2 = col2[i] ? `<td>${col2[i].id}</td><td class="correct-answer">${col2[i].correctAnswer}</td>` : `<td></td><td></td>`;
    const c3 = col3[i] ? `<td>${col3[i].id}</td><td class="correct-answer">${col3[i].correctAnswer}</td>` : `<td></td><td></td>`;
    rows += `<tr>${c1}${c2}${c3}</tr>`;
  }

  let html = `
    <div style="text-align:center; margin-bottom:15pt;">
      <div class="school-name">${exam.schoolName || "TRƯỜNG THCS ĐỒNG YÊN"}</div>
      <div style="font-size:14pt; font-weight:bold; text-transform:uppercase; margin-top:10pt;">HƯỚNG DẪN CHẤM VÀ ĐÁP ÁN</div>
      <div style="font-size:13pt; margin-top:4pt;">${exam.title}</div>
      <div style="font-size:12pt;">Môn: ${exam.subject || "Tiếng Anh"} – Lớp: ${exam.grade} – Năm học: ${exam.academicYear || "2024-2025"}</div>
    </div>
    <div style="font-weight:bold; margin-top:10pt;">I. PHẦN TRẮC NGHIỆM</div>
    <table class="answer-table">${headerRow}${rows}</table>`;

  if (exam.transcripts) {
    html += `
      <div style="font-weight:bold; margin-top:15pt;">II. LISTENING TRANSCRIPT</div>
      <div style="white-space: pre-wrap; font-size:12pt;">${exam.transcripts}</div>`;
  }

  if (exam.writingRubric) {
    html += `
      <div style="font-weight:bold; margin-top:15pt;">${exam.transcripts ? 'III' : 'II'}. HƯỚNG DẪN CHẤM PHẦN VIẾT</div>
      <div style="white-space: pre-wrap; font-size:12pt;">${exam.writingRubric}</div>`;
  }

  html += `<div class="footer-note">--- Hết ---</div>`;
  return html;
}

function markdownToHtml(md: string): string {
  if (!md) return "";
  
  // Normalize literal "\n" strings that might be returned by JSON
  let normalized = md.replace(/\\n/g, "\n");
  
  const lines = normalized.split(/\r?\n/);
  const resultLines: string[] = [];
  let inTable = false;
  let tableRows: string[] = [];
  let isFirstTableRow = true;
  
  const flushTable = () => {
    if (tableRows.length > 0) {
      resultLines.push('<table class="matrix-table">');
      resultLines.push(tableRows.join("\n"));
      resultLines.push('</table>');
      tableRows = [];
      inTable = false;
      isFirstTableRow = true;
    }
  };

  for (let line of lines) {
    const trimmed = line.trim();
    
    if (trimmed.startsWith("|")) {
      inTable = true;
      if (trimmed.includes("---")) {
        // Skip header separator row
        continue;
      }
      const cells = trimmed.split("|").map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      const rowHtml = cells.map(cell => {
        // Process bold or italic inline formatting inside table cells
        let processedCell = cell.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        processedCell = processedCell.replace(/\*(.*?)\*/g, "<em>$1</em>");
        return isFirstTableRow ? `<th>${processedCell}</th>` : `<td>${processedCell}</td>`;
      }).join("");
      
      tableRows.push(`<tr>${rowHtml}</tr>`);
      isFirstTableRow = false;
    } else {
      flushTable();
      
      // Process standard markdown blocks
      let processedLine = line;
      if (trimmed.startsWith("###")) {
        processedLine = `<h3>${trimmed.substring(3).trim()}</h3>`;
      } else if (trimmed.startsWith("##")) {
        processedLine = `<h2>${trimmed.substring(2).trim()}</h2>`;
      } else if (trimmed.startsWith("#")) {
        processedLine = `<h1>${trimmed.substring(1).trim()}</h1>`;
      } else if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        const content = trimmed.substring(1).trim();
        processedLine = `<li>${content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}</li>`;
      } else {
        // Process bold/italic inline
        processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        processedLine = processedLine.replace(/\*(.*?)\*/g, "<em>$1</em>");
        if (trimmed) {
          processedLine = `<p>${processedLine}</p>`;
        }
      }
      resultLines.push(processedLine);
    }
  }
  
  // Flush any remaining table at the end
  flushTable();
  
  return resultLines.join("\n");
}

// --- Export Functions ---

function downloadDocFile(content: string, filename: string) {
  const blob = new Blob([content], { type: "application/msword;charset=utf-8" });
  saveAs(blob, filename);
}

export function exportToWord(exam: Exam) {
  const html = BGDDT_DOC_START + getOfficialHeader(exam) + getStudentInfoBlock() + getExamBody(exam)
    + `<div class="footer-note">--- Hết ---</div>` + BGDDT_DOC_END;
  downloadDocFile(html, `De_Thi_${exam.title.replace(/\s+/g, "_")}.doc`);
}

export function exportAnswersToWord(exam: Exam) {
  const html = BGDDT_DOC_START + getAnswerSheet(exam) + BGDDT_DOC_END;
  downloadDocFile(html, `Dap_An_${exam.title.replace(/\s+/g, "_")}.doc`);
}

export function exportMatrixToWord(exam: Exam) {
  const content = exam.matrixData ? markdownToHtml(exam.matrixData) : "<p><em>Chưa có ma trận</em></p>";
  const html = BGDDT_DOC_START
    + `<div style="text-align:center; font-weight:bold; font-size:14pt; text-transform:uppercase; margin-bottom:15pt;">MA TRẬN ĐỀ KIỂM TRA</div>`
    + `<div style="text-align:center; margin-bottom:10pt;">${exam.title}<br/>Môn: ${exam.subject || "Tiếng Anh"} – Lớp: ${exam.grade}</div>`
    + content + BGDDT_DOC_END;
  downloadDocFile(html, `Ma_Tran_${exam.title.replace(/\s+/g, "_")}.doc`);
}

export function exportSpecToWord(exam: Exam) {
  const content = exam.specData ? markdownToHtml(exam.specData) : "<p><em>Chưa có bản đặc tả</em></p>";
  const html = BGDDT_DOC_START
    + `<div style="text-align:center; font-weight:bold; font-size:14pt; text-transform:uppercase; margin-bottom:15pt;">BẢN ĐẶC TẢ ĐỀ KIỂM TRA</div>`
    + `<div style="text-align:center; margin-bottom:10pt;">${exam.title}<br/>Môn: ${exam.subject || "Tiếng Anh"} – Lớp: ${exam.grade}</div>`
    + content + BGDDT_DOC_END;
  downloadDocFile(html, `Dac_Ta_${exam.title.replace(/\s+/g, "_")}.doc`);
}

export async function exportAllToZip(exam: Exam) {
  const zip = new JSZip();

  const testHtml = BGDDT_DOC_START + getOfficialHeader(exam) + getStudentInfoBlock() + getExamBody(exam)
    + `<div class="footer-note">--- Hết ---</div>` + BGDDT_DOC_END;
  const answersHtml = BGDDT_DOC_START + getAnswerSheet(exam) + BGDDT_DOC_END;
  const matrixContent = exam.matrixData ? markdownToHtml(exam.matrixData) : "<p><em>Chưa có ma trận</em></p>";
  const matrixHtml = BGDDT_DOC_START
    + `<div style="text-align:center; font-weight:bold; font-size:14pt; text-transform:uppercase; margin-bottom:15pt;">MA TRẬN ĐỀ KIỂM TRA</div>`
    + matrixContent + BGDDT_DOC_END;
  const specContent = exam.specData ? markdownToHtml(exam.specData) : "<p><em>Chưa có bản đặc tả</em></p>";
  const specHtml = BGDDT_DOC_START
    + `<div style="text-align:center; font-weight:bold; font-size:14pt; text-transform:uppercase; margin-bottom:15pt;">BẢN ĐẶC TẢ ĐỀ KIỂM TRA</div>`
    + specContent + BGDDT_DOC_END;

  const safeName = exam.title.replace(/\s+/g, "_");
  zip.file(`De_Thi_${safeName}.doc`, testHtml);
  zip.file(`Dap_An_${safeName}.doc`, answersHtml);
  zip.file(`Ma_Tran_${safeName}.doc`, matrixHtml);
  zip.file(`Dac_Ta_${safeName}.doc`, specHtml);

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `Bo_De_${safeName}.zip`);
}
