const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add imports
content = content.replace(
  `import { initialExams } from "./demoData";\nimport { shuffleExam, exportToWord, exportAnswersToWord, exportMatrixToWord, exportSpecToWord, exportAllToZip } from "./utils";`,
  `import { initialExams } from "./demoData";\nimport { shuffleExam, exportToWord, exportAnswersToWord, exportMatrixToWord, exportSpecToWord, exportAllToZip } from "./utils";\nimport { generateExamAI, chatWithTutorAI, analyzeMatrixAI } from "./services/ai";\nimport { extractTextFromPDF, saveTextbookForGrade, getTextbookForGrade, deleteTextbookForGrade } from "./services/pdf";`
);

// 2. Add activeTab and textbook states
content = content.replace(
  `const [activeTab, setActiveTab] = useState<"create" | "repository" | "analytics" | "tutor">("create");`,
  `const [activeTab, setActiveTab] = useState<"create" | "repository" | "analytics" | "tutor" | "textbook">("create");\n  const [textbooks, setTextbooks] = useState<Record<number, any>>({});\n  const [uploadingPdf, setUploadingPdf] = useState(false);\n  const [pdfUploadGrade, setPdfUploadGrade] = useState<number>(6);\n`
);

// 3. Add load textbooks useEffect
content = content.replace(
  `  // Save to local storage on change\n  useEffect(() => {`,
  `  // Load Textbooks\n  useEffect(() => {\n    const loadTBs = async () => {\n      const tbs = {};\n      for (const g of [6, 7, 8, 9]) {\n        const tb = await getTextbookForGrade(g);\n        if (tb) tbs[g] = tb;\n      }\n      setTextbooks(tbs);\n    };\n    loadTBs();\n  }, []);\n\n  // Save to local storage on change\n  useEffect(() => {`
);

// 4. Add PDF handling methods before handleGenerateExam
content = content.replace(
  `  // Generate Exam using server API\n  const handleGenerateExam = async () => {`,
  `  // PDF Textbook Handling
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>, grade: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPdf(true);
    showToast(\`Đang trích xuất dữ liệu SGK Lớp \${grade} (Việc này có thể mất vài chục giây)...\`, "info");
    try {
      const text = await extractTextFromPDF(file);
      await saveTextbookForGrade(grade, text, file.name);
      setTextbooks(prev => ({ ...prev, [grade]: { fileName: file.name, text, updatedAt: new Date().toISOString() } }));
      showToast("Trích xuất và lưu SGK thành công!", "success");
    } catch (err: any) {
      showToast("Lỗi đọc PDF: " + err.message, "error");
    } finally {
      setUploadingPdf(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleDeletePdf = async (grade: number) => {
    if (confirm(\`Bạn có chắc chắn muốn xóa dữ liệu SGK Lớp \${grade} khỏi hệ thống?\`)) {
      await deleteTextbookForGrade(grade);
      setTextbooks(prev => {
        const newTbs = { ...prev };
        delete newTbs[grade];
        return newTbs;
      });
      showToast("Đã xóa dữ liệu SGK.", "success");
    }
  };

  // Generate Exam using AI (Frontend)
  const handleGenerateExam = async () => {`
);

// 5. Replace handleGenerateExam body
content = content.replace(
  `      const isUsingMatrixFile = !!matrixFileContent;
      const endpoint = isUsingMatrixFile ? "/api/analyze-matrix" : "/api/generate-test";
      const payload = isUsingMatrixFile ? {
        fileName: matrixFileName,
        fileContent: matrixFileContent,
        grade: selectedGrade,
        testType,
        apiKey: customApiKey,
        selectedModel
      } : {
        grade: selectedGrade,
        units: selectedUnits,
        testType,
        difficulty,
        customPrompt,
        apiKey: customApiKey,
        selectedModel,
        term,
        academicYear
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Không thể khởi tạo đề thi.");
      }

      const result = await res.json();`,
  `      const isUsingMatrixFile = !!matrixFileContent;
      let result;
      if (isUsingMatrixFile) {
        result = await analyzeMatrixAI(matrixFileName, matrixFileContent, selectedGrade, testType, customApiKey, selectedModel);
      } else {
        const pdfContext = textbooks[selectedGrade]?.text;
        result = await generateExamAI(selectedGrade, selectedUnits, testType, difficulty, customPrompt, term, academicYear, pdfContext, customApiKey, selectedModel);
      }`
);

// 6. Replace handleSendTutorMessage body
content = content.replace(
  `      const res = await fetch("/api/chat-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.text,
          contextExam: currentExam,
          apiKey: customApiKey,
          selectedModel
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Không thể nhận phản hồi từ AI.");
      }

      const result = await res.json();
      setTutorMessages(prev => [...prev, { role: "model", text: result.text }]);`,
  `      const text = await chatWithTutorAI(userMsg.text, currentExam, customApiKey, selectedModel);
      setTutorMessages(prev => [...prev, { role: "model", text }]);`
);

// 7. Add textbook tab in Navigation
content = content.replace(
  `              <button 
                onClick={() => { setActiveTab("tutor"); setExamMode("none"); }}
                className={\`px-3 py-1.5 rounded-md transition-all \${activeTab === "tutor" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"}\`}
              >
                💬 Gia Sư AI
              </button>`,
  `              <button 
                onClick={() => { setActiveTab("tutor"); setExamMode("none"); }}
                className={\`px-3 py-1.5 rounded-md transition-all \${activeTab === "tutor" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"}\`}
              >
                💬 Gia Sư AI
              </button>
              <button 
                onClick={() => { setActiveTab("textbook"); setExamMode("none"); }}
                className={\`px-3 py-1.5 rounded-md transition-all \${activeTab === "textbook" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"}\`}
              >
                📚 Sách Khoá
              </button>`
);

// 8. Remove the API key missing warning completely (so we don't annoy users since we have Free API)
content = content.replace(
  `{!customApiKey && activeTab === "create" && (
          <div className="no-print mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-800 text-sm">Chưa cấu hình Gemini API Key</h4>
                <p className="text-xs text-amber-700 mt-1">
                  Hãy nhấp vào "Cài đặt" để lưu API Key. Bạn vẫn có thể trải nghiệm ngay tất cả tính năng của ứng dụng bằng cách xem, làm bài kiểm tra thử, hoặc xáo trộn <strong>các đề thi mẫu có sẵn</strong> trong "Kho Đề".
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowSettingsModal(true)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors flex-shrink-0 cursor-pointer"
            >
              Nhập API Key ngay
            </button>
          </div>
        )}`,
  ``
);

// 9. Add the Textbook UI tab
const textbookTabUI = `
          {/* TAB 5: TEXTBOOK UPLOAD */}
          {activeTab === "textbook" && examMode === "none" && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Quản lý Sách giáo khoa (PDF)</h2>
                  <p className="text-sm text-slate-500">Tải lên các cuốn sách giáo khoa định dạng PDF để AI học kiến thức và ra đề bám sát nội dung sách.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[6, 7, 8, 9].map(grade => {
                  const tb = textbooks[grade];
                  return (
                    <div key={grade} className="p-5 border rounded-xl bg-slate-50 relative overflow-hidden">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-100 text-blue-700 font-bold w-10 h-10 flex items-center justify-center rounded-lg">L{grade}</div>
                          <h3 className="font-bold text-slate-800">Sách giáo khoa Lớp {grade}</h3>
                        </div>
                        {tb && (
                          <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Đã nạp dữ liệu
                          </span>
                        )}
                      </div>

                      {tb ? (
                        <div className="space-y-3">
                          <p className="text-sm text-slate-600 break-words line-clamp-1"><span className="font-medium">File:</span> {tb.fileName}</p>
                          <p className="text-xs text-slate-500">Nạp lúc: {new Date(tb.updatedAt).toLocaleString("vi-VN")}</p>
                          <div className="flex gap-2 pt-2">
                            <label className="flex-1 cursor-pointer bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium text-center transition-colors">
                              Cập nhật file khác
                              <input type="file" accept=".pdf" className="hidden" onChange={(e) => handlePdfUpload(e, grade)} disabled={uploadingPdf} />
                            </label>
                            <button onClick={() => handleDeletePdf(grade)} className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors" disabled={uploadingPdf} title="Xóa dữ liệu">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-sm text-slate-500 italic">Chưa có dữ liệu sách giáo khoa. AI sẽ sử dụng kiến thức chung để ra đề.</p>
                          <label className={\`block w-full cursor-pointer \${uploadingPdf ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'} text-white px-4 py-2.5 rounded-lg text-sm font-semibold text-center transition-colors shadow-sm\`}>
                            {uploadingPdf ? "Đang xử lý PDF..." : "Tải lên file PDF"}
                            <input type="file" accept=".pdf" className="hidden" onChange={(e) => handlePdfUpload(e, grade)} disabled={uploadingPdf} />
                          </label>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
`;

content = content.replace(
  `          {/* TAB 4: AI TUTOR */}`,
  textbookTabUI + `\n          {/* TAB 4: AI TUTOR */}`
);

fs.writeFileSync('src/App.tsx', content);
console.log('Patched App.tsx successfully.');
