export // Global Success Curriculum Pedagogical Data for Grade 6-9
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

