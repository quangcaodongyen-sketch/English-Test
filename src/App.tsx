import React, { useState, useEffect, useRef } from "react";
import { 
  FileText, 
  PlusCircle, 
  Settings, 
  Sparkles, 
  Trash2, 
  Play, 
  Printer, 
  FileDown, 
  Copy, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw, 
  HelpCircle, 
  Database, 
  BookOpen, 
  Trophy, 
  User, 
  Send, 
  ArrowRight, 
  Eye, 
  ListOrdered,
  FileSpreadsheet,
  Shuffle,
  EyeOff,
  Plus,
  Info,
  Check,
  Upload,
  FolderOpen
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Exam, Question, ExamPart, ExamHistory } from "./types";
import { initialExams } from "./demoData";
import { shuffleExam, exportToWord, exportAnswersToWord, exportMatrixToWord, exportSpecToWord, exportAllToZip } from "./utils";
import { generateExamAI, chatWithTutorAI, analyzeMatrixAI } from "./services/ai";
import { processAndStoreFiles, getAllDocuments, deleteDocument, buildKnowledgeContext, ACCEPTED_FILE_TYPES, DocCategory, UploadedDocument } from "./services/documents";

// Curriculum mapping for UI checkboxes
const GLOBAL_SUCCESS_UNITS: Record<number, { id: number; title: string }[]> = {
  6: [
    { id: 1, title: "Unit 1: My New School" },
    { id: 2, title: "Unit 2: My House" },
    { id: 3, title: "Unit 3: My Friends" },
    { id: 4, title: "Unit 4: My Neighbourhood" },
    { id: 5, title: "Unit 5: Natural Wonders of the World" },
    { id: 6, title: "Unit 6: Our Tet Holiday" },
    { id: 7, title: "Unit 7: Television" },
    { id: 8, title: "Unit 8: Sports and Games" },
    { id: 9, title: "Unit 9: Cities of the World" },
    { id: 10, title: "Unit 10: Our Houses in the Future" },
    { id: 11, title: "Unit 11: Our Greener World" },
    { id: 12, title: "Unit 12: Robots" }
  ],
  7: [
    { id: 1, title: "Unit 1: Hobbies" },
    { id: 2, title: "Unit 2: Healthy Living" },
    { id: 3, title: "Unit 3: Community Service" },
    { id: 4, title: "Unit 4: Music and Arts" },
    { id: 5, title: "Unit 5: Vietnamese Food and Drink" },
    { id: 6, title: "Unit 6: A Visit to School" },
    { id: 7, title: "Unit 7: Traffic" },
    { id: 8, title: "Unit 8: Films" },
    { id: 9, title: "Unit 9: Festivals around the World" },
    { id: 10, title: "Unit 10: Energy Sources" },
    { id: 11, title: "Unit 11: Travelling in the Future" },
    { id: 12, title: "Unit 12: An English-speaking World" }
  ],
  8: [
    { id: 1, title: "Unit 1: Leisure Time" },
    { id: 2, title: "Unit 2: Life in the Countryside" },
    { id: 3, title: "Unit 3: Teenagers" },
    { id: 4, title: "Unit 4: Ethnic Groups of Vietnam" },
    { id: 5, title: "Unit 5: Our Customs and Traditions" },
    { id: 6, title: "Unit 6: Lifestyles" },
    { id: 7, title: "Unit 7: Environmental Protection" },
    { id: 8, title: "Unit 8: Shopping" },
    { id: 9, title: "Unit 9: Natural Disasters" },
    { id: 10, title: "Unit 10: Communication in the Future" },
    { id: 11, title: "Unit 11: Science and Technology" },
    { id: 12, title: "Unit 12: Life on Other Planets" }
  ],
  9: [
    { id: 1, title: "Unit 1: Local Community" },
    { id: 2, title: "Unit 2: City Life" },
    { id: 3, title: "Unit 3: Teen Stress and Pressure" },
    { id: 4, title: "Unit 4: Life in the Past" },
    { id: 5, title: "Unit 5: Wonders of Vietnam" },
    { id: 6, title: "Unit 6: Vietnam: Then and Now" },
    { id: 7, title: "Unit 7: Recipes and Eating Habits" },
    { id: 8, title: "Unit 8: Tourism" },
    { id: 9, title: "Unit 9: English in the World" },
    { id: 10, title: "Unit 10: Space Travel" },
    { id: 11, title: "Unit 11: Changing Roles in Society" },
    { id: 12, title: "Unit 12: My Future Career" }
  ]
};

export default function App() {
  // Navigation & Core states
  const [activeTab, setActiveTab] = useState<"create" | "repository" | "analytics" | "tutor" | "resources">("create");
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDocument[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [docUploadGrade, setDocUploadGrade] = useState<number>(6);
  const [docUploadCategory, setDocUploadCategory] = useState<DocCategory>("textbook");

  const [exams, setExams] = useState<Exam[]>(() => {
    const saved = localStorage.getItem("smarttest_exams");
    return saved ? JSON.parse(saved) : initialExams;
  });
  const [history, setHistory] = useState<ExamHistory[]>(() => {
    const saved = localStorage.getItem("smarttest_history");
    return saved ? JSON.parse(saved) : [];
  });

  // Settings
  const [customApiKey, setCustomApiKey] = useState(() => localStorage.getItem("gemini_api_key") || "");
  const [showApiKey, setShowApiKey] = useState(false);
  const [selectedModel, setSelectedModel] = useState(() => localStorage.getItem("gemini_selected_model") || "gemini-3.5-flash");
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Form Generator parameters
  const [selectedGrade, setSelectedGrade] = useState<number>(6);
  const [selectedUnits, setSelectedUnits] = useState<number[]>([1, 2, 3]);
  const [testType, setTestType] = useState<string>("midterm1");
  const [difficulty, setDifficulty] = useState<string>("Medium");
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [term, setTerm] = useState<string>("Giữa học kỳ I");
  const [academicYear, setAcademicYear] = useState<string>(`${new Date().getFullYear()}-${new Date().getFullYear() + 1}`);
  const [isGenerating, setIsGenerating] = useState(false);
  const [matrixFileContent, setMatrixFileContent] = useState<string>("");
  const [matrixFileName, setMatrixFileName] = useState<string>("");
  const [generationMode, setGenerationMode] = useState<"new" | "reference">("new");

  // Auto-manage unit checklist based on selected testType
  useEffect(() => {
    if (testType === "15m") {
      setSelectedUnits([1]);
    } else if (testType === "midterm1") {
      setSelectedUnits([1, 2, 3]);
    } else if (testType === "finalterm1") {
      setSelectedUnits([1, 2, 3, 4, 5, 6]);
    } else if (testType === "midterm2") {
      setSelectedUnits([7, 8, 9]);
    } else if (testType === "finalterm2") {
      setSelectedUnits([7, 8, 9, 10, 11, 12]);
    }
  }, [testType]);

  // Exam viewer/testing mode states
  const [currentExam, setCurrentExam] = useState<Exam | null>(null);
  const [examMode, setExamMode] = useState<"view" | "take" | "print" | "none">("none");
  const [takeAnswers, setTakeAnswers] = useState<Record<string, string>>({});
  const [takeTimeLeft, setTakeTimeLeft] = useState(0);
  const [isTakeActive, setIsTakeActive] = useState(false);
  const [scoreResult, setScoreResult] = useState<{ score: number; correctCount: number; maxCount: number } | null>(null);
  const [expandedExplanation, setExpandedExplanation] = useState<Record<string, boolean>>({});

  // Shuffle Versioning states
  const [shuffleModalOpen, setShuffleModalOpen] = useState(false);
  const [shuffleCodeInput, setShuffleCodeInput] = useState("Mã đề 102");

  // AI Tutor state
  const [tutorMessages, setTutorMessages] = useState<{ role: "user" | "model"; text: string }[]>([
    { role: "model", text: "Chào Thầy/Cô và các em học sinh! Tôi là Trợ lý AI Giáo viên tiếng Anh bám sát chương trình Global Success (lớp 6-9). Hãy hỏi bất kỳ câu hỏi nào về từ vựng, ngữ pháp, ngữ âm, hoặc nhờ tôi hỗ trợ giải thích các câu hỏi trong đề thi!" }
  ]);
  const [tutorInput, setTutorInput] = useState("");
  const [isTutorLoading, setIsTutorLoading] = useState(false);

  // Drag and Drop State
  const [isDragging, setIsDragging] = useState(false);

  // Notifications
  const [toast, setToast] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  // Save exams & settings to LocalStorage whenever they change
  useEffect(() => {
    localStorage.setItem("smarttest_exams", JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem("smarttest_history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("gemini_api_key", customApiKey);
  }, [customApiKey]);

  useEffect(() => {
    localStorage.setItem("gemini_selected_model", selectedModel);
  }, [selectedModel]);

  // Exam timer countdown
  useEffect(() => {
    let timer: any;
    if (isTakeActive && takeTimeLeft > 0) {
      timer = setInterval(() => {
        setTakeTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsTakeActive(false);
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTakeActive, takeTimeLeft]);

  // Show quick toast message
  const showToast = (text: string, type: "success" | "error" | "info" = "success") => {
    setToast({ text, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleMatrixFile(files[0]);
    }
  };

  const handleFileSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleMatrixFile(files[0]);
    }
  };

  const handleMatrixFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setMatrixFileContent(content);
      setMatrixFileName(file.name);
      showToast(`Tải lên thành công file ma trận: ${file.name}`, "success");
    };
    reader.readAsText(file);
  };

  const clearMatrixFile = () => {
    setMatrixFileContent("");
    setMatrixFileName("");
    showToast("Đã xóa file ma trận", "info");
  };

  // Toggle Grade level adjusts selected units automatically
  const handleGradeChange = (grade: number) => {
    setSelectedGrade(grade);
    setSelectedUnits([1, 2]); // default first two units of the selected grade
  };

  const toggleUnitSelection = (unitId: number) => {
    if (selectedUnits.includes(unitId)) {
      if (selectedUnits.length > 1) {
        setSelectedUnits(selectedUnits.filter(id => id !== unitId));
      } else {
        showToast("Vui lòng chọn ít nhất một Unit!", "info");
      }
    } else {
      setSelectedUnits([...selectedUnits, unitId].sort((a, b) => a - b));
    }
  };

  // Multi-file document upload handler (PDF, Word, Excel)
  const handleMultiFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    showToast(`Đang trích xuất dữ liệu từ ${files.length} tệp tin (có thể mất vài chục giây)...`, "info");
    try {
      const newDocs = await processAndStoreFiles(files, docUploadCategory, docUploadGrade);
      setUploadedDocs(prev => [...prev, ...newDocs]);
      showToast(`Đã tải lên và lưu trữ thành công ${newDocs.length} tệp tin!`, "success");
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
  };

  // Generate Exam using AI (Frontend)
  const handleGenerateExam = async () => {
    setIsGenerating(true);
    showToast("Đang kết nối Gemini AI để phân tích và biên soạn đề thi...", "info");

    try {
      const isUsingMatrixFile = !!matrixFileContent;
      let result;
      if (isUsingMatrixFile) {
        result = await analyzeMatrixAI(matrixFileName, matrixFileContent, selectedGrade, testType, customApiKey, selectedModel);
      } else {
        const pdfContext = await buildKnowledgeContext(selectedGrade, selectedUnits, generationMode === "new");
        result = await generateExamAI(selectedGrade, selectedUnits, testType, difficulty, customPrompt, term, academicYear, pdfContext || undefined, customApiKey, selectedModel);
      }
      const newExam: Exam = {
        ...result.data,
        id: `exam-${Date.now()}`,
        createdAt: new Date().toISOString()
      };

      setExams([newExam, ...exams]);
      setCurrentExam(newExam);
      setExamMode("view");
      showToast(`Tạo thành công đề thi: ${newExam.title}`, "success");
      // Scroll to view
    } catch (error: any) {
      console.error(error);
      showToast(error.message || "Gặp lỗi trong quá trình sinh đề thi. Hãy kiểm tra API Key.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle shuffling exam questions & options
  const handleShuffleAction = () => {
    if (!currentExam) return;
    const shuffled = shuffleExam(currentExam, shuffleCodeInput);
    setExams([shuffled, ...exams]);
    setCurrentExam(shuffled);
    setShuffleModalOpen(false);
    showToast(`Đã xáo trộn và tạo mã đề mới: ${shuffleCodeInput}`, "success");
  };

  // Start Interactive Exam Taking Mode
  const handleStartExamTaking = (exam: Exam) => {
    setCurrentExam(exam);
    setTakeAnswers({});
    setTakeTimeLeft(exam.duration * 60);
    setScoreResult(null);
    setExpandedExplanation({});
    setExamMode("take");
    setIsTakeActive(true);
    showToast("Bài kiểm tra đã bắt đầu. Đồng hồ đang đếm ngược!", "info");
  };

  // Submitting test results
  const handleSubmitTest = () => {
    if (!currentExam) return;
    setIsTakeActive(false);

    // Calculate score
    let correct = 0;
    let total = 0;

    currentExam.parts.forEach(part => {
      part.questions.forEach(q => {
        total++;
        if (takeAnswers[q.id] === q.correctAnswer) {
          correct++;
        }
      });
    });

    const finalScore = Math.round((correct / total) * 100) / 10;
    setScoreResult({
      score: finalScore,
      correctCount: correct,
      maxCount: total
    });

    // Save to history
    const historyItem: ExamHistory = {
      id: `history-${Date.now()}`,
      examId: currentExam.id,
      examTitle: currentExam.title,
      grade: currentExam.grade,
      score: finalScore,
      totalQuestions: total,
      correctCount: correct,
      timeSpent: currentExam.duration * 60 - takeTimeLeft,
      takenAt: new Date().toISOString(),
      answers: takeAnswers
    };

    setHistory([historyItem, ...history]);
    showToast(`Chúc mừng! Bạn đã hoàn thành với kết quả: ${finalScore}/10`, "success");
  };

  // Delete an exam
  const handleDeleteExam = (examId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Bạn có chắc chắn muốn xóa đề thi này khỏi kho lưu trữ?")) {
      setExams(exams.filter(ex => ex.id !== examId));
      if (currentExam?.id === examId) {
        setExamMode("none");
        setCurrentExam(null);
      }
      showToast("Đã xóa đề thi", "success");
    }
  };

  // Chat with AI Tutor
  const handleSendTutorMessage = async () => {
    if (!tutorInput.trim()) return;

    const userMsg = { role: "user" as const, text: tutorInput };
    setTutorMessages(prev => [...prev, userMsg]);
    setTutorInput("");
    setIsTutorLoading(true);

    try {
      const text = await chatWithTutorAI(userMsg.text, currentExam, customApiKey, selectedModel);
      setTutorMessages(prev => [...prev, { role: "model", text }]);
    } catch (error: any) {
      showToast(error.message || "Gia sư AI bận đột xuất.", "error");
      setTutorMessages(prev => [...prev, { role: "model", text: `Đã xảy ra lỗi: ${error.message || "Không thể kết nối với máy chủ AI."}` }]);
    } finally {
      setIsTutorLoading(false);
    }
  };


  // Export database backup
  const handleExportBackup = () => {
    const dataStr = JSON.stringify({ exams, history });
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `SmartTest_GlobalSuccess_Backup_${new Date().toISOString().slice(0,10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    showToast("Xuất dữ liệu dự phòng thành công!", "success");
  };

  // Import database backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.exams && Array.isArray(parsed.exams)) {
          setExams(parsed.exams);
          if (parsed.history && Array.isArray(parsed.history)) {
            setHistory(parsed.history);
          }
          showToast("Khôi phục toàn bộ dữ liệu thành công!", "success");
        } else {
          showToast("File không đúng định dạng lưu trữ SmartTest.", "error");
        }
      } catch (err) {
        showToast("Lỗi giải mã file JSON backup.", "error");
      }
    };
    reader.readAsText(file);
  };

  // Format time (seconds -> MM:SS)
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${rem.toString().padStart(2, "0")}`;
  };

  // Weak topic analytics
  const getWeakTopics = () => {
    const wrongCountByTopic: Record<string, { wrong: number; total: number }> = {};
    
    history.forEach(hist => {
      const exam = exams.find(e => e.id === hist.examId) || initialExams.find(e => e.id === hist.examId);
      if (!exam) return;

      exam.parts.forEach(part => {
        part.questions.forEach(q => {
          const topic = q.topic || "Ngữ pháp tổng hợp";
          if (!wrongCountByTopic[topic]) {
            wrongCountByTopic[topic] = { wrong: 0, total: 0 };
          }
          wrongCountByTopic[topic].total++;
          if (hist.answers[q.id] !== q.correctAnswer) {
            wrongCountByTopic[topic].wrong++;
          }
        });
      });
    });

    return Object.entries(wrongCountByTopic)
      .map(([topic, stats]) => ({
        topic,
        percentage: Math.round((stats.wrong / stats.total) * 100),
        wrong: stats.wrong,
        total: stats.total
      }))
      .filter(t => t.percentage > 30) // Only show areas needing attention (>30% wrong rate)
      .sort((a, b) => b.percentage - a.percentage);
  };

  const validateExamBeforeExport = (exam: Exam) => {
    let mcqCount = 0;
    let writingCount = 0;
    let hasInvalidOptions = false;
    let hasD = false;

    exam.parts.forEach((part) => {
      part.questions.forEach(q => {
        if (q.options && q.options.length > 0) {
          mcqCount++;
          if (q.options.length > 3) hasInvalidOptions = true;
          if (q.options.some(opt => opt.startsWith("D.") || opt.startsWith("D "))) hasD = true;
        } else {
          writingCount++;
        }
      });
    });

    // Detect test type based on the question counts first, to be resilient against AI schema hallucinations
    let detectedType = "";
    if (mcqCount === 20 && writingCount === 0) {
      detectedType = "15m";
    } else if (mcqCount === 36 && writingCount === 1) {
      const tType = (exam.testType || "").toLowerCase();
      if (tType.includes("mid")) {
        detectedType = "midterm";
      } else if (tType.includes("final")) {
        detectedType = "finalterm";
      } else {
        detectedType = "midterm";
      }
    } else {
      const tType = (exam.testType || "").toLowerCase();
      if (tType.includes("15m") || tType === "15") {
        detectedType = "15m";
      } else if (tType.includes("mid") || tType.includes("giữa") || tType.includes("giua")) {
        detectedType = "midterm";
      } else if (tType.includes("final") || tType.includes("cuối") || tType.includes("cuoi")) {
        detectedType = "finalterm";
      }
    }

    if (detectedType === "15m") {
      if (mcqCount !== 20) return `Số câu trắc nghiệm không đúng cho đề 15 phút (Hiện tại: ${mcqCount}, Yêu cầu: 20)`;
      if (writingCount !== 0) return `Đề 15 phút không được có câu tự luận (Hiện tại: ${writingCount})`;
    } else if (detectedType === "midterm") {
      if (mcqCount !== 36) return `Số câu trắc nghiệm không đúng cho đề Giữa kỳ (Hiện tại: ${mcqCount}, Yêu cầu: 36)`;
      if (writingCount !== 1) return `Số câu tự luận không đúng cho đề Giữa kỳ (Hiện tại: ${writingCount}, Yêu cầu: 1)`;
    } else if (detectedType === "finalterm") {
      if (mcqCount !== 36) return `Số câu trắc nghiệm không đúng cho đề Cuối kỳ (Hiện tại: ${mcqCount}, Yêu cầu: 36)`;
      if (writingCount !== 1) return `Số câu tự luận không đúng cho đề Cuối kỳ (Hiện tại: ${writingCount}, Yêu cầu: 1)`;
    }

    if (hasInvalidOptions) return "Có câu hỏi vượt quá 3 đáp án (A, B, C)";
    if (hasD) return "Phát hiện đáp án D (chỉ cho phép A, B, C)";
    
    return null; // OK
  };

  const handleExport = async (type: "exam" | "answers" | "matrix" | "spec" | "zip") => {
    if (!currentExam) return;
    const errorMsg = validateExamBeforeExport(currentExam);
    if (errorMsg) {
      showToast(`Cảnh báo định dạng đề: ${errorMsg}`, "info");
    }

    try {
      if (type === "exam") exportToWord(currentExam);
      else if (type === "answers") exportAnswersToWord(currentExam);
      else if (type === "matrix") exportMatrixToWord(currentExam);
      else if (type === "spec") exportSpecToWord(currentExam);
      else if (type === "zip") await exportAllToZip(currentExam);
      
      showToast("Đã tải file xuống thành công!", "success");
    } catch (error) {
      showToast("Lỗi trong quá trình xuất file", "error");
    }
  };

  const handleGenerateSimilar = () => {
    if (!currentExam) return;
    
    // Prefill form states with the exam's settings
    setSelectedGrade(currentExam.grade);
    if (currentExam.units && currentExam.units.length > 0) {
      setSelectedUnits(currentExam.units);
    }
    setTestType(currentExam.testType);
    if (currentExam.term) setTerm(currentExam.term);
    if (currentExam.academicYear) setAcademicYear(currentExam.academicYear);
    if (currentExam.difficulty) setDifficulty(currentExam.difficulty);
    
    // Switch to create tab
    setExamMode("none");
    setActiveTab("create");
    window.scrollTo({ top: 0, behavior: "smooth" });
    showToast("Đã nạp cài đặt của đề. Bạn có thể thêm 'Yêu cầu bổ sung' để tạo đề mới!", "info");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Toast notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white max-w-sm ${
              toast.type === "success" ? "bg-emerald-600" : toast.type === "error" ? "bg-rose-600" : "bg-blue-600"
            }`}
          >
            {toast.type === "success" && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
            {toast.type === "error" && <XCircle className="w-5 h-5 flex-shrink-0" />}
            {toast.type === "info" && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            <span className="text-sm font-medium">{toast.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER SECTION (Persistent Navigation & Actions) */}
      <header className="no-print sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-amber-500 rounded-xl text-white shadow-md">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-amber-500 bg-clip-text text-transparent">
                SmartTest Global Success
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                AI Soạn đề & Đánh giá Tiếng Anh THCS bám sát chuẩn Bộ GD&ĐT
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">


            {/* Config & Backups panel trigger */}
            <button
              onClick={() => setShowSettingsModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm transition-colors border border-slate-200 font-medium cursor-pointer"
            >
              <Settings className="w-4 h-4" />
              <span>Cài Đặt</span>
              {customApiKey ? (
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" title="Đã có API Key" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block animate-pulse" title="Thiếu API Key" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* API Key warning if missing and trying to generate */}
        

        {/* ACTIVE MODULE VIEW */}
        <div className="no-print">
          {/* TAB 1: AI GENERATOR FORM */}
          {activeTab === "create" && examMode === "none" && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Creator Options */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-bold text-slate-800">Cấu hình Đề thi Global Success</h2>
                  </div>

                  {/* Class Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-2.5">
                      Lựa chọn khối lớp học:
                    </label>
                    <div className="grid grid-cols-4 gap-2.5">
                      {[6, 7, 8, 9].map((grade) => (
                        <button
                          key={grade}
                          type="button"
                          onClick={() => handleGradeChange(grade)}
                          className={`py-3 px-4 rounded-xl font-bold border text-center transition-all cursor-pointer ${
                            selectedGrade === grade
                              ? "bg-blue-600 text-white border-blue-600 shadow-md scale-102"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          Lớp {grade}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Units selector */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-semibold text-slate-700">
                        Chọn các bài học (Units) kiểm tra:
                      </label>
                      <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full">
                        Đang chọn: {selectedUnits.length} bài
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto p-1.5 border border-slate-100 rounded-xl bg-slate-50/50">
                      {GLOBAL_SUCCESS_UNITS[selectedGrade]?.map((unit) => {
                        const isSelected = selectedUnits.includes(unit.id);
                        return (
                          <button
                            key={unit.id}
                            type="button"
                            onClick={() => toggleUnitSelection(unit.id)}
                            className={`flex items-center justify-between p-2.5 rounded-lg border text-left text-xs font-medium transition-all cursor-pointer ${
                              isSelected
                                ? "bg-white border-blue-600 text-blue-700 font-semibold shadow-xs"
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            <span>{unit.title}</span>
                            <div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center border transition-all ${
                              isSelected ? "bg-blue-600 border-blue-600 text-white" : "border-slate-300"
                            }`}>
                              {isSelected && <Check className="w-3 h-3" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Reference documents status info */}
                  <div className="mb-6 border-t border-slate-100 pt-6">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 border-dashed text-xs text-slate-600">
                      {generationMode === "new" ? (
                        <span>✨ Chế độ: <strong>Sinh đề mới chuẩn kiến thức</strong>. Hệ thống sẽ căn cứ vào chương trình chuẩn SGK Global Success (Lớp {selectedGrade}, các Unit đã chọn) để sinh đề.</span>
                      ) : (
                        <span>📂 Chế độ: <strong>Sinh đề theo mẫu đề tải lên</strong>. Hệ thống sẽ kết hợp nội dung SGK và các file Đề mẫu, Ma trận, Đặc tả lớp {selectedGrade} bạn đã tải lên ở cột bên phải làm căn cứ biên soạn.</span>
                      )}
                    </div>
                  </div>

                   {/* Test type and duration */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Loại đề kiểm tra:
                      </label>
                      <select
                        value={testType}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTestType(val);
                          if (val === "15m") {
                            setTerm("Thường xuyên I");
                          } else if (val === "midterm1") {
                            setTerm("Giữa học kỳ I");
                          } else if (val === "finalterm1") {
                            setTerm("Cuối học kỳ I");
                          } else if (val === "midterm2") {
                            setTerm("Giữa học kỳ II");
                          } else if (val === "finalterm2") {
                            setTerm("Cuối học kỳ II");
                          }
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white shadow-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-medium"
                      >
                        <option value="15m">⏱️ Kiểm tra 15 Phút (20 câu trắc nghiệm)</option>
                        <option value="midterm1">📚 Kiểm tra Giữa học kỳ I (36 câu trắc nghiệm + 1 tự luận)</option>
                        <option value="finalterm1">🏆 Kiểm tra Cuối học kỳ I (36 câu trắc nghiệm + 1 tự luận)</option>
                        <option value="midterm2">📚 Kiểm tra Giữa học kỳ II (36 câu trắc nghiệm + 1 tự luận)</option>
                        <option value="finalterm2">🏆 Kiểm tra Cuối học kỳ II (36 câu trắc nghiệm + 1 tự luận)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Độ khó:
                      </label>
                      <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white shadow-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-medium"
                      >
                        <option value="Easy">Dễ (Nhận biết & thông hiểu chiếm 80%)</option>
                        <option value="Medium">Trung bình (Bám sát phân bổ bộ đề chuẩn)</option>
                        <option value="Hard">Khó (Nhiều câu vận dụng cao, nâng cao học sinh giỏi)</option>
                      </select>
                    </div>
                  </div>

                  {/* Term and Year */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Kỳ kiểm tra:
                      </label>
                      <select
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white shadow-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-medium"
                      >
                        {testType === "15m" && (
                          <>
                            <option value="Thường xuyên I">Thường xuyên học kỳ I</option>
                            <option value="Thường xuyên II">Thường xuyên học kỳ II</option>
                          </>
                        )}
                        {testType === "midterm1" && (
                          <option value="Giữa học kỳ I">Giữa học kỳ I</option>
                        )}
                        {testType === "finalterm1" && (
                          <option value="Cuối học kỳ I">Cuối học kỳ I</option>
                        )}
                        {testType === "midterm2" && (
                          <option value="Giữa học kỳ II">Giữa học kỳ II</option>
                        )}
                        {testType === "finalterm2" && (
                          <option value="Cuối học kỳ II">Cuối học kỳ II</option>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Năm học:
                      </label>
                      <input
                        type="text"
                        value={academicYear}
                        onChange={(e) => setAcademicYear(e.target.value)}
                        placeholder="Ví dụ: 2023-2024"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white shadow-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-medium"
                      />
                    </div>
                  </div>

                  {/* Optional Custom Instructions or Matrix Prompt */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Yêu cầu bổ sung hoặc dán ma trận đặc tả riêng (Tùy chọn):
                    </label>
                    <textarea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="Ví dụ: Tăng cường các câu hỏi về trọng âm phát âm, giảm bớt bài đọc khó, bổ sung thêm cấu trúc đảo ngữ..."
                      rows={3}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white shadow-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm placeholder-slate-400"
                    />
                  </div>

                  {/* ACTION BUTTON */}
                  <div className="mt-8">
                    <button
                      onClick={handleGenerateExam}
                      disabled={isGenerating}
                      className={`w-full py-4 rounded-xl font-bold text-white shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isGenerating
                          ? "bg-slate-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-amber-500 hover:shadow-lg active:scale-98"
                      }`}
                    >
                      {isGenerating ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Đang soạn thảo đề thi bằng AI...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 animate-pulse" />
                          <span>🚀 BIÊN SOẠN ĐỀ THI BẰNG AI</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar: Căn cứ ra đề & Tài liệu tham khảo */}
              <div className="space-y-6">
                {/* Generation Mode Option */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-slate-800 text-sm">Chế độ biên soạn</h3>
                  </div>
                  <div className="space-y-2.5">
                    <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      generationMode === "new" ? "border-blue-600 bg-blue-50/40" : "border-slate-200 hover:bg-slate-50"
                    }`}>
                      <input
                        type="radio"
                        name="generationMode"
                        checked={generationMode === "new"}
                        onChange={() => setGenerationMode("new")}
                        className="mt-1"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Sinh đề mới chuẩn kiến thức</span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">Sử dụng dữ liệu SGK Global Success mặc định.</span>
                      </div>
                    </label>
                    
                    <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      generationMode === "reference" ? "border-blue-600 bg-blue-50/40" : "border-slate-200 hover:bg-slate-50"
                    }`}>
                      <input
                        type="radio"
                        name="generationMode"
                        checked={generationMode === "reference"}
                        onChange={() => setGenerationMode("reference")}
                        className="mt-1"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Sinh đề theo mẫu đề tải lên</span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">Căn cứ theo đề mẫu, ma trận, đặc tả bạn tải lên dưới đây.</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Reference upload area */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Upload className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-bold text-slate-800 text-sm">Căn cứ & Tài liệu tham khảo</h3>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
                    Tải lên đề mẫu, đáp án mẫu, ma trận, đặc tả (PDF, Word, Excel, TXT) làm căn cứ ra đề.
                  </p>

                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Loại tài liệu tải lên:</label>
                      <select
                        value={docUploadCategory}
                        onChange={(e) => setDocUploadCategory(e.target.value as DocCategory)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium"
                      >
                        <option value="textbook">📚 SGK, Sách bài tập, Tài liệu</option>
                        <option value="sample_exam">📋 Đề mẫu & Đáp án mẫu</option>
                        <option value="matrix">📊 Ma trận đề thi</option>
                        <option value="spec">📝 Đặc tả đề thi</option>
                        <option value="other">📎 Tài liệu khác</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block w-full text-center cursor-pointer ${isUploading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'} text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors shadow-xs`}>
                        {isUploading ? "⏳ Đang tải..." : "📂 Chọn file tải lên"}
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

                  {/* List of uploaded files for current grade */}
                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <h4 className="text-[11px] font-bold text-slate-700 mb-2.5">Tài liệu đã tải lên (Lớp {selectedGrade}):</h4>
                    {uploadedDocs.filter(d => d.grade === selectedGrade).length === 0 ? (
                      <p className="text-[10px] text-slate-400 italic">Chưa có tài liệu tham khảo nào được tải lên cho khối lớp này.</p>
                    ) : (
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {uploadedDocs.filter(d => d.grade === selectedGrade).map(doc => (
                          <div key={doc.id} className="flex items-center justify-between bg-slate-50 rounded-lg p-2 border border-slate-100 text-[10px]">
                            <div className="flex items-center gap-1.5 min-w-0 flex-1">
                              <span className="text-xs">{getFileIcon(doc.fileType)}</span>
                              <span className="font-semibold text-slate-700 truncate" title={doc.fileName}>{doc.fileName}</span>
                            </div>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-[8px] font-bold">
                                {getCategoryLabel(doc.category)}
                              </span>
                              <button
                                onClick={() => handleDeleteDoc(doc.id)}
                                className="text-rose-600 hover:bg-rose-50 p-1 rounded"
                                title="Xóa"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-amber-50/50 p-5 rounded-2xl border border-blue-100">
                  <h4 className="font-bold text-slate-800 text-xs mb-2 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-blue-600" />
                    Hướng dẫn ra đề
                  </h4>
                  <ul className="space-y-1.5 text-[10px] text-slate-600 leading-relaxed">
                    <li>• Nếu không tải tài liệu tham khảo, AI sẽ tự động ra đề bằng kiến thức chuẩn SGK Global Success lớp 6-9 tích hợp sẵn.</li>
                    <li>• Khi chọn <strong>Sinh đề theo mẫu đề tải lên</strong>, hãy tải lên các file đề mẫu hoặc ma trận tương ứng để AI làm căn cứ cấu trúc.</li>
                  </ul>
                </div>
              </div>

            </div>

            {/* Danh sách đề thi đã soạn */}
            <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 no-print">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-slate-800">Kho đề thi đã soạn ({exams.length})</h3>
                </div>
                {exams.length > 0 && (
                  <span className="text-xs text-slate-500 italic">Nhấp vào đề để xem chi tiết hoặc tải file Word</span>
                )}
              </div>

              {exams.length === 0 ? (
                <div className="text-center py-12 text-slate-400 italic text-sm">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-30 text-blue-600" />
                  <p>Chưa có đề thi nào được soạn.</p>
                  <p className="text-xs mt-1">Hãy thiết lập cấu hình ở trên và nhấn "Biên soạn đề thi bằng AI" để bắt đầu!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {exams.map((exam) => (
                    <div
                      key={exam.id}
                      onClick={() => {
                        setCurrentExam(exam);
                        setExamMode("view");
                      }}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-slate-50/50 transition-all cursor-pointer gap-4 group"
                    >
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Lớp {exam.grade}
                          </span>
                          <span className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                            {exam.testType === "15m" ? "15 Phút" : exam.term || "Kiểm tra"}
                          </span>
                          <span className="text-slate-400 text-[10px]">
                            {new Date(exam.createdAt).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                          {exam.title}
                        </h4>
                        <p className="text-xs text-slate-500">
                          Thời gian: {exam.duration} phút · {exam.totalQuestions} câu hỏi · Mã đề: {exam.versionCode || "101"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2.5 flex-shrink-0 self-end sm:self-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            setCurrentExam(exam);
                            setExamMode("view");
                          }}
                          className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          Xem đề
                        </button>
                        <button
                          onClick={() => handleStartExamTaking(exam)}
                          className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          Làm bài
                        </button>
                        <button
                          onClick={(e) => handleDeleteExam(exam.id, e)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Xóa đề"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        </div>


        {/* DETAILED EXAM VIEW & INTERACTIONS INTERFACE */}
        {currentExam && examMode !== "none" && (
          <div className="space-y-6">
            
            {/* Action Bar back to dashboard */}
            <div className="no-print bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <button
                onClick={() => { setExamMode("none"); setTakeAnswers({}); setScoreResult(null); setIsTakeActive(false); }}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors font-semibold cursor-pointer"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Quay lại cấu hình đề
              </button>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => handleExport("exam")}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded-lg text-xs font-semibold transition-colors border border-slate-200 cursor-pointer"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Tải Đề (Word)</span>
                </button>
                <button
                  onClick={() => handleExport("answers")}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 text-slate-700 rounded-lg text-xs font-semibold transition-colors border border-slate-200 cursor-pointer"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Tải Đáp Án</span>
                </button>
                <button
                  onClick={() => handleExport("matrix")}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-purple-50 hover:text-purple-600 text-slate-700 rounded-lg text-xs font-semibold transition-colors border border-slate-200 cursor-pointer"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Tải Ma Trận</span>
                </button>
                <button
                  onClick={() => handleExport("spec")}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-amber-50 hover:text-amber-600 text-slate-700 rounded-lg text-xs font-semibold transition-colors border border-slate-200 cursor-pointer"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Tải Đặc Tả</span>
                </button>
                <button
                  onClick={() => handleExport("zip")}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-sm"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Tải Tất Cả (ZIP)</span>
                </button>

                {/* Print Layout action */}
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors border border-slate-200 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>In Đề Thi</span>
                </button>

                {/* Shuffle questions */}
                <button
                  onClick={() => setShuffleModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-amber-50 hover:text-amber-700 text-slate-700 rounded-lg text-xs font-semibold transition-colors border border-slate-200 cursor-pointer"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Đảo câu hỏi / Tạo Mã đề</span>
                </button>

                {/* Generate Similar */}
                <button
                  onClick={handleGenerateSimilar}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-700 rounded-lg text-xs font-semibold transition-colors border border-slate-200 cursor-pointer"
                  title="Sao chép các tùy chọn của đề này để sinh một đề tương tự"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Sinh đề tương tự</span>
                </button>

                {/* Switch to Interactive Mock test */}
                {examMode !== "take" && (
                  <button
                    onClick={() => handleStartExamTaking(currentExam)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Làm Bài Trắc Nghiệm Trực Tuyến</span>
                  </button>
                )}
              </div>
            </div>

            {/* Exam interactive layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* Exam Content Body */}
              <div className="lg:col-span-3 space-y-6 print-card">
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 print-card">
                  
                  {/* Print Standard Header */}
                  <div className="text-center pb-6 border-b border-dashed border-slate-300">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-3 no-print">
                      <span>CHƯƠNG TRÌNH GLOBAL SUCCESS</span>
                      <span>MÃ ĐỀ: {currentExam.versionCode || "Gốc (101)"}</span>
                    </div>
                    <p className="text-[11px] uppercase font-bold text-slate-600">SỞ GIÁO DỤC VÀ ĐÀO TẠO ______________</p>
                    <p className="text-[11px] uppercase font-bold text-slate-600">TRƯỜNG THCS _________________________</p>
                    
                    <h2 className="text-base sm:text-lg font-extrabold text-slate-800 uppercase mt-3 mb-1.5">
                      {currentExam.title}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium italic">
                      Môn học: Tiếng Anh Lớp {currentExam.grade} | Thời gian làm bài: {currentExam.duration} phút
                    </p>
                    <div className="mt-4 text-xs font-bold text-slate-800 border border-slate-300 rounded p-2 inline-block max-w-sm">
                      Họ và tên học sinh: ........................................................... Lớp: .....................
                    </div>
                  </div>

                  {/* Parts iteration */}
                  <div className="mt-8 space-y-8">
                    {currentExam.parts.map((part, pIdx) => (
                      <div key={pIdx} className="space-y-4">
                        {/* Part header */}
                        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 print-card print:p-0 print:border-none">
                          <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm uppercase tracking-wide">
                            {part.title}
                          </h4>
                          <p className="text-xs text-slate-500 italic mt-1 font-medium">
                            {part.instruction}
                          </p>
                        </div>

                        {/* Questions list */}
                        <div className="space-y-6">
                          {part.questions.map((q, qIdx) => {
                            const isSelectedOption = (opt: string) => {
                              const letter = opt.trim().substring(0, 1);
                              return takeAnswers[q.id] === letter;
                            };

                            const getOptionLetter = (opt: string) => opt.trim().substring(0, 1);

                            return (
                              <div key={q.id} className="p-4 rounded-xl border border-transparent hover:border-slate-100 transition-all space-y-3 print:p-0">
                                <div className="text-sm font-semibold text-slate-800 flex items-start gap-1.5 leading-relaxed">
                                  <span className="text-blue-600 font-extrabold">Câu {qIdx + 1}:</span>
                                  <span>{q.questionText}</span>
                                </div>

                                {/* Options grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                  {q.options.map((option, oIdx) => {
                                    const letter = getOptionLetter(option);
                                    const isChosen = takeAnswers[q.id] === letter;
                                    
                                    // Colored options depending on stage
                                    let optionClass = "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700";
                                    if (examMode === "take") {
                                      optionClass = isChosen 
                                        ? "bg-blue-50 border-blue-600 text-blue-800 font-semibold"
                                        : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700";
                                    } else if (scoreResult) {
                                      // show grading answers
                                      if (letter === q.correctAnswer) {
                                        optionClass = "bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold";
                                      } else if (isChosen && isChosen !== (letter === q.correctAnswer)) {
                                        optionClass = "bg-rose-50 border-rose-400 text-rose-800";
                                      }
                                    }

                                    return (
                                      <button
                                        key={oIdx}
                                        type="button"
                                        onClick={() => {
                                          if (examMode === "take" && isTakeActive) {
                                            setTakeAnswers({ ...takeAnswers, [q.id]: letter });
                                          }
                                        }}
                                        className={`p-3 rounded-lg border text-left text-xs font-medium transition-all ${
                                          examMode === "take" ? "cursor-pointer" : "cursor-default"
                                        } ${optionClass}`}
                                      >
                                        {option}
                                      </button>
                                    );
                                  })}
                                </div>

                                {/* Show Explanation & Answers in View Mode or after Nộp Bài */}
                                {(examMode === "view" || scoreResult) && (
                                  <div className="no-print mt-3.5 border-t border-slate-100 pt-3">
                                    <div className="flex items-center justify-between gap-4">
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">
                                          Đáp án đúng: {q.correctAnswer}
                                        </span>
                                        {q.topic && (
                                          <span className="text-[10px] bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full font-semibold">
                                            {q.topic}
                                          </span>
                                        )}
                                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                                          {q.difficulty}
                                        </span>
                                      </div>
                                      
                                      <button
                                        onClick={() => setExpandedExplanation(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                                        className="flex items-center gap-1 text-[11px] text-blue-600 hover:underline font-bold cursor-pointer"
                                      >
                                        <span>{expandedExplanation[q.id] ? "Ẩn Giải Thích" : "Xem Giải Thích"}</span>
                                        {expandedExplanation[q.id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                      </button>
                                    </div>

                                    {/* Explanation content */}
                                    {expandedExplanation[q.id] && (
                                      <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="mt-3 p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs leading-relaxed space-y-2.5"
                                      >
                                        <div className="text-slate-600">
                                          <strong>Giải thích chi tiết:</strong> {q.explanation}
                                        </div>
                                        
                                      </motion.div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Print Answer sheet for teachers on paper print */}
                  <div className="hidden print:block print-page-break mt-12 pt-8 border-t-2 border-dashed border-black">
                    <h2 className="text-center text-lg font-bold uppercase mb-4">ĐÁP ÁN ĐỀ THI & GIẢI THÍCH (DÀNH CHO GIÁO VIÊN)</h2>
                    
                    <table className="w-full border-collapse border border-black mb-8 text-xs">
                      <thead>
                        <tr>
                          <th className="border border-black p-2">Câu hỏi</th>
                          <th className="border border-black p-2">Đáp án đúng</th>
                          <th className="border border-black p-2">Chủ đề</th>
                          <th className="border border-black p-2">Mức độ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentExam.parts.flatMap(p => p.questions).map((q, idx) => (
                          <tr key={idx} className="text-center">
                            <td className="border border-black p-1.5 font-bold">Câu {idx + 1}</td>
                            <td className="border border-black p-1.5 font-bold text-red-600">{q.correctAnswer}</td>
                            <td className="border border-black p-1.5 text-left">{q.topic || "Ngữ pháp tổng quát"}</td>
                            <td className="border border-black p-1.5">{q.difficulty}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <h3 className="font-bold text-sm mb-4">Giải thích chi tiết từng câu hỏi:</h3>
                    {currentExam.parts.flatMap(p => p.questions).map((q, idx) => (
                      <div key={idx} className="mb-4 text-xs pb-3 border-b border-slate-300">
                        <p className="font-bold">Câu {idx + 1}: {q.questionText.substring(0, 80)}...</p>
                        <p className="text-red-600 font-semibold mt-1">Đáp án: {q.correctAnswer}</p>
                        <p className="italic text-slate-600 mt-1"><strong>Giải thích:</strong> {q.explanation}</p>
                      </div>
                    ))}
                  </div>

                </div>
              </div>

              {/* Sidebar Exam Actions / Timer widget */}
              <div className="no-print space-y-6">
                
                {/* Timer Widget */}
                {examMode === "take" && (
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center space-y-4">
                    <div className="flex items-center justify-center gap-1.5 text-slate-400">
                      <Clock className="w-4 h-4 animate-pulse text-amber-500" />
                      <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Thời gian làm bài</span>
                    </div>

                    <div className={`text-3xl font-mono font-extrabold tracking-widest ${
                      takeTimeLeft <= 120 ? "text-rose-600 animate-pulse" : "text-slate-800"
                    }`}>
                      {formatTime(takeTimeLeft)}
                    </div>

                    <p className="text-[10px] text-slate-400">
                      (Nộp bài sớm nếu bạn hoàn thành trước thời gian)
                    </p>

                    <button
                      onClick={handleSubmitTest}
                      disabled={!isTakeActive}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md cursor-pointer"
                    >
                      Nộp Bài Thi
                    </button>
                  </div>
                )}

                {/* Score badge result display */}
                {scoreResult && (
                  <div className="bg-gradient-to-tr from-emerald-500 to-teal-600 p-5 rounded-2xl text-white text-center shadow-lg space-y-4">
                    <Trophy className="w-12 h-12 text-amber-300 mx-auto animate-bounce" />
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-teal-100 block">KẾT QUẢ CỦA BẠN</span>
                      <strong className="text-4xl font-extrabold block mt-1">{scoreResult.score} / 10</strong>
                      <span className="text-xs text-emerald-100 block mt-1.5 font-medium">
                        Trả lời đúng: <strong>{scoreResult.correctCount}</strong> / {scoreResult.maxCount} câu hỏi
                      </span>
                    </div>

                    <div className="p-3 bg-white/15 rounded-xl text-xs leading-relaxed">
                      {scoreResult.score >= 8.0 
                        ? "🎉 Đạt kết quả giỏi xuất sắc! Hãy tiếp tục duy trì phong độ xuất sắc này."
                        : scoreResult.score >= 5.0
                        ? "👍 Kết quả trung bình khá. Hãy bấm 'Xem Giải Thích' ở từng câu để bổ sung lỗ hổng."
                        : "📚 Kết quả dưới trung bình. Hãy ôn tập kỹ bài học và thảo luận thêm với Gia sư AI."}
                    </div>

                    <button
                      onClick={() => handleStartExamTaking(currentExam)}
                      className="w-full py-2.5 bg-white text-teal-800 font-bold rounded-xl text-xs transition-transform hover:scale-102 cursor-pointer"
                    >
                      Làm Lại Bài Thi
                    </button>
                  </div>
                )}

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Thông số Đề kiểm tra</h4>
                  <div className="space-y-2.5 text-xs text-slate-600">
                    <div className="flex justify-between border-b border-slate-50 pb-2">
                      <span className="text-slate-400">Khối Lớp</span>
                      <span className="font-bold">Lớp {currentExam.grade}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-2">
                      <span className="text-slate-400">Tổng số câu hỏi</span>
                      <span className="font-bold">{currentExam.totalQuestions} câu</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-2">
                      <span className="text-slate-400">Thời gian</span>
                      <span className="font-bold">{currentExam.duration} phút</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Mã đề thi</span>
                      <span className="font-bold text-blue-600">{currentExam.versionCode || "101 (Gốc)"}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 text-xs text-slate-600 space-y-2">
                  <h5 className="font-bold text-slate-800 flex items-center gap-1">
                    <Printer className="w-4 h-4 text-amber-600" />
                    Mẹo in ấn đề thi
                  </h5>
                  <p className="leading-relaxed">
                    Hệ thống đã cấu hình sẵn trang in ấn. Khi bấm <strong>In Đề Thi</strong>, toàn bộ thanh nút và menu sẽ tự động ẩn đi, chỉ in đề chuẩn hóa kèm trang đáp án phía sau.
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="no-print mt-20 border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 SmartTest Global Success. Tối ưu biên soạn, chuẩn hóa khảo thí.</p>
          <p className="mt-1.5">Ứng dụng AI đột phá hỗ trợ giáo viên Tiếng Anh Việt Nam.</p>
        </div>
      </footer>


      {/* CONFIGURATION / SETTINGS MODAL */}
      <AnimatePresence>
        {showSettingsModal && (
          <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden"
            >
              {/* Modal title */}
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-slate-700" />
                  <h3 className="font-bold text-slate-800 text-sm">Cấu hình Hệ thống & API</h3>
                </div>
                <button 
                  onClick={() => setShowSettingsModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Form settings */}
              <div className="p-5 space-y-5 text-xs">
                {/* Custom API Key input */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-2">
                    Google Gemini API Key:
                  </label>
                  <div className="relative">
                    <input
                      type={showApiKey ? "text" : "password"}
                      value={customApiKey}
                      onChange={(e) => setCustomApiKey(e.target.value)}
                      placeholder="Dán Gemini API Key từ AI Studio..."
                      className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-blue-500 outline-none font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                    Bạn có thể tạo Gemini API Key hoàn toàn miễn phí tại trang quản trị{" "}
                    <a 
                      href="https://aistudio.google.com/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 underline font-bold"
                    >
                      Google AI Studio
                    </a>. Key này sẽ được lưu bảo mật trong LocalStorage của trình duyệt của bạn.
                  </p>
                </div>

                {/* Model selection */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-2">
                    Mô hình ngôn ngữ mặc định:
                  </label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-blue-500 outline-none font-medium"
                  >
                    <option value="gemini-3.5-flash">Gemini 3.5 Flash (Khuyên dùng - Nhanh, thông minh)</option>
                    <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite (Siêu tiết kiệm, tốc độ tối đa)</option>
                    <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Phân tích nâng cao, đề siêu chuẩn)</option>
                    <option value="gemini-2.5-flash">Gemini 2.5 Flash (Mô hình ổn định truyền thống)</option>
                  </select>
                </div>

                {/* Backup & Import data */}
                <div className="pt-4 border-t border-slate-100">
                  <label className="block font-semibold text-slate-700 mb-2.5 flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-blue-600" />
                    Lưu trữ & Khôi phục (Backup / Restore)
                  </label>
                  
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={handleExportBackup}
                      className="flex items-center justify-center gap-1.5 px-3 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl font-bold transition-all text-slate-700 cursor-pointer"
                    >
                      <FileDown className="w-4 h-4 text-blue-600" />
                      <span>Xuất File Backup</span>
                    </button>

                    <label className="flex items-center justify-center gap-1.5 px-3 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl font-bold transition-all text-slate-700 cursor-pointer">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span>Nhập File Backup</span>
                      <input 
                        type="file" 
                        accept=".json" 
                        onChange={handleImportBackup} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>

              </div>

              {/* Modal footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="px-5 py-2 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-colors text-xs cursor-pointer"
                >
                  Hoàn Thành
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* SHUFFLE / VERSIONING MODAL */}
      <AnimatePresence>
        {shuffleModalOpen && (
          <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden"
            >
              {/* Modal title */}
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shuffle className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-slate-800 text-sm">Xáo trộn để tạo Mã Đề mới</h3>
                </div>
                <button 
                  onClick={() => setShuffleModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Form content */}
              <div className="p-5 space-y-4 text-xs">
                <p className="text-slate-500 leading-relaxed">
                  Ứng dụng sẽ tự động đảo ngẫu nhiên trật tự câu hỏi và thứ tự các đáp án (A, B, C, D) của đề hiện tại, tạo ra một bản đề hoàn chỉnh mới mà không làm thay đổi hay sai lệch khóa đáp án gốc.
                </p>

                <div>
                  <label className="block font-semibold text-slate-700 mb-2">
                    Nhập tên / mã đề thi mới:
                  </label>
                  <input
                    type="text"
                    value={shuffleCodeInput}
                    onChange={(e) => setShuffleCodeInput(e.target.value)}
                    placeholder="Ví dụ: Mã đề 102, Mã đề 103..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-blue-500 outline-none font-bold"
                  />
                </div>
              </div>

              {/* Modal footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  onClick={() => setShuffleModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-xs cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleShuffleAction}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs cursor-pointer"
                >
                  Xáo Trộn & Lưu Trữ
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
