const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Replace old PDF import with new documents import
content = content.replace(
  `import { extractTextFromPDF, saveTextbookForGrade, getTextbookForGrade, deleteTextbookForGrade } from "./services/pdf";`,
  `import { processAndStoreFiles, getAllDocuments, deleteDocument, buildKnowledgeContext, ACCEPTED_FILE_TYPES, DocCategory, UploadedDocument } from "./services/documents";`
);

// 2. Add Upload lucide icon
if (!content.includes('Upload,')) {
  content = content.replace(
    `  Check\n} from "lucide-react";`,
    `  Check,\n  Upload,\n  FolderOpen\n} from "lucide-react";`
  );
}

// 3. Replace old textbook states with new document states
content = content.replace(
  `const [activeTab, setActiveTab] = useState<"create" | "repository" | "analytics" | "tutor" | "textbook">("create");
  const [textbooks, setTextbooks] = useState<Record<number, any>>({});
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [pdfUploadGrade, setPdfUploadGrade] = useState<number>(6);`,

  `const [activeTab, setActiveTab] = useState<"create" | "repository" | "analytics" | "tutor" | "resources">("create");
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDocument[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [docUploadGrade, setDocUploadGrade] = useState<number>(6);
  const [docUploadCategory, setDocUploadCategory] = useState<DocCategory>("textbook");`
);

// 4. Replace textbook loading useEffect  
content = content.replace(
  `  // Load Textbooks
  useEffect(() => {
    const loadTBs = async () => {
      const tbs = {};
      for (const g of [6, 7, 8, 9]) {
        const tb = await getTextbookForGrade(g);
        if (tb) tbs[g] = tb;
      }
      setTextbooks(tbs);
    };
    loadTBs();
  }, []);`,

  `  // Load uploaded documents
  useEffect(() => {
    const loadDocs = async () => {
      const docs = await getAllDocuments();
      setUploadedDocs(docs);
    };
    loadDocs();
  }, []);`
);

// 5. Replace old PDF handlers with new multi-file handler
content = content.replace(
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
  };`,

  `  // Multi-file document upload handler (PDF, Word, Excel)
  const handleMultiFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    showToast(\`Đang trích xuất dữ liệu từ \${files.length} tệp tin (có thể mất vài chục giây)...\`, "info");
    try {
      const newDocs = await processAndStoreFiles(files, docUploadCategory, docUploadGrade);
      setUploadedDocs(prev => [...prev, ...newDocs]);
      showToast(\`Đã tải lên và lưu trữ thành công \${newDocs.length} tệp tin!\`, "success");
    } catch (err: any) {
      showToast("Lỗi xử lý tệp: " + err.message, "error");
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleDeleteDoc = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa tệp tin này?")) {
      await deleteDocument(id);
      setUploadedDocs(prev => prev.filter(d => d.id !== id));
      showToast("Đã xóa tệp tin.", "success");
    }
  };

  const getCategoryLabel = (cat: DocCategory) => {
    const map: Record<DocCategory, string> = {
      sample_exam: "Đề mẫu",
      matrix: "Ma trận",
      spec: "Đặc tả",
      textbook: "SGK / Tài liệu",
      other: "Khác"
    };
    return map[cat] || cat;
  };

  const getFileIcon = (type: string) => {
    if (type === "pdf") return "📄";
    if (type === "doc" || type === "docx") return "📝";
    if (type === "xls" || type === "xlsx") return "📊";
    return "📎";
  };`
);

// 6. Replace pdfContext in handleGenerateExam
content = content.replace(
  `        const pdfContext = textbooks[selectedGrade]?.text;
        result = await generateExamAI(selectedGrade, selectedUnits, testType, difficulty, customPrompt, term, academicYear, pdfContext, customApiKey, selectedModel);`,

  `        const pdfContext = await buildKnowledgeContext(selectedGrade, selectedUnits);
        result = await generateExamAI(selectedGrade, selectedUnits, testType, difficulty, customPrompt, term, academicYear, pdfContext || undefined, customApiKey, selectedModel);`
);

// 7. Replace textbook tab button label
content = content.replace(
  `              <button 
                onClick={() => { setActiveTab("textbook"); setExamMode("none"); }}
                className={\`px-3 py-1.5 rounded-md transition-all \${activeTab === "textbook" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"}\`}
              >
                📚 Sách Khoá
              </button>`,
  `              <button 
                onClick={() => { setActiveTab("resources"); setExamMode("none"); }}
                className={\`px-3 py-1.5 rounded-md transition-all \${activeTab === "resources" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"}\`}
              >
                📚 Ngân Hàng
              </button>`
);

// 8. Find the TAB 4 section and insert TAB 5 BEFORE it
const tab4Marker = `          {/* TAB 4: GENERAL AI TUTOR PORTAL */}`;
const resourcesTabUI = `
          {/* TAB 5: RESOURCE LIBRARY (PDF, Word, Excel uploads) */}
          {activeTab === "resources" && examMode === "none" && (
            <div className="space-y-6">
              {/* Upload Panel */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-emerald-500 rounded-xl text-white">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">Ngân hàng Tài liệu & Sách giáo khoa</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Tải lên Đề mẫu, Ma trận, Đặc tả, SGK (PDF / Word / Excel) – hỗ trợ nhiều file cùng lúc. Dữ liệu được lưu vĩnh viễn trên trình duyệt.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Phân loại tài liệu</label>
                    <select
                      value={docUploadCategory}
                      onChange={(e) => setDocUploadCategory(e.target.value as DocCategory)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="textbook">📚 Sách giáo khoa / Tài liệu dạy học</option>
                      <option value="sample_exam">📋 Đề mẫu tham khảo</option>
                      <option value="matrix">📊 Ma trận đề thi</option>
                      <option value="spec">📝 Đặc tả đề thi</option>
                      <option value="other">📎 Tài liệu khác</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Khối lớp</label>
                    <select
                      value={docUploadGrade}
                      onChange={(e) => setDocUploadGrade(Number(e.target.value))}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value={6}>Lớp 6</option>
                      <option value={7}>Lớp 7</option>
                      <option value={8}>Lớp 8</option>
                      <option value={9}>Lớp 9</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Chọn tệp tải lên</label>
                    <label className={\`block w-full text-center cursor-pointer \${isUploading ? 'bg-blue-300 cursor-wait' : 'bg-blue-600 hover:bg-blue-700'} text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm\`}>
                      {isUploading ? "⏳ Đang xử lý..." : "📂 Chọn file (PDF, Word, Excel)"}
                      <input
                        type="file"
                        accept={ACCEPTED_FILE_TYPES}
                        multiple
                        className="hidden"
                        onChange={handleMultiFileUpload}
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700">
                  <strong>💡 Mẹo:</strong> Bạn có thể chọn nhiều file cùng lúc (giữ Ctrl/Cmd khi chọn). Hỗ trợ: <strong>.pdf, .doc, .docx, .xls, .xlsx, .txt</strong>. AI sẽ tự động trích xuất nội dung và sử dụng làm ngân hàng kiến thức để ra đề chính xác hơn.
                </div>
              </div>

              {/* Stored Documents */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-blue-600" />
                    Tài liệu đã lưu trữ ({uploadedDocs.length} tệp)
                  </h3>
                </div>

                {uploadedDocs.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 italic text-sm">
                    <Upload className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p>Chưa có tài liệu nào được tải lên.</p>
                    <p className="text-xs mt-1">Hãy tải lên SGK, đề mẫu, ma trận... để AI ra đề chính xác hơn!</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {/* Group by grade */}
                    {[6, 7, 8, 9].map(grade => {
                      const gradeDocs = uploadedDocs.filter(d => d.grade === grade);
                      if (gradeDocs.length === 0) return null;
                      return (
                        <div key={grade} className="mb-4">
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <span className="bg-blue-100 text-blue-700 font-bold w-6 h-6 flex items-center justify-center rounded text-[10px]">L{grade}</span>
                            Lớp {grade} ({gradeDocs.length} tệp)
                          </h4>
                          <div className="space-y-1.5">
                            {gradeDocs.map(doc => (
                              <div key={doc.id} className="flex items-center justify-between bg-slate-50 hover:bg-slate-100 rounded-xl px-4 py-2.5 transition-colors group">
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                  <span className="text-lg flex-shrink-0">{getFileIcon(doc.fileType)}</span>
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium text-slate-800 truncate">{doc.fileName}</p>
                                    <p className="text-[10px] text-slate-400">
                                      {getCategoryLabel(doc.category)} · {(doc.fileSize / 1024).toFixed(0)} KB · {new Date(doc.uploadedAt).toLocaleDateString("vi-VN")}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-medium">{doc.fileType.toUpperCase()}</span>
                                  <button
                                    onClick={() => handleDeleteDoc(doc.id)}
                                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                    title="Xóa tệp"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

`;

content = content.replace(tab4Marker, resourcesTabUI + tab4Marker);

fs.writeFileSync('src/App.tsx', content);
console.log('Patch 2 completed: Updated App.tsx with Resources tab and multi-file upload.');
