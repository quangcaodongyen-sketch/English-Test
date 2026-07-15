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
      // Find the correct option text first
      const correctIndex = q.correctAnswer.charCodeAt(0) - 65; // A=0, B=1...
      const correctOptionText = q.options[correctIndex] || "";

      // Shuffle options
      const shuffledOptions = shuffleArray(q.options);

      // Find the new index of correctOptionText
      let newCorrectIndex = shuffledOptions.indexOf(correctOptionText);
      if (newCorrectIndex === -1) newCorrectIndex = 0; // fallback

      const newCorrectLetter = String.fromCharCode(65 + newCorrectIndex);

      return {
        ...q,
        options: shuffledOptions,
        correctAnswer: newCorrectLetter,
      };
    });

    return {
      ...part,
      questions: shuffleArray(shuffledQuestions),
    };
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

// --- DOCX HTML Templates ---

const HTML_DOC_TEMPLATE_START = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Times New Roman', Times, serif; font-size: 13pt; line-height: 1.3; margin: 1in; }
    .header { width: 100%; border-bottom: 1px solid black; padding-bottom: 10px; margin-bottom: 20px; }
    .header td { vertical-align: top; }
    .school-name { font-weight: bold; text-transform: uppercase; font-size: 12pt; text-align: center; }
    .exam-title-box { text-align: center; font-weight: bold; }
    .exam-title { font-size: 14pt; text-transform: uppercase; }
    .exam-meta { font-size: 12pt; font-style: italic; font-weight: normal; margin-top: 5px; }
    .student-info { margin-top: 15px; font-weight: bold; font-size: 12pt; }
    .part-title { font-weight: bold; text-transform: uppercase; margin-top: 15px; margin-bottom: 5px; }
    .instruction { font-style: italic; margin-bottom: 10px; }
    .question { margin-bottom: 10px; page-break-inside: avoid; }
    .question-text { font-weight: bold; }
    .options-table { width: 100%; margin-bottom: 10px; }
    .options-table td { width: 33%; padding: 2px; font-size: 13pt; }
    .markdown-content { font-size: 13pt; line-height: 1.5; }
    table.border-table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 15px; }
    table.border-table th, table.border-table td { border: 1px solid black; padding: 5px; text-align: center; }
  </style>
</head>
<body>
`;

const HTML_DOC_TEMPLATE_END = `</body></html>`;

function getExamHeaderHtml(exam: Exam) {
  return `
    <table class="header">
      <tr>
        <td style="width: 40%;">
          <div class="school-name">${exam.orgName || "UBND XÃ ĐỒNG YÊN"}</div>
          <div class="school-name">${exam.schoolName || "TRƯỜNG THCS ĐỒNG YÊN"}</div>
        </td>
        <td style="width: 60%;" class="exam-title-box">
          <div class="exam-title">${exam.title}</div>
          <div class="exam-meta">
            Môn: ${exam.subject || "Tiếng Anh"} - Lớp: ${exam.grade}<br/>
            Năm học: ${exam.academicYear || "2023-2024"}<br/>
            Thời gian làm bài: ${exam.duration} phút
          </div>
        </td>
      </tr>
    </table>
  `;
}

function getExamContentHtml(exam: Exam) {
  return `
    <div class="student-info">
      Họ và tên học sinh: ..................................................... Lớp: ............. <br/><br/>
      Điểm: ................................. Lời phê của giáo viên: ..............................................................
    </div>
    
    <div style="margin-top: 20px;">
      ${exam.parts.map((part, pIdx) => `
        <div>
          <div class="part-title">${part.title}</div>
          <div class="instruction">${part.instruction}</div>
          ${part.questions.map((q, qIdx) => `
            <div class="question">
              <span class="question-text">Câu ${q.id}.</span> ${q.questionText}
              ${q.options.length > 0 ? `
              <table class="options-table">
                <tr>
                  ${q.options.map(opt => `<td>${opt}</td>`).join("")}
                </tr>
              </table>
              ` : `<div style="margin-top: 20px; border-bottom: 1px dotted black; height: 100px;"></div>`}
            </div>
          `).join("")}
        </div>
      `).join("")}
    </div>
  `;
}

function getAnswersContentHtml(exam: Exam) {
  let answersTable = `
    <h2 style="text-align: center; text-transform: uppercase;">ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM</h2>
    <h3 style="text-align: center;">${exam.title}</h3>
    
    <h4 style="margin-top: 20px;">I. BẢNG ĐÁP ÁN TRẮC NGHIỆM (0.25 điểm / câu)</h4>
    <table class="border-table">
      <thead>
        <tr>
          <th>Câu hỏi</th>
          <th>Đáp án</th>
          <th>Chủ đề</th>
          <th>Mức độ</th>
        </tr>
      </thead>
      <tbody>
        ${exam.parts.flatMap(p => p.questions).filter(q => q.options.length > 0).map((q, idx) => `
          <tr>
            <td style="font-weight: bold;">Câu ${q.id}</td>
            <td style="font-weight: bold; color: red;">${q.correctAnswer}</td>
            <td>${q.topic || "Ngữ pháp/Từ vựng"}</td>
            <td>${q.difficulty}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;

  if (exam.transcripts) {
    answersTable += `
      <h4 style="margin-top: 20px;">II. LISTENING TRANSCRIPT</h4>
      <div class="markdown-content">
        ${exam.transcripts.replace(/\\n/g, "<br/>")}
      </div>
    `;
  }

  if (exam.writingRubric) {
    answersTable += `
      <h4 style="margin-top: 20px;">III. WRITING RUBRIC & SAMPLE</h4>
      <div class="markdown-content">
        ${exam.writingRubric.replace(/\\n/g, "<br/>")}
      </div>
    `;
  }

  return answersTable;
}

// Convert markdown-like tables to basic HTML tables for Matrix and Spec
function markdownToHtml(md: string) {
  if (!md) return "";
  let html = md.replace(/\\n/g, "<br/>");
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>');
  
  // Convert simple markdown tables to HTML tables (naive approach for this specific output)
  const rows = html.split('<br/>').filter(r => r.trim().startsWith('|'));
  if (rows.length > 2) {
    const tableHtml = ['<table class="border-table">'];
    rows.forEach((row, index) => {
      if (row.includes('---')) return;
      const cols = row.split('|').filter(c => c.trim());
      tableHtml.push('<tr>');
      cols.forEach(col => {
        if (index === 0) tableHtml.push(`<th>${col.trim()}</th>`);
        else tableHtml.push(`<td>${col.trim()}</td>`);
      });
      tableHtml.push('</tr>');
    });
    tableHtml.push('</table>');
    
    // Replace the first table block found
    const firstRow = rows[0];
    const lastRow = rows[rows.length - 1];
    const startIndex = html.indexOf(firstRow);
    const endIndex = html.indexOf(lastRow) + lastRow.length;
    html = html.substring(0, startIndex) + tableHtml.join('') + html.substring(endIndex);
  }

  return `<div class="markdown-content">${html}</div>`;
}


// --- Export Functions ---

function downloadBlobAsFile(content: string, filename: string) {
  const blob = new Blob([content], { type: "application/msword" });
  saveAs(blob, filename);
}

export function exportToWord(exam: Exam) {
  const htmlContent = HTML_DOC_TEMPLATE_START + getExamHeaderHtml(exam) + getExamContentHtml(exam) + HTML_DOC_TEMPLATE_END;
  downloadBlobAsFile(htmlContent, `${exam.title.replace(/\\s+/g, "_")}.doc`);
}

export function exportAnswersToWord(exam: Exam) {
  const htmlContent = HTML_DOC_TEMPLATE_START + getAnswersContentHtml(exam) + HTML_DOC_TEMPLATE_END;
  downloadBlobAsFile(htmlContent, `Dap_An_${exam.title.replace(/\\s+/g, "_")}.doc`);
}

export function exportMatrixToWord(exam: Exam) {
  const content = exam.matrixData ? markdownToHtml(exam.matrixData) : "<h2>Chưa có ma trận</h2>";
  const htmlContent = HTML_DOC_TEMPLATE_START + `<h2 style="text-align:center;">MA TRẬN ĐỀ THI</h2>` + content + HTML_DOC_TEMPLATE_END;
  downloadBlobAsFile(htmlContent, `Ma_Tran_${exam.title.replace(/\\s+/g, "_")}.doc`);
}

export function exportSpecToWord(exam: Exam) {
  const content = exam.specData ? markdownToHtml(exam.specData) : "<h2>Chưa có bản đặc tả</h2>";
  const htmlContent = HTML_DOC_TEMPLATE_START + `<h2 style="text-align:center;">BẢN ĐẶC TẢ ĐỀ THI</h2>` + content + HTML_DOC_TEMPLATE_END;
  downloadBlobAsFile(htmlContent, `Dac_Ta_${exam.title.replace(/\\s+/g, "_")}.doc`);
}

export async function exportAllToZip(exam: Exam) {
  const zip = new JSZip();
  
  const testHtml = HTML_DOC_TEMPLATE_START + getExamHeaderHtml(exam) + getExamContentHtml(exam) + HTML_DOC_TEMPLATE_END;
  const answersHtml = HTML_DOC_TEMPLATE_START + getAnswersContentHtml(exam) + HTML_DOC_TEMPLATE_END;
  
  const matrixHtml = HTML_DOC_TEMPLATE_START + `<h2 style="text-align:center;">MA TRẬN ĐỀ THI</h2>` + markdownToHtml(exam.matrixData || "") + HTML_DOC_TEMPLATE_END;
  const specHtml = HTML_DOC_TEMPLATE_START + `<h2 style="text-align:center;">BẢN ĐẶC TẢ ĐỀ THI</h2>` + markdownToHtml(exam.specData || "") + HTML_DOC_TEMPLATE_END;

  zip.file(`De_Thi_${exam.title.replace(/\\s+/g, "_")}.doc`, testHtml);
  zip.file(`Dap_An_${exam.title.replace(/\\s+/g, "_")}.doc`, answersHtml);
  zip.file(`Ma_Tran_${exam.title.replace(/\\s+/g, "_")}.doc`, matrixHtml);
  zip.file(`Dac_Ta_${exam.title.replace(/\\s+/g, "_")}.doc`, specHtml);

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `Bo_De_${exam.title.replace(/\\s+/g, "_")}.zip`);
}

