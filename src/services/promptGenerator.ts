import { CURRICULUM_DATA } from "./curriculum";

export function createTestPrompt(
  grade: number,
  units: number[],
  testType: string,
  difficulty: string,
  customPrompt?: string,
  term?: string,
  academicYear?: string,
  pdfContext?: string
): string {
  const selectedUnitsInfo = units.map(u => {
    const data = CURRICULUM_DATA[grade]?.[u];
    if (data) {
      return `Unit ${u}: ${data.title} (Vocabulary: ${data.vocabulary.join(", ")}; Grammar: ${data.grammar.join(", ")})`;
    }
    return `Unit ${u}`;
  }).join("\n");

  let mappedType = testType;
  if (testType.startsWith("midterm")) {
    mappedType = "midterm";
  } else if (testType.startsWith("finalterm")) {
    mappedType = "finalterm";
  }

  let displayTerm = term || "";
  if (testType === "midterm1") displayTerm = "Giữa học kỳ I";
  else if (testType === "midterm2") displayTerm = "Giữa học kỳ II";
  else if (testType === "finalterm1") displayTerm = "Cuối học kỳ I";
  else if (testType === "finalterm2") displayTerm = "Cuối học kỳ II";

  let duration = grade <= 7 ? 60 : 90;
  let totalQuestions = 37;
  let structureGuideline = "";
  let metaData = "";
  let titleString = "";

  if (mappedType === "15m") {
    duration = 15;
    totalQuestions = 20;
    titleString = `ENGLISH TEST - GRADE ${grade}`;
    structureGuideline = `CẤU TRÚC ĐỀ BẮT BUỘC (2 Phần - Đề kiểm tra 15 phút):
- Part I: Vocabulary (10 câu trắc nghiệm). Chọn A, B, hoặc C.
- Part II: Grammar (10 câu trắc nghiệm). Chọn A, B, hoặc C.
Tất cả 20 câu trắc nghiệm đều chỉ có TỐI ĐA 3 đáp án: A, B, C. Đánh số câu liên tục từ 1 đến 20. KHÔNG tạo đáp án D.`;
    metaData = `MA TRẬN BẮT BUỘC: Từ vựng 50%, Ngữ pháp 50%. Mức độ: Biết 50%, Hiểu 30%, Vận dụng 20%.`;
  } else if (mappedType === "midterm") {
    totalQuestions = 37;
    titleString = `ĐỀ KIỂM TRA ĐÁNH GIÁ ${displayTerm.toUpperCase()} - TIẾNG ANH LỚP ${grade}`;
    structureGuideline = `CẤU TRÚC ĐỀ BẮT BUỘC (8 Phần - 36 câu trắc nghiệm + 1 bài viết):
- Part 1. Listening - Monologue (Độc thoại): Listen and decide if each statement is True (T) or False (F) (5 câu - từ câu 1 đến 5). Chỉ dùng A. True và B. False.
- Part 2. Listening - Dialogue (Đối thoại Nam/Nữ): Listen and circle the best answer A, B or C (5 câu - từ câu 6 đến 10).
- Part 3. Choose the best answer A, B or C to complete the sentences (12 câu - từ câu 11 đến 22).
- Part 4. Read the passage and choose the correct word A, B or C for each blank (5 câu - từ câu 23 đến 27). Phải viết văn bản đọc hiểu (Reading Passage) đầy đủ vào phần instruction của Part này.
- Part 5. Read the passage and choose the best answer A, B or C (5 câu - từ câu 28 đến 32). Phải viết văn bản đọc hiểu (Reading Passage) đầy đủ vào phần instruction của Part này.
- Part 6. Choose the sentence (A, B or C) that is correctly rearranged (2 câu - từ câu 33 và 34).
- Part 7. Choose the sentence that has the closest meaning to the root (2 câu - từ câu 35 và 36).
- Part 8. Writing: Write a paragraph (80-100 words) (1 câu tự luận cuối cùng).

Tất cả câu trắc nghiệm đều chỉ có TỐI ĐA 3 đáp án: A, B, C. Đánh số câu liên tục từ 1 đến 36. Câu Writing (Part 8) không đánh số trắc nghiệm. KHÔNG tạo đáp án D.`;
    metaData = `MA TRẠN BẮT BUỘC: Nghe 25% (2.5 điểm), Đọc 25% (2.5 điểm), Ngôn ngữ 30% (3.0 điểm), Viết 20% (1.0 điểm viết lại/sắp xếp + 1.0 điểm viết đoạn văn = 2.0 điểm). Tổng điểm bài kiểm tra trên giấy là 10.0 điểm (36 câu trắc nghiệm x 0.25 điểm + 1 câu viết tự luận x 1.0 điểm). Mức độ: Biết 40%, Hiểu 30%, Vận dụng 30%.`;
  } else {
    // Final term
    totalQuestions = 37;
    titleString = `ĐỀ KIỂM TRA ĐÁNH GIÁ ${displayTerm.toUpperCase()} - TIẾNG ANH LỚP ${grade}`;
    structureGuideline = `CẤU TRÚC ĐỀ BẮT BUỘC (8 Phần - 36 câu trắc nghiệm + 1 bài viết):
- Part 1. Listening - Monologue (Độc thoại): Listen and decide if each statement is True (T) or False (F) (5 câu - từ câu 1 đến 5). Chỉ dùng A. True và B. False.
- Part 2. Listening - Dialogue (Đối thoại Nam/Nữ): Listen and circle the best answer A, B, or C (5 câu - từ câu 6 đến 10).
- Part 3. Choose A, B, or C to complete the following sentences (12 câu - từ câu 11 đến 22).
- Part 4. Read and choose the best answer A, B or C to complete the passage (5 câu - từ câu 23 đến 27). Phải viết văn bản đọc hiểu (Reading Passage) đầy đủ vào phần instruction của Part này.
- Part 5. Read the passage and choose the best answer A, B or C (5 câu - từ câu 28 đến 32). Phải viết văn bản đọc hiểu (Reading Passage) đầy đủ vào phần instruction của Part này.
- Part 6. Sentence Transformation: Choose the correct sentence A, B or C (2 câu - câu 33 và 34).
- Part 7. Word Order: Choose the correct sentence A, B or C (2 câu - câu 35 và 36).
- Part 8. Writing: Write a paragraph (80-100 words) (1 câu tự luận cuối cùng).

Tất cả câu trắc nghiệm đều chỉ có TỐI ĐA 3 đáp án: A, B, C. Đánh số câu liên tục từ 1 đến 36. Câu Writing (Part 8) không đánh số trắc nghiệm. KHÔNG tạo đáp án D.`;
    metaData = `MA TRẠN BẮT BUỘC: Nghe 20% (2.0 điểm), Đọc 20% (2.0 điểm), Ngôn ngữ 24% (2.4 điểm), Viết 16% (0.8 điểm viết lại/sắp xếp + 0.8 điểm viết đoạn văn = 1.6 điểm), Nói (Speaking) 20% (2.0 điểm). Tổng điểm bài viết trên giấy là 8.0 điểm (36 câu trắc nghiệm x 0.2 điểm + 1 câu tự luận x 0.8 điểm), bài nói 2.0 điểm. Mức độ: Biết 40%, Hiểu 30%, Vận dụng 30%.`;
  }

  return `Bạn là trợ lý tạo đề kiểm tra môn Tiếng Anh THCS. Nhiệm vụ của bạn là tạo đề kiểm tra ${testType === "15m" ? "15 phút" : (term || "giữa học kỳ")} cho lớp ${grade} theo đúng mẫu đã nạp. Mỗi câu trắc nghiệm chỉ có tối đa 3 đáp án A, B, C. Không bao giờ tạo đáp án D. Dạng True/False chỉ dùng A. True và B. False. Phải tạo kèm đáp án, ma trận và đặc tả. Nội dung phải bám lớp ${grade}, học kỳ, unit, chủ đề, từ vựng và ngữ pháp người dùng nhập.

${pdfContext ? `\nĐẶC BIỆT QUAN TRỌNG: Hãy sử dụng các kiến thức và từ vựng, ngữ pháp được trích xuất từ tài liệu tham khảo/Sách giáo khoa dưới đây để ra đề (Đảm bảo độ chính xác và bám sát tài liệu tham khảo 100%):\n<TEXTBOOK_CONTEXT>\n${pdfContext}\n</TEXTBOOK_CONTEXT>\n` : "Nếu không có tài liệu tham khảo nào được tải lên ở trên, hãy tự động sử dụng kiến thức chuẩn từ Sách giáo khoa tiếng Anh Global Success lớp 6-9 tích hợp sẵn trong dữ liệu của bạn để ra đề."}
Thông tin bài kiểm tra:
- Khối lớp: Lớp ${grade}
- Học kỳ: ${term || "Giữa kỳ I"}
- Năm học: ${academicYear || "2023-2024"}
- Thời gian làm bài: ${duration} phút
- Các Unit trọng tâm:
${selectedUnitsInfo}
- Mức độ khó: ${difficulty}
${customPrompt ? `- Yêu cầu bổ sung: ${customPrompt}` : ""}

${structureGuideline}

${metaData}

YÊU CẦU BẮT BUỘC VỀ NỘI DUNG:
1. ĐỐI VỚI BÀI ĐỌC (Part 4, Part 5): Phải viết đầy đủ đoạn văn đọc hiểu (Reading Passage) ở phần "instruction" của Part tương ứng đó. TUYỆT ĐỐI không được để trống đoạn văn. Ví dụ ở Part 4: "Read the passage and choose the correct word... [Nội dung đoạn văn có các chỗ trống (23), (24)...]". Ở Part 5: "Read the passage and choose the best answer... [Nội dung đoạn văn đọc hiểu hoàn chỉnh]".
2. ĐỐI VỚI BÀI NGHE (Part 1, Part 2): Phải viết lời thoại bài nghe (Audio Transcript) đầy đủ cho cả 2 bài nghe (bài độc thoại True/False và bài đối thoại Nam/Nữ) vào trường "transcripts" của kết quả JSON. Không được ghi chung chung mà phải có kịch bản lời thoại chi tiết.
   - Bài nghe 1 (Độc thoại - True/False): Lời thoại của một người nói duy nhất.
   - Bài nghe 2 (Đối thoại - Đáp án ABC): Kịch bản đối thoại chi tiết giữa một nhân vật Nam và một nhân vật Nữ.
3. ĐỐI VỚI ĐÁP ÁN: Giải thích ở trường "explanation" phải viết bằng tiếng Việt và giải thích chi tiết, cặn kẽ tại sao chọn đáp án đó (ví dụ giải thích cấu trúc ngữ pháp hay nghĩa của từ vựng).

Định dạng kết quả trả về phải là một JSON hoàn hảo tuân thủ schema sau:
{
  "title": "${titleString}",
  "grade": ${grade},
  "term": "${term || "Giữa kỳ I"}",
  "academicYear": "${academicYear || "2023-2024"}",
  "testType": "${testType}",
  "duration": ${duration},
  "totalQuestions": ${totalQuestions},
  "parts": [
    {
      "title": "Tên phần (ví dụ: Part 1. Listening - Monologue)",
      "instruction": "Yêu cầu của phần thi kèm theo đoạn văn đọc hiểu hoàn chỉnh nếu là phần thi Đọc (Ví dụ: Read the passage... [Nội dung đoạn văn đọc hiểu])",
      "questions": [
        {
          "id": "1",
          "questionText": "Nội dung câu hỏi (chỉ có 3 lựa chọn A, B, C)",
          "options": ["A. ...", "B. ...", "C. ..."],
          "correctAnswer": "A",
          "explanation": "Giải thích chi tiết bằng tiếng Việt lý do chọn đáp án này",
          "difficulty": "Nhận biết",
          "topic": "Chủ đề"
        }
      ]
    }
  ],
  "matrixData": "Nội dung bảng ma trận chi tiết dưới dạng Markdown",
  "specData": "Nội dung bảng đặc tả chi tiết dưới dạng Markdown",
  "transcripts": "Nội dung lời thoại (Audio Transcript) chi tiết cho cả 2 bài nghe (Độc thoại True/False và Đối thoại Nam/Nữ)",
  "writingRubric": "Gợi ý chấm điểm phần viết chi tiết kèm bài mẫu tham khảo"
}

Hãy trả về duy nhất chuỗi JSON hợp lệ. Không bao gồm bất kỳ phần text giới thiệu hay dấu nháy \`\`\`json ở ngoài.`;
}
