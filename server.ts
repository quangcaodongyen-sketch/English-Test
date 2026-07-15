import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// Global Success Curriculum Pedagogical Data for Grade 6-9
const CURRICULUM_DATA: Record<number, Record<number, { title: string; vocabulary: string[]; grammar: string[] }>> = {
  6: {
    1: {
      title: "My New School",
      vocabulary: ["calculator", "uniform", "compass", "pencil sharpener", "notebook", "boarding school", "creative"],
      grammar: ["Present Simple (Thì hiện tại đơn)", "Present Continuous (Thì hiện tại tiếp diễn)"]
    },
    2: {
      title: "My House",
      vocabulary: ["apartment", "town house", "country house", "wardrobe", "cupboard", "fridge", "attic", "furniture"],
      grammar: ["Possessive case (Sở hữu cách)", "Prepositions of place (Giới từ chỉ vị trí)"]
    },
    3: {
      title: "My Friends",
      vocabulary: ["personality", "creative", "kind", "clever", "hard-working", "talkative", "funny", "patient"],
      grammar: ["Present continuous for future (Thì hiện tại tiếp diễn chỉ tương lai)", "Body parts (Bộ phận cơ thể)"]
    },
    4: {
      title: "My Neighbourhood",
      vocabulary: ["suburb", "railway station", "historic", "cathedral", "convenient", "noisy", "peaceful", "crowded"],
      grammar: ["Comparative adjectives (So sánh hơn của tính từ ngắn và dài)"]
    },
    5: {
      title: "Natural Wonders of the World",
      vocabulary: ["waterfall", "island", "cave", "desert", "forest", "mountain", "plaster", "sleeping bag", "backpack"],
      grammar: ["Countable and Uncountable nouns (Danh từ đếm được và không đếm được)", "Modal verb: must / mustn't"]
    },
    6: {
      title: "Our Tet Holiday",
      vocabulary: ["peach blossom", "apricot blossom", "lucky money", "gather", "relative", "decorate", "wish", "fireworks"],
      grammar: ["Modal verb: should / shouldn't", "Some / Any for quantity"]
    },
    7: {
      title: "Television",
      vocabulary: ["documentary", "game show", "channel", "viewer", "comedy", "weatherman", "educational", "remote control"],
      grammar: ["Wh-questions (Câu hỏi bắt đầu bằng từ để hỏi)", "Conjunctions: and, but, so, because, although"]
    },
    8: {
      title: "Sports and Games",
      vocabulary: ["gymnastics", "marathon", "racket", "goggles", "skateboarding", "champion", "congratulate", "fit"],
      grammar: ["Past Simple (Thì quá khứ đơn)", "Imperatives (Câu mệnh lệnh)"]
    },
    9: {
      title: "Cities of the World",
      vocabulary: ["continent", "landmark", "palace", "creature", "crowded", "clean", "expensive", "historic"],
      grammar: ["Possessive adjectives (Tính từ sở hữu)", "Possessive pronouns (Đại từ sở hữu)"]
    },
    10: {
      title: "Our Houses in the Future",
      vocabulary: ["appliance", "wireless", "automatic", "solar energy", "helicopter", "skyscraper", "space", "robot"],
      grammar: ["Future Simple: Will for future prediction (Thì tương lai đơn)", "Modal verb: Might for possibility"]
    },
    11: {
      title: "Our Greener World",
      vocabulary: ["reduce", "reuse", "recycle", "plastic bag", "environment", "refillable", "pollute", "charity"],
      grammar: ["Conditional sentences type 1 (Câu điều kiện loại 1)"]
    },
    12: {
      title: "Robots",
      vocabulary: ["laundry", "gardening", "space station", "humanoid", "opinion", "agree", "disagree", "ability"],
      grammar: ["Modal verbs: Can, Could, Will be able to (Khả năng ở hiện tại, quá khứ và tương lai)"]
    }
  },
  7: {
    1: {
      title: "Hobbies",
      vocabulary: ["arranging flowers", "making models", "carving wood", "gardening", "horse riding", "gymnastics", "dollhouse"],
      grammar: ["Present Simple (Thì hiện tại đơn)", "Verbs of liking + Gerund (Động từ chỉ sự yêu thích + V-ing)"]
    },
    2: {
      title: "Healthy Living",
      vocabulary: ["sunburn", "allergy", "dimple", "acne", "chapped lips", "active", "fit", "healthy food", "calorie"],
      grammar: ["Simple sentences (Câu đơn: S + V, S + V + O)", "Compound sentences with coordinators (and, or, but, so)"]
    },
    3: {
      title: "Community Service",
      vocabulary: ["volunteer", "donate", "nursing home", "homeless children", "tutor", "litter", "traffic lights", "clean up"],
      grammar: ["Past Simple (Thì quá khứ đơn)", "Present Perfect (Thì hiện tại hoàn thành - giới thiệu cơ bản)"]
    },
    4: {
      title: "Music and Arts",
      vocabulary: ["composer", "instrument", "musician", "exhibition", "puppet", "art gallery", "performance", "portrait"],
      grammar: ["Comparisons: not as... as, the same as, different from"]
    },
    5: {
      title: "Vietnamese Food and Drink",
      vocabulary: ["turmeric", "spring roll", "omelette", "eel soup", "green tea", "ingredient", "recipe", "broth", "squeeze"],
      grammar: ["Quantifiers: a lot of, lots of, some, any", "How much & How many"]
    },
    6: {
      title: "A Visit to School",
      vocabulary: ["Imperial Academy", "Temple of Literature", "tomb", "monument", "plaque", "pavilion", "laureate", "erect"],
      grammar: ["Prepositions of time & place (at, on, in)", "Passive voice (Thì bị động - cơ bản)"]
    },
    7: {
      title: "Traffic",
      vocabulary: ["pedestrian", "seat belt", "helmet", "traffic jam", "road sign", "driving licence", "obey", "passenger"],
      grammar: ["It indicating distance (It is about... from... to...)", "Used to + V for past habits"]
    },
    8: {
      title: "Films",
      vocabulary: ["documentary", "comedy", "horror film", "sci-fi", "thriller", "critic", "starring", "gripping", "scary"],
      grammar: ["Connectors: although, though, in spite of, despite", "Adjectives ending in -ed and -ing"]
    },
    9: {
      title: "Festivals around the World",
      vocabulary: ["carnival", "superstitious", "parade", "feast", "harvester", "celebrate", "costume", "cranberry"],
      grammar: ["Yes/No questions & Wh-questions", "Adverbial phrases (Trạng ngữ chỉ thời gian, nơi chốn, cách thức)"]
    },
    10: {
      title: "Energy Sources",
      vocabulary: ["renewable", "non-renewable", "coal", "natural gas", "solar panel", "wind turbine", "biogas", "carbon footprint"],
      grammar: ["Present Continuous (Thì hiện tại tiếp diễn chỉ xu hướng/tương lai)"]
    },
    11: {
      title: "Travelling in the Future",
      vocabulary: ["flying car", "hyperloop", "skytran", "solar-powered ship", "teleporter", "driverless car", "crash", "fuel"],
      grammar: ["Future Simple (Thì tương lai đơn)", "Possessive pronouns (Đại từ sở hữu)"]
    },
    12: {
      title: "An English-speaking World",
      vocabulary: ["native speaker", "official language", "accent", "bilingual", "slang", "fluent", "vocabulary", "pronunciation"],
      grammar: ["Articles: a, an, the, zero article (Mạo từ)"]
    }
  },
  8: {
    1: {
      title: "Leisure Time",
      vocabulary: ["craft kit", "DIY", "bead", "hanging out", "cloud watching", "origami", "socialize", "addicted", "balance"],
      grammar: ["Verbs of liking/disliking + V-ing/to-V (Động từ chỉ sự thích/ghét)"]
    },
    2: {
      title: "Life in the Countryside",
      vocabulary: ["harvest time", "pasture", "nomadic", "paddy field", "hospitable", "peaceful", "vast", "well-trained"],
      grammar: ["Comparative adverbs (So sánh hơn của trạng từ)"]
    },
    3: {
      title: "Teenagers",
      vocabulary: ["peer pressure", "forum", "club", "upload", "browse", "cheat", "stressful", "bully", "concentrate"],
      grammar: ["Simple, Compound, and Complex sentences (Câu đơn, câu ghép, câu phức)"]
    },
    4: {
      title: "Ethnic Groups of Vietnam",
      vocabulary: ["ethnic minority", "terraced field", "stilt house", "communal house", "weaving", "costume", "custom", "heritage"],
      grammar: ["Yes/No questions & Wh-questions", "Articles: a, an, the (Ôn tập và nâng cao)"]
    },
    5: {
      title: "Our Customs and Traditions",
      vocabulary: ["table manners", "respect", "offspring", "worship", "heritage", "generations", "sponge cake", "host"],
      grammar: ["Zero article and definite article 'the'"]
    },
    6: {
      title: "Lifestyles",
      vocabulary: ["lifestyle", "habit", "greet", "diet", "martial arts", "online learning", "indigenous", "nomadic"],
      grammar: ["Future Simple: predictions & decisions", "First Conditional (Câu điều kiện loại 1)"]
    },
    7: {
      title: "Environmental Protection",
      vocabulary: ["endangered species", "extinction", "pollution", "deforestation", "habitat", "preserve", "eco-friendly", "awareness"],
      grammar: ["Complex sentences with adverbial clauses of time (Câu phức với mệnh đề trạng ngữ chỉ thời gian)"]
    },
    8: {
      title: "Shopping",
      vocabulary: ["convenience store", "open-air market", "supermarket", "bargain", "discount", "price tag", "add to cart", "receipt"],
      grammar: ["Present Simple for future schedules (Hiện tại đơn chỉ lịch trình tương lai)"]
    },
    9: {
      title: "Natural Disasters",
      vocabulary: ["earthquake", "volcanic eruption", "tsunami", "landslide", "flood", "typhoon", "evacuate", "rescue team"],
      grammar: ["Past Continuous (Thì quá khứ tiếp diễn)"]
    },
    10: {
      title: "Communication in the Future",
      vocabulary: ["video conference", "hologram", "telepathy", "smart device", "voice command", "translation app", "barrier", "network"],
      grammar: ["Prepositions of time & place (Ôn tập nâng cao)"]
    },
    11: {
      title: "Science and Technology",
      vocabulary: ["invention", "discovery", "laboratory", "patent", "robotics", "artificial intelligence", "nanotechnology", "developer"],
      grammar: ["Reported speech: Statements (Câu gián tiếp: Câu kể)"]
    },
    12: {
      title: "Life on Other Planets",
      vocabulary: ["alien", "space station", "solar system", "galaxy", "habitable", "gravity", "weightless", "astronaut"],
      grammar: ["Modal verbs: May, Might (Khả năng xảy ra)", "Reported speech: Questions (Câu gián tiếp: Câu hỏi)"]
    }
  },
  9: {
    1: {
      title: "Local Community",
      vocabulary: ["artisan", "handicraft", "workshop", "attraction", "preserve", "authenticity", "suburb", "conical hat"],
      grammar: ["Complex sentences with adverbial clauses of concession, cause, purpose, time", "Phrasal verbs (Cụm động từ)"]
    },
    2: {
      title: "City Life",
      vocabulary: ["metropolitan", "multicultural", "populous", "affordable", "urban sprawl", "cosmopolitan", "skyscraper", "clique"],
      grammar: ["Comparison of adjectives and adverbs: review & advanced", "Double comparatives (Càng... càng...)"]
    },
    3: {
      title: "Teen Stress and Pressure",
      vocabulary: ["cognitive skills", "frustrated", "tense", "delighted", "resolve conflict", "self-discipline", "empathy", "peer"],
      grammar: ["Reported speech: review & advanced", "Question words before to-infinitive (Wh- + to V)"]
    },
    4: {
      title: "Life in the Past",
      vocabulary: ["bare-footed", "illiterate", "street vendor", "tug of war", " seniority", "traditional", "preserve", "pastime"],
      grammar: ["Used to + V", "Wishes for the present and past (Câu ước)"]
    },
    5: {
      title: "Wonders of Vietnam",
      vocabulary: ["limestone", "cavern", "fortress", "cathedral", "tomb", "picturesque", "astounding", "geological", "structure"],
      grammar: ["Impersonal passive (Bị động vô nhân xưng - It is said that... / S is said to V)", "Suggest + V-ing / Suggest (that) S should V"]
    },
    6: {
      title: "Vietnam: Then and Now",
      vocabulary: ["thatched house", "trench", "tram", "flyover", "underpass", "compartment", "extended family", "nuclear family"],
      grammar: ["Past Perfect (Thì quá khứ hoàn thành)", "Adjective + to-infinitive / Adjective + that-clause"]
    },
    7: {
      title: "Recipes and Eating Habits",
      vocabulary: ["ingredient", "chop", "slice", "grate", "marinate", "whisk", "steam", "stew", "nutrition", "balanced diet"],
      grammar: ["Quantifiers (Từ chỉ số lượng)", "First Conditional with modal verbs"]
    },
    8: {
      title: "Tourism",
      vocabulary: ["destination", "luggage", "itinerary", "breathtaking", "expedition", "package tour", "checkout", "souvenir"],
      grammar: ["Articles: review", "Definite article 'the' with geographical names"]
    },
    9: {
      title: "English in the World",
      vocabulary: ["mother tongue", "second language", "bilingual", "accent", "dialect", "fluent", "imitate", "lookup", "derive from"],
      grammar: ["Relative clauses (Mệnh đề quan hệ: Xác định và Không xác định)"]
    },
    10: {
      title: "Space Travel",
      vocabulary: ["astronaut", "spacecraft", "spacewalk", "orbit", "microgravity", "weightless", "telescope", "meteorite", "habitable"],
      grammar: ["Past Simple & Past Perfect (Sử dụng kết hợp)", "Defining relative clauses with prepositions"]
    },
    11: {
      title: "Changing Roles in Society",
      vocabulary: ["breadwinner", "homemaker", "dominant", "financial burden", "sole provider", "workplace", "hands-on", "individuality"],
      grammar: ["Future Active and Passive voice", "Non-defining relative clauses"]
    },
    12: {
      title: "My Future Career",
      vocabulary: ["vocation", "profession", "career path", "qualification", "apprentice", "probation", "salary", "shift work"],
      grammar: ["Gerunds vs To-infinitives (Danh động từ và Động từ nguyên mẫu có to)"]
    }
  }
};

const MODELS = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-3.1-pro-preview", "gemini-2.5-flash"];

// Helper to construct prompt for Gemini Test Creator
function createTestPrompt(grade: number, units: number[], testType: string, difficulty: string, customPrompt?: string, term?: string, academicYear?: string) {
  const selectedUnitsInfo = units.map(u => {
    const data = CURRICULUM_DATA[grade]?.[u];
    if (data) {
      return `Unit ${u}: ${data.title} (Vocabulary: ${data.vocabulary.join(", ")}; Grammar: ${data.grammar.join(", ")})`;
    }
    return `Unit ${u}`;
  }).join("\n");

  let duration = grade === 6 ? 60 : 90;
  let totalQuestions = 37;
  let structureGuideline = "";
  let metaData = "";
  let titleString = "";

  if (testType === "15m") {
    duration = 15;
    totalQuestions = 20;
    titleString = `ENGLISH TEST - GRADE ${grade}`;
    structureGuideline = `CẤU TRÚC ĐỀ BẮT BUỘC (2 Phần - Đề kiểm tra 15 phút):
- Part I: Vocabulary (10 câu trắc nghiệm). Chọn A, B, hoặc C.
- Part II: Grammar (10 câu trắc nghiệm). Chọn A, B, hoặc C.
Tất cả 20 câu trắc nghiệm đều chỉ có TỐI ĐA 3 đáp án: A, B, C. Đánh số câu liên tục từ 1 đến 20. KHÔNG tạo đáp án D.`;
    metaData = `MA TRẬN BẮT BUỘC: Từ vựng 50%, Ngữ pháp 50%. Mức độ: Biết 50%, Hiểu 30%, Vận dụng 20%.`;
  } else if (testType === "midterm") {
    duration = 60;
    totalQuestions = 46;
    titleString = `ĐỀ KIỂM TRA ĐÁNH GIÁ GIỮA HỌC KÌ ${term?.includes("II") ? "II" : "I"} - TIẾNG ANH LỚP ${grade}`;
    structureGuideline = `CẤU TRÚC ĐỀ BẮT BUỘC (8 Phần - 45 câu trắc nghiệm + 1 bài viết):
- Part 1. Listen and decide if each statement is True (T) or False (F) (5 câu - từ câu 1 đến 5). Chỉ dùng A. True và B. False.
- Part 2. Listen and circle the best answer A, B or C (5 câu - từ câu 6 đến 10).
- Part 3. Choose the best answer A, B or C to complete the sentences (15 câu - từ câu 11 đến 25).
- Part 4. Read the passage and choose the correct word A, B or C for each blank (5 câu - từ câu 26 đến 30).
- Part 5. Read the passage and choose the best answer A, B or C (5 câu - từ câu 31 đến 35).
- Part 6. Choose the sentence (A, B or C) that is correctly rearranged (5 câu - từ câu 36 đến 40).
- Part 7. Choose the sentence that has the closest meaning to the root (5 câu - từ câu 41 đến 45).
- Part 8. Write a short paragraph (50-60 words) (1 câu tự luận cuối cùng).

Tất cả câu trắc nghiệm đều chỉ có TỐI ĐA 3 đáp án: A, B, C. Đánh số câu liên tục từ 1 đến 45. Câu Writing (Part 8) không đánh số trắc nghiệm. KHÔNG tạo đáp án D.`;
    metaData = `MA TRẬN BẮT BUỘC: Nghe 25%, Đọc 25%, Ngôn ngữ 30%, Viết 20%. Mức độ: Biết 40%, Hiểu 30%, Vận dụng 30%.`;
  } else {
    // Final term
    duration = 90;
    totalQuestions = 37;
    titleString = `ĐỀ KIỂM TRA ĐÁNH GIÁ CUỐI HỌC KÌ ${term?.includes("II") ? "II" : "I"} - TIẾNG ANH LỚP ${grade}`;
    structureGuideline = `CẤU TRÚC ĐỀ BẮT BUỘC (8 Phần - 36 câu trắc nghiệm + 1 bài viết):
- Part 1. Listen and circle the best answer A, B, or C (5 câu - từ câu 1 đến 5).
- Part 2. Listen and circle the best answer A or B (True/False) (5 câu - từ câu 6 đến 10). Chỉ dùng A. True và B. False.
- Part 3. Choose A, B, or C to complete the following sentences (12 câu - từ câu 11 đến 22).
- Part 4. Read and choose the best answer A, B or C to complete the passage (5 câu - từ câu 23 đến 27).
- Part 5. Read the passage and choose the best answer A, B or C (5 câu - từ câu 28 đến 32).
- Part 6. Sentence Transformation: Choose the correct sentence A, B or C (2 câu - câu 33 và 34).
- Part 7. Word Order: Choose the correct sentence A, B or C (2 câu - câu 35 và 36).
- Part 8. Writing: Write a paragraph (80-100 words) (1 câu tự luận cuối cùng).

Tất cả câu trắc nghiệm đều chỉ có TỐI ĐA 3 đáp án: A, B, C. Đánh số câu liên tục từ 1 đến 36. Câu Writing (Part 8) không đánh số trắc nghiệm. KHÔNG tạo đáp án D.`;
    metaData = `MA TRẬN BẮT BUỘC: Nghe 25%, Đọc 25%, Ngôn ngữ 30%, Viết 20%. Mức độ: Biết 40%, Hiểu 30%, Vận dụng 30%.`;
  }

  return `Bạn là trợ lý tạo đề kiểm tra môn Tiếng Anh THCS. Nhiệm vụ của bạn là tạo đề kiểm tra ${testType === "15m" ? "15 phút" : (term || "giữa học kỳ")} cho lớp ${grade} theo đúng mẫu đã nạp. Mỗi câu trắc nghiệm chỉ có tối đa 3 đáp án A, B, C. Không bao giờ tạo đáp án D. Dạng True/False chỉ dùng A. True và B. False. Phải tạo kèm đáp án, ma trận và đặc tả. Nội dung phải bám lớp ${grade}, học kỳ, unit, chủ đề, từ vựng và ngữ pháp người dùng nhập.

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
      "title": "Tên phần (ví dụ: Part I: Vocabulary)",
      "instruction": "Yêu cầu của phần thi (ví dụ: Choose the best answer A, B, or C...)",
      "questions": [
        {
          "id": "1",
          "questionText": "Nội dung câu hỏi (chỉ có 3 lựa chọn A, B, C)",
          "options": ["A. ...", "B. ...", "C. ..."],
          "correctAnswer": "A",
          "explanation": "Giải thích chi tiết",
          "difficulty": "Nhận biết",
          "topic": "Chủ đề"
        }
      ]
    }
  ],
  "matrixData": "Nội dung bảng ma trận chi tiết dưới dạng Markdown",
  "specData": "Nội dung bảng đặc tả chi tiết dưới dạng Markdown",
  "transcripts": "Nội dung transcript phần nghe (nếu có)",
  "writingRubric": "Gợi ý chấm điểm phần viết (nếu có)"
}

Hãy trả về duy nhất chuỗi JSON hợp lệ. Không bao gồm bất kỳ phần text giới thiệu hay dấu nháy \`\`\`json ở ngoài.`;
}

// Call Gemini AI wrapper with fallbacks
async function callGeminiAI(prompt: string, customApiKey?: string, selectedModel?: string, modelIndex = 0): Promise<any> {
  const keyToUse = customApiKey || process.env.GEMINI_API_KEY;
  if (!keyToUse || keyToUse === "MY_GEMINI_API_KEY") {
    throw new Error("Không tìm thấy API Key. Vui lòng cấu hình API Key trong mục cài đặt (Header) hoặc hệ thống.");
  }

  const modelToUse = selectedModel && MODELS.includes(selectedModel) ? selectedModel : MODELS[modelIndex];

  try {
    const ai = new GoogleGenAI({
      apiKey: keyToUse,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
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
    if (!responseText) {
      throw new Error("Mô hình Gemini không trả về dữ liệu.");
    }

    // Try parsing as JSON
    const parsed = JSON.parse(responseText.trim());
    return { data: parsed, modelUsed: modelToUse };
  } catch (error: any) {
    console.error(`Error calling ${modelToUse}:`, error);

    // If it's a structural/auth error, we propagate immediately.
    if (error.message?.includes("API key") || error.status === 401 || error.status === 403) {
      throw new Error("API Key không hợp lệ hoặc không có quyền truy cập. Vui lòng kiểm tra lại.");
    }

    // If there is another model available, try fallback
    if (!selectedModel && modelIndex < MODELS.length - 1) {
      console.log(`Falling back to next model: ${MODELS[modelIndex + 1]}`);
      return callGeminiAI(prompt, customApiKey, undefined, modelIndex + 1);
    }

    throw error;
  }
}

// REST API Endpoints
// Generate exam using Gemini AI
app.post("/api/generate-test", async (req, res) => {
  const { grade, units, testType, difficulty, customPrompt, apiKey, selectedModel, term, academicYear } = req.body;

  if (!grade || !units || !Array.isArray(units) || units.length === 0 || !testType || !difficulty) {
    return res.status(400).json({ error: "Thiếu thông tin yêu cầu tạo đề thi." });
  }

  try {
    const prompt = createTestPrompt(grade, units, testType, difficulty, customPrompt, term, academicYear);
    const result = await callGeminiAI(prompt, apiKey, selectedModel);
    
    // Inject original context so frontend can regenerate similar tests
    if (result && typeof result === "object") {
      result.units = units;
      result.difficulty = difficulty;
    }
    
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Đã xảy ra lỗi khi tạo đề thi bằng AI." });
  }
});

// Explain a custom query or chat with AI Tutor
app.post("/api/chat-tutor", async (req, res) => {
  const { message, contextExam, apiKey, selectedModel } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Nội dung tin nhắn không được để trống." });
  }

  try {
    const systemInstruction = `Bạn là Trợ lý Giáo viên Tiếng Anh THCS thông thái (AI Tutor) của ứng dụng SmartTest Global Success.
Nhiệm vụ của bạn là giải đáp tất cả các thắc mắc về từ vựng, ngữ pháp, ngữ âm tiếng Anh từ lớp 6 đến lớp 9 theo chương trình Global Success.
Hãy trả lời một cách lịch sự, dễ hiểu, có ví dụ minh họa sinh động và sử dụng tiếng Việt làm ngôn ngữ phản hồi chính.
${contextExam ? `Người dùng đang xem đề thi có tiêu đề "${contextExam.title}". Hãy hỗ trợ họ giải thích hoặc sửa đổi đề thi này nếu được yêu cầu.` : ""}`;

    const keyToUse = apiKey || process.env.GEMINI_API_KEY;
    const modelToUse = selectedModel && MODELS.includes(selectedModel) ? selectedModel : "gemini-3.5-flash";

    const ai = new GoogleGenAI({
      apiKey: keyToUse,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
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

    res.json({ text: response.text });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Đã xảy ra lỗi khi giao tiếp với AI Tutor." });
  }
});

// AI analyzes matrix/spec file and generates tests
app.post("/api/analyze-matrix", async (req, res) => {
  const { fileName, fileContent, grade, testType, apiKey, selectedModel } = req.body;

  if (!fileContent) {
    return res.status(400).json({ error: "Nội dung file không được để trống." });
  }

  try {
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

    const result = await callGeminiAI(prompt, apiKey, selectedModel);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Đã xảy ra lỗi khi phân tích file bằng AI." });
  }
});

// Serve frontend build static files or connect Vite in development mode
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SmartTest Global Success] Server started at http://localhost:${PORT}`);
  });
}

startServer();
