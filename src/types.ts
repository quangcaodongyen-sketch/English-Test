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
  testType: "15m" | "midterm" | "finalterm" | string;
  duration: number; // in minutes
  totalQuestions: number;
  parts: ExamPart[];
  createdAt: string;
  versionCode?: string; // Code for shuffled versions (e.g. "Mã đề 101")
  matrixData?: string;
  specData?: string;
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

export interface AppState {
  savedExams: Exam[];
  history: ExamHistory[];
  settings: {
    theme: "light" | "dark";
    autoSave: boolean;
    defaultGrade: number;
    customApiKey: string;
    selectedModel: string;
  };
}
