import React, { useState, useMemo } from "react";
import {
  BarChart3, Users, FileText, Send, Trophy, Award, UserCheck,
  Search, ChevronDown, ChevronUp, Eye, FileDown, Copy, Trash2,
  Download, Filter, ArrowRight, Shield, Clock, CheckCircle, XCircle,
  BookOpen, Sparkles, Settings, PlusCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Exam, User as AppUser, AssignedExam, ActivityLog, ClassScoreStats, ExamHistory } from "../types";
import { exportToWord, exportAnswersToWord, exportMatrixToWord, exportSpecToWord } from "../utils";
import {
  exportTeacherReport,
  exportExamReport,
  exportStudentResultReport,
  exportClassScoreReport,
  exportSchoolSummaryReport,
} from "../services/adminReports";

// ---- Admin Tab type ----
export type AdminTab = "dashboard" | "teachers" | "students" | "exams" | "online" | "scores" | "reports";

// ---- Props ----
export interface AdminDashboardProps {
  users: AppUser[];
  exams: Exam[];
  assignedExams: AssignedExam[];
  activityLogs: ActivityLog[];
  history: ExamHistory[];
  currentUser: AppUser;
  onDeleteUser: (userId: string) => void;
  onToggleVip: (userId: string, years?: number) => void;
  onDeleteExam: (examId: string) => void;
  onDuplicateExam: (exam: Exam) => void;
  onViewExam: (exam: Exam) => void;
  showToast: (text: string, type: "success" | "error" | "info") => void;
}

// ---- Helper functions ----
function getTestTypeLabel(t: string): string {
  const map: Record<string, string> = {
    "15m": "KT 15 phút", "midterm1": "Giữa kỳ I", "finalterm1": "Cuối kỳ I",
    "midterm2": "Giữa kỳ II", "finalterm2": "Cuối kỳ II",
  };
  return map[t] || t;
}

function getStatusLabel(s?: string): string {
  const map: Record<string, string> = { draft: "Nháp", saved: "Đã lưu", exported: "Đã xuất", assigned: "Đã giao HS" };
  return s ? (map[s] || s) : "Đã lưu";
}

function getStatusColor(s?: string): string {
  const map: Record<string, string> = {
    draft: "bg-slate-100 text-slate-600",
    saved: "bg-blue-100 text-blue-700",
    exported: "bg-emerald-100 text-emerald-700",
    assigned: "bg-amber-100 text-amber-700",
  };
  return s ? (map[s] || "bg-slate-100 text-slate-600") : "bg-blue-100 text-blue-700";
}

function fmtDate(iso: string) { return new Date(iso).toLocaleDateString("vi-VN"); }
function fmtDateTime(iso: string) { return new Date(iso).toLocaleString("vi-VN"); }

// ---- Compute class score stats ----
function computeClassScoreStats(
  assignedExams: AssignedExam[],
  students: AppUser[]
): ClassScoreStats[] {
  const classes = [...new Set(students.map(s => s.gradeClass).filter(Boolean))] as string[];
  const allResults = assignedExams.flatMap(a => a.results);

  return classes.map(cls => {
    const classStudents = students.filter(s => s.gradeClass === cls);
    const classResults = allResults.filter(r => r.gradeClass === cls);
    const scores = classResults.map(r => r.score);
    return {
      gradeClass: cls,
      totalStudents: classStudents.length,
      submittedCount: classResults.length,
      notSubmittedCount: Math.max(0, classStudents.length - classResults.length),
      averageScore: scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0,
      highestScore: scores.length > 0 ? Math.max(...scores) : 0,
      lowestScore: scores.length > 0 ? Math.min(...scores) : 0,
      passCount: scores.filter(s => s >= 5).length,
      failCount: scores.filter(s => s < 5).length,
    };
  }).sort((a, b) => a.gradeClass.localeCompare(b.gradeClass));
}

// ========================================================
// AdminDashboard Component
// ========================================================
export default function AdminDashboard({
  users, exams, assignedExams, activityLogs, history,
  currentUser, onDeleteUser, onToggleVip, onDeleteExam,
  onDuplicateExam, onViewExam, showToast,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGrade, setFilterGrade] = useState<string>("all");
  const [filterTestType, setFilterTestType] = useState<string>("all");
  const [filterTeacher, setFilterTeacher] = useState<string>("all");
  const [filterTimeRange, setFilterTimeRange] = useState<string>("all");
  const [expandedTeacher, setExpandedTeacher] = useState<string | null>(null);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [expandedAssignment, setExpandedAssignment] = useState<string | null>(null);

  // Derived data
  const teachers = useMemo(() => users.filter(u => u.role === "teacher"), [users]);
  const students = useMemo(() => users.filter(u => u.role === "student"), [users]);
  const allResults = useMemo(() => assignedExams.flatMap(a => a.results.map(r => ({ ...r, examTitle: a.examTitle }))), [assignedExams]);
  const classStats = useMemo(() => computeClassScoreStats(assignedExams, students), [assignedExams, students]);

  // Time filter helper
  const isInTimeRange = (dateStr: string) => {
    if (filterTimeRange === "all") return true;
    const d = new Date(dateStr);
    const now = new Date();
    if (filterTimeRange === "today") {
      return d.toDateString() === now.toDateString();
    }
    if (filterTimeRange === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 86400000);
      return d >= weekAgo;
    }
    if (filterTimeRange === "month") {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }
    if (filterTimeRange === "semester") {
      const m = now.getMonth();
      const semStart = m < 6 ? new Date(now.getFullYear(), 0, 1) : new Date(now.getFullYear(), 6, 1);
      return d >= semStart;
    }
    if (filterTimeRange === "year") {
      const yearStart = now.getMonth() >= 8 ? new Date(now.getFullYear(), 8, 1) : new Date(now.getFullYear() - 1, 8, 1);
      return d >= yearStart;
    }
    return true;
  };

  // Filtered exams
  const filteredExams = useMemo(() => {
    return exams.filter(e => {
      if (searchQuery && !e.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filterGrade !== "all" && e.grade !== Number(filterGrade)) return false;
      if (filterTestType !== "all" && e.testType !== filterTestType) return false;
      if (filterTeacher !== "all" && e.creatorId !== filterTeacher) return false;
      if (!isInTimeRange(e.createdAt)) return false;
      return true;
    });
  }, [exams, searchQuery, filterGrade, filterTestType, filterTeacher, filterTimeRange]);

  // ---- Tab navigation items ----
  const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: "Dashboard", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "teachers", label: "Quản lý GV", icon: <UserCheck className="w-4 h-4" /> },
    { id: "students", label: "Quản lý HS", icon: <Users className="w-4 h-4" /> },
    { id: "exams", label: "Quản lý Đề", icon: <FileText className="w-4 h-4" /> },
    { id: "online", label: "Bài thi TT", icon: <Send className="w-4 h-4" /> },
    { id: "scores", label: "Thống kê Điểm", icon: <Trophy className="w-4 h-4" /> },
    { id: "reports", label: "Xuất Báo cáo", icon: <Download className="w-4 h-4" /> },
  ];

  // ---- KPI Card Component ----
  const KpiCard = ({ label, value, color, icon }: { label: string; value: number | string; color: string; icon: React.ReactNode }) => (
    <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex items-center justify-between">
      <div>
        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{label}</span>
        <h3 className="text-2xl font-black text-slate-800 mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
    </div>
  );

  // ---- Bar Chart CSS ----
  const BarChart = ({ data, maxVal }: { data: { label: string; value: number }[]; maxVal?: number }) => {
    const max = maxVal || Math.max(...data.map(d => d.value), 1);
    return (
      <div className="space-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-slate-600 w-16 text-right truncate">{d.label}</span>
            <div className="flex-1 bg-slate-100 rounded-full h-5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(d.value / max) * 100}%` }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-end pr-2"
              >
                <span className="text-[9px] font-bold text-white">{d.value.toFixed(1)}</span>
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ---- Pie Chart CSS ----
  const PieChart = ({ pass, fail }: { pass: number; fail: number }) => {
    const total = pass + fail || 1;
    const passPercent = Math.round((pass / total) * 100);
    const failPercent = 100 - passPercent;
    return (
      <div className="flex items-center gap-6">
        <div className="relative w-28 h-28">
          <svg viewBox="0 0 36 36" className="w-28 h-28 transform -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3.5" />
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#22c55e" strokeWidth="3.5"
              strokeDasharray={`${passPercent} ${failPercent}`} strokeDashoffset="0" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-black text-slate-800">{passPercent}%</span>
            <span className="text-[8px] font-bold text-slate-400">ĐẠT</span>
          </div>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="font-bold text-slate-700">Đạt (≥5đ): {pass} HS</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-300"></div>
            <span className="font-bold text-slate-700">Chưa đạt: {fail} HS</span>
          </div>
        </div>
      </div>
    );
  };

  // ---- Distribution Chart ----
  const DistributionChart = ({ results }: { results: { score: number }[] }) => {
    const ranges = ["0-2", "2-4", "4-6", "6-8", "8-10"];
    const counts = ranges.map((_, i) => {
      const lo = i * 2;
      const hi = lo + 2;
      return results.filter(r => r.score >= lo && (hi === 10 ? r.score <= hi : r.score < hi)).length;
    });
    const max = Math.max(...counts, 1);
    return (
      <div className="flex items-end gap-2 h-32">
        {ranges.map((label, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-[9px] font-bold text-slate-600">{counts[i]}</span>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(counts[i] / max) * 100}%` }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`w-full rounded-t-lg min-h-[4px] ${i < 2 ? "bg-rose-400" : i < 3 ? "bg-amber-400" : "bg-emerald-400"}`}
            />
            <span className="text-[9px] font-bold text-slate-500">{label}</span>
          </div>
        ))}
      </div>
    );
  };

  // =========================================
  // RENDER
  // =========================================
  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-1.5 flex flex-wrap gap-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSearchQuery(""); }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ========== TAB 1: DASHBOARD ========== */}
      {activeTab === "dashboard" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Time filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-500">Thời gian:</span>
            {[
              { v: "all", l: "Tất cả" }, { v: "today", l: "Hôm nay" }, { v: "week", l: "Tuần này" },
              { v: "month", l: "Tháng này" }, { v: "semester", l: "Học kỳ" }, { v: "year", l: "Năm học" },
            ].map(f => (
              <button
                key={f.v}
                onClick={() => setFilterTimeRange(f.v)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                  filterTimeRange === f.v ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {f.l}
              </button>
            ))}
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <KpiCard label="Tổng Giáo viên" value={teachers.length} color="bg-blue-50 text-blue-600" icon={<UserCheck className="w-5 h-5" />} />
            <KpiCard label="Tổng Học sinh" value={students.length} color="bg-emerald-50 text-emerald-600" icon={<Users className="w-5 h-5" />} />
            <KpiCard label="Tổng Đề thi" value={exams.length} color="bg-indigo-50 text-indigo-600" icon={<FileText className="w-5 h-5" />} />
            <KpiCard label="Lượt thi" value={allResults.length} color="bg-violet-50 text-violet-600" icon={<Send className="w-5 h-5" />} />
            <KpiCard label="VIP Active" value={users.filter(u => u.isVip).length} color="bg-amber-50 text-amber-500" icon={<Award className="w-5 h-5" />} />
            <KpiCard label="Đề chưa giao" value={exams.filter(e => e.status !== "assigned").length} color="bg-rose-50 text-rose-500" icon={<Clock className="w-5 h-5" />} />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Teachers */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="text-sm font-bold text-slate-800">🏆 Top Giáo viên tạo đề</h3>
              <div className="space-y-2">
                {teachers
                  .map(t => ({ name: t.fullName, count: exams.filter(e => e.creatorId === t.id).length }))
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 5)
                  .map((t, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white ${
                        i === 0 ? "bg-amber-500" : i === 1 ? "bg-slate-400" : i === 2 ? "bg-amber-700" : "bg-slate-300"
                      }`}>{i + 1}</span>
                      <span className="text-xs font-bold text-slate-700 flex-1">{t.name}</span>
                      <span className="text-xs font-black text-indigo-600">{t.count} đề</span>
                    </div>
                  ))}
                {teachers.length === 0 && <p className="text-xs text-slate-400 italic">Chưa có giáo viên nào.</p>}
              </div>
            </div>

            {/* Score Distribution */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="text-sm font-bold text-slate-800">📊 Phân bố điểm toàn trường</h3>
              {allResults.length > 0 ? (
                <DistributionChart results={allResults} />
              ) : (
                <p className="text-xs text-slate-400 italic">Chưa có dữ liệu.</p>
              )}
            </div>
          </div>

          {/* Average Score by Class */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="text-sm font-bold text-slate-800">📈 Điểm trung bình theo Lớp</h3>
              {classStats.length > 0 ? (
                <BarChart data={classStats.map(s => ({ label: s.gradeClass, value: s.averageScore }))} maxVal={10} />
              ) : (
                <p className="text-xs text-slate-400 italic">Chưa có dữ liệu.</p>
              )}
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="text-sm font-bold text-slate-800">🥧 Tỷ lệ Đạt / Chưa đạt</h3>
              {allResults.length > 0 ? (
                <PieChart
                  pass={allResults.filter(r => r.score >= 5).length}
                  fail={allResults.filter(r => r.score < 5).length}
                />
              ) : (
                <p className="text-xs text-slate-400 italic">Chưa có dữ liệu.</p>
              )}
            </div>
          </div>

          {/* Exams by Grade/Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="text-sm font-bold text-slate-800">📚 Số đề theo Khối</h3>
              <div className="space-y-2">
                {[6, 7, 8, 9].map(g => (
                  <div key={g} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs font-bold text-slate-700">Khối {g}</span>
                    <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">{exams.filter(e => e.grade === g).length} đề</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="text-sm font-bold text-slate-800">📋 Số đề theo Loại</h3>
              <div className="space-y-2">
                {["15m", "midterm1", "finalterm1", "midterm2", "finalterm2"].map(t => (
                  <div key={t} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs font-bold text-slate-700">{getTestTypeLabel(t)}</span>
                    <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">{exams.filter(e => e.testType === t).length} đề</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========== TAB 2: TEACHERS ========== */}
      {activeTab === "teachers" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-indigo-600" /> Quản lý Giáo viên ({teachers.length})
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold bg-slate-50">
                    <th className="p-3">STT</th>
                    <th className="p-3">Họ và tên</th>
                    <th className="p-3">Username</th>
                    <th className="p-3">Trường</th>
                    <th className="p-3 text-center">Số đề</th>
                    <th className="p-3 text-center">VIP</th>
                    <th className="p-3 text-center">Chi tiết</th>
                    <th className="p-3 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((t, i) => {
                    const tExams = exams.filter(e => e.creatorId === t.id);
                    const isExpanded = expandedTeacher === t.id;
                    return (
                      <React.Fragment key={t.id}>
                        <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="p-3 text-slate-500 font-mono">{i + 1}</td>
                          <td className="p-3 font-bold text-slate-800">{t.fullName}</td>
                          <td className="p-3 text-slate-500 font-mono">{t.username}</td>
                          <td className="p-3 text-slate-600">{t.school}</td>
                          <td className="p-3 text-center font-black text-indigo-600">{tExams.length}</td>
                          <td className="p-3 text-center">
                            {t.isVip ? (
                              <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded-full">⚡ VIP</span>
                            ) : (
                              <span className="text-slate-400 text-[10px]">Thường</span>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => setExpandedTeacher(isExpanded ? null : t.id)}
                              className="px-2 py-1 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-lg text-[10px] font-bold cursor-pointer"
                            >
                              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center gap-1 justify-end">
                              {!t.isVip ? (
                                <button onClick={() => onToggleVip(t.id, 1)} className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[10px] font-bold cursor-pointer">Kích VIP</button>
                              ) : (
                                <button onClick={() => onToggleVip(t.id)} className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-[10px] font-bold cursor-pointer">Hủy VIP</button>
                              )}
                              <button onClick={() => onDeleteUser(t.id)} className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-[10px] font-bold cursor-pointer border border-rose-200">Xóa</button>
                            </div>
                          </td>
                        </tr>
                        {/* Expanded detail */}
                        {isExpanded && (
                          <tr>
                            <td colSpan={8} className="p-0">
                              <div className="bg-indigo-50/50 p-4 border-t border-indigo-100">
                                <h4 className="text-xs font-bold text-indigo-700 mb-2">📝 Đề thi đã tạo ({tExams.length}):</h4>
                                {tExams.length === 0 ? (
                                  <p className="text-xs text-slate-400 italic">Chưa tạo đề nào.</p>
                                ) : (
                                  <div className="overflow-x-auto">
                                    <table className="w-full text-xs border-collapse">
                                      <thead>
                                        <tr className="bg-white border-b border-indigo-100 text-slate-500">
                                          <th className="p-2 text-left">Tên đề</th>
                                          <th className="p-2 text-center">Khối</th>
                                          <th className="p-2 text-center">Loại</th>
                                          <th className="p-2 text-center">Trạng thái</th>
                                          <th className="p-2 text-center">Ngày tạo</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {tExams.map(e => (
                                          <tr key={e.id} className="border-b border-indigo-50 bg-white/70">
                                            <td className="p-2 font-bold text-slate-700">{e.title}</td>
                                            <td className="p-2 text-center">Lớp {e.grade}</td>
                                            <td className="p-2 text-center">{getTestTypeLabel(e.testType)}</td>
                                            <td className="p-2 text-center"><span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${getStatusColor(e.status)}`}>{getStatusLabel(e.status)}</span></td>
                                            <td className="p-2 text-center text-slate-500">{fmtDate(e.createdAt)}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========== TAB 3: STUDENTS ========== */}
      {activeTab === "students" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" /> Quản lý Học sinh ({students.length})
              </h2>
              <div className="flex items-center gap-2">
                <select
                  value={filterGrade}
                  onChange={e => setFilterGrade(e.target.value)}
                  className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 outline-none cursor-pointer"
                >
                  <option value="all">Tất cả lớp</option>
                  {[...new Set(students.map(s => s.gradeClass).filter(Boolean))].sort().map(c => (
                    <option key={c} value={c}>Lớp {c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold bg-slate-50">
                    <th className="p-3">STT</th>
                    <th className="p-3">Họ và tên</th>
                    <th className="p-3">Lớp</th>
                    <th className="p-3">Trường</th>
                    <th className="p-3 text-center">Bài đã làm</th>
                    <th className="p-3 text-center">Điểm TB</th>
                    <th className="p-3 text-center">VIP</th>
                    <th className="p-3 text-center">Chi tiết</th>
                    <th className="p-3 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {students
                    .filter(s => filterGrade === "all" || s.gradeClass === filterGrade)
                    .map((s, i) => {
                      const sResults = allResults.filter(r => r.studentId === s.id);
                      const avgScore = sResults.length > 0 ? (sResults.reduce((a, r) => a + r.score, 0) / sResults.length) : 0;
                      const isExpanded = expandedStudent === s.id;
                      return (
                        <React.Fragment key={s.id}>
                          <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                            <td className="p-3 text-slate-500">{i + 1}</td>
                            <td className="p-3 font-bold text-slate-800">{s.fullName}</td>
                            <td className="p-3 text-slate-600 font-medium">{s.gradeClass || "-"}</td>
                            <td className="p-3 text-slate-600">{s.school}</td>
                            <td className="p-3 text-center font-black text-indigo-600">{sResults.length}</td>
                            <td className="p-3 text-center font-bold">
                              <span className={avgScore >= 5 ? "text-emerald-600" : "text-rose-600"}>{avgScore.toFixed(1)}</span>
                            </td>
                            <td className="p-3 text-center">
                              {s.isVip ? <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded-full">⚡ VIP</span> : <span className="text-slate-400 text-[10px]">Thường</span>}
                            </td>
                            <td className="p-3 text-center">
                              <button onClick={() => setExpandedStudent(isExpanded ? null : s.id)} className="px-2 py-1 bg-slate-100 hover:bg-emerald-50 rounded-lg text-[10px] font-bold cursor-pointer">
                                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                              </button>
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex items-center gap-1 justify-end">
                                {!s.isVip ? (
                                  <button onClick={() => onToggleVip(s.id, 1)} className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[10px] font-bold cursor-pointer">Kích VIP</button>
                                ) : (
                                  <button onClick={() => onToggleVip(s.id)} className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-[10px] font-bold cursor-pointer">Hủy VIP</button>
                                )}
                                <button onClick={() => onDeleteUser(s.id)} className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-[10px] font-bold cursor-pointer border border-rose-200">Xóa</button>
                              </div>
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr>
                              <td colSpan={9} className="p-0">
                                <div className="bg-emerald-50/50 p-4 border-t border-emerald-100">
                                  <h4 className="text-xs font-bold text-emerald-700 mb-2">📋 Lịch sử bài làm ({sResults.length}):</h4>
                                  {sResults.length === 0 ? (
                                    <p className="text-xs text-slate-400 italic">Chưa làm bài nào.</p>
                                  ) : (
                                    <div className="space-y-1.5">
                                      {sResults.map((r, ri) => (
                                        <div key={ri} className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-emerald-100 text-xs">
                                          <span className="font-bold text-slate-700">{r.examTitle}</span>
                                          <div className="flex items-center gap-3">
                                            <span className="text-slate-500">{r.correctCount}/{r.totalQuestions} câu đúng</span>
                                            <span className={`font-black ${r.score >= 5 ? "text-emerald-600" : "text-rose-600"}`}>{r.score.toFixed(1)}/10đ</span>
                                            <span className="text-slate-400 text-[10px]">{fmtDateTime(r.takenAt)}</span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========== TAB 4: EXAMS ========== */}
      {activeTab === "exams" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" /> Quản lý Đề kiểm tra ({filteredExams.length}/{exams.length})
              </h2>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="relative flex-1 min-w-[180px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm đề thi..."
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-1 focus:ring-indigo-300"
                />
              </div>
              <select value={filterGrade} onChange={e => setFilterGrade(e.target.value)} className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none cursor-pointer">
                <option value="all">Tất cả khối</option>
                {[6, 7, 8, 9].map(g => <option key={g} value={g}>Lớp {g}</option>)}
              </select>
              <select value={filterTestType} onChange={e => setFilterTestType(e.target.value)} className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none cursor-pointer">
                <option value="all">Tất cả loại</option>
                {["15m", "midterm1", "finalterm1", "midterm2", "finalterm2"].map(t => <option key={t} value={t}>{getTestTypeLabel(t)}</option>)}
              </select>
              <select value={filterTeacher} onChange={e => setFilterTeacher(e.target.value)} className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none cursor-pointer">
                <option value="all">Tất cả GV</option>
                {teachers.map(t => <option key={t.id} value={t.id}>{t.fullName}</option>)}
              </select>
            </div>

            {/* Exams table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold bg-slate-50">
                    <th className="p-3">STT</th>
                    <th className="p-3">Tên đề</th>
                    <th className="p-3">Giáo viên</th>
                    <th className="p-3 text-center">Khối</th>
                    <th className="p-3 text-center">Loại</th>
                    <th className="p-3 text-center">Số câu</th>
                    <th className="p-3 text-center">Trạng thái</th>
                    <th className="p-3 text-center">Ngày tạo</th>
                    <th className="p-3 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExams.map((e, i) => {
                    const creator = users.find(u => u.id === e.creatorId);
                    return (
                      <tr key={e.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="p-3 text-slate-500">{i + 1}</td>
                        <td className="p-3 font-bold text-slate-800 max-w-[200px] truncate">{e.title}</td>
                        <td className="p-3 text-slate-600">{creator?.fullName || e.creatorName || "Hệ thống"}</td>
                        <td className="p-3 text-center font-bold">{e.grade}</td>
                        <td className="p-3 text-center">{getTestTypeLabel(e.testType)}</td>
                        <td className="p-3 text-center font-bold">{e.totalQuestions}</td>
                        <td className="p-3 text-center"><span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${getStatusColor(e.status)}`}>{getStatusLabel(e.status)}</span></td>
                        <td className="p-3 text-center text-slate-500">{fmtDate(e.createdAt)}</td>
                        <td className="p-3 text-right">
                          <div className="flex items-center gap-1 justify-end">
                            <button onClick={() => onViewExam(e)} className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-[10px] font-bold cursor-pointer" title="Xem đề">
                              <Eye className="w-3 h-3" />
                            </button>
                            <button onClick={() => { exportToWord(e); showToast("Đã tải đề Word!", "success"); }} className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg text-[10px] font-bold cursor-pointer" title="Tải Word">
                              <FileDown className="w-3 h-3" />
                            </button>
                            <button onClick={() => onDuplicateExam(e)} className="px-2 py-1 bg-violet-50 hover:bg-violet-100 text-violet-600 rounded-lg text-[10px] font-bold cursor-pointer" title="Nhân bản">
                              <Copy className="w-3 h-3" />
                            </button>
                            <button onClick={() => onDeleteExam(e.id)} className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-[10px] font-bold cursor-pointer" title="Xóa đề">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredExams.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-xs">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p>Không tìm thấy đề kiểm tra nào phù hợp bộ lọc.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* ========== TAB 5: ONLINE ASSIGNMENTS ========== */}
      {activeTab === "online" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Send className="w-5 h-5 text-violet-600" /> Giám sát Bài thi trực tuyến ({assignedExams.length} phòng thi)
            </h2>

            <div className="space-y-3">
              {assignedExams.length === 0 && (
                <p className="text-xs text-slate-400 italic text-center py-6">Chưa có phòng thi nào được tạo.</p>
              )}
              {assignedExams.map(a => {
                const teacher = users.find(u => u.id === a.teacherId);
                const isExpanded = expandedAssignment === a.id;
                return (
                  <div key={a.id} className="border border-slate-200 rounded-xl overflow-hidden">
                    <div
                      className="flex items-center justify-between p-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => setExpandedAssignment(isExpanded ? null : a.id)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="bg-indigo-100 text-indigo-700 text-xs font-black px-2.5 py-1 rounded-lg font-mono">{a.id}</span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">{a.examTitle}</h4>
                          <p className="text-[10px] text-slate-500">GV: {teacher?.fullName || a.teacherName || "N/A"} · Giao ngày: {fmtDate(a.assignedAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{a.results.length} HS đã làm</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                          <div className="p-4 border-t border-slate-200">
                            {a.results.length === 0 ? (
                              <p className="text-xs text-slate-400 italic">Chưa có học sinh nào làm bài.</p>
                            ) : (
                              <table className="w-full text-xs border-collapse">
                                <thead>
                                  <tr className="border-b border-slate-200 text-slate-400 bg-slate-50">
                                    <th className="p-2 text-left">Họ tên HS</th>
                                    <th className="p-2 text-center">Lớp</th>
                                    <th className="p-2 text-center">Câu đúng</th>
                                    <th className="p-2 text-center">Câu sai</th>
                                    <th className="p-2 text-center">Điểm</th>
                                    <th className="p-2 text-center">Trạng thái</th>
                                    <th className="p-2 text-center">Thời gian nộp</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {a.results.map((r, ri) => (
                                    <tr key={ri} className="border-b border-slate-100">
                                      <td className="p-2 font-bold text-slate-700">{r.studentName}</td>
                                      <td className="p-2 text-center">{r.gradeClass || "-"}</td>
                                      <td className="p-2 text-center text-emerald-600 font-bold">{r.correctCount}</td>
                                      <td className="p-2 text-center text-rose-600 font-bold">{r.totalQuestions - r.correctCount}</td>
                                      <td className="p-2 text-center">
                                        <span className={`font-black ${r.score >= 5 ? "text-emerald-600" : "text-rose-600"}`}>{r.score.toFixed(1)}</span>
                                      </td>
                                      <td className="p-2 text-center">
                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                          (r.status === "submitted" || !r.status) ? "bg-emerald-100 text-emerald-700" :
                                          r.status === "in_progress" ? "bg-amber-100 text-amber-700" :
                                          "bg-rose-100 text-rose-700"
                                        }`}>
                                          {r.status === "in_progress" ? "Đang làm" : r.status === "overdue" ? "Quá hạn" : "Đã nộp"}
                                        </span>
                                      </td>
                                      <td className="p-2 text-center text-slate-500">{fmtDateTime(r.takenAt)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* ========== TAB 6: SCORES ========== */}
      {activeTab === "scores" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Score Summary Table */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" /> Thống kê Điểm theo Lớp
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { exportClassScoreReport(classStats, "word"); showToast("Đã xuất bảng điểm Word!", "success"); }}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-[10px] font-bold cursor-pointer flex items-center gap-1"
                >
                  <FileDown className="w-3 h-3" /> Word
                </button>
                <button
                  onClick={() => { exportClassScoreReport(classStats, "excel"); showToast("Đã xuất bảng điểm Excel!", "success"); }}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg text-[10px] font-bold cursor-pointer flex items-center gap-1"
                >
                  <FileDown className="w-3 h-3" /> Excel
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold bg-slate-50">
                    <th className="p-3">Lớp</th>
                    <th className="p-3 text-center">Sĩ số</th>
                    <th className="p-3 text-center">Đã làm</th>
                    <th className="p-3 text-center">Chưa làm</th>
                    <th className="p-3 text-center">ĐTB</th>
                    <th className="p-3 text-center">Cao nhất</th>
                    <th className="p-3 text-center">Thấp nhất</th>
                    <th className="p-3 text-center">Đạt (≥5)</th>
                    <th className="p-3 text-center">&lt;5 điểm</th>
                  </tr>
                </thead>
                <tbody>
                  {classStats.map((s, i) => (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="p-3 font-bold text-slate-800">Lớp {s.gradeClass}</td>
                      <td className="p-3 text-center">{s.totalStudents}</td>
                      <td className="p-3 text-center font-bold text-emerald-600">{s.submittedCount}</td>
                      <td className="p-3 text-center text-slate-500">{s.notSubmittedCount}</td>
                      <td className="p-3 text-center font-black"><span className={s.averageScore >= 5 ? "text-emerald-600" : "text-rose-600"}>{s.averageScore.toFixed(1)}</span></td>
                      <td className="p-3 text-center text-blue-600 font-bold">{s.highestScore.toFixed(1)}</td>
                      <td className="p-3 text-center text-rose-500 font-bold">{s.lowestScore.toFixed(1)}</td>
                      <td className="p-3 text-center text-emerald-600 font-bold">{s.passCount}</td>
                      <td className="p-3 text-center text-rose-600 font-bold">{s.failCount}</td>
                    </tr>
                  ))}
                  {classStats.length === 0 && (
                    <tr><td colSpan={9} className="p-6 text-center text-slate-400 text-xs italic">Chưa có dữ liệu thống kê.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="text-sm font-bold text-slate-800">📈 ĐTB theo Lớp</h3>
              {classStats.length > 0 ? (
                <BarChart data={classStats.map(s => ({ label: s.gradeClass, value: s.averageScore }))} maxVal={10} />
              ) : (
                <p className="text-xs text-slate-400 italic">Chưa có dữ liệu.</p>
              )}
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="text-sm font-bold text-slate-800">🥧 Tỷ lệ Đạt / Chưa đạt</h3>
              {allResults.length > 0 ? (
                <PieChart pass={allResults.filter(r => r.score >= 5).length} fail={allResults.filter(r => r.score < 5).length} />
              ) : (
                <p className="text-xs text-slate-400 italic">Chưa có dữ liệu.</p>
              )}
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="text-sm font-bold text-slate-800">📊 Phân bố điểm</h3>
              {allResults.length > 0 ? (
                <DistributionChart results={allResults} />
              ) : (
                <p className="text-xs text-slate-400 italic">Chưa có dữ liệu.</p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* ========== TAB 7: REPORTS ========== */}
      {activeTab === "reports" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-6">
              <Download className="w-5 h-5 text-indigo-600" /> Xuất Báo cáo
            </h2>
            <p className="text-xs text-slate-500 mb-6">Tất cả báo cáo được xuất với tiêu đề chuẩn: <b>UBND XÃ ĐỒNG YÊN — TRƯỜNG THCS ĐỒNG YÊN</b></p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Report 1 */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-3 hover:border-indigo-200 transition-colors">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-800">Danh sách GV đã ra đề</h3>
                </div>
                <p className="text-[10px] text-slate-500">Thống kê chi tiết giáo viên và số đề đã tạo theo khối, loại đề.</p>
                <div className="flex gap-2">
                  <button onClick={() => { exportTeacherReport(users, exams, "word"); showToast("Đã xuất Word!", "success"); }} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold cursor-pointer">📄 Word</button>
                  <button onClick={() => { exportTeacherReport(users, exams, "excel"); showToast("Đã xuất Excel!", "success"); }} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold cursor-pointer">📊 Excel</button>
                </div>
              </div>

              {/* Report 2 */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-3 hover:border-indigo-200 transition-colors">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-800">Danh sách đề đã tạo</h3>
                </div>
                <p className="text-[10px] text-slate-500">Toàn bộ đề kiểm tra trong hệ thống kèm trạng thái, loại đề.</p>
                <div className="flex gap-2">
                  <button onClick={() => { exportExamReport(exams, users, "word"); showToast("Đã xuất Word!", "success"); }} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold cursor-pointer">📄 Word</button>
                  <button onClick={() => { exportExamReport(exams, users, "excel"); showToast("Đã xuất Excel!", "success"); }} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold cursor-pointer">📊 Excel</button>
                </div>
              </div>

              {/* Report 3 */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-3 hover:border-indigo-200 transition-colors">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-800">Kết quả HS làm bài</h3>
                </div>
                <p className="text-[10px] text-slate-500">Danh sách chi tiết kết quả từng lượt thi của học sinh.</p>
                <div className="flex gap-2">
                  <button onClick={() => { exportStudentResultReport(assignedExams, "word"); showToast("Đã xuất Word!", "success"); }} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold cursor-pointer">📄 Word</button>
                  <button onClick={() => { exportStudentResultReport(assignedExams, "excel"); showToast("Đã xuất Excel!", "success"); }} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold cursor-pointer">📊 Excel</button>
                </div>
              </div>

              {/* Report 4 */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-3 hover:border-indigo-200 transition-colors">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-600" />
                  <h3 className="text-sm font-bold text-slate-800">Bảng điểm theo lớp</h3>
                </div>
                <p className="text-[10px] text-slate-500">Thống kê ĐTB, cao nhất, thấp nhất, tỷ lệ đạt theo từng lớp.</p>
                <div className="flex gap-2">
                  <button onClick={() => { exportClassScoreReport(classStats, "word"); showToast("Đã xuất Word!", "success"); }} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold cursor-pointer">📄 Word</button>
                  <button onClick={() => { exportClassScoreReport(classStats, "excel"); showToast("Đã xuất Excel!", "success"); }} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold cursor-pointer">📊 Excel</button>
                </div>
              </div>

              {/* Report 5 - Full width */}
              <div className="md:col-span-2 border-2 border-indigo-200 rounded-xl p-5 space-y-3 bg-indigo-50/30">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-sm font-bold text-indigo-800">📋 Báo cáo Tổng hợp Toàn trường</h3>
                </div>
                <p className="text-[10px] text-slate-600">Báo cáo tổng hợp đầy đủ: thống kê GV, HS, đề thi, kết quả, xếp hạng, bảng điểm toàn trường.</p>
                <div className="flex gap-2">
                  <button onClick={() => { exportSchoolSummaryReport(users, exams, assignedExams, classStats, "word"); showToast("Đã xuất Word!", "success"); }} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer">📄 Xuất Word</button>
                  <button onClick={() => { exportSchoolSummaryReport(users, exams, assignedExams, classStats, "excel"); showToast("Đã xuất Excel!", "success"); }} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer">📊 Xuất Excel</button>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-slate-500" /> Nhật ký hoạt động gần đây
            </h3>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {activityLogs.slice(0, 50).map((log, i) => (
                <div key={i} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                  <div>
                    <span className={`font-bold ${log.userRole === "teacher" ? "text-indigo-600" : log.userRole === "student" ? "text-blue-600" : "text-rose-600"}`}>
                      {log.userRole === "teacher" ? "🧑‍🏫" : log.userRole === "student" ? "🧑‍🎓" : "🛡️"} {log.userName}
                    </span>
                    {" "}<span className="text-slate-600">{log.details || log.action}</span>
                    {log.target && <span className="font-bold text-slate-800"> · {log.target}</span>}
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap ml-3">{fmtDateTime(log.timestamp)}</span>
                </div>
              ))}
              {activityLogs.length === 0 && (
                <p className="text-xs text-slate-400 italic text-center py-4">Chưa có hoạt động nào được ghi nhận.</p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
