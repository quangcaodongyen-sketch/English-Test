export interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string; // "A", "B", "C", "D"
  explanation: string;
  difficulty: "Nhận biết" | "Thông hiểu" | "Vận dụng" | "Vận dụng cao" | string;
  topic?: string;
  userAnswer?: string; // transient state when taking exam
}

export interface ExamPart {
  title: string;
  instruction: string;
  questions: Question[];
}

export interface Exam {
  id: string;
  title: string;
  orgName?: string;
  schoolName?: string;
  subject?: string;
  grade: number; // 6, 7, 8, 9
  term?: string;
  academicYear?: string;
  units?: number[];
  difficulty?: string;
  testType: "15m" | "midterm" | "finalterm" | string;
  duration: number; // in minutes
  totalQuestions: number;
  parts: ExamPart[];
  createdAt: string;
  versionCode?: string; // Code for shuffled versions (e.g. "Mã đề 101")
  matrixData?: string;
  specData?: string;
  transcripts?: string;
  writingRubric?: string;
  // --- New fields for admin management ---
  creatorId?: string;       // ID of the teacher who created this exam
  creatorName?: string;     // Display name of the creator
  status?: "draft" | "saved" | "exported" | "assigned"; // Exam lifecycle status
  semester?: string;        // e.g. "HK1", "HK2"
}

export interface User {
  id: string;
  role: "teacher" | "student" | "admin";
  fullName: string;
  school: string;
  gradeClass?: string; // only for students
  username: string;
  password?: string;
  isVip: boolean;
  vipUntil?: string;
  createdAt: string;
}

export interface StudentResult {
  studentId: string;
  studentName: string;
  gradeClass?: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  takenAt: string;
  // --- New fields for detailed tracking ---
  startedAt?: string;       // When the student started the exam
  wrongCount?: number;      // Number of wrong answers
  status?: "in_progress" | "submitted" | "overdue"; // Submission status
  answers?: Record<string, string>; // questionId -> answer chosen
}

export interface AssignedExam {
  id: string; // Assignment ID code (e.g. "TEST-1234")
  examId: string;
  examTitle: string;
  teacherId: string;
  teacherName?: string;     // Display name of assigning teacher
  assignedAt: string;
  results: StudentResult[];
  showAnswers?: boolean;    // Whether students can see correct answers after submission
}

export interface ExamHistory {
  id: string;
  examId: string;
  examTitle: string;
  grade: number;
  score: number;
  totalQuestions: number;
  correctCount: number;
  timeSpent: number; // in seconds
  takenAt: string;
  answers: Record<string, string>; // questionId -> answer chosen
}

// --- New interfaces for admin management ---

export type ActivityAction =
  | "exam_created"
  | "exam_exported"
  | "exam_deleted"
  | "exam_duplicated"
  | "exam_assigned"
  | "student_submitted"
  | "user_registered"
  | "vip_activated"
  | "vip_revoked"
  | "user_deleted"
  | "report_exported";

export interface ActivityLog {
  id: string;
  action: ActivityAction;
  userId: string;
  userName: string;
  userRole: "teacher" | "student" | "admin";
  target?: string;          // e.g. exam title, user name
  details?: string;         // Additional context
  timestamp: string;
}

export interface ClassScoreStats {
  gradeClass: string;
  totalStudents: number;
  submittedCount: number;
  notSubmittedCount: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passCount: number;        // Score >= 5
  failCount: number;        // Score < 5
}

export interface AppState {
  savedExams: Exam[];
  history: ExamHistory[];
  users: User[];
  currentUser: User | null;
  assignedExams: AssignedExam[];
  activityLogs: ActivityLog[];
  settings: {
    theme: "light" | "dark";
    autoSave: boolean;
    defaultGrade: number;
    customApiKey: string;
    selectedModel: string;
  };
}
