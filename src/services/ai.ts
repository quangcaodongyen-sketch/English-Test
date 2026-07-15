import { GoogleGenAI } from "@google/genai";
import { createTestPrompt } from "./promptGenerator";

const MODELS = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-3.1-pro-preview", "gemini-2.5-flash"];

/**
 * Calls Gemini directly from the browser, bypassing Vercel Serverless Function limits (10s).
 * If no API key is provided, it automatically falls back to Pollinations API (Free, no key needed).
 */
export async function generateExamAI(
  grade: number,
  units: number[],
  testType: string,
  difficulty: string,
  customPrompt?: string,
  term?: string,
  academicYear?: string,
  pdfContext?: string,
  customApiKey?: string,
  selectedModel?: string,
  modelIndex = 0
): Promise<any> {
  const prompt = createTestPrompt(grade, units, testType, difficulty, customPrompt, term, academicYear, pdfContext);
  
  const keyToUse = customApiKey || localStorage.getItem("gemini_api_key");
  const modelToUse = selectedModel && MODELS.includes(selectedModel) ? selectedModel : MODELS[modelIndex];

  try {
    // If we have an API Key, use Google's official Gemini SDK
    if (keyToUse && keyToUse !== "MY_GEMINI_API_KEY") {
      const ai = new GoogleGenAI({
        apiKey: keyToUse,
        httpOptions: {
          headers: { "User-Agent": "aistudio-build" }
        }
      });

      const response = await ai.models.generateContent({
        model: modelToUse,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
        }
      });

      const responseText = response.text;
      if (!responseText) throw new Error("Mô hình Gemini không trả về dữ liệu.");
      
      const parsed = JSON.parse(responseText.trim());
      return { data: parsed, modelUsed: modelToUse };
    } 
    
    // Automatic Free API Fallback (Pollinations)
    console.log("No API Key found. Using Free Automatic API (Pollinations.ai)...");
    const fetchRes = await fetch("https://text.pollinations.ai/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt + "\n\nRETURN ONLY VALID JSON." }],
        model: "openai",
        jsonMode: true
      })
    });
    
    const text = await fetchRes.text();
    const parsed = JSON.parse(text.trim());
    return { data: parsed, modelUsed: "pollinations-free-auto" };

  } catch (error: any) {
    console.error(`Error calling AI:`, error);
    
    // If using Gemini SDK and it fails with Auth error, throw immediately
    if (keyToUse && (error.message?.includes("API key") || error.status === 401 || error.status === 403)) {
      throw new Error("API Key không hợp lệ hoặc không có quyền truy cập. Vui lòng kiểm tra lại.");
    }
    
    // Fallback to next model if available
    if (keyToUse && !selectedModel && modelIndex < MODELS.length - 1) {
      console.log(`Falling back to next model: ${MODELS[modelIndex + 1]}`);
      return generateExamAI(grade, units, testType, difficulty, customPrompt, term, academicYear, pdfContext, customApiKey, undefined, modelIndex + 1);
    }
    
    throw new Error(error.message || "Đã xảy ra lỗi khi tạo đề thi bằng AI.");
  }
}

export async function chatWithTutorAI(
  message: string,
  contextExam?: any,
  customApiKey?: string,
  selectedModel?: string
): Promise<string> {
  const systemInstruction = `Bạn là Trợ lý Giáo viên Tiếng Anh THCS thông thái (AI Tutor) của ứng dụng SmartTest Global Success.
Nhiệm vụ của bạn là giải đáp tất cả các thắc mắc về từ vựng, ngữ pháp, ngữ âm tiếng Anh từ lớp 6 đến lớp 9 theo chương trình Global Success.
Hãy trả lời một cách lịch sự, dễ hiểu, có ví dụ minh họa sinh động và sử dụng tiếng Việt làm ngôn ngữ phản hồi chính.
${contextExam ? `Người dùng đang xem đề thi có tiêu đề "${contextExam.title}". Hãy hỗ trợ họ giải thích hoặc sửa đổi đề thi này nếu được yêu cầu.` : ""}`;

  const keyToUse = customApiKey || localStorage.getItem("gemini_api_key");
  const modelToUse = selectedModel && MODELS.includes(selectedModel) ? selectedModel : "gemini-3.5-flash";

  if (!keyToUse || keyToUse === "MY_GEMINI_API_KEY") {
    // Free fallback
    const fetchRes = await fetch("https://text.pollinations.ai/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: message }
        ],
        model: "openai"
      })
    });
    const text = await fetchRes.text();
    return text;
  }

  const ai = new GoogleGenAI({
    apiKey: keyToUse,
    httpOptions: {
      headers: { "User-Agent": "aistudio-build" }
    }
  });

  const response = await ai.models.generateContent({
    model: modelToUse,
    contents: message,
    config: {
      systemInstruction,
      temperature: 0.7,
    }
  });

  return response.text || "";
}

export async function analyzeMatrixAI(
  fileName: string,
  fileContent: string,
  grade: number,
  testType: string,
  customApiKey?: string,
  selectedModel?: string
): Promise<any> {
  const prompt = `Bạn là Chuyên gia Khảo thí Tiếng Anh THCS. Dưới đây là nội dung của file đặc tả ma trận đề thi hoặc đề mẫu mà giáo viên tải lên:
Tên file: ${fileName}
Nội dung file:
"""
${fileContent}
"""

Dựa vào nội dung tài liệu trên kết hợp với chương trình Global Success Lớp ${grade || 6}, hãy soạn thảo một ĐỀ THI TIẾNG ANH hoàn toàn tương đương bám sát 100% yêu cầu về phân bổ câu hỏi, kiến thức và định dạng có trong file trên.

Đảm bảo:
1. Tất cả từ vựng/ngữ pháp bám sát Lớp ${grade || 6}.
2. Biên soạn đầy đủ câu hỏi và có phần giải thích đáp án chi tiết bằng tiếng Việt.
3. Trả về đúng định dạng JSON hoàn hảo tuân thủ schema sau đây:
{
  "title": "Tên đề thi được biên soạn bám sát tài liệu đặc tả (ví dụ: ĐỀ KIỂM TRA TIẾNG ANH LỚP 6 THEO MA TRẬN ĐẶC TẢ)",
  "grade": ${grade || 6},
  "testType": "${testType || "midterm"}",
  "duration": 45,
  "totalQuestions": 40,
  "parts": [
    {
      "title": "PART A: PRONUNCIATION",
      "instruction": "Choose the word whose underlined part is pronounced differently...",
      "questions": [
        {
          "id": "1",
          "questionText": "Choose the word that has a different pronunciation: A. study B. subject C. student D. club",
          "options": ["A. study", "B. subject", "C. student", "D. club"],
          "correctAnswer": "C",
          "explanation": "Giải thích chi tiết...",
          "difficulty": "Nhận biết",
          "topic": "Ngữ âm"
        }
      ]
    }
  ]
}

Trả về duy nhất JSON hợp lệ, không chứa ký tự markdown hay văn bản rác ngoài JSON.`;

  const keyToUse = customApiKey || localStorage.getItem("gemini_api_key");
  const modelToUse = selectedModel && MODELS.includes(selectedModel) ? selectedModel : "gemini-3.5-flash";

  try {
    if (keyToUse && keyToUse !== "MY_GEMINI_API_KEY") {
      const ai = new GoogleGenAI({
        apiKey: keyToUse,
        httpOptions: { headers: { "User-Agent": "aistudio-build" } }
      });
      const response = await ai.models.generateContent({
        model: modelToUse,
        contents: prompt,
        config: { responseMimeType: "application/json", temperature: 0.7 }
      });
      const responseText = response.text;
      if (!responseText) throw new Error("Mô hình Gemini không trả về dữ liệu.");
      return { data: JSON.parse(responseText.trim()), modelUsed: modelToUse };
    }

    const fetchRes = await fetch("https://text.pollinations.ai/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt + "\n\nRETURN ONLY VALID JSON." }],
        model: "openai",
        jsonMode: true
      })
    });
    
    const text = await fetchRes.text();
    return { data: JSON.parse(text.trim()), modelUsed: "pollinations-free-auto" };
  } catch (error: any) {
    console.error("Error calling AI:", error);
    throw new Error(error.message || "Đã xảy ra lỗi khi phân tích file bằng AI.");
  }
}
