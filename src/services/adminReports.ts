/**
 * Admin Report Exporter
 * Generates Word/Excel reports with official MoET header format
 */
import { saveAs } from "file-saver";
import { Exam, User, AssignedExam, StudentResult, ClassScoreStats, ActivityLog } from "../types";

// ---- Shared Word HTML Template ----

const REPORT_DOC_START = `
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
    @page { size: A4; margin: 2cm 2cm 2cm 2.5cm; }
    body { font-family: 'Times New Roman', Times, serif; font-size: 13pt; line-height: 1.5; color: #000; }
    h2 { text-align: center; font-size: 14pt; font-weight: bold; text-transform: uppercase; margin: 12pt 0 6pt; }
    h3 { font-size: 13pt; font-weight: bold; margin: 10pt 0 4pt; }
    table.report { width: 100%; border-collapse: collapse; font-size: 12pt; margin: 8pt 0; }
    table.report th, table.report td { border: 1px solid #000; padding: 4pt 6pt; text-align: left; }
    table.report th { background-color: #f0f0f0; font-weight: bold; text-align: center; }
    table.report td.center { text-align: center; }
    table.report td.right { text-align: right; }
    .header-table { width: 100%; border: none; border-collapse: collapse; margin-bottom: 10pt; }
    .header-table td { vertical-align: top; border: none; padding: 0 5pt; }
    .col-left { width: 40%; text-align: center; }
    .col-right { width: 60%; text-align: center; }
    .org-name { font-size: 12pt; text-transform: uppercase; }
    .school-name { font-size: 12pt; font-weight: bold; text-transform: uppercase; }
    .underline-short { display: block; width: 60%; margin: 2pt auto 0 auto; border-bottom: 1.5pt solid #000; }
    p.note { font-size: 11pt; font-style: italic; color: #555; }
  </style>
</head>
<body>
`;

const REPORT_DOC_END = `</body></html>`;

function makeReportHeader(title: string, subtitle?: string): string {
  const today = new Date();
  const dateStr = `Ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;
  return `
<table class="header-table">
  <tr>
    <td class="col-left">
      <span class="org-name">UBND XÃ ĐỒNG YÊN</span><br>
      <span class="school-name">TRƯỜNG THCS ĐỒNG YÊN</span>
      <span class="underline-short"></span>
    </td>
    <td class="col-right">
      <b>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</b><br>
      <b>Độc lập - Tự do - Hạnh phúc</b>
      <span class="underline-short"></span><br>
      <i>${dateStr}</i>
    </td>
  </tr>
</table>
<h2>${title}</h2>
${subtitle ? `<p style="text-align:center;font-style:italic;font-size:12pt;">${subtitle}</p>` : ""}
`;
}

function saveWordFile(html: string, filename: string) {
  const fullHtml = REPORT_DOC_START + html + REPORT_DOC_END;
  const blob = new Blob(["\ufeff", fullHtml], { type: "application/msword" });
  saveAs(blob, filename);
}

function saveExcelFile(html: string, filename: string) {
  const fullHtml = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Sheet1</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>
<body>${html}</body></html>`;
  const blob = new Blob(["\ufeff", fullHtml], { type: "application/vnd.ms-excel" });
  saveAs(blob, filename);
}

// ---- Helper: Test type label ----
function getTestTypeLabel(t: string): string {
  const map: Record<string, string> = {
    "15m": "Kiểm tra 15 phút",
    "midterm1": "Giữa kỳ I",
    "finalterm1": "Cuối kỳ I",
    "midterm2": "Giữa kỳ II",
    "finalterm2": "Cuối kỳ II",
  };
  return map[t] || t;
}

function getExamStatusLabel(s?: string): string {
  const map: Record<string, string> = {
    draft: "Nháp",
    saved: "Đã lưu",
    exported: "Đã xuất file",
    assigned: "Đã giao HS",
  };
  return s ? (map[s] || s) : "Đã lưu";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("vi-VN");
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("vi-VN");
}

// =========================================================
// 1. Export Teacher Report (Danh sách GV đã ra đề)
// =========================================================
export function exportTeacherReport(
  users: User[],
  exams: Exam[],
  format: "word" | "excel" = "word"
) {
  const teachers = users.filter(u => u.role === "teacher");
  let rows = "";
  teachers.forEach((t, i) => {
    const teacherExams = exams.filter(e => e.creatorId === t.id);
    const examsByType: Record<string, number> = {};
    teacherExams.forEach(e => {
      const label = getTestTypeLabel(e.testType);
      examsByType[label] = (examsByType[label] || 0) + 1;
    });
    const typeBreakdown = Object.entries(examsByType).map(([k, v]) => `${k}: ${v}`).join(", ") || "-";
    const grades = [...new Set(teacherExams.map(e => e.grade))].sort().join(", ") || "-";

    rows += `<tr>
      <td class="center">${i + 1}</td>
      <td>${t.fullName}</td>
      <td>${t.username}</td>
      <td>${t.school}</td>
      <td>Tiếng Anh</td>
      <td class="center">${grades}</td>
      <td class="center">${teacherExams.length}</td>
      <td>${typeBreakdown}</td>
      <td class="center">${teacherExams.length > 0 ? formatDate(teacherExams[teacherExams.length - 1].createdAt) : "-"}</td>
    </tr>`;
  });

  const html = makeReportHeader("BÁO CÁO DANH SÁCH GIÁO VIÊN ĐÃ RA ĐỀ", `Tổng số giáo viên: ${teachers.length} — Tổng số đề: ${exams.length}`) + `
<table class="report">
  <thead>
    <tr>
      <th>STT</th>
      <th>Họ và tên</th>
      <th>Tên đăng nhập</th>
      <th>Trường</th>
      <th>Môn</th>
      <th>Khối</th>
      <th>Số đề</th>
      <th>Phân loại đề</th>
      <th>Ngày tạo gần nhất</th>
    </tr>
  </thead>
  <tbody>${rows}</tbody>
</table>
`;

  if (format === "excel") {
    saveExcelFile(html, "BaoCao_GiaoVien_RaDe.xls");
  } else {
    saveWordFile(html, "BaoCao_GiaoVien_RaDe.doc");
  }
}

// =========================================================
// 2. Export Exam List Report (Danh sách đề đã tạo)
// =========================================================
export function exportExamReport(exams: Exam[], users: User[], format: "word" | "excel" = "word") {
  let rows = "";
  exams.forEach((e, i) => {
    const creator = users.find(u => u.id === e.creatorId);
    rows += `<tr>
      <td class="center">${i + 1}</td>
      <td>${e.title}</td>
      <td>${creator?.fullName || e.creatorName || "Hệ thống"}</td>
      <td>Tiếng Anh</td>
      <td class="center">${e.grade}</td>
      <td>${getTestTypeLabel(e.testType)}</td>
      <td class="center">${e.duration} phút</td>
      <td class="center">${e.totalQuestions}</td>
      <td>${getExamStatusLabel(e.status)}</td>
      <td class="center">${formatDate(e.createdAt)}</td>
    </tr>`;
  });

  const html = makeReportHeader("BÁO CÁO DANH SÁCH ĐỀ KIỂM TRA", `Tổng số đề: ${exams.length}`) + `
<table class="report">
  <thead>
    <tr>
      <th>STT</th>
      <th>Tên đề</th>
      <th>Giáo viên</th>
      <th>Môn</th>
      <th>Khối</th>
      <th>Loại đề</th>
      <th>Thời gian</th>
      <th>Số câu</th>
      <th>Trạng thái</th>
      <th>Ngày tạo</th>
    </tr>
  </thead>
  <tbody>${rows}</tbody>
</table>
`;

  if (format === "excel") {
    saveExcelFile(html, "BaoCao_DanhSach_De.xls");
  } else {
    saveWordFile(html, "BaoCao_DanhSach_De.doc");
  }
}

// =========================================================
// 3. Export Student Results Report (Danh sách HS đã làm bài)
// =========================================================
export function exportStudentResultReport(
  assignedExams: AssignedExam[],
  format: "word" | "excel" = "word"
) {
  const allResults = assignedExams.flatMap(a =>
    a.results.map(r => ({ ...r, examTitle: a.examTitle, examId: a.examId, assignmentId: a.id }))
  );

  let rows = "";
  allResults.forEach((r, i) => {
    rows += `<tr>
      <td class="center">${i + 1}</td>
      <td>${r.studentName}</td>
      <td class="center">${r.gradeClass || "-"}</td>
      <td>${r.examTitle}</td>
      <td class="center">${r.correctCount}/${r.totalQuestions}</td>
      <td class="center">${r.totalQuestions - r.correctCount}</td>
      <td class="center"><b>${r.score.toFixed(1)}</b></td>
      <td class="center">${r.score >= 5 ? "Đạt" : "Chưa đạt"}</td>
      <td class="center">${formatDateTime(r.takenAt)}</td>
    </tr>`;
  });

  const html = makeReportHeader("BÁO CÁO KẾT QUẢ HỌC SINH LÀM BÀI TRỰC TUYẾN", `Tổng số lượt thi: ${allResults.length}`) + `
<table class="report">
  <thead>
    <tr>
      <th>STT</th>
      <th>Họ tên HS</th>
      <th>Lớp</th>
      <th>Đề thi</th>
      <th>Số câu đúng</th>
      <th>Số câu sai</th>
      <th>Điểm</th>
      <th>Kết quả</th>
      <th>Thời gian nộp</th>
    </tr>
  </thead>
  <tbody>${rows}</tbody>
</table>
`;

  if (format === "excel") {
    saveExcelFile(html, "BaoCao_KetQua_HocSinh.xls");
  } else {
    saveWordFile(html, "BaoCao_KetQua_HocSinh.doc");
  }
}

// =========================================================
// 4. Export Class Score Report (Bảng điểm theo lớp)
// =========================================================
export function exportClassScoreReport(
  stats: ClassScoreStats[],
  format: "word" | "excel" = "word"
) {
  let rows = "";
  stats.forEach((s, i) => {
    rows += `<tr>
      <td class="center">${i + 1}</td>
      <td>${s.gradeClass}</td>
      <td class="center">${s.totalStudents}</td>
      <td class="center">${s.submittedCount}</td>
      <td class="center">${s.notSubmittedCount}</td>
      <td class="center"><b>${s.averageScore.toFixed(1)}</b></td>
      <td class="center">${s.highestScore.toFixed(1)}</td>
      <td class="center">${s.lowestScore.toFixed(1)}</td>
      <td class="center">${s.passCount}</td>
      <td class="center">${s.failCount}</td>
    </tr>`;
  });

  const totalSubmitted = stats.reduce((a, s) => a + s.submittedCount, 0);
  const overallAvg = totalSubmitted > 0
    ? (stats.reduce((a, s) => a + s.averageScore * s.submittedCount, 0) / totalSubmitted).toFixed(1)
    : "0.0";

  const html = makeReportHeader("BẢNG THỐNG KÊ ĐIỂM KIỂM TRA THEO LỚP", `Tổng số lớp: ${stats.length} — Tổng lượt thi: ${totalSubmitted} — Điểm TB chung: ${overallAvg}`) + `
<table class="report">
  <thead>
    <tr>
      <th>STT</th>
      <th>Lớp</th>
      <th>Sĩ số</th>
      <th>Đã làm</th>
      <th>Chưa làm</th>
      <th>ĐTB</th>
      <th>Cao nhất</th>
      <th>Thấp nhất</th>
      <th>Đạt (≥5)</th>
      <th>Chưa đạt</th>
    </tr>
  </thead>
  <tbody>${rows}</tbody>
</table>
`;

  if (format === "excel") {
    saveExcelFile(html, "BangDiem_TheoLop.xls");
  } else {
    saveWordFile(html, "BangDiem_TheoLop.doc");
  }
}

// =========================================================
// 5. Export School Summary Report (Báo cáo tổng hợp)
// =========================================================
export function exportSchoolSummaryReport(
  users: User[],
  exams: Exam[],
  assignedExams: AssignedExam[],
  classStats: ClassScoreStats[],
  format: "word" | "excel" = "word"
) {
  const teachers = users.filter(u => u.role === "teacher");
  const students = users.filter(u => u.role === "student");
  const allResults = assignedExams.flatMap(a => a.results);
  const totalSubmissions = allResults.length;
  const overallAvg = totalSubmissions > 0
    ? (allResults.reduce((a, r) => a + r.score, 0) / totalSubmissions).toFixed(1)
    : "0.0";

  // Teacher ranking
  const teacherRanking = teachers
    .map(t => ({ name: t.fullName, count: exams.filter(e => e.creatorId === t.id).length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  let teacherRows = "";
  teacherRanking.forEach((t, i) => {
    teacherRows += `<tr><td class="center">${i + 1}</td><td>${t.name}</td><td class="center">${t.count}</td></tr>`;
  });

  // Class stats
  let classRows = "";
  classStats.forEach((s, i) => {
    classRows += `<tr>
      <td class="center">${i + 1}</td>
      <td>${s.gradeClass}</td>
      <td class="center">${s.submittedCount}</td>
      <td class="center">${s.averageScore.toFixed(1)}</td>
      <td class="center">${s.passCount}</td>
      <td class="center">${s.failCount}</td>
    </tr>`;
  });

  const html = makeReportHeader("BÁO CÁO TỔNG HỢP HOẠT ĐỘNG KIỂM TRA ĐÁNH GIÁ", `Năm học ${new Date().getFullYear()}-${new Date().getFullYear() + 1}`) + `
<h3>I. THỐNG KÊ TỔNG QUÁT</h3>
<table class="report">
  <tr><td style="width:60%">Tổng số giáo viên</td><td class="center"><b>${teachers.length}</b></td></tr>
  <tr><td>Tổng số học sinh</td><td class="center"><b>${students.length}</b></td></tr>
  <tr><td>Tổng số đề kiểm tra đã tạo</td><td class="center"><b>${exams.length}</b></td></tr>
  <tr><td>Tổng số lượt học sinh làm bài</td><td class="center"><b>${totalSubmissions}</b></td></tr>
  <tr><td>Điểm trung bình chung</td><td class="center"><b>${overallAvg}</b></td></tr>
  <tr><td>Tài khoản VIP đang hoạt động</td><td class="center"><b>${users.filter(u => u.isVip).length}</b></td></tr>
</table>

<h3>II. XẾP HẠNG GIÁO VIÊN RA ĐỀ</h3>
<table class="report">
  <thead><tr><th>Hạng</th><th>Giáo viên</th><th>Số đề</th></tr></thead>
  <tbody>${teacherRows}</tbody>
</table>

<h3>III. THỐNG KÊ ĐIỂM THEO LỚP</h3>
<table class="report">
  <thead><tr><th>STT</th><th>Lớp</th><th>Lượt thi</th><th>ĐTB</th><th>Đạt (≥5)</th><th>Chưa đạt</th></tr></thead>
  <tbody>${classRows}</tbody>
</table>
`;

  if (format === "excel") {
    saveExcelFile(html, "BaoCao_TongHop_ToanTruong.xls");
  } else {
    saveWordFile(html, "BaoCao_TongHop_ToanTruong.doc");
  }
}
