import React, { useState, useEffect, useRef } from "react";
import { saveAs } from "file-saver";
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
  FolderOpen,
  Shield,
  Users,
  Award,
  Lock,
  Unlock,
  LogOut,
  UserCheck,
  BarChart3,
  Key,
  FolderLock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Exam, Question, ExamPart, ExamHistory, User as AppUser, AssignedExam, StudentResult } from "./types";
import { initialExams } from "./demoData";
import { shuffleExam, exportToWord, exportAnswersToWord, exportMatrixToWord, exportSpecToWord, exportAllToZip } from "./utils";
import { processAndStoreFiles, getAllDocuments, deleteDocument, buildKnowledgeContext, ACCEPTED_FILE_TYPES, DocCategory, UploadedDocument } from "./services/documents";
import { generateExamAI, analyzeMatrixAI, chatWithTutorAI } from "./services/ai";

const initialUsers: AppUser[] = [
  {
    id: "admin-root",
    role: "admin",
    fullName: "Thầy giáo Đinh Văn Thành",
    school: "TRƯỜNG THCS ĐỒNG YÊN",
    username: "Admin",
    password: "Admin123@",
    isVip: true,
    vipUntil: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000).toISOString(), // 10 years
    createdAt: new Date().toISOString()
  },
  {
    id: "teacher-1",
    role: "teacher",
    fullName: "Cô Nguyễn Minh Hoa",
    school: "THCS Trưng Vương",
    username: "hoa.nguyen",
    password: "123",
    isVip: true,
    vipUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
    createdAt: new Date().toISOString()
  },
  {
    id: "student-1",
    role: "student",
    fullName: "Nguyễn Hoàng Nam",
    school: "THCS Trưng Vương",
    gradeClass: "8A1",
    username: "nam.nh",
    password: "123",
    isVip: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "student-2",
    role: "student",
    fullName: "Trần Mai Anh",
    school: "THCS Trưng Vương",
    gradeClass: "6A2",
    username: "anh.tm",
    password: "123",
    isVip: true,
    vipUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString()
  }
];

const initialAssignedExams: AssignedExam[] = [
  {
    id: "TEST-8A1",
    examId: initialExams[0]?.id || "exam-1",
    examTitle: initialExams[0]?.title || "Đề thi Giữa học kỳ I môn Tiếng Anh Lớp 8",
    teacherId: "teacher-1",
    assignedAt: new Date(Date.now() - 86400000).toISOString(),
    results: [
      {
        studentId: "student-1",
        studentName: "Nguyễn Hoàng Nam",
        gradeClass: "8A1",
        score: 8.5,
        correctCount: 31,
        totalQuestions: 37,
        takenAt: new Date(Date.now() - 3600000).toISOString()
      }
    ]
  }
];

export const GRADE_UNITS: Record<number, { id: number; title: string }[]> = {
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
    { id: 12, title: "Unit 12: English-speaking Countries" }
  ],
  8: [
    { id: 1, title: "Unit 1: Leisure Time" },
    { id: 2, title: "Unit 2: Life in the Countryside" },
    { id: 3, title: "Unit 3: Teenagers" },
    { id: 4, title: "Unit 4: Ethnic Groups of Viet Nam" },
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
    { id: 1, title: "Unit 1: Local Communities" },
    { id: 2, title: "Unit 2: City Life" },
    { id: 3, title: "Unit 3: Teen Stress and Pressure" },
    { id: 4, title: "Unit 4: Life in the Past" },
    { id: 5, title: "Unit 5: Wonders of Viet Nam" },
    { id: 6, title: "Unit 6: Viet Nam: Then and Now" },
    { id: 7, title: "Unit 7: Metropolitan Cities" },
    { id: 8, title: "Unit 8: Tourism" },
    { id: 9, title: "Unit 9: English in the World" },
    { id: 10, title: "Unit 10: Space Travel" },
    { id: 11, title: "Unit 11: Changing Roles in Society" },
    { id: 12, title: "Unit 12: My Future Career" }
  ]
};

export default function App() {
  // Navigation & Core states
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDocument[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [docUploadGrade, setDocUploadGrade] = useState<number>(6);
  const [docUploadCategory, setDocUploadCategory] = useState<DocCategory>("textbook");

  // Authentication & Users State
  const [users, setUsers] = useState<AppUser[]>(() => {
    const saved = localStorage.getItem("smarttest_users");
    return saved ? JSON.parse(saved) : initialUsers;
  });
  
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    const saved = localStorage.getItem("smarttest_current_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [assignedExams, setAssignedExams] = useState<AssignedExam[]>(() => {
    const saved = localStorage.getItem("smarttest_assigned_exams");
    return saved ? JSON.parse(saved) : initialAssignedExams;
  });

  // Auth inputs
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authUsername, setAuthUsername] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authFullName, setAuthFullName] = useState("");
  const [authSchool, setAuthSchool] = useState("");
  const [authGradeClass, setAuthGradeClass] = useState("");
  const [authRole, setAuthRole] = useState<"teacher" | "student">("teacher");

  // Dashboard Tabs
  const [activeAdminTab, setActiveAdminTab] = useState<"stats" | "users" | "logs">("stats");
  const [activeTeacherTab, setActiveTeacherTab] = useState<"create" | "assigned">("create");
  const [activeStudentTab, setActiveStudentTab] = useState<"assigned" | "results">("assigned");

  // Assignment states
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [examToAssign, setExamToAssign] = useState<Exam | null>(null);
  const [assignCode, setAssignCode] = useState("");
  
  // Student Code Access
  const [studentAccessCode, setStudentAccessCode] = useState("");

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

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("smarttest_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("smarttest_current_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("smarttest_current_user");
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("smarttest_assigned_exams", JSON.stringify(assignedExams));
  }, [assignedExams]);

  useEffect(() => {
    localStorage.setItem("smarttest_exams", JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem("smarttest_history", JSON.stringify(history));
  }, [history]);

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

  // Load uploaded documents on mount
  useEffect(() => {
    const loadDocs = async () => {
      const docs = await getAllDocuments();
      setUploadedDocs(docs);
    };
    loadDocs();
  }, []);

  // Timer Effect for taking tests
  useEffect(() => {
    let timer: any;
    if (isTakeActive && takeTimeLeft > 0) {
      timer = setInterval(() => {
        setTakeTimeLeft(prev => {
          if (prev <= 1) {
            setIsTakeActive(false);
            clearInterval(timer);
            showToast("Hết giờ làm bài! Hệ thống tự động nộp bài thi.", "info");
            handleFinishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTakeActive, takeTimeLeft]);

  const showToast = (text: string, type: "success" | "error" | "info" = "info") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Auth Operations
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUsername || !authPassword) {
      showToast("Vui lòng nhập đầy đủ thông tin!", "error");
      return;
    }
    const found = users.find(u => u.username.toLowerCase() === authUsername.toLowerCase() && u.password === authPassword);
    if (!found) {
      showToast("Tên đăng nhập hoặc mật khẩu không chính xác!", "error");
      return;
    }
    // Check VIP validity
    if (found.isVip && found.vipUntil && new Date(found.vipUntil) < new Date()) {
      found.isVip = false;
      setUsers([...users]);
    }
    setCurrentUser(found);
    showToast(`Đăng nhập thành công! Xin chào ${found.fullName}`, "success");
    setAuthUsername("");
    setAuthPassword("");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUsername || !authPassword || !authFullName || !authSchool) {
      showToast("Vui lòng điền đầy đủ các trường thông tin!", "error");
      return;
    }
    if (authRole === "student" && !authGradeClass) {
      showToast("Học sinh cần điền thêm thông tin Lớp học!", "error");
      return;
    }
    const exists = users.some(u => u.username.toLowerCase() === authUsername.toLowerCase());
    if (exists) {
      showToast("Tên đăng nhập đã được sử dụng!", "error");
      return;
    }
    const newUser: AppUser = {
      id: `user-${Date.now()}`,
      role: authRole,
      fullName: authFullName,
      school: authSchool,
      gradeClass: authRole === "student" ? authGradeClass : undefined,
      username: authUsername,
      password: authPassword,
      isVip: false, // Must be activated by admin
      createdAt: new Date().toISOString()
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    showToast(`Tạo tài khoản thành công!`, "success");
    setAuthUsername("");
    setAuthPassword("");
    setAuthFullName("");
    setAuthSchool("");
    setAuthGradeClass("");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setExamMode("none");
    showToast("Đã đăng xuất tài khoản.", "info");
  };

  // VIP Activation Toggle
  const handleToggleVip = (userId: string, years = 1) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const isVip = !u.isVip;
        const vipUntil = isVip 
          ? new Date(Date.now() + years * 365 * 24 * 60 * 60 * 1000).toISOString()
          : undefined;
        showToast(isVip ? `Kích hoạt VIP thành công (${years} năm) cho ${u.fullName}!` : `Hủy kích hoạt VIP cho ${u.fullName}`, "success");
        return { ...u, isVip, vipUntil };
      }
      return u;
    }));
  };

  // Assign exam to student
  const handleAssignExam = (exam: Exam) => {
    setExamToAssign(exam);
    setAssignCode(`ASG-${Math.floor(1000 + Math.random() * 9000)}`);
    setAssignModalOpen(true);
  };

  const confirmAssignExam = () => {
    if (!examToAssign || !currentUser) return;
    const newAssignment: AssignedExam = {
      id: assignCode,
      examId: examToAssign.id,
      examTitle: examToAssign.title,
      teacherId: currentUser.id,
      assignedAt: new Date().toISOString(),
      results: []
    };
    setAssignedExams(prev => [newAssignment, ...prev]);
    setAssignModalOpen(false);
    showToast(`Giao đề thi thành công! Mã thi: ${assignCode}`, "success");
  };

  // Student test entry
  const handleAccessTest = () => {
    if (!studentAccessCode.trim()) {
      showToast("Vui lòng nhập mã phòng thi!", "error");
      return;
    }
    const found = assignedExams.find(a => a.id.toUpperCase() === studentAccessCode.trim().toUpperCase());
    if (!found) {
      showToast("Không tìm thấy phòng thi này! Vui lòng kiểm tra lại mã.", "error");
      return;
    }
    const exam = exams.find(e => e.id === found.examId) || initialExams.find(e => e.id === found.examId);
    if (!exam) {
      showToast("Đề thi này đã bị xóa hoặc không còn tồn tại!", "error");
      return;
    }
    setCurrentExam(exam);
    setTakeAnswers({});
    setScoreResult(null);
    setTakeTimeLeft(exam.duration * 60);
    setIsTakeActive(true);
    setExamMode("take");
    showToast("Vào phòng thi thành công! Thời gian làm bài bắt đầu.", "success");
  };

  // Student submission save to teacher's results and student history
  const handleStudentSubmitTest = (score: number, correct: number, total: number) => {
    if (!currentUser || !currentExam) return;

    // Save to assignedResults if student is taking an assigned exam
    const activeAssignment = assignedExams.find(
      a => a.examId === currentExam.id &&
      (studentAccessCode ? a.id.toUpperCase() === studentAccessCode.trim().toUpperCase() : true)
    );

    const newResult: StudentResult = {
      studentId: currentUser.id,
      studentName: currentUser.fullName,
      gradeClass: currentUser.gradeClass || "Học sinh tự do",
      score,
      correctCount: correct,
      totalQuestions: total,
      takenAt: new Date().toISOString()
    };

    if (activeAssignment) {
      setAssignedExams(prev => prev.map(a => {
        if (a.id === activeAssignment.id) {
          const filtered = a.results.filter(r => r.studentId !== currentUser.id);
          return { ...a, results: [...filtered, newResult] };
        }
        return a;
      }));
    }

    const newHistory: ExamHistory = {
      id: `hist-${Date.now()}`,
      examId: currentExam.id,
      examTitle: currentExam.title,
      grade: currentExam.grade,
      score,
      totalQuestions: total,
      correctCount: correct,
      timeSpent: currentExam.duration * 60 - takeTimeLeft,
      takenAt: new Date().toISOString(),
      answers: takeAnswers
    };
    setHistory(prev => [newHistory, ...prev]);
    showToast(`Nộp bài thi thành công! Điểm số: ${score.toFixed(1)}`, "success");
  };

  // Upload Reference Files
  const handleMultiFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    showToast(`Đang phân tích dữ liệu từ ${files.length} tệp...`, "info");
    try {
      const newDocs = await processAndStoreFiles(files, docUploadCategory, docUploadGrade);
      setUploadedDocs(prev => [...prev, ...newDocs]);
      showToast(`Đã lưu thành công ${newDocs.length} tệp tài liệu tham khảo!`, "success");
    } catch (err: any) {
      showToast("Lỗi tải tệp: " + err.message, "error");
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

  const handleDeleteExam = (examId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Bạn có chắc chắn muốn xóa đề thi này?")) {
      setExams(exams.filter(ex => ex.id !== examId));
      showToast("Đã xóa đề thi khỏi danh sách.", "success");
    }
  };

  const handleStartExamTaking = (exam: Exam) => {
    setCurrentExam(exam);
    setTakeAnswers({});
    setScoreResult(null);
    setTakeTimeLeft(exam.duration * 60);
    setIsTakeActive(true);
    setExamMode("take");
  };

  const handleFinishExam = () => {
    setIsTakeActive(false);
    let correct = 0;
    let total = 0;
    
    currentExam?.parts.forEach(part => {
      part.questions.forEach(q => {
        if (q.options.length > 0) { // MCQ only
          total++;
          if (takeAnswers[q.id] === q.correctAnswer) {
            correct++;
          }
        }
      });
    });
    
    const finalScore = total > 0 ? (correct / total) * 10 : 0;
    setScoreResult({ score: finalScore, correctCount: correct, maxCount: total });
    setExamMode("view");
    
    if (currentUser?.role === "student") {
      handleStudentSubmitTest(finalScore, correct, total);
    } else {
      const newHistory: ExamHistory = {
        id: `hist-${Date.now()}`,
        examId: currentExam!.id,
        examTitle: currentExam!.title,
        grade: currentExam!.grade,
        score: finalScore,
        totalQuestions: total,
        correctCount: correct,
        timeSpent: currentExam!.duration * 60 - takeTimeLeft,
        takenAt: new Date().toISOString(),
        answers: takeAnswers
      };
      setHistory(prev => [newHistory, ...prev]);
      showToast(`Đã hoàn thành! Điểm của bạn: ${finalScore.toFixed(1)}/10`, "success");
    }
  };

  const handleGenerateExam = async () => {
    if (currentUser?.role === "teacher" && !currentUser.isVip) {
      showToast("Tài khoản giáo viên chưa được kích hoạt VIP! Vui lòng liên hệ Thầy Thành.", "error");
      return;
    }

    setIsGenerating(true);
    showToast("Đang kết nối Gemini AI để biên soạn đề thi...", "info");

    try {
      const isUsingMatrixFile = !!matrixFileContent;
      let result;
      if (isUsingMatrixFile) {
        result = await analyzeMatrixAI(matrixFileName, matrixFileContent, selectedGrade, testType, customApiKey, selectedModel);
      } else {
        const pdfContext = await buildKnowledgeContext(selectedGrade, selectedUnits);
        result = await generateExamAI(selectedGrade, selectedUnits, testType, difficulty, customPrompt, term, academicYear, pdfContext || undefined, customApiKey, selectedModel);
      }

      const examData = result.data || result;
      const newExam: Exam = {
        ...examData,
        id: `exam-${Date.now()}`,
        grade: selectedGrade,
        units: selectedUnits,
        testType,
        difficulty,
        term,
        academicYear,
        createdAt: new Date().toISOString(),
      };

      setExams(prev => [newExam, ...prev]);
      setCurrentExam(newExam);
      setExamMode("view");
      showToast("Biên soạn đề thi thành công!", "success");
    } catch (err: any) {
      showToast("Lỗi từ AI: " + err.message, "error");
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper check export
  const validateExamBeforeExport = (exam: Exam): string | null => {
    const mcqs = exam.parts.flatMap(p => p.questions).filter(q => q.options.length > 0);
    if (exam.testType === "15m" && mcqs.length !== 20) {
      return `Số câu trắc nghiệm (${mcqs.length}) lệch chuẩn Bộ đề 15 phút (20 câu).`;
    }
    if (exam.testType.startsWith("midterm") && mcqs.length !== 36) {
      return `Số câu trắc nghiệm (${mcqs.length}) lệch chuẩn Bộ đề Giữa kỳ (36 câu).`;
    }
    if (exam.testType.startsWith("finalterm") && mcqs.length !== 36) {
      return `Số câu trắc nghiệm (${mcqs.length}) lệch chuẩn Bộ đề Cuối kỳ (36 câu).`;
    }
    return null;
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
    setSelectedGrade(currentExam.grade);
    if (currentExam.units && currentExam.units.length > 0) {
      setSelectedUnits(currentExam.units);
    }
    setTestType(currentExam.testType);
    if (currentExam.term) setTerm(currentExam.term);
    if (currentExam.academicYear) setAcademicYear(currentExam.academicYear);
    if (currentExam.difficulty) setDifficulty(currentExam.difficulty);
    
    setExamMode("none");
    setActiveTeacherTab("create");
    window.scrollTo({ top: 0, behavior: "smooth" });
    showToast("Đã nạp cài đặt của đề. Hãy chỉnh sửa và bấm biên soạn lại!", "info");
  };

  // Shuffle Action
  const handleShuffleAction = () => {
    if (!currentExam) return;
    const code = shuffleCodeInput.trim() || "102";
    const shuffled = shuffleExam(currentExam, code);
    setExams(prev => [shuffled, ...prev]);
    setCurrentExam(shuffled);
    setShuffleModalOpen(false);
    showToast(`Đã xáo trộn và lưu đề mới thành công với Mã đề ${code}!`, "success");
  };

  // AI Tutor submit question chat
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
    } finally {
      setIsTutorLoading(false);
    }
  };

  // Export backups (includes uploaded reference documents)
  const handleExportBackup = async () => {
    const docs = await getAllDocuments();
    const dataStr = JSON.stringify({ exams, history, uploadedDocs: docs });
    const blob = new Blob([dataStr], { type: "application/json" });
    saveAs(blob, "SmartTest_Backup.json");
    showToast("Đã xuất file lưu trữ thành công!", "success");
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.exams) setExams(parsed.exams);
        if (parsed.history) setHistory(parsed.history);
        if (parsed.uploadedDocs) {
          import("localforage").then(async (localforageModule) => {
            await localforageModule.default.setItem("smarttest_documents", parsed.uploadedDocs);
            setUploadedDocs(parsed.uploadedDocs);
          });
        }
        showToast("Đã khôi phục dữ liệu lưu trữ thành công!", "success");
      } catch (err) {
        showToast("File khôi phục không đúng định dạng!", "error");
      }
    };
    reader.readAsText(file);
  };

  // Render Login/Registration Page
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col justify-between overflow-hidden relative">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse delay-700"></div>

        <header className="p-6 flex items-center justify-between z-10 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-500 to-amber-500 rounded-xl text-white shadow-xl shadow-indigo-500/20">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-wider bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent">
                SmartTest Global Success
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium">
                AI Soạn đề & Đánh giá Tiếng Anh THCS chuẩn Bộ GD&ĐT
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4 z-10">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md backdrop-blur-xl bg-slate-900/60 border border-slate-700/50 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden"
            style={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)" }}
          >
            <div className="text-center space-y-1.5">
              <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-300 to-amber-200 bg-clip-text text-transparent">
                {authMode === "login" ? "Chào mừng quay trở lại!" : "Tạo tài khoản mới"}
              </h2>
              <p className="text-xs text-slate-400">
                {authMode === "login" ? "Đăng nhập để soạn đề hoặc tham gia phòng thi trực tuyến" : "Tham gia hệ thống ôn luyện bám sát SGK lớp 6-9"}
              </p>
            </div>

            <div className="flex bg-slate-950/60 p-1.5 rounded-xl border border-slate-800">
              <button 
                onClick={() => setAuthMode("login")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${authMode === "login" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20" : "text-slate-400 hover:text-white"}`}
              >
                ĐĂNG NHẬP
              </button>
              <button 
                onClick={() => setAuthMode("register")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${authMode === "register" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20" : "text-slate-400 hover:text-white"}`}
              >
                ĐĂNG KÝ
              </button>
            </div>

            <form onSubmit={authMode === "login" ? handleLogin : handleRegister} className="space-y-4">
              {authMode === "register" && (
                <>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bạn là ai?</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setAuthRole("teacher")}
                        className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${authRole === "teacher" ? "bg-amber-500/10 border-amber-500 text-amber-400" : "border-slate-800 bg-slate-950/30 text-slate-400 hover:text-white"}`}
                      >
                        🧑‍🏫 Giáo viên
                      </button>
                      <button
                        type="button"
                        onClick={() => setAuthRole("student")}
                        className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${authRole === "student" ? "bg-blue-500/10 border-blue-500 text-blue-400" : "border-slate-800 bg-slate-950/30 text-slate-400 hover:text-white"}`}
                      >
                        🧑‍🎓 Học sinh
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Họ và tên:</label>
                    <input
                      type="text"
                      required
                      value={authFullName}
                      onChange={(e) => setAuthFullName(e.target.value)}
                      placeholder="Ví dụ: Thầy Đinh Văn Thành"
                      className="w-full px-3.5 py-2.5 bg-slate-950/50 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none rounded-xl text-xs font-medium text-white placeholder-slate-500 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trường học:</label>
                    <input
                      type="text"
                      required
                      value={authSchool}
                      onChange={(e) => setAuthSchool(e.target.value)}
                      placeholder="Ví dụ: THCS Đồng Yên"
                      className="w-full px-3.5 py-2.5 bg-slate-950/50 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none rounded-xl text-xs font-medium text-white placeholder-slate-500 transition-all"
                    />
                  </div>

                  {authRole === "student" && (
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lớp học:</label>
                      <input
                        type="text"
                        required
                        value={authGradeClass}
                        onChange={(e) => setAuthGradeClass(e.target.value)}
                        placeholder="Ví dụ: 8A1, 9A2..."
                        className="w-full px-3.5 py-2.5 bg-slate-950/50 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none rounded-xl text-xs font-medium text-white placeholder-slate-500 transition-all"
                      />
                    </div>
                  )}
                </>
              )}

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tên đăng nhập:</label>
                <input
                  type="text"
                  required
                  value={authUsername}
                  onChange={(e) => setAuthUsername(e.target.value)}
                  placeholder="Nhập tên đăng nhập"
                  className="w-full px-3.5 py-2.5 bg-slate-950/50 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none rounded-xl text-xs font-medium text-white placeholder-slate-500 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mật khẩu:</label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="w-full px-3.5 py-2.5 bg-slate-950/50 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none rounded-xl text-xs font-medium text-white placeholder-slate-500 transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/35 active:scale-95 transition-all cursor-pointer uppercase tracking-wider mt-4"
              >
                {authMode === "login" ? "Đăng Nhập Hệ Thống" : "Đăng Ký Tài Khoản"}
              </button>
            </form>

            <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800 text-[10px] text-slate-400 leading-relaxed">
              <span className="font-bold text-indigo-400">💡 Demo nhanh:</span><br/>
              • Admin: <span className="font-mono text-white bg-slate-900 px-1 py-0.5 rounded font-bold">Admin</span> / <span className="font-mono text-white bg-slate-900 px-1 py-0.5 rounded font-bold">Admin123@</span><br/>
              • Giáo viên: <span className="font-mono text-slate-300 bg-slate-900 px-1 py-0.5 rounded">hoa.nguyen</span> / mk <span className="font-mono text-slate-300 bg-slate-900 px-1 py-0.5 rounded">123</span><br/>
              • Học sinh: <span className="font-mono text-slate-300 bg-slate-900 px-1 py-0.5 rounded">nam.nh</span> / mk <span className="font-mono text-slate-300 bg-slate-900 px-1 py-0.5 rounded">123</span>
            </div>
          </motion.div>
        </main>

        <footer className="p-4 text-center z-10">
          <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider bg-slate-950/30 py-1.5 px-3 rounded-full inline-block border border-slate-800">
            Quyền sở hữu: Thầy giáo Đinh Văn Thành - ĐT: 0915.213717
          </p>
        </footer>
      </div>
    );
  }

  // APP INTERFACE FOR LOGGED IN USERS
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12 flex flex-col justify-between">
      <div>
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

        {/* HEADER */}
        <header className="no-print sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
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

            <div className="flex items-center gap-3 self-end md:self-center flex-wrap">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                  {currentUser.fullName.substring(0, 1).toUpperCase()}
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    {currentUser.fullName}
                    {currentUser.isVip && (
                      <span className="bg-amber-100 border border-amber-200 text-amber-800 text-[8px] font-extrabold px-1 rounded flex items-center gap-0.5 animate-pulse">
                        <Award className="w-2.5 h-2.5" /> VIP
                      </span>
                    )}
                  </div>
                  <div className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">
                    {currentUser.role === "admin" ? "Quản trị viên" : currentUser.role === "teacher" ? "Giáo viên" : `Học sinh Lớp ${currentUser.gradeClass || ""}`} · {currentUser.school}
                  </div>
                </div>
              </div>

              {currentUser.role === "teacher" && (
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs transition-colors border border-slate-200 font-medium cursor-pointer"
                >
                  <Settings className="w-4 h-4" />
                  <span>Cài Đặt</span>
                </button>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-rose-200"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100 flex items-center gap-2 py-2 overflow-x-auto">
            {currentUser.role === "teacher" && (
              <>
                <button
                  onClick={() => { setActiveTeacherTab("create"); setExamMode("none"); }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTeacherTab === "create" ? "bg-blue-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"}`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Biên soạn đề thi (AI)</span>
                </button>
                <button
                  onClick={() => { setActiveTeacherTab("assigned"); setExamMode("none"); }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTeacherTab === "assigned" ? "bg-blue-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"}`}
                >
                  <Send className="w-4 h-4" />
                  <span>Quản lý giao bài ({assignedExams.filter(a => a.teacherId === currentUser.id).length})</span>
                </button>
              </>
            )}

            {currentUser.role === "student" && (
              <>
                <button
                  onClick={() => { setActiveStudentTab("assigned"); setExamMode("none"); }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeStudentTab === "assigned" ? "bg-blue-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"}`}
                >
                  <Play className="w-4 h-4" />
                  <span>Phòng thi trực tuyến</span>
                </button>
                <button
                  onClick={() => { setActiveStudentTab("results"); setExamMode("none"); }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeStudentTab === "results" ? "bg-blue-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"}`}
                >
                  <Trophy className="w-4 h-4" />
                  <span>Kết quả & Lịch sử</span>
                </button>
              </>
            )}

            {currentUser.role === "admin" && (
              <>
                <button
                  onClick={() => { setActiveAdminTab("stats"); setExamMode("none"); }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeAdminTab === "stats" ? "bg-indigo-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"}`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Thống kê hệ thống</span>
                </button>
                <button
                  onClick={() => { setActiveAdminTab("users"); setExamMode("none"); }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeAdminTab === "users" ? "bg-indigo-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"}`}
                >
                  <Users className="w-4 h-4" />
                  <span>Người dùng & Kích VIP</span>
                </button>
                <button
                  onClick={() => { setActiveAdminTab("logs"); setExamMode("none"); }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeAdminTab === "logs" ? "bg-indigo-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"}`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Nhật ký hoạt động</span>
                </button>
              </>
            )}
          </div>
        </header>

        {/* MAIN BODY CONTENT */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* TEACHER DASHBOARD */}
          {currentUser.role === "teacher" && activeTeacherTab === "create" && examMode === "none" && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Creator Options Form */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
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
                            onClick={() => {
                              setSelectedGrade(grade);
                              setSelectedUnits([1, 2, 3]);
                            }}
                            className={`py-3 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                              selectedGrade === grade
                                ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            Lớp {grade}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Test Type Select & Difficulty */}
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

                    {/* Unit Select checklist */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-slate-700 mb-2.5">
                        Kiến thức từ các bài học (Unit):
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-slate-100 rounded-xl p-3 bg-slate-50">
                        {GRADE_UNITS[selectedGrade]?.map((unit) => (
                          <label key={unit.id} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white transition-all cursor-pointer text-xs font-semibold text-slate-700">
                            <input
                              type="checkbox"
                              checked={selectedUnits.includes(unit.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedUnits([...selectedUnits, unit.id]);
                                } else {
                                  setSelectedUnits(selectedUnits.filter(id => id !== unit.id));
                                }
                              }}
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span>{unit.title}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Custom Prompt Guidelines */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Yêu cầu đặc biệt cho đề thi (Optional):
                      </label>
                      <textarea
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        placeholder="Ví dụ: Tập trung phần nghe về so sánh hơn, thêm nhiều câu trắc nghiệm từ vựng về môi trường..."
                        rows={3}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white shadow-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-medium placeholder-slate-400"
                      />
                    </div>

                    {/* Submit Generation Action */}
                    <button
                      onClick={handleGenerateExam}
                      disabled={isGenerating || selectedUnits.length === 0}
                      className={`w-full py-4.5 rounded-xl font-bold text-sm tracking-wide text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                        isGenerating || selectedUnits.length === 0
                          ? "bg-blue-300 cursor-wait"
                          : "bg-blue-600 hover:bg-blue-700 active:scale-98"
                      }`}
                    >
                      {isGenerating ? (
                        <>⏳ Đang soạn đề thi... (Có thể mất 1-2 phút) ...</>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 animate-pulse" />
                          <span>Biên soạn đề thi mới bằng AI</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Sidebar document configuration */}
                <div className="space-y-6">
                  {/* Reference Document Upload */}
                  <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
                    <h3 className="font-bold text-slate-800 text-sm mb-1.5 flex items-center gap-1.5">
                      <Upload className="w-4.5 h-4.5 text-blue-600" />
                      Căn cứ ra đề & Tài liệu tham khảo
                    </h3>
                    <p className="text-[10px] text-slate-400 mb-4 leading-normal">
                      Tải lên Đề mẫu, Ma trận, Đặc tả hoặc SGK để AI làm căn cứ cấu trúc và nội dung ra đề bám sát 100%.
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

                      {/* Display uploaded docs for this grade */}
                      {uploadedDocs.filter(d => d.grade === selectedGrade).length > 0 && (
                        <div className="pt-2 border-t border-slate-100 space-y-1.5 max-h-40 overflow-y-auto">
                          <h4 className="text-[11px] font-bold text-slate-700 mb-2.5">Tài liệu đã tải lên (Lớp {selectedGrade}):</h4>
                          {uploadedDocs.filter(d => d.grade === selectedGrade).map(doc => (
                            <div key={doc.id} className="flex items-center justify-between text-xs p-1.5 rounded bg-slate-50 border border-slate-100">
                              <span className="truncate flex-1 pr-2 font-medium">{getFileIcon(doc.fileType)} {doc.fileName}</span>
                              <div className="flex items-center gap-1">
                                <span className="text-[9px] text-slate-400 bg-white border px-1.5 py-0.5 rounded">{getCategoryLabel(doc.category)}</span>
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

              {/* SAVED EXAMS LIST */}
              <div className="mt-8 bg-white p-6 rounded-2xl shadow-xs border border-slate-200 no-print">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-bold text-slate-800">Kho đề thi đã soạn ({exams.length})</h3>
                  </div>
                  {exams.length > 0 && (
                    <span className="text-xs text-slate-500 italic">Nhấp vào đề để xem chi tiết, tải Word hoặc Giao cho học sinh</span>
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
                            onClick={() => handleAssignExam(exam)}
                            className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            Giao bài
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

          {/* TEACHER ASSIGNMENTS MANAGER TAB */}
          {currentUser.role === "teacher" && activeTeacherTab === "assigned" && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6">
              <div className="flex items-center gap-2.5">
                <Send className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-800">Quản lý giao đề thi & Kết quả học sinh</h2>
              </div>

              {assignedExams.filter(a => a.teacherId === currentUser.id).length === 0 ? (
                <div className="text-center py-12 text-slate-400 italic text-sm">
                  <Send className="w-12 h-12 mx-auto mb-3 opacity-30 text-indigo-600" />
                  <p>Chưa giao đề thi nào cho học sinh.</p>
                  <p className="text-xs mt-1">Vào mục "Biên soạn đề thi (AI)", kéo xuống và chọn "Giao bài" từ bất kỳ đề nào!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {assignedExams.filter(a => a.teacherId === currentUser.id).map(asg => (
                    <div key={asg.id} className="border border-slate-200 rounded-2xl p-5 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">{asg.examTitle}</h4>
                          <span className="text-[10px] text-slate-400">Ngày giao: {new Date(asg.assignedAt).toLocaleString("vi-VN")}</span>
                        </div>
                        <div className="flex items-center gap-2 self-start sm:self-center">
                          <span className="text-xs text-slate-500 font-semibold">Mã phòng thi:</span>
                          <span className="bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-lg text-xs font-extrabold font-mono tracking-wider">{asg.id}</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(asg.id);
                              showToast("Đã sao chép mã phòng thi!", "success");
                            }}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                            title="Sao chép mã"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <h5 className="text-xs font-bold text-slate-700 mb-2">Kết quả làm bài thi của Học sinh ({asg.results.length} bài nộp):</h5>
                        {asg.results.length === 0 ? (
                          <div className="text-left text-[11px] text-slate-400 italic py-3 bg-slate-50 rounded-xl px-4">
                            Chưa có học sinh nào nộp bài thi.
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead>
                                <tr className="border-b border-slate-200 text-slate-400 font-semibold bg-slate-50">
                                  <th className="p-2.5">Học sinh</th>
                                  <th className="p-2.5">Lớp</th>
                                  <th className="p-2.5 text-center">Số câu đúng</th>
                                  <th className="p-2.5 text-center">Điểm số</th>
                                  <th className="p-2.5 text-right">Nộp lúc</th>
                                </tr>
                              </thead>
                              <tbody>
                                {asg.results.map((res, rIdx) => (
                                  <tr key={rIdx} className="border-b border-slate-100 hover:bg-slate-50/50">
                                    <td className="p-2.5 font-bold text-slate-800">{res.studentName}</td>
                                    <td className="p-2.5 text-slate-600 font-medium">{res.gradeClass}</td>
                                    <td className="p-2.5 text-center font-mono font-bold text-slate-700">{res.correctCount}/{res.totalQuestions}</td>
                                    <td className="p-2.5 text-center font-bold text-red-600">{res.score.toFixed(1)}/10đ</td>
                                    <td className="p-2.5 text-right text-slate-400 text-[10px]">{new Date(res.takenAt).toLocaleString("vi-VN")}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STUDENT ONLINE TEST ROOM TAB */}
          {currentUser.role === "student" && activeStudentTab === "assigned" && examMode === "none" && (
            <div className="max-w-md mx-auto bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mx-auto">
                  <Play className="w-6 h-6 animate-pulse" />
                </div>
                <h2 className="text-base font-bold text-slate-800">Phòng thi trực tuyến</h2>
                <p className="text-xs text-slate-400 leading-relaxed">Nhập mã phòng thi (được cấp bởi giáo viên) để làm đề thi trực tiếp và lưu kết quả học tập.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Mã phòng thi:</label>
                  <input
                    type="text"
                    value={studentAccessCode}
                    onChange={(e) => setStudentAccessCode(e.target.value)}
                    placeholder="Ví dụ: ASG-1024"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-center text-lg font-bold font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all uppercase placeholder-slate-300"
                  />
                </div>

                <button
                  onClick={handleAccessTest}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer uppercase tracking-wider"
                >
                  Vào phòng thi làm bài
                </button>
              </div>
            </div>
          )}

          {/* STUDENT PAST RESULTS TAB */}
          {currentUser.role === "student" && activeStudentTab === "results" && examMode === "none" && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6">
              <div className="flex items-center gap-2.5">
                <Trophy className="w-5 h-5 text-amber-500 animate-bounce" />
                <h2 className="text-lg font-bold text-slate-800">Bảng kết quả học tập cá nhân</h2>
              </div>

              {history.length === 0 ? (
                <div className="text-center py-12 text-slate-400 italic text-sm">
                  <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30 text-amber-500" />
                  <p>Bạn chưa hoàn thành bài thi nào.</p>
                  <p className="text-xs mt-1">Hãy nhập mã kiểm tra và tiến hành làm bài để cải thiện thành tích nhé!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                      <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Bài thi đã làm</span>
                      <span className="text-2xl font-black text-slate-800">{history.length}</span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                      <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Điểm trung bình</span>
                      <span className="text-2xl font-black text-red-600">{(history.reduce((a, b) => a + b.score, 0) / history.length).toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-400 font-semibold bg-slate-50">
                          <th className="p-3">Bài thi</th>
                          <th className="p-3 text-center">Lớp</th>
                          <th className="p-3 text-center">Số câu đúng</th>
                          <th className="p-3 text-center">Điểm số</th>
                          <th className="p-3 text-right">Làm lúc</th>
                        </tr>
                      </thead>
                      <tbody>
                        {history.map((hist, idx) => (
                          <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50">
                            <td className="p-3 font-bold text-slate-800">{hist.examTitle}</td>
                            <td className="p-3 text-center text-slate-600 font-medium">Lớp {hist.grade}</td>
                            <td className="p-3 text-center font-mono font-bold text-slate-700">{hist.correctCount}/{hist.totalQuestions}</td>
                            <td className="p-3 text-center font-bold text-red-600">{hist.score.toFixed(1)}/10đ</td>
                            <td className="p-3 text-right text-slate-400 text-[10px]">{new Date(hist.takenAt).toLocaleString("vi-VN")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ADMIN OVERVIEW TAB */}
          {currentUser.role === "admin" && activeAdminTab === "stats" && examMode === "none" && (
            <div className="space-y-8">
              {/* Statistical Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Tổng giáo viên</span>
                    <h3 className="text-2xl font-black text-slate-800 mt-1">{users.filter(u => u.role === "teacher").length}</h3>
                  </div>
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <UserCheck className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Tổng học sinh</span>
                    <h3 className="text-2xl font-black text-slate-800 mt-1">{users.filter(u => u.role === "student").length}</h3>
                  </div>
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <Users className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Tài khoản VIP</span>
                    <h3 className="text-2xl font-black text-amber-600 mt-1">{users.filter(u => u.isVip).length}</h3>
                  </div>
                  <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
                    <Award className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Tổng số đề soạn</span>
                    <h3 className="text-2xl font-black text-indigo-800 mt-1">{exams.length}</h3>
                  </div>
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                    <FileText className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* User Statistics by School and Class */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                  <h3 className="text-sm font-bold text-slate-800">Thống kê theo Trường học:</h3>
                  <div className="space-y-2">
                    {Array.from(new Set(users.map(u => u.school))).map((sch, sIdx) => {
                      const count = users.filter(u => u.school === sch).length;
                      return (
                        <div key={sIdx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                          <span className="font-bold text-xs text-slate-700">{sch || "Chưa cập nhật"}</span>
                          <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full">{count} thành viên</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                  <h3 className="text-sm font-bold text-slate-800">Thống kê Học sinh theo Lớp học:</h3>
                  <div className="space-y-2">
                    {Array.from(new Set(users.filter(u => u.role === "student").map(u => u.gradeClass))).map((cls, cIdx) => {
                      const count = users.filter(u => u.role === "student" && u.gradeClass === cls).length;
                      return (
                        <div key={cIdx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                          <span className="font-bold text-xs text-slate-700">Lớp {cls || "Chưa cập nhật"}</span>
                          <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full">{count} học sinh</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ADMIN USERS LIST & VIP MANAGER TAB */}
          {currentUser.role === "admin" && activeAdminTab === "users" && examMode === "none" && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-800">Danh sách người dùng & Phân quyền VIP</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-semibold bg-slate-50">
                      <th className="p-3">Họ và tên</th>
                      <th className="p-3">Vai trò</th>
                      <th className="p-3">Trường</th>
                      <th className="p-3">Lớp</th>
                      <th className="p-3">Username</th>
                      <th className="p-3 text-center">Trạng thái VIP</th>
                      <th className="p-3 text-right">Phân quyền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, uIdx) => (
                      <tr key={uIdx} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="p-3 font-bold text-slate-800">{u.fullName}</td>
                        <td className="p-3 text-slate-600 font-medium">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            u.role === "admin" ? "bg-rose-100 text-rose-800" : u.role === "teacher" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"
                          }`}>
                            {u.role === "admin" ? "Quản trị" : u.role === "teacher" ? "Giáo viên" : "Học sinh"}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600">{u.school}</td>
                        <td className="p-3 text-slate-600 font-medium">{u.gradeClass || "-"}</td>
                        <td className="p-3 text-slate-500 font-mono">{u.username}</td>
                        <td className="p-3 text-center">
                          {u.isVip ? (
                            <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded-full" title={u.vipUntil ? `VIP đến: ${new Date(u.vipUntil).toLocaleDateString("vi-VN")}` : ""}>
                              ⚡ VIP Active
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[10px]">Thường</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          {u.role !== "admin" && (
                            <div className="flex items-center gap-1.5 justify-end">
                              {!u.isVip ? (
                                <button
                                  onClick={() => handleToggleVip(u.id, 1)}
                                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                                >
                                  Kích VIP (1 Năm)
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleToggleVip(u.id)}
                                  className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-[10px] font-bold cursor-pointer"
                                >
                                  Hủy VIP
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ADMIN GENERATION LOGS TAB */}
          {currentUser.role === "admin" && activeAdminTab === "logs" && examMode === "none" && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-800">Nhật ký hoạt động của giáo viên & học sinh</h2>
              </div>

              <div className="space-y-3.5 max-h-96 overflow-y-auto pr-1">
                {/* Generation audit log */}
                {exams.map((ex, exIdx) => (
                  <div key={exIdx} className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-indigo-600">🧑‍🏫 Giáo viên</span> đã biên soạn đề: <span className="font-bold text-slate-800">{ex.title}</span> (Lớp {ex.grade})
                    </div>
                    <span className="text-[10px] text-slate-400">{new Date(ex.createdAt).toLocaleString("vi-VN")}</span>
                  </div>
                ))}

                {/* Student attempts logs */}
                {assignedExams.flatMap(a => a.results.map(r => ({ ...r, examTitle: a.examTitle }))).map((res, rIdx) => (
                  <div key={rIdx} className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-blue-600">🧑‍🎓 Học sinh {res.studentName}</span> (Lớp {res.gradeClass}) đã thi: <span className="font-bold text-slate-800">{res.examTitle}</span> · Đạt <span className="font-bold text-red-600">{res.score.toFixed(1)}/10đ</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{new Date(res.takenAt).toLocaleString("vi-VN")}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

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
                  <span>Quay lại bảng điều khiển</span>
                </button>

                <div className="flex items-center gap-2 flex-wrap">
                  {currentUser.role === "teacher" && (
                    <>
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
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                        <span>Tải Tất Cả (ZIP)</span>
                      </button>

                      <button
                        onClick={() => window.print()}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors border border-slate-200 cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>In Đề Thi</span>
                      </button>

                      <button
                        onClick={() => setShuffleModalOpen(true)}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-amber-50 hover:text-amber-700 text-slate-700 rounded-lg text-xs font-semibold transition-colors border border-slate-200 cursor-pointer"
                      >
                        <Shuffle className="w-3.5 h-3.5" />
                        <span>Đảo câu hỏi / Tạo Mã đề</span>
                      </button>

                      <button
                        onClick={handleGenerateSimilar}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-700 rounded-lg text-xs font-semibold transition-colors border border-slate-200 cursor-pointer"
                        title="Sao chép các tùy chọn của đề này để sinh một đề tương tự"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Sinh đề tương tự</span>
                      </button>
                    </>
                  )}

                  {examMode !== "take" && currentUser.role === "student" && (
                    <button
                      onClick={() => handleStartExamTaking(currentExam)}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Làm lại bài thi</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Exam Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* Exam Content Body */}
                <div className="lg:col-span-3 space-y-6 print-card">
                  <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-slate-200 print-card">
                    
                    {/* Header standard paper layout */}
                    <div className="text-center pb-6 border-b border-dashed border-slate-300">
                      <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-3 no-print">
                        <span>CHƯƠNG TRÌNH GLOBAL SUCCESS</span>
                        <span>MÃ ĐỀ: {currentExam.versionCode || "Gốc (101)"}</span>
                      </div>
                      <p className="text-[11px] uppercase font-bold text-slate-600">{currentExam.orgName || "UBND XÃ ĐỒNG YÊN"}</p>
                      <p className="text-[11px] uppercase font-bold text-slate-600">{currentExam.schoolName || "Trường THCS Đồng Yên"}</p>
                      
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

                    {/* Parts iterator */}
                    <div className="mt-8 space-y-8">
                      {currentExam.parts.map((part, pIdx) => (
                        <div key={pIdx} className="space-y-4">
                          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 print-card print:p-0 print:border-none">
                            <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm uppercase tracking-wide">
                              {part.title}
                            </h4>
                            <p className="text-xs text-slate-500 italic mt-1 font-medium">
                              {part.instruction}
                            </p>
                          </div>

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

                                  {/* Answer choices */}
                                  {q.options.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pl-0 sm:pl-6">
                                      {q.options.map((opt, oIdx) => {
                                        const letter = getOptionLetter(opt);
                                        const isSelected = isSelectedOption(opt);
                                        const isCorrect = q.correctAnswer === letter;
                                        
                                        let btnClass = "border-slate-200 hover:border-blue-400 bg-white text-slate-700";
                                        if (examMode === "take") {
                                          btnClass = isSelected 
                                            ? "bg-blue-600 text-white border-blue-600 font-bold" 
                                            : "border-slate-200 hover:border-blue-400 bg-white text-slate-700";
                                        } else if (examMode === "view") {
                                          if (isCorrect) {
                                            btnClass = "bg-emerald-50 border-emerald-500 text-emerald-700 font-bold";
                                          } else if (isSelected) {
                                            btnClass = "bg-rose-50 border-rose-500 text-rose-700 font-bold";
                                          }
                                        }

                                        return (
                                          <button
                                            key={oIdx}
                                            disabled={examMode !== "take"}
                                            onClick={() => setTakeAnswers({ ...takeAnswers, [q.id]: letter })}
                                            className={`text-left px-4 py-2.5 rounded-xl border text-xs transition-all leading-normal flex items-start gap-2 cursor-pointer ${btnClass}`}
                                          >
                                            <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                                              isSelected ? "bg-white text-blue-600" : "bg-slate-100 text-slate-500"
                                            }`}>
                                              {letter}
                                            </span>
                                            <span className="flex-1 pr-1 font-medium">{opt.substring(2)}</span>
                                            {examMode === "view" && isCorrect && <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                                            {examMode === "view" && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  ) : (
                                    <div className="pl-6 space-y-2">
                                      {examMode === "take" ? (
                                        <textarea
                                          value={takeAnswers[q.id] || ""}
                                          onChange={(e) => setTakeAnswers({ ...takeAnswers, [q.id]: e.target.value })}
                                          placeholder="Nhập nội dung bài viết của bạn tại đây..."
                                          rows={8}
                                          className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none text-sm leading-relaxed"
                                        />
                                      ) : takeAnswers[q.id] ? (
                                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans">Bài làm của học sinh:</p>
                                          <div className="text-sm text-slate-800 bg-white p-3 rounded-lg border border-slate-200 min-h-[100px] whitespace-pre-wrap font-medium font-sans">
                                            {takeAnswers[q.id]}
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 font-mono text-slate-400 select-none">
                                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans">Khu vực làm bài viết tự luận (Dành cho HS):</p>
                                          <div className="text-xs leading-6 tracking-widest text-slate-300">
                                            ........................................................................................................................................................................................................................................................................................................................
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Explanations block */}
                                  {examMode === "view" && q.explanation && (
                                    <div className="pl-6 pt-1">
                                      <button
                                        onClick={() => setExpandedExplanation(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                                        className="text-[10px] text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 cursor-pointer"
                                      >
                                        <Info className="w-3 h-3" />
                                        <span>{expandedExplanation[q.id] ? "Ẩn giải thích chi tiết" : "Xem giải thích chi tiết"}</span>
                                      </button>

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

                    {/* Print answers at sheet footer */}
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
                    </div>

                  </div>
                </div>

                {/* Exam Sidebar panels */}
                <div className="space-y-6 no-print">
                  {/* Timer panel */}
                  {examMode === "take" && (
                    <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-md border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Thời gian còn lại</span>
                        <Clock className="w-5 h-5 text-amber-500 animate-pulse" />
                      </div>
                      <div className="text-3xl font-black text-center font-mono tracking-widest text-amber-400">
                        {Math.floor(takeTimeLeft / 60)}:{(takeTimeLeft % 60).toString().padStart(2, "0")}
                      </div>
                      <button
                        onClick={handleFinishExam}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer uppercase tracking-wider"
                      >
                        Nộp bài thi
                      </button>
                    </div>
                  )}

                  {/* Audio Transcript panel */}
                  {currentExam.transcripts && (
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                      <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 uppercase">
                        <FileText className="w-4 h-4 text-blue-600" />
                        Audio Transcript (Lời bài nghe)
                      </h4>
                      <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto border border-slate-100 rounded-lg p-2.5 bg-slate-50">
                        {currentExam.transcripts}
                      </div>
                    </div>
                  )}

                  {/* Writing Rubric panel */}
                  {currentExam.writingRubric && (
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                      <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 uppercase">
                        <Trophy className="w-4 h-4 text-amber-500" />
                        Đáp án & Biểu điểm tự luận
                      </h4>
                      <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto border border-slate-100 rounded-lg p-2.5 bg-slate-50 font-medium">
                        {currentExam.writingRubric}
                      </div>
                    </div>
                  )}

                  {/* Matrix panel */}
                  {currentExam.matrixData && (
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                      <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 uppercase">
                        <FileSpreadsheet className="w-4 h-4 text-purple-600" />
                        Ma trận đề kiểm tra
                      </h4>
                      <div className="text-[10px] text-slate-600 overflow-x-auto max-h-48 overflow-y-auto p-1 bg-slate-50 border rounded-lg">
                        <div dangerouslySetInnerHTML={{ __html: currentExam.matrixData }} />
                      </div>
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

        </main>
      </div>

      {/* FLOAT OWNERSHIP FOOTER FOR ALL PAGES */}
      <footer className="no-print border-t border-slate-200 mt-12 pt-4 text-center">
        <p className="text-[11px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider py-1.5 px-4 bg-slate-100 rounded-full inline-block border border-slate-200 shadow-2xs">
          Quyền sở hữu: Thầy giáo Đinh Văn Thành - ĐT: 0915.213717
        </p>
      </footer>

      {/* SETTINGS / API CONFIG MODAL */}
      <AnimatePresence>
        {showSettingsModal && (
          <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden"
            >
              {/* Modal title */}
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-600 animate-spin" style={{ animationDuration: '3s' }} />
                  <h3 className="font-bold text-slate-800 text-sm">Cấu hình tham số AI & Hệ thống</h3>
                </div>
                <button 
                  onClick={() => setShowSettingsModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Form content */}
              <div className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Gemini API Key của bạn:
                  </label>
                  <div className="relative">
                    <input
                      type={showApiKey ? "text" : "password"}
                      value={customApiKey}
                      onChange={(e) => {
                        setCustomApiKey(e.target.value);
                        localStorage.setItem("gemini_api_key", e.target.value);
                      }}
                      placeholder="Nhập API Key cá nhân của bạn (Ví dụ: AIzaSy...)"
                      className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-blue-500 outline-none font-medium"
                    />
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block leading-normal">
                    * Nếu không nhập API Key, ứng dụng sẽ tự động sử dụng máy chủ AI dự phòng (miễn phí, giới hạn lượt dùng) của Pollinations.ai.
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Lựa chọn Model Gemini:
                  </label>
                  <select
                    value={selectedModel}
                    onChange={(e) => {
                      setSelectedModel(e.target.value);
                      localStorage.setItem("gemini_selected_model", e.target.value);
                    }}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-blue-500 outline-none font-medium"
                  >
                    <option value="gemini-3.5-flash">Gemini 3.5 Flash (Mặc định - Cực nhanh & Đề chuẩn)</option>
                    <option value="gemini-3.5-pro">Gemini 3.5 Pro (Độ chính xác cao nhất, đề tối ưu nhất)</option>
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
                  Ứng dụng sẽ tự động đảo ngẫu nhiên trật tự câu hỏi và thứ tự các đáp án (A, B, C) của đề hiện tại, tạo ra một bản đề hoàn chỉnh mới mà không làm thay đổi hay sai lệch khóa đáp án gốc.
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

      {/* ASSIGN EXAM MODAL */}
      <AnimatePresence>
        {assignModalOpen && (
          <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full overflow-hidden"
            >
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Send className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-800 text-sm">Giao đề thi cho học sinh</h3>
                </div>
                <button 
                  onClick={() => setAssignModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="p-5 space-y-4 text-xs">
                <p className="text-slate-500 leading-relaxed">
                  Ứng dụng sẽ tạo một mã phòng thi duy nhất cho đề thi này. Hãy gửi mã này cho học sinh để làm bài trực tuyến.
                </p>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Mã phòng thi tự động:</label>
                  <input
                    type="text"
                    value={assignCode}
                    onChange={(e) => setAssignCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-center text-sm font-bold font-mono tracking-wider outline-none"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                <button
                  onClick={() => setAssignModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-xs cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={confirmAssignExam}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs cursor-pointer"
                >
                  Xác nhận giao bài
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
