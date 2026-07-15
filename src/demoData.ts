import { Exam } from "./types";

export const initialExams: Exam[] = [
  {
    id: "demo-exam-1",
    title: "ĐỀ KIỂM TRA GIỮA KÌ I (MINI) - TIẾNG ANH LỚP 6 - GLOBAL SUCCESS",
    grade: 6,
    testType: "midterm",
    duration: 45,
    totalQuestions: 12,
    versionCode: "Mã đề 101",
    createdAt: "2026-07-15T08:00:00.000Z",
    parts: [
      {
        title: "PART A: PRONUNCIATION",
        instruction: "Choose the word whose underlined part is pronounced differently from the others.",
        questions: [
          {
            id: "q1",
            questionText: "Choose the word whose underlined part is pronounced differently: A. stUdy  B. sUbject  C. stUdent  D. clUb",
            options: ["A. study", "B. subject", "C. student", "D. club"],
            correctAnswer: "C",
            explanation: "Từ 'student' có âm 'u' phát âm là /ju:/ (/'stju:dnt/). Các từ còn lại phát âm là /ʌ/: study (/'stʌdi/), subject (/'sʌbdʒɪkt/), club (/klʌb/).",
            difficulty: "Nhận biết",
            topic: "Phát âm nguyên âm /ʌ/ và /ju:/"
          },
          {
            id: "q2",
            questionText: "Choose the word whose underlined part is pronounced differently: A. postS  B. apartmentS  C. bookS  D. bedS",
            options: ["A. posts", "B. apartments", "C. books", "D. beds"],
            correctAnswer: "D",
            explanation: "Bed tận cùng là âm hữu thanh /d/, nên đuôi 's' được phát âm là /z/ (/bedz/). Các từ khác tận cùng bằng phụ âm vô thanh (/t/, /p/, /k/) nên 's' phát âm là /s/: posts (/pəʊsts/), apartments (/ə'pɑ:tmənts/), books (/bʊks/).",
            difficulty: "Thông hiểu",
            topic: "Cách phát âm đuôi -s/es"
          }
        ]
      },
      {
        title: "PART B: VOCABULARY AND GRAMMAR",
        instruction: "Choose the best option A, B, C or D to complete each sentence.",
        questions: [
          {
            id: "q3",
            questionText: "Lan always _______ her homework after school, but today she is _______ her friend.",
            options: ["A. does / visiting", "B. is doing / visits", "C. do / visiting", "D. does / visits"],
            correctAnswer: "A",
            explanation: "Vế đầu có 'always' chỉ thói quen thường xuyên nên chia thì Hiện tại đơn với chủ ngữ số ít 'Lan' -> 'does'. Vế hai có 'today' kết hợp với 'but' để chỉ hành động tạm thời khác thường lệ hôm nay, chia Hiện tại tiếp diễn -> 'is visiting'.",
            difficulty: "Thông hiểu",
            topic: "Hiện tại đơn và Hiện tại tiếp diễn"
          },
          {
            id: "q4",
            questionText: "We need a _______ to draw circles in our Geometry class.",
            options: ["A. calculator", "B. compass", "C. rubber", "D. pencil case"],
            correctAnswer: "B",
            explanation: "Compass là cái compa, dùng để vẽ hình tròn (draw circles) trong môn hình học. Calculator là máy tính, rubber là cục tẩy, pencil case là hộp bút.",
            difficulty: "Nhận biết",
            topic: "Từ vựng đồ dùng học tập"
          },
          {
            id: "q5",
            questionText: "Where is the cat? - It is _______ the desk and the wardrobe.",
            options: ["A. next to", "B. under", "C. between", "D. behind"],
            correctAnswer: "C",
            explanation: "Giới từ 'between' đi với cấu trúc 'between A and B' (ở giữa A và B). Ở đây có 'the desk AND the wardrobe' nên đáp án đúng chỉ có thể là C.",
            difficulty: "Nhận biết",
            topic: "Giới từ chỉ nơi chốn"
          },
          {
            id: "q6",
            questionText: "My brother is very _______. He enjoys drawing pictures and writing creative stories.",
            options: ["A. talkative", "B. patient", "C. creative", "D. kind"],
            correctAnswer: "C",
            explanation: "Creative có nghĩa là sáng tạo. Câu sau bổ nghĩa: anh ấy thích vẽ tranh và viết những câu chuyện sáng tạo (creative stories). Talkative là nói nhiều, patient là kiên nhẫn, kind là tốt bụng.",
            difficulty: "Thông hiểu",
            topic: "Từ vựng tính cách"
          }
        ]
      },
      {
        title: "PART C: READING",
        instruction: "Read the following passage and choose the correct answer for each blank/question.",
        questions: [
          {
            id: "q7",
            questionText: "My cousin Phong lives in a town house in Da Nang. [CLOZE_1] house is large and very comfortable.",
            options: ["A. He", "B. His", "C. Him", "D. Himself"],
            correctAnswer: "B",
            explanation: "Cần tính từ sở hữu đứng trước danh từ 'house' để thay thế cho Phong. 'His house' có nghĩa là ngôi nhà của anh ấy.",
            difficulty: "Nhận biết",
            topic: "Tính từ sở hữu"
          },
          {
            id: "q8",
            questionText: "There are six rooms: a living room, a kitchen, three bedrooms and two bathrooms. In his room, there is a big bed, a desk and a chest [CLOZE_2] drawers.",
            options: ["A. of", "B. in", "C. on", "D. with"],
            correctAnswer: "A",
            explanation: "Cụm từ cố định 'a chest of drawers' nghĩa là tủ có nhiều ngăn kéo.",
            difficulty: "Thông hiểu",
            topic: "Từ vựng đồ đạc gia đình"
          },
          {
            id: "q9",
            questionText: "What does Phong like most about his house according to the passage? (Giả định Phong rất yêu thích khu vườn nhỏ ở ban công)",
            options: [
              "A. The kitchen",
              "B. The master bedroom",
              "C. The small garden on the balcony",
              "D. The quiet living room"
            ],
            correctAnswer: "C",
            explanation: "Theo nội dung bài đọc, Phong thích nhất khu vườn nhỏ ban công vì anh ấy có thể trồng cây và ngắm thành phố vào buổi chiều.",
            difficulty: "Vận dụng",
            topic: "Đọc hiểu tìm ý chính"
          }
        ]
      },
      {
        title: "PART D: WRITING",
        instruction: "Rewrite the sentence so that it has the same meaning as the first one.",
        questions: [
          {
            id: "q10",
            questionText: "Rewrite using Possessive Case ('s): 'The school of Minh is clean and beautiful.'",
            options: [
              "A. Minh school's is clean and beautiful.",
              "B. Minh's school is clean and beautiful.",
              "C. The school Minh's is clean and beautiful.",
              "D. Minh's schools are clean and beautiful."
            ],
            correctAnswer: "B",
            explanation: "Sử dụng sở hữu cách 's cho người đứng trước danh từ thuộc sở hữu: 'The school of Minh' chuyển thành 'Minh's school'.",
            difficulty: "Thông hiểu",
            topic: "Sở hữu cách"
          },
          {
            id: "q11",
            questionText: "Rewrite using prepositions: 'The cupboard is to the left of the fridge.' -> The fridge is _______.",
            options: [
              "A. to the left of the cupboard",
              "B. next to the cupboard",
              "C. to the right of the cupboard",
              "D. behind the cupboard"
            ],
            correctAnswer: "C",
            explanation: "Nếu cái tủ ly ở bên TRÁI cái tủ lạnh, thì ngược lại, cái tủ lạnh ở bên PHẢI cái tủ ly (to the right of the cupboard).",
            difficulty: "Vận dụng",
            topic: "Giới từ chỉ vị trí"
          },
          {
            id: "q12",
            questionText: "Complete the sentence with comparative form: 'My new school is (big) _______ my old school.'",
            options: [
              "A. bigger than",
              "B. more big than",
              "C. the biggest",
              "D. as big as"
            ],
            correctAnswer: "A",
            explanation: "Tính từ 'big' là tính từ ngắn có một âm tiết, tận cùng dạng phụ âm-nguyên âm-phụ âm. Khi chuyển sang so sánh hơn ta gấp đôi phụ âm cuối 'g' và thêm 'er' + 'than' -> 'bigger than'.",
            difficulty: "Nhận biết",
            topic: "So sánh hơn của tính từ ngắn"
          }
        ]
      }
    ]
  },
  {
    id: "demo-exam-2",
    title: "ĐỀ KIỂM TRA 15 PHÚT (VOCAB & GRAMMAR) - TIẾNG ANH LỚP 8 - GLOBAL SUCCESS",
    grade: 8,
    testType: "15m",
    duration: 15,
    totalQuestions: 6,
    versionCode: "Mã đề 201",
    createdAt: "2026-07-14T09:00:00.000Z",
    parts: [
      {
        title: "MULTIPLE CHOICE QUESTIONS",
        instruction: "Select the correct option to complete each sentence.",
        questions: [
          {
            id: "e2-q1",
            questionText: "People in the countryside often live _______ than those in the city.",
            options: ["A. more happily", "B. happier", "C. happy", "D. as happy as"],
            correctAnswer: "A",
            explanation: "Ở đây cần một trạng từ so sánh hơn để bổ nghĩa cho động từ thường 'live'. Trạng từ của 'happy' là 'happily' (trạng từ dài), dạng so sánh hơn là 'more happily'.",
            difficulty: "Thông hiểu",
            topic: "So sánh hơn của trạng từ"
          },
          {
            id: "e2-q2",
            questionText: "My sister loves _______ origami in her free time. It makes her feel relaxed.",
            options: ["A. doing", "B. making", "C. playing", "D. collecting"],
            correctAnswer: "B",
            explanation: "Cụm từ đi với nghệ thuật gấp giấy Nhật Bản Origami là 'make origami' (hoặc 'do origami' nhưng 'make' là tự tạo ra sản phẩm giấy nên thường dùng nhất trong bài học Unit 1). Ở đây 'making' là chuẩn nhất.",
            difficulty: "Nhận biết",
            topic: "Động từ chỉ sở thích + V-ing"
          },
          {
            id: "e2-q3",
            questionText: "The children are excited about going to the pasture to herd the _______.",
            options: ["A. rice", "B. crops", "C. cattle", "D. combine harvester"],
            correctAnswer: "C",
            explanation: "Cattle (gia súc như trâu, bò, dê) là đối tượng được chăn thả trên đồng cỏ (pasture / herd the cattle). Các từ khác: rice (lúa), crops (vụ mùa), combine harvester (máy gặt đập liên hợp).",
            difficulty: "Nhận biết",
            topic: "Từ vựng cuộc sống nông thôn"
          },
          {
            id: "e2-q4",
            questionText: "Choose the word whose underlined part is stressed differently: A. leisure  B. pressure  C. addict  D. browse",
            options: ["A. LEIsure", "B. PREssure", "C. adDICT", "D. browse (no stress)"],
            correctAnswer: "C",
            explanation: "'addict' vừa là danh từ vừa là động từ, nhưng trong chương trình âm tiết trọng âm của động từ thường rơi vào âm thứ 2 /ə'dɪkt/. Leisure /'leʒə/ và Pressure /'preʃə/ có trọng âm rơi vào âm tiết đầu tiên. 'Browse' là từ một âm tiết.",
            difficulty: "Vận dụng cao",
            topic: "Trọng âm từ 2 âm tiết"
          },
          {
            id: "e2-q5",
            questionText: "Teenagers are under peer pressure, so they try _______ hard to fit in.",
            options: ["A. very", "B. extremely", "C. much", "D. too"],
            correctAnswer: "B",
            explanation: "'Extremely' là trạng từ nhấn mạnh mức độ cực kỳ. Câu mang ý nghĩa 'học sinh chịu áp lực bạn bè nên cố gắng cực kỳ chăm chỉ'.",
            difficulty: "Thông hiểu",
            topic: "Trạng từ mức độ"
          },
          {
            id: "e2-q6",
            questionText: "Which of the following is a compound sentence?",
            options: [
              "A. He likes hanging out with friends because it is fun.",
              "B. The fields are vast, and the air is fresh.",
              "C. When I was young, I lived in a small village.",
              "D. She spends two hours doing DIY projects every Sunday."
            ],
            correctAnswer: "B",
            explanation: "Câu ghép (Compound sentence) gồm hai mệnh đề độc lập nối với nhau bằng các liên từ đẳng lập FANBOYS (ở đây là ', and'). Các câu khác là câu phức (A, C) hoặc câu đơn (D).",
            difficulty: "Vận dụng",
            topic: "Phân biệt câu ghép và câu phức"
          }
        ]
      }
    ]
  }
];
