var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json({ limit: "20mb" }));
app.use(import_express.default.urlencoded({ limit: "20mb", extended: true }));
var CURRICULUM_DATA = {
  6: {
    1: {
      title: "My New School",
      vocabulary: ["calculator", "uniform", "compass", "pencil sharpener", "notebook", "boarding school", "creative"],
      grammar: ["Present Simple (Th\xEC hi\u1EC7n t\u1EA1i \u0111\u01A1n)", "Present Continuous (Th\xEC hi\u1EC7n t\u1EA1i ti\u1EBFp di\u1EC5n)"]
    },
    2: {
      title: "My House",
      vocabulary: ["apartment", "town house", "country house", "wardrobe", "cupboard", "fridge", "attic", "furniture"],
      grammar: ["Possessive case (S\u1EDF h\u1EEFu c\xE1ch)", "Prepositions of place (Gi\u1EDBi t\u1EEB ch\u1EC9 v\u1ECB tr\xED)"]
    },
    3: {
      title: "My Friends",
      vocabulary: ["personality", "creative", "kind", "clever", "hard-working", "talkative", "funny", "patient"],
      grammar: ["Present continuous for future (Th\xEC hi\u1EC7n t\u1EA1i ti\u1EBFp di\u1EC5n ch\u1EC9 t\u01B0\u01A1ng lai)", "Body parts (B\u1ED9 ph\u1EADn c\u01A1 th\u1EC3)"]
    },
    4: {
      title: "My Neighbourhood",
      vocabulary: ["suburb", "railway station", "historic", "cathedral", "convenient", "noisy", "peaceful", "crowded"],
      grammar: ["Comparative adjectives (So s\xE1nh h\u01A1n c\u1EE7a t\xEDnh t\u1EEB ng\u1EAFn v\xE0 d\xE0i)"]
    },
    5: {
      title: "Natural Wonders of the World",
      vocabulary: ["waterfall", "island", "cave", "desert", "forest", "mountain", "plaster", "sleeping bag", "backpack"],
      grammar: ["Countable and Uncountable nouns (Danh t\u1EEB \u0111\u1EBFm \u0111\u01B0\u1EE3c v\xE0 kh\xF4ng \u0111\u1EBFm \u0111\u01B0\u1EE3c)", "Modal verb: must / mustn't"]
    },
    6: {
      title: "Our Tet Holiday",
      vocabulary: ["peach blossom", "apricot blossom", "lucky money", "gather", "relative", "decorate", "wish", "fireworks"],
      grammar: ["Modal verb: should / shouldn't", "Some / Any for quantity"]
    },
    7: {
      title: "Television",
      vocabulary: ["documentary", "game show", "channel", "viewer", "comedy", "weatherman", "educational", "remote control"],
      grammar: ["Wh-questions (C\xE2u h\u1ECFi b\u1EAFt \u0111\u1EA7u b\u1EB1ng t\u1EEB \u0111\u1EC3 h\u1ECFi)", "Conjunctions: and, but, so, because, although"]
    },
    8: {
      title: "Sports and Games",
      vocabulary: ["gymnastics", "marathon", "racket", "goggles", "skateboarding", "champion", "congratulate", "fit"],
      grammar: ["Past Simple (Th\xEC qu\xE1 kh\u1EE9 \u0111\u01A1n)", "Imperatives (C\xE2u m\u1EC7nh l\u1EC7nh)"]
    },
    9: {
      title: "Cities of the World",
      vocabulary: ["continent", "landmark", "palace", "creature", "crowded", "clean", "expensive", "historic"],
      grammar: ["Possessive adjectives (T\xEDnh t\u1EEB s\u1EDF h\u1EEFu)", "Possessive pronouns (\u0110\u1EA1i t\u1EEB s\u1EDF h\u1EEFu)"]
    },
    10: {
      title: "Our Houses in the Future",
      vocabulary: ["appliance", "wireless", "automatic", "solar energy", "helicopter", "skyscraper", "space", "robot"],
      grammar: ["Future Simple: Will for future prediction (Th\xEC t\u01B0\u01A1ng lai \u0111\u01A1n)", "Modal verb: Might for possibility"]
    },
    11: {
      title: "Our Greener World",
      vocabulary: ["reduce", "reuse", "recycle", "plastic bag", "environment", "refillable", "pollute", "charity"],
      grammar: ["Conditional sentences type 1 (C\xE2u \u0111i\u1EC1u ki\u1EC7n lo\u1EA1i 1)"]
    },
    12: {
      title: "Robots",
      vocabulary: ["laundry", "gardening", "space station", "humanoid", "opinion", "agree", "disagree", "ability"],
      grammar: ["Modal verbs: Can, Could, Will be able to (Kh\u1EA3 n\u0103ng \u1EDF hi\u1EC7n t\u1EA1i, qu\xE1 kh\u1EE9 v\xE0 t\u01B0\u01A1ng lai)"]
    }
  },
  7: {
    1: {
      title: "Hobbies",
      vocabulary: ["arranging flowers", "making models", "carving wood", "gardening", "horse riding", "gymnastics", "dollhouse"],
      grammar: ["Present Simple (Th\xEC hi\u1EC7n t\u1EA1i \u0111\u01A1n)", "Verbs of liking + Gerund (\u0110\u1ED9ng t\u1EEB ch\u1EC9 s\u1EF1 y\xEAu th\xEDch + V-ing)"]
    },
    2: {
      title: "Healthy Living",
      vocabulary: ["sunburn", "allergy", "dimple", "acne", "chapped lips", "active", "fit", "healthy food", "calorie"],
      grammar: ["Simple sentences (C\xE2u \u0111\u01A1n: S + V, S + V + O)", "Compound sentences with coordinators (and, or, but, so)"]
    },
    3: {
      title: "Community Service",
      vocabulary: ["volunteer", "donate", "nursing home", "homeless children", "tutor", "litter", "traffic lights", "clean up"],
      grammar: ["Past Simple (Th\xEC qu\xE1 kh\u1EE9 \u0111\u01A1n)", "Present Perfect (Th\xEC hi\u1EC7n t\u1EA1i ho\xE0n th\xE0nh - gi\u1EDBi thi\u1EC7u c\u01A1 b\u1EA3n)"]
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
      grammar: ["Prepositions of time & place (at, on, in)", "Passive voice (Th\xEC b\u1ECB \u0111\u1ED9ng - c\u01A1 b\u1EA3n)"]
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
      grammar: ["Yes/No questions & Wh-questions", "Adverbial phrases (Tr\u1EA1ng ng\u1EEF ch\u1EC9 th\u1EDDi gian, n\u01A1i ch\u1ED1n, c\xE1ch th\u1EE9c)"]
    },
    10: {
      title: "Energy Sources",
      vocabulary: ["renewable", "non-renewable", "coal", "natural gas", "solar panel", "wind turbine", "biogas", "carbon footprint"],
      grammar: ["Present Continuous (Th\xEC hi\u1EC7n t\u1EA1i ti\u1EBFp di\u1EC5n ch\u1EC9 xu h\u01B0\u1EDBng/t\u01B0\u01A1ng lai)"]
    },
    11: {
      title: "Travelling in the Future",
      vocabulary: ["flying car", "hyperloop", "skytran", "solar-powered ship", "teleporter", "driverless car", "crash", "fuel"],
      grammar: ["Future Simple (Th\xEC t\u01B0\u01A1ng lai \u0111\u01A1n)", "Possessive pronouns (\u0110\u1EA1i t\u1EEB s\u1EDF h\u1EEFu)"]
    },
    12: {
      title: "An English-speaking World",
      vocabulary: ["native speaker", "official language", "accent", "bilingual", "slang", "fluent", "vocabulary", "pronunciation"],
      grammar: ["Articles: a, an, the, zero article (M\u1EA1o t\u1EEB)"]
    }
  },
  8: {
    1: {
      title: "Leisure Time",
      vocabulary: ["craft kit", "DIY", "bead", "hanging out", "cloud watching", "origami", "socialize", "addicted", "balance"],
      grammar: ["Verbs of liking/disliking + V-ing/to-V (\u0110\u1ED9ng t\u1EEB ch\u1EC9 s\u1EF1 th\xEDch/gh\xE9t)"]
    },
    2: {
      title: "Life in the Countryside",
      vocabulary: ["harvest time", "pasture", "nomadic", "paddy field", "hospitable", "peaceful", "vast", "well-trained"],
      grammar: ["Comparative adverbs (So s\xE1nh h\u01A1n c\u1EE7a tr\u1EA1ng t\u1EEB)"]
    },
    3: {
      title: "Teenagers",
      vocabulary: ["peer pressure", "forum", "club", "upload", "browse", "cheat", "stressful", "bully", "concentrate"],
      grammar: ["Simple, Compound, and Complex sentences (C\xE2u \u0111\u01A1n, c\xE2u gh\xE9p, c\xE2u ph\u1EE9c)"]
    },
    4: {
      title: "Ethnic Groups of Vietnam",
      vocabulary: ["ethnic minority", "terraced field", "stilt house", "communal house", "weaving", "costume", "custom", "heritage"],
      grammar: ["Yes/No questions & Wh-questions", "Articles: a, an, the (\xD4n t\u1EADp v\xE0 n\xE2ng cao)"]
    },
    5: {
      title: "Our Customs and Traditions",
      vocabulary: ["table manners", "respect", "offspring", "worship", "heritage", "generations", "sponge cake", "host"],
      grammar: ["Zero article and definite article 'the'"]
    },
    6: {
      title: "Lifestyles",
      vocabulary: ["lifestyle", "habit", "greet", "diet", "martial arts", "online learning", "indigenous", "nomadic"],
      grammar: ["Future Simple: predictions & decisions", "First Conditional (C\xE2u \u0111i\u1EC1u ki\u1EC7n lo\u1EA1i 1)"]
    },
    7: {
      title: "Environmental Protection",
      vocabulary: ["endangered species", "extinction", "pollution", "deforestation", "habitat", "preserve", "eco-friendly", "awareness"],
      grammar: ["Complex sentences with adverbial clauses of time (C\xE2u ph\u1EE9c v\u1EDBi m\u1EC7nh \u0111\u1EC1 tr\u1EA1ng ng\u1EEF ch\u1EC9 th\u1EDDi gian)"]
    },
    8: {
      title: "Shopping",
      vocabulary: ["convenience store", "open-air market", "supermarket", "bargain", "discount", "price tag", "add to cart", "receipt"],
      grammar: ["Present Simple for future schedules (Hi\u1EC7n t\u1EA1i \u0111\u01A1n ch\u1EC9 l\u1ECBch tr\xECnh t\u01B0\u01A1ng lai)"]
    },
    9: {
      title: "Natural Disasters",
      vocabulary: ["earthquake", "volcanic eruption", "tsunami", "landslide", "flood", "typhoon", "evacuate", "rescue team"],
      grammar: ["Past Continuous (Th\xEC qu\xE1 kh\u1EE9 ti\u1EBFp di\u1EC5n)"]
    },
    10: {
      title: "Communication in the Future",
      vocabulary: ["video conference", "hologram", "telepathy", "smart device", "voice command", "translation app", "barrier", "network"],
      grammar: ["Prepositions of time & place (\xD4n t\u1EADp n\xE2ng cao)"]
    },
    11: {
      title: "Science and Technology",
      vocabulary: ["invention", "discovery", "laboratory", "patent", "robotics", "artificial intelligence", "nanotechnology", "developer"],
      grammar: ["Reported speech: Statements (C\xE2u gi\xE1n ti\u1EBFp: C\xE2u k\u1EC3)"]
    },
    12: {
      title: "Life on Other Planets",
      vocabulary: ["alien", "space station", "solar system", "galaxy", "habitable", "gravity", "weightless", "astronaut"],
      grammar: ["Modal verbs: May, Might (Kh\u1EA3 n\u0103ng x\u1EA3y ra)", "Reported speech: Questions (C\xE2u gi\xE1n ti\u1EBFp: C\xE2u h\u1ECFi)"]
    }
  },
  9: {
    1: {
      title: "Local Community",
      vocabulary: ["artisan", "handicraft", "workshop", "attraction", "preserve", "authenticity", "suburb", "conical hat"],
      grammar: ["Complex sentences with adverbial clauses of concession, cause, purpose, time", "Phrasal verbs (C\u1EE5m \u0111\u1ED9ng t\u1EEB)"]
    },
    2: {
      title: "City Life",
      vocabulary: ["metropolitan", "multicultural", "populous", "affordable", "urban sprawl", "cosmopolitan", "skyscraper", "clique"],
      grammar: ["Comparison of adjectives and adverbs: review & advanced", "Double comparatives (C\xE0ng... c\xE0ng...)"]
    },
    3: {
      title: "Teen Stress and Pressure",
      vocabulary: ["cognitive skills", "frustrated", "tense", "delighted", "resolve conflict", "self-discipline", "empathy", "peer"],
      grammar: ["Reported speech: review & advanced", "Question words before to-infinitive (Wh- + to V)"]
    },
    4: {
      title: "Life in the Past",
      vocabulary: ["bare-footed", "illiterate", "street vendor", "tug of war", " seniority", "traditional", "preserve", "pastime"],
      grammar: ["Used to + V", "Wishes for the present and past (C\xE2u \u01B0\u1EDBc)"]
    },
    5: {
      title: "Wonders of Vietnam",
      vocabulary: ["limestone", "cavern", "fortress", "cathedral", "tomb", "picturesque", "astounding", "geological", "structure"],
      grammar: ["Impersonal passive (B\u1ECB \u0111\u1ED9ng v\xF4 nh\xE2n x\u01B0ng - It is said that... / S is said to V)", "Suggest + V-ing / Suggest (that) S should V"]
    },
    6: {
      title: "Vietnam: Then and Now",
      vocabulary: ["thatched house", "trench", "tram", "flyover", "underpass", "compartment", "extended family", "nuclear family"],
      grammar: ["Past Perfect (Th\xEC qu\xE1 kh\u1EE9 ho\xE0n th\xE0nh)", "Adjective + to-infinitive / Adjective + that-clause"]
    },
    7: {
      title: "Recipes and Eating Habits",
      vocabulary: ["ingredient", "chop", "slice", "grate", "marinate", "whisk", "steam", "stew", "nutrition", "balanced diet"],
      grammar: ["Quantifiers (T\u1EEB ch\u1EC9 s\u1ED1 l\u01B0\u1EE3ng)", "First Conditional with modal verbs"]
    },
    8: {
      title: "Tourism",
      vocabulary: ["destination", "luggage", "itinerary", "breathtaking", "expedition", "package tour", "checkout", "souvenir"],
      grammar: ["Articles: review", "Definite article 'the' with geographical names"]
    },
    9: {
      title: "English in the World",
      vocabulary: ["mother tongue", "second language", "bilingual", "accent", "dialect", "fluent", "imitate", "lookup", "derive from"],
      grammar: ["Relative clauses (M\u1EC7nh \u0111\u1EC1 quan h\u1EC7: X\xE1c \u0111\u1ECBnh v\xE0 Kh\xF4ng x\xE1c \u0111\u1ECBnh)"]
    },
    10: {
      title: "Space Travel",
      vocabulary: ["astronaut", "spacecraft", "spacewalk", "orbit", "microgravity", "weightless", "telescope", "meteorite", "habitable"],
      grammar: ["Past Simple & Past Perfect (S\u1EED d\u1EE5ng k\u1EBFt h\u1EE3p)", "Defining relative clauses with prepositions"]
    },
    11: {
      title: "Changing Roles in Society",
      vocabulary: ["breadwinner", "homemaker", "dominant", "financial burden", "sole provider", "workplace", "hands-on", "individuality"],
      grammar: ["Future Active and Passive voice", "Non-defining relative clauses"]
    },
    12: {
      title: "My Future Career",
      vocabulary: ["vocation", "profession", "career path", "qualification", "apprentice", "probation", "salary", "shift work"],
      grammar: ["Gerunds vs To-infinitives (Danh \u0111\u1ED9ng t\u1EEB v\xE0 \u0110\u1ED9ng t\u1EEB nguy\xEAn m\u1EABu c\xF3 to)"]
    }
  }
};
var MODELS = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-3.1-pro-preview", "gemini-2.5-flash"];
function createTestPrompt(grade, units, testType, difficulty, customPrompt, term, academicYear) {
  const selectedUnitsInfo = units.map((u) => {
    const data = CURRICULUM_DATA[grade]?.[u];
    if (data) {
      return `Unit ${u}: ${data.title} (Vocabulary: ${data.vocabulary.join(", ")}; Grammar: ${data.grammar.join(", ")})`;
    }
    return `Unit ${u}`;
  }).join("\n");
  return `B\u1EA1n l\xE0 tr\u1EE3 l\xFD t\u1EA1o \u0111\u1EC1 ki\u1EC3m tra m\xF4n Ti\u1EBFng Anh THCS. Nhi\u1EC7m v\u1EE5 c\u1EE7a b\u1EA1n l\xE0 t\u1EA1o \u0111\u1EC1 ki\u1EC3m tra ${term || "gi\u1EEFa h\u1ECDc k\u1EF3"} cho l\u1EDBp ${grade} theo \u0111\xFAng m\u1EABu \u0111\xE3 n\u1EA1p. Lu\xF4n gi\u1EEF \u0111\xFAng 36 c\xE2u tr\u1EAFc nghi\u1EC7m v\xE0 1 b\xE0i vi\u1EBFt. M\u1ED7i c\xE2u tr\u1EAFc nghi\u1EC7m ch\u1EC9 c\xF3 t\u1ED1i \u0111a 3 \u0111\xE1p \xE1n A, B, C. Kh\xF4ng bao gi\u1EDD t\u1EA1o \u0111\xE1p \xE1n D. D\u1EA1ng True/False ch\u1EC9 d\xF9ng A. True v\xE0 B. False. \u0110\u1EC1 ph\u1EA3i c\xF3 Part 1 \u0111\u1EBFn Part 8 \u0111\xFAng th\u1EE9 t\u1EF1. T\u1ED5ng \u0111i\u1EC3m l\xE0 10. Ph\u1EA3i t\u1EA1o k\xE8m \u0111\xE1p \xE1n, transcript listening, ma tr\u1EADn v\xE0 \u0111\u1EB7c t\u1EA3. N\u1ED9i dung ph\u1EA3i b\xE1m l\u1EDBp ${grade}, h\u1ECDc k\u1EF3, unit, ch\u1EE7 \u0111\u1EC1, t\u1EEB v\u1EF1ng v\xE0 ng\u1EEF ph\xE1p ng\u01B0\u1EDDi d\xF9ng nh\u1EADp. \u0110\u1ECBnh d\u1EA1ng \u0111\u1EA7u ra ph\u1EA3i ph\xF9 h\u1EE3p \u0111\u1EC3 xu\u1EA5t file Word \u0111\u1EB9p, r\xF5 r\xE0ng, kh\xF4ng l\u1ED7i font.

Th\xF4ng tin b\xE0i ki\u1EC3m tra:
- Kh\u1ED1i l\u1EDBp: L\u1EDBp ${grade}
- H\u1ECDc k\u1EF3: ${term || "Gi\u1EEFa k\u1EF3 I"}
- N\u0103m h\u1ECDc: ${academicYear || "2023-2024"}
- Th\u1EDDi gian l\xE0m b\xE0i: ${grade === 6 ? 60 : 90} ph\xFAt
- C\xE1c Unit tr\u1ECDng t\xE2m:
${selectedUnitsInfo}
- M\u1EE9c \u0111\u1ED9 kh\xF3: ${difficulty}
${customPrompt ? `- Y\xEAu c\u1EA7u b\u1ED5 sung: ${customPrompt}` : ""}

C\u1EA4U TR\xDAC \u0110\u1EC0 B\u1EAET BU\u1ED8C (8 Ph\u1EA7n):
- Part 1. Listening 1 (5 c\xE2u - 1.25\u0111): True/False ho\u1EB7c A/B/C.
- Part 2. Listening 2 (5 c\xE2u - 1.25\u0111): Ch\u1ECDn A, B ho\u1EB7c C.
- Part 3. Language Focus (12 c\xE2u - 3\u0111): Ch\u1ECDn A, B ho\u1EB7c C.
- Part 4. Reading 1 (5 c\xE2u - 1.25\u0111): \u0110i\u1EC1n t\u1EEB v\xE0o ch\u1ED7 tr\u1ED1ng, ch\u1ECDn A, B ho\u1EB7c C. (\u0110o\u1EA1n 150-180 t\u1EEB)
- Part 5. Reading 2 (5 c\xE2u - 1.25\u0111): \u0110\u1ECDc hi\u1EC3u ch\u1ECDn A, B ho\u1EB7c C. (\u0110o\u1EA1n 150-180 t\u1EEB)
- Part 6. Sentence transformation / closest meaning (2 c\xE2u - 0.5\u0111): Ch\u1ECDn A, B ho\u1EB7c C.
- Part 7. Reorder words/phrases (2 c\xE2u - 0.5\u0111): Ch\u1ECDn A, B ho\u1EB7c C.
- Part 8. Writing (1 c\xE2u - 1\u0111): Vi\u1EBFt \u0111o\u1EA1n v\u0103n 80-100 t\u1EEB c\xF3 g\u1EE3i \xFD.

MA TR\u1EACN B\u1EAET BU\u1ED8C: Nghe 25%, \u0110\u1ECDc 25%, Ng\xF4n ng\u1EEF 30%, Vi\u1EBFt 20%. M\u1EE9c \u0111\u1ED9: Bi\u1EBFt 40%, Hi\u1EC3u 30%, V\u1EADn d\u1EE5ng 30%.
T\u1EA5t c\u1EA3 c\xE2u tr\u1EAFc nghi\u1EC7m \u0111\u1EC1u ch\u1EC9 c\xF3 T\u1ED0I \u0110A 3 \u0111\xE1p \xE1n: A, B, C. \u0110\xE1nh s\u1ED1 c\xE2u li\xEAn t\u1EE5c t\u1EEB 1 \u0111\u1EBFn 36. C\xE2u Writing l\xE0 ph\u1EA7n cu\u1ED1i, kh\xF4ng \u0111\xE1nh s\u1ED1 tr\u1EAFc nghi\u1EC7m.
KH\xD4NG t\u1EA1o \u0111\xE1p \xE1n D.

\u0110\u1ECBnh d\u1EA1ng k\u1EBFt qu\u1EA3 tr\u1EA3 v\u1EC1 ph\u1EA3i l\xE0 m\u1ED9t JSON ho\xE0n h\u1EA3o tu\xE2n th\u1EE7 schema sau:
{
  "title": "T\xEAn \u0111\u1EC1 thi (v\xED d\u1EE5: \u0110\u1EC0 KI\u1EC2M TRA GI\u1EEEA H\u1ECCC K\xCC I - TI\u1EBENG ANH L\u1EDAP ${grade})",
  "grade": ${grade},
  "term": "${term || "Gi\u1EEFa k\u1EF3 I"}",
  "academicYear": "${academicYear || "2023-2024"}",
  "testType": "${testType}",
  "duration": ${grade === 6 ? 60 : 90},
  "totalQuestions": 37,
  "parts": [
    {
      "title": "T\xEAn ph\u1EA7n (v\xED d\u1EE5: Part 1. Listening 1)",
      "instruction": "Y\xEAu c\u1EA7u c\u1EE7a ph\u1EA7n thi",
      "questions": [
        {
          "id": "1",
          "questionText": "N\u1ED9i dung c\xE2u h\u1ECFi (ch\u1EC9 c\xF3 3 l\u1EF1a ch\u1ECDn A, B, C)",
          "options": ["A. ...", "B. ...", "C. ..."],
          "correctAnswer": "A",
          "explanation": "Gi\u1EA3i th\xEDch chi ti\u1EBFt",
          "difficulty": "Nh\u1EADn bi\u1EBFt",
          "topic": "Ch\u1EE7 \u0111\u1EC1"
        }
      ]
    }
  ],
  "matrixData": "N\u1ED9i dung b\u1EA3ng ma tr\u1EADn chi ti\u1EBFt d\u01B0\u1EDBi d\u1EA1ng Markdown, kh\u1EDBp v\u1EDBi t\u1EC9 l\u1EC7 y\xEAu c\u1EA7u",
  "specData": "N\u1ED9i dung b\u1EA3ng \u0111\u1EB7c t\u1EA3 chi ti\u1EBFt d\u01B0\u1EDBi d\u1EA1ng Markdown",
  "transcripts": "N\u1ED9i dung transcript cho Part 1 v\xE0 Part 2",
  "writingRubric": "G\u1EE3i \xFD b\xE0i vi\u1EBFt m\u1EABu 80-100 t\u1EEB v\xE0 Rubric ch\u1EA5m \u0111i\u1EC3m cho b\xE0i vi\u1EBFt"
}

H\xE3y tr\u1EA3 v\u1EC1 duy nh\u1EA5t chu\u1ED7i JSON h\u1EE3p l\u1EC7. Kh\xF4ng bao g\u1ED3m b\u1EA5t k\u1EF3 ph\u1EA7n text gi\u1EDBi thi\u1EC7u hay d\u1EA5u nh\xE1y \`\`\`json \u1EDF ngo\xE0i.`;
}
async function callGeminiAI(prompt, customApiKey, selectedModel, modelIndex = 0) {
  const keyToUse = customApiKey || process.env.GEMINI_API_KEY;
  if (!keyToUse || keyToUse === "MY_GEMINI_API_KEY") {
    throw new Error("Kh\xF4ng t\xECm th\u1EA5y API Key. Vui l\xF2ng c\u1EA5u h\xECnh API Key trong m\u1EE5c c\xE0i \u0111\u1EB7t (Header) ho\u1EB7c h\u1EC7 th\u1ED1ng.");
  }
  const modelToUse = selectedModel && MODELS.includes(selectedModel) ? selectedModel : MODELS[modelIndex];
  try {
    const ai = new import_genai.GoogleGenAI({
      apiKey: keyToUse,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
    const response = await ai.models.generateContent({
      model: modelToUse,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7
      }
    });
    const responseText = response.text;
    if (!responseText) {
      throw new Error("M\xF4 h\xECnh Gemini kh\xF4ng tr\u1EA3 v\u1EC1 d\u1EEF li\u1EC7u.");
    }
    const parsed = JSON.parse(responseText.trim());
    return { data: parsed, modelUsed: modelToUse };
  } catch (error) {
    console.error(`Error calling ${modelToUse}:`, error);
    if (error.message?.includes("API key") || error.status === 401 || error.status === 403) {
      throw new Error("API Key kh\xF4ng h\u1EE3p l\u1EC7 ho\u1EB7c kh\xF4ng c\xF3 quy\u1EC1n truy c\u1EADp. Vui l\xF2ng ki\u1EC3m tra l\u1EA1i.");
    }
    if (!selectedModel && modelIndex < MODELS.length - 1) {
      console.log(`Falling back to next model: ${MODELS[modelIndex + 1]}`);
      return callGeminiAI(prompt, customApiKey, void 0, modelIndex + 1);
    }
    throw error;
  }
}
app.post("/api/generate-test", async (req, res) => {
  const { grade, units, testType, difficulty, customPrompt, apiKey, selectedModel, term, academicYear } = req.body;
  if (!grade || !units || !Array.isArray(units) || units.length === 0 || !testType || !difficulty) {
    return res.status(400).json({ error: "Thi\u1EBFu th\xF4ng tin y\xEAu c\u1EA7u t\u1EA1o \u0111\u1EC1 thi." });
  }
  try {
    const prompt = createTestPrompt(grade, units, testType, difficulty, customPrompt, term, academicYear);
    const result = await callGeminiAI(prompt, apiKey, selectedModel);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message || "\u0110\xE3 x\u1EA3y ra l\u1ED7i khi t\u1EA1o \u0111\u1EC1 thi b\u1EB1ng AI." });
  }
});
app.post("/api/chat-tutor", async (req, res) => {
  const { message, contextExam, apiKey, selectedModel } = req.body;
  if (!message) {
    return res.status(400).json({ error: "N\u1ED9i dung tin nh\u1EAFn kh\xF4ng \u0111\u01B0\u1EE3c \u0111\u1EC3 tr\u1ED1ng." });
  }
  try {
    const systemInstruction = `B\u1EA1n l\xE0 Tr\u1EE3 l\xFD Gi\xE1o vi\xEAn Ti\u1EBFng Anh THCS th\xF4ng th\xE1i (AI Tutor) c\u1EE7a \u1EE9ng d\u1EE5ng SmartTest Global Success.
Nhi\u1EC7m v\u1EE5 c\u1EE7a b\u1EA1n l\xE0 gi\u1EA3i \u0111\xE1p t\u1EA5t c\u1EA3 c\xE1c th\u1EAFc m\u1EAFc v\u1EC1 t\u1EEB v\u1EF1ng, ng\u1EEF ph\xE1p, ng\u1EEF \xE2m ti\u1EBFng Anh t\u1EEB l\u1EDBp 6 \u0111\u1EBFn l\u1EDBp 9 theo ch\u01B0\u01A1ng tr\xECnh Global Success.
H\xE3y tr\u1EA3 l\u1EDDi m\u1ED9t c\xE1ch l\u1ECBch s\u1EF1, d\u1EC5 hi\u1EC3u, c\xF3 v\xED d\u1EE5 minh h\u1ECDa sinh \u0111\u1ED9ng v\xE0 s\u1EED d\u1EE5ng ti\u1EBFng Vi\u1EC7t l\xE0m ng\xF4n ng\u1EEF ph\u1EA3n h\u1ED3i ch\xEDnh.
${contextExam ? `Ng\u01B0\u1EDDi d\xF9ng \u0111ang xem \u0111\u1EC1 thi c\xF3 ti\xEAu \u0111\u1EC1 "${contextExam.title}". H\xE3y h\u1ED7 tr\u1EE3 h\u1ECD gi\u1EA3i th\xEDch ho\u1EB7c s\u1EEDa \u0111\u1ED5i \u0111\u1EC1 thi n\xE0y n\u1EBFu \u0111\u01B0\u1EE3c y\xEAu c\u1EA7u.` : ""}`;
    const keyToUse = apiKey || process.env.GEMINI_API_KEY;
    const modelToUse = selectedModel && MODELS.includes(selectedModel) ? selectedModel : "gemini-3.5-flash";
    const ai = new import_genai.GoogleGenAI({
      apiKey: keyToUse,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
    const response = await ai.models.generateContent({
      model: modelToUse,
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });
    res.json({ text: response.text });
  } catch (error) {
    res.status(500).json({ error: error.message || "\u0110\xE3 x\u1EA3y ra l\u1ED7i khi giao ti\u1EBFp v\u1EDBi AI Tutor." });
  }
});
app.post("/api/analyze-matrix", async (req, res) => {
  const { fileName, fileContent, grade, testType, apiKey, selectedModel } = req.body;
  if (!fileContent) {
    return res.status(400).json({ error: "N\u1ED9i dung file kh\xF4ng \u0111\u01B0\u1EE3c \u0111\u1EC3 tr\u1ED1ng." });
  }
  try {
    const prompt = `B\u1EA1n l\xE0 Chuy\xEAn gia Kh\u1EA3o th\xED Ti\u1EBFng Anh THCS. D\u01B0\u1EDBi \u0111\xE2y l\xE0 n\u1ED9i dung c\u1EE7a file \u0111\u1EB7c t\u1EA3 ma tr\u1EADn \u0111\u1EC1 thi ho\u1EB7c \u0111\u1EC1 m\u1EABu m\xE0 gi\xE1o vi\xEAn t\u1EA3i l\xEAn:
T\xEAn file: ${fileName}
N\u1ED9i dung file:
"""
${fileContent}
"""

D\u1EF1a v\xE0o n\u1ED9i dung t\xE0i li\u1EC7u tr\xEAn k\u1EBFt h\u1EE3p v\u1EDBi ch\u01B0\u01A1ng tr\xECnh Global Success L\u1EDBp ${grade || 6}, h\xE3y so\u1EA1n th\u1EA3o m\u1ED9t \u0110\u1EC0 THI TI\u1EBENG ANH ho\xE0n to\xE0n t\u01B0\u01A1ng \u0111\u01B0\u01A1ng b\xE1m s\xE1t 100% y\xEAu c\u1EA7u v\u1EC1 ph\xE2n b\u1ED5 c\xE2u h\u1ECFi, ki\u1EBFn th\u1EE9c v\xE0 \u0111\u1ECBnh d\u1EA1ng c\xF3 trong file tr\xEAn.

\u0110\u1EA3m b\u1EA3o:
1. T\u1EA5t c\u1EA3 t\u1EEB v\u1EF1ng/ng\u1EEF ph\xE1p b\xE1m s\xE1t L\u1EDBp ${grade || 6}.
2. Bi\xEAn so\u1EA1n \u0111\u1EA7y \u0111\u1EE7 c\xE2u h\u1ECFi v\xE0 c\xF3 ph\u1EA7n gi\u1EA3i th\xEDch \u0111\xE1p \xE1n chi ti\u1EBFt b\u1EB1ng ti\u1EBFng Vi\u1EC7t.
3. Tr\u1EA3 v\u1EC1 \u0111\xFAng \u0111\u1ECBnh d\u1EA1ng JSON ho\xE0n h\u1EA3o tu\xE2n th\u1EE7 schema sau \u0111\xE2y:
{
  "title": "T\xEAn \u0111\u1EC1 thi \u0111\u01B0\u1EE3c bi\xEAn so\u1EA1n b\xE1m s\xE1t t\xE0i li\u1EC7u \u0111\u1EB7c t\u1EA3 (v\xED d\u1EE5: \u0110\u1EC0 KI\u1EC2M TRA TI\u1EBENG ANH L\u1EDAP 6 THEO MA TR\u1EACN \u0110\u1EB6C T\u1EA2)",
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
          "explanation": "Gi\u1EA3i th\xEDch chi ti\u1EBFt...",
          "difficulty": "Nh\u1EADn bi\u1EBFt",
          "topic": "Ng\u1EEF \xE2m"
        }
      ]
    }
  ]
}

Tr\u1EA3 v\u1EC1 duy nh\u1EA5t JSON h\u1EE3p l\u1EC7, kh\xF4ng ch\u1EE9a k\xFD t\u1EF1 markdown hay v\u0103n b\u1EA3n r\xE1c ngo\xE0i JSON.`;
    const result = await callGeminiAI(prompt, apiKey, selectedModel);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message || "\u0110\xE3 x\u1EA3y ra l\u1ED7i khi ph\xE2n t\xEDch file b\u1EB1ng AI." });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SmartTest Global Success] Server started at http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
